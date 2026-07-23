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
        if (configuration["UseInMemoryDatabase"] == "true")
        {
            services.AddDbContext<SmartFmDbContext>(options =>
                options.UseInMemoryDatabase("SmartFM_InMemory"));
        }
        else
        {
            services.AddDbContext<SmartFmDbContext>(options =>
                options.UseMySql(
                    configuration.GetConnectionString("SmartFM"),
                    new MySqlServerVersion(new Version(8, 0, 30))
                ));
        }

        services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));

        return services;
    }
}
