using Microsoft.AspNetCore.Mvc;
using SmartFM.Application.DTOs.Tracking;
using SmartFM.Application.Interfaces;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrackingController : ControllerBase
{
    private readonly ITrackingService _trackingService;

    public TrackingController(ITrackingService trackingService)
    {
        _trackingService = trackingService;
    }

    // Endpoint: POST /api/tracking/{shipmentId}/exceptions
    [HttpPost("{shipmentId:guid}/exceptions")]
    public async Task<IActionResult> LogException(Guid shipmentId, [FromBody] LogExceptionDto request)
    {
        await _trackingService.LogExceptionAsync(shipmentId, request);
        
        // Vì hành động log lỗi không trả về data, ta dùng NoContent (Mã 204)
        return NoContent(); 
    }
}
