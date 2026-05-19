variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Name of the SSH key pair"
  type        = string
  default     = "deployer-key"
}

variable "public_key" {
  description = "Public SSH key"
  type        = string
  default     = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIATZ3hKAciqQqpn2uL3Den2Ql5mre4QmSmZTrvKiils jnarvaar@icloud.com"
}
