using System;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Xunit;
using SmartFM.Application.DTOs.Orders;
using SmartFM.Application.Services;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;
using SmartFM.Domain.Exceptions;
using SmartFM.Domain.Interfaces;

namespace SmartFM.UnitTests.Services;

/// <summary>
/// Unit tests for the OrderService business rules.
/// </summary>
public class OrderServiceTests
{
    private readonly Mock<IRepository<Order>> _orderRepoMock;
    private readonly OrderService _orderService;

    public OrderServiceTests()
    {
        _orderRepoMock = new Mock<IRepository<Order>>();
        _orderService = new OrderService(_orderRepoMock.Object);
    }

    [Fact]
    public async Task PlaceOrderAsync_ValidRequest_ShouldCreateOrder_WithPendingStatus()
    {
        // Arrange
        var request = new CreateOrderDto
        {
            CustomerId = Guid.NewGuid(),
            BranchId = Guid.NewGuid(),
            TransportOfferingId = Guid.NewGuid(),
            CargoWeightKg = 500.5m,
            CargoVolumeM3 = 4.2m,
            SpecialHandlingNotes = "Fragile glass items"
        };

        Order? savedOrder = null;
        _orderRepoMock.Setup(r => r.AddAsync(It.IsAny<Order>()))
            .Callback<Order>(o => savedOrder = o)
            .ReturnsAsync((Order o) => o);

        // Act
        var result = await _orderService.PlaceOrderAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Status.Should().Be(OrderStatus.Pending);
        result.CargoWeightKg.Should().Be(500.5m);
        result.CargoVolumeM3.Should().Be(4.2m);
        result.SpecialHandlingNotes.Should().Be("Fragile glass items");

        _orderRepoMock.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Once);
        savedOrder.Should().NotBeNull();
        savedOrder!.Status.Should().Be(OrderStatus.Pending);
        savedOrder.CustomerId.Should().Be(request.CustomerId);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-10.5)]
    public async Task PlaceOrderAsync_InvalidWeight_ShouldThrow_BusinessRuleException(decimal invalidWeight)
    {
        // Arrange
        var request = new CreateOrderDto
        {
            CustomerId = Guid.NewGuid(),
            BranchId = Guid.NewGuid(),
            TransportOfferingId = Guid.NewGuid(),
            CargoWeightKg = invalidWeight,
            CargoVolumeM3 = 4.2m
        };

        // Act & Assert
        var act = () => _orderService.PlaceOrderAsync(request);
        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Trọng lượng và Thể tích hàng hóa phải lớn hơn 0.");

        _orderRepoMock.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Never);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-2.0)]
    public async Task PlaceOrderAsync_InvalidVolume_ShouldThrow_BusinessRuleException(decimal invalidVolume)
    {
        // Arrange
        var request = new CreateOrderDto
        {
            CustomerId = Guid.NewGuid(),
            BranchId = Guid.NewGuid(),
            TransportOfferingId = Guid.NewGuid(),
            CargoWeightKg = 150m,
            CargoVolumeM3 = invalidVolume
        };

        // Act & Assert
        var act = () => _orderService.PlaceOrderAsync(request);
        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Trọng lượng và Thể tích hàng hóa phải lớn hơn 0.");

        _orderRepoMock.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Never);
    }
}
