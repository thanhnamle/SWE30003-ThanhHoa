using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for the remaining Domain entities: TrackingRecord, DeliveryException,
/// VehicleAssignment, DriverAssignment, Branch, TransportOffering, and PickupDeliveryOption.
/// </summary>
public class RemainingEntitiesTests
{
    [Fact]
    public void TrackingRecord_Invariants_AndProperties()
    {
        // Act
        var record = new TrackingRecord
        {
            Id = Guid.NewGuid(),
            ShipmentId = Guid.NewGuid(),
            Timestamp = DateTime.UtcNow,
            Location = "Warehouse 5",
            StatusNote = "Order received at branch"
        };

        // Assert
        record.Location.Should().Be("Warehouse 5");
        record.StatusNote.Should().Be("Order received at branch");
    }

    [Fact]
    public void DeliveryException_Invariants_AndProperties()
    {
        // Arrange
        var ex = new DeliveryException();

        // Assert defaults
        ex.Status.Should().Be(ExceptionStatus.Open);
        ex.Description.Should().BeEmpty();
        ex.ResolutionAction.Should().BeNull();
        ex.ResolvedAt.Should().BeNull();

        // Act
        var date = DateTime.UtcNow;
        var detailedEx = new DeliveryException
        {
            Id = Guid.NewGuid(),
            ShipmentId = Guid.NewGuid(),
            Type = ExceptionType.VehicleBreakdown,
            Status = ExceptionStatus.Resolved,
            Description = "Engine overheating",
            ResolutionAction = "Replaced vehicle",
            RaisedAt = date,
            ResolvedAt = date.AddHours(2)
        };

        // Assert
        detailedEx.Type.Should().Be(ExceptionType.VehicleBreakdown);
        detailedEx.Status.Should().Be(ExceptionStatus.Resolved);
        detailedEx.Description.Should().Be("Engine overheating");
        detailedEx.ResolutionAction.Should().Be("Replaced vehicle");
        detailedEx.RaisedAt.Should().Be(date);
        detailedEx.ResolvedAt.Should().Be(date.AddHours(2));
    }

    [Fact]
    public void VehicleAssignment_Invariants_AndProperties()
    {
        // Arrange
        var va = new VehicleAssignment();

        // Assert defaults
        va.Status.Should().Be(AssignmentStatus.Proposed);
        va.ApprovedAt.Should().BeNull();

        // Act
        var date = DateTime.UtcNow;
        var assignedVa = new VehicleAssignment
        {
            Id = Guid.NewGuid(),
            ShipmentId = Guid.NewGuid(),
            VehicleId = Guid.NewGuid(),
            Status = AssignmentStatus.Approved,
            AssignedAt = date,
            ApprovedAt = date.AddMinutes(15)
        };

        // Assert
        assignedVa.Status.Should().Be(AssignmentStatus.Approved);
        assignedVa.AssignedAt.Should().Be(date);
        assignedVa.ApprovedAt.Should().Be(date.AddMinutes(15));
    }

    [Fact]
    public void DriverAssignment_Invariants_AndProperties()
    {
        // Arrange
        var da = new DriverAssignment();

        // Assert defaults
        da.Status.Should().Be(AssignmentStatus.Proposed);
        da.ApprovedAt.Should().BeNull();
        da.ConflictNotes.Should().BeNull();

        // Act
        var date = DateTime.UtcNow;
        var assignedDa = new DriverAssignment
        {
            Id = Guid.NewGuid(),
            ShipmentId = Guid.NewGuid(),
            DriverId = Guid.NewGuid(),
            Status = AssignmentStatus.Rejected,
            AssignedAt = date,
            ApprovedAt = date.AddMinutes(5),
            ConflictNotes = "Weekly hours limit exceeded"
        };

        // Assert
        assignedDa.Status.Should().Be(AssignmentStatus.Rejected);
        assignedDa.AssignedAt.Should().Be(date);
        assignedDa.ApprovedAt.Should().Be(date.AddMinutes(5));
        assignedDa.ConflictNotes.Should().Be("Weekly hours limit exceeded");
    }

    [Fact]
    public void Branch_Invariants_AndProperties()
    {
        // Arrange
        var branch = new Branch();

        // Assert defaults
        branch.Name.Should().BeEmpty();
        branch.Vehicles.Should().BeEmpty();
        branch.Drivers.Should().BeEmpty();
        branch.Orders.Should().BeEmpty();

        // Act
        var date = DateTime.UtcNow;
        var activeBranch = new Branch
        {
            Id = Guid.NewGuid(),
            Name = "Ho Chi Minh City Branch",
            Region = "South",
            Address = "123 Main Street, District 1",
            ContactPhone = "0901234567",
            CreatedAt = date
        };

        // Assert
        activeBranch.Name.Should().Be("Ho Chi Minh City Branch");
        activeBranch.Region.Should().Be("South");
        activeBranch.Address.Should().Be("123 Main Street, District 1");
        activeBranch.ContactPhone.Should().Be("0901234567");
        activeBranch.CreatedAt.Should().Be(date);
    }

    [Fact]
    public void TransportOffering_Invariants_AndProperties()
    {
        // Arrange
        var offering = new TransportOffering();

        // Assert defaults
        offering.IsActive.Should().BeTrue();
        offering.Orders.Should().BeEmpty();

        // Act
        var activeOffering = new TransportOffering
        {
            Id = Guid.NewGuid(),
            Name = "Fragile Delivery Service",
            Description = "Customized transit for fragile goods",
            Category = TransportCategory.Fragile,
            MaxCapacityKg = 1000m,
            BaseFee = 50.0m,
            FeePerKm = 1.5m,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        // Assert
        activeOffering.Name.Should().Be("Fragile Delivery Service");
        activeOffering.Category.Should().Be(TransportCategory.Fragile);
        activeOffering.MaxCapacityKg.Should().Be(1000m);
        activeOffering.BaseFee.Should().Be(50.0m);
        activeOffering.FeePerKm.Should().Be(1.5m);
        activeOffering.IsActive.Should().BeTrue();
    }

    [Fact]
    public void PickupDeliveryOption_Invariants_AndProperties()
    {
        // Arrange
        var option = new PickupDeliveryOption();

        // Assert defaults
        option.PickupAddress.Should().BeEmpty();
        option.DeliveryAddress.Should().BeEmpty();
        option.DeliveryContactName.Should().BeEmpty();
        option.DeliveryContactPhone.Should().BeEmpty();

        // Act
        var date = DateTime.UtcNow;
        var activeOption = new PickupDeliveryOption
        {
            Id = Guid.NewGuid(),
            ShipmentId = Guid.NewGuid(),
            PickupAddress = "456 Warehouse Blvd",
            PickupWindowStart = date,
            PickupWindowEnd = date.AddHours(2),
            DeliveryAddress = "789 Retail Ave",
            DeliveryContactName = "Jane Smith",
            DeliveryContactPhone = "0987654321",
            DeliveryWindowStart = date.AddHours(4),
            DeliveryWindowEnd = date.AddHours(6)
        };

        // Assert
        activeOption.PickupAddress.Should().Be("456 Warehouse Blvd");
        activeOption.DeliveryAddress.Should().Be("789 Retail Ave");
        activeOption.DeliveryContactName.Should().Be("Jane Smith");
        activeOption.DeliveryContactPhone.Should().Be("0987654321");
    }
}
