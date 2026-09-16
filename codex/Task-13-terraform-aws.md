# Codex Task 13 — Terraform Initial AWS Infrastructure

Read deployment architecture and ADRs.

Generate Terraform for the initial production architecture:

- VPC/subnets/routing as needed
- security groups
- Application Load Balancer + HTTPS path
- EC2 application host
- Amazon RDS PostgreSQL
- Cognito User Pool / app client as approved
- IAM
- CloudWatch basics
- secure application configuration approach
- DNS/TLS inputs where environment-specific

Constraints:

- RDS private/not publicly accessible
- app-to-DB SG rule only
- avoid NAT Gateway unless the plan proves it is required
- no EKS
- no ECS
- no Redis
- no SQS
- no RDS Proxy
- no multi-region
- development-sized initial capacity

Before writing, explain expected recurring-cost components.

Run:

- terraform fmt
- terraform validate
- terraform plan only if credentials/config are intentionally available

Never run terraform apply/destroy.

Stop and report.
