using Microsoft.AspNetCore.Mvc;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Interfaces;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DriversController : ControllerBase
{
    private readonly IRepository<Driver> _driverRepository;

    public DriversController(IRepository<Driver> driverRepository)
    {
        _driverRepository = driverRepository;
    }

    /// <summary>GET /api/drivers</summary>
    [HttpGet]
    public async Task<IActionResult> GetDrivers()
    {
        var drivers = await _driverRepository.GetAllAsync();
        var result = drivers.Select(d => new
        {
            d.Id,
            d.FullName,
            d.LicenseNumber,
            d.IsOnLeave,
            d.BranchId
        });
        return Ok(result);
    }

    /// <summary>GET /api/drivers/{id}</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetDriver(Guid id)
    {
        var driver = await _driverRepository.GetByIdAsync(id);
        if (driver == null) return NotFound(new { message = "Driver not found." });
        return Ok(new
        {
            driver.Id,
            driver.FullName,
            driver.LicenseNumber,
            driver.IsOnLeave,
            driver.BranchId
        });
    }

    /// <summary>POST /api/drivers</summary>
    [HttpPost]
    public async Task<IActionResult> CreateDriver([FromBody] CreateDriverRequest request)
    {
        var driver = new Driver
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName,
            LicenseNumber = request.LicenseNumber,
            IsOnLeave = false,
            BranchId = request.BranchId,
            CreatedAt = DateTime.UtcNow
        };
        await _driverRepository.AddAsync(driver);
        return CreatedAtAction(nameof(GetDriver), new { id = driver.Id }, driver);
    }
}

public record CreateDriverRequest(string FullName, string LicenseNumber, Guid BranchId);
