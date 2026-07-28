using SmartFM.Application.DTOs.Tracking;

namespace SmartFM.Application.Interfaces;

public interface ITrackingService
{
    Task LogExceptionAsync(Guid shipmentId, LogExceptionDto request);
    Task UpdateTrackingAsync(Guid shipmentId, string location, string statusNote);
    Task ResolveExceptionAsync(Guid exceptionId, string resolutionNotes);
    Task SubmitProofOfDeliveryAsync(Guid shipmentId, string signatureImageBase64, string? notes);
    Task<IEnumerable<DeliveryExceptionDto>> GetExceptionsAsync(Guid shipmentId);
    Task HoldExceptionAsync(Guid exceptionId);
    Task ResumeExceptionAsync(Guid exceptionId);
}
