using System;

namespace SmartFM.Application.DTOs.Payments;

public class ReceiptResponseDto
{
    public Guid Id { get; set; }
    public Guid PaymentId { get; set; }
    public decimal SettledAmount { get; set; }
    public string TransactionReference { get; set; } = string.Empty;
    public DateTime IssuedAt { get; set; }
}
