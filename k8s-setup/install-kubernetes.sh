#!/bin/bash
# Kubernetes Installation Script for Hostinger VPS Infrastructure
# This script installs Kubernetes components on Ubuntu 24.04 LTS

set -e

echo "=== Kubernetes Installation Script ==="
echo "Installing on: $(hostname)"
echo "Date: $(date)"

# Update system
echo "Step 1: Updating system packages..."
apt-get update && apt-get upgrade -y

# Install required packages
echo "Step 2: Installing required packages..."
apt-get install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Step 3: Installing Docker..."
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io
    systemctl enable docker
    systemctl start docker
else
    echo "Step 3: Docker already installed, skipping..."
fi

# Configure Docker daemon for Kubernetes
echo "Step 4: Configuring Docker for Kubernetes..."
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF

systemctl restart docker

# Add Kubernetes repository
echo "Step 5: Adding Kubernetes repository..."
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /' > /etc/apt/sources.list.d/kubernetes.list

# Install Kubernetes components
echo "Step 6: Installing Kubernetes components..."
apt-get update
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl

# Enable kubelet
systemctl enable kubelet

# Disable swap
echo "Step 7: Disabling swap..."
swapoff -a
sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# Configure kernel modules
echo "Step 8: Configuring kernel modules..."
cat <<EOF | tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter

# Configure sysctl
cat <<EOF | tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

sysctl --system

# Install Helm
echo "Step 9: Installing Helm..."
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | tee /etc/apt/sources.list.d/helm-stable-debian.list
apt-get update
apt-get install -y helm

echo "=== Kubernetes Installation Complete ==="
echo "Next steps:"
echo "1. Initialize cluster: kubeadm init --pod-network-cidr=10.244.0.0/16"
echo "2. Configure kubectl for root user"
echo "3. Install CNI plugin (Flannel/Calico)"
echo "4. Join worker nodes to cluster"
