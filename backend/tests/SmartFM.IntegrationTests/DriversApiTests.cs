using System;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using SmartFM.API.Controllers;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

/// <summary>
/// Integration tests for Drivers API controller (/api/drivers).
/// </summary>
public class DriversApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public DriversApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetDrivers_ShouldReturn_200OK()
    {
        var response = await _client.GetAsync("/api/drivers");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetDriverById_Exists_ShouldReturn_200OK()
    {
        var response = await _client.GetAsync($"/api/drivers/{TestDataSeeder.DriverAvailableId}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetDriverById_NotExists_ShouldReturn_404NotFound()
    {
        var response = await _client.GetAsync($"/api/drivers/{Guid.NewGuid()}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateDriver_ValidData_ShouldReturn_201Created()
    {
        var request = new CreateDriverRequest("Michael Scott", "DL-998877", TestDataSeeder.BranchId);

        var response = await _client.PostAsJsonAsync("/api/drivers", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
