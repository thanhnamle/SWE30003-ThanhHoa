using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SmartFM.Application.DTOs;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Interfaces;

namespace SmartFM.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IRepository<AppNotification> _notificationRepository;

        public NotificationService(IRepository<AppNotification> notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task<IEnumerable<NotificationDto>> GetRecentNotificationsAsync(int limit = 10)
        {
            var allNotifications = await _notificationRepository.GetAllAsync();
            var notifications = allNotifications
                .OrderByDescending(n => n.CreatedAt)
                .Take(limit);

            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                Type = n.Type
            });
        }

        public async Task MarkAllAsReadAsync()
        {
            var allNotifications = await _notificationRepository.GetAllAsync();
            var unreadNotifications = allNotifications.Where(n => !n.IsRead).ToList();

            foreach (var n in unreadNotifications)
            {
                n.IsRead = true;
                await _notificationRepository.UpdateAsync(n);
            }
        }

        public async Task MarkAsReadAsync(Guid id)
        {
            var notification = await _notificationRepository.GetByIdAsync(id);
            if (notification != null && !notification.IsRead)
            {
                notification.IsRead = true;
                await _notificationRepository.UpdateAsync(notification);
            }
        }

        public async Task CreateNotificationAsync(string title, string message, string type = "Info")
        {
            var notification = new AppNotification
            {
                Id = Guid.NewGuid(),
                Title = title,
                Message = message,
                Type = type,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };
            await _notificationRepository.AddAsync(notification);
        }
    }
}
