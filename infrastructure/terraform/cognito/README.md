# MediFlow Cognito Terraform

This stack creates the Cognito User Pool and public React web App Client used by MediFlow authentication. It does not create users, passwords, application memberships, tenant claims, or any other AWS infrastructure.

For development, copy the outputs into runtime configuration as appropriate:

```dotenv
COGNITO_REGION=<terraform output -raw aws_region>
COGNITO_USER_POOL_ID=<terraform output -raw cognito_user_pool_id>
COGNITO_CLIENT_ID=<terraform output -raw cognito_app_client_id>
```

The application resolves tenant, role, and membership status from PostgreSQL. Cognito custom claims are intentionally not used for authorization.

For a manual development user, use the AWS Console or an explicitly authorized CLI command such as:

```bash
aws cognito-idp sign-up \
  --client-id "$COGNITO_CLIENT_ID" \
  --username developer@example.com \
  --password '<locally-generated-development-password>' \
  --user-attributes Name=email,Value=developer@example.com
```

Confirm the email using the verification code from the configured email flow. Never place real passwords in Terraform, source control, shell history, or CI configuration.
