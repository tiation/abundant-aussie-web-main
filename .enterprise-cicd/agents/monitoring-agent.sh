#!/bin/bash
# Monitoring Agent (grafana.sxc.codes)
# Handles CI/CD pipeline monitoring and alerting

AGENT_NAME="monitoring"
SERVER_IP="153.92.214.1"
LOG_FILE="/var/log/monitoring-agent.log"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$AGENT_NAME] $1" | tee -a $LOG_FILE
}

# Check pipeline health
check_pipeline_health() {
    log_message "Checking CI/CD pipeline health..."
    
    # Check GitHub Actions status
    curl -s https://www.githubstatus.com/api/v2/summary.json | jq '.status.description'
    
    # Check GitLab instance
    curl -s https://gitlab.sxc.codes/-/health | jq '.status'
    
    # Check Docker registries
    docker pull hello-world >/dev/null 2>&1 && echo "Docker registry accessible" || echo "Docker registry issues"
    
    log_message "Pipeline health check completed"
}

# Generate reports
generate_reports() {
    log_message "Generating CI/CD reports..."
    
    # Create report directory
    REPORT_DIR="/opt/reports/$(date +%Y-%m-%d)"
    mkdir -p $REPORT_DIR
    
    # Pipeline success rates
    echo "Generating pipeline metrics..." > $REPORT_DIR/pipeline-report.txt
    
    log_message "Reports generated in $REPORT_DIR"
}

# Send alerts
send_alert() {
    local severity=$1
    local message=$2
    
    log_message "ALERT [$severity]: $message"
    
    # Send to multiple channels
    echo "Alert: $message" | mail -s "CI/CD Alert [$severity]" tiatheone@protonmail.com
    echo "Alert: $message" | mail -s "CI/CD Alert [$severity]" garrett@sxc.codes
    echo "Alert: $message" | mail -s "CI/CD Alert [$severity]" garrett.dillman@gmail.com
}

# Main execution
case "$1" in
    health)
        check_pipeline_health
        ;;
    report)
        generate_reports
        ;;
    alert)
        send_alert "$2" "$3"
        ;;
    *)
        echo "Usage: $0 {health|report|alert}"
        echo "  health                     - Check pipeline health"
        echo "  report                     - Generate CI/CD reports"
        echo "  alert <severity> <message> - Send alert"
        exit 1
        ;;
esac
