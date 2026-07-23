using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using SmartFM.API.Controllers;
using SmartFM.Domain.Entities;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

/// <summary>
/// Integration tests for Vehicles API controller (/api/vehicles).
/// </summary>
public class VehiclesApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public VehiclesApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetVehicles_ShouldReturn_200OK()
    {
        var response = await _client.GetAsync("/api/vehicles");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetVehicleById_Exists_ShouldReturn_200OK()
    {
        var response = await _client.GetAsync($"/api/vehicles/{TestDataSeeder.VehicleAvailableId}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetVehicleById_NotExists_ShouldReturn_404NotFound()
    {
        var response = await _client.GetAsync($"/api/vehicles/{Guid.NewGuid()}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateVehicle_ValidData_ShouldReturn_201Created()
    {
        var request = new CreateVehicleRequest("51D-888.88", "Truck", 8000m, 35m, TestDataSeeder.BranchId);

        var response = await _client.PostAsJsonAsync("/api/vehicles", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task CreateVehicle_InvalidType_ShouldReturn_400BadRequest()
    {
        var request = new CreateVehicleRequest("51D-999.99", "InvalidVehicleType", 5000m, 20m, TestDataSeeder.BranchId);

        var response = await _client.PostAsJsonAsync("/api/vehicles", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
