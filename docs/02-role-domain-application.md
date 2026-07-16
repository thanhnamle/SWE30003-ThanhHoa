# Role 1: Domain and Application Logic

## Purpose

Own the core business behaviour of SmartFM.

## Main responsibilities

- define entities, value objects, and enums
- implement business invariants
- implement use cases in the Application layer
- define command and query handlers
- define backend validation rules
- prevent business logic from being placed in controllers
- identify required changes to Assignment 2 responsibilities and collaborators

## Business rules to cover

### Customer and Order

- required customer details
- valid order states
- order update and cancellation rules
- order acceptance conditions

### Shipment and Resources

- Shipment creation from an accepted Order
- pickup and delivery completeness
- Vehicle and Driver availability
- assignment conflict checks
- ready-for-pickup conditions

### Finance

- Invoice creation rules
- simulated payment validation
- Receipt creation only after successful payment

### Tracking and Exceptions

- append-only tracking history
- exception state and resolution
- Shipment hold and resume behaviour
- report data aggregation rules

## Expected output

```text
SmartFM.Domain/
├── Entities/
├── Enums/
├── ValueObjects/
└── Common/

SmartFM.Application/
├── Features/
├── Common/Interfaces/
├── Common/Behaviours/
└── Common/Models/
```

## Definition of done

- core business rules are implemented outside controllers
- invalid state transitions are blocked
- use cases have clear inputs and outputs
- validation errors are meaningful
- design-change notes are provided for the final report
