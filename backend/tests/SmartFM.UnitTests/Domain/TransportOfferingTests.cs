using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for TransportOffering domain entity.
/// </summary>
public class TransportOfferingTests
{
    [Fact]
    public void NewTransportOffering_ShouldBeActive_ByDefault()
    {
        var offering = new TransportOffering();

        offering.IsActive.Should().BeTrue();
        offering.Name.Should().BeEmpty();
        offering.Description.Should().BeEmpty();
        offering.Orders.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void TransportOffering_Properties_ShouldBeAssignable()
    {
        var id = Guid.NewGuid();
        var date = DateTime.UtcNow;

        var offering = new TransportOffering
        {
            Id = id,
            Name = "Standard Transport",
            Description = "Standard speed truck delivery",
            Category = TransportCategory.Standard,
            MaxCapacityKg = 5000m,
            BaseFee = 150000m,
            FeePerKm = 12000m,
            IsActive = true,
            CreatedAt = date
        };

        offering.Id.Should().Be(id);
        offering.Name.Should().Be("Standard Transport");
        offering.Description.Should().Be("Standard speed truck delivery");
        offering.Category.Should().Be(TransportCategory.Standard);
        offering.MaxCapacityKg.Should().Be(5000m);
        offering.BaseFee.Should().Be(150000m);
        offering.FeePerKm.Should().Be(12000m);
        offering.IsActive.Should().BeTrue();
        offering.CreatedAt.Should().Be(date);
    }
}
