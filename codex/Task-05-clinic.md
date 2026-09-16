# Codex Task 05 — Clinic Onboarding and Profile

Implement only:

- POST /v1/clinics
- GET /v1/clinics/me
- PATCH /v1/clinics/me

Clinic onboarding must create:

- clinic
- first CLINIC_ADMIN membership

in one PostgreSQL transaction.

Enforce:

- verified Cognito identity
- no existing active membership for onboarding
- timezone validation
- server-side membership/tenant rules

Do not start Doctor module.

Run tests and stop.
