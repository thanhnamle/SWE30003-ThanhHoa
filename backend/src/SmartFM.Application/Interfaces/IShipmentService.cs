using SmartFM.Application.DTOs.Shipments;

namespace SmartFM.Application.Interfaces;

public interface IShipmentService
{
    Task<ShipmentResponseDto> AssignResourcesAsync(Guid shipmentId, AssignResourcesDto request);
}
