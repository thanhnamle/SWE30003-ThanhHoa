using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SmartFM.Infrastructure.Persistence;

namespace SmartFM.IntegrationTests.Helpers;

/// <summary>
/// Custom WebApplicationFactory that overrides the configuration to use a unique InMemory database
/// for testing API endpoints, avoiding cross-test data conflicts.
/// </summary>
public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
{
    private readonly string _dbName = "InMemoryDbForTesting_" + Guid.NewGuid().ToString();

    public CustomWebApplicationFactory()
    {
        // Set environment variable so WebApplicationBuilder registers the InMemory provider on startup
        Environment.SetEnvironmentVariable("UseInMemoryDatabase", "true");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Find and remove the default DbContextOptions configuration registered in Program.cs
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<SmartFmDbContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Register with a unique database name to prevent "An item with the same key has already been added"
            services.AddDbContext<SmartFmDbContext>(options =>
            {
                options.UseInMemoryDatabase(_dbName);
            });

            var sp = services.BuildServiceProvider();

            using var scope = sp.CreateScope();
            var scopedServices = scope.ServiceProvider;
            var db = scopedServices.GetRequiredService<SmartFmDbContext>();

            // Ensure database is clean and seeded
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();

            TestDataSeeder.Seed(db);
        });
    }
}
