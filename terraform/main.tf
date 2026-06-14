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

# ── S3 Bucket ─────────────────────────────────────────────────────────────────

resource "aws_s3_bucket" "homepage" {
  bucket        = var.bucket_name
  force_destroy = true

  tags = {
    Project = "personal-homepage"
  }
}

# Versionado mínimo: protege contra sobreescrituras accidentales.
# Las versiones antiguas se eliminan automáticamente después de 30 días (ver lifecycle).
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

# ── Website hosting ───────────────────────────────────────────────────────────
# error_document = index.html → S3 devuelve index.html ante cualquier ruta
# inexistente (e.g. /bot-ai), permitiendo que React maneje el routing client-side.

resource "aws_s3_bucket_website_configuration" "homepage" {
  bucket = aws_s3_bucket.homepage.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# ── Acceso público ────────────────────────────────────────────────────────────
# block_public_acls/ignore_public_acls = true → prohíbe ACLs de objeto (más seguro).
# block_public_policy = false → permite la bucket policy pública de solo lectura.

resource "aws_s3_bucket_public_access_block" "homepage" {
  bucket = aws_s3_bucket.homepage.id

  block_public_acls       = true
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = false
}

# Solo GetObject es público. El bucket en sí y sus metadatos no son listables.
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
