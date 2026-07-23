namespace SmartFM.Domain.Entities;

public class PickupDeliveryOption
{
    public Guid Id { get; set; }

    public string PickupAddress { get; set; } = string.Empty;
    public DateTime PickupWindowStart { get; set; }
    public DateTime PickupWindowEnd { get; set; }

    public string DeliveryAddress { get; set; } = string.Empty;
    public string DeliveryContactName { get; set; } = string.Empty;
    public string DeliveryContactPhone { get; set; } = string.Empty;
    public DateTime DeliveryWindowStart { get; set; }
    public DateTime DeliveryWindowEnd { get; set; }

    public Guid ShipmentId { get; set; }
    public Shipment Shipment { get; set; } = null!;
}