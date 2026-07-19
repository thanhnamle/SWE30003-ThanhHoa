using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using SmartFM.Application.DTOs.Tracking;
using SmartFM.Domain.Enums;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

/// <summary>
/// Integration tests for the Tracking API controller.
/// </summary>
public class TrackingApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public TrackingApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task LogException_ValidRequest_ShouldReturn_204NoContent()
    {
        // Arrange
        var request = new LogExceptionDto
        {
            Type = ExceptionType.VehicleBreakdown,
            Description = "Left front tire burst on highway"
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/tracking/{TestDataSeeder.ShipmentPreparingId}/exceptions", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task LogException_ShipmentNotFound_ShouldReturn_400BadRequest()
    {
        // Arrange
        var request = new LogExceptionDto
        {
            Type = ExceptionType.WrongAddress,
            Description = "Incorrect warehouse gate number"
        };
        var nonexistentShipmentId = Guid.NewGuid();

        // Act
        var response = await _client.PostAsJsonAsync($"/api/tracking/{nonexistentShipmentId}/exceptions", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
