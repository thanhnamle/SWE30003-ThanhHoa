using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using SmartFM.Application.DTOs.Auth;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

/// <summary>
/// Integration tests for Auth API controller (/api/auth).
/// </summary>
public class AuthApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public AuthApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_ValidRequest_ShouldReturn_201Created_AndAuthResponse()
    {
        var request = new RegisterRequest("Integration Test User", "intuser1@smartfm.vn", "SecurePassword123!", "SecurePassword123!");

        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var result = await response.Content.ReadFromJsonAsync<AuthResponse>();
        result.Should().NotBeNull();
        result!.Token.Should().NotBeNullOrEmpty();
        result.User.Should().NotBeNull();
        result.User.Email.Should().Be("intuser1@smartfm.vn");
        result.User.Role.Should().Be("Customer");
    }

    [Fact]
    public async Task Register_PasswordMismatch_ShouldReturn_400BadRequest()
    {
        var request = new RegisterRequest("Integration User", "mismatch@smartfm.vn", "Password123!", "Different123!");

        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Register_ShortPassword_ShouldReturn_400BadRequest()
    {
        var request = new RegisterRequest("Integration User", "shortpass@smartfm.vn", "Pass1", "Pass1");

        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Register_DuplicateEmail_ShouldReturn_400BadRequest()
    {
        var email = "dupuser@smartfm.vn";
        var request1 = new RegisterRequest("User One", email, "Password123!", "Password123!");
        var request2 = new RegisterRequest("User Two", email, "Password123!", "Password123!");

        await _client.PostAsJsonAsync("/api/auth/register", request1);
        var response2 = await _client.PostAsJsonAsync("/api/auth/register", request2);

        response2.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Login_WrongCredentials_ShouldReturn_401Unauthorized()
    {
        var request = new LoginRequest("nonexistent@smartfm.vn", "WrongPassword123!");

        var response = await _client.PostAsJsonAsync("/api/auth/login", request);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task FullAuthFlow_RegisterThenLogin_ShouldSucceed()
    {
        var email = "flowuser@smartfm.vn";
        var password = "FlowPassword123!";
        var regRequest = new RegisterRequest("Flow User", email, password, password);

        var regResponse = await _client.PostAsJsonAsync("/api/auth/register", regRequest);
        regResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var loginRequest = new LoginRequest(email, password);
        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        loginResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var loginResult = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>();
        loginResult.Should().NotBeNull();
        loginResult!.Token.Should().NotBeNullOrEmpty();
    }
}
