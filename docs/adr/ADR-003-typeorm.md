# ADR-003 — Use TypeORM

**Status:** Accepted

## Decision

Use TypeORM with PostgreSQL.

Rules:

- migrations required
- `synchronize: false`
- repository/query logic outside controllers
- explicit transaction handling for atomic workflows

## Rejected

Prisma for this project, because the selected stack is TypeORM.
