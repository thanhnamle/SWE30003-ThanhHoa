using Microsoft.AspNetCore.Mvc;
using SmartFM.Application.DTOs.Shipments;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Interfaces;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using SmartFM.Infrastructure.Persistence;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShipmentsController : ControllerBase
{
    private readonly IShipmentService _shipmentService;
    private readonly SmartFmDbContext _dbContext;

    public ShipmentsController(IShipmentService shipmentService, SmartFmDbContext dbContext)
    {
        _shipmentService = shipmentService;
        _dbContext = dbContext;
    }

    /// <summary>GET /api/shipments – list all shipments</summary>
    [HttpGet]
    public async Task<IActionResult> GetShipments()
    {
        // Auto-heal missing Shipment entities for any existing/seeded non-cancelled orders
        var existingOrderIds = await _dbContext.Set<Shipment>().Select(s => s.OrderId).ToListAsync();
        var missingOrders = await _dbContext.Set<Order>()
            .Where(o => o.Status != OrderStatus.Cancelled && !existingOrderIds.Contains(o.Id))
            .ToListAsync();

        if (missingOrders.Any())
        {
            foreach (var order in missingOrders)
            {
                var newShipment = new Shipment
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    Status = ShipmentStatus.Preparing,
                    CreatedAt = order.CreatedAt
                };
                await _dbContext.Set<Shipment>().AddAsync(newShipment);
            }
            await _dbContext.SaveChangesAsync();
        }

        var shipments = await _dbContext.Set<Shipment>()
            .Include(s => s.VehicleAssignment!).ThenInclude(v => v.Vehicle)
            .Include(s => s.DriverAssignment!).ThenInclude(d => d.Driver)
            .Include(s => s.Order!).ThenInclude(o => o.Customer)
            .Include(s => s.Order!).ThenInclude(o => o.TransportOffering)
            .Include(s => s.PickupDeliveryOption)
            .Where(s => s.Order == null || s.Order.Status != OrderStatus.Cancelled)
            .ToListAsync();

        var result = shipments.Select(s => new ShipmentResponseDto
        {
            Id = s.Id,
            OrderId = s.OrderId,
            Status = s.Status,
            CreatedAt = s.CreatedAt,
            Message = string.Empty,
            VehicleAssignment = s.VehicleAssignment != null ? new VehicleAssignmentDto 
            { 
                VehicleId = s.VehicleAssignment.VehicleId, 
                VehiclePlate = s.VehicleAssignment.Vehicle?.PlateNumber ?? string.Empty,
                VehicleType = s.VehicleAssignment.Vehicle?.Type.ToString() ?? string.Empty
            } : null,
            DriverAssignment = s.DriverAssignment != null ? new DriverAssignmentDto 
            { 
                DriverId = s.DriverAssignment.DriverId, 
                DriverName = s.DriverAssignment.Driver?.FullName ?? string.Empty
            } : null,
            Order = s.Order != null ? new ShipmentOrderDto 
            { 
                CargoWeightKg = s.Order.CargoWeightKg, 
                CargoVolumeM3 = s.Order.CargoVolumeM3, 
                SpecialHandlingNotes = s.Order.SpecialHandlingNotes, 
                CustomerName = s.Order.Customer?.Name ?? string.Empty,
                ServiceCategory = s.Order.TransportOffering?.Name ?? string.Empty
            } : null,
            PickupDeliveryOption = s.PickupDeliveryOption != null ? new PickupDeliveryOptionDto
            {
                PickupAddress = s.PickupDeliveryOption.PickupAddress,
                PickupWindowStart = s.PickupDeliveryOption.PickupWindowStart,
                PickupWindowEnd = s.PickupDeliveryOption.PickupWindowEnd,
                DeliveryAddress = s.PickupDeliveryOption.DeliveryAddress,
                DeliveryWindowStart = s.PickupDeliveryOption.DeliveryWindowStart,
                DeliveryWindowEnd = s.PickupDeliveryOption.DeliveryWindowEnd
            } : null
        });
        return Ok(result);
    }

    /// <summary>GET /api/shipments/{id}</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetShipment(Guid id)
    {
        var shipment = await _dbContext.Set<Shipment>()
            .Include(s => s.VehicleAssignment!).ThenInclude(v => v.Vehicle)
            .Include(s => s.DriverAssignment!).ThenInclude(d => d.Driver)
            .Include(s => s.Order!).ThenInclude(o => o.Customer)
            .Include(s => s.Order!).ThenInclude(o => o.TransportOffering)
            .Include(s => s.PickupDeliveryOption)
            .FirstOrDefaultAsync(s => s.Id == id);
            
        if (shipment == null) return NotFound(new { message = "Shipment not found." });
        return Ok(new ShipmentResponseDto
        {
            Id = shipment.Id,
            OrderId = shipment.OrderId,
            Status = shipment.Status,
            CreatedAt = shipment.CreatedAt,
            VehicleAssignment = shipment.VehicleAssignment != null ? new VehicleAssignmentDto 
            { 
                VehicleId = shipment.VehicleAssignment.VehicleId, 
                VehiclePlate = shipment.VehicleAssignment.Vehicle?.PlateNumber ?? string.Empty,
                VehicleType = shipment.VehicleAssignment.Vehicle?.Type.ToString() ?? string.Empty
            } : null,
            DriverAssignment = shipment.DriverAssignment != null ? new DriverAssignmentDto 
            { 
                DriverId = shipment.DriverAssignment.DriverId, 
                DriverName = shipment.DriverAssignment.Driver?.FullName ?? string.Empty
            } : null,
            Order = shipment.Order != null ? new ShipmentOrderDto 
            { 
                CargoWeightKg = shipment.Order.CargoWeightKg, 
                CargoVolumeM3 = shipment.Order.CargoVolumeM3, 
                SpecialHandlingNotes = shipment.Order.SpecialHandlingNotes, 
                CustomerName = shipment.Order.Customer?.Name ?? string.Empty,
                ServiceCategory = shipment.Order.TransportOffering?.Name ?? string.Empty
            } : null,
            PickupDeliveryOption = shipment.PickupDeliveryOption != null ? new PickupDeliveryOptionDto
            {
                PickupAddress = shipment.PickupDeliveryOption.PickupAddress,
                PickupWindowStart = shipment.PickupDeliveryOption.PickupWindowStart,
                PickupWindowEnd = shipment.PickupDeliveryOption.PickupWindowEnd,
                DeliveryAddress = shipment.PickupDeliveryOption.DeliveryAddress,
                DeliveryWindowStart = shipment.PickupDeliveryOption.DeliveryWindowStart,
                DeliveryWindowEnd = shipment.PickupDeliveryOption.DeliveryWindowEnd
            } : null
        });
    }

    /// <summary>POST /api/shipments/{id}/assign – assign vehicle & driver</summary>
    [HttpPost("{id:guid}/assign")]
    public async Task<IActionResult> AssignResources(Guid id, [FromBody] AssignResourcesDto request)
    {
        var result = await _shipmentService.AssignResourcesAsync(id, request);
        return Ok(result);
    }

    /// <summary>DELETE /api/shipments/{id}</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteShipment(Guid id)
    {
        var shipment = await _dbContext.Set<Shipment>().FirstOrDefaultAsync(s => s.Id == id);
        if (shipment != null)
        {
            var order = await _dbContext.Set<Order>().FirstOrDefaultAsync(o => o.Id == shipment.OrderId);
            if (order != null)
            {
                order.Status = OrderStatus.Cancelled;
                await _dbContext.SaveChangesAsync();
            }
        }
        await _shipmentService.DeleteShipmentAsync(id);
        return NoContent();
    }

    /// <summary>PUT /api/shipments/{id}/status</summary>
    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateShipmentStatus(Guid id, [FromBody] UpdateShipmentStatusDto request)
    {
        var result = await _shipmentService.UpdateShipmentStatusAsync(id, request.Status);
        return Ok(result);
    }
}
