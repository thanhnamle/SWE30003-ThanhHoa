using SmartFM.Domain.Enums;

namespace SmartFM.Domain.Entities;

public class TransportOffering
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TransportCategory Category { get; set; }
    public decimal MaxCapacityKg { get; set; }
    public decimal BaseFee { get; set; }
    public decimal FeePerKm { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}