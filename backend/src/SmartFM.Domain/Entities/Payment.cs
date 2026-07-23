using SmartFM.Domain.Enums;

namespace SmartFM.Domain.Entities;

public class Payment
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public DateTime AttemptedAt { get; set; }

    public Guid InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = null!;

    public Receipt? Receipt { get; set; }
}