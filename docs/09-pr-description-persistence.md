# Pull Request Description - Persistence Layer

## Implemented behaviour
Implemented the full persistence layer for SmartFM using EF Core and MySQL. This covers the 15 Assignment 2 candidate classes that are persisted, their supporting enums, relational mappings, seed data for bootstrap reference tables, and the migration history needed to materialize the schema.

## Affected business area
- Customer & Order Handling
- Shipment & Resource Assignment
- Invoice, Payment, and Receipt Handling
- Tracking and Delivery Exception Handling

## A2 class/scenario affected
- All persisted candidate classes from A2, except `OperationalReport` which remains a computed on-demand result
- See `docs/08-design-change-log-template.md` for the full class-level changes and DB constraint mapping

## What's included
- 15 persisted entity types across `SmartFM.Domain/Entities/`
- Supporting enums in `SmartFM.Domain/Enums/`
- `SmartFmDbContext` with DbSets and entity configurations
- Fluent API for 1-1 and 1-n relationships, including unique indexes where required
- EF Core migrations for schema creation and seed data
- Bootstrap Stage 1 seed data for `Branch`, `Vehicle`, `Driver`, and `TransportOffering`

## Validation / constraints implemented at DB level
- Unique indexes enforce the A2 assumptions for `Shipment`-`Order`, `Invoice`-`Order`, `VehicleAssignment`-`Shipment`, `DriverAssignment`-`Shipment`, `PickupDeliveryOption`-`Shipment`, and `Receipt`-`Payment`
- `Receipt` and `TrackingRecord` use `init`-only properties to express immutable / append-only intent

## Tests
- `dotnet build`
- `dotnet ef migrations list --project src/SmartFM.Infrastructure --startup-project src/SmartFM.API`
- Manual verification of schema, FKs, unique indexes, and seeded rows against local MySQL in Docker

## Design changes vs A2
- All class-level changes and business rationale are documented in `docs/08-design-change-log-template.md`
- Key implementation choices include enum-backed lifecycle states, FK-backed aggregates, unique indexes for 1-1 bindings, and bootstrap seed data

## Dependencies on other roles
- **Role Domain/Application**: business rules such as state transition validation, conflict resolution workflows, and payment/receipt commands still belong above persistence
- **Role API**: DTOs and controllers can now map from the persisted entity model; `SmartFM.Application/MappingProfiles/MappingProfile.cs` is the natural place to define the mappings
- **Role Frontend**: can consume the seeded reference data immediately to reduce manual setup during UI integration

## How to run locally
1. `docker run --name smartfm-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=smartfm -p 3306:3306 -d mysql:8`
2. `cd backend`
3. `dotnet ef database update --project src/SmartFM.Infrastructure --startup-project src/SmartFM.API`
