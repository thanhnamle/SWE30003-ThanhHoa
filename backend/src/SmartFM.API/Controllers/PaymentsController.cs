using Microsoft.AspNetCore.Mvc;
using SmartFM.Application.DTOs.Payments;
using SmartFM.Application.Interfaces;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    // Endpoint: POST /api/payments/invoice/{invoiceId}
    [HttpPost("invoice/{invoiceId:guid}")]
    public async Task<IActionResult> ProcessPayment(Guid invoiceId, [FromBody] ProcessPaymentDto request)
    {
        var result = await _paymentService.ProcessPaymentAsync(invoiceId, request);
        
        return Ok(result);
    }
}
