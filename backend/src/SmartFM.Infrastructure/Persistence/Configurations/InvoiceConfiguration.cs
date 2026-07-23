using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartFM.Domain.Entities;

namespace SmartFM.Infrastructure.Persistence.Configurations;

public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
{
    public void Configure(EntityTypeBuilder<Invoice> builder)
    {
        builder.HasIndex(i => i.OrderId).IsUnique();

        builder.HasOne(i => i.Order)
            .WithOne(o => o.Invoice)
            .HasForeignKey<Invoice>(i => i.OrderId);
    }
}