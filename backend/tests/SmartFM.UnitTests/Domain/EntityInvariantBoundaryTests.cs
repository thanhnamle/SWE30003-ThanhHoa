using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for boundary value validation across all domain entity properties.
/// </summary>
public class EntityInvariantBoundaryTests
{
    [Theory]
    [InlineData(0.0001)]
    [InlineData(1.0)]
    [InlineData(999999999.99)]
    public void Vehicle_MaxPayloadKg_BoundaryValues_ShouldBeValid(decimal payload)
    {
        var vehicle = new Vehicle { MaxPayloadKg = payload };
        vehicle.MaxPayloadKg.Should().Be(payload);
    }

    [Theory]
    [InlineData(0.0001)]
    [InlineData(0.1)]
    [InlineData(999999.99)]
    public void Vehicle_MaxVolumeM3_BoundaryValues_ShouldBeValid(decimal volume)
    {
        var vehicle = new Vehicle { MaxVolumeM3 = volume };
        vehicle.MaxVolumeM3.Should().Be(volume);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(48)]
    [InlineData(168)] // Max hours in a week
    public void Driver_MaxWeeklyHours_BoundaryValues_ShouldBeValid(int hours)
    {
        var driver = new Driver { MaxWeeklyHours = hours };
        driver.MaxWeeklyHours.Should().Be(hours);
    }

    [Theory]
    [InlineData(0.01)]
    [InlineData(5000.50)]
    [InlineData(999999.99)]
    public void Invoice_Amount_BoundaryValues_ShouldBeValid(decimal amount)
    {
        var invoice = new Invoice { Amount = amount };
        invoice.Amount.Should().Be(amount);
    }

    [Theory]
    [InlineData(0.01)]
    [InlineData(1000.00)]
    [InlineData(999999.99)]
    public void Payment_Amount_BoundaryValues_ShouldBeValid(decimal amount)
    {
        var payment = new Payment { Amount = amount };
        payment.Amount.Should().Be(amount);
    }

    [Theory]
    [InlineData(0.01)]
    [InlineData(1000.00)]
    [InlineData(999999.99)]
    public void Receipt_SettledAmount_BoundaryValues_ShouldBeValid(decimal settledAmount)
    {
        var receipt = new Receipt { SettledAmount = settledAmount };
        receipt.SettledAmount.Should().Be(settledAmount);
    }

    [Theory]
    [InlineData(0.00)]
    [InlineData(100.00)]
    [InlineData(50000.00)]
    public void TransportOffering_BaseFee_BoundaryValues_ShouldBeValid(decimal baseFee)
    {
        var offering = new TransportOffering { BaseFee = baseFee };
        offering.BaseFee.Should().Be(baseFee);
    }

    [Theory]
    [InlineData(0.00)]
    [InlineData(15.50)]
    [InlineData(500.00)]
    public void TransportOffering_FeePerKm_BoundaryValues_ShouldBeValid(decimal feePerKm)
    {
        var offering = new TransportOffering { FeePerKm = feePerKm };
        offering.FeePerKm.Should().Be(feePerKm);
    }

    [Fact]
    public void Customer_IsCorporateAccount_Toggle_ShouldBeValid()
    {
        var customer = new Customer { IsCorporateAccount = true };
        customer.IsCorporateAccount.Should().BeTrue();

        customer.IsCorporateAccount = false;
        customer.IsCorporateAccount.Should().BeFalse();
    }
}
