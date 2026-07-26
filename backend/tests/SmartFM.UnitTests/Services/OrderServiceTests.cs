using System;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Xunit;
using SmartFM.Application.DTOs.Orders;
using SmartFM.Application.Interfaces;
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
    private readonly Mock<IRepository<TransportOffering>> _offeringRepoMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly OrderService _orderService;

    public OrderServiceTests()
    {
        _orderRepoMock = new Mock<IRepository<Order>>();
        _offeringRepoMock = new Mock<IRepository<TransportOffering>>();
        _notificationServiceMock = new Mock<INotificationService>();

        _offeringRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new TransportOffering { BaseFee = 500000, FeePerKm = 15000, IsActive = true });

        _orderService = new OrderService(_orderRepoMock.Object, _offeringRepoMock.Object, _notificationServiceMock.Object);
    }

    [Fact]
    public async Task PlaceOrderAsync_ValidRequest_ShouldCreateOrder_WithPendingStatus()
    {
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

        var result = await _orderService.PlaceOrderAsync(request);

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
        var request = new CreateOrderDto
        {
            CustomerId = Guid.NewGuid(),
            BranchId = Guid.NewGuid(),
            TransportOfferingId = Guid.NewGuid(),
            CargoWeightKg = invalidWeight,
            CargoVolumeM3 = 4.2m
        };

        var act = () => _orderService.PlaceOrderAsync(request);
        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Cargo weight and volume must be greater than 0.");

        _orderRepoMock.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Never);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-2.0)]
    public async Task PlaceOrderAsync_InvalidVolume_ShouldThrow_BusinessRuleException(decimal invalidVolume)
    {
        var request = new CreateOrderDto
        {
            CustomerId = Guid.NewGuid(),
            BranchId = Guid.NewGuid(),
            TransportOfferingId = Guid.NewGuid(),
            CargoWeightKg = 150m,
            CargoVolumeM3 = invalidVolume
        };

        var act = () => _orderService.PlaceOrderAsync(request);
        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Cargo weight and volume must be greater than 0.");

        _orderRepoMock.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Never);
    }

    [Fact]
    public async Task PlaceOrderAsync_BothWeightAndVolumeNegative_ShouldThrow_BusinessRuleException()
    {
        var request = new CreateOrderDto
        {
            CustomerId = Guid.NewGuid(),
            BranchId = Guid.NewGuid(),
            TransportOfferingId = Guid.NewGuid(),
            CargoWeightKg = -100m,
            CargoVolumeM3 = -5m
        };

        var act = () => _orderService.PlaceOrderAsync(request);
        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Cargo weight and volume must be greater than 0.");

        _orderRepoMock.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Never);
    }

    [Fact]
    public async Task PlaceOrderAsync_BoundaryValues_ShouldSucceed()
    {
        var request = new CreateOrderDto
        {
            CustomerId = Guid.NewGuid(),
            BranchId = Guid.NewGuid(),
            TransportOfferingId = Guid.NewGuid(),
            CargoWeightKg = 0.01m,
            CargoVolumeM3 = 0.01m
        };

        _orderRepoMock.Setup(r => r.AddAsync(It.IsAny<Order>())).ReturnsAsync((Order o) => o);

        var result = await _orderService.PlaceOrderAsync(request);

        result.Should().NotBeNull();
        result.CargoWeightKg.Should().Be(0.01m);
        result.CargoVolumeM3.Should().Be(0.01m);
    }

    [Fact]
    public async Task PlaceOrderAsync_NullSpecialHandlingNotes_ShouldDefaultToEmptyString()
    {
        var request = new CreateOrderDto
        {
            CustomerId = Guid.NewGuid(),
            BranchId = Guid.NewGuid(),
            TransportOfferingId = Guid.NewGuid(),
            CargoWeightKg = 100m,
            CargoVolumeM3 = 2m,
            SpecialHandlingNotes = null!
        };

        Order? savedOrder = null;
        _orderRepoMock.Setup(r => r.AddAsync(It.IsAny<Order>()))
            .Callback<Order>(o => savedOrder = o)
            .ReturnsAsync((Order o) => o);

        await _orderService.PlaceOrderAsync(request);

        savedOrder.Should().NotBeNull();
        savedOrder!.SpecialHandlingNotes.Should().BeEmpty();
    }
}
