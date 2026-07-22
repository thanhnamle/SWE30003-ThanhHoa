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

    public ShipmentService(
        IRepository<Shipment> shipmentRepository,
        IRepository<Vehicle> vehicleRepository,
        IRepository<Driver> driverRepository,
        IRepository<VehicleAssignment> vehicleAssignmentRepository,
        IRepository<DriverAssignment> driverAssignmentRepository)
    {
        _shipmentRepository = shipmentRepository;
        _vehicleRepository = vehicleRepository;
        _driverRepository = driverRepository;
        _vehicleAssignmentRepository = vehicleAssignmentRepository;
        _driverAssignmentRepository = driverAssignmentRepository;
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
            throw new BusinessRuleException($"Driver {driver.LicenseNumber} is on leave.");
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
}
