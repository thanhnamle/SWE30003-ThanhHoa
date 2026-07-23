using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for the Shipment domain entity.
/// </summary>
public class ShipmentTests
{
    [Fact]
    public void NewShipment_ShouldHave_PreparingStatus_ByDefault()
    {
        var shipment = new Shipment();
        shipment.Status.Should().Be(ShipmentStatus.Preparing);
    }

    [Fact]
    public void Shipment_ShouldHave_NullNavigationProperties_ByDefault()
    {
        var shipment = new Shipment();

        shipment.VehicleAssignment.Should().BeNull();
        shipment.DriverAssignment.Should().BeNull();
        shipment.PickupDeliveryOption.Should().BeNull();
        shipment.ReadyForPickupAt.Should().BeNull();
        shipment.DeliveredAt.Should().BeNull();
        shipment.TrackingRecords.Should().NotBeNull().And.BeEmpty();
        shipment.DeliveryExceptions.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void Shipment_FullLifecycle_StateTransitions_ShouldTrackTimestamps()
    {
        var id = Guid.NewGuid();
        var orderId = Guid.NewGuid();
        var created = DateTime.UtcNow;
        var ready = created.AddHours(2);
        var delivered = ready.AddHours(5);

        var shipment = new Shipment
        {
            Id = id,
            OrderId = orderId,
            CreatedAt = created,
            Status = ShipmentStatus.Preparing
        };

        // Transition 1: Preparing -> ReadyForPickup
        shipment.Status = ShipmentStatus.ReadyForPickup;
        shipment.ReadyForPickupAt = ready;

        shipment.Status.Should().Be(ShipmentStatus.ReadyForPickup);
        shipment.ReadyForPickupAt.Should().Be(ready);

        // Transition 2: ReadyForPickup -> InTransit
        shipment.Status = ShipmentStatus.InTransit;
        shipment.Status.Should().Be(ShipmentStatus.InTransit);

        // Transition 3: InTransit -> Delivered
        shipment.Status = ShipmentStatus.Delivered;
        shipment.DeliveredAt = delivered;

        shipment.Status.Should().Be(ShipmentStatus.Delivered);
        shipment.DeliveredAt.Should().Be(delivered);
    }
}
