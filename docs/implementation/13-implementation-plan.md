# 13 — Implementation Plan

Each task is a separate Codex scope and review point.

## Phase 0 — Repository reset

- archive old implementation
- copy this AIDLC package into fresh repo
- no old Lambda/microservices files remain
- commit architecture baseline

## Task 01 — Initialize NestJS modular monolith

- NestJS project
- TypeScript strict
- lint/format
- Jest
- environment configuration
- Docker Compose PostgreSQL
- TypeORM base configuration
- migration tooling
- health endpoints
- basic CI

No business APIs.

## Task 02 — Shared foundation

- global validation
- API error model
- exception filter
- response conventions
- request/correlation IDs
- logging foundation
- auth context types
- repository conventions

## Task 03 — Database foundation

- first migrations
- clinics
- users
- doctors
- doctor_schedules
- patients
- appointments
- indexes/constraints
- test DB strategy

No full business behavior yet.

## Task 04 — Authentication + tenant context

- Cognito JWT verification adapter
- application user lookup by Cognito `sub`
- RequestContext
- auth guard
- roles guard/decorator
- test overrides/mocks
- clinic-onboarding special authenticated state

## Task 05 — Clinic onboarding/profile

- POST /v1/clinics
- GET /v1/clinics/me
- PATCH /v1/clinics/me
- transactional clinic + first admin creation

## Task 06 — Doctor module

- create/list/get/update/status
- tenant isolation
- per-tenant email uniqueness

## Task 07 — Schedule + availability foundation

- create/list recurring schedules
- overlap prevention
- slot generation
- timezone handling
- no appointment filtering until appointment module is connected

## Task 08 — Patient module

- create/list/get/update
- safe search
- tenant isolation

## Task 09 — Appointment module

- booking
- slot validation
- double-booking partial unique index mapping
- list/get
- reschedule
- cancel
- availability integration

## Task 10 — Notification module

- post-commit notification abstraction
- log/simulated provider
- errors do not roll back appointment

## Task 11 — Backend E2E hardening

- full clinic workflow
- tenancy negative tests
- concurrent booking test
- error-contract tests

## Task 12 — Docker production image

- multi-stage Dockerfile
- non-root runtime where practical
- production configuration
- healthcheck

## Task 13 — Terraform AWS infrastructure

- VPC/network
- security groups
- EC2
- RDS PostgreSQL
- ALB/TLS path
- Cognito
- IAM
- CloudWatch
- no NAT unless plan proves it is needed

Never automatically apply.

## Task 14 — GitHub Actions deployment

- CI
- image publishing
- AWS OIDC
- dev/prod deployment workflow
- controlled migration step
- production approval

## Task 15 — React AIDLC

Before coding UI:

- user journeys
- screen inventory
- navigation
- form behavior
- API client design
- auth integration
- component strategy

Then implement React separately.

## Review rule

Do not start the next task merely because the current task compiled.

Review:

- git diff
- tests
- module boundaries
- tenant isolation
- migrations
- dependency additions
