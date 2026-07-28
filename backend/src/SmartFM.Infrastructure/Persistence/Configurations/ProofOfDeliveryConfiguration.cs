using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartFM.Domain.Entities;

namespace SmartFM.Infrastructure.Persistence.Configurations;

public class ProofOfDeliveryConfiguration : IEntityTypeConfiguration<ProofOfDelivery>
{
    public void Configure(EntityTypeBuilder<ProofOfDelivery> builder)
    {
        builder.HasKey(x => x.Id);
        
        // Ràng bu?c 1-1 v?i Shipment
        builder.HasOne(x => x.Shipment)
               .WithOne(x => x.ProofOfDelivery)
               .HasForeignKey<ProofOfDelivery>(x => x.ShipmentId)
               .OnDelete(DeleteBehavior.Cascade); // Xóa Shipment thì xóa luôn PoD
    }
}
