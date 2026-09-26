variable "aws_region" {
  description = "AWS region for the Cognito resources."
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name used in Cognito resource names."
  type        = string
  default     = "mediflow"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "dev"
}

variable "callback_urls" {
  description = "Allowed OAuth callback URLs for the public React client."
  type        = list(string)
  default     = ["http://localhost:5173/auth/callback"]
}

variable "logout_urls" {
  description = "Allowed OAuth logout URLs for the public React client."
  type        = list(string)
  default     = ["http://localhost:5173/"]
}

variable "create_domain" {
  description = "Whether to create a Cognito managed-login domain."
  type        = bool
  default     = true
}

variable "domain_prefix" {
  description = "Globally unique Cognito domain prefix. Set per account/environment."
  type        = string
  default     = "mediflow-dev"
}

variable "mfa_configuration" {
  description = "Cognito MFA mode. DEV can use OFF; production should be reviewed separately."
  type        = string
  default     = "OFF"

  validation {
    condition     = contains(["OFF", "OPTIONAL", "ON"], var.mfa_configuration)
    error_message = "mfa_configuration must be OFF, OPTIONAL, or ON."
  }
}
