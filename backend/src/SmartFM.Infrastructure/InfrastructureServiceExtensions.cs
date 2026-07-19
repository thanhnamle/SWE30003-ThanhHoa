using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartFM.Domain.Interfaces;
using SmartFM.Infrastructure.Persistence;
using SmartFM.Infrastructure.Repositories;

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

        services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));

        return services;
    }
}
