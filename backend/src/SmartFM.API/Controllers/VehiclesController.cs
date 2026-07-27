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
    private readonly IRepository<VehicleAssignment> _vehicleAssignmentRepository;

    public VehiclesController(
        IRepository<Vehicle> vehicleRepository,
        IRepository<VehicleAssignment> vehicleAssignmentRepository)
    {
        _vehicleRepository = vehicleRepository;
        _vehicleAssignmentRepository = vehicleAssignmentRepository;
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
            return BadRequest(new { message = "Invalid vehicle type. Allowed values: Van, Truck, Container, Refrigerated" });
        }

        var existingVehicles = await _vehicleRepository.GetAllAsync();
        if (existingVehicles.Any(v => v.PlateNumber.Equals(request.PlateNumber, StringComparison.OrdinalIgnoreCase)))
        {
            return BadRequest(new { message = $"Vehicle with plate number '{request.PlateNumber}' already exists in fleet." });
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

    /// <summary>PUT /api/vehicles/{id}</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateVehicle(Guid id, [FromBody] UpdateVehicleRequest request)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null) return NotFound(new { message = "Vehicle not found." });

        if (!Enum.TryParse<VehicleType>(request.Type, true, out var vehicleType))
        {
            return BadRequest(new { message = "Invalid vehicle type. Allowed values: Van, Truck, Container, Refrigerated" });
        }

        var existingVehicles = await _vehicleRepository.GetAllAsync();
        if (existingVehicles.Any(v => v.Id != id && v.PlateNumber.Equals(request.PlateNumber, StringComparison.OrdinalIgnoreCase)))
        {
            return BadRequest(new { message = $"Vehicle with plate number '{request.PlateNumber}' already exists in fleet." });
        }

        vehicle.PlateNumber = request.PlateNumber;
        vehicle.Type = vehicleType;
        vehicle.MaxPayloadKg = request.MaxPayloadKg;
        vehicle.MaxVolumeM3 = request.MaxVolumeM3;
        vehicle.IsUnderMaintenance = request.IsUnderMaintenance;

        await _vehicleRepository.UpdateAsync(vehicle);
        return Ok(vehicle);
    }

    /// <summary>DELETE /api/vehicles/{id}</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteVehicle(Guid id)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null) return NotFound(new { message = "Vehicle not found." });

        // Clean up any vehicle assignments first to prevent foreign key violation
        var assignments = await _vehicleAssignmentRepository.GetAllAsync();
        var vehicleAssignments = assignments.Where(va => va.VehicleId == id).ToList();
        foreach (var va in vehicleAssignments)
        {
            await _vehicleAssignmentRepository.DeleteAsync(va.Id);
        }

        await _vehicleRepository.DeleteAsync(id);
        return NoContent();
    }
}

public record CreateVehicleRequest(string PlateNumber, string Type, decimal MaxPayloadKg, decimal MaxVolumeM3, Guid BranchId);
public record UpdateVehicleRequest(string PlateNumber, string Type, decimal MaxPayloadKg, decimal MaxVolumeM3, bool IsUnderMaintenance);
