using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartFM.Domain.Entities;

namespace SmartFM.Infrastructure.Persistence.Configurations;

public class VehicleAssignmentConfiguration : IEntityTypeConfiguration<VehicleAssignment>
{
    public void Configure(EntityTypeBuilder<VehicleAssignment> builder)
    {
        builder.HasIndex(va => va.ShipmentId).IsUnique();

        builder.HasOne(va => va.Shipment)
            .WithOne(s => s.VehicleAssignment)
            .HasForeignKey<VehicleAssignment>(va => va.ShipmentId);

        builder.HasOne(va => va.Vehicle)
            .WithMany(v => v.Assignments)
            .HasForeignKey(va => va.VehicleId);
    }
}