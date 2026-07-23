# Design Change Log Template

## Class-level changes

| Assignment 2 element | Assignment 3 decision | Change or non-change | Implementation reason |
|---|---|---|---|
| Branch | Added `Name`, `Region`, `Address`, `ContactPhone`, `CreatedAt` | Change | A2 defines the branch as a required resource owner; the concrete fields are needed for persistence and seeding. |
| Vehicle | Added `PlateNumber`, `Type`, `MaxPayloadKg`, `MaxVolumeM3`, `IsUnderMaintenance`, `MaintenanceUntil`, `CreatedAt`, `BranchId` | Change | Supports capacity and maintenance tracking, and binds each vehicle to one branch in the database. |
| Driver | Added `LicenseNumber`, `LicenseExpiryDate`, `MaxWeeklyHours`, `IsOnLeave`, `CreatedAt`, `BranchId` | Change | Supports license validity and roster tracking, plus branch ownership. |
| TransportOffering | Added `Category`, `MaxCapacityKg`, `BaseFee`, `FeePerKm`, `IsActive`, `CreatedAt` | Change | Stores pricing and capacity data required for transport fee estimation. |
| Customer | Added `CompanyName`, `IsCorporateAccount`, `CreatedAt` | Change | Captures personal vs corporate account distinction while keeping the model simple. |
| Order | Added `CargoWeightKg`, `CargoVolumeM3`, `SpecialHandlingNotes`, `Status`, `ValidatedAt`, `CancelledAt`, `CustomerId`, `BranchId`, `TransportOfferingId` | Change | Converts the A2 lifecycle into persisted state and preserves the three required foreign keys. |
| Shipment | Added `Status`, `CreatedAt`, `ReadyForPickupAt`, `DeliveredAt`, `OrderId` | Change | Represents the A2 shipment state machine as persisted state rather than a separate class hierarchy. |
| Invoice | Added `Status`, `Amount`, `IssuedAt`, `OrderId` | Change | Stores billing state and links the invoice to exactly one order. |
| VehicleAssignment | Added `Status`, `AssignedAt`, `ApprovedAt`, `ShipmentId`, `VehicleId` | Change | Captures binding between shipment and vehicle, with one shipment mapped to one current vehicle assignment. |
| DriverAssignment | Added `Status`, `AssignedAt`, `ApprovedAt`, `ConflictNotes`, `ShipmentId`, `DriverId` | Change | Captures binding between shipment and driver while keeping conflict resolution evidence. |
| PickupDeliveryOption | Added `PickupAddress`, `PickupWindowStart`, `PickupWindowEnd`, `DeliveryAddress`, `DeliveryContactName`, `DeliveryContactPhone`, `DeliveryWindowStart`, `DeliveryWindowEnd`, `ShipmentId` | Change | Stores scheduling and contact details for one shipment’s pickup/delivery plan. |
| Payment | Added `Amount`, `Method`, `Status`, `AttemptedAt`, `InvoiceId` | Change | Records repeated payment attempts for one invoice while keeping invoice-to-payment as one-to-many. |
| Receipt | Switched to `init`-only properties: `Id`, `SettledAmount`, `IssuedAt`, `TransactionReference`, `PaymentId` | Change | Encodes the A2 immutability intent for receipts at the language level, even though enforcement remains in the application layer. |
| TrackingRecord | Switched to `init`-only properties: `Id`, `Timestamp`, `Location`, `StatusNote`, `ShipmentId` | Change | Encodes append-only telemetry data so old tracking rows are not mutated. |
| DeliveryException | Added `Type`, `Status`, `Description`, `ResolutionAction`, `RaisedAt`, `ResolvedAt`, `ShipmentId` | Change | Stores exception tracking and later resolution details without introducing a separate workflow entity. |
| VehicleType | Added enum values `Van`, `Truck`, `Container`, `Refrigerated` | Added class/enum | Replaces free-text vehicle typing with a constrained persisted code. |
| TransportCategory | Added enum values `Standard`, `Express`, `Fragile`, `Bulk` | Added class/enum | Replaces free-text offering category with a constrained persisted code. |
| OrderStatus | Added enum values `Pending`, `Validated`, `Cancelled` | Added class/enum | Formalizes the order lifecycle already described by A2. |
| ShipmentStatus | Added enum values `Preparing`, `ReadyForPickup`, `InTransit`, `Delivered`, `ExceptionPending` | Added class/enum | Formalizes shipment state as a persisted enum rather than a separate class. |
| AssignmentStatus | Added enum values `Proposed`, `Approved`, `Rejected` | Added class/enum | Shared status for vehicle and driver assignment workflows. |
| PaymentStatus | Added enum values `Pending`, `Success`, `Failed` | Added class/enum | Supports retry and settlement tracking for payment attempts. |
| PaymentMethod | Added enum values `CreditCard`, `BankTransfer`, `EWallet` | Added class/enum | Provides a closed set for UI selection and persisted payment method data. |
| InvoiceStatus | Added enum values `Unpaid`, `Paid` | Added class/enum | Captures the billing lifecycle in a stable persisted form. |
| ExceptionType | Added enum values `VehicleBreakdown`, `WrongAddress`, `CargoDelay`, `FailedDeliveryAttempt`, `Other` | Added class/enum | Encodes the A2 delivery exception taxonomy directly in the model. |
| ExceptionStatus | Added enum values `Open`, `Resolved` | Added class/enum | Captures whether an exception is still active or already handled. |
| OperationalReport | No persisted table | Non-change | A2 defines it as an on-demand computed result, so it is not stored as a relational entity. |

Note: all persisted entities use `Guid` primary keys to match the team convention in `06-git-workflow-and-contracts.md`. The Bootstrap Stage 1 seed uses fixed GUID values rather than `Guid.NewGuid()` because EF Core `HasData()` requires deterministic values across migrations.

## Database-level constraints enforcing A2 assumptions

| A2 Assumption (Section 2.2) | Relationship | DB constraint | Verified evidence |
|---|---|---|---|
| Lifecycle Continuity | Shipment ↔ Order | Unique index on `Shipments.OrderId` | `NON_UNIQUE = 0` |
| Lifecycle Continuity | Invoice ↔ Order | Unique index on `Invoices.OrderId` | `NON_UNIQUE = 0` |
| Resource Binding | VehicleAssignment ↔ Shipment | Unique index on `VehicleAssignments.ShipmentId` | `NON_UNIQUE = 0` |
| Resource Binding | DriverAssignment ↔ Shipment | Unique index on `DriverAssignments.ShipmentId` | `NON_UNIQUE = 0` |
| Resource Binding | PickupDeliveryOption ↔ Shipment | Unique index on `PickupDeliveryOptions.ShipmentId` | `NON_UNIQUE = 0` |
| Financial Sequencing | Receipt ↔ Payment | Unique index on `Receipts.PaymentId` | `NON_UNIQUE = 0` |

## Responsibilities and collaborators

| Class | Assignment 2 responsibility | Assignment 3 responsibility | Collaborator change | Justification |
|---|---|---|---|---|
| Branch | Own branch-level master data | Persist branch master data and own vehicles, drivers, and orders | Collaborates with `Vehicle`, `Driver`, `Order` | The branch became the parent table for several FK relationships. |
| Vehicle | Store vehicle capacity data | Persist capacity, maintenance state, and belong to one branch | Collaborates with `Branch`, `VehicleAssignment` | The assignment flow requires a durable vehicle identity and branch ownership. |
| Driver | Track driver availability and license validity | Persist license, weekly hours, leave status, and belong to one branch | Collaborates with `Branch`, `DriverAssignment` | The roster/assignment flow needs driver master data in storage. |
| TransportOffering | Estimate transport fee options | Persist pricing/capacity parameters and serve orders | Collaborates with `Order` | Orders now reference a persisted offering rather than a transient option object. |
| Customer | Represent the customer placing orders | Persist identity, contact, and account type information | Collaborates with `Order` | Customer order history is now represented by a FK-backed collection. |
| Order | Track lifecycle from pending to cancelled/validated | Persist the order lifecycle, cargo details, and all three foreign keys | Collaborates with `Customer`, `Branch`, `TransportOffering`, `Shipment`, `Invoice` | Order became the central aggregate linking commercial, operational, and billing data. |
| Shipment | Track shipment progress | Persist shipment state and act as the parent of assignment, tracking, and exception records | Collaborates with `Order`, `VehicleAssignment`, `DriverAssignment`, `PickupDeliveryOption`, `TrackingRecord`, `DeliveryException` | Shipment is now the hub for operational events and 1-1 resource binding. |
| Invoice | Track billing status | Persist invoice header and collect payments | Collaborates with `Order`, `Payment` | The invoice now owns the one-to-many payment history. |
| VehicleAssignment | Bind a shipment to a vehicle | Persist proposed/approved/rejected assignment state | Collaborates with `Shipment`, `Vehicle` | One shipment can have one current vehicle assignment; vehicles can appear in many assignments over time. |
| DriverAssignment | Bind a shipment to a driver | Persist proposed/approved/rejected assignment state and conflict notes | Collaborates with `Shipment`, `Driver` | Conflict resolution information had to be retained in storage for later review. |
| PickupDeliveryOption | Describe pickup and delivery windows | Persist scheduling and contact data for one shipment | Collaborates with `Shipment` | This is operational data attached 1-1 to shipment execution. |
| Payment | Record payment attempts | Persist amount, method, status, and attempt timestamp | Collaborates with `Invoice`, `Receipt` | Retry behavior required a many-to-one payment history per invoice. |
| Receipt | Store a payment receipt immutably | Persist settled amount and transaction reference once payment succeeds | Collaborates with `Payment` | Receipt should not be edited after creation, so init-only properties express that intent. |
| TrackingRecord | Store telemetry history as append-only data | Persist shipment location/status notes over time | Collaborates with `Shipment` | Tracking data is history, so it is modeled as append-only and not mutable. |
| DeliveryException | Record operational exceptions and resolution details | Persist exception type, status, and resolution metadata | Collaborates with `Shipment` | Exception handling required a durable audit trail and later resolution updates. |

## Dynamic aspects

| Area | Assignment 2 design | Assignment 3 implementation | Change | Justification |
|---|---|---|---|---|
| Bootstrap | Stage 1 creates reference data before business objects | EF Core `HasData()` seeds one `Branch`, `Vehicle`, `Driver`, and `TransportOffering` via migration | Non-change, implemented in code | Ensures lookup/master data exists before `Order`, `Shipment`, and downstream workflows are created. |
| Scenario | A2 describes the lifecycle in terms of responsibilities and CRC cards | A3 materializes the lifecycle as persisted entities, enums, and FK relationships | Change | The code now contains the actual database model that the scenario relies on. |
| Validation | Validation described at the business level | Database enforces key structural rules such as unique 1-1 indexes and FK constraints | Change | Several A2 assumptions are now backed by schema constraints rather than only by application logic. |
| Failure path | Alternative flows described in A2 | `DeliveryException` and `ConflictNotes` persist exception details and resolution notes | Change | Error and resolution evidence must be stored for operational follow-up. |
| Persistence | Not specified beyond domain intent | EF Core migrations create tables, FKs, unique indexes, and seed data in MySQL | Change | The storage layer now directly implements the A2 model and its structural assumptions. |

## Reflection prompts

These prompts are team-level synthesis prompts. The notes below are intended as persistence-focused inputs and should be combined with the other roles' observations before final submission.

### What worked well in Assignment 2?

Use evidence from implementation.

### What was missing?

Identify required details that were absent.

### What was flawed?

Describe design choices that caused incorrect behaviour or rework.

### What was ambiguous?

State where the team needed interpretation.

### What changed?

Connect changes to implementation evidence.

### What remained unchanged?

Explain why the original design was sufficient.
