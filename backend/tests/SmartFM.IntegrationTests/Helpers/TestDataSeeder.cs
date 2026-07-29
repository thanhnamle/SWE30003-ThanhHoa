using System;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;
using SmartFM.Infrastructure.Persistence;

namespace SmartFM.IntegrationTests.Helpers;

/// <summary>
/// Helper class to seed static reference and test data into the InMemory database,
/// avoiding conflicts with data already seeded by the DbContext's OnModelCreating
/// and respecting entity relationships (like one-to-one Order to Invoice).
/// </summary>
public static class TestDataSeeder
{
    // Referenced from DbContext OnModelCreating seed data
    public static readonly Guid BranchId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    public static readonly Guid VehicleAvailableId = Guid.Parse("22222222-2222-2222-2222-222222222222");
    public static readonly Guid DriverAvailableId = Guid.Parse("33333333-3333-3333-3333-333333333333");
    public static readonly Guid TransportOfferingId = Guid.Parse("44444444-4444-4444-4444-444444444444");

    // Dynamic test data that needs to be inserted
    public static readonly Guid CustomerId = Guid.Parse("99999999-9999-9999-9999-999999999999");
    public static readonly Guid VehicleMaintenanceId = Guid.Parse("44444444-4444-4444-4444-444444444442");
    public static readonly Guid DriverOnLeaveId = Guid.Parse("55555555-5555-5555-5555-555555555552");

    // Distinct Order IDs to respect the one-to-one Order-Invoice relationship
    public static readonly Guid OrderPendingId = Guid.Parse("66666666-6666-6666-6666-666666666661");
    public static readonly Guid OrderPendingInsufficientId = Guid.Parse("66666666-6666-6666-6666-666666666662");
    public static readonly Guid OrderPaidId = Guid.Parse("66666666-6666-6666-6666-666666666663");
    public static readonly Guid OrderDriverOnLeaveId = Guid.Parse("66666666-6666-6666-6666-666666666664");

    public static readonly Guid ShipmentPreparingId = Guid.Parse("77777777-7777-7777-7777-777777777771");
    public static readonly Guid ShipmentDriverOnLeaveId = Guid.Parse("77777777-7777-7777-7777-777777777773");
    
    // Distinct invoice IDs for each test case to avoid state contamination
    public static readonly Guid InvoiceUnpaidId = Guid.Parse("88888888-8888-8888-8888-888888888881");
    public static readonly Guid InvoiceUnpaidInsufficientId = Guid.Parse("88888888-8888-8888-8888-888888888883");
    public static readonly Guid InvoicePaidId = Guid.Parse("88888888-8888-8888-8888-888888888882");

    public static void Seed(SmartFmDbContext context)
    {
        // Add Customer (since it's not seeded by default in OnModelCreating)
        var customer = new Customer
        {
            Id = CustomerId,
            Name = "Vingroup",
            Email = "contact@vingroup.com",
            Phone = "0900000001",
            CompanyName = "Vingroup JSC",
            IsCorporateAccount = true,
            CreatedAt = DateTime.UtcNow
        };
        context.Customers.Add(customer);

        // Add Vehicle under maintenance (so we can test assignment failure)
        var vehicleMaintenance = new Vehicle
        {
            Id = VehicleMaintenanceId,
            PlateNumber = "29C-999.99",
            Type = VehicleType.Container,
            MaxPayloadKg = 15000m,
            MaxVolumeM3 = 80m,
            IsUnderMaintenance = true,
            CreatedAt = DateTime.UtcNow,
            BranchId = BranchId
        };
        context.Vehicles.Add(vehicleMaintenance);

        // Add Driver on leave (so we can test assignment failure)
        var driverOnLeave = new Driver
        {
            Id = DriverOnLeaveId,
            FullName = "Tran Van Binh",
            LicenseNumber = "DL789012",
            LicenseExpiryDate = DateTime.UtcNow.AddYears(1),
            MaxWeeklyHours = 48,
            IsOnLeave = true,
            CreatedAt = DateTime.UtcNow,
            BranchId = BranchId
        };
        context.Drivers.Add(driverOnLeave);

        // Add Orders
        var orderPending = new Order
        {
            Id = OrderPendingId,
            CustomerId = CustomerId,
            BranchId = BranchId,
            TransportOfferingId = TransportOfferingId,
            CargoWeightKg = 1200.50m,
            CargoVolumeM3 = 10.5m,
            SpecialHandlingNotes = "Keep dry",
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };
        var orderPendingInsufficient = new Order
        {
            Id = OrderPendingInsufficientId,
            CustomerId = CustomerId,
            BranchId = BranchId,
            TransportOfferingId = TransportOfferingId,
            CargoWeightKg = 800m,
            CargoVolumeM3 = 6m,
            SpecialHandlingNotes = "Fragile",
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };
        var orderPaid = new Order
        {
            Id = OrderPaidId,
            CustomerId = CustomerId,
            BranchId = BranchId,
            TransportOfferingId = TransportOfferingId,
            CargoWeightKg = 300m,
            CargoVolumeM3 = 2m,
            Status = OrderStatus.Validated,
            CreatedAt = DateTime.UtcNow
        };
        var orderDriverOnLeave = new Order
        {
            Id = OrderDriverOnLeaveId,
            CustomerId = CustomerId,
            BranchId = BranchId,
            TransportOfferingId = TransportOfferingId,
            CargoWeightKg = 300m,
            CargoVolumeM3 = 2m,
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };
        context.Orders.AddRange(orderPending, orderPendingInsufficient, orderPaid, orderDriverOnLeave);

        // Add Shipment
        var shipment = new Shipment
        {
            Id = ShipmentPreparingId,
            OrderId = OrderPendingId,
            Status = ShipmentStatus.Preparing,
            CreatedAt = DateTime.UtcNow
        };
        var shipmentDriverOnLeave = new Shipment
        {
            Id = ShipmentDriverOnLeaveId,
            OrderId = OrderDriverOnLeaveId,
            Status = ShipmentStatus.Preparing,
            CreatedAt = DateTime.UtcNow
        };
        context.Shipments.AddRange(shipment, shipmentDriverOnLeave);

        // Add Invoices (linked to unique orders to respect 1-to-1 relationships)
        var invoiceUnpaid = new Invoice
        {
            Id = InvoiceUnpaidId,
            OrderId = OrderPendingId,
            Amount = 500m,
            Status = InvoiceStatus.Unpaid,
            IssuedAt = DateTime.UtcNow
        };
        var invoiceUnpaidInsufficient = new Invoice
        {
            Id = InvoiceUnpaidInsufficientId,
            OrderId = OrderPendingInsufficientId,
            Amount = 500m,
            Status = InvoiceStatus.Unpaid,
            IssuedAt = DateTime.UtcNow
        };
        var invoicePaid = new Invoice
        {
            Id = InvoicePaidId,
            OrderId = OrderPaidId,
            Amount = 300m,
            Status = InvoiceStatus.Paid,
            IssuedAt = DateTime.UtcNow
        };
        context.Invoices.AddRange(invoiceUnpaid, invoiceUnpaidInsufficient, invoicePaid);

        context.SaveChanges();
    }
}
