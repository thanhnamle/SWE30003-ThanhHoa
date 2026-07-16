# Shared Team Work Plan

## Role-based allocation

The work is divided by role rather than by member name. The group decides who takes each role.

| Role | Main ownership |
|---|---|
| Domain and Application Logic | entities, business rules, use cases, validation rules |
| API, Persistence, and Integration | controllers, DTO contracts, database, migrations, service registration, final backend integration |
| Frontend and User Experience | pages, forms, client validation, API calls, navigation, user feedback |
| Testing, Evidence, and Documentation | unit/integration test coordination, execution evidence, design-change documentation, report assembly |

## Important rule

The roles are primary responsibilities, not hard boundaries.

Examples:

- the Domain role defines business rules, but the API role reviews whether those rules can be exposed cleanly
- the Frontend role owns the UI, but feature owners must explain the expected workflow and validation
- the Testing role coordinates evidence, but each developer must test the code they write
- the Documentation role assembles the report, but each role must provide accurate design-change notes

## Four business areas

The team should implement these four areas end to end:

1. Customer and order handling
2. Shipment and resource assignment
3. Invoice, simulated payment, and receipt
4. Tracking, exception handling, and operational reporting

## Shared deliverables

Each role must provide:

- implementation commits
- change and non-change notes against Assignment 2
- review comments on another role's work
- evidence for successful and invalid cases
- contribution hours
- clear setup or usage notes

## Integration order

1. agree on common entities, enums, and DTOs
2. implement domain rules
3. implement persistence and API contracts
4. connect frontend flows
5. add tests and execution evidence
6. update detailed design and reflection
7. run final end-to-end review
