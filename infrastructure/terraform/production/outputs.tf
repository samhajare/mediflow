output "alb_dns_name" { value = aws_lb.this.dns_name }
output "rds_endpoint" { value = aws_db_instance.this.address }
output "cognito_user_pool_id" { value = aws_cognito_user_pool.this.id }
output "cognito_app_client_id" { value = aws_cognito_user_pool_client.web.id }
output "cognito_issuer_url" { value = "https://cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.this.id}" }
output "cognito_domain" { value = "https://${aws_cognito_user_pool_domain.this.domain}.auth.${var.aws_region}.amazoncognito.com" }
