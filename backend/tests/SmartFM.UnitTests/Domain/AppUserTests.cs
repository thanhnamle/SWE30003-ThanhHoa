using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for AppUser domain entity.
/// </summary>
public class AppUserTests
{
    [Fact]
    public void NewAppUser_ShouldHave_CustomerRole_ByDefault()
    {
        var user = new AppUser();
        user.Role.Should().Be("Customer");
        user.FullName.Should().BeEmpty();
        user.Email.Should().BeEmpty();
        user.PasswordHash.Should().BeEmpty();
    }

    [Fact]
    public void AppUser_AllProperties_ShouldBeAssignable()
    {
        var id = Guid.NewGuid();
        var date = DateTime.UtcNow;

        var user = new AppUser
        {
            Id = id,
            FullName = "Nguyen Van A",
            Email = "nguyenvana@smartfm.vn",
            PasswordHash = "$2a$11$hashedpassword",
            Role = "Admin",
            CreatedAt = date
        };

        user.Id.Should().Be(id);
        user.FullName.Should().Be("Nguyen Van A");
        user.Email.Should().Be("nguyenvana@smartfm.vn");
        user.PasswordHash.Should().Be("$2a$11$hashedpassword");
        user.Role.Should().Be("Admin");
        user.CreatedAt.Should().Be(date);
    }
}
