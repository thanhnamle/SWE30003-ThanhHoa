using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartFM.Domain.Entities;

namespace SmartFM.Infrastructure.Persistence.Configurations;

public class DeliveryExceptionConfiguration : IEntityTypeConfiguration<DeliveryException>
{
    public void Configure(EntityTypeBuilder<DeliveryException> builder)
    {
        builder.HasOne(d => d.Shipment)
            .WithMany(s => s.DeliveryExceptions)
            .HasForeignKey(d => d.ShipmentId);

        builder.HasIndex(d => d.ShipmentId);
    }
}