using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for the Driver domain entity invariants.
/// </summary>
public class DriverTests
{
    [Fact]
    public void NewDriver_ShouldHave_DefaultProperties()
    {
        // Arrange & Act
        var driver = new Driver();

        // Assert
        driver.FullName.Should().BeEmpty();
        driver.LicenseNumber.Should().BeEmpty();
        driver.MaxWeeklyHours.Should().Be(48);
        driver.IsOnLeave.Should().BeFalse();
        driver.Assignments.Should().BeEmpty();
    }

    [Fact]
    public void Driver_Properties_ShouldBeAssignable()
    {
        // Arrange
        var driverId = Guid.NewGuid();
        var branchId = Guid.NewGuid();
        var date = DateTime.UtcNow;
        var licenseExpiry = DateTime.UtcNow.AddYears(5);

        // Act
        var driver = new Driver
        {
            Id = driverId,
            FullName = "John Doe",
            LicenseNumber = "DL-987654321",
            LicenseExpiryDate = licenseExpiry,
            MaxWeeklyHours = 40,
            IsOnLeave = true,
            CreatedAt = date,
            BranchId = branchId
        };

        // Assert
        driver.Id.Should().Be(driverId);
        driver.FullName.Should().Be("John Doe");
        driver.LicenseNumber.Should().Be("DL-987654321");
        driver.LicenseExpiryDate.Should().Be(licenseExpiry);
        driver.MaxWeeklyHours.Should().Be(40);
        driver.IsOnLeave.Should().BeTrue();
        driver.CreatedAt.Should().Be(date);
        driver.BranchId.Should().Be(branchId);
    }
}
