using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SmartFM.Application.Interfaces;

namespace SmartFM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;

        public SearchController(ISearchService searchService)
        {
            _searchService = searchService;
        }

        [HttpGet]
        public async Task<IActionResult> GlobalSearch([FromQuery] string q)
        {
            var results = await _searchService.SearchAsync(q);
            return Ok(results);
        }
    }
}
