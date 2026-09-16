# ADR-005 — Do Not Use Kubernetes Initially

**Status:** Accepted

## Decision

Do not use Kubernetes/EKS for V1.

Use Docker for the application container.

Initial production runs on EC2 with RDS PostgreSQL.

## Reason

Kubernetes would add operational complexity without solving a current MediFlow requirement.

## Reconsider when

- many independently deployed workloads exist
- container orchestration requirements exceed simpler AWS options
- multiple teams share a platform
- autoscaling/scheduling requirements justify cluster operations
