variable "project_name" {
  description = "Name of the DevOps project"
  type        = string
  default     = "cloud-infrastructure-cicd"
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
