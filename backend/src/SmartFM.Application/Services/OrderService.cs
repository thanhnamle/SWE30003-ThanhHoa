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
    private readonly IRepository<TransportOffering> _offeringRepository;
    private readonly INotificationService _notificationService;

    public OrderService(
        IRepository<Order> orderRepository,
        IRepository<TransportOffering> offeringRepository,
        INotificationService notificationService)
    {
        _orderRepository = orderRepository;
        _offeringRepository = offeringRepository;
        _notificationService = notificationService;
    }

    public async Task<OrderResponseDto> PlaceOrderAsync(CreateOrderDto request)
    {
        if (request.CargoWeightKg <= 0 || request.CargoVolumeM3 <= 0)
        {
            throw new BusinessRuleException("Cargo weight and volume must be greater than 0.");
        }

        var offering = await _offeringRepository.GetByIdAsync(request.TransportOfferingId);
        if (offering == null)
        {
            throw new BusinessRuleException("Selected transport offering not found.");
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

        var shipment = new Shipment
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            Status = ShipmentStatus.Preparing,
            CreatedAt = DateTime.UtcNow
        };
        order.Shipment = shipment;

        // Automatically generate an invoice
        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            Status = InvoiceStatus.Unpaid,
            Amount = offering.BaseFee + (request.CargoWeightKg * offering.FeePerKm * 0.1m), // Simulated fee calculation
            IssuedAt = DateTime.UtcNow
        };
        order.Invoice = invoice;

        await _orderRepository.AddAsync(order);

        await _notificationService.CreateNotificationAsync(
            "New Order Created",
            $"A new freight order has been placed with Reference ID: {order.Id.ToString().Split('-')[0].ToUpper()}.",
            "Info"
        );

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
