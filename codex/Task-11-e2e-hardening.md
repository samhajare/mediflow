# Codex Task 11 — Backend E2E + Security Hardening

Create/complete end-to-end tests for the critical flow:

1. authenticated user onboards clinic
2. clinic admin creates doctor
3. admin creates schedule
4. authorized user creates patient
5. availability returns expected slots
6. appointment is booked
7. booked slot becomes unavailable
8. competing booking receives 409
9. appointment reschedules
10. appointment cancels

Mandatory tenant-negative tests:

- tenant A cannot read/update tenant B doctor
- tenant A cannot read/update tenant B patient
- tenant A cannot read/update tenant B appointment

Review:

- validation
- exception output
- accidental sensitive logging
- authorization decorators/guards
- SQL/query tenant filters
- N+1 behavior in common paths

Do not add new product features.

Stop and report.
