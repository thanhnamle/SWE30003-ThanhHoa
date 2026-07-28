using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartFM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPoDAndComplianceConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Bỏ các lệnh DropForeignKey/DropIndex gây xung đột khóa ngoại trên MySQL
            // migrationBuilder.DropForeignKey(name: "FK_DeliveryExceptions_Shipments_ShipmentId", table: "DeliveryExceptions");
            // migrationBuilder.DropIndex(name: "IX_VehicleAssignments_VehicleId", table: "VehicleAssignments");
            // migrationBuilder.DropIndex(name: "IX_DriverAssignments_DriverId", table: "DriverAssignments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DeliveryExceptions",
                table: "DeliveryExceptions");

            migrationBuilder.RenameTable(
                name: "DeliveryExceptions",
                newName: "DeliveryException");

            migrationBuilder.RenameIndex(
                name: "IX_DeliveryExceptions_ShipmentId",
                table: "DeliveryException",
                newName: "IX_DeliveryException_ShipmentId");

            migrationBuilder.AddColumn<Guid>(
                name: "ResolvedByUserId",
                table: "DeliveryException",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DeliveryException",
                table: "DeliveryException",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "ProofOfDelivery",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ShipmentId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ReceivedByName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Notes = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProofImageUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RecordedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProofOfDelivery", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProofOfDelivery_Shipments_ShipmentId",
                        column: x => x.ShipmentId,
                        principalTable: "Shipments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicle_IsUnderMaintenance",
                table: "Vehicles",
                column: "IsUnderMaintenance");

            migrationBuilder.CreateIndex(
                name: "IX_VehicleAssignment_VehicleId_Status",
                table: "VehicleAssignments",
                columns: new[] { "VehicleId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Driver_IsOnLeave",
                table: "Drivers",
                column: "IsOnLeave");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Driver_MaxWeeklyHours",
                table: "Drivers",
                sql: "`MaxWeeklyHours` >= 1 AND `MaxWeeklyHours` <= 168");

            migrationBuilder.CreateIndex(
                name: "IX_DriverAssignment_DriverId_Status",
                table: "DriverAssignments",
                columns: new[] { "DriverId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_ProofOfDelivery_ShipmentId",
                table: "ProofOfDelivery",
                column: "ShipmentId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_DeliveryException_Shipments_ShipmentId",
                table: "DeliveryException",
                column: "ShipmentId",
                principalTable: "Shipments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DeliveryException_Shipments_ShipmentId",
                table: "DeliveryException");

            migrationBuilder.DropTable(
                name: "ProofOfDelivery");

            migrationBuilder.DropIndex(
                name: "IX_Vehicle_IsUnderMaintenance",
                table: "Vehicles");

            migrationBuilder.DropIndex(
                name: "IX_VehicleAssignment_VehicleId_Status",
                table: "VehicleAssignments");

            migrationBuilder.DropIndex(
                name: "IX_Driver_IsOnLeave",
                table: "Drivers");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Driver_MaxWeeklyHours",
                table: "Drivers");

            migrationBuilder.DropIndex(
                name: "IX_DriverAssignment_DriverId_Status",
                table: "DriverAssignments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DeliveryException",
                table: "DeliveryException");

            migrationBuilder.DropColumn(
                name: "ResolvedByUserId",
                table: "DeliveryException");

            migrationBuilder.RenameTable(
                name: "DeliveryException",
                newName: "DeliveryExceptions");

            migrationBuilder.RenameIndex(
                name: "IX_DeliveryException_ShipmentId",
                table: "DeliveryExceptions",
                newName: "IX_DeliveryExceptions_ShipmentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DeliveryExceptions",
                table: "DeliveryExceptions",
                column: "Id");

            // migrationBuilder.CreateIndex(name: "IX_VehicleAssignments_VehicleId", table: "VehicleAssignments", column: "VehicleId");
            // migrationBuilder.CreateIndex(name: "IX_DriverAssignments_DriverId", table: "DriverAssignments", column: "DriverId");
            // migrationBuilder.AddForeignKey(name: "FK_DeliveryExceptions_Shipments_ShipmentId", table: "DeliveryExceptions", column: "ShipmentId", principalTable: "Shipments", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
        }
    }
}