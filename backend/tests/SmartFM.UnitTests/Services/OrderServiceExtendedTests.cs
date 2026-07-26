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
/// Extended unit tests for OrderService edge cases.
/// </summary>
public class OrderServiceExtendedTests
{
    private readonly Mock<IRepository<Order>> _orderRepoMock;
    private readonly Mock<IRepository<TransportOffering>> _offeringRepoMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly OrderService _orderService;

    public OrderServiceExtendedTests()
    {
        _orderRepoMock = new Mock<IRepository<Order>>();
        _offeringRepoMock = new Mock<IRepository<TransportOffering>>();
        _notificationServiceMock = new Mock<INotificationService>();

        _offeringRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new TransportOffering { BaseFee = 500000, FeePerKm = 15000, IsActive = true });

        _orderService = new OrderService(_orderRepoMock.Object, _offeringRepoMock.Object, _notificationServiceMock.Object);
    }

    [Theory]
    [InlineData(-0.001, 10.0)]
    [InlineData(10.0, -0.001)]
    [InlineData(-5.0, -5.0)]
    public async Task PlaceOrderAsync_InvalidWeightOrVolumeCombinations_ShouldThrow(decimal weight, decimal volume)
    {
        var request = new CreateOrderDto
        {
            CustomerId = Guid.NewGuid(),
            BranchId = Guid.NewGuid(),
            TransportOfferingId = Guid.NewGuid(),
            CargoWeightKg = weight,
            CargoVolumeM3 = volume
        };

        var act = () => _orderService.PlaceOrderAsync(request);

        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Cargo weight and volume must be greater than 0.");
    }

    [Fact]
    public async Task PlaceOrderAsync_LargeOrder_ShouldSucceed()
    {
        var request = new CreateOrderDto
        {
            CustomerId = Guid.NewGuid(),
            BranchId = Guid.NewGuid(),
            TransportOfferingId = Guid.NewGuid(),
            CargoWeightKg = 50000m,
            CargoVolumeM3 = 150m,
            SpecialHandlingNotes = "Heavy machinery parts"
        };

        _orderRepoMock.Setup(r => r.AddAsync(It.IsAny<Order>())).ReturnsAsync((Order o) => o);

        var result = await _orderService.PlaceOrderAsync(request);

        result.Should().NotBeNull();
        result.CargoWeightKg.Should().Be(50000m);
        result.CargoVolumeM3.Should().Be(150m);
        result.Status.Should().Be(OrderStatus.Pending);
    }
}
