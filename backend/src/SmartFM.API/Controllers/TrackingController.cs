using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartFM.Application.DTOs.Tracking;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Interfaces;
using SmartFM.Infrastructure.Persistence;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrackingController : ControllerBase
{
    private readonly ITrackingService _trackingService;
    private readonly IRepository<TrackingRecord> _trackingRepository;
    private readonly SmartFmDbContext _dbContext;

    public TrackingController(
        ITrackingService trackingService,
        IRepository<TrackingRecord> trackingRepository,
        SmartFmDbContext dbContext)
    {
        _trackingService = trackingService;
        _trackingRepository = trackingRepository;
        _dbContext = dbContext;
    }

    /// <summary>GET /api/tracking/shipments – get all shipments for driver view</summary>
    [HttpGet("shipments")]
    public async Task<IActionResult> GetShipments()
    {
        var shipments = await _dbContext.Set<Shipment>()
            .Include(s => s.PickupDeliveryOption)
            .Include(s => s.Order).ThenInclude(o => o.Customer)
            .Where(s => s.Status == Domain.Enums.ShipmentStatus.ReadyForPickup
                     || s.Status == Domain.Enums.ShipmentStatus.InTransit
                     || s.Status == Domain.Enums.ShipmentStatus.Delivered)
            .ToListAsync();

        var result = shipments.Select(s => new
        {
            s.Id,
            s.OrderId,
            Status = s.Status.ToString(),
            s.CreatedAt,
            PickupDeliveryOption = s.PickupDeliveryOption != null ? new
            {
                s.PickupDeliveryOption.PickupAddress,
                s.PickupDeliveryOption.PickupWindowStart,
                s.PickupDeliveryOption.PickupWindowEnd,
                s.PickupDeliveryOption.DeliveryAddress,
                s.PickupDeliveryOption.DeliveryWindowStart,
                s.PickupDeliveryOption.DeliveryWindowEnd
            } : null,
            Order = s.Order != null ? new
            {
                CustomerName = s.Order.Customer?.Name ?? string.Empty
            } : null
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

    /// <summary>POST /api/tracking/exceptions/{exceptionId}/resolve - resolve an exception</summary>
    [HttpPut("exceptions/{exceptionId:guid}/resolve")]
    public async Task<IActionResult> ResolveException(Guid exceptionId, [FromBody] string? resolutionNotes)
    {
        await _trackingService.ResolveExceptionAsync(exceptionId, resolutionNotes ?? "Resolved via UI");
        return NoContent();
    }

    [HttpGet("{shipmentId:guid}/exceptions")]
    public async Task<IActionResult> GetExceptions(Guid shipmentId)
    {
        var exceptions = await _trackingService.GetExceptionsAsync(shipmentId);
        return Ok(exceptions);
    }

    [HttpPut("exceptions/{exceptionId:guid}/hold")]
    public async Task<IActionResult> HoldException(Guid exceptionId)
    {
        await _trackingService.HoldExceptionAsync(exceptionId);
        return NoContent();
    }

    [HttpPut("exceptions/{exceptionId:guid}/resume")]
    public async Task<IActionResult> ResumeException(Guid exceptionId)
    {
        await _trackingService.ResumeExceptionAsync(exceptionId);
        return NoContent();
    }

    /// <summary>POST /api/tracking/{shipmentId}/pod – submit proof of delivery</summary>
    [HttpPost("{shipmentId:guid}/pod")]
    public async Task<IActionResult> SubmitProofOfDelivery(Guid shipmentId, [FromBody] SubmitPodDto request)
    {
        await _trackingService.SubmitProofOfDeliveryAsync(shipmentId, request.SignatureImageBase64, request.Notes);
        return Ok(new { success = true, deliveredAt = DateTime.UtcNow });
    }

    /// <summary>POST /api/tracking/{shipmentId}/status – update status</summary>
    [HttpPost("{shipmentId:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid shipmentId, [FromBody] UpdateTrackingStatusDto request)
    {
        await _trackingService.UpdateTrackingAsync(shipmentId, request.Location ?? "Unknown", request.Status ?? "Status updated");
        return NoContent();
    }
}

public class SubmitPodDto
{
    public string SignatureImageBase64 { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class UpdateTrackingStatusDto
{
    public string? Status { get; set; }
    public string? Location { get; set; }
}
