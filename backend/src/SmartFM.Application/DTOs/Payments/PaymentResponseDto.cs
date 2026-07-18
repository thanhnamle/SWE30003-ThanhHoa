using SmartFM.Domain.Enums;

namespace SmartFM.Application.DTOs.Payments;

public class PaymentResponseDto
{
    public Guid PaymentId { get; set; }
    public Guid ReceiptId { get; set; }
    public PaymentStatus Status { get; set; }
    public string Message { get; set; } = string.Empty;
}
