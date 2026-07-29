using System;
using System.Linq;
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
    private readonly IRepository<Order> _orderRepository;
    private readonly IRepository<Vehicle> _vehicleRepository;
    private readonly IRepository<Driver> _driverRepository;
    private readonly IRepository<VehicleAssignment> _vehicleAssignmentRepository;
    private readonly IRepository<DriverAssignment> _driverAssignmentRepository;
    private readonly IRepository<PickupDeliveryOption> _pickupDeliveryOptionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ShipmentService(
        IRepository<Shipment> shipmentRepository,
        IRepository<Order> orderRepository,
        IRepository<Vehicle> vehicleRepository,
        IRepository<Driver> driverRepository,
        IRepository<VehicleAssignment> vehicleAssignmentRepository,
        IRepository<DriverAssignment> driverAssignmentRepository,
        IRepository<PickupDeliveryOption> pickupDeliveryOptionRepository,
        IUnitOfWork unitOfWork)
    {
        _shipmentRepository = shipmentRepository;
        _orderRepository = orderRepository;
        _vehicleRepository = vehicleRepository;
        _driverRepository = driverRepository;
        _vehicleAssignmentRepository = vehicleAssignmentRepository;
        _driverAssignmentRepository = driverAssignmentRepository;
        _pickupDeliveryOptionRepository = pickupDeliveryOptionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ShipmentResponseDto> AssignResourcesAsync(Guid shipmentId, AssignResourcesDto request)
    {
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var shipment = await _shipmentRepository.GetByIdAsync(shipmentId);
            var vehicle = await _vehicleRepository.GetByIdAsync(request.VehicleId);
            var driver = await _driverRepository.GetByIdAsync(request.DriverId);

            if (shipment == null) throw new BusinessRuleException("Shipment not found.");
            if (vehicle == null) throw new BusinessRuleException("Vehicle not found.");
            if (driver == null) throw new BusinessRuleException("Driver not found.");
            
            if (shipment.Status != ShipmentStatus.Preparing && shipment.Status != ShipmentStatus.ExceptionPending)
            {
                throw new BusinessRuleException("Shipment is not in a valid state to assign resources.");
            }

            if (vehicle.IsUnderMaintenance)
            {
                throw new BusinessRuleException($"Vehicle {vehicle.PlateNumber} is under maintenance.");
            }

            if (driver.IsOnLeave)
            {
                var driverDisplay = string.IsNullOrWhiteSpace(driver.FullName) ? driver.LicenseNumber : $"{driver.FullName} ({driver.LicenseNumber})";
                throw new BusinessRuleException($"Driver {driverDisplay} is on leave.");
            }

            // Validate capacity
            var order = await _orderRepository.GetByIdAsync(shipment.OrderId);
            if (order != null && order.CargoWeightKg > vehicle.MaxPayloadKg)
            {
                throw new BusinessRuleException($"Vehicle capacity ({vehicle.MaxPayloadKg} kg) is insufficient for the order weight ({order.CargoWeightKg} kg).");
            }
            if (order != null && order.CargoVolumeM3 > vehicle.MaxVolumeM3)
            {
                throw new BusinessRuleException($"Vehicle volume ({vehicle.MaxVolumeM3} m3) is insufficient for the order volume ({order.CargoVolumeM3} m3).");
            }

            // Conflict validation
            var allShipments = await _shipmentRepository.GetAllAsync();
            var activeShipmentIds = allShipments
                .Where(s => s.Id != shipmentId && (s.Status == ShipmentStatus.Preparing || s.Status == ShipmentStatus.ReadyForPickup || s.Status == ShipmentStatus.InTransit))
                .Select(s => s.Id)
                .ToList();

            var vehicleAssignments = await _vehicleAssignmentRepository.GetAllAsync();
            if (vehicleAssignments.Any(va => va.VehicleId == request.VehicleId && activeShipmentIds.Contains(va.ShipmentId)))
            {
                throw new BusinessRuleException($"Vehicle {vehicle.PlateNumber} is currently assigned to another active shipment.");
            }

            var driverAssignments = await _driverAssignmentRepository.GetAllAsync();
            if (driverAssignments.Any(da => da.DriverId == request.DriverId && activeShipmentIds.Contains(da.ShipmentId)))
            {
                throw new BusinessRuleException($"Driver {driver.FullName} is currently assigned to another active shipment.");
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

            // Delete existing assignments for this shipment (re-assignment scenario)
            var existingVehicleAssignment = vehicleAssignments.FirstOrDefault(v => v.ShipmentId == shipmentId);
            if (existingVehicleAssignment != null) await _vehicleAssignmentRepository.DeleteAsync(existingVehicleAssignment.Id);
            
            var existingDriverAssignment = driverAssignments.FirstOrDefault(d => d.ShipmentId == shipmentId);
            if (existingDriverAssignment != null) await _driverAssignmentRepository.DeleteAsync(existingDriverAssignment.Id);

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

            await _unitOfWork.CommitAsync();

            return new ShipmentResponseDto
            {
                Id = shipment.Id,
                OrderId = shipment.OrderId,
                Status = shipment.Status,
                Message = "Resources assigned successfully!"
            };
        }
        catch
        {
            await _unitOfWork.RollbackAsync();
            throw;
        }
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

        if (status == ShipmentStatus.ReadyForPickup)
        {
            var order = await _orderRepository.GetByIdAsync(shipment.OrderId);
            if (order != null && order.Status != OrderStatus.Validated)
            {
                order.Status = OrderStatus.Validated;
                await _orderRepository.UpdateAsync(order);
            }
        }

        return new ShipmentResponseDto
        {
            Id = shipment.Id,
            OrderId = shipment.OrderId,
            Status = shipment.Status,
            Message = "Shipment status updated successfully!"
        };
    }
}
