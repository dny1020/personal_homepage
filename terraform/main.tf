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

# Par de claves SSH
resource "aws_key_pair" "deployer" {
  key_name   = "deployer-key"
  public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIATZ3hKAciqQqpn2uL3Den2Ql5mre4QmSmZTrvKiils jnarvaar@icloud.com"
}

# Solicitud de Instancia EC2 Spot
resource "aws_spot_instance_request" "spot_instance" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  spot_type     = "one-time"
  key_name      = aws_key_pair.deployer.key_name

  vpc_security_group_ids = [aws_security_group.web_sg.id]

  tags = {
    Name = "MiInstanciaSpot"
  }
}

resource "aws_security_group" "web_sg" {
  name        = "web_access"
  description = "Allow HTTP and SSH"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "instance_public_ip" {
  value = aws_spot_instance_request.spot_instance.public_ip
}

