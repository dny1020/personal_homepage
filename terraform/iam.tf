# IAM user exclusivo para deploy (CI/CD).
# Permisos mínimos: solo puede gestionar objetos en este bucket específico.
# No tiene acceso a la consola, ni a ningún otro servicio AWS.

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
