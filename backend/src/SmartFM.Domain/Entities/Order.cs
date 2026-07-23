using SmartFM.Domain.Enums;

namespace SmartFM.Domain.Entities;

public class Order
{
    public Guid Id { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public decimal CargoWeightKg { get; set; }
    public decimal CargoVolumeM3 { get; set; }
    public string SpecialHandlingNotes { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime? ValidatedAt { get; set; }
    public DateTime? CancelledAt { get; set; }

    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    public Guid BranchId { get; set; }
    public Branch Branch { get; set; } = null!;

    public Guid TransportOfferingId { get; set; }
    public TransportOffering TransportOffering { get; set; } = null!;

    public Shipment? Shipment { get; set; }
    public Invoice? Invoice { get; set; }
}