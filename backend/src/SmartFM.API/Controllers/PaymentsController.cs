using Microsoft.AspNetCore.Mvc;
using SmartFM.Application.DTOs.Payments;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Interfaces;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly IRepository<Invoice> _invoiceRepository;
    private readonly IRepository<Receipt> _receiptRepository;

    public PaymentsController(
        IPaymentService paymentService,
        IRepository<Invoice> invoiceRepository,
        IRepository<Receipt> receiptRepository)
    {
        _paymentService = paymentService;
        _invoiceRepository = invoiceRepository;
        _receiptRepository = receiptRepository;
    }

    /// <summary>GET /api/payments/invoices – list all invoices</summary>
    [HttpGet("invoices")]
    public async Task<IActionResult> GetInvoices()
    {
        var invoices = await _invoiceRepository.GetAllAsync();
        var result = invoices.Select(i => new
        {
            i.Id,
            i.OrderId,
            i.Amount,
            Status = i.Status.ToString(),
            i.IssuedAt
        });
        return Ok(result);
    }

    /// <summary>GET /api/payments/receipts – list all receipts</summary>
    [HttpGet("receipts")]
    public async Task<IActionResult> GetReceipts()
    {
        var receipts = await _receiptRepository.GetAllAsync();
        var result = receipts.Select(r => new
        {
            r.Id,
            r.PaymentId,
            r.SettledAmount,
            r.TransactionReference,
            r.IssuedAt
        });
        return Ok(result);
    }

    /// <summary>POST /api/payments/invoice/{invoiceId} – process payment for an invoice</summary>
    [HttpPost("invoice/{invoiceId:guid}")]
    public async Task<IActionResult> ProcessPayment(Guid invoiceId, [FromBody] ProcessPaymentDto request)
    {
        var result = await _paymentService.ProcessPaymentAsync(invoiceId, request);
        return Ok(result);
    }
}
