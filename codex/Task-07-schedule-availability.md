# Codex Task 07 — Doctor Schedule + Availability Foundation

Implement only:

- POST /v1/doctors/{doctorId}/schedules
- GET /v1/doctors/{doctorId}/schedules
- GET /v1/doctors/{doctorId}/availability?date=YYYY-MM-DD

Rules:

- dayOfWeek: 0..6, Sunday = 0
- local wall-clock schedule times
- explicit clinic IANA timezone
- no server-local timezone assumptions
- active schedules cannot overlap for same tenant/doctor/day
- adjacent ranges are allowed
- slot generation uses schedule slot duration
- multiple daily windows supported
- inactive/missing/cross-tenant doctor handled safely

At this stage, keep candidate slot generation separable from appointment occupancy filtering. If Appointment module is not yet implemented, do not invent it.

No schedule update/delete API.

Add deterministic timezone-independent tests.

Stop and report.
