output "aws_region" {
  description = "AWS region containing the Cognito resources."
  value       = var.aws_region
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID for COGNITO_USER_POOL_ID."
  value       = aws_cognito_user_pool.this.id
}

output "cognito_app_client_id" {
  description = "Public Cognito App Client ID for the React application."
  value       = aws_cognito_user_pool_client.web.id
}

output "cognito_issuer_url" {
  description = "Cognito issuer URL used to validate JWT claims."
  value       = "https://cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.this.id}"
}

output "cognito_domain" {
  description = "Cognito managed-login domain, when enabled."
  value       = var.create_domain ? "https://${aws_cognito_user_pool_domain.this[0].domain}.auth.${var.aws_region}.amazoncognito.com" : null
}
