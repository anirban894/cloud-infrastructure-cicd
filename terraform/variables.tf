variable "project_name" {
  description = "Name of the DevOps project"
  type        = string
  default     = "cloud-infrastructure-cicd"

  validation {
    condition     = length(var.project_name) >= 5
    error_message = "Project name must be at least 5 characters long."
  }
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "test", "prod"], var.environment)
    error_message = "Environment must be dev, test, or prod."
  }
}

variable "owner" {
  description = "Owner of the project"
  type        = string
  default     = "anirban894"
}

variable "aws_region" {
  description = "AWS region for infrastructure deployment"
  type        = string
  default     = "ap-south-1"

  validation {
    condition     = length(trimspace(var.aws_region)) > 0
    error_message = "AWS region must not be empty."
  }
}
