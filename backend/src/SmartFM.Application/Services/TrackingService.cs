using System;
using System.Threading.Tasks;
using SmartFM.Application.DTOs.Tracking;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;
using SmartFM.Domain.Exceptions;
using SmartFM.Domain.Interfaces;

namespace SmartFM.Application.Services;

public class TrackingService : ITrackingService
{
    private readonly IRepository<Shipment> _shipmentRepository;
    private readonly IRepository<DeliveryException> _exceptionRepository;

    public TrackingService(
        IRepository<Shipment> shipmentRepository,
        IRepository<DeliveryException> exceptionRepository)
    {
        _shipmentRepository = shipmentRepository;
        _exceptionRepository = exceptionRepository;
    }

    public async Task LogExceptionAsync(Guid shipmentId, LogExceptionDto request)
    {
        var shipment = await _shipmentRepository.GetByIdAsync(shipmentId);
        if (shipment == null) throw new BusinessRuleException("Shipment not found.");

        var deliveryException = new DeliveryException
        {
            Id = Guid.NewGuid(),
            ShipmentId = shipmentId,
            Type = request.Type,
            Status = ExceptionStatus.Open,
            Description = request.Description,
            RaisedAt = DateTime.UtcNow
        };

        if (request.Type == ExceptionType.VehicleBreakdown || request.Type == ExceptionType.CargoDelay)
        {
            shipment.Status = ShipmentStatus.ExceptionPending;
        }

        await _exceptionRepository.AddAsync(deliveryException);
        await _shipmentRepository.UpdateAsync(shipment);
    }
}
