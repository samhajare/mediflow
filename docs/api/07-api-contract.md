# 07 — REST API Contract

## Base

`/v1`

JSON request/response.

## Authentication

Protected endpoints require:

```http
Authorization: Bearer <Cognito JWT>
```

The server verifies identity and resolves MediFlow membership from PostgreSQL.

## Correlation

Support:

```http
X-Correlation-Id
```

If absent, generate one.

## Success envelope

Single resource:

```json
{
  "data": {}
}
```

Collection:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

## Error envelope

```json
{
  "code": "ERROR_CODE",
  "message": "Safe client-facing message",
  "requestId": "..."
}
```

Validation errors may include safe `details`.

## HTTP status conventions

- 200 OK
- 201 Created
- 204 No Content
- 400 Validation / bad request
- 401 Unauthenticated
- 403 Forbidden
- 404 Not found
- 409 Conflict
- 500 Internal error

## Health

- `GET /health/live`
- `GET /health/ready`

## Clinic onboarding/profile

- `POST /v1/clinics`
- `GET /v1/clinics/me`
- `PATCH /v1/clinics/me`

### POST /v1/clinics

Authenticated Cognito user with no active MediFlow membership.

Request:

```json
{
  "name": "Smile Dental Clinic",
  "email": "contact@example.com",
  "phone": "+919876543210",
  "timezone": "Asia/Kolkata"
}
```

Creates:

- clinic
- first `CLINIC_ADMIN` application user

in one transaction.

## Doctors

- `POST /v1/doctors`
- `GET /v1/doctors`
- `GET /v1/doctors/{doctorId}`
- `PATCH /v1/doctors/{doctorId}`
- `PATCH /v1/doctors/{doctorId}/status`

Create/update admin-only.

List/get allowed to clinic roles according to authorization matrix.

## Schedules

- `POST /v1/doctors/{doctorId}/schedules`
- `GET /v1/doctors/{doctorId}/schedules`
- `GET /v1/doctors/{doctorId}/availability?date=YYYY-MM-DD`

Create schedule: admin-only.

Read schedules/availability: clinic roles.

No update/delete schedule endpoint in V1.

## Patients

- `POST /v1/patients`
- `GET /v1/patients`
- `GET /v1/patients/{patientId}`
- `PATCH /v1/patients/{patientId}`

Default pagination:

- page = 1
- limit = 20
- max limit = 100

Search may include safe demographic/contact fields such as name, phone, or email.

## Appointments

- `POST /v1/appointments`
- `GET /v1/appointments`
- `GET /v1/appointments/{appointmentId}`
- `PATCH /v1/appointments/{appointmentId}/reschedule`
- `PATCH /v1/appointments/{appointmentId}/cancel`

### Create appointment

Request:

```json
{
  "doctorId": "uuid",
  "patientId": "uuid",
  "startTime": "2026-09-20T10:30:00.000Z",
  "reason": "Routine checkup"
}
```

Client must not provide:

- tenantId
- endTime
- appointment status

Server calculates `endTime` from the applicable schedule.

### Conflict

```json
{
  "code": "APPOINTMENT_SLOT_UNAVAILABLE",
  "message": "The selected appointment slot is no longer available.",
  "requestId": "..."
}
```

HTTP 409.

## Role matrix

| Operation | CLINIC_ADMIN | RECEPTIONIST | DOCTOR |
|---|---|---|---|
| View clinic | Yes | Yes | Yes |
| Update clinic | Yes | No | No |
| Create/update/status doctor | Yes | No | No |
| List/view doctors | Yes | Yes | Yes |
| Create schedule | Yes | No | No |
| View schedule/availability | Yes | Yes | Yes |
| Create/update patients | Yes | Yes | Limited/No by default |
| View patients | Yes | Yes | Yes when required for clinic workflow |
| Book/reschedule/cancel appointment | Yes | Yes | Limited by future doctor workflow rules |
| List appointments | Yes | Yes | Yes, scoped appropriately |

Where doctor-specific authorization is not fully defined, implementation must not invent broad write access. Start conservative and update this contract before expanding permissions.

## Standard errors

- `VALIDATION_ERROR`
- `UNAUTHENTICATED`
- `FORBIDDEN`
- `CLINIC_NOT_FOUND`
- `USER_MEMBERSHIP_NOT_FOUND`
- `DOCTOR_NOT_FOUND`
- `DOCTOR_INACTIVE`
- `DOCTOR_EMAIL_ALREADY_EXISTS`
- `DOCTOR_SCHEDULE_CONFLICT`
- `PATIENT_NOT_FOUND`
- `APPOINTMENT_NOT_FOUND`
- `APPOINTMENT_SLOT_UNAVAILABLE`
- `INTERNAL_ERROR`
