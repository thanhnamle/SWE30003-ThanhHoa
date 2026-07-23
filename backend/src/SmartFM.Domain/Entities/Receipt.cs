namespace SmartFM.Domain.Entities;

public class Receipt
{
    public Guid Id { get; init; }
    public decimal SettledAmount { get; init; }
    public DateTime IssuedAt { get; init; }
    public string TransactionReference { get; init; } = string.Empty;

    public Guid PaymentId { get; init; }
    public Payment Payment { get; init; } = null!;
}