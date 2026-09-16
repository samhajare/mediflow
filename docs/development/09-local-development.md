# 09 — Local Development

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
