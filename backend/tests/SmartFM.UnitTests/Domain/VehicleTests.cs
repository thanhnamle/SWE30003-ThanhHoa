using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for the Vehicle domain entity invariants.
/// </summary>
public class VehicleTests
{
    [Fact]
    public void NewVehicle_ShouldHave_DefaultProperties()
    {
        // Arrange & Act
        var vehicle = new Vehicle();

        // Assert
        vehicle.PlateNumber.Should().BeEmpty();
        vehicle.IsUnderMaintenance.Should().BeFalse();
        vehicle.MaintenanceUntil.Should().BeNull();
        vehicle.Assignments.Should().BeEmpty();
    }

    [Fact]
    public void Vehicle_Properties_ShouldBeAssignable()
    {
        // Arrange
        var vehicleId = Guid.NewGuid();
        var branchId = Guid.NewGuid();
        var date = DateTime.UtcNow;

        // Act
        var vehicle = new Vehicle
        {
            Id = vehicleId,
            PlateNumber = "29A-12345",
            Type = VehicleType.Truck,
            MaxPayloadKg = 5000m,
            MaxVolumeM3 = 25m,
            IsUnderMaintenance = true,
            MaintenanceUntil = date.AddDays(2),
            CreatedAt = date,
            BranchId = branchId
        };

        // Assert
        vehicle.Id.Should().Be(vehicleId);
        vehicle.PlateNumber.Should().Be("29A-12345");
        vehicle.Type.Should().Be(VehicleType.Truck);
        vehicle.MaxPayloadKg.Should().Be(5000m);
        vehicle.MaxVolumeM3.Should().Be(25m);
        vehicle.IsUnderMaintenance.Should().BeTrue();
        vehicle.MaintenanceUntil.Should().Be(date.AddDays(2));
        vehicle.CreatedAt.Should().Be(date);
        vehicle.BranchId.Should().Be(branchId);
    }
}
