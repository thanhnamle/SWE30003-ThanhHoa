using SmartFM.Domain.Enums;

namespace SmartFM.Domain.Entities;

public class VehicleAssignment
{
    public Guid Id { get; set; }
    public AssignmentStatus Status { get; set; } = AssignmentStatus.Proposed;
    public DateTime AssignedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }

    public Guid ShipmentId { get; set; }
    public Shipment Shipment { get; set; } = null!;

    public Guid VehicleId { get; set; }
    public Vehicle Vehicle { get; set; } = null!;
}