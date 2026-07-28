using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartFM.Domain.Entities;

namespace SmartFM.Infrastructure.Persistence.Configurations;

public class TransportOfferingConfiguration : IEntityTypeConfiguration<TransportOffering>
{
    public void Configure(EntityTypeBuilder<TransportOffering> builder)
    {
        // Reference/master data: an offering must not be deletable while Orders reference it.
        builder.HasMany(t => t.Orders)
            .WithOne(o => o.TransportOffering)
            .HasForeignKey(o => o.TransportOfferingId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
