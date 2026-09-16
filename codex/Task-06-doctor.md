# Codex Task 06 — Doctor Module

Read `AGENTS.md`, API contract, DB design, security/tenancy design, and completed module patterns.

Implement only:

- POST /v1/doctors
- GET /v1/doctors
- GET /v1/doctors/{doctorId}
- PATCH /v1/doctors/{doctorId}
- PATCH /v1/doctors/{doctorId}/status

Requirements:

- tenantId only from trusted RequestContext
- admin-only create/update/status
- tenant-scoped repository queries
- per-tenant email uniqueness
- cross-tenant access -> DOCTOR_NOT_FOUND
- database unique violation mapped safely
- pagination uses DB, not memory
- no schedule work

Add unit + integration tests.

Run typecheck, lint, test, build.

Stop and report.
