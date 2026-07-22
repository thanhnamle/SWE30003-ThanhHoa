using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using SmartFM.Application.DTOs.Auth;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

/// <summary>
/// Additional integration tests for Auth API endpoints.
/// </summary>
public class AuthApiExtendedTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public AuthApiExtendedTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Theory]
    [InlineData("a@b.com", "12345678")]
    [InlineData("test.user.long.email@domain.co.uk", "SuperSecretPass123!")]
    public async Task Register_VariousValidEmails_ShouldReturn_201Created(string email, string password)
    {
        var request = new RegisterRequest("Valid User", email, password, password);

        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task Login_EmptyEmail_ShouldReturn_401Unauthorized()
    {
        var request = new LoginRequest("", "Password123!");

        var response = await _client.PostAsJsonAsync("/api/auth/login", request);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Login_EmptyPassword_ShouldReturn_401Unauthorized()
    {
        var request = new LoginRequest("admin@smartfm.vn", "");

        var response = await _client.PostAsJsonAsync("/api/auth/login", request);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
