namespace SmartFM.Domain.Entities;

public class AppUser
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    /// <summary>BCrypt hashed password</summary>
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Customer"; // Admin | OperationsManager | BranchStaff | Customer
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
