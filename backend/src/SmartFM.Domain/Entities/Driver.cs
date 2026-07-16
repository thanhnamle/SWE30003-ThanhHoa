namespace SmartFM.Domain.Entities;

public class Driver
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public DateTime LicenseExpiryDate { get; set; }
    public int MaxWeeklyHours { get; set; } = 48;
    public bool IsOnLeave { get; set; }
    public DateTime CreatedAt { get; set; }

    public Guid BranchId { get; set; }
    public Branch Branch { get; set; } = null!;

    public ICollection<DriverAssignment> Assignments { get; set; } = new List<DriverAssignment>();
}