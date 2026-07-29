using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Xunit;
using SmartFM.Application.Services;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;
using SmartFM.Domain.Interfaces;

namespace SmartFM.UnitTests.Services;

public class ReportServiceTests
{
    private readonly Mock<IRepository<Shipment>> _shipmentRepoMock;
    private readonly Mock<IRepository<Invoice>> _invoiceRepoMock;
    private readonly Mock<IRepository<Customer>> _customerRepoMock;
    private readonly Mock<IRepository<Vehicle>> _vehicleRepoMock;
    private readonly Mock<IRepository<Driver>> _driverRepoMock;
    private readonly ReportService _reportService;

    public ReportServiceTests()
    {
        _shipmentRepoMock = new Mock<IRepository<Shipment>>();
        _invoiceRepoMock = new Mock<IRepository<Invoice>>();
        _customerRepoMock = new Mock<IRepository<Customer>>();
        _vehicleRepoMock = new Mock<IRepository<Vehicle>>();
        _driverRepoMock = new Mock<IRepository<Driver>>();

        _reportService = new ReportService(
            _shipmentRepoMock.Object,
            _invoiceRepoMock.Object,
            _customerRepoMock.Object,
            _vehicleRepoMock.Object,
            _driverRepoMock.Object
        );
    }

    [Fact]
    public async Task GetOperationalReportAsync_ShouldReturnAggregatedData()
    {
        // Arrange
        var shipments = new List<Shipment>
        {
            new Shipment { Id = Guid.NewGuid(), Status = ShipmentStatus.Delivered },
            new Shipment { Id = Guid.NewGuid(), Status = ShipmentStatus.InTransit },
            new Shipment { Id = Guid.NewGuid(), Status = ShipmentStatus.Delivered }
        };

        var invoices = new List<Invoice>
        {
            new Invoice { Id = Guid.NewGuid(), Status = InvoiceStatus.Paid, Amount = 1500m, IssuedAt = DateTime.Now },
            new Invoice { Id = Guid.NewGuid(), Status = InvoiceStatus.Paid, Amount = 2000m, IssuedAt = DateTime.Now },
            new Invoice { Id = Guid.NewGuid(), Status = InvoiceStatus.Unpaid, Amount = 500m, IssuedAt = DateTime.Now }
        };

        var customers = new List<Customer> { new Customer { Id = Guid.NewGuid() } };
        var vehicles = new List<Vehicle> { new Vehicle { Id = Guid.NewGuid() }, new Vehicle { Id = Guid.NewGuid() } };
        var drivers = new List<Driver> { new Driver { Id = Guid.NewGuid() }, new Driver { Id = Guid.NewGuid() }, new Driver { Id = Guid.NewGuid() } };

        _shipmentRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(shipments);
        _invoiceRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(invoices);
        _customerRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(customers);
        _vehicleRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(vehicles);
        _driverRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(drivers);

        // Act
        var result = await _reportService.GetOperationalReportAsync();

        // Assert
        var json = JsonSerializer.Serialize(result);
        var jsonDoc = JsonDocument.Parse(json);
        
        var stats = jsonDoc.RootElement.GetProperty("stats");
        stats.GetProperty("orders").GetInt32().Should().Be(3);
        stats.GetProperty("revenue").GetDecimal().Should().Be(3500m); // Only Paid invoices are summed
        stats.GetProperty("customers").GetInt32().Should().Be(1);
        stats.GetProperty("vehicles").GetInt32().Should().Be(2);
        stats.GetProperty("drivers").GetInt32().Should().Be(3);
        
        var shipmentStatusData = jsonDoc.RootElement.GetProperty("shipmentStatusData");
        shipmentStatusData.GetArrayLength().Should().Be(2); // Delivered, InTransit
    }
}
