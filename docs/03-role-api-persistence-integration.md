# Role 2: API, Persistence, and Integration

## Purpose

Connect the business logic to storage and expose it through stable API contracts.

## Main responsibilities

- design REST endpoints
- define request and response DTOs
- implement controllers
- configure Entity Framework Core
- create entity configurations
- manage migrations
- implement repositories or persistence services where needed
- configure dependency injection
- maintain Swagger
- coordinate backend integration

## Suggested endpoint groups

```text
/api/customers
/api/transport-offerings
/api/orders
/api/shipments
/api/vehicles
/api/drivers
/api/invoices
/api/payments
/api/tracking
/api/exceptions
/api/reports
```

## Shared API response

Use one response structure across the backend:

```json
{
  "success": true,
  "message": "Human-readable result",
  "data": {},
  "errors": []
}
```

## Persistence responsibilities

- use GUID identifiers
- store date and time values consistently
- define foreign keys and indexes
- prevent duplicate active assignments
- preserve tracking history
- preserve immutable Receipt data
- keep migrations coordinated to avoid branch conflicts

## Integration responsibilities

- confirm API contracts with the Frontend role
- confirm business rules with the Domain role
- provide stable test data for the Testing role
- resolve final backend merge conflicts

## Definition of done

- backend builds successfully
- migrations apply cleanly
- Swagger exposes all required scenarios
- API validation errors are consistent
- frontend can call all implemented endpoints
