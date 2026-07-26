using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartFM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DiagnosePendingChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AppNotifications",
                keyColumn: "Id",
                keyValue: new Guid("50000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 26, 16, 6, 12, 112, DateTimeKind.Utc).AddTicks(10));

            migrationBuilder.UpdateData(
                table: "AppNotifications",
                keyColumn: "Id",
                keyValue: new Guid("50000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 26, 15, 8, 12, 112, DateTimeKind.Utc).AddTicks(293));

            migrationBuilder.UpdateData(
                table: "AppNotifications",
                keyColumn: "Id",
                keyValue: new Guid("50000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 26, 11, 8, 12, 112, DateTimeKind.Utc).AddTicks(304));

            migrationBuilder.UpdateData(
                table: "Drivers",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "LicenseNumber",
                value: "C-998877");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AppNotifications",
                keyColumn: "Id",
                keyValue: new Guid("50000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 23, 3, 29, 48, 38, DateTimeKind.Utc).AddTicks(2731));

            migrationBuilder.UpdateData(
                table: "AppNotifications",
                keyColumn: "Id",
                keyValue: new Guid("50000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 23, 2, 31, 48, 38, DateTimeKind.Utc).AddTicks(4934));

            migrationBuilder.UpdateData(
                table: "AppNotifications",
                keyColumn: "Id",
                keyValue: new Guid("50000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 22, 31, 48, 38, DateTimeKind.Utc).AddTicks(4995));

            migrationBuilder.UpdateData(
                table: "Drivers",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "LicenseNumber",
                value: "B2-998877");
        }
    }
}
