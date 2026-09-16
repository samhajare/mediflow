# MediFlow AIDLC Index

## Lifecycle

1. Inception
   - `inception/01-project-inception.md`
2. Requirements
   - `requirements/02-functional-requirements.md`
   - `requirements/03-non-functional-requirements.md`
3. Architecture
   - `architecture/04-system-architecture.md`
   - `architecture/05-module-boundaries.md`
4. Detailed design
   - `database/06-database-design.md`
   - `api/07-api-contract.md`
   - `security/08-security-auth-tenancy.md`
5. Development and quality
   - `development/09-local-development.md`
   - `testing/10-testing-strategy.md`
6. Deployment and operations
   - `deployment/11-aws-deployment.md`
   - `observability/12-observability.md`
7. Implementation
   - `implementation/13-implementation-plan.md`
   - `implementation/14-definition-of-done.md`
8. Frontend
   - `frontend/15-react-plan.md`
9. Architecture decisions
   - `adr/*`
10. Codex execution prompts
   - `codex/*`

## Source-of-truth priority

If documents conflict:

1. Newer approved ADR
2. Security/tenancy design
3. API/database detailed design
4. System architecture
5. Requirements
6. Inception

Do not silently resolve a meaningful conflict in code. Surface it first.
