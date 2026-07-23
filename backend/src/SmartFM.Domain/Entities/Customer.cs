namespace SmartFM.Domain.Entities;

public class Customer
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public bool IsCorporateAccount { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}