using System;

namespace SmartFM.Application.DTOs.Tracking;

public class DeliveryExceptionDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ResolutionAction { get; set; }
    public DateTime RaisedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public Guid ShipmentId { get; set; }
}
