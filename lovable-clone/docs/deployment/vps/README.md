# VPS Deployment Guide

This guide provides detailed instructions for deploying the Lovable Clone application on the ubuntu.sxc.codes and docker.tiation.net VPS servers.

## Deployment Overview
- **ubuntu.sxc.codes**: General-purpose node for scripting, agents, backups
- **docker.tiation.net**: Secondary runner or staging container host

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deployment on ubuntu.sxc.codes](#deployment-on-ubuntusxccodes)
3. [Deployment on docker.tiation.net](#deployment-on-dockertiataionnet)
4. [Systemd Service Setup](#systemd-service-setup)
5. [Container Builds](#container-builds)
6. [Future Expansions](#future-expansions)

## Prerequisites
- SSH access to the servers
- Docker and Docker Compose installed
- Nginx for reverse proxy setup

## Deployment on ubuntu.sxc.codes
1. **SSH into the server**
   ```bash
   ssh -i /Users/tiaastor/.ssh/hostinger_key.pub root@89.116.191.60
   ```
2. **Clone the repository**
   ```bash
   git clone git@github.com:tiation-repos/lovable-clone.git /var/www/lovable-clone
   ```
3. **Navigate to the directory and build Docker image**
   ```bash
   cd /var/www/lovable-clone
   docker build -t lovable-clone .
   ```
4. **Run the container**
   ```bash
   docker-compose up -d
   ```

## Deployment on docker.tiation.net
1. **SSH into the server**
   ```bash
   ssh -i /Users/tiaastor/.ssh/hostinger_key.pub root@145.223.22.9
   ```
2. **Follow the same steps as for ubuntu.sxc.codes**

## Systemd Service Setup
- Create a systemd service file to manage your application as a service.
- Enable the service to start on boot.

## Container Builds
- Use Docker Hub or a private container registry to store images.
- Automate the builds with CI/CD tools.

## Future Expansions
- Monitor using Grafana and Prometheus.
- Implement Blue-Green deployments for seamless updates.
- Maintain backups and snapshots.
