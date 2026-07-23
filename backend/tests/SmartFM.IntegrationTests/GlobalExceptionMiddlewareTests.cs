using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using SmartFM.Application.DTOs.Orders;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

/// <summary>
/// Integration tests verifying GlobalExceptionMiddleware returns RFC 7807 ProblemDetails for exceptions.
/// </summary>
public class GlobalExceptionMiddlewareTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public GlobalExceptionMiddlewareTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task BusinessRuleViolation_ShouldReturn_400BadRequest_WithProblemDetails()
    {
        var invalidOrderRequest = new CreateOrderDto
        {
            CustomerId = TestDataSeeder.CustomerId,
            BranchId = TestDataSeeder.BranchId,
            TransportOfferingId = TestDataSeeder.TransportOfferingId,
            CargoWeightKg = -10m,
            CargoVolumeM3 = 5m
        };

        var response = await _client.PostAsJsonAsync("/api/orders", invalidOrderRequest);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        problemDetails.Should().NotBeNull();
        problemDetails!.Status.Should().Be(400);
        problemDetails.Title.Should().Be("Business Rule Violation");
        problemDetails.Detail.Should().Be("Cargo weight and volume must be greater than 0.");
    }
}
