using SmartFM.Domain.Enums;

namespace SmartFM.Application.DTOs.Shipments;

public class ShipmentResponseDto
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public ShipmentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Message { get; set; } = string.Empty;

    public VehicleAssignmentDto? VehicleAssignment { get; set; }
    public DriverAssignmentDto? DriverAssignment { get; set; }
    public ShipmentOrderDto? Order { get; set; }
    public PickupDeliveryOptionDto? PickupDeliveryOption { get; set; }
}

public class PickupDeliveryOptionDto
{
    public string PickupAddress { get; set; } = string.Empty;
    public DateTime PickupWindowStart { get; set; }
    public DateTime PickupWindowEnd { get; set; }
    public string DeliveryAddress { get; set; } = string.Empty;
    public DateTime DeliveryWindowStart { get; set; }
    public DateTime DeliveryWindowEnd { get; set; }
}

public class VehicleAssignmentDto
{
    public Guid VehicleId { get; set; }
    public string VehiclePlate { get; set; } = string.Empty;
    public string VehicleType { get; set; } = string.Empty;
}

public class DriverAssignmentDto
{
    public Guid DriverId { get; set; }
    public string DriverName { get; set; } = string.Empty;
}

public class ShipmentOrderDto
{
    public decimal CargoWeightKg { get; set; }
    public decimal CargoVolumeM3 { get; set; }
    public string SpecialHandlingNotes { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string ServiceCategory { get; set; } = string.Empty;
}
