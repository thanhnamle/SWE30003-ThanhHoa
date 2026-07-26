#pragma warning disable CS8620
using System;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Xunit;
using SmartFM.Application.DTOs.Shipments;
using SmartFM.Application.Services;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;
using SmartFM.Domain.Exceptions;
using SmartFM.Domain.Interfaces;

namespace SmartFM.UnitTests.Services;

/// <summary>
/// Unit tests for the ShipmentService business rules.
/// </summary>
public class ShipmentServiceTests
{
    private readonly Mock<IRepository<Shipment>> _shipmentRepoMock;
    private readonly Mock<IRepository<Vehicle>> _vehicleRepoMock;
    private readonly Mock<IRepository<Driver>> _driverRepoMock;
    private readonly Mock<IRepository<VehicleAssignment>> _vehicleAssignRepoMock;
    private readonly Mock<IRepository<DriverAssignment>> _driverAssignRepoMock;
    private readonly Mock<IRepository<PickupDeliveryOption>> _pickupDeliveryOptionRepoMock;
    private readonly ShipmentService _shipmentService;

    public ShipmentServiceTests()
    {
        _shipmentRepoMock = new Mock<IRepository<Shipment>>();
        _vehicleRepoMock = new Mock<IRepository<Vehicle>>();
        _driverRepoMock = new Mock<IRepository<Driver>>();
        _vehicleAssignRepoMock = new Mock<IRepository<VehicleAssignment>>();
        _driverAssignRepoMock = new Mock<IRepository<DriverAssignment>>();
        _pickupDeliveryOptionRepoMock = new Mock<IRepository<PickupDeliveryOption>>();

        _shipmentService = new ShipmentService(
            _shipmentRepoMock.Object,
            _vehicleRepoMock.Object,
            _driverRepoMock.Object,
            _vehicleAssignRepoMock.Object,
            _driverAssignRepoMock.Object,
            _pickupDeliveryOptionRepoMock.Object
        );
    }

    [Fact]
    public async Task AssignResourcesAsync_ValidData_ShouldAssignSuccessfully()
    {
        var shipmentId = Guid.NewGuid();
        var vehicleId = Guid.NewGuid();
        var driverId = Guid.NewGuid();

        var shipment = new Shipment { Id = shipmentId, Status = ShipmentStatus.Preparing };
        var vehicle = new Vehicle { Id = vehicleId, PlateNumber = "51A-999.99", IsUnderMaintenance = false };
        var driver = new Driver { Id = driverId, FullName = "Driver A", IsOnLeave = false };

        _shipmentRepoMock.Setup(r => r.GetByIdAsync(shipmentId)).ReturnsAsync(shipment);
        _vehicleRepoMock.Setup(r => r.GetByIdAsync(vehicleId)).ReturnsAsync(vehicle);
        _driverRepoMock.Setup(r => r.GetByIdAsync(driverId)).ReturnsAsync(driver);

        var dto = new AssignResourcesDto
        {
            VehicleId = vehicleId,
            DriverId = driverId,
            ConflictNotes = "No conflicts"
        };

        var result = await _shipmentService.AssignResourcesAsync(shipmentId, dto);

        result.Should().NotBeNull();
        result.Status.Should().Be(ShipmentStatus.ReadyForPickup);
        result.Message.Should().Be("Resources assigned successfully!");

        _vehicleAssignRepoMock.Verify(r => r.AddAsync(It.Is<VehicleAssignment>(va => va.VehicleId == vehicleId)), Times.Once);
        _driverAssignRepoMock.Verify(r => r.AddAsync(It.Is<DriverAssignment>(da => da.DriverId == driverId)), Times.Once);
        _shipmentRepoMock.Verify(r => r.UpdateAsync(It.Is<Shipment>(s => s.Status == ShipmentStatus.ReadyForPickup)), Times.Once);
    }

    [Fact]
    public async Task AssignResourcesAsync_ShipmentNotFound_ShouldThrow_BusinessRuleException()
    {
        var shipmentId = Guid.NewGuid();
        _shipmentRepoMock.Setup(r => r.GetByIdAsync(shipmentId)).ReturnsAsync((Shipment?)null);

        var dto = new AssignResourcesDto { VehicleId = Guid.NewGuid(), DriverId = Guid.NewGuid() };

        var act = () => _shipmentService.AssignResourcesAsync(shipmentId, dto);
        await act.Should().ThrowAsync<BusinessRuleException>().WithMessage("Shipment not found.");
    }

    [Fact]
    public async Task AssignResourcesAsync_VehicleNotFound_ShouldThrow_BusinessRuleException()
    {
        var shipmentId = Guid.NewGuid();
        var vehicleId = Guid.NewGuid();

        var shipment = new Shipment { Id = shipmentId };
        _shipmentRepoMock.Setup(r => r.GetByIdAsync(shipmentId)).ReturnsAsync(shipment);
        _vehicleRepoMock.Setup(r => r.GetByIdAsync(vehicleId)).ReturnsAsync((Vehicle?)null);

        var dto = new AssignResourcesDto { VehicleId = vehicleId, DriverId = Guid.NewGuid() };

        var act = () => _shipmentService.AssignResourcesAsync(shipmentId, dto);
        await act.Should().ThrowAsync<BusinessRuleException>().WithMessage("Vehicle not found.");
    }

    [Fact]
    public async Task AssignResourcesAsync_DriverNotFound_ShouldThrow_BusinessRuleException()
    {
        var shipmentId = Guid.NewGuid();
        var vehicleId = Guid.NewGuid();
        var driverId = Guid.NewGuid();

        var shipment = new Shipment { Id = shipmentId };
        var vehicle = new Vehicle { Id = vehicleId, PlateNumber = "51A-111.11", IsUnderMaintenance = false };

        _shipmentRepoMock.Setup(r => r.GetByIdAsync(shipmentId)).ReturnsAsync(shipment);
        _vehicleRepoMock.Setup(r => r.GetByIdAsync(vehicleId)).ReturnsAsync(vehicle);
        _driverRepoMock.Setup(r => r.GetByIdAsync(driverId)).ReturnsAsync((Driver?)null);

        var dto = new AssignResourcesDto { VehicleId = vehicleId, DriverId = driverId };

        var act = () => _shipmentService.AssignResourcesAsync(shipmentId, dto);
        await act.Should().ThrowAsync<BusinessRuleException>().WithMessage("Driver not found.");
    }

    [Fact]
    public async Task AssignResourcesAsync_VehicleUnderMaintenance_ShouldThrow_BusinessRuleException()
    {
        var shipmentId = Guid.NewGuid();
        var vehicleId = Guid.NewGuid();
        var driverId = Guid.NewGuid();

        var shipment = new Shipment { Id = shipmentId };
        var vehicle = new Vehicle { Id = vehicleId, PlateNumber = "51A-999.99", IsUnderMaintenance = true };
        var driver = new Driver { Id = driverId, FullName = "Driver A", IsOnLeave = false };

        _shipmentRepoMock.Setup(r => r.GetByIdAsync(shipmentId)).ReturnsAsync(shipment);
        _vehicleRepoMock.Setup(r => r.GetByIdAsync(vehicleId)).ReturnsAsync(vehicle);
        _driverRepoMock.Setup(r => r.GetByIdAsync(driverId)).ReturnsAsync(driver);

        var dto = new AssignResourcesDto { VehicleId = vehicleId, DriverId = driverId };

        var act = () => _shipmentService.AssignResourcesAsync(shipmentId, dto);
        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Vehicle 51A-999.99 is under maintenance.");
    }

    [Fact]
    public async Task AssignResourcesAsync_DriverOnLeave_ShouldThrow_BusinessRuleException()
    {
        var shipmentId = Guid.NewGuid();
        var vehicleId = Guid.NewGuid();
        var driverId = Guid.NewGuid();

        var shipment = new Shipment { Id = shipmentId };
        var vehicle = new Vehicle { Id = vehicleId, PlateNumber = "51A-999.99", IsUnderMaintenance = false };
        var driver = new Driver { Id = driverId, LicenseNumber = "LIC-12345", IsOnLeave = true };

        _shipmentRepoMock.Setup(r => r.GetByIdAsync(shipmentId)).ReturnsAsync(shipment);
        _vehicleRepoMock.Setup(r => r.GetByIdAsync(vehicleId)).ReturnsAsync(vehicle);
        _driverRepoMock.Setup(r => r.GetByIdAsync(driverId)).ReturnsAsync(driver);

        var dto = new AssignResourcesDto { VehicleId = vehicleId, DriverId = driverId };

        var act = () => _shipmentService.AssignResourcesAsync(shipmentId, dto);
        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Driver LIC-12345 is on leave.");
    }
}
