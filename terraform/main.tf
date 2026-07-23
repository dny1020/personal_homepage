terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "S3 bucket name. Keep it aligned with the domain so website hosting works with Cloudflare."
  type        = string
  default     = "danilocloud.me"
}

variable "monthly_budget_usd" {
  description = "Monthly AWS budget in USD"
  type        = string
  default     = "2"
}

variable "billing_alert_email" {
  description = "Email for AWS Budgets alerts"
  type        = string
}

resource "aws_s3_bucket" "homepage" {
  bucket        = var.bucket_name
  force_destroy = true

  tags = {
    Project = "personal-homepage"
  }
}

# S3 versioning and lifecycle
resource "aws_s3_bucket_versioning" "homepage" {
  bucket = aws_s3_bucket.homepage.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "homepage" {
  bucket = aws_s3_bucket.homepage.id

  rule {
    id     = "expire-old-versions"
    status = "Enabled"

    filter {}

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

# Website hosting
resource "aws_s3_bucket_website_configuration" "homepage" {
  bucket = aws_s3_bucket.homepage.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# Public access
resource "aws_s3_bucket_public_access_block" "homepage" {
  bucket = aws_s3_bucket.homepage.id

  block_public_acls       = true
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = false
}

# Allow public read access to objects only.
resource "aws_s3_bucket_policy" "homepage" {
  bucket     = aws_s3_bucket.homepage.id
  depends_on = [aws_s3_bucket_public_access_block.homepage]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.homepage.arn}/*"
      }
    ]
  })
}

# Deploy user
resource "aws_iam_user" "deploy" {
  name = "homepage-deploy"

  tags = {
    Project = "personal-homepage"
  }
}

resource "aws_iam_user_policy" "deploy" {
  name = "homepage-s3-deploy"
  user = aws_iam_user.deploy.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "ListBucket"
        Effect   = "Allow"
        Action   = ["s3:ListBucket"]
        Resource = aws_s3_bucket.homepage.arn
      },
      {
        Sid    = "ManageObjects"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.homepage.arn}/*"
      }
    ]
  })
}

resource "aws_iam_access_key" "deploy" {
  user = aws_iam_user.deploy.name
}

# Budget alerts
resource "aws_budgets_budget" "monthly" {
  name         = "homepage-monthly-cap"
  budget_type  = "COST"
  limit_amount = var.monthly_budget_usd
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 60
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.billing_alert_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 85
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.billing_alert_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.billing_alert_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.billing_alert_email]
  }
}

output "s3_website_endpoint" {
  description = "Endpoint of the website. Use it as the Cloudflare CNAME target."
  value       = aws_s3_bucket_website_configuration.homepage.website_endpoint
}

output "s3_bucket_name" {
  description = "Bucket name used by aws s3 sync."
  value       = aws_s3_bucket.homepage.id
}

output "s3_bucket_arn" {
  value = aws_s3_bucket.homepage.arn
}

output "deploy_access_key_id" {
  description = "AWS_ACCESS_KEY_ID for GitHub Actions / CI"
  value       = aws_iam_access_key.deploy.id
}

output "deploy_secret_access_key" {
  description = "AWS_SECRET_ACCESS_KEY. Retrieve with: terraform output -raw deploy_secret_access_key"
  value       = aws_iam_access_key.deploy.secret
  sensitive   = true
}
