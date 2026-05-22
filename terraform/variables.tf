variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type (t3.nano ~$0.002/hr spot, t3.micro ~$0.004/hr si el build de Docker falla por OOM)"
  type        = string
  default     = "t3.nano"
}

variable "public_key" {
  description = "Public SSH key"
  type        = string
}
