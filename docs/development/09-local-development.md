# 09 — Local Development

## Task 01 setup

Use Node.js 24.16.0 (supported Node 24 LTS), pinned in `.nvmrc` and
`package.json`. CI reads the same pin. Install dependencies with `npm ci`.
Copy `.env.example` to `.env` and replace the password placeholder with a
local-only password. Do not commit `.env` or reuse production credentials.

Run `docker compose up -d postgres`, then `npm run migration:run`, then
`npm run start:dev`. There are no business migrations in Task 01.
Compose requires DB_NAME, DB_USERNAME and DB_PASSWORD and binds the database
port on loopback only. Existing named volumes retain their original database
credentials; changing `.env` does not change credentials in an existing volume.

Nest and the TypeORM CLI share `src/config/database.config.ts`. Node's built-in
environment loader reads the repository-root `.env`; existing process variables
take precedence. All five DB variables are required, DB_PORT is validated,
and `synchronize` and automatic migration execution remain false.

`GET /health/live` returns 200 with `{ "status": "ok" }`.
`GET /health/ready` returns 200 with
`{ "status": "ok", "scope": "application", "database": "not_checked" }`.
Readiness does not query PostgreSQL. A future database probe can extend this
separate readiness handler without changing liveness.

`npm run test:e2e` boots AppModule over HTTP with the database module replaced
at the Nest testing boundary. It verifies health routing, not DB connectivity.
Real PostgreSQL connectivity is checked separately with the migration CLI.
`npm run build` emits `dist/main.js`; `npm run start:prod` runs that artifact.

If host port 5432 is occupied, set `DB_PORT=5433` for both Compose and Nest/CLI
(PowerShell: `$env:DB_PORT='5433'`) or update your ignored `.env`. Task 01
validation used port 5433 successfully; `.env` was preserved. Migration execution
created only TypeORM's migration-history table and reported no pending migrations.

## Goal

Keep local development fast and independent of AWS where practical.

## Local topology

```text
NestJS on host
    |
localhost:5432
    |
PostgreSQL Docker
```

## Docker Compose

Initial Compose scope:

- PostgreSQL only

NestJS runs with:

```bash
npm run start:dev
```

This gives fast watch-mode development and debugging.

## Expected environment variables

Example categories:

```text
NODE_ENV
PORT

DB_HOST
DB_PORT
DB_NAME
DB_USERNAME
DB_PASSWORD

COGNITO_REGION
COGNITO_USER_POOL_ID
COGNITO_CLIENT_ID
```

For automated tests, authentication guards can be overridden/mocked at the Nest testing boundary rather than requiring real Cognito calls.

## Database

Local DB values may be development-only defaults.

Never reuse production credentials.

Use a named Docker volume for local persistence.

## Migrations

Development workflow:

1. start PostgreSQL
2. run pending migrations
3. run application

Never use `synchronize: true`.

## Suggested scripts

Exact names may change during Task 01:

```text
start:dev
build
start:prod
lint
format
typecheck
test
test:watch
test:cov
test:e2e
migration:run
migration:revert
```

## Local reset

A destructive local-only database reset command may be provided later, but it must clearly target local development and must never infer production configuration.
