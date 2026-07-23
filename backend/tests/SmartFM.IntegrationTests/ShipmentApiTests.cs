using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
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

    public ShipmentApiTests(CustomWebApplicationFactory<Program> factory)
    {
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
        
        var result = await response.Content.ReadFromJsonAsync<ShipmentResponseDto>();
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

        var response = await _client.PostAsJsonAsync($"/api/shipments/{TestDataSeeder.ShipmentPreparingId}/assign", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
