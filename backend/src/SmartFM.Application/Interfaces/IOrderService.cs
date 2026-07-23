using SmartFM.Application.DTOs.Orders;

namespace SmartFM.Application.Interfaces;

public interface IOrderService
{
    Task<OrderResponseDto> PlaceOrderAsync(CreateOrderDto request);
}
