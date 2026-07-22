using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for Vehicle domain entity.
/// </summary>
public class VehicleTests
{
    [Fact]
    public void NewVehicle_ShouldNotBe_UnderMaintenance_ByDefault()
    {
        var vehicle = new Vehicle();
        vehicle.IsUnderMaintenance.Should().BeFalse();
        vehicle.MaintenanceUntil.Should().BeNull();
        vehicle.Assignments.Should().NotBeNull().And.BeEmpty();
    }

    [Theory]
    [InlineData(VehicleType.Van)]
    [InlineData(VehicleType.Truck)]
    [InlineData(VehicleType.Container)]
    [InlineData(VehicleType.Refrigerated)]
    public void Vehicle_AllTypes_ShouldBeSupported(VehicleType type)
    {
        var vehicle = new Vehicle { Type = type };
        vehicle.Type.Should().Be(type);
    }

    [Fact]
    public void Vehicle_MaintenanceMode_ShouldStoreMaintenanceUntil()
    {
        var until = DateTime.UtcNow.AddDays(3);
        var vehicle = new Vehicle
        {
            PlateNumber = "51C-123.45",
            IsUnderMaintenance = true,
            MaintenanceUntil = until
        };

        vehicle.IsUnderMaintenance.Should().BeTrue();
        vehicle.MaintenanceUntil.Should().Be(until);
    }
}
