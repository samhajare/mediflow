# Codex Task 04 — Authentication, Membership, Tenant Context

Read:

- AGENTS.md
- security/auth/tenancy design
- module boundaries
- API contract

Goal:

- verify Cognito JWT through an isolated auth adapter
- extract verified Cognito `sub`
- resolve active MediFlow user by `cognito_sub`
- build trusted RequestContext
- implement auth guard
- implement roles decorator/guard
- support the clinic-onboarding state where identity is verified but no membership exists yet
- make guards overrideable for tests

Do not trust tenant/role from request input.

Do not implement clinic onboarding yet.

Tests must cover:

- invalid/absent auth
- inactive membership
- trusted context population
- role enforcement
- no-membership onboarding state

Stop and report.
