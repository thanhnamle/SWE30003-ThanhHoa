using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for VehicleAssignment and DriverAssignment entities.
/// </summary>
public class AssignmentEntityTests
{
    [Fact]
    public void NewVehicleAssignment_ShouldHave_ProposedStatus_ByDefault()
    {
        var va = new VehicleAssignment();

        va.Status.Should().Be(AssignmentStatus.Proposed);
        va.ApprovedAt.Should().BeNull();
    }

    [Fact]
    public void VehicleAssignment_Properties_ShouldBeAssignable()
    {
        var id = Guid.NewGuid();
        var shipmentId = Guid.NewGuid();
        var vehicleId = Guid.NewGuid();
        var assignedAt = DateTime.UtcNow;
        var approvedAt = assignedAt.AddMinutes(15);

        var va = new VehicleAssignment
        {
            Id = id,
            ShipmentId = shipmentId,
            VehicleId = vehicleId,
            Status = AssignmentStatus.Approved,
            AssignedAt = assignedAt,
            ApprovedAt = approvedAt
        };

        va.Id.Should().Be(id);
        va.ShipmentId.Should().Be(shipmentId);
        va.VehicleId.Should().Be(vehicleId);
        va.Status.Should().Be(AssignmentStatus.Approved);
        va.AssignedAt.Should().Be(assignedAt);
        va.ApprovedAt.Should().Be(approvedAt);
    }

    [Fact]
    public void NewDriverAssignment_ShouldHave_ProposedStatus_ByDefault()
    {
        var da = new DriverAssignment();

        da.Status.Should().Be(AssignmentStatus.Proposed);
        da.ApprovedAt.Should().BeNull();
        da.ConflictNotes.Should().BeNull();
    }

    [Fact]
    public void DriverAssignment_Properties_ShouldBeAssignable()
    {
        var id = Guid.NewGuid();
        var shipmentId = Guid.NewGuid();
        var driverId = Guid.NewGuid();
        var assignedAt = DateTime.UtcNow;

        var da = new DriverAssignment
        {
            Id = id,
            ShipmentId = shipmentId,
            DriverId = driverId,
            Status = AssignmentStatus.Approved,
            AssignedAt = assignedAt,
            ConflictNotes = "Schedule close to shift end"
        };

        da.Id.Should().Be(id);
        da.ShipmentId.Should().Be(shipmentId);
        da.DriverId.Should().Be(driverId);
        da.Status.Should().Be(AssignmentStatus.Approved);
        da.AssignedAt.Should().Be(assignedAt);
        da.ConflictNotes.Should().Be("Schedule close to shift end");
    }
}
