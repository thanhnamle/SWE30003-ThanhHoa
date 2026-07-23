using System;
using FluentAssertions;
using Xunit;
using SmartFM.Domain.Entities;

namespace SmartFM.UnitTests.Domain;

/// <summary>
/// Unit tests for TrackingRecord init-only entity.
/// </summary>
public class TrackingRecordTests
{
    [Fact]
    public void TrackingRecord_Properties_ShouldBeAssignable()
    {
        var id = Guid.NewGuid();
        var shipmentId = Guid.NewGuid();
        var now = DateTime.UtcNow;

        var record = new TrackingRecord
        {
            Id = id,
            ShipmentId = shipmentId,
            Timestamp = now,
            Location = "Highway Toll Plaza Gate 2",
            StatusNote = "Vehicle passed checkpoint"
        };

        record.Id.Should().Be(id);
        record.ShipmentId.Should().Be(shipmentId);
        record.Timestamp.Should().Be(now);
        record.Location.Should().Be("Highway Toll Plaza Gate 2");
        record.StatusNote.Should().Be("Vehicle passed checkpoint");
    }
}
