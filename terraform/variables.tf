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
