using SmartFM.Domain.Enums;

namespace SmartFM.Domain.Entities;

public class Shipment
{
    public Guid Id { get; set; }
    public ShipmentStatus Status { get; set; } = ShipmentStatus.Preparing;

    public DateTime CreatedAt { get; set; }
    public DateTime? ReadyForPickupAt { get; set; }
    public DateTime? DeliveredAt { get; set; }

    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public VehicleAssignment? VehicleAssignment { get; set; }
    public DriverAssignment? DriverAssignment { get; set; }
    public PickupDeliveryOption? PickupDeliveryOption { get; set; }
}