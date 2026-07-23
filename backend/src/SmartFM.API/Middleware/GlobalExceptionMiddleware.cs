using Microsoft.AspNetCore.Mvc;

namespace SmartFM.API.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred.");

            var statusCode = StatusCodes.Status500InternalServerError;
            var title = "Server Error";
            var detail = "An unexpected error occurred.";

            if (ex is SmartFM.Domain.Exceptions.BusinessRuleException)
            {
                statusCode = StatusCodes.Status400BadRequest;
                title = "Business Rule Violation";
                detail = ex.Message;
            }

            var problemDetails = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = detail
            };

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/problem+json";

            await context.Response.WriteAsJsonAsync(problemDetails);
        }
    }
}
