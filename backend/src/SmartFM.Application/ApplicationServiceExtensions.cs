using Microsoft.Extensions.DependencyInjection;
using SmartFM.Application.Interfaces;
using SmartFM.Application.Services;

namespace SmartFM.Application;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Đăng ký các Service của Role 1 vào hệ thống
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IShipmentService, ShipmentService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<ITrackingService, TrackingService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<ISearchService, SearchService>();

        return services;
    }
}
