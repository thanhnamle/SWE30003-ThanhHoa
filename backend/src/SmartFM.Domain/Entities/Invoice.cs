using SmartFM.Domain.Enums;

namespace SmartFM.Domain.Entities;

public class Invoice
{
    public Guid Id { get; set; }
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Unpaid;
    public decimal Amount { get; set; }
    public DateTime IssuedAt { get; set; }

    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
}