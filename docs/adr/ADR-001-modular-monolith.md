# ADR-001 — Use a NestJS Modular Monolith

**Status:** Accepted

## Context

The earlier design used Lambda/service-oriented boundaries. MediFlow V1 is one SaaS product with closely coupled workflows and no proven independent scaling or deployment requirement.

## Decision

Use one NestJS application organized into explicit business modules.

## Consequences

Positive:

- simpler development
- easier debugging
- easier transactions
- lower infrastructure cost
- fewer distributed failure modes

Tradeoff:

- modules share a process/database
- discipline is required to preserve boundaries

## Exit criteria

Extract a module only when concrete evidence shows a need such as:

- independent scaling
- independent deployment cadence
- reliability isolation
- team ownership
- materially different runtime requirements
