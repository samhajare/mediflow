# ADR-002 — Docker PostgreSQL Locally, RDS PostgreSQL in Production

**Status:** Accepted

## Decision

Local development:

- NestJS on developer machine initially
- PostgreSQL in Docker Compose

Production:

- Dockerized NestJS
- PostgreSQL on Amazon RDS

## Why

This keeps local development cheap and reproducible while using a managed database for production reliability.

The same TypeORM migrations must define both environments.

## Rejected

- PostgreSQL container on the production app EC2 host
- separate schema design for local vs production
