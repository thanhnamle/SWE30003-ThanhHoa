using SmartFM.Application.DTOs.Shipments;

namespace SmartFM.Application.Interfaces;

public interface IShipmentService
{
    Task<ShipmentResponseDto> AssignResourcesAsync(Guid shipmentId, AssignResourcesDto request);
    Task DeleteShipmentAsync(Guid shipmentId);
    Task<ShipmentResponseDto> UpdateShipmentStatusAsync(Guid shipmentId, SmartFM.Domain.Enums.ShipmentStatus status);
}
