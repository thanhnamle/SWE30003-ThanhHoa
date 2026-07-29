using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using SmartFM.Application.DTOs.Shipments;
using SmartFM.Domain.Enums;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

/// <summary>
/// Integration tests for the Shipments API controller.
/// </summary>
public class ShipmentApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory<Program> _factory;
    private static readonly System.Text.Json.JsonSerializerOptions JsonOptions = new System.Text.Json.JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() }
    };

    public ShipmentApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task AssignResources_ValidData_ShouldReturn_200OK_AndShipmentDetails()
    {
        var request = new AssignResourcesDto
        {
            VehicleId = TestDataSeeder.VehicleAvailableId,
            DriverId = TestDataSeeder.DriverAvailableId,
            ConflictNotes = "No conflicts detected"
        };

        var response = await _client.PostAsJsonAsync($"/api/shipments/{TestDataSeeder.ShipmentPreparingId}/assign", request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var result = await response.Content.ReadFromJsonAsync<ShipmentResponseDto>(JsonOptions);
        result.Should().NotBeNull();
        result!.Id.Should().Be(TestDataSeeder.ShipmentPreparingId);
        result.Status.Should().Be(ShipmentStatus.ReadyForPickup);
        result.Message.Should().Be("Resources assigned successfully!");
    }

    [Fact]
    public async Task AssignResources_VehicleUnderMaintenance_ShouldReturn_400BadRequest()
    {
        var request = new AssignResourcesDto
        {
            VehicleId = TestDataSeeder.VehicleMaintenanceId,
            DriverId = TestDataSeeder.DriverAvailableId
        };

        var response = await _client.PostAsJsonAsync($"/api/shipments/{TestDataSeeder.ShipmentPreparingId}/assign", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task AssignResources_DriverOnLeave_ShouldReturn_400BadRequest()
    {
        var request = new AssignResourcesDto
        {
            VehicleId = TestDataSeeder.VehicleAvailableId,
            DriverId = TestDataSeeder.DriverOnLeaveId
        };

        var response = await _client.PostAsJsonAsync($"/api/shipments/{TestDataSeeder.ShipmentDriverOnLeaveId}/assign", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        // Verify transaction rollback - Shipment should not have vehicle or driver assigned
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<SmartFM.Infrastructure.Persistence.SmartFmDbContext>();
        var hasDriverAssignment = await dbContext.DriverAssignments
            .AnyAsync(da => da.ShipmentId == TestDataSeeder.ShipmentDriverOnLeaveId);
        
        hasDriverAssignment.Should().BeFalse("Driver assignment should not be saved on validation failure");
    }

    [Fact]
    public async Task UpdateShipmentStatus_ValidStatus_ShouldReturn_200Ok()
    {
        var request = new UpdateShipmentStatusDto
        {
            Status = ShipmentStatus.InTransit
        };

        var response = await _client.PutAsJsonAsync($"/api/shipments/{TestDataSeeder.ShipmentPreparingId}/status", request);
        
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
