# Codex Task 01 — Initialize Fresh MediFlow NestJS Modular Monolith

You are starting a fresh MediFlow implementation.

## Read first

- `AGENTS.md`
- `docs/00-index.md`
- `docs/inception/01-project-inception.md`
- `docs/requirements/02-functional-requirements.md`
- `docs/requirements/03-non-functional-requirements.md`
- `docs/architecture/04-system-architecture.md`
- `docs/architecture/05-module-boundaries.md`
- `docs/database/06-database-design.md`
- `docs/api/07-api-contract.md`
- `docs/security/08-security-auth-tenancy.md`
- `docs/development/09-local-development.md`
- `docs/testing/10-testing-strategy.md`

Treat these as the approved source of truth.

## Goal

Initialize the new NestJS modular-monolith repository.

Do not implement business CRUD in this task.

## Before changes

1. Inspect the repository.
2. Confirm old Lambda/microservice source code is absent or identify remaining files.
3. Report the exact structure to create.
4. List dependencies you intend to add and why.
5. Report conflicts before coding.

## Implement

Create a NestJS + TypeScript application with:

- strict TypeScript
- REST
- Jest
- ESLint
- Prettier
- `@nestjs/config`
- TypeORM
- PostgreSQL driver
- class-validator
- class-transformer

Create the initial module folders:

```text
src/modules/
  auth/
  clinics/
  users/
  doctors/
  schedules/
  patients/
  appointments/
  notifications/
```

Create:

- `src/common/`
- `src/config/`
- `src/database/`
- `test/`

Do not add business entities/services/controllers merely to fill folders.

## Database development environment

Create Docker Compose for PostgreSQL only.

NestJS should run locally via:

```bash
npm run start:dev
```

Create `.env.example` with placeholder development variables.

Never commit real secrets.

Configure TypeORM with:

- environment-based config
- PostgreSQL
- `synchronize: false`
- migration support

## Health

Add only:

- `GET /health/live`
- `GET /health/ready`

Readiness may perform a lightweight DB connectivity check if the DB foundation supports it cleanly.

## Scripts

Provide appropriate scripts for:

- start:dev
- build
- start:prod
- lint
- format
- typecheck
- test
- test:watch
- test:e2e
- migration:run
- migration:revert

Use exact commands appropriate to the implementation.

## CI

Add a basic GitHub Actions CI workflow:

- install
- typecheck
- lint
- unit tests
- build

Do not create AWS deployment yet.

## Explicitly do not add

- Lambda
- API Gateway
- microservices
- Kubernetes
- ECS
- Prisma
- GraphQL
- Redis
- Kafka
- EventBridge
- Step Functions
- DynamoDB
- RDS Proxy
- React
- business CRUD

## Validate

Run:

- typecheck
- lint
- tests
- build

Start PostgreSQL and validate DB configuration/migration tooling if safe and practical.

## Final report

Report:

1. files created
2. files modified
3. dependencies added
4. package scripts
5. Docker Compose setup
6. TypeORM setup
7. commands run/results
8. assumptions
9. unresolved issues
10. recommended next task

Stop after repository initialization.
