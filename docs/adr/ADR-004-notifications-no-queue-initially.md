# ADR-004 — Keep Notifications In-Process Initially

**Status:** Accepted

## Context

The earlier architecture used SQS. The new architecture is a modular monolith and initial notification volume is unknown.

## Decision

V1 uses a Notification module called after the appointment transaction commits.

Initial provider can simulate/log delivery.

Notification failure is logged and does not roll back the appointment.

## Future trigger

Adopt SQS/queue infrastructure when there is a measured requirement for:

- durable retry
- burst absorption
- independent notification scaling
- provider outage buffering
- multiple asynchronous consumers
