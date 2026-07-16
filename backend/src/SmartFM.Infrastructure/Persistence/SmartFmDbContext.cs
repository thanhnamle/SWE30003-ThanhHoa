using Microsoft.EntityFrameworkCore;
using SmartFM.Domain.Entities;

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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SmartFmDbContext).Assembly);
    }
}
