using Microsoft.EntityFrameworkCore;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.Infrastructure.Persistence;

public class SmartFmDbContext : DbContext
{
    public SmartFmDbContext(DbContextOptions<SmartFmDbContext> options) : base(options)
    {
    }

    public DbSet<Branch> Branches => Set<Branch>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<Driver> Drivers => Set<Driver>();
    public DbSet<TransportOffering> TransportOfferings => Set<TransportOffering>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Shipment> Shipments => Set<Shipment>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<VehicleAssignment> VehicleAssignments => Set<VehicleAssignment>();
    public DbSet<DriverAssignment> DriverAssignments => Set<DriverAssignment>();
    public DbSet<PickupDeliveryOption> PickupDeliveryOptions => Set<PickupDeliveryOption>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Receipt> Receipts => Set<Receipt>();
    public DbSet<TrackingRecord> TrackingRecords => Set<TrackingRecord>();
    public DbSet<DeliveryException> DeliveryExceptions => Set<DeliveryException>();
    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<AppNotification> AppNotifications => Set<AppNotification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SmartFmDbContext).Assembly);

        SeedReferenceData(modelBuilder);
        SeedUsers(modelBuilder);
        SeedNotifications(modelBuilder);
    }

    private static void SeedReferenceData(ModelBuilder modelBuilder)
    {
        var branchId = Guid.Parse("11111111-1111-1111-1111-111111111111");

        modelBuilder.Entity<Branch>().HasData(new Branch
        {
            Id = branchId,
            Name = "Ho Chi Minh City Branch",
            Region = "South",
            Address = "123 Nguyen Van Linh, District 7",
            ContactPhone = "028-1234-5678",
            CreatedAt = new DateTime(2026, 1, 1)
        });

        modelBuilder.Entity<Vehicle>().HasData(new Vehicle
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            PlateNumber = "51A-123.45",
            Type = VehicleType.Truck,
            MaxPayloadKg = 5000,
            MaxVolumeM3 = 20,
            IsUnderMaintenance = false,
            CreatedAt = new DateTime(2026, 1, 1),
            BranchId = branchId
        });

        modelBuilder.Entity<Driver>().HasData(new Driver
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            FullName = "Nguyen Van A",
            LicenseNumber = "C-998877",
            LicenseExpiryDate = new DateTime(2028, 1, 1),
            MaxWeeklyHours = 48,
            IsOnLeave = false,
            CreatedAt = new DateTime(2026, 1, 1),
            BranchId = branchId
        });

        modelBuilder.Entity<TransportOffering>().HasData(new TransportOffering
        {
            Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
            Name = "Standard Freight",
            Description = "Standard truck freight service",
            Category = TransportCategory.Standard,
            MaxCapacityKg = 5000,
            BaseFee = 500000,
            FeePerKm = 15000,
            IsActive = true,
            CreatedAt = new DateTime(2026, 1, 1)
        });
    }

    private static void SeedUsers(ModelBuilder modelBuilder)
    {
        // Default admin – password: Admin123!
        modelBuilder.Entity<AppUser>().HasData(new AppUser
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
            FullName = "System Administrator",
            Email = "admin@smartfm.vn",
            PasswordHash = "$2a$11$K9lZlSHAf.vn5SZ1fU5eyuG7GZKF4PKV4qpBKGb2WkU0.JIwNRmxu", // Admin123!
            Role = "Admin",
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });
    }

    private static void SeedNotifications(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppNotification>().HasData(
            new AppNotification
            {
                Id = Guid.Parse("50000000-0000-0000-0000-000000000001"),
                Title = "New Order Created",
                Message = "Samsung Electronics placed a new freight order.",
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddMinutes(-2),
                Type = "Order"
            },
            new AppNotification
            {
                Id = Guid.Parse("50000000-0000-0000-0000-000000000002"),
                Title = "Shipment Delayed",
                Message = "SHP-9022 is delayed due to heavy traffic conditions.",
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddHours(-1),
                Type = "Alert"
            },
            new AppNotification
            {
                Id = Guid.Parse("50000000-0000-0000-0000-000000000003"),
                Title = "Payment Received",
                Message = "Invoice INV-2026-114 has been successfully paid.",
                IsRead = true,
                CreatedAt = DateTime.UtcNow.AddHours(-5),
                Type = "Payment"
            }
        );
    }
}
