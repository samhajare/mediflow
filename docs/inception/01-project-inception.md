# 01 — Project Inception

## Product

**MediFlow** is a multi-tenant clinic appointment management SaaS.

A clinic is a tenant. Each clinic can manage its own staff, doctors, doctor schedules, patients, and appointments without seeing another clinic's data.

## V1 objective

Deliver a secure, maintainable clinic scheduling platform with:

- clinic onboarding and profile management
- clinic users and role-based access
- doctor management
- recurring doctor schedules
- availability calculation
- patient management
- appointment booking
- rescheduling
- cancellation
- double-booking prevention
- basic notification abstraction
- production-ready deployment path
- React UI later

## Primary users

- Clinic Admin
- Receptionist
- Doctor

Patient self-service is not required in V1.

## Architecture goal

Prefer a **modular monolith** over microservices.

Reason:

- one product
- one team/codebase
- strong transactional relationships
- easier local development
- easier debugging
- lower AWS cost
- lower operational complexity
- future service extraction remains possible if module boundaries are preserved

## Success criteria

V1 is successful when a clinic can:

1. onboard
2. add doctors
3. define doctor schedules
4. register patients
5. view availability
6. book an appointment
7. reschedule/cancel it
8. prevent conflicting bookings
9. operate securely in a multi-tenant environment

## Out of scope

- EMR/EHR
- prescriptions
- insurance processing
- payments
- billing
- video consultation
- AI recommendations
- complex analytics
- patient mobile app
- multi-region architecture
