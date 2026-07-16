using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartFM.Infrastructure.Persistence;

namespace SmartFM.Infrastructure;

public static class InfrastructureServiceExtensions
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<SmartFmDbContext>(options =>
            options.UseMySql(
                configuration.GetConnectionString("SmartFM"),
                ServerVersion.AutoDetect(configuration.GetConnectionString("SmartFM"))
            ));

        // Register repositories here

        return services;
    }
}
