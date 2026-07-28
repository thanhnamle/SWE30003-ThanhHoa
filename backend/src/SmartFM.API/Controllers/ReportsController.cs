using Microsoft.AspNetCore.Mvc;
using SmartFM.Application.Interfaces;
using System.Threading.Tasks;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("operational")]
    public async Task<IActionResult> GetOperationalReport()
    {
        var report = await _reportService.GetOperationalReportAsync();
        return Ok(report);
    }
}
