using SmartFM.Application.DTOs.Tracking;

namespace SmartFM.Application.Interfaces;

public interface ITrackingService
{
    Task LogExceptionAsync(Guid shipmentId, LogExceptionDto request);
}
