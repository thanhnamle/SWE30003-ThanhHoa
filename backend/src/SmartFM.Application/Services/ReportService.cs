using System;
using System.Linq;
using System.Threading.Tasks;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;
using SmartFM.Domain.Interfaces;

namespace SmartFM.Application.Services;

public class ReportService : IReportService
{
    private readonly IRepository<Shipment> _shipmentRepository;
    private readonly IRepository<Invoice> _invoiceRepository;
    private readonly IRepository<Customer> _customerRepository;
    private readonly IRepository<Vehicle> _vehicleRepository;
    private readonly IRepository<Driver> _driverRepository;

    public ReportService(
        IRepository<Shipment> shipmentRepository,
        IRepository<Invoice> invoiceRepository,
        IRepository<Customer> customerRepository,
        IRepository<Vehicle> vehicleRepository,
        IRepository<Driver> driverRepository)
    {
        _shipmentRepository = shipmentRepository;
        _invoiceRepository = invoiceRepository;
        _customerRepository = customerRepository;
        _vehicleRepository = vehicleRepository;
        _driverRepository = driverRepository;
    }

    public async Task<object> GetOperationalReportAsync()
    {
        var shipments = await _shipmentRepository.GetAllAsync();
        var allInvoices = await _invoiceRepository.GetAllAsync();
        var invoices = allInvoices.Where(i => i.Status == InvoiceStatus.Paid).ToList();

        var statusCounts = shipments.GroupBy(s => s.Status)
            .Select(g => new { name = g.Key.ToString(), value = g.Count() })
            .ToList();

        var monthlyRevenue = Enumerable.Range(0, 12).Select(i =>
        {
            var monthName = new DateTime(DateTime.Now.Year, i + 1, 1).ToString("MMM");
            var monthInvoices = invoices.Where(inv => inv.IssuedAt.Month == (i + 1));
            var value = monthInvoices.Sum(inv => inv.Amount) / 1000m;
            return new { name = monthName, value };
        }).ToList();

        var activeCustomers = (await _customerRepository.GetAllAsync()).Count();
        var totalVehicles = (await _vehicleRepository.GetAllAsync()).Count();
        var totalDrivers = (await _driverRepository.GetAllAsync()).Count();
        var totalRevenue = invoices.Sum(i => i.Amount);

        return new
        {
            stats = new
            {
                orders = shipments.Count(),
                revenue = totalRevenue,
                vehicles = totalVehicles,
                drivers = totalDrivers,
                customers = activeCustomers
            },
            shipmentStatusData = statusCounts,
            revenueData = monthlyRevenue
        };
    }
}
