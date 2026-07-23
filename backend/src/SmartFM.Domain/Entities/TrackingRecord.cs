namespace SmartFM.Domain.Entities;

public class TrackingRecord
{
    public Guid Id { get; init; }
    public DateTime Timestamp { get; init; }
    public string Location { get; init; } = string.Empty;
    public string StatusNote { get; init; } = string.Empty;

    public Guid ShipmentId { get; init; }
    public Shipment Shipment { get; init; } = null!;
}