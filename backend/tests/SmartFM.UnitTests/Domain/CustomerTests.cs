using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for the Customer domain entity invariants.
/// </summary>
public class CustomerTests
{
    [Fact]
    public void NewCustomer_ShouldHave_DefaultProperties()
    {
        // Arrange & Act
        var customer = new Customer();

        // Assert
        customer.Name.Should().BeEmpty();
        customer.Email.Should().BeEmpty();
        customer.Phone.Should().BeEmpty();
        customer.CompanyName.Should().BeNull();
        customer.IsCorporateAccount.Should().BeFalse();
        customer.Orders.Should().BeEmpty();
    }

    [Fact]
    public void Customer_Properties_ShouldBeAssignable()
    {
        // Arrange
        var customerId = Guid.NewGuid();
        var date = DateTime.UtcNow;

        // Act
        var customer = new Customer
        {
            Id = customerId,
            Name = "ABC Logistics",
            Email = "contact@abclog.com",
            Phone = "+123456789",
            CompanyName = "ABC Corp Ltd",
            IsCorporateAccount = true,
            CreatedAt = date
        };

        // Assert
        customer.Id.Should().Be(customerId);
        customer.Name.Should().Be("ABC Logistics");
        customer.Email.Should().Be("contact@abclog.com");
        customer.Phone.Should().Be("+123456789");
        customer.CompanyName.Should().Be("ABC Corp Ltd");
        customer.IsCorporateAccount.Should().BeTrue();
        customer.CreatedAt.Should().Be(date);
    }
}
