using SmartFM.Application.DTOs.Payments;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;
using SmartFM.Domain.Exceptions;
using SmartFM.Domain.Interfaces;

namespace SmartFM.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IRepository<Invoice> _invoiceRepository;
    private readonly IRepository<Payment> _paymentRepository;
    private readonly IRepository<Receipt> _receiptRepository;

    public PaymentService(
        IRepository<Invoice> invoiceRepository,
        IRepository<Payment> paymentRepository,
        IRepository<Receipt> receiptRepository)
    {
        _invoiceRepository = invoiceRepository;
        _paymentRepository = paymentRepository;
        _receiptRepository = receiptRepository;
    }

    public async Task<PaymentResponseDto> ProcessPaymentAsync(Guid invoiceId, ProcessPaymentDto request)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(invoiceId);
        
        if (invoice == null) throw new BusinessRuleException("Không tìm thấy Hóa đơn.");

        // --- BUSINESS RULES VALIDATION ---
        
        // Cấm thanh toán nếu Hóa đơn đã thanh toán (Chống Duplicate Payment)
        if (invoice.Status == InvoiceStatus.Paid)
        {
            throw new BusinessRuleException("Hóa đơn này đã được thanh toán hoàn tất, không thể thanh toán lại!");
        }

        // Kiểm tra số tiền thanh toán (Ví dụ cơ bản: phải trả đủ tiền)
        if (request.Amount < invoice.Amount)
        {
            throw new BusinessRuleException("Số tiền thanh toán không đủ so với giá trị hóa đơn.");
        }

        // --- APPLY LOGIC ---

        // 1. Tạo bản ghi Thanh toán (Payment)
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            InvoiceId = invoiceId,
            Amount = request.Amount,
            Method = request.Method,
            Status = PaymentStatus.Success,
            AttemptedAt = DateTime.UtcNow
        };

        // 2. Tạo Biên lai bất biến (Receipt)
        var receipt = new Receipt
        {
            Id = Guid.NewGuid(),
            PaymentId = payment.Id,
            SettledAmount = request.Amount,
            TransactionReference = $"TRX-{DateTime.UtcNow.Ticks}",
            IssuedAt = DateTime.UtcNow
        };

        // 3. Cập nhật trạng thái Hóa đơn
        invoice.Status = InvoiceStatus.Paid;

        // Lưu toàn bộ xuống Database
        await _paymentRepository.AddAsync(payment);
        await _receiptRepository.AddAsync(receipt);
        await _invoiceRepository.UpdateAsync(invoice);

        return new PaymentResponseDto
        {
            PaymentId = payment.Id,
            ReceiptId = receipt.Id,
            Status = payment.Status,
            Message = "Thanh toán thành công và Biên lai đã được xuất!"
        };
    }
}
