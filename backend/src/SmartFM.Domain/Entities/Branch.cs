namespace SmartFM.Domain.Entities;

public class Branch
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
    public ICollection<Driver> Drivers { get; set; } = new List<Driver>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}