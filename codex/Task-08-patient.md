# Codex Task 08 — Patient Module

Implement only:

- POST /v1/patients
- GET /v1/patients
- GET /v1/patients/{patientId}
- PATCH /v1/patients/{patientId}

Requirements:

- tenant-scoped repository methods
- no medical records/clinical notes
- minimal demographic/contact data only
- safe search by approved fields
- DB pagination
- cross-tenant resource -> PATIENT_NOT_FOUND
- role rules from API contract; do not invent broad access

Do not implement Appointment module.

Add unit + integration tests.

Stop and report.
