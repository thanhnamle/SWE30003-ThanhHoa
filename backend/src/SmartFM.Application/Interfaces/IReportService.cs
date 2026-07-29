using System.Threading.Tasks;

namespace SmartFM.Application.Interfaces;

public interface IReportService
{
    Task<object> GetOperationalReportAsync();
}
