using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartFM.Domain.Entities;

namespace SmartFM.Infrastructure.Persistence.Configurations;

public class ReceiptConfiguration : IEntityTypeConfiguration<Receipt>
{
    public void Configure(EntityTypeBuilder<Receipt> builder)
    {
        builder.HasIndex(r => r.PaymentId).IsUnique();

        builder.HasOne(r => r.Payment)
            .WithOne(p => p.Receipt)
            .HasForeignKey<Receipt>(r => r.PaymentId);
    }
}