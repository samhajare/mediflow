# 14 — Definition of Done

A feature is complete when applicable items are satisfied.

## Behavior

- acceptance criteria implemented
- API contract matches docs
- edge cases handled
- no unrelated feature added

## Security

- authentication enforced where required
- authorization enforced server-side
- tenant isolation verified
- no client-controlled tenant identity
- cross-tenant behavior tested
- secrets absent from code/logs

## Database

- migration created where needed
- `synchronize: false`
- indexes/constraints included
- transaction boundaries reviewed
- tenant filters exist
- migration tested safely

## Quality

- typecheck passes
- lint passes
- unit tests pass
- integration tests pass where applicable
- E2E passes for core workflow changes
- build passes

## Operations

- safe logging
- meaningful errors
- health impact reviewed
- no unnecessary infrastructure added

## Documentation

Update docs/ADR when:

- behavior changes
- API changes
- schema changes
- module boundary changes
- infrastructure direction changes

## Review

Human reviews the diff before the next major task.
