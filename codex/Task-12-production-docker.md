# Codex Task 12 — Production Docker Image

Create production Docker support for the NestJS monolith.

Requirements:

- multi-stage Dockerfile
- deterministic dependency install
- compile TypeScript in build stage
- minimal runtime contents
- non-root runtime where practical
- production command
- no secrets baked into image
- healthcheck compatible with `/health/live`
- `.dockerignore`

Local development remains NestJS-on-host + PostgreSQL Docker by default.

Do not add Kubernetes/ECS manifests.

Build and smoke-test the image locally if environment permits.

Stop and report.
