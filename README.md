# MediFlow AIDLC — Fresh Modular Monolith


## Chosen direction

- Backend: NestJS + TypeScript
- Architecture: Modular monolith
- API style: REST
- ORM: TypeORM
- Database: PostgreSQL
- Local development database: PostgreSQL in Docker Compose
- Local backend: NestJS via `npm run start:dev` initially
- Production backend: Dockerized NestJS on AWS EC2
- Production database: Amazon RDS for PostgreSQL
- Authentication: Amazon Cognito for identity; application DB resolves tenant membership and role
- IaC: Terraform
- CI/CD: GitHub Actions with AWS OIDC
- Frontend: React + TypeScript, implemented after backend core
- Kubernetes: not used initially
- Redis / Kafka / EventBridge / Step Functions / DynamoDB / RDS Proxy: not used initially

## How to use this package

1. Copy this package into the new repository root.
2. Read `AGENTS.md`.
3. Read `docs/00-index.md`.
4. Start with `codex/Task-01-initialize-nestjs.md`.
5. Implement one task at a time.
6. Do not ask Codex to build the whole system in one pass.

The documents in `docs/` are the approved source of truth. If implementation requirements change, update the relevant document or ADR before changing the architecture.
