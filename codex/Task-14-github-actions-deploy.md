# Codex Task 14 — GitHub Actions Deployment

Implement CI/CD consistent with the approved architecture.

CI:

- npm ci
- typecheck
- lint
- tests
- build

Delivery:

- build/tag Docker image
- push to approved registry
- authenticate to AWS via GitHub OIDC
- deploy to EC2 through the approved mechanism
- run migrations in a controlled one-time step
- verify health after deployment
- preserve a previous known-good image tag for rollback

Production:

- approval gate where supported
- no static long-lived AWS keys
- no secrets printed in logs
- do not bypass failing tests

Do not alter infrastructure architecture.

Stop and report.
