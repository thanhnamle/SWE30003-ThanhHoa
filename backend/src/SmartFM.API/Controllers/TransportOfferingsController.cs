using Microsoft.AspNetCore.Mvc;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Interfaces;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransportOfferingsController : ControllerBase
{
    private readonly IRepository<TransportOffering> _offeringRepository;

    public TransportOfferingsController(IRepository<TransportOffering> offeringRepository)
    {
        _offeringRepository = offeringRepository;
    }

    /// <summary>GET /api/transportofferings</summary>
    [HttpGet]
    public async Task<IActionResult> GetOfferings()
    {
        var offerings = await _offeringRepository.GetAllAsync();
        var result = offerings.Where(o => o.IsActive).Select(o => new
        {
            o.Id,
            o.Name,
            o.Description,
            Category = o.Category.ToString(),
            MaxCapacityKg = o.MaxCapacityKg,
            BaseFee = o.BaseFee,
            FeePerKm = o.FeePerKm,
            o.IsActive
        });
        return Ok(result);
    }
}
