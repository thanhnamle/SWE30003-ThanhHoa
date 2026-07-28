using SmartFM.Application.DTOs.Orders;

namespace SmartFM.Application.Interfaces;

public interface IOrderService
{
    Task<OrderResponseDto> PlaceOrderAsync(CreateOrderDto request);
    Task<OrderResponseDto> EditOrderAsync(Guid id, CreateOrderDto request);
    Task ApproveOrderAsync(Guid id);
    Task CancelOrderAsync(Guid id);
}
