using SmartFM.Domain.Enums;

namespace SmartFM.Domain.Entities;

public class DriverAssignment
{
    public Guid Id { get; set; }
    public AssignmentStatus Status { get; set; } = AssignmentStatus.Proposed;
    public DateTime AssignedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? ConflictNotes { get; set; }

    public Guid ShipmentId { get; set; }
    public Shipment Shipment { get; set; } = null!;

    public Guid DriverId { get; set; }
    public Driver Driver { get; set; } = null!;
}