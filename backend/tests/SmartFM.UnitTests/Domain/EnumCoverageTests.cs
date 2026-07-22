using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Comprehensive unit tests verifying all enum values across the domain model.
/// </summary>
public class EnumCoverageTests
{
    [Theory]
    [InlineData(OrderStatus.Pending, 0)]
    [InlineData(OrderStatus.Validated, 1)]
    [InlineData(OrderStatus.Cancelled, 2)]
    public void OrderStatus_EnumValues_ShouldBeDefined(OrderStatus status, int expectedValue)
    {
        ((int)status).Should().Be(expectedValue);
        Enum.IsDefined(typeof(OrderStatus), status).Should().BeTrue();
    }

    [Theory]
    [InlineData(ShipmentStatus.Preparing, 0)]
    [InlineData(ShipmentStatus.ReadyForPickup, 1)]
    [InlineData(ShipmentStatus.InTransit, 2)]
    [InlineData(ShipmentStatus.Delivered, 3)]
    [InlineData(ShipmentStatus.ExceptionPending, 4)]
    public void ShipmentStatus_EnumValues_ShouldBeDefined(ShipmentStatus status, int expectedValue)
    {
        ((int)status).Should().Be(expectedValue);
        Enum.IsDefined(typeof(ShipmentStatus), status).Should().BeTrue();
    }

    [Theory]
    [InlineData(PaymentStatus.Pending, 0)]
    [InlineData(PaymentStatus.Success, 1)]
    [InlineData(PaymentStatus.Failed, 2)]
    public void PaymentStatus_EnumValues_ShouldBeDefined(PaymentStatus status, int expectedValue)
    {
        ((int)status).Should().Be(expectedValue);
        Enum.IsDefined(typeof(PaymentStatus), status).Should().BeTrue();
    }

    [Theory]
    [InlineData(PaymentMethod.CreditCard, 0)]
    [InlineData(PaymentMethod.BankTransfer, 1)]
    [InlineData(PaymentMethod.EWallet, 2)]
    public void PaymentMethod_EnumValues_ShouldBeDefined(PaymentMethod method, int expectedValue)
    {
        ((int)method).Should().Be(expectedValue);
        Enum.IsDefined(typeof(PaymentMethod), method).Should().BeTrue();
    }

    [Theory]
    [InlineData(InvoiceStatus.Unpaid, 0)]
    [InlineData(InvoiceStatus.Paid, 1)]
    public void InvoiceStatus_EnumValues_ShouldBeDefined(InvoiceStatus status, int expectedValue)
    {
        ((int)status).Should().Be(expectedValue);
        Enum.IsDefined(typeof(InvoiceStatus), status).Should().BeTrue();
    }

    [Theory]
    [InlineData(VehicleType.Van, 0)]
    [InlineData(VehicleType.Truck, 1)]
    [InlineData(VehicleType.Container, 2)]
    [InlineData(VehicleType.Refrigerated, 3)]
    public void VehicleType_EnumValues_ShouldBeDefined(VehicleType type, int expectedValue)
    {
        ((int)type).Should().Be(expectedValue);
        Enum.IsDefined(typeof(VehicleType), type).Should().BeTrue();
    }

    [Theory]
    [InlineData(TransportCategory.Standard, 0)]
    [InlineData(TransportCategory.Express, 1)]
    [InlineData(TransportCategory.Fragile, 2)]
    [InlineData(TransportCategory.Bulk, 3)]
    public void TransportCategory_EnumValues_ShouldBeDefined(TransportCategory category, int expectedValue)
    {
        ((int)category).Should().Be(expectedValue);
        Enum.IsDefined(typeof(TransportCategory), category).Should().BeTrue();
    }

    [Theory]
    [InlineData(ExceptionType.VehicleBreakdown, 0)]
    [InlineData(ExceptionType.WrongAddress, 1)]
    [InlineData(ExceptionType.CargoDelay, 2)]
    [InlineData(ExceptionType.FailedDeliveryAttempt, 3)]
    [InlineData(ExceptionType.Other, 4)]
    public void ExceptionType_EnumValues_ShouldBeDefined(ExceptionType type, int expectedValue)
    {
        ((int)type).Should().Be(expectedValue);
        Enum.IsDefined(typeof(ExceptionType), type).Should().BeTrue();
    }

    [Theory]
    [InlineData(ExceptionStatus.Open, 0)]
    [InlineData(ExceptionStatus.Resolved, 1)]
    public void ExceptionStatus_EnumValues_ShouldBeDefined(ExceptionStatus status, int expectedValue)
    {
        ((int)status).Should().Be(expectedValue);
        Enum.IsDefined(typeof(ExceptionStatus), status).Should().BeTrue();
    }

    [Theory]
    [InlineData(AssignmentStatus.Proposed, 0)]
    [InlineData(AssignmentStatus.Approved, 1)]
    [InlineData(AssignmentStatus.Rejected, 2)]
    public void AssignmentStatus_EnumValues_ShouldBeDefined(AssignmentStatus status, int expectedValue)
    {
        ((int)status).Should().Be(expectedValue);
        Enum.IsDefined(typeof(AssignmentStatus), status).Should().BeTrue();
    }
}
