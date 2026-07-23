namespace SmartFM.Application.DTOs.Orders;

public class CreateOrderDto
{
    public Guid CustomerId { get; set; }
    public Guid BranchId { get; set; }
    public Guid TransportOfferingId { get; set; }
    public decimal CargoWeightKg { get; set; }
    public decimal CargoVolumeM3 { get; set; }
    public string SpecialHandlingNotes { get; set; } = string.Empty;
}
