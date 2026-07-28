using Microsoft.AspNetCore.Mvc;
using SmartFM.Application.DTOs.Orders;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Interfaces;
using SmartFM.Domain.Entities;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IRepository<Order> _orderRepository;

    public OrdersController(IOrderService orderService, IRepository<Order> orderRepository)
    {
        _orderService = orderService;
        _orderRepository = orderRepository;
    }

    /// <summary>GET /api/orders – list all orders</summary>
    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _orderRepository.GetAllAsync();
        var result = orders.Select(o => new OrderResponseDto
        {
            Id = o.Id,
            Status = o.Status,
            CargoWeightKg = o.CargoWeightKg,
            CargoVolumeM3 = o.CargoVolumeM3,
            SpecialHandlingNotes = o.SpecialHandlingNotes,
            CreatedAt = o.CreatedAt
        });
        return Ok(result);
    }

    /// <summary>GET /api/orders/{id}</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null) return NotFound(new { message = "Order not found." });
        return Ok(new OrderResponseDto
        {
            Id = order.Id,
            Status = order.Status,
            CargoWeightKg = order.CargoWeightKg,
            CargoVolumeM3 = order.CargoVolumeM3,
            SpecialHandlingNotes = order.SpecialHandlingNotes,
            CreatedAt = order.CreatedAt
        });
    }

    /// <summary>POST /api/orders – create a new order</summary>
    [HttpPost]
    public async Task<IActionResult> PlaceOrder([FromBody] CreateOrderDto request)
    {
        var result = await _orderService.PlaceOrderAsync(request);
        return CreatedAtAction(nameof(GetOrder), new { id = result.Id }, result);
    }

    /// <summary>PUT /api/orders/{id} – edit an existing order</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> EditOrder(Guid id, [FromBody] CreateOrderDto request)
    {
        var result = await _orderService.EditOrderAsync(id, request);
        return Ok(result);
    }

    /// <summary>POST /api/orders/{id}/approve – approve an order</summary>
    [HttpPost("{id:guid}/approve")]
    public async Task<IActionResult> ApproveOrder(Guid id)
    {
        await _orderService.ApproveOrderAsync(id);
        return NoContent();
    }

    /// <summary>POST /api/orders/{id}/cancel – cancel an order</summary>
    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> CancelOrder(Guid id)
    {
        await _orderService.CancelOrderAsync(id);
        return NoContent();
    }
}
