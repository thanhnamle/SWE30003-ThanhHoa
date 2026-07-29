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
    private readonly Mock<IRepository<TrackingRecord>> _trackingRepoMock;
    private readonly Mock<IRepository<Order>> _orderRepoMock;
    private readonly TrackingService _trackingService;

    public TrackingServiceTests()
    {
        _shipmentRepoMock = new Mock<IRepository<Shipment>>();
        _exceptionRepoMock = new Mock<IRepository<DeliveryException>>();
        _trackingRepoMock = new Mock<IRepository<TrackingRecord>>();
        _orderRepoMock = new Mock<IRepository<Order>>();

        _trackingService = new TrackingService(
            _shipmentRepoMock.Object,
            _exceptionRepoMock.Object,
            _trackingRepoMock.Object,
            _orderRepoMock.Object
        );
    }

    [Theory]
    [InlineData(ExceptionType.VehicleBreakdown, ShipmentStatus.ExceptionPending)]
    [InlineData(ExceptionType.CargoDelay, ShipmentStatus.ExceptionPending)]
    [InlineData(ExceptionType.WrongAddress, ShipmentStatus.ExceptionPending)]
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

    [Fact]
    public async Task UpdateTrackingAsync_ValidShipment_ShouldAddTracking_AndChangeStatusToInTransit_IfReadyForPickup()
    {
        var shipmentId = Guid.NewGuid();
        var shipment = new Shipment { Id = shipmentId, Status = ShipmentStatus.ReadyForPickup };
        _shipmentRepoMock.Setup(r => r.GetByIdAsync(shipmentId)).ReturnsAsync(shipment);

        await _trackingService.UpdateTrackingAsync(shipmentId, "HN", "Departed");

        _trackingRepoMock.Verify(r => r.AddAsync(It.Is<TrackingRecord>(t => t.ShipmentId == shipmentId && t.Location == "HN" && t.StatusNote == "Departed")), Times.Once);
        _shipmentRepoMock.Verify(r => r.UpdateAsync(It.Is<Shipment>(s => s.Status == ShipmentStatus.InTransit)), Times.Once);
    }

    [Fact]
    public async Task ResolveExceptionAsync_ValidException_ShouldResolve_AndResumeShipment()
    {
        var exceptionId = Guid.NewGuid();
        var shipmentId = Guid.NewGuid();
        var exception = new DeliveryException { Id = exceptionId, ShipmentId = shipmentId, Status = ExceptionStatus.Open };
        var shipment = new Shipment { Id = shipmentId, Status = ShipmentStatus.ExceptionPending };

        _exceptionRepoMock.Setup(r => r.GetByIdAsync(exceptionId)).ReturnsAsync(exception);
        _shipmentRepoMock.Setup(r => r.GetByIdAsync(shipmentId)).ReturnsAsync(shipment);

        await _trackingService.ResolveExceptionAsync(exceptionId, "Fixed tire");

        _exceptionRepoMock.Verify(r => r.UpdateAsync(It.Is<DeliveryException>(e => e.Status == ExceptionStatus.Resolved && e.ResolutionAction == "Fixed tire")), Times.Once);
        _shipmentRepoMock.Verify(r => r.UpdateAsync(It.Is<Shipment>(s => s.Status == ShipmentStatus.InTransit)), Times.Once);
        _trackingRepoMock.Verify(r => r.AddAsync(It.Is<TrackingRecord>(t => t.ShipmentId == shipmentId && t.StatusNote.Contains("Fixed tire"))), Times.Once);
    }

    [Fact]
    public async Task SubmitProofOfDeliveryAsync_ValidShipment_ShouldMarkDelivered_AndAddTracking()
    {
        var shipmentId = Guid.NewGuid();
        var orderId = Guid.NewGuid();
        var shipment = new Shipment { Id = shipmentId, OrderId = orderId, Status = ShipmentStatus.InTransit };
        var order = new Order { Id = orderId, Status = OrderStatus.Validated };

        _shipmentRepoMock.Setup(r => r.GetByIdAsync(shipmentId)).ReturnsAsync(shipment);
        _orderRepoMock.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync(order);

        await _trackingService.SubmitProofOfDeliveryAsync(shipmentId, "base64", "Left at front door");

        _shipmentRepoMock.Verify(r => r.UpdateAsync(It.Is<Shipment>(s => s.Status == ShipmentStatus.Delivered)), Times.Once);
        _orderRepoMock.Verify(r => r.UpdateAsync(It.Is<Order>(o => o.Status == OrderStatus.Validated)), Times.Once);
        _trackingRepoMock.Verify(r => r.AddAsync(It.Is<TrackingRecord>(t => t.ShipmentId == shipmentId && t.StatusNote.Contains("Left at front door"))), Times.Once);
    }

    [Fact]
    public async Task SubmitProofOfDeliveryAsync_AlreadyDelivered_ShouldThrow()
    {
        var shipmentId = Guid.NewGuid();
        var shipment = new Shipment { Id = shipmentId, Status = ShipmentStatus.Delivered };
        _shipmentRepoMock.Setup(r => r.GetByIdAsync(shipmentId)).ReturnsAsync(shipment);

        var act = () => _trackingService.SubmitProofOfDeliveryAsync(shipmentId, "base64", "notes");
        await act.Should().ThrowAsync<BusinessRuleException>().WithMessage("Shipment is already delivered.");
    }

    [Fact]
    public async Task HoldExceptionAsync_OpenException_ShouldHold()
    {
        var exceptionId = Guid.NewGuid();
        var exception = new DeliveryException { Id = exceptionId, Status = ExceptionStatus.Open };
        _exceptionRepoMock.Setup(r => r.GetByIdAsync(exceptionId)).ReturnsAsync(exception);

        await _trackingService.HoldExceptionAsync(exceptionId);

        _exceptionRepoMock.Verify(r => r.UpdateAsync(It.Is<DeliveryException>(e => e.Status == ExceptionStatus.OnHold)), Times.Once);
    }

    [Fact]
    public async Task HoldExceptionAsync_NotOpenException_ShouldThrow()
    {
        var exceptionId = Guid.NewGuid();
        var exception = new DeliveryException { Id = exceptionId, Status = ExceptionStatus.Resolved };
        _exceptionRepoMock.Setup(r => r.GetByIdAsync(exceptionId)).ReturnsAsync(exception);

        var act = () => _trackingService.HoldExceptionAsync(exceptionId);
        await act.Should().ThrowAsync<BusinessRuleException>().WithMessage("Only Open exceptions can be put on hold.");
    }

    [Fact]
    public async Task ResumeExceptionAsync_OnHoldException_ShouldResume()
    {
        var exceptionId = Guid.NewGuid();
        var exception = new DeliveryException { Id = exceptionId, Status = ExceptionStatus.OnHold };
        _exceptionRepoMock.Setup(r => r.GetByIdAsync(exceptionId)).ReturnsAsync(exception);

        await _trackingService.ResumeExceptionAsync(exceptionId);

        _exceptionRepoMock.Verify(r => r.UpdateAsync(It.Is<DeliveryException>(e => e.Status == ExceptionStatus.Open)), Times.Once);
    }

    [Fact]
    public async Task ResumeExceptionAsync_NotOnHoldException_ShouldThrow()
    {
        var exceptionId = Guid.NewGuid();
        var exception = new DeliveryException { Id = exceptionId, Status = ExceptionStatus.Open };
        _exceptionRepoMock.Setup(r => r.GetByIdAsync(exceptionId)).ReturnsAsync(exception);

        var act = () => _trackingService.ResumeExceptionAsync(exceptionId);
        await act.Should().ThrowAsync<BusinessRuleException>().WithMessage("Only OnHold exceptions can be resumed.");
    }
}
