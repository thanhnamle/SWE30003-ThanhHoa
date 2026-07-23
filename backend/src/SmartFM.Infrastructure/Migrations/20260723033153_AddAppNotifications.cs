using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SmartFM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAppNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppNotifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Title = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Message = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsRead = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Type = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppNotifications", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AppNotifications",
                columns: new[] { "Id", "CreatedAt", "IsRead", "Message", "Title", "Type" },
                values: new object[,]
                {
                    { new Guid("50000000-0000-0000-0000-000000000001"), new DateTime(2026, 7, 23, 3, 29, 48, 38, DateTimeKind.Utc).AddTicks(2731), false, "Samsung Electronics placed a new freight order.", "New Order Created", "Order" },
                    { new Guid("50000000-0000-0000-0000-000000000002"), new DateTime(2026, 7, 23, 2, 31, 48, 38, DateTimeKind.Utc).AddTicks(4934), false, "SHP-9022 is delayed due to heavy traffic conditions.", "Shipment Delayed", "Alert" },
                    { new Guid("50000000-0000-0000-0000-000000000003"), new DateTime(2026, 7, 22, 22, 31, 48, 38, DateTimeKind.Utc).AddTicks(4995), true, "Invoice INV-2026-114 has been successfully paid.", "Payment Received", "Payment" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppNotifications");
        }
    }
}
