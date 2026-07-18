using SmartFM.Domain.Enums;

namespace SmartFM.Application.DTOs.Tracking;

public class LogExceptionDto
{
    public ExceptionType Type { get; set; }
    public string Description { get; set; } = string.Empty;
}
