using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for the Order domain entity invariants.
/// </summary>
public class OrderTests
{
    [Fact]
    public void NewOrder_ShouldHave_PendingStatus_ByDefault()
    {
        // Arrange & Act
        var order = new Order();

        // Assert
        order.Status.Should().Be(OrderStatus.Pending);
    }

    [Fact]
    public void Order_ShouldHave_NullAssociations_ByDefault()
    {
        // Arrange & Act
        var order = new Order();

        // Assert
        order.Shipment.Should().BeNull();
        order.Invoice.Should().BeNull();
        order.SpecialHandlingNotes.Should().BeEmpty();
    }

    [Fact]
    public void Order_Properties_ShouldBeAssignable()
    {
        // Arrange
        var customerId = Guid.NewGuid();
        var branchId = Guid.NewGuid();
        var transportOfferingId = Guid.NewGuid();
        var date = DateTime.UtcNow;

        // Act
        var order = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            BranchId = branchId,
            TransportOfferingId = transportOfferingId,
            CargoWeightKg = 150.5m,
            CargoVolumeM3 = 2.3m,
            SpecialHandlingNotes = "Handle with care",
            Status = OrderStatus.Validated,
            CreatedAt = date,
            ValidatedAt = date.AddHours(1),
            CancelledAt = null
        };

        // Assert
        order.CustomerId.Should().Be(customerId);
        order.BranchId.Should().Be(branchId);
        order.TransportOfferingId.Should().Be(transportOfferingId);
        order.CargoWeightKg.Should().Be(150.5m);
        order.CargoVolumeM3.Should().Be(2.3m);
        order.SpecialHandlingNotes.Should().Be("Handle with care");
        order.Status.Should().Be(OrderStatus.Validated);
        order.CreatedAt.Should().Be(date);
        order.ValidatedAt.Should().Be(date.AddHours(1));
        order.CancelledAt.Should().BeNull();
    }
}
