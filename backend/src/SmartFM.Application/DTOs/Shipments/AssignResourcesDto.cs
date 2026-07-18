namespace SmartFM.Application.DTOs.Shipments;

public class AssignResourcesDto
{
    public Guid VehicleId { get; set; }
    public Guid DriverId { get; set; }
    public string? ConflictNotes { get; set; }
}
