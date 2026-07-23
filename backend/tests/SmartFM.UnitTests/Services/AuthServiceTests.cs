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
/// Unit tests for AuthService business rules and JWT generation.
/// </summary>
public class AuthServiceTests
{
    private readonly Mock<IRepository<AppUser>> _userRepoMock;
    private readonly Mock<IConfiguration> _configMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _userRepoMock = new Mock<IRepository<AppUser>>();
        _configMock = new Mock<IConfiguration>();

        _configMock.Setup(c => c["JWT:Secret"]).Returns("SuperSecretKeyWithAtLeast32BytesForHmacSha256Signature!");
        _configMock.Setup(c => c["JWT:Issuer"]).Returns("SmartFM.API");
        _configMock.Setup(c => c["JWT:Audience"]).Returns("SmartFM.Client");
        _configMock.Setup(c => c["JWT:ExpirationMinutes"]).Returns("60");

        _authService = new AuthService(_userRepoMock.Object, _configMock.Object);
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ShouldReturn_TokenAndUserDto()
    {
        var password = "Password123!";
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            FullName = "Admin User",
            Email = "admin@smartfm.vn",
            PasswordHash = hashedPassword,
            Role = "Admin"
        };

        _userRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<AppUser> { user });

        var request = new LoginRequest("admin@smartfm.vn", password);

        var result = await _authService.LoginAsync(request);

        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();
        result.User.Should().NotBeNull();
        result.User.Email.Should().Be("admin@smartfm.vn");
        result.User.FullName.Should().Be("Admin User");
        result.User.Role.Should().Be("Admin");
    }

    [Fact]
    public async Task LoginAsync_WrongEmail_ShouldThrow_BusinessRuleException()
    {
        _userRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<AppUser>());

        var request = new LoginRequest("nonexistent@smartfm.vn", "Password123!");

        var act = () => _authService.LoginAsync(request);

        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Invalid email or password.");
    }

    [Fact]
    public async Task LoginAsync_WrongPassword_ShouldThrow_BusinessRuleException()
    {
        var user = new AppUser
        {
            Email = "admin@smartfm.vn",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword!")
        };

        _userRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<AppUser> { user });

        var request = new LoginRequest("admin@smartfm.vn", "WrongPassword!");

        var act = () => _authService.LoginAsync(request);

        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Invalid email or password.");
    }

    [Fact]
    public async Task LoginAsync_CaseInsensitiveEmail_ShouldMatch()
    {
        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            Email = "admin@smartfm.vn",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Pass123!"),
            FullName = "Admin",
            Role = "Admin"
        };

        _userRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<AppUser> { user });

        var request = new LoginRequest("ADMIN@SMARTFM.VN", "Pass123!");

        var result = await _authService.LoginAsync(request);

        result.Should().NotBeNull();
        result.User.Email.Should().Be("admin@smartfm.vn");
    }

    [Fact]
    public async Task RegisterAsync_ValidData_ShouldCreateCustomerAccount()
    {
        _userRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<AppUser>());

        AppUser? addedUser = null;
        _userRepoMock.Setup(r => r.AddAsync(It.IsAny<AppUser>()))
            .Callback<AppUser>(u => addedUser = u)
            .ReturnsAsync((AppUser u) => u);

        var request = new RegisterRequest("New Customer", "customer@smartfm.vn", "SecurePass123!", "SecurePass123!");

        var result = await _authService.RegisterAsync(request);

        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();
        result.User.Role.Should().Be("Customer");
        result.User.FullName.Should().Be("New Customer");

        addedUser.Should().NotBeNull();
        addedUser!.Role.Should().Be("Customer");
        BCrypt.Net.BCrypt.Verify("SecurePass123!", addedUser.PasswordHash).Should().BeTrue();
    }

    [Fact]
    public async Task RegisterAsync_PasswordMismatch_ShouldThrow_BusinessRuleException()
    {
        var request = new RegisterRequest("Test User", "test@smartfm.vn", "Pass12345", "DifferentPass123");

        var act = () => _authService.RegisterAsync(request);

        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Confirm password does not match.");
    }

    [Fact]
    public async Task RegisterAsync_ShortPassword_ShouldThrow_BusinessRuleException()
    {
        var request = new RegisterRequest("Test User", "test@smartfm.vn", "Short1", "Short1");

        var act = () => _authService.RegisterAsync(request);

        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Password must be at least 8 characters.");
    }

    [Fact]
    public async Task RegisterAsync_DuplicateEmail_ShouldThrow_BusinessRuleException()
    {
        var existingUser = new AppUser { Email = "existing@smartfm.vn" };
        _userRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<AppUser> { existingUser });

        var request = new RegisterRequest("New User", "EXISTING@smartfm.vn", "Password123!", "Password123!");

        var act = () => _authService.RegisterAsync(request);

        await act.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Email is already registered.");
    }
}
