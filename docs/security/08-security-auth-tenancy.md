# 08 — Security, Authentication, Authorization, Tenancy

## Identity

Amazon Cognito is the production identity provider.

MediFlow does not store passwords.

The backend verifies the Cognito JWT.

## Application membership source of truth

Do not trust tenant or role solely because a token contains a custom attribute.

Use verified Cognito identity (`sub`) to find the MediFlow `users` record.

Database membership determines:

- application user id
- tenant id
- role
- active/inactive status

This makes tenant and role changes effective without relying on long-lived token custom attributes.

## Request context

After authentication:

```ts
interface RequestContext {
  userId: string;
  cognitoSub: string;
  tenantId: string;
  role: 'CLINIC_ADMIN' | 'RECEPTIONIST' | 'DOCTOR';
  requestId: string;
  correlationId: string;
}
```

Clinic onboarding is a special authenticated flow where the user has a verified Cognito identity but no MediFlow membership yet.

## Tenant rule

For tenant-owned resources:

```text
trusted tenantId + resource id
```

is required.

Never authorize a resource by resource ID alone.

Never accept trusted tenant identity from:

- body
- query
- path
- arbitrary header

## Cross-tenant behavior

If a resource exists under another tenant, respond exactly as if it does not exist.

Use 404 to avoid leaking resource existence.

## Authorization

Use NestJS guards/decorators for coarse role authorization.

Business services still enforce contextual business rules.

UI hiding is never sufficient authorization.

## Input validation

Use NestJS global `ValidationPipe`.

Recommended settings:

- transform input where safe
- whitelist known properties
- reject or strip unexpected properties according to approved project convention
- validate UUIDs
- validate dates
- validate email format
- validate enum/status values

## Secrets

Local:

- `.env` ignored by Git
- `.env.example` contains placeholders only

Production:

- secrets from AWS secure storage or EC2 runtime configuration
- do not bake secrets into Docker image
- do not commit secrets into Terraform variables

## Logging

Never log:

- bearer tokens
- authorization headers
- passwords
- Cognito raw claims unless specifically safe/necessary
- DB passwords
- secrets
- full patient records
- appointment reason by default

## Database security

- RDS is not publicly reachable
- only app security group can access DB port
- TLS to RDS should be enabled in production where supported/configured
- application DB user uses only required database permissions

## HTTP security

Production must use HTTPS.

Add sensible security headers via a maintained mechanism such as Helmet if approved during implementation.

CORS must be explicitly configured for the deployed React origin(s), not `*` in production.

## Rate limiting

Do not add distributed rate-limit infrastructure initially.

A lightweight per-instance limit may be added later if required, but do not depend on it as the primary security boundary.
