# 05 — Module Boundaries

## Proposed NestJS modules

```text
src/
├── modules/
│   ├── auth/
│   ├── clinics/
│   ├── users/
│   ├── doctors/
│   ├── schedules/
│   ├── patients/
│   ├── appointments/
│   └── notifications/
├── common/
├── config/
├── database/
├── app.module.ts
└── main.ts
```

## Internal module structure

Prefer:

```text
doctors/
├── controllers/
├── services/
├── repositories/
├── entities/
├── dto/
├── mappers/
└── tests/
```

Use only folders that add value. Do not create empty abstraction layers merely to match a diagram.

## Auth module

Owns:

- Cognito JWT verification integration
- authenticated principal extraction
- request context creation
- authentication guard

Must not trust tenant/role values directly from arbitrary request input.

## Users module

Owns application membership and role persistence.

The PostgreSQL application user record is the source of truth for:

- tenant membership
- application role
- active/inactive state

## Clinics module

Owns:

- clinic onboarding
- clinic profile
- clinic status

Tables:

- `clinics`

Clinic onboarding coordinates Clinics + Users in one transaction.

## Doctors module

Owns:

- doctor profile
- doctor status

Table:

- `doctors`

## Schedules module

Owns:

- recurring weekly doctor schedules
- schedule overlap validation
- candidate slot generation
- availability orchestration

Table:

- `doctor_schedules`

Availability reads appointments through a narrow application/repository dependency rather than placing appointment SQL inside controllers.

## Patients module

Owns patient demographic/contact data used for booking.

Table:

- `patients`

No EMR/clinical notes in V1.

## Appointments module

Owns:

- booking
- listing
- rescheduling
- cancellation
- appointment status rules
- database-level double-booking behavior

Table:

- `appointments`

## Notifications module

Owns notification dispatch abstraction.

V1 provider can be a log/simulated provider.

No public API is required initially.

## Module dependency guidance

Preferred direction:

```text
Auth -> Users
Clinics -> Users (onboarding orchestration)
Schedules -> Doctors
Appointments -> Doctors + Patients + Schedules
Appointments -> Notifications (after commit)
```

Avoid bidirectional module dependencies.

When a dependency becomes circular, redesign the API between modules rather than using `forwardRef()` as the default solution.

## Shared/common code

`common/` is only for truly cross-cutting concerns:

- decorators
- guards
- filters
- interceptors
- pipes
- error types
- response helpers
- logging context

Do not create a giant generic `utils` dumping ground.
