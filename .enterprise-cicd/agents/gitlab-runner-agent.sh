#!/bin/bash
# GitLab Runner Agent (gitlab.sxc.codes)
# Manages GitLab CI/CD runners and orchestration

AGENT_NAME="gitlab-runner"
SERVER_IP="145.223.22.10"
LOG_FILE="/var/log/gitlab-runner-agent.log"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$AGENT_NAME] $1" | tee -a $LOG_FILE
}

# Register new runner
register_runner() {
    local registration_token=$1
    local description=${2:-"Enterprise Runner"}
    
    log_message "Registering new GitLab runner..."
    gitlab-runner register \
        --url https://gitlab.sxc.codes \
        --registration-token $registration_token \
        --description "$description" \
        --executor docker \
        --docker-image alpine:latest \
        --docker-privileged true \
        --docker-volumes /var/run/docker.sock:/var/run/docker.sock
    log_message "Runner registered successfully"
}

# Monitor runners
monitor_runners() {
    log_message "Monitoring GitLab runners..."
    gitlab-runner list
}

# Update runners
update_runners() {
    log_message "Updating GitLab runners..."
    gitlab-runner stop
    gitlab-runner start
    log_message "Runners updated"
}

# Main execution
case "$1" in
    register)
        register_runner "$2" "$3"
        ;;
    monitor)
        monitor_runners
        ;;
    update)
        update_runners
        ;;
    *)
        echo "Usage: $0 {register|monitor|update}"
        echo "  register <token> [description] - Register new runner"
        echo "  monitor                        - Monitor runner status"
        echo "  update                         - Update and restart runners"
        exit 1
        ;;
esac
