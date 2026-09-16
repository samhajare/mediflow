# 03 — Non-Functional Requirements

## Security

- All protected APIs require verified authentication.
- Tenant isolation is mandatory.
- Authorization is enforced server-side.
- Secrets are not stored in source control.
- Production secrets come from secure AWS configuration.
- Validate external input.
- Never log JWTs, passwords, DB credentials, or unnecessary patient/appointment content.
- Cross-tenant resource access returns not found.

## Reliability

- Appointment double booking must remain safe under concurrent requests.
- Database transactions are used where atomicity matters.
- Notification failure does not fail appointment creation after commit.
- RDS backups must be enabled in production.

## Performance

Initial target:

- normal CRUD requests should generally complete within interactive web expectations
- use database indexes
- use database pagination
- avoid N+1 query patterns
- avoid fetching entire tables into memory
- no caching layer until measurements justify it

## Scalability

V1 scales vertically first.

Application is stateless so multiple NestJS instances can be introduced later.

Do not adopt Kubernetes or microservices solely for hypothetical scale.

## Maintainability

- NestJS modules represent business boundaries.
- Controllers are thin.
- Services hold business behavior.
- Repositories hold persistence queries.
- Shared/common code remains small and generic.
- Avoid circular module dependencies.
- Architecture changes require an ADR.

## Observability

- structured JSON logs in production
- request/correlation IDs
- safe context fields
- health endpoints
- CloudWatch logs and basic alarms

## Cost

- local development should have effectively no AWS dependency
- development uses Docker PostgreSQL
- avoid NAT Gateway initially
- avoid always-on supporting infrastructure without a concrete need
- one RDS database for V1

## Data handling

- database timestamps use UTC
- clinic schedule times are local wall-clock times
- clinic timezone is explicit
- appointment timestamps are stored as `TIMESTAMPTZ`
