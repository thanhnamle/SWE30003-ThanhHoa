#pragma warning disable CS8620
using System;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Xunit;
using SmartFM.Application.DTOs.Tracking;
using SmartFM.Application.Services;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;
using SmartFM.Domain.Exceptions;
using SmartFM.Domain.Interfaces;

namespace SmartFM.UnitTests.Services;

/// <summary>
/// Unit tests for the TrackingService business rules.
/// </summary>
public class TrackingServiceTests
{
    private readonly Mock<IRepository<Shipment>> _shipmentRepoMock;
    private readonly Mock<IRepository<DeliveryException>> _exceptionRepoMock;
    private readonly TrackingService _trackingService;

    public TrackingServiceTests()
    {
        _shipmentRepoMock = new Mock<IRepository<Shipment>>();
        _exceptionRepoMock = new Mock<IRepository<DeliveryException>>();

        _trackingService = new TrackingService(
            _shipmentRepoMock.Object,
            _exceptionRepoMock.Object
        );
    }

    [Theory]
    [InlineData(ExceptionType.VehicleBreakdown, ShipmentStatus.ExceptionPending)]
    [InlineData(ExceptionType.CargoDelay, ShipmentStatus.ExceptionPending)]
    [InlineData(ExceptionType.WrongAddress, ShipmentStatus.Preparing)]
    public async Task LogExceptionAsync_ValidData_ShouldCreateException_AndHandleStatus(ExceptionType exceptionType, ShipmentStatus expectedShipmentStatus)
    {
        var shipmentId = Guid.NewGuid();
        var shipment = new Shipment { Id = shipmentId, Status = ShipmentStatus.Preparing };

        _shipmentRepoMock.Setup(r => r.GetByIdAsync(shipmentId)).ReturnsAsync(shipment);

        var dto = new LogExceptionDto
        {
            Type = exceptionType,
            Description = "Encountered a problem during transit"
        };

        await _trackingService.LogExceptionAsync(shipmentId, dto);

        _exceptionRepoMock.Verify(r => r.AddAsync(It.Is<DeliveryException>(e => 
            e.ShipmentId == shipmentId && 
            e.Type == exceptionType && 
            e.Status == ExceptionStatus.Open && 
            e.Description == "Encountered a problem during transit"
        )), Times.Once);

        _shipmentRepoMock.Verify(r => r.UpdateAsync(It.Is<Shipment>(s => s.Status == expectedShipmentStatus)), Times.Once);
        shipment.Status.Should().Be(expectedShipmentStatus);
    }

    [Fact]
    public async Task LogExceptionAsync_ShipmentNotFound_ShouldThrow_BusinessRuleException()
    {
        var shipmentId = Guid.NewGuid();
        _shipmentRepoMock.Setup(r => r.GetByIdAsync(shipmentId)).ReturnsAsync((Shipment?)null);

        var dto = new LogExceptionDto { Type = ExceptionType.VehicleBreakdown, Description = "Breakdown" };

        var act = () => _trackingService.LogExceptionAsync(shipmentId, dto);
        await act.Should().ThrowAsync<BusinessRuleException>().WithMessage("Shipment not found.");
    }
}
