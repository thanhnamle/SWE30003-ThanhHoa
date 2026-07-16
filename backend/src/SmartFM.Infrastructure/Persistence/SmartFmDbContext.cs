using Microsoft.EntityFrameworkCore;

namespace SmartFM.Infrastructure.Persistence;

public class SmartFmDbContext : DbContext
{
    public SmartFmDbContext(DbContextOptions<SmartFmDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Apply configurations here
    }
}
