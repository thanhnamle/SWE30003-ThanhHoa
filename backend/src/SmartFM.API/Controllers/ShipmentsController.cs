using Microsoft.AspNetCore.Mvc;
using SmartFM.Application.DTOs.Shipments;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Interfaces;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShipmentsController : ControllerBase
{
    private readonly IShipmentService _shipmentService;
    private readonly IRepository<Shipment> _shipmentRepository;

    public ShipmentsController(IShipmentService shipmentService, IRepository<Shipment> shipmentRepository)
    {
        _shipmentService = shipmentService;
        _shipmentRepository = shipmentRepository;
    }

    /// <summary>GET /api/shipments – list all shipments</summary>
    [HttpGet]
    public async Task<IActionResult> GetShipments()
    {
        var shipments = await _shipmentRepository.GetAllAsync();
        var result = shipments.Select(s => new ShipmentResponseDto
        {
            Id = s.Id,
            OrderId = s.OrderId,
            Status = s.Status,
            CreatedAt = s.CreatedAt,
            Message = string.Empty
        });
        return Ok(result);
    }

    /// <summary>GET /api/shipments/{id}</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetShipment(Guid id)
    {
        var shipment = await _shipmentRepository.GetByIdAsync(id);
        if (shipment == null) return NotFound(new { message = "Shipment not found." });
        return Ok(new ShipmentResponseDto
        {
            Id = shipment.Id,
            OrderId = shipment.OrderId,
            Status = shipment.Status,
            CreatedAt = shipment.CreatedAt
        });
    }

    /// <summary>POST /api/shipments/{id}/assign – assign vehicle & driver</summary>
    [HttpPost("{id:guid}/assign")]
    public async Task<IActionResult> AssignResources(Guid id, [FromBody] AssignResourcesDto request)
    {
        var result = await _shipmentService.AssignResourcesAsync(id, request);
        return Ok(result);
    }
}
