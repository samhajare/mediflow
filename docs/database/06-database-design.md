# 06 — Database Design

## Technology

PostgreSQL + TypeORM.

Rules:

- UUID primary keys
- snake_case DB columns
- camelCase TypeScript properties
- `TIMESTAMPTZ` for timestamps
- `synchronize: false`
- migrations are mandatory
- UTC timestamps
- tenant-scoped indexes

## 1. clinics

```text
id          UUID PK
name        VARCHAR(150) NOT NULL
email       VARCHAR(255) NULL
phone       VARCHAR(30) NULL
timezone    VARCHAR(100) NOT NULL
status      VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
created_at  TIMESTAMPTZ NOT NULL
updated_at  TIMESTAMPTZ NOT NULL
```

Status:

- `ACTIVE`
- `INACTIVE`

`timezone` stores an IANA timezone, e.g. `Asia/Kolkata`.

## 2. users

Application membership record.

```text
id           UUID PK
cognito_sub  VARCHAR(255) NOT NULL UNIQUE
tenant_id    UUID NOT NULL FK -> clinics.id
email        VARCHAR(255) NOT NULL
role         VARCHAR(30) NOT NULL
status       VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
created_at   TIMESTAMPTZ NOT NULL
updated_at   TIMESTAMPTZ NOT NULL
```

Roles:

- `CLINIC_ADMIN`
- `RECEPTIONIST`
- `DOCTOR`

Indexes:

- `(tenant_id)`
- `(tenant_id, role)`
- unique `(cognito_sub)`

## 3. doctors

```text
id              UUID PK
tenant_id       UUID NOT NULL FK -> clinics.id
user_id         UUID NULL FK -> users.id
first_name      VARCHAR(100) NOT NULL
last_name       VARCHAR(100) NOT NULL
email           VARCHAR(255) NOT NULL
phone           VARCHAR(30) NULL
specialization  VARCHAR(150) NOT NULL
qualification   VARCHAR(255) NULL
status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
created_at      TIMESTAMPTZ NOT NULL
updated_at      TIMESTAMPTZ NOT NULL
```

Constraints/indexes:

- unique `(tenant_id, email)`
- index `(tenant_id, status)`
- index `(tenant_id, specialization)`

`user_id` is optional because a doctor profile may exist before the doctor receives a login.

## 4. doctor_schedules

```text
id                     UUID PK
tenant_id              UUID NOT NULL FK -> clinics.id
doctor_id              UUID NOT NULL FK -> doctors.id
day_of_week            SMALLINT NOT NULL
start_time             TIME NOT NULL
end_time               TIME NOT NULL
slot_duration_minutes  SMALLINT NOT NULL DEFAULT 30
status                  VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
created_at              TIMESTAMPTZ NOT NULL
updated_at              TIMESTAMPTZ NOT NULL
```

Rules:

- `day_of_week` 0..6, Sunday = 0
- `start_time < end_time`
- `slot_duration_minutes > 0`
- active schedule overlap prevented at application layer in V1

Indexes:

- `(tenant_id, doctor_id)`
- `(tenant_id, doctor_id, day_of_week, status)`

## 5. patients

```text
id             UUID PK
tenant_id      UUID NOT NULL FK -> clinics.id
first_name     VARCHAR(100) NOT NULL
last_name      VARCHAR(100) NOT NULL
phone          VARCHAR(30) NULL
email          VARCHAR(255) NULL
date_of_birth  DATE NULL
status         VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
created_at     TIMESTAMPTZ NOT NULL
updated_at     TIMESTAMPTZ NOT NULL
```

Indexes:

- `(tenant_id, status)`
- `(tenant_id, phone)`
- `(tenant_id, email)`

Do not add global uniqueness for patient phone/email.

## 6. appointments

```text
id            UUID PK
tenant_id     UUID NOT NULL FK -> clinics.id
doctor_id     UUID NOT NULL FK -> doctors.id
patient_id    UUID NOT NULL FK -> patients.id
start_time    TIMESTAMPTZ NOT NULL
end_time      TIMESTAMPTZ NOT NULL
status        VARCHAR(20) NOT NULL
reason        VARCHAR(500) NULL
cancelled_at  TIMESTAMPTZ NULL
created_at    TIMESTAMPTZ NOT NULL
updated_at    TIMESTAMPTZ NOT NULL
```

Statuses:

- `SCHEDULED`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`
- `NO_SHOW`

Indexes:

- `(tenant_id, doctor_id, start_time)`
- `(tenant_id, patient_id, start_time)`
- `(tenant_id, status, start_time)`

### Double-booking protection

Required PostgreSQL partial unique index:

```sql
CREATE UNIQUE INDEX appointments_active_slot_unique
ON appointments (
    tenant_id,
    doctor_id,
    start_time
)
WHERE status IN ('SCHEDULED', 'CONFIRMED');
```

The application performs a pre-check for a friendly message.

The database index is the final concurrency guarantee.

PostgreSQL `23505` caused by this specific constraint maps to:

- HTTP 409
- `APPOINTMENT_SLOT_UNAVAILABLE`

Do not globally map every `23505` to this error.

## Tenant isolation

Every query for tenant-owned data must include the trusted `tenant_id`.

Examples:

```text
doctor:       tenant_id + doctor_id
patient:      tenant_id + patient_id
appointment:  tenant_id + appointment_id
```

Cross-tenant resource lookups return not found.

## Migrations

Suggested migration sequence:

1. create clinics
2. create users
3. create doctors
4. create doctor_schedules
5. create patients
6. create appointments
7. add/update indexes only through future migrations

Never modify a migration already applied in a shared environment unless the project has not yet used it anywhere.
