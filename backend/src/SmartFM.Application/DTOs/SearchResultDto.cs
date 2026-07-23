using System;

namespace SmartFM.Application.DTOs
{
    public class SearchResultDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = string.Empty; // "Customer", "Shipment", "Vehicle"
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }
}
