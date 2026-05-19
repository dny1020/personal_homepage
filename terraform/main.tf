terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Obtiene la última AMI de Amazon Linux 2023 automáticamente
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

# Solicitud de Instancia EC2 Spot
resource "aws_spot_instance_request" "spot_instance" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"  # La menor capacidad recomendada
  spot_type     = "one-time"  # Se cerrará la solicitud si la apagas o es interrumpida

  tags = {
    Name = "MiInstanciaSpot"
  }
}

