output "s3_website_endpoint" {
  description = "Endpoint del sitio — usar como 'Target' en el CNAME de Cloudflare"
  value       = aws_s3_bucket_website_configuration.homepage.website_endpoint
}

output "s3_bucket_name" {
  description = "Nombre del bucket para los comandos aws s3 sync"
  value       = aws_s3_bucket.homepage.id
}

output "s3_bucket_arn" {
  value = aws_s3_bucket.homepage.arn
}

output "deploy_access_key_id" {
  description = "AWS_ACCESS_KEY_ID para GitHub Actions / CI"
  value       = aws_iam_access_key.deploy.id
}

output "deploy_secret_access_key" {
  description = "AWS_SECRET_ACCESS_KEY — obtener con: terraform output -raw deploy_secret_access_key"
  value       = aws_iam_access_key.deploy.secret
  sensitive   = true
}
