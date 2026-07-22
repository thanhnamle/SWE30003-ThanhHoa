using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;
using SmartFM.Application.DTOs.Auth;
using SmartFM.Application.Services;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Exceptions;
using SmartFM.Domain.Interfaces;

namespace SmartFM.UnitTests.Services;

/// <summary>
/// Extended unit tests for AuthService edge cases and security validations.
/// </summary>
public class AuthServiceExtendedTests
{
    private readonly Mock<IRepository<AppUser>> _userRepoMock;
    private readonly Mock<IConfiguration> _configMock;
    private readonly AuthService _authService;

    public AuthServiceExtendedTests()
    {
        _userRepoMock = new Mock<IRepository<AppUser>>();
        _configMock = new Mock<IConfiguration>();

        _configMock.Setup(c => c["JWT:Secret"]).Returns("SuperSecretKeyWithAtLeast32BytesForHmacSha256Signature!");
        _configMock.Setup(c => c["JWT:Issuer"]).Returns("SmartFM.API");
        _configMock.Setup(c => c["JWT:Audience"]).Returns("SmartFM.Client");
        _configMock.Setup(c => c["JWT:ExpirationMinutes"]).Returns("120");

        _authService = new AuthService(_userRepoMock.Object, _configMock.Object);
    }

    [Theory]
    [InlineData("  user@smartfm.vn  ", "Password123!")]
    [InlineData("USER@SMARTFM.VN", "Password123!")]
    public async Task LoginAsync_EmailTrimmingAndCase_ShouldAuthenticate(string emailInput, string password)
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            FullName = "Test Driver",
            Email = "user@smartfm.vn",
            PasswordHash = hashedPassword,
            Role = "Driver"
        };

        _userRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<AppUser> { user });

        var result = await _authService.LoginAsync(new LoginRequest(emailInput, password));

        result.Should().NotBeNull();
        result.User.Email.Should().Be("user@smartfm.vn");
        result.User.Role.Should().Be("Driver");
    }

    [Theory]
    [InlineData("1234567")] // 7 chars
    [InlineData("abc")] // 3 chars
    [InlineData("")] // Empty
    public async Task RegisterAsync_PasswordUnderMinLength_ShouldThrow(string shortPassword)
    {
        var request = new RegisterRequest("Jane Doe", "jane@smartfm.vn", shortPassword, shortPassword);

        var act = () => _authService.RegisterAsync(request);

        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Password must be at least 8 characters.");
    }

    [Fact]
    public async Task RegisterAsync_Exactly8Characters_ShouldSucceed()
    {
        _userRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<AppUser>());

        var request = new RegisterRequest("Exact Eight", "exact8@smartfm.vn", "12345678", "12345678");

        var result = await _authService.RegisterAsync(request);

        result.Should().NotBeNull();
        result.User.FullName.Should().Be("Exact Eight");
    }

    [Fact]
    public async Task RegisterAsync_WhitespaceInFullName_ShouldBeTrimmed()
    {
        _userRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<AppUser>());

        AppUser? addedUser = null;
        _userRepoMock.Setup(r => r.AddAsync(It.IsAny<AppUser>()))
            .Callback<AppUser>(u => addedUser = u)
            .ReturnsAsync((AppUser u) => u);

        var request = new RegisterRequest("   Padded Name   ", "padded@smartfm.vn", "Password123!", "Password123!");

        var result = await _authService.RegisterAsync(request);

        result.User.FullName.Should().Be("Padded Name");
        addedUser!.FullName.Should().Be("Padded Name");
    }
}
