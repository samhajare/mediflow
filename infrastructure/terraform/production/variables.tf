variable "aws_region" {
  type    = string
  default = "ap-south-1"
}
variable "project_name" {
  type    = string
  default = "mediflow"
}
variable "environment" {
  type    = string
  default = "prod"
}
variable "vpc_cidr" {
  type    = string
  default = "10.20.0.0/16"
}
variable "availability_zones" {
  type    = list(string)
  default = ["ap-south-1a", "ap-south-1b"]
}
variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.20.1.0/24", "10.20.2.0/24"]
}
variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.20.11.0/24", "10.20.12.0/24"]
}
variable "instance_type" {
  type    = string
  default = "t3.micro"
}
variable "db_instance_class" {
  type    = string
  default = "db.t4g.micro"
}
variable "db_name" {
  type    = string
  default = "mediflow"
}
variable "db_username" {
  type    = string
  default = "mediflow_app"
}
variable "db_password" {
  type      = string
  sensitive = true
}
variable "app_image_uri" {
  type        = string
  description = "Immutable registry URI and tag for the production image."
}
variable "certificate_arn" {
  type        = string
  default     = null
  nullable    = true
  description = "ACM certificate ARN for HTTPS."
}
variable "enable_https" {
  type    = bool
  default = false
}
variable "callback_urls" {
  type    = list(string)
  default = []
}
variable "logout_urls" {
  type    = list(string)
  default = []
}
variable "cognito_domain_prefix" {
  type    = string
  default = "mediflow-prod"
}
variable "ssh_ingress_cidr" {
  type     = string
  default  = null
  nullable = true
}
