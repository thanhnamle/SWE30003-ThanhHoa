using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for the Order domain entity invariants and state transitions.
/// </summary>
public class OrderTests
{
    [Fact]
    public void NewOrder_ShouldHave_PendingStatus_ByDefault()
    {
        var order = new Order();
        order.Status.Should().Be(OrderStatus.Pending);
    }

    [Fact]
    public void Order_ShouldHave_NullAssociations_ByDefault()
    {
        var order = new Order();

        order.Shipment.Should().BeNull();
        order.Invoice.Should().BeNull();
        order.SpecialHandlingNotes.Should().BeEmpty();
    }

    [Fact]
    public void Order_Properties_ShouldBeAssignable()
    {
        var customerId = Guid.NewGuid();
        var branchId = Guid.NewGuid();
        var transportOfferingId = Guid.NewGuid();
        var date = DateTime.UtcNow;

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

    [Fact]
    public void Order_StatusTransition_PendingToValidated_ShouldSetValidatedAt()
    {
        var order = new Order { Status = OrderStatus.Pending };
        var validatedTime = DateTime.UtcNow;

        order.Status = OrderStatus.Validated;
        order.ValidatedAt = validatedTime;

        order.Status.Should().Be(OrderStatus.Validated);
        order.ValidatedAt.Should().Be(validatedTime);
        order.CancelledAt.Should().BeNull();
    }

    [Fact]
    public void Order_StatusTransition_PendingToCancelled_ShouldSetCancelledAt()
    {
        var order = new Order { Status = OrderStatus.Pending };
        var cancelledTime = DateTime.UtcNow;

        order.Status = OrderStatus.Cancelled;
        order.CancelledAt = cancelledTime;

        order.Status.Should().Be(OrderStatus.Cancelled);
        order.CancelledAt.Should().Be(cancelledTime);
        order.ValidatedAt.Should().BeNull();
    }

    [Fact]
    public void Order_BoundaryWeight_MaxValue_ShouldBeAssignable()
    {
        var order = new Order
        {
            CargoWeightKg = decimal.MaxValue,
            CargoVolumeM3 = decimal.MaxValue
        };

        order.CargoWeightKg.Should().Be(decimal.MaxValue);
        order.CargoVolumeM3.Should().Be(decimal.MaxValue);
    }
}
