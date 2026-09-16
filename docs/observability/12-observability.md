# 12 — Observability

## Logging

Production logs should be structured JSON.

Useful fields:

- timestamp
- level
- service = `mediflow-api`
- module
- operation
- requestId
- correlationId
- tenantId where safe
- userId where safe
- resourceId where useful
- status
- durationMs

Do not log sensitive body content by default.

## Request IDs

Every request gets a request ID.

Accept or generate correlation ID.

Return request ID in error responses.

## Metrics

Initial operational metrics:

- HTTP request count
- HTTP 4xx/5xx
- latency
- EC2 CPU/memory where available
- RDS CPU
- RDS connections
- RDS free storage
- RDS latency
- application restart count

## Alerts

Initial alarms:

- sustained 5xx errors
- unhealthy app
- high RDS connections
- low DB storage
- high CPU for sustained period

Avoid dozens of noisy alarms before operating experience exists.

## Health

`/health/live`

- process is running

`/health/ready`

- application can serve traffic
- database connectivity is healthy

Health responses must not expose secret configuration.
