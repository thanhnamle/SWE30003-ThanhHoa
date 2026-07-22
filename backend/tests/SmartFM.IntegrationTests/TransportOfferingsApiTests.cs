using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

/// <summary>
/// Integration tests for TransportOfferings API controller (/api/transportofferings).
/// </summary>
public class TransportOfferingsApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public TransportOfferingsApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetOfferings_ShouldReturn_200OK()
    {
        var response = await _client.GetAsync("/api/transportofferings");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
