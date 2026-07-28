using System;

namespace SmartFM.Domain.Entities;

public class ProofOfDelivery
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid ShipmentId { get; init; }
    public string ReceivedByName { get; init; } = string.Empty;
    public string? Notes { get; init; }
    public string? ProofImageUrl { get; init; }
    public DateTime RecordedAt { get; init; } = DateTime.UtcNow;

    // Navigation property
    public Shipment? Shipment { get; init; }
}
