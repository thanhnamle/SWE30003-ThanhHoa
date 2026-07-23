using SmartFM.Domain.Enums;

namespace SmartFM.Application.DTOs.Payments;

public class ProcessPaymentDto
{
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
}
