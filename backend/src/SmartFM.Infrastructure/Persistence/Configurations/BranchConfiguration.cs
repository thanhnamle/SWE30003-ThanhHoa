using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartFM.Domain.Entities;

namespace SmartFM.Infrastructure.Persistence.Configurations;

public class BranchConfiguration : IEntityTypeConfiguration<Branch>
{
    public void Configure(EntityTypeBuilder<Branch> builder)
    {
        // Reference/master data: prevent losing operational history if a Branch is deleted.
        builder.HasMany(b => b.Vehicles)
            .WithOne(v => v.Branch)
            .HasForeignKey(v => v.BranchId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(b => b.Drivers)
            .WithOne(d => d.Branch)
            .HasForeignKey(d => d.BranchId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(b => b.Orders)
            .WithOne(o => o.Branch)
            .HasForeignKey(o => o.BranchId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
