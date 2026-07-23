using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartFM.Domain.Entities;

namespace SmartFM.Infrastructure.Persistence.Configurations;

public class TrackingRecordConfiguration : IEntityTypeConfiguration<TrackingRecord>
{
    public void Configure(EntityTypeBuilder<TrackingRecord> builder)
    {
        builder.HasOne(t => t.Shipment)
            .WithMany(s => s.TrackingRecords)
            .HasForeignKey(t => t.ShipmentId);

        builder.HasIndex(t => t.ShipmentId);
    }
}