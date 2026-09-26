# MediFlow initial production AWS stack

This stack provisions the initial EC2 + ALB + private RDS + Cognito architecture. It deliberately does not provision NAT Gateway, ECS, EKS, Redis, SQS, RDS Proxy, DNS, or ACM certificates. Supply an existing ACM certificate ARN and callback/logout URLs for HTTPS production use.

The RDS password is a sensitive Terraform variable and should be supplied through a secure variable mechanism such as `TF_VAR_db_password`; do not commit `.tfvars` files. The application image is supplied by immutable URI/tag. EC2 uses SSM Session Manager and has no SSH ingress unless `ssh_ingress_cidr` is explicitly set.

Run only after reviewing the plan:

```powershell
terraform init
terraform fmt
terraform validate
terraform plan -var='app_image_uri=...' -var='db_password=...'
```

Never commit credentials, Terraform state, or plan files.
