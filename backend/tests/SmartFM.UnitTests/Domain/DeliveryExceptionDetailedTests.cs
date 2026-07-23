using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Detailed unit tests for DeliveryException domain entity.
/// </summary>
public class DeliveryExceptionDetailedTests
{
    [Fact]
    public void NewDeliveryException_ShouldHave_OpenStatus_ByDefault()
    {
        var ex = new DeliveryException();

        ex.Status.Should().Be(ExceptionStatus.Open);
        ex.ResolutionAction.Should().BeNull();
        ex.ResolvedAt.Should().BeNull();
        ex.Description.Should().BeEmpty();
    }

    [Theory]
    [InlineData(ExceptionType.VehicleBreakdown)]
    [InlineData(ExceptionType.WrongAddress)]
    [InlineData(ExceptionType.CargoDelay)]
    [InlineData(ExceptionType.FailedDeliveryAttempt)]
    [InlineData(ExceptionType.Other)]
    public void DeliveryException_Types_ShouldBeSupported(ExceptionType exceptionType)
    {
        var ex = new DeliveryException
        {
            Type = exceptionType,
            Description = $"Testing exception type {exceptionType}"
        };

        ex.Type.Should().Be(exceptionType);
    }

    [Fact]
    public void DeliveryException_Resolution_ShouldUpdateProperties()
    {
        var raisedAt = DateTime.UtcNow.AddHours(-3);
        var resolvedAt = DateTime.UtcNow;

        var ex = new DeliveryException
        {
            Id = Guid.NewGuid(),
            Type = ExceptionType.VehicleBreakdown,
            Status = ExceptionStatus.Resolved,
            Description = "Engine overhaul required",
            ResolutionAction = "Dispatched backup vehicle",
            RaisedAt = raisedAt,
            ResolvedAt = resolvedAt,
            ShipmentId = Guid.NewGuid()
        };

        ex.Status.Should().Be(ExceptionStatus.Resolved);
        ex.ResolutionAction.Should().Be("Dispatched backup vehicle");
        ex.ResolvedAt.Should().Be(resolvedAt);
    }
}
