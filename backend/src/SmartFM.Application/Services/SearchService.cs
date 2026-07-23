using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SmartFM.Application.DTOs;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Interfaces;

namespace SmartFM.Application.Services
{
    public class SearchService : ISearchService
    {
        private readonly IRepository<Customer> _customerRepository;
        private readonly IRepository<Shipment> _shipmentRepository;
        private readonly IRepository<Vehicle> _vehicleRepository;

        public SearchService(
            IRepository<Customer> customerRepository,
            IRepository<Shipment> shipmentRepository,
            IRepository<Vehicle> vehicleRepository)
        {
            _customerRepository = customerRepository;
            _shipmentRepository = shipmentRepository;
            _vehicleRepository = vehicleRepository;
        }

        public async Task<IEnumerable<SearchResultDto>> SearchAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<SearchResultDto>();

            query = query.Trim().ToLower();
            var results = new List<SearchResultDto>();

            // Search Customers
            var customers = await _customerRepository.GetAllAsync();
            var matchedCustomers = customers.Where(c => 
                (c.Name != null && c.Name.ToLower().Contains(query)) || 
                (c.CompanyName != null && c.CompanyName.ToLower().Contains(query))).Take(3);
            
            foreach(var c in matchedCustomers)
            {
                results.Add(new SearchResultDto
                {
                    Id = c.Id,
                    Type = "Customer",
                    Title = c.Name,
                    Subtitle = c.CompanyName,
                    Url = "/customers"
                });
            }

            // Search Shipments
            var shipments = await _shipmentRepository.GetAllAsync();
            var matchedShipments = shipments.Where(s => 
                s.Id.ToString().ToLower().Contains(query)).Take(3);

            foreach(var s in matchedShipments)
            {
                results.Add(new SearchResultDto
                {
                    Id = s.Id,
                    Type = "Shipment",
                    Title = $"SHP-{s.Id.ToString().Substring(0, 8)}",
                    Subtitle = $"Status: {s.Status}",
                    Url = "/tracking"
                });
            }


            // Search Vehicles
            var vehicles = await _vehicleRepository.GetAllAsync();
            var matchedVehicles = vehicles.Where(v => 
                v.PlateNumber.ToLower().Contains(query)).Take(3);

            foreach(var v in matchedVehicles)
            {
                results.Add(new SearchResultDto
                {
                    Id = v.Id,
                    Type = "Vehicle",
                    Title = v.PlateNumber,
                    Subtitle = $"Type: {v.Type}",
                    Url = "/vehicles"
                });
            }

            return results;
        }
    }
}
