using SmartFM.Domain.Enums;

namespace SmartFM.Domain.Entities;

public class DeliveryException
{
    public Guid Id { get; set; }
    public ExceptionType Type { get; set; }
    public ExceptionStatus Status { get; set; } = ExceptionStatus.Open;
    public string Description { get; set; } = string.Empty;
    public string? ResolutionAction { get; set; }

    public DateTime RaisedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public Guid? ResolvedByUserId { get; private set; }

    public Guid ShipmentId { get; set; }
    public Shipment Shipment { get; set; } = null!;

    public void Resolve(string resolutionAction, Guid resolvedByUserId)
    {
        ResolutionAction = resolutionAction;
        ResolvedByUserId = resolvedByUserId;
        ResolvedAt = DateTime.UtcNow;
        Status = ExceptionStatus.Resolved;
    }
}
