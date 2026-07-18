using SmartFM.Application.DTOs.Payments;

namespace SmartFM.Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponseDto> ProcessPaymentAsync(Guid invoiceId, ProcessPaymentDto request);
}
