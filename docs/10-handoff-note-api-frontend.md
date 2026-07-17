# Handoff Note - Persistence Deliverable

## For API
- The persisted model is ready in `SmartFM.Domain/Entities` and `SmartFM.Infrastructure/Persistence`.
- `Order`, `Shipment`, `Invoice`, `Payment`, `Receipt`, `TrackingRecord`, and `DeliveryException` are already mapped with the relationships expected by the schema.
- `Receipt` and `TrackingRecord` are `init`-only, so create new rows instead of updating them in place.
- `OperationalReport` has no table; implement it as an application query over the existing tables.
- The seed data already gives you one `Branch`, `Vehicle`, `Driver`, and `TransportOffering` for integration testing.

## For Frontend
- You can use the seed data immediately without creating master records by hand.
- The reference entities available now are `Branch`, `Vehicle`, `Driver`, and `TransportOffering`.
- The main flow entities available for API integration are `Customer`, `Order`, `Shipment`, `Invoice`, `Payment`, `Receipt`, `TrackingRecord`, and `DeliveryException`.
- Use the seeded `BranchId` when testing branches, vehicles, and drivers so the relationships resolve cleanly.

## Reminder
- The database constraints already enforce the A2 assumptions for 1-1 bindings and retry-based payment history.
- If a business rule seems missing at the database layer, it likely belongs in Domain/Application rather than Infrastructure.
