using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using SmartFM.Application.DTOs.Orders;
using SmartFM.Domain.Enums;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

/// <summary>
/// Integration tests for the Orders API controller.
/// </summary>
public class OrderApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private static readonly System.Text.Json.JsonSerializerOptions JsonOptions = new System.Text.Json.JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() }
    };

    public OrderApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task PlaceOrder_ValidRequest_ShouldReturn_201Created_AndOrderDetails()
    {
        // Arrange
        var request = new CreateOrderDto
        {
            CustomerId = TestDataSeeder.CustomerId,
            BranchId = TestDataSeeder.BranchId,
            TransportOfferingId = TestDataSeeder.TransportOfferingId,
            CargoWeightKg = 850.5m,
            CargoVolumeM3 = 6.8m,
            SpecialHandlingNotes = "Do not stack"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/orders", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var order = await response.Content.ReadFromJsonAsync<OrderResponseDto>(JsonOptions);
        order.Should().NotBeNull();
        order!.Id.Should().NotBeEmpty();
        order.Status.Should().Be(OrderStatus.Pending);
        order.CargoWeightKg.Should().Be(850.5m);
        order.CargoVolumeM3.Should().Be(6.8m);
        order.SpecialHandlingNotes.Should().Be("Do not stack");
    }

    [Fact]
    public async Task PlaceOrder_InvalidWeight_ShouldReturn_400BadRequest()
    {
        // Arrange
        var request = new CreateOrderDto
        {
            CustomerId = TestDataSeeder.CustomerId,
            BranchId = TestDataSeeder.BranchId,
            TransportOfferingId = TestDataSeeder.TransportOfferingId,
            CargoWeightKg = -50m, // Invalid weight
            CargoVolumeM3 = 6.8m
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/orders", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
