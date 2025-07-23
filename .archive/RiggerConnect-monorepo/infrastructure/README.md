# Infrastructure

This directory contains Infrastructure as Code (IaC) configurations for RiggerConnect.

## Structure

- `docker/` - Docker configurations and compose files
- `kubernetes/` - Kubernetes manifests and Helm charts
- `terraform/` - Terraform infrastructure definitions

## Hostinger VPS Integration

Configured for deployment on ChaseWhiteRabbit NGO's Hostinger VPS cluster:

- **Primary CI/CD**: docker.sxc.codes (145.223.22.7)
- **GitLab**: gitlab.sxc.codes (145.223.22.10)
- **Monitoring**: grafana.sxc.codes (153.92.214.1)
- **Database**: supabase.sxc.codes (93.127.167.157)
- **Logging**: elastic.sxc.codes (145.223.22.14)
