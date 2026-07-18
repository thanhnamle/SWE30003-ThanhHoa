using Microsoft.AspNetCore.Mvc;
using SmartFM.Application.DTOs.Shipments;
using SmartFM.Application.Interfaces;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShipmentsController : ControllerBase
{
    private readonly IShipmentService _shipmentService;

    // Bơm IShipmentService vào Controller
    public ShipmentsController(IShipmentService shipmentService)
    {
        _shipmentService = shipmentService;
    }

    // Endpoint: POST /api/shipments/{id}/assign
    [HttpPost("{id:guid}/assign")]
    public async Task<IActionResult> AssignResources(Guid id, [FromBody] AssignResourcesDto request)
    {
        // Controller chỉ làm nhiệm vụ gọi Service
        var result = await _shipmentService.AssignResourcesAsync(id, request);
        
        // Trả về mã 200 OK cùng với kết quả
        return Ok(result);
    }
}
