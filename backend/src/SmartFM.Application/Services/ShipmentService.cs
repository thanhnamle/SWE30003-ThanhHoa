using System;
using System.Threading.Tasks;
using SmartFM.Application.DTOs.Shipments;
using SmartFM.Application.Interfaces;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Enums;
using SmartFM.Domain.Exceptions;
using SmartFM.Domain.Interfaces;

namespace SmartFM.Application.Services;

public class ShipmentService : IShipmentService
{
    private readonly IRepository<Shipment> _shipmentRepository;
    private readonly IRepository<Vehicle> _vehicleRepository;
    private readonly IRepository<Driver> _driverRepository;
    private readonly IRepository<VehicleAssignment> _vehicleAssignmentRepository;
    private readonly IRepository<DriverAssignment> _driverAssignmentRepository;
    private readonly IRepository<PickupDeliveryOption> _pickupDeliveryOptionRepository;

    public ShipmentService(
        IRepository<Shipment> shipmentRepository,
        IRepository<Vehicle> vehicleRepository,
        IRepository<Driver> driverRepository,
        IRepository<VehicleAssignment> vehicleAssignmentRepository,
        IRepository<DriverAssignment> driverAssignmentRepository,
        IRepository<PickupDeliveryOption> pickupDeliveryOptionRepository)
    {
        _shipmentRepository = shipmentRepository;
        _vehicleRepository = vehicleRepository;
        _driverRepository = driverRepository;
        _vehicleAssignmentRepository = vehicleAssignmentRepository;
        _driverAssignmentRepository = driverAssignmentRepository;
        _pickupDeliveryOptionRepository = pickupDeliveryOptionRepository;
    }

    public async Task<ShipmentResponseDto> AssignResourcesAsync(Guid shipmentId, AssignResourcesDto request)
    {
        var shipment = await _shipmentRepository.GetByIdAsync(shipmentId);
        var vehicle = await _vehicleRepository.GetByIdAsync(request.VehicleId);
        var driver = await _driverRepository.GetByIdAsync(request.DriverId);

        if (shipment == null) throw new BusinessRuleException("Shipment not found.");
        if (vehicle == null) throw new BusinessRuleException("Vehicle not found.");
        if (driver == null) throw new BusinessRuleException("Driver not found.");

        if (vehicle.IsUnderMaintenance)
        {
            throw new BusinessRuleException($"Vehicle {vehicle.PlateNumber} is under maintenance.");
        }

        if (driver.IsOnLeave)
        {
            throw new BusinessRuleException($"Driver {driver.FullName} ({driver.LicenseNumber}) is on leave.");
        }

        // Validate Driver License Class against Vehicle Type
        var licenseUpper = driver.LicenseNumber.ToUpper();
        bool isFCorFE = licenseUpper.Contains("FC") || licenseUpper.Contains("FE");
        bool isClassC = licenseUpper.Contains("CLASS-C") || licenseUpper.StartsWith("C-") || licenseUpper.StartsWith("C") || isFCorFE;

        if (vehicle.Type == VehicleType.Container && !isFCorFE)
        {
            throw new BusinessRuleException($"Driver {driver.FullName} ({driver.LicenseNumber}) cannot drive Container vehicles (Class FC/FE required).");
        }
        if ((vehicle.Type == VehicleType.Truck || vehicle.Type == VehicleType.Refrigerated) && (licenseUpper.StartsWith("B2") || licenseUpper.Contains("B2-")) && !isClassC)
        {
            throw new BusinessRuleException($"Driver {driver.FullName} ({driver.LicenseNumber}) has a B2 license, which is insufficient for {vehicle.Type} (Class C required).");
        }

        var vehicleAssignment = new VehicleAssignment
        {
            Id = Guid.NewGuid(),
            ShipmentId = shipmentId,
            VehicleId = request.VehicleId,
            Status = AssignmentStatus.Approved,
            AssignedAt = DateTime.UtcNow,
            ApprovedAt = DateTime.UtcNow
        };
        await _vehicleAssignmentRepository.AddAsync(vehicleAssignment);

        var driverAssignment = new DriverAssignment
        {
            Id = Guid.NewGuid(),
            ShipmentId = shipmentId,
            DriverId = request.DriverId,
            Status = AssignmentStatus.Approved,
            AssignedAt = DateTime.UtcNow,
            ApprovedAt = DateTime.UtcNow,
            ConflictNotes = request.ConflictNotes
        };
        await _driverAssignmentRepository.AddAsync(driverAssignment);

        if (!string.IsNullOrWhiteSpace(request.PickupAddress) && !string.IsNullOrWhiteSpace(request.DeliveryAddress))
        {
            static DateTime parseTime(string? timeStr, DateTime defaultTime)
            {
                if (string.IsNullOrWhiteSpace(timeStr)) return defaultTime;
                if (DateTime.TryParse(timeStr, out var dt)) return dt;
                if (TimeSpan.TryParse(timeStr, out var ts)) return DateTime.Today.Add(ts);
                return defaultTime;
            }

            var existingOption = (await _pickupDeliveryOptionRepository.GetAllAsync())
                .FirstOrDefault(p => p.ShipmentId == shipmentId);

            if (existingOption != null)
            {
                existingOption.PickupAddress = request.PickupAddress;
                existingOption.DeliveryAddress = request.DeliveryAddress;
                existingOption.PickupWindowStart = parseTime(request.PickupWindowStart, DateTime.UtcNow);
                existingOption.PickupWindowEnd = parseTime(request.PickupWindowEnd, DateTime.UtcNow.AddHours(2));
                existingOption.DeliveryWindowStart = parseTime(request.DeliveryWindowStart, DateTime.UtcNow.AddHours(4));
                existingOption.DeliveryWindowEnd = parseTime(request.DeliveryWindowEnd, DateTime.UtcNow.AddHours(6));
                await _pickupDeliveryOptionRepository.UpdateAsync(existingOption);
            }
            else
            {
                var pickupOption = new PickupDeliveryOption
                {
                    Id = Guid.NewGuid(),
                    ShipmentId = shipmentId,
                    PickupAddress = request.PickupAddress,
                    DeliveryAddress = request.DeliveryAddress,
                    PickupWindowStart = parseTime(request.PickupWindowStart, DateTime.UtcNow),
                    PickupWindowEnd = parseTime(request.PickupWindowEnd, DateTime.UtcNow.AddHours(2)),
                    DeliveryWindowStart = parseTime(request.DeliveryWindowStart, DateTime.UtcNow.AddHours(4)),
                    DeliveryWindowEnd = parseTime(request.DeliveryWindowEnd, DateTime.UtcNow.AddHours(6))
                };
                await _pickupDeliveryOptionRepository.AddAsync(pickupOption);
            }
        }

        shipment.Status = ShipmentStatus.ReadyForPickup;
        await _shipmentRepository.UpdateAsync(shipment);

        return new ShipmentResponseDto
        {
            Id = shipment.Id,
            OrderId = shipment.OrderId,
            Status = shipment.Status,
            Message = "Resources assigned successfully!"
        };
    }

    public async Task DeleteShipmentAsync(Guid shipmentId)
    {
        var shipment = await _shipmentRepository.GetByIdAsync(shipmentId);
        if (shipment == null) throw new BusinessRuleException("Shipment not found.");

        await _shipmentRepository.DeleteAsync(shipmentId);
    }

    public async Task<ShipmentResponseDto> UpdateShipmentStatusAsync(Guid shipmentId, ShipmentStatus status)
    {
        var shipment = await _shipmentRepository.GetByIdAsync(shipmentId);
        if (shipment == null) throw new BusinessRuleException("Shipment not found.");

        shipment.Status = status;
        await _shipmentRepository.UpdateAsync(shipment);

        return new ShipmentResponseDto
        {
            Id = shipment.Id,
            OrderId = shipment.OrderId,
            Status = shipment.Status,
            Message = "Shipment status updated successfully!"
        };
    }
}
