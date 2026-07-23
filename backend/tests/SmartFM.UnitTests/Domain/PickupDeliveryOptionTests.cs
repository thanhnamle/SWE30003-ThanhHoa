using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for PickupDeliveryOption domain entity.
/// </summary>
public class PickupDeliveryOptionTests
{
    [Fact]
    public void PickupDeliveryOption_Properties_ShouldBeAssignable()
    {
        var id = Guid.NewGuid();
        var shipmentId = Guid.NewGuid();
        var pickupStart = DateTime.UtcNow.AddHours(2);
        var pickupEnd = pickupStart.AddHours(2);
        var deliveryStart = pickupEnd.AddHours(4);
        var deliveryEnd = deliveryStart.AddHours(2);

        var option = new PickupDeliveryOption
        {
            Id = id,
            PickupAddress = "Warehouse A, Industrial Park, HCMC",
            PickupWindowStart = pickupStart,
            PickupWindowEnd = pickupEnd,
            DeliveryAddress = "Warehouse B, Bien Hoa City",
            DeliveryContactName = "John Doe",
            DeliveryContactPhone = "+84988776655",
            DeliveryWindowStart = deliveryStart,
            DeliveryWindowEnd = deliveryEnd,
            ShipmentId = shipmentId
        };

        option.Id.Should().Be(id);
        option.PickupAddress.Should().Be("Warehouse A, Industrial Park, HCMC");
        option.PickupWindowStart.Should().Be(pickupStart);
        option.PickupWindowEnd.Should().Be(pickupEnd);
        option.DeliveryAddress.Should().Be("Warehouse B, Bien Hoa City");
        option.DeliveryContactName.Should().Be("John Doe");
        option.DeliveryContactPhone.Should().Be("+84988776655");
        option.DeliveryWindowStart.Should().Be(deliveryStart);
        option.DeliveryWindowEnd.Should().Be(deliveryEnd);
        option.ShipmentId.Should().Be(shipmentId);
    }
}
