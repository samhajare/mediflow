# Production GitHub Actions deployment

`.github/workflows/deploy-production.yml` validates the application, builds the production Docker image, publishes it to GHCR, and deploys through AWS Systems Manager. It runs only for `v*` tags or an explicit workflow dispatch.

Configure a protected GitHub environment named `production` with required reviewers. Add these environment variables (not secrets):

- `AWS_DEPLOY_ROLE_ARN`: IAM role trusted by GitHub's OIDC provider
- `AWS_REGION`: AWS region
- `EC2_INSTANCE_ID`: target EC2 instance ID
- `PRODUCTION_HEALTH_URL`: ALB base URL, for example `https://api.example.com`

The AWS role should be limited to the required SSM send/wait operations. The EC2 instance role needs permission to use SSM. The EC2 host must have Docker and `/etc/mediflow/app.env` provisioned with runtime configuration, including database and Cognito settings. That file is never created by GitHub Actions.

The workflow uses `GITHUB_TOKEN` only for GHCR authentication. The package must be pullable by the EC2 host, or the deployment command must be adapted to an approved private registry with an EC2 instance-role pull policy.

Migrations run once in the deployment command before the new container starts. The image tag is immutable and the previous tag should be retained for rollback by rerunning the workflow with `image_tag` set to that known-good tag. No automatic rollback or destructive migration is performed.
