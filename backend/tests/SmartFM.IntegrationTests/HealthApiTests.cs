using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

/// <summary>
/// Integration tests for Health API controller (/api/health).
/// </summary>
public class HealthApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public HealthApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task HealthCheck_ShouldReturn_200OK()
    {
        var response = await _client.GetAsync("/api/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
