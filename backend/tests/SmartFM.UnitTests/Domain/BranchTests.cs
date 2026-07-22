using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for Branch domain entity invariants.
/// </summary>
public class BranchTests
{
    [Fact]
    public void NewBranch_ShouldHave_EmptyCollections_ByDefault()
    {
        var branch = new Branch();

        branch.Name.Should().BeEmpty();
        branch.Region.Should().BeEmpty();
        branch.Address.Should().BeEmpty();
        branch.ContactPhone.Should().BeEmpty();

        branch.Vehicles.Should().NotBeNull().And.BeEmpty();
        branch.Drivers.Should().NotBeNull().And.BeEmpty();
        branch.Orders.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void Branch_Properties_ShouldBeAssignable()
    {
        var id = Guid.NewGuid();
        var date = DateTime.UtcNow;

        var branch = new Branch
        {
            Id = id,
            Name = "District 1 Hub",
            Region = "Southern Region",
            Address = "123 Central Ave, District 1, HCMC",
            ContactPhone = "+842838221122",
            CreatedAt = date
        };

        branch.Id.Should().Be(id);
        branch.Name.Should().Be("District 1 Hub");
        branch.Region.Should().Be("Southern Region");
        branch.Address.Should().Be("123 Central Ave, District 1, HCMC");
        branch.ContactPhone.Should().Be("+842838221122");
        branch.CreatedAt.Should().Be(date);
    }
}
