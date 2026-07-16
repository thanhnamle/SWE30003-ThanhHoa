using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace SmartFM.Application;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        
        // Register FluentValidation and other services here

        return services;
    }
}
