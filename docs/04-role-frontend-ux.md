# Role 3: Frontend and User Experience

## Purpose

Build the user-facing flows required to demonstrate the four implemented business areas.

## Main responsibilities

- create pages and feature components
- implement routing
- implement forms
- add client-side validation
- connect to backend APIs
- show loading, success, empty, and error states
- support edit, cancellation, or change-of-mind behaviour
- maintain a consistent UI style

## Suggested feature structure

```text
frontend/src/features/
├── customers/
├── orders/
├── shipments/
├── vehicles/
├── drivers/
├── payments/
├── tracking/
├── exceptions/
└── reports/
```

Each feature may use:

```text
api/
components/
pages/
schemas/
types/
index.ts
```

## Required flows

### Customer and Order

- view offerings
- create or select a customer
- create an Order
- display invalid input
- edit or cancel the Order
- display accepted result

### Shipment and Resource Assignment

- create Shipment
- enter pickup and delivery details
- choose Vehicle and Driver
- show rejected assignment
- show ready-for-pickup status

### Finance

- view Invoice
- submit simulated Payment
- show invalid Payment
- show successful result
- display Receipt

### Tracking and Reporting

- display tracking timeline
- add milestone
- record and resolve exception
- show current Shipment state
- request and display report

## Definition of done

- all four business areas are accessible from the UI
- forms clearly label required inputs
- invalid input is demonstrated
- API failures are handled
- successful outputs are readable
- the UI supports screenshots or video evidence
