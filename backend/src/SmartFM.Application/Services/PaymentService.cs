using System;
using System.Threading.Tasks;
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

    public async Task<ReceiptResponseDto> ProcessPaymentAsync(Guid invoiceId, ProcessPaymentDto request)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(invoiceId);

        if (invoice == null) throw new BusinessRuleException("Invoice not found.");

        if (invoice.Status == InvoiceStatus.Paid)
        {
            throw new BusinessRuleException("Invoice has already been paid.");
        }

        if (request.Amount < invoice.Amount)
        {
            throw new BusinessRuleException("Payment amount is insufficient for invoice.");
        }

        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            InvoiceId = invoiceId,
            Amount = request.Amount,
            Method = request.Method,
            Status = PaymentStatus.Success,
            AttemptedAt = DateTime.UtcNow
        };
        await _paymentRepository.AddAsync(payment);

        var receipt = new Receipt
        {
            Id = Guid.NewGuid(),
            PaymentId = payment.Id,
            SettledAmount = request.Amount,
            IssuedAt = DateTime.UtcNow,
            TransactionReference = $"REC-{Guid.NewGuid().ToString()[..8].ToUpper()}"
        };
        await _receiptRepository.AddAsync(receipt);

        invoice.Status = InvoiceStatus.Paid;
        await _invoiceRepository.UpdateAsync(invoice);

        return new ReceiptResponseDto
        {
            Id = receipt.Id,
            PaymentId = payment.Id,
            SettledAmount = receipt.SettledAmount,
            TransactionReference = receipt.TransactionReference,
            IssuedAt = receipt.IssuedAt
        };
    }
}
