using SmartFM.Domain.Enums;

namespace SmartFM.Application.DTOs.Orders;

public class OrderResponseDto
{
    public Guid Id { get; set; }
    public OrderStatus Status { get; set; }
    public decimal CargoWeightKg { get; set; }
    public decimal CargoVolumeM3 { get; set; }
    public string SpecialHandlingNotes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
