# Codex Task 10 — Notification Module

Implement the V1 notification abstraction only.

Initial provider:

- log/simulate appointment confirmation
- do not expose sensitive patient/appointment body data in logs

Rules:

- called after appointment transaction commits
- failure is caught and logged
- failure does not roll back appointment
- no SQS
- no Redis/BullMQ
- no EventBridge
- no email/SMS vendor unless separately approved

Design the provider interface so a durable async implementation can be added later without changing Appointment domain behavior.

Add tests for success and provider failure.

Stop and report.
