# SSL Certificate Guide

> **Enterprise-grade SSL/TLS setup with Let's Encrypt automation and monitoring** 🔐

This guide covers complete SSL certificate management for your Hostinger VPS infrastructure using Let's Encrypt with automated renewal, monitoring, and alerts.

## 📋 What This Guide Covers

- **Let's Encrypt Installation** - Certbot setup and configuration
- **SSL Certificate Generation** - Domain validation and certificate issuance
- **Nginx Integration** - Automatic SSL configuration
- **Auto-Renewal Setup** - Automated certificate renewal
- **Monitoring & Alerts** - Certificate expiry tracking
- **Security Hardening** - SSL/TLS best practices

## 🏗️ Infrastructure Overview

### Your SSL-Enabled VPS Servers

| Server | Domain | IP | SSL Status |
|--------|--------|----|-----------|
| docker.sxc.codes | docker.sxc.codes | 145.223.22.7 | Production SSL |
| docker.tiation.net | staging.your-domain.com | 145.223.22.9 | Staging SSL |
| grafana.sxc.codes | grafana.sxc.codes | 153.92.214.1 | Monitoring SSL |
| gitlab.sxc.codes | gitlab.sxc.codes | 145.223.22.10 | CI/CD SSL |

## 🔧 Prerequisites

Before starting:

1. **DNS Configuration**
   - Ensure all domains point to correct VPS IPs
   - Verify DNS propagation is complete
   
2. **Firewall Configuration**
   ```bash
   # Ensure ports 80 and 443 are open
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw status
   ```
   
3. **Nginx Installation**
   ```bash
   # Install Nginx if not already installed
   apt update
   apt install nginx -y
   systemctl enable nginx
   systemctl start nginx
   ```

## 🚀 Setup Steps

### 1. Certbot Installation

```bash
# Update system and install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Verify installation
certbot --version
```

### 2. Obtain SSL Certificate

```bash
# Run Certbot with Nginx plugin (replace example.com with your domain)
sudo certbot --nginx -d example.com -d www.example.com

# Follow the interactive prompts to complete the authentication process
# Confirm successful certificate issuance
```

### 3. Certbot Configuration

- Certbot should have updated your Nginx configuration automatically.
- Ensure the configuration now handles SSL connections.

### 4. Verify Auto-Renewal

```bash
# Test Certbot's renewal process
sudo certbot renew --dry-run

# This confirms that the auto-renewal process is working
```

### 5. Configure Renewal with Cron

```bash
# Open the crontab file
sudo crontab -e

# Add the following line (runs twice daily at random minute within the hour)
0 */12 * * * certbot renew --quiet

# Save and exit the editor
```

### 6. Set up Monitoring Alerts

```bash
# Create renewal hook to alert on failure
cat << EOF | sudo tee /etc/cron.daily/letsencrypt-renewal-alert
#!/bin/bash
set -e

# Run Certbot renewal
certbot renew

# Check for renewal errors and send alert if any
if [ $? -ne 0 ]; then
    echo "Certbot renewal failed on $(hostname)" | mail -s "SSL Renewal Failed" \
    tiatheone@protonmail.com \
    garrett@sxc.codes \
    garrett.dillman@gmail.com
fi
EOF

# Make script executable
sudo chmod +x /etc/cron.daily/letsencrypt-renewal-alert
```

## 🔧 Troubleshooting

- **Expired Certificates**: If renewal fails, troubleshoot with `certbot renew --dry-run`.
- **Nginx Errors**: Check the Nginx error log at `/var/log/nginx/error.log` for issues.

## 🎯 Verification Checklist

- [ ] SSL certificates issued and configured for all domains
- [ ] Automatic renewal scheduled and tested
- [ ] Alerting configured for renewal failures
- [ ] DNS entries verified and correct

---

> **SSL configured? Secure your endpoints and proceed with deployment!**
