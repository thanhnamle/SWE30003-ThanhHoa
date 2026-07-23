using Microsoft.AspNetCore.Mvc;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;
using SmartFM.Domain.Interfaces;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly IRepository<Vehicle> _vehicleRepository;

    public VehiclesController(IRepository<Vehicle> vehicleRepository)
    {
        _vehicleRepository = vehicleRepository;
    }

    /// <summary>GET /api/vehicles</summary>
    [HttpGet]
    public async Task<IActionResult> GetVehicles()
    {
        var vehicles = await _vehicleRepository.GetAllAsync();
        var result = vehicles.Select(v => new
        {
            v.Id,
            v.PlateNumber,
            Type = v.Type.ToString(),
            v.MaxPayloadKg,
            v.MaxVolumeM3,
            v.IsUnderMaintenance,
            v.BranchId
        });
        return Ok(result);
    }

    /// <summary>GET /api/vehicles/{id}</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetVehicle(Guid id)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null) return NotFound(new { message = "Vehicle not found." });
        return Ok(new
        {
            vehicle.Id,
            vehicle.PlateNumber,
            Type = vehicle.Type.ToString(),
            vehicle.MaxPayloadKg,
            vehicle.MaxVolumeM3,
            vehicle.IsUnderMaintenance,
            vehicle.BranchId
        });
    }

    /// <summary>POST /api/vehicles</summary>
    [HttpPost]
    public async Task<IActionResult> CreateVehicle([FromBody] CreateVehicleRequest request)
    {
        if (!Enum.TryParse<VehicleType>(request.Type, true, out var vehicleType))
        {
            return BadRequest(new { message = "Invalid vehicle type. Allowed values: Truck, Van, Motorcycle" });
        }

        var vehicle = new Vehicle
        {
            Id = Guid.NewGuid(),
            PlateNumber = request.PlateNumber,
            Type = vehicleType,
            MaxPayloadKg = request.MaxPayloadKg,
            MaxVolumeM3 = request.MaxVolumeM3,
            IsUnderMaintenance = false,
            BranchId = request.BranchId,
            CreatedAt = DateTime.UtcNow
        };
        await _vehicleRepository.AddAsync(vehicle);
        return CreatedAtAction(nameof(GetVehicle), new { id = vehicle.Id }, vehicle);
    }
}

public record CreateVehicleRequest(string PlateNumber, string Type, decimal MaxPayloadKg, decimal MaxVolumeM3, Guid BranchId);
