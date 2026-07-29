using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

public class ReportsApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ReportsApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetOperationalReport_ShouldReturn_200Ok_WithData()
    {
        var response = await _client.GetAsync("/api/reports/operational");
        
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("stats");
        content.Should().Contain("shipmentStatusData");
        content.Should().Contain("revenueData");
    }
}
