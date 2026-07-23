using SmartFM.Domain.Enums;

namespace SmartFM.Application.DTOs.Shipments;

public class UpdateShipmentStatusDto
{
    public ShipmentStatus Status { get; set; }
}
