using SmartFM.Application.DTOs.Orders;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;
using SmartFM.Domain.Exceptions;
using SmartFM.Domain.Interfaces;

namespace SmartFM.Application.Services;

public class OrderService : IOrderService
{
    private readonly IRepository<Order> _orderRepository;

    public OrderService(IRepository<Order> orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OrderResponseDto> PlaceOrderAsync(CreateOrderDto request)
    {
        // 1. Business Rules Validation
        if (request.CargoWeightKg <= 0 || request.CargoVolumeM3 <= 0)
        {
            throw new BusinessRuleException("Trọng lượng và Thể tích hàng hóa phải lớn hơn 0.");
        }

        // 2. Map DTO sang Entity
        var newOrder = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = request.CustomerId,
            BranchId = request.BranchId,
            TransportOfferingId = request.TransportOfferingId,
            CargoWeightKg = request.CargoWeightKg,
            CargoVolumeM3 = request.CargoVolumeM3,
            SpecialHandlingNotes = request.SpecialHandlingNotes,
            Status = OrderStatus.Pending, // Rule: Đơn hàng mới luôn ở trạng thái Pending
            CreatedAt = DateTime.UtcNow
        };

        // 3. Lưu vào Database thông qua Repository
        await _orderRepository.AddAsync(newOrder);

        // 4. Trả kết quả về cho API (DTO)
        return new OrderResponseDto
        {
            Id = newOrder.Id,
            Status = newOrder.Status,
            CargoWeightKg = newOrder.CargoWeightKg,
            CargoVolumeM3 = newOrder.CargoVolumeM3,
            SpecialHandlingNotes = newOrder.SpecialHandlingNotes,
            CreatedAt = newOrder.CreatedAt
        };
    }
}
