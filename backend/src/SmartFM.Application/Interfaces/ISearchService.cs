using System.Collections.Generic;
using System.Threading.Tasks;
using SmartFM.Application.DTOs;

namespace SmartFM.Application.Interfaces
{
    public interface ISearchService
    {
        Task<IEnumerable<SearchResultDto>> SearchAsync(string query);
    }
}
