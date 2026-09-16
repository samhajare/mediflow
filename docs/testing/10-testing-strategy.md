# 10 — Testing Strategy

## Test pyramid

### Unit tests

Fast tests for:

- service business rules
- validation helpers
- schedule overlap
- slot generation
- status transitions
- error mapping

Mock external boundaries, not the code under test.

### Repository/integration tests

Use a real PostgreSQL test database/container for:

- TypeORM mappings
- migrations
- indexes
- constraints
- tenant-scoped queries
- partial unique index behavior
- transaction behavior

Do not call mocked TypeORM tests integration tests.

### API/E2E tests

Use Nest test application + test database for core flows:

1. onboard clinic
2. create doctor
3. create schedule
4. create patient
5. check availability
6. book appointment
7. verify slot becomes unavailable
8. concurrent booking conflict
9. reschedule
10. cancel

Authentication may be overridden with deterministic test principals.

## Tenant isolation tests

Mandatory negative tests:

- tenant A cannot fetch tenant B doctor
- tenant A cannot update tenant B patient
- tenant A cannot access tenant B appointment
- cross-tenant IDs return not found

## Concurrency test

Appointment booking must include an integration test that issues competing inserts/bookings for the same active doctor/start time.

Expected:

- one succeeds
- one receives slot conflict

## Migration tests

At minimum:

- migrations run successfully on clean test DB
- important down/revert paths are valid where maintained
- generated schema has expected constraints/indexes

## Coverage

Do not chase arbitrary coverage percentages.

Prioritize:

- security boundaries
- tenancy
- financial/clinical-adjacent workflow correctness
- concurrency
- important status transitions
