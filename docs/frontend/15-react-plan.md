# 15 — React UI Plan

React is intentionally deferred until the backend core is stable.

## Stack direction

- React
- TypeScript
- REST API client
- Cognito authentication integration
- modern router
- form validation
- test tooling selected during UI AIDLC

Do not lock unnecessary frontend libraries before UI requirements are written.

## Initial screens

Likely V1 screens:

- login
- clinic onboarding
- clinic profile
- dashboard
- doctors list
- doctor create/edit
- doctor schedule
- doctor availability
- patients list/search
- patient create/edit
- appointments calendar/list
- book appointment
- reschedule appointment
- cancel appointment

## Principle

The backend remains frontend-independent.

React never supplies trusted `tenantId`.

Authorization is still enforced by NestJS.
