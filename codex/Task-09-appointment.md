# Codex Task 09 — Appointment Module

Implement:

- POST /v1/appointments
- GET /v1/appointments
- GET /v1/appointments/{appointmentId}
- PATCH /v1/appointments/{appointmentId}/reschedule
- PATCH /v1/appointments/{appointmentId}/cancel

Booking must validate:

- trusted tenant
- active doctor
- patient
- requested start aligns to a valid schedule slot
- no active conflicting appointment
- server calculates endTime

Concurrency:

- use application pre-check for friendly response
- rely on PostgreSQL partial unique index as final guarantee
- map only the approved appointment-slot constraint's `23505` to HTTP 409 `APPOINTMENT_SLOT_UNAVAILABLE`

Reschedule must use the same slot validation and concurrency protection.

Cancellation is status-based.

Connect availability to active appointment filtering without duplicating slot-generation logic.

Call Notification module only after successful commit. Notification failure must not undo the appointment.

Add unit, PostgreSQL integration, and concurrent-booking tests.

Stop and report.
