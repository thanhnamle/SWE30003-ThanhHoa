using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for the Shipment domain entity invariants.
/// </summary>
public class ShipmentTests
{
    [Fact]
    public void NewShipment_ShouldHave_PreparingStatus_ByDefault()
    {
        // Arrange & Act
        var shipment = new Shipment();

        // Assert
        shipment.Status.Should().Be(ShipmentStatus.Preparing);
        shipment.CreatedAt.Should().BeBefore(DateTime.UtcNow.AddSeconds(1));
    }

    [Fact]
    public void Shipment_ShouldInitialize_EmptyCollections_AndNullRelations()
    {
        // Arrange & Act
        var shipment = new Shipment();

        // Assert
        shipment.VehicleAssignment.Should().BeNull();
        shipment.DriverAssignment.Should().BeNull();
        shipment.PickupDeliveryOption.Should().BeNull();
        shipment.TrackingRecords.Should().BeEmpty();
        shipment.DeliveryExceptions.Should().BeEmpty();
        shipment.ReadyForPickupAt.Should().BeNull();
        shipment.DeliveredAt.Should().BeNull();
    }

    [Fact]
    public void Shipment_Properties_ShouldBeAssignable()
    {
        // Arrange
        var shipmentId = Guid.NewGuid();
        var orderId = Guid.NewGuid();
        var date = DateTime.UtcNow;

        // Act
        var shipment = new Shipment
        {
            Id = shipmentId,
            OrderId = orderId,
            Status = ShipmentStatus.InTransit,
            CreatedAt = date,
            ReadyForPickupAt = date.AddHours(2),
            DeliveredAt = date.AddHours(5)
        };

        // Assert
        shipment.Id.Should().Be(shipmentId);
        shipment.OrderId.Should().Be(orderId);
        shipment.Status.Should().Be(ShipmentStatus.InTransit);
        shipment.CreatedAt.Should().Be(date);
        shipment.ReadyForPickupAt.Should().Be(date.AddHours(2));
        shipment.DeliveredAt.Should().Be(date.AddHours(5));
    }
}
