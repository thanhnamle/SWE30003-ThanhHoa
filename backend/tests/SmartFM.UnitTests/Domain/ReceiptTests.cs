using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for the Receipt domain entity invariants (immutable after creation).
/// </summary>
public class ReceiptTests
{
    [Fact]
    public void NewReceipt_ShouldHave_DefaultProperties()
    {
        // Arrange & Act
        var receipt = new Receipt();

        // Assert
        receipt.TransactionReference.Should().BeEmpty();
        receipt.SettledAmount.Should().Be(0m);
        receipt.IssuedAt.Should().Be(default);
    }

    [Fact]
    public void Receipt_Properties_ShouldBeAssignable_AtInitialization()
    {
        // Arrange
        var receiptId = Guid.NewGuid();
        var paymentId = Guid.NewGuid();
        var date = DateTime.UtcNow;

        // Act
        var receipt = new Receipt
        {
            Id = receiptId,
            PaymentId = paymentId,
            SettledAmount = 1500.50m,
            TransactionReference = "TXN12345",
            IssuedAt = date
        };

        // Assert
        receipt.Id.Should().Be(receiptId);
        receipt.PaymentId.Should().Be(paymentId);
        receipt.SettledAmount.Should().Be(1500.50m);
        receipt.TransactionReference.Should().Be("TXN12345");
        receipt.IssuedAt.Should().Be(date);
    }
}
