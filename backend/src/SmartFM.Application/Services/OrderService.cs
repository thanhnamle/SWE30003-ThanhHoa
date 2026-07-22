using System;
using System.Threading.Tasks;
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
        if (request.CargoWeightKg <= 0 || request.CargoVolumeM3 <= 0)
        {
            throw new BusinessRuleException("Cargo weight and volume must be greater than 0.");
        }

        var order = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = request.CustomerId,
            BranchId = request.BranchId,
            TransportOfferingId = request.TransportOfferingId,
            CargoWeightKg = request.CargoWeightKg,
            CargoVolumeM3 = request.CargoVolumeM3,
            SpecialHandlingNotes = request.SpecialHandlingNotes ?? string.Empty,
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await _orderRepository.AddAsync(order);

        return new OrderResponseDto
        {
            Id = order.Id,
            CargoWeightKg = order.CargoWeightKg,
            CargoVolumeM3 = order.CargoVolumeM3,
            SpecialHandlingNotes = order.SpecialHandlingNotes,
            Status = order.Status,
            CreatedAt = order.CreatedAt
        };
    }
}
