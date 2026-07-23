using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartFM.Application.Interfaces;

namespace SmartFM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Assuming we want this to be authorized, but for now we might leave it open if auth isn't fully enforced on frontend
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRecentNotifications([FromQuery] int limit = 10)
        {
            var notifications = await _notificationService.GetRecentNotificationsAsync(limit);
            return Ok(notifications);
        }

        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            await _notificationService.MarkAllAsReadAsync();
            return NoContent();
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            await _notificationService.MarkAsReadAsync(id);
            return NoContent();
        }
    }
}
