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
    private readonly IRepository<VehicleAssignment> _vehicleAssignmentRepo;
    private readonly IRepository<DriverAssignment> _driverAssignmentRepo;

    public ShipmentService(
        IRepository<Shipment> shipmentRepository,
        IRepository<Vehicle> vehicleRepository,
        IRepository<Driver> driverRepository,
        IRepository<VehicleAssignment> vehicleAssignmentRepo,
        IRepository<DriverAssignment> driverAssignmentRepo)
    {
        _shipmentRepository = shipmentRepository;
        _vehicleRepository = vehicleRepository;
        _driverRepository = driverRepository;
        _vehicleAssignmentRepo = vehicleAssignmentRepo;
        _driverAssignmentRepo = driverAssignmentRepo;
    }

    public async Task<ShipmentResponseDto> AssignResourcesAsync(Guid shipmentId, AssignResourcesDto request)
    {
        var shipment = await _shipmentRepository.GetByIdAsync(shipmentId);
        if (shipment == null) throw new BusinessRuleException("Không tìm thấy chuyến hàng.");

        var vehicle = await _vehicleRepository.GetByIdAsync(request.VehicleId);
        if (vehicle == null) throw new BusinessRuleException("Không tìm thấy xe.");

        var driver = await _driverRepository.GetByIdAsync(request.DriverId);
        if (driver == null) throw new BusinessRuleException("Không tìm thấy tài xế.");

        // --- BUSINESS RULES VALIDATION ---
        
        // 1. Kiểm tra xe có đang bảo trì không
        if (vehicle.IsUnderMaintenance)
        {
            throw new BusinessRuleException($"Xe {vehicle.PlateNumber} đang bảo trì, không thể phân công!");
        }

        // 2. Kiểm tra tài xế có đang nghỉ phép không
        if (driver.IsOnLeave)
        {
            throw new BusinessRuleException($"Tài xế {driver.LicenseNumber} đang nghỉ phép, không thể phân công!");
        }

        // --- APPLY LOGIC ---

        // Gán xe
        var vehicleAssignment = new VehicleAssignment
        {
            Id = Guid.NewGuid(),
            ShipmentId = shipmentId,
            VehicleId = request.VehicleId,
            Status = AssignmentStatus.Approved,
            AssignedAt = DateTime.UtcNow,
            ApprovedAt = DateTime.UtcNow
        };

        // Gán tài xế
        var driverAssignment = new DriverAssignment
        {
            Id = Guid.NewGuid(),
            ShipmentId = shipmentId,
            DriverId = request.DriverId,
            Status = AssignmentStatus.Approved,
            ConflictNotes = request.ConflictNotes ?? string.Empty,
            AssignedAt = DateTime.UtcNow,
            ApprovedAt = DateTime.UtcNow
        };

        shipment.Status = ShipmentStatus.ReadyForPickup; // Cập nhật trạng thái Shipment

        // Lưu xuống DB
        await _vehicleAssignmentRepo.AddAsync(vehicleAssignment);
        await _driverAssignmentRepo.AddAsync(driverAssignment);
        await _shipmentRepository.UpdateAsync(shipment);

        return new ShipmentResponseDto
        {
            Id = shipment.Id,
            OrderId = shipment.OrderId,
            Status = shipment.Status,
            CreatedAt = shipment.CreatedAt,
            Message = "Phân công nguồn lực thành công!"
        };
    }
}
