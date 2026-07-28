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
    private readonly IRepository<Customer> _customerRepository;
    private readonly IRepository<Branch> _branchRepository;
    private readonly INotificationService _notificationService;

    public OrderService(
        IRepository<Order> orderRepository,
        IRepository<TransportOffering> offeringRepository,
        IRepository<Customer> customerRepository,
        IRepository<Branch> branchRepository,
        INotificationService notificationService)
    {
        _orderRepository = orderRepository;
        _offeringRepository = offeringRepository;
        _customerRepository = customerRepository;
        _branchRepository = branchRepository;
        _notificationService = notificationService;
    }

    private async Task ValidateOrderRequestAsync(CreateOrderDto request, TransportOffering offering)
    {
        if (request.CargoWeightKg <= 0 || request.CargoVolumeM3 <= 0)
            throw new BusinessRuleException("Cargo weight and volume must be greater than 0.");
            
        if (request.CargoWeightKg > offering.MaxCapacityKg)
            throw new BusinessRuleException($"Cargo weight ({request.CargoWeightKg} kg) exceeds the maximum capacity of the selected offering ({offering.MaxCapacityKg} kg).");

        var customer = await _customerRepository.GetByIdAsync(request.CustomerId);
        if (customer == null) throw new BusinessRuleException("Customer not found.");

        var branch = await _branchRepository.GetByIdAsync(request.BranchId);
        if (branch == null) throw new BusinessRuleException("Branch not found.");
    }

    public async Task<OrderResponseDto> PlaceOrderAsync(CreateOrderDto request)
    {
        var offering = await _offeringRepository.GetByIdAsync(request.TransportOfferingId);
        if (offering == null) throw new BusinessRuleException("Selected transport offering not found.");

        await ValidateOrderRequestAsync(request, offering);

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

    public async Task<OrderResponseDto> EditOrderAsync(Guid id, CreateOrderDto request)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null) throw new BusinessRuleException("Order not found.");

        // Lifecycle rule: Cannot edit if already approved or beyond
        if (order.Status != OrderStatus.Pending)
        {
            throw new BusinessRuleException("Order can only be edited when it is in Pending status.");
        }

        var offering = await _offeringRepository.GetByIdAsync(request.TransportOfferingId);
        if (offering == null) throw new BusinessRuleException("Selected transport offering not found.");

        await ValidateOrderRequestAsync(request, offering);

        order.CustomerId = request.CustomerId;
        order.BranchId = request.BranchId;
        order.TransportOfferingId = request.TransportOfferingId;
        order.CargoWeightKg = request.CargoWeightKg;
        order.CargoVolumeM3 = request.CargoVolumeM3;
        order.SpecialHandlingNotes = request.SpecialHandlingNotes ?? string.Empty;

        // Recalculate invoice if needed (for simplicity, we assume invoice is linked and updated, or handled separately)

        await _orderRepository.UpdateAsync(order);

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

    public async Task ApproveOrderAsync(Guid id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null) throw new BusinessRuleException("Order not found.");

        if (order.Status != OrderStatus.Pending)
        {
            throw new BusinessRuleException("Only Pending orders can be approved.");
        }

        order.Status = OrderStatus.Validated;
        await _orderRepository.UpdateAsync(order);
    }

    public async Task CancelOrderAsync(Guid id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null) throw new BusinessRuleException("Order not found.");

        if (order.Status == OrderStatus.Cancelled)
        {
            throw new BusinessRuleException("Order is already cancelled.");
        }

        order.Status = OrderStatus.Cancelled;
        await _orderRepository.UpdateAsync(order);
    }
}
