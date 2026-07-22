using Microsoft.AspNetCore.Mvc;
using SmartFM.Application.DTOs.Tracking;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Interfaces;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrackingController : ControllerBase
{
    private readonly ITrackingService _trackingService;
    private readonly IRepository<TrackingRecord> _trackingRepository;
    private readonly IRepository<Shipment> _shipmentRepository;

    public TrackingController(
        ITrackingService trackingService,
        IRepository<TrackingRecord> trackingRepository,
        IRepository<Shipment> shipmentRepository)
    {
        _trackingService = trackingService;
        _trackingRepository = trackingRepository;
        _shipmentRepository = shipmentRepository;
    }

    /// <summary>GET /api/tracking/shipments – get all shipments for driver view</summary>
    [HttpGet("shipments")]
    public async Task<IActionResult> GetShipments()
    {
        var shipments = await _shipmentRepository.GetAllAsync();
        var result = shipments
            .Where(s => s.Status == Domain.Enums.ShipmentStatus.ReadyForPickup
                     || s.Status == Domain.Enums.ShipmentStatus.InTransit
                     || s.Status == Domain.Enums.ShipmentStatus.Delivered)
            .Select(s => new
            {
                s.Id,
                s.OrderId,
                Status = s.Status.ToString(),
                s.CreatedAt
            });
        return Ok(result);
    }

    /// <summary>GET /api/tracking/{shipmentId} – get tracking records for a shipment</summary>
    [HttpGet("{shipmentId:guid}")]
    public async Task<IActionResult> GetTrackingRecords(Guid shipmentId)
    {
        var records = await _trackingRepository.GetAllAsync();
        var filtered = records
            .Where(r => r.ShipmentId == shipmentId)
            .OrderByDescending(r => r.Timestamp)
            .Select(r => new
            {
                r.Id,
                r.ShipmentId,
                r.Timestamp,
                r.Location,
                r.StatusNote
            });
        return Ok(filtered);
    }

    /// <summary>POST /api/tracking/{shipmentId}/exceptions – log a delivery exception</summary>
    [HttpPost("{shipmentId:guid}/exceptions")]
    public async Task<IActionResult> LogException(Guid shipmentId, [FromBody] LogExceptionDto request)
    {
        await _trackingService.LogExceptionAsync(shipmentId, request);
        return NoContent();
    }
}
