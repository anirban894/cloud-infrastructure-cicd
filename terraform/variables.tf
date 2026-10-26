variable "project_name" {
  description = "Name of the DevOps project"
  type        = string
  default     = "cloud-infrastructure-cicd"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "dev"
}

variable "owner" {
  description = "Owner of the project"
  type        = string
  default     = "anirban894"
}
