#pragma warning disable CS8620
using System;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Xunit;
using SmartFM.Application.DTOs.Payments;
using SmartFM.Application.Services;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;
using SmartFM.Domain.Exceptions;
using SmartFM.Domain.Interfaces;

namespace SmartFM.UnitTests.Services;

/// <summary>
/// Unit tests for the PaymentService business rules.
/// </summary>
public class PaymentServiceTests
{
    private readonly Mock<IRepository<Invoice>> _invoiceRepoMock;
    private readonly Mock<IRepository<Payment>> _paymentRepoMock;
    private readonly Mock<IRepository<Receipt>> _receiptRepoMock;
    private readonly PaymentService _paymentService;

    public PaymentServiceTests()
    {
        _invoiceRepoMock = new Mock<IRepository<Invoice>>();
        _paymentRepoMock = new Mock<IRepository<Payment>>();
        _receiptRepoMock = new Mock<IRepository<Receipt>>();

        _paymentService = new PaymentService(
            _invoiceRepoMock.Object,
            _paymentRepoMock.Object,
            _receiptRepoMock.Object
        );
    }

    [Fact]
    public async Task ProcessPaymentAsync_ValidData_ShouldSucceed_AndGenerateReceipt()
    {
        // Arrange
        var invoiceId = Guid.NewGuid();
        var invoice = new Invoice { Id = invoiceId, Amount = 1200m, Status = InvoiceStatus.Unpaid };

        _invoiceRepoMock.Setup(r => r.GetByIdAsync(invoiceId)).ReturnsAsync(invoice);

        var dto = new ProcessPaymentDto
        {
            Amount = 1200m,
            Method = PaymentMethod.CreditCard
        };

        // Act
        var result = await _paymentService.ProcessPaymentAsync(invoiceId, dto);

        // Assert
        result.Should().NotBeNull();
        result.Status.Should().Be(PaymentStatus.Success);
        result.Message.Should().Be("Thanh toán thành công và Biên lai đã được xuất!");

        _paymentRepoMock.Verify(r => r.AddAsync(It.Is<Payment>(p => p.Amount == 1200m && p.Status == PaymentStatus.Success)), Times.Once);
        _receiptRepoMock.Verify(r => r.AddAsync(It.Is<Receipt>(rc => rc.SettledAmount == 1200m)), Times.Once);
        _invoiceRepoMock.Verify(r => r.UpdateAsync(It.Is<Invoice>(i => i.Status == InvoiceStatus.Paid)), Times.Once);
    }

    [Fact]
    public async Task ProcessPaymentAsync_InvoiceNotFound_ShouldThrow_BusinessRuleException()
    {
        // Arrange
        var invoiceId = Guid.NewGuid();
        _invoiceRepoMock.Setup(r => r.GetByIdAsync(invoiceId)).ReturnsAsync((Invoice?)null);

        var dto = new ProcessPaymentDto { Amount = 500m };

        // Act & Assert
        var act = () => _paymentService.ProcessPaymentAsync(invoiceId, dto);
        await act.Should().ThrowAsync<BusinessRuleException>().WithMessage("Không tìm thấy Hóa đơn.");
    }

    [Fact]
    public async Task ProcessPaymentAsync_AlreadyPaidInvoice_ShouldThrow_BusinessRuleException()
    {
        // Arrange
        var invoiceId = Guid.NewGuid();
        var invoice = new Invoice { Id = invoiceId, Amount = 1200m, Status = InvoiceStatus.Paid };

        _invoiceRepoMock.Setup(r => r.GetByIdAsync(invoiceId)).ReturnsAsync(invoice);

        var dto = new ProcessPaymentDto { Amount = 1200m };

        // Act & Assert
        var act = () => _paymentService.ProcessPaymentAsync(invoiceId, dto);
        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Hóa đơn này đã được thanh toán hoàn tất, không thể thanh toán lại!");
    }

    [Fact]
    public async Task ProcessPaymentAsync_InsufficientAmount_ShouldThrow_BusinessRuleException()
    {
        // Arrange
        var invoiceId = Guid.NewGuid();
        var invoice = new Invoice { Id = invoiceId, Amount = 1200m, Status = InvoiceStatus.Unpaid };

        _invoiceRepoMock.Setup(r => r.GetByIdAsync(invoiceId)).ReturnsAsync(invoice);

        var dto = new ProcessPaymentDto { Amount = 1199.99m }; // Just under the amount

        // Act & Assert
        var act = () => _paymentService.ProcessPaymentAsync(invoiceId, dto);
        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Số tiền thanh toán không đủ so với giá trị hóa đơn.");
    }
}
