using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartFM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedReferenceData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Branches",
                columns: new[] { "Id", "Address", "ContactPhone", "CreatedAt", "Name", "Region" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), "123 Nguyen Van Linh, District 7", "028-1234-5678", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ho Chi Minh City Branch", "South" });

            migrationBuilder.InsertData(
                table: "TransportOfferings",
                columns: new[] { "Id", "BaseFee", "Category", "CreatedAt", "Description", "FeePerKm", "IsActive", "MaxCapacityKg", "Name" },
                values: new object[] { new Guid("44444444-4444-4444-4444-444444444444"), 500000m, 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Standard truck freight service", 15000m, true, 5000m, "Standard Freight" });

            migrationBuilder.InsertData(
                table: "Drivers",
                columns: new[] { "Id", "BranchId", "CreatedAt", "FullName", "IsOnLeave", "LicenseExpiryDate", "LicenseNumber", "MaxWeeklyHours" },
                values: new object[] { new Guid("33333333-3333-3333-3333-333333333333"), new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Nguyen Van A", false, new DateTime(2028, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "B2-998877", 48 });

            migrationBuilder.InsertData(
                table: "Vehicles",
                columns: new[] { "Id", "BranchId", "CreatedAt", "IsUnderMaintenance", "MaintenanceUntil", "MaxPayloadKg", "MaxVolumeM3", "PlateNumber", "Type" },
                values: new object[] { new Guid("22222222-2222-2222-2222-222222222222"), new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, 5000m, 20m, "51A-123.45", 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Drivers",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "TransportOfferings",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Branches",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));
        }
    }
}
