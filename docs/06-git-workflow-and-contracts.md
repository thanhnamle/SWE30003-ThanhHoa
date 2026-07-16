# Git Workflow and Shared Contracts

## Role branches

Use role-based branches:

```text
feature/domain-application
feature/api-persistence
feature/frontend-ux
test/evidence-documentation
```

Use smaller feature branches when necessary:

```text
feature/order-api
feature/payment-ui
fix/assignment-validation
docs/design-reflection
```

## Pull request requirements

Each pull request should include:

- implemented behaviour
- affected business area
- Assignment 2 class or scenario affected
- API or UI changes
- validation cases
- tests
- design changes or non-changes
- dependencies on other roles

At least one person from another role should review the pull request.

## Commit format

```text
feat(domain): add order lifecycle rules
feat(api): expose shipment assignment endpoints
feat(ui): add simulated payment flow
test(integration): verify exception resolution
docs(design): record bootstrap changes
```

## Shared conventions

- GUID identifiers
- ISO 8601 date and time values
- UTC storage
- backend validation is authoritative
- frontend and backend use the same status names
- no secrets in Git
- no generated build files in Git

## Migration rule

Avoid creating unrelated migrations on several branches at the same time.

Recommended process:

1. Domain role defines entity changes.
2. API and Persistence role creates configurations.
3. Integration branch creates the final migration.
4. Tests confirm the migration and stored relationships.
