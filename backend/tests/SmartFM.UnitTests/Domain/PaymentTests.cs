using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for the Payment domain entity invariants.
/// </summary>
public class PaymentTests
{
    [Fact]
    public void NewPayment_ShouldHave_PendingStatus_ByDefault()
    {
        // Arrange & Act
        var payment = new Payment();

        // Assert
        payment.Status.Should().Be(PaymentStatus.Pending);
        payment.Receipt.Should().BeNull();
    }

    [Fact]
    public void Payment_Properties_ShouldBeAssignable()
    {
        // Arrange
        var paymentId = Guid.NewGuid();
        var invoiceId = Guid.NewGuid();
        var date = DateTime.UtcNow;

        // Act
        var payment = new Payment
        {
            Id = paymentId,
            InvoiceId = invoiceId,
            Amount = 1500.50m,
            Method = PaymentMethod.BankTransfer,
            Status = PaymentStatus.Success,
            AttemptedAt = date
        };

        // Assert
        payment.Id.Should().Be(paymentId);
        payment.InvoiceId.Should().Be(invoiceId);
        payment.Amount.Should().Be(1500.50m);
        payment.Method.Should().Be(PaymentMethod.BankTransfer);
        payment.Status.Should().Be(PaymentStatus.Success);
        payment.AttemptedAt.Should().Be(date);
    }
}
