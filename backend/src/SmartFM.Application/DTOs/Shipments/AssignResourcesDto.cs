namespace SmartFM.Application.DTOs.Shipments;

public class AssignResourcesDto
{
    public Guid VehicleId { get; set; }
    public Guid DriverId { get; set; }
    public string? ConflictNotes { get; set; }
    public string? PickupAddress { get; set; }
    public string? DeliveryAddress { get; set; }
    public string? PickupWindowStart { get; set; }
    public string? PickupWindowEnd { get; set; }
    public string? DeliveryWindowStart { get; set; }
    public string? DeliveryWindowEnd { get; set; }
}
