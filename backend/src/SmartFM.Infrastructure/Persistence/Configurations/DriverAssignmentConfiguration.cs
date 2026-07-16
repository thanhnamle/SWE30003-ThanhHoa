using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartFM.Domain.Entities;

namespace SmartFM.Infrastructure.Persistence.Configurations;

public class DriverAssignmentConfiguration : IEntityTypeConfiguration<DriverAssignment>
{
    public void Configure(EntityTypeBuilder<DriverAssignment> builder)
    {
        builder.HasIndex(da => da.ShipmentId).IsUnique();

        builder.HasOne(da => da.Shipment)
            .WithOne(s => s.DriverAssignment)
            .HasForeignKey<DriverAssignment>(da => da.ShipmentId);

        builder.HasOne(da => da.Driver)
            .WithMany(d => d.Assignments)
            .HasForeignKey(da => da.DriverId);
    }
}