using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for the Invoice domain entity invariants.
/// </summary>
public class InvoiceTests
{
    [Fact]
    public void NewInvoice_ShouldHave_UnpaidStatus_ByDefault()
    {
        // Arrange & Act
        var invoice = new Invoice();

        // Assert
        invoice.Status.Should().Be(InvoiceStatus.Unpaid);
        invoice.Payments.Should().BeEmpty();
    }

    [Fact]
    public void Invoice_Properties_ShouldBeAssignable()
    {
        // Arrange
        var invoiceId = Guid.NewGuid();
        var orderId = Guid.NewGuid();
        var date = DateTime.UtcNow;

        // Act
        var invoice = new Invoice
        {
            Id = invoiceId,
            OrderId = orderId,
            Amount = 1500.50m,
            Status = InvoiceStatus.Paid,
            IssuedAt = date
        };

        // Assert
        invoice.Id.Should().Be(invoiceId);
        invoice.OrderId.Should().Be(orderId);
        invoice.Amount.Should().Be(1500.50m);
        invoice.Status.Should().Be(InvoiceStatus.Paid);
        invoice.IssuedAt.Should().Be(date);
    }
}
