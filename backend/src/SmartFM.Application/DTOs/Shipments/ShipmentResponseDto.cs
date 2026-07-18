using SmartFM.Domain.Enums;

namespace SmartFM.Application.DTOs.Shipments;

public class ShipmentResponseDto
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public ShipmentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Message { get; set; } = string.Empty;
}
