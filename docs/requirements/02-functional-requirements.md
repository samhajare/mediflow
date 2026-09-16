# 02 — Functional Requirements

## FR-01 Clinic onboarding

An authenticated Cognito user with no active MediFlow membership can create a clinic.

Clinic creation must:

- create the clinic
- create the first application user/membership as `CLINIC_ADMIN`
- happen in one database transaction
- prevent the same user from bootstrapping multiple active clinics unless a future requirement allows it

Clinic fields:

- name
- email (optional)
- phone (optional)
- timezone
- status

## FR-02 Clinic profile

Authorized users can view the current clinic.

`CLINIC_ADMIN` can update editable clinic profile fields.

## FR-03 Users and roles

V1 roles:

- `CLINIC_ADMIN`
- `RECEPTIONIST`
- `DOCTOR`

Application authorization uses the MediFlow database membership record after Cognito identity verification.

## FR-04 Doctor management

`CLINIC_ADMIN` can:

- create doctor
- update doctor
- activate/deactivate doctor

Clinic users with read access can:

- list doctors
- view a doctor

Doctor email is unique per tenant.

## FR-05 Doctor schedules

`CLINIC_ADMIN` can create recurring weekly schedule windows.

Schedule:

- day of week: `0-6`, Sunday = 0
- local start time
- local end time
- slot duration in minutes
- status

Active schedules for the same doctor/day must not overlap.

V1 does not include:

- leave calendar
- holiday calendar
- one-off schedule exceptions
- schedule update/delete API unless later approved

## FR-06 Availability

Authorized clinic users can request doctor availability for a clinic-local calendar date.

Availability must:

- use active weekly schedule windows
- generate slots using each schedule's slot duration
- exclude slots occupied by active appointments
- never use the server's local timezone implicitly
- return no slots when the doctor does not work that day

## FR-07 Patient management

Authorized users can:

- create patient
- update patient
- view patient
- list/search patients

V1 patient data is intentionally minimal and is not an EMR.

## FR-08 Appointment booking

Authorized clinic users can book an appointment for a patient with an active doctor.

Booking must validate:

- tenant ownership
- doctor exists and is active
- patient exists
- requested start belongs to a valid schedule slot
- requested slot is not already occupied

Appointment `end_time` is calculated by the server.

## FR-09 Double-booking prevention

The application must perform a friendly pre-check.

PostgreSQL must also enforce the final concurrency guarantee with a partial unique index for active appointment states.

A database unique conflict caused by the appointment-slot constraint maps to:

- HTTP 409
- code `APPOINTMENT_SLOT_UNAVAILABLE`

## FR-10 Appointment listing

Authorized users can list appointments using tenant-scoped filters such as:

- doctor
- patient
- status
- date range
- pagination

## FR-11 Appointment reschedule

Authorized users can move an appointment to another valid slot.

Rescheduling must use the same availability and concurrency rules as booking.

## FR-12 Appointment cancellation

Authorized users can cancel an appointment.

Normal appointment cancellation is status-based. Do not physically delete appointments.

## FR-13 Appointment statuses

V1 statuses:

- `SCHEDULED`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`
- `NO_SHOW`

## FR-14 Notifications

V1 contains a Notification module abstraction.

Initial implementation may log/simulate notifications after successful appointment commit.

Notification failure must not roll back a successfully committed appointment.

No queue infrastructure is required initially.

## FR-15 Health checks

Expose simple operational endpoints suitable for deployment health checks:

- liveness
- readiness

Readiness may validate database connectivity with a lightweight query.

## FR-16 React UI

React + TypeScript is planned after the backend core is stable.

Backend APIs must not depend on frontend implementation details.
