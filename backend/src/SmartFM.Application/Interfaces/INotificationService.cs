using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartFM.Application.DTOs;

namespace SmartFM.Application.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationDto>> GetRecentNotificationsAsync(int limit = 10);
        Task MarkAllAsReadAsync();
        Task MarkAsReadAsync(Guid id);
        Task CreateNotificationAsync(string title, string message, string type = "Info");
    }
}
