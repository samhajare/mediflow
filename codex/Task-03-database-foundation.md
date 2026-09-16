# Codex Task 03 — Database Foundation

Read:

- AGENTS.md
- database design
- security/tenancy design
- API contract

Goal: implement TypeORM entities and migrations for:

- clinics
- users
- doctors
- doctor_schedules
- patients
- appointments

Requirements:

- UUID PKs
- tenant FKs
- approved indexes
- `TIMESTAMPTZ`
- `synchronize: false`
- appointment partial unique index
- explicit migration sequence

Add PostgreSQL integration tests for critical constraints where test infrastructure is ready.

Do not implement business controllers/services.

Run migration validation against local/test PostgreSQL only.

Never target production.

Stop and report.
