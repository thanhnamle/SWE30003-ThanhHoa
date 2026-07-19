using Microsoft.AspNetCore.Mvc;
using SmartFM.Application.DTOs.Orders;
using SmartFM.Application.Interfaces;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    // Bơm IOrderService vào Controller (Dependency Injection)
    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> PlaceOrder([FromBody] CreateOrderDto request)
    {
        // Gọi Service xử lý logic
        var result = await _orderService.PlaceOrderAsync(request);
        
        // Trả về mã 201 Created cùng với kết quả
        return CreatedAtAction(nameof(PlaceOrder), new { id = result.Id }, result);
    }
}
