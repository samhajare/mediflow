# MediFlow — Codex Operating Instructions

## Purpose

MediFlow is a multi-tenant clinic appointment management SaaS.

This repository uses a NestJS modular monolith. Keep the codebase simple, testable, secure, and easy to extract into services later only if a real need appears.

## Read first

Before significant work, read the relevant source-of-truth documents:

- `docs/00-index.md`
- `docs/requirements/02-functional-requirements.md`
- `docs/requirements/03-non-functional-requirements.md`
- `docs/architecture/04-system-architecture.md`
- `docs/architecture/05-module-boundaries.md`
- `docs/database/06-database-design.md`
- `docs/api/07-api-contract.md`
- `docs/security/08-security-auth-tenancy.md`

## Approved stack

- Node.js current supported LTS, pinned during implementation
- NestJS
- TypeScript strict mode
- REST
- TypeORM
- PostgreSQL
- class-validator / class-transformer
- Jest
- Docker / Docker Compose
- Terraform
- GitHub Actions
- AWS Cognito
- AWS EC2 for initial production app hosting
- AWS RDS PostgreSQL for production database
- CloudWatch for production logs/metrics

## Architecture rules

- One deployable NestJS application.
- One PostgreSQL database.
- Organize by business modules, not technical layers across the whole app.
- Keep module boundaries explicit.
- Controllers stay thin.
- Business rules belong in services/application logic.
- Persistence logic belongs in repositories.
- TypeORM must not be used directly from controllers.
- `synchronize` must remain `false`.
- Schema changes use migrations.
- Tenant-owned queries must be tenant-scoped.
- Never trust `tenantId` from request body, query string, path, or arbitrary headers.
- Resolve the authenticated user's tenant and role server-side.
- Cross-tenant lookups must behave as not found.
- Do not log JWTs, passwords, DB credentials, or sensitive patient/appointment content.

## Explicitly excluded for V1

Do not introduce without an approved ADR:

- Microservices
- AWS Lambda
- API Gateway
- Kubernetes / EKS
- ECS
- Prisma
- GraphQL
- Redis
- Kafka
- EventBridge
- Step Functions
- DynamoDB
- RDS Proxy
- OpenSearch
- service mesh
- database-per-module
- multi-region deployment
- medical records / EMR
- prescriptions
- insurance
- payments
- video consultation
- AI features

## Development environment

- Run NestJS locally using `npm run start:dev` initially.
- Run PostgreSQL with Docker Compose.
- It is acceptable to Dockerize NestJS later for parity and CI.
- Never use production credentials locally.

## Production direction

- Build a Docker image for the NestJS app.
- Run the app on EC2 initially.
- Use Amazon RDS PostgreSQL as a separate managed database.
- Keep RDS private.
- Use Terraform.
- Use GitHub Actions + AWS OIDC. Do not store long-lived AWS keys in GitHub.

## Auth and tenancy

- Cognito provides user identity.
- The application verifies the Cognito JWT.
- Use the JWT `sub` to resolve the application user/membership from PostgreSQL.
- The database record is the source of truth for `tenantId`, role, and application status.
- Request context should contain safe trusted values such as:
  - `userId`
  - `cognitoSub`
  - `tenantId`
  - `role`
  - `requestId`
  - `correlationId`

## Roles

V1 roles:

- `CLINIC_ADMIN`
- `RECEPTIONIST`
- `DOCTOR`

## Code quality

- TypeScript strict.
- Avoid `any`.
- Prefer dependency injection.
- Avoid unnecessary generic abstractions.
- Avoid speculative patterns.
- Add dependencies only when justified.
- Reuse established project conventions.
- Validate all external input.
- Return safe client-facing errors.
- Keep domain behavior covered by tests.

## Database

- UUID primary keys.
- PostgreSQL snake_case.
- TypeScript camelCase.
- Timestamps are `TIMESTAMPTZ` in UTC.
- Recurring doctor schedules store local wall-clock time.
- Appointment timestamps are absolute UTC timestamps.
- Use explicit migrations.
- `synchronize: false`.
- Protect appointment double booking with the approved partial unique index.

## Git and change discipline

Before significant changes:

1. Inspect relevant files.
2. Read relevant docs.
3. State files to change.
4. State assumptions/conflicts.
5. Keep the task scoped.

After changes:

1. Run typecheck.
2. Run lint.
3. Run tests.
4. Run build if configured.
5. Run migration checks if relevant.
6. Report changes and unresolved issues.

## Infrastructure safety

Codex may generate and validate Terraform.

Allowed without explicit human approval:

- `terraform fmt`
- `terraform validate`
- `terraform plan` when configuration/credentials are intentionally available

Never run automatically:

- `terraform apply`
- `terraform destroy`

Never weaken security groups, branch protection, tests, or approval gates merely to make deployment succeed.

## Definition of done

A task is done only when:

- approved behavior is implemented
- tenant isolation remains intact
- validation exists
- authorization exists where required
- tests cover important behavior
- typecheck passes
- lint passes
- tests pass
- no secrets are committed
- docs are updated if behavior or architecture changed
- no unrelated feature was added
