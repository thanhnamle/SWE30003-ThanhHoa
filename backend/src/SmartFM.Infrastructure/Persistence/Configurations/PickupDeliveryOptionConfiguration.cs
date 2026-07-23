using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartFM.Domain.Entities;

namespace SmartFM.Infrastructure.Persistence.Configurations;

public class PickupDeliveryOptionConfiguration : IEntityTypeConfiguration<PickupDeliveryOption>
{
    public void Configure(EntityTypeBuilder<PickupDeliveryOption> builder)
    {
        builder.HasIndex(p => p.ShipmentId).IsUnique();

        builder.HasOne(p => p.Shipment)
            .WithOne(s => s.PickupDeliveryOption)
            .HasForeignKey<PickupDeliveryOption>(p => p.ShipmentId);
    }
}