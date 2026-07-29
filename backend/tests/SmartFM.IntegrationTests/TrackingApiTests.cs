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
using SmartFM.API.Controllers;

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
    [Fact]
    public async Task UpdateStatus_ValidRequest_ShouldReturn_204NoContent()
    {
        var request = new UpdateTrackingStatusDto
        {
            Location = "Hanoi Depot",
            Status = "Departed"
        };
        var response = await _client.PostAsJsonAsync($"/api/tracking/{TestDataSeeder.ShipmentPreparingId}/status", request);
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task SubmitProofOfDelivery_ValidRequest_ShouldReturn_200Ok()
    {
        var request = new SubmitPodDto
        {
            SignatureImageBase64 = "base64data",
            Notes = "Left at door"
        };
        var response = await _client.PostAsJsonAsync($"/api/tracking/{TestDataSeeder.ShipmentPreparingId}/pod", request);
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task ExceptionLifecycle_ShouldWorkCorrectly()
    {
        // 1. Log Exception
        var logRequest = new LogExceptionDto
        {
            Type = ExceptionType.VehicleBreakdown,
            Description = "Engine failure"
        };
        var logResp = await _client.PostAsJsonAsync($"/api/tracking/{TestDataSeeder.ShipmentPreparingId}/exceptions", logRequest);
        logResp.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // 2. Get Exceptions
        var getResp = await _client.GetAsync($"/api/tracking/{TestDataSeeder.ShipmentPreparingId}/exceptions");
        getResp.StatusCode.Should().Be(HttpStatusCode.OK);
        var exceptions = await getResp.Content.ReadFromJsonAsync<DeliveryExceptionDto[]>();
        exceptions.Should().NotBeNullOrEmpty();
        var exceptionId = exceptions![0].Id;

        // 3. Hold Exception
        var holdResp = await _client.PutAsync($"/api/tracking/exceptions/{exceptionId}/hold", null);
        holdResp.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // 4. Resume Exception
        var resumeResp = await _client.PutAsync($"/api/tracking/exceptions/{exceptionId}/resume", null);
        resumeResp.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // 5. Resolve Exception
        var resolveResp = await _client.PutAsJsonAsync($"/api/tracking/exceptions/{exceptionId}/resolve", "Fixed engine");
        resolveResp.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}
