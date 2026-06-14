variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Nombre del bucket S3 — debe coincidir con el dominio para que S3 website routing funcione con Cloudflare proxy"
  type        = string
  default     = "danilocloud.me"
}

variable "monthly_budget_usd" {
  description = "Tope mensual del budget AWS (USD)"
  type        = string
  default     = "2"
}

variable "billing_alert_email" {
  description = "Email para alertas de AWS Budgets (definir en terraform.tfvars)"
  type        = string
}
