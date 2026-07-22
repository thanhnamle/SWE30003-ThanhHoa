using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for Driver domain entity.
/// </summary>
public class DriverTests
{
    [Fact]
    public void NewDriver_ShouldHave_MaxWeeklyHours48_AndNotOnLeave_ByDefault()
    {
        var driver = new Driver();

        driver.MaxWeeklyHours.Should().Be(48);
        driver.IsOnLeave.Should().BeFalse();
        driver.Assignments.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void Driver_OnLeave_ShouldBeAssignable()
    {
        var driver = new Driver
        {
            FullName = "Le Van D",
            LicenseNumber = "DL-99999",
            IsOnLeave = true
        };

        driver.IsOnLeave.Should().BeTrue();
    }
}
