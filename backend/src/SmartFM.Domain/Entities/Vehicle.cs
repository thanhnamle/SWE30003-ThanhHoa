using SmartFM.Domain.Enums;

namespace SmartFM.Domain.Entities;

public class Vehicle
{
    public Guid Id { get; set; }
    public string PlateNumber { get; set; } = string.Empty;
    public VehicleType Type { get; set; }
    public decimal MaxPayloadKg { get; set; }
    public decimal MaxVolumeM3 { get; set; }
    public bool IsUnderMaintenance { get; set; }
    public DateTime? MaintenanceUntil { get; set; }
    public DateTime CreatedAt { get; set; }

    public Guid BranchId { get; set; }
    public Branch Branch { get; set; } = null!;

    public ICollection<VehicleAssignment> Assignments { get; set; } = new List<VehicleAssignment>();
}