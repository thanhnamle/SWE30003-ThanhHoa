using System;

namespace SmartFM.Domain.Entities
{
    public class AppNotification
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Type { get; set; } = string.Empty; // e.g. "Order", "Alert", "Payment"
    }
}
