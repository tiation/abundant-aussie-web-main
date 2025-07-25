# Database Setup Guide

> **Enterprise-grade database configuration with error handling and monitoring** 💾

This guide covers setting up PostgreSQL, MongoDB, and Redis across your development, staging, and production environments with proper error handling, backup strategies, and monitoring.

## 📋 Database Overview

### Database Strategy
- **PostgreSQL** - Primary relational database for application data
- **MongoDB** - Document database for flexible schema requirements  
- **Redis** - In-memory cache and session store

### Environment Distribution
- **Local Development** - All databases in Docker containers
- **Staging** - Containerized databases on docker.tiation.net
- **Production** - Containerized databases on docker.sxc.codes
- **Backup Service** - supabase.sxc.codes for additional persistence

## 🚀 PostgreSQL Setup

### 1. Production PostgreSQL Installation

```bash
# SSH into production server
ssh -i ~/.ssh/hostinger_key.pub root@145.223.22.7

# Create PostgreSQL configuration
mkdir -p /srv/databases/postgres/{data,backups,scripts,configs}
cd /srv/databases/postgres

# Create Docker Compose for PostgreSQL
cat > docker-compose.postgres.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: postgres-production
    restart: unless-stopped
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
      POSTGRES_INITDB_ARGS: "--auth-host=scram-sha-256 --auth-local=peer"
      PGDATA: /var/lib/postgresql/data/pgdata
    secrets:
      - postgres_password
    ports:
      - "127.0.0.1:5432:5432"  # Only local access
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts:/docker-entrypoint-initdb.d
      - ./configs/postgresql.conf:/etc/postgresql/postgresql.conf
      - ./backups:/backups
    networks:
      - database_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d postgres"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  # PostgreSQL backup service
  postgres-backup:
    image: postgres:16-alpine
    container_name: postgres-backup
    restart: unless-stopped
    environment:
      PGPASSWORD_FILE: /run/secrets/postgres_password
    secrets:
      - postgres_password
    volumes:
      - ./backups:/backups
      - ./scripts/backup.sh:/backup.sh
    networks:
      - database_network
    depends_on:
      postgres:
        condition: service_healthy
    command: |
      sh -c "
        while true; do
          sleep 3600  # Wait 1 hour
          /backup.sh
        done
      "

volumes:
  postgres_data:
    driver: local

networks:
  database_network:
    driver: bridge

secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt
EOF

# Create secure password
mkdir -p secrets
openssl rand -base64 32 > secrets/postgres_password.txt
chmod 600 secrets/postgres_password.txt
```

### 2. PostgreSQL Configuration

```bash
# Create optimized PostgreSQL configuration
cat > configs/postgresql.conf << 'EOF'
# PostgreSQL Production Configuration

# Connection Settings
listen_addresses = '*'
port = 5432
max_connections = 200
superuser_reserved_connections = 3

# Memory Settings (adjust based on available RAM)
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200

# Logging
log_destination = 'stderr'
logging_collector = on
log_directory = '/var/log/postgresql'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on
log_temp_files = 0
log_autovacuum_min_duration = 0
log_error_verbosity = default

# Performance
checkpoint_timeout = 10min
max_wal_size = 1GB
min_wal_size = 80MB
archive_mode = on
archive_command = 'cp %p /backups/wal/%f'

# Security
ssl = on
ssl_cert_file = '/etc/ssl/certs/server.crt'
ssl_key_file = '/etc/ssl/private/server.key'
EOF
```

### 3. Database Initialization Scripts

```bash
# Create database initialization script
cat > scripts/01-create-databases.sql << 'EOF'
-- Create application databases with proper encoding
CREATE DATABASE riggerdb WITH ENCODING 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';
CREATE DATABASE afldb WITH ENCODING 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';
CREATE DATABASE analyticsdb WITH ENCODING 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';

-- Create application users
CREATE USER rigger_user WITH PASSWORD 'RIGGER_SECURE_PASSWORD_HERE';
CREATE USER afl_user WITH PASSWORD 'AFL_SECURE_PASSWORD_HERE';
CREATE USER analytics_user WITH PASSWORD 'ANALYTICS_SECURE_PASSWORD_HERE';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE riggerdb TO rigger_user;
GRANT ALL PRIVILEGES ON DATABASE afldb TO afl_user;
GRANT ALL PRIVILEGES ON DATABASE analyticsdb TO analytics_user;

-- Create read-only user for monitoring
CREATE USER monitor_user WITH PASSWORD 'MONITOR_PASSWORD_HERE';
GRANT CONNECT ON DATABASE riggerdb TO monitor_user;
GRANT CONNECT ON DATABASE afldb TO monitor_user;
GRANT CONNECT ON DATABASE analyticsdb TO monitor_user;
GRANT USAGE ON SCHEMA public TO monitor_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO monitor_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO monitor_user;
EOF

# Create backup script with error handling
cat > scripts/backup.sh << 'EOF'
#!/bin/bash
set -euo pipefail

# Configuration
BACKUP_DIR="/backups"
POSTGRES_HOST="postgres"
POSTGRES_USER="postgres"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Email alert function
send_alert() {
    local message="$1"
    local subject="PostgreSQL Backup Alert"
    echo "$message" | mail -s "$subject" \
        tiatheone@protonmail.com \
        garrett@sxc.codes \
        garrett.dillman@gmail.com
}

# Backup function with error handling
backup_database() {
    local db_name="$1"
    local backup_file="${BACKUP_DIR}/${db_name}_${DATE}.sql.gz"
    
    echo "Starting backup of database: $db_name"
    
    if pg_dump -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$db_name" | gzip > "$backup_file"; then
        echo "✅ Backup successful: $backup_file"
        
        # Verify backup integrity
        if gunzip -t "$backup_file" 2>/dev/null; then
            echo "✅ Backup integrity verified: $backup_file"
        else
            echo "❌ Backup integrity check failed: $backup_file"
            send_alert "Backup integrity check failed for database $db_name"
            exit 1
        fi
    else
        echo "❌ Backup failed for database: $db_name"
        send_alert "Backup failed for database $db_name"
        exit 1
    fi
}

# Main backup process
main() {
    echo "🚀 Starting PostgreSQL backup process..."
    
    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"
    
    # Create WAL backup directory
    mkdir -p "$BACKUP_DIR/wal"
    
    # Backup individual databases
    backup_database "riggerdb"
    backup_database "afldb"
    backup_database "analyticsdb"
    
    # Create full cluster backup
    echo "Creating full cluster backup..."
    if pg_dumpall -h "$POSTGRES_HOST" -U "$POSTGRES_USER" | gzip > "${BACKUP_DIR}/full_cluster_${DATE}.sql.gz"; then
        echo "✅ Full cluster backup successful"
    else
        echo "❌ Full cluster backup failed"
        send_alert "Full cluster backup failed"
        exit 1
    fi
    
    # Cleanup old backups
    echo "Cleaning up old backups..."
    find "$BACKUP_DIR" -name "*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR/wal" -type f -mtime +$RETENTION_DAYS -delete
    
    echo "✅ Backup process completed successfully"
}

# Execute main function
main "$@"
EOF

chmod +x scripts/backup.sh
```

## 🍃 MongoDB Setup

### 1. MongoDB Production Installation

```bash
# MongoDB configuration
mkdir -p /srv/databases/mongodb/{data,backups,scripts,configs}
cd /srv/databases/mongodb

cat > docker-compose.mongodb.yml << 'EOF'
version: '3.8'

services:
  mongodb:
    image: mongo:7-jammy
    container_name: mongodb-production
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD_FILE: /run/secrets/mongo_password
      MONGO_INITDB_DATABASE: admin
    secrets:
      - mongo_password
    ports:
      - "127.0.0.1:27017:27017"
    volumes:
      - mongodb_data:/data/db
      - mongodb_config:/data/configdb
      - ./scripts:/docker-entrypoint-initdb.d
      - ./configs/mongod.conf:/etc/mongod.conf
      - ./backups:/backups
    networks:
      - database_network
    command: ["mongod", "--config", "/etc/mongod.conf"]
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  # MongoDB backup service
  mongodb-backup:
    image: mongo:7-jammy
    container_name: mongodb-backup
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_PASSWORD_FILE: /run/secrets/mongo_password
    secrets:
      - mongo_password
    volumes:
      - ./backups:/backups
      - ./scripts/backup-mongo.sh:/backup-mongo.sh
    networks:
      - database_network
    depends_on:
      mongodb:
        condition: service_healthy
    command: |
      sh -c "
        while true; do
          sleep 3600  # Wait 1 hour
          /backup-mongo.sh
        done
      "

volumes:
  mongodb_data:
    driver: local
  mongodb_config:
    driver: local

networks:
  database_network:
    driver: bridge

secrets:
  mongo_password:
    file: ./secrets/mongo_password.txt
EOF

# Create secure password
mkdir -p secrets
openssl rand -base64 32 > secrets/mongo_password.txt
chmod 600 secrets/mongo_password.txt
```

### 2. MongoDB Configuration

```bash
# Create MongoDB configuration
cat > configs/mongod.conf << 'EOF'
# MongoDB Production Configuration
storage:
  dbPath: /data/db
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
      cacheSizeGB: 0.5
      journalCompressor: snappy
      directoryForIndexes: false
    collectionConfig:
      blockCompressor: snappy
    indexConfig:
      prefixCompression: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
  logRotate: rename
  verbosity: 1
  component:
    accessControl:
      verbosity: 1
    command:
      verbosity: 1

net:
  port: 27017
  bindIp: 0.0.0.0
  maxIncomingConnections: 65536
  wireObjectCheck: true
  ipv6: false

processManagement:
  timeZoneInfo: /usr/share/zoneinfo
  fork: false

security:
  authorization: enabled
  javascriptEnabled: false

operationProfiling:
  slowOpThresholdMs: 100
  mode: slowOp

replication:
  replSetName: "rs0"

sharding:
  clusterRole: shardsvr
EOF
```

### 3. MongoDB Initialization and Backup Scripts

```bash
# Create MongoDB initialization script
cat > scripts/01-create-users.js << 'EOF'
// MongoDB User Creation Script
db = db.getSiblingDB('admin');

// Create application databases and users
db = db.getSiblingDB('riggerdb');
db.createUser({
  user: 'rigger_user',
  pwd: 'RIGGER_MONGO_PASSWORD_HERE',
  roles: [
    { role: 'readWrite', db: 'riggerdb' },
    { role: 'dbAdmin', db: 'riggerdb' }
  ]
});

db = db.getSiblingDB('afldb');
db.createUser({
  user: 'afl_user',
  pwd: 'AFL_MONGO_PASSWORD_HERE',
  roles: [
    { role: 'readWrite', db: 'afldb' },
    { role: 'dbAdmin', db: 'afldb' }
  ]
});

db = db.getSiblingDB('analyticsdb');
db.createUser({
  user: 'analytics_user',
  pwd: 'ANALYTICS_MONGO_PASSWORD_HERE',
  roles: [
    { role: 'readWrite', db: 'analyticsdb' },
    { role: 'dbAdmin', db: 'analyticsdb' }
  ]
});

// Create monitoring user
db = db.getSiblingDB('admin');
db.createUser({
  user: 'monitor_user',
  pwd: 'MONITOR_MONGO_PASSWORD_HERE',
  roles: [
    { role: 'clusterMonitor', db: 'admin' },
    { role: 'read', db: 'riggerdb' },
    { role: 'read', db: 'afldb' },
    { role: 'read', db: 'analyticsdb' }
  ]
});

print('MongoDB users created successfully');
EOF

# Create MongoDB backup script
cat > scripts/backup-mongo.sh << 'EOF'
#!/bin/bash
set -euo pipefail

# Configuration
BACKUP_DIR="/backups"
MONGO_HOST="mongodb"
MONGO_PORT="27017"
MONGO_USER="admin"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Read MongoDB password
MONGO_PASSWORD=$(cat /run/secrets/mongo_password)

# Email alert function
send_alert() {
    local message="$1"
    local subject="MongoDB Backup Alert"
    echo "$message" | mail -s "$subject" \
        tiatheone@protonmail.com \
        garrett@sxc.codes \
        garrett.dillman@gmail.com
}

# Backup function with error handling
backup_database() {
    local db_name="$1"
    local backup_file="${BACKUP_DIR}/${db_name}_${DATE}"
    
    echo "Starting backup of database: $db_name"
    
    if mongodump --host "${MONGO_HOST}:${MONGO_PORT}" \
                 --username "$MONGO_USER" \
                 --password "$MONGO_PASSWORD" \
                 --authenticationDatabase admin \
                 --db "$db_name" \
                 --out "$backup_file"; then
        
        # Compress backup
        tar -czf "${backup_file}.tar.gz" -C "$BACKUP_DIR" "$(basename "$backup_file")"
        rm -rf "$backup_file"
        
        echo "✅ Backup successful: ${backup_file}.tar.gz"
    else
        echo "❌ Backup failed for database: $db_name"
        send_alert "MongoDB backup failed for database $db_name"
        exit 1
    fi
}

# Main backup process
main() {
    echo "🚀 Starting MongoDB backup process..."
    
    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"
    
    # Backup individual databases
    backup_database "riggerdb"
    backup_database "afldb"
    backup_database "analyticsdb"
    
    # Create full backup
    echo "Creating full MongoDB backup..."
    if mongodump --host "${MONGO_HOST}:${MONGO_PORT}" \
                 --username "$MONGO_USER" \
                 --password "$MONGO_PASSWORD" \
                 --authenticationDatabase admin \
                 --out "${BACKUP_DIR}/full_${DATE}"; then
        
        tar -czf "${BACKUP_DIR}/full_${DATE}.tar.gz" -C "$BACKUP_DIR" "full_${DATE}"
        rm -rf "${BACKUP_DIR}/full_${DATE}"
        
        echo "✅ Full MongoDB backup successful"
    else
        echo "❌ Full MongoDB backup failed"
        send_alert "Full MongoDB backup failed"
        exit 1
    fi
    
    # Cleanup old backups
    echo "Cleaning up old backups..."
    find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
    
    echo "✅ MongoDB backup process completed successfully"
}

# Execute main function
main "$@"
EOF

chmod +x scripts/backup-mongo.sh
```

## 🔴 Redis Setup

### 1. Redis Production Installation

```bash
# Redis configuration
mkdir -p /srv/databases/redis/{data,backups,scripts,configs}
cd /srv/databases/redis

cat > docker-compose.redis.yml << 'EOF'
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: redis-production
    restart: unless-stopped
    ports:
      - "127.0.0.1:6379:6379"
    volumes:
      - redis_data:/data
      - ./configs/redis.conf:/etc/redis/redis.conf
      - ./backups:/backups
    networks:
      - database_network
    command: ["redis-server", "/etc/redis/redis.conf"]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  # Redis backup service
  redis-backup:
    image: redis:7-alpine
    container_name: redis-backup
    restart: unless-stopped
    volumes:
      - redis_data:/data
      - ./backups:/backups
      - ./scripts/backup-redis.sh:/backup-redis.sh
    networks:
      - database_network
    depends_on:
      redis:
        condition: service_healthy
    command: |
      sh -c "
        while true; do
          sleep 3600  # Wait 1 hour
          /backup-redis.sh
        done
      "

volumes:
  redis_data:
    driver: local

networks:
  database_network:
    driver: bridge
EOF
```

### 2. Redis Configuration

```bash
# Create Redis configuration
cat > configs/redis.conf << 'EOF'
# Redis Production Configuration

# Network
bind 0.0.0.0
protected-mode yes
port 6379
timeout 300
keepalive 300

# General
daemonize no
pidfile /var/run/redis.pid
loglevel notice
logfile ""
databases 16

# Snapshotting
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir /data

# Security
requirepass REDIS_SECURE_PASSWORD_HERE
rename-command CONFIG ""
rename-command SHUTDOWN REDIS_SHUTDOWN
rename-command DEBUG ""
rename-command EVAL ""

# Memory management
maxmemory 512mb
maxmemory-policy allkeys-lru
maxmemory-samples 5

# Append only file
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes

# Slow log
slowlog-log-slower-than 10000
slowlog-max-len 128

# Client output buffer limits
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
EOF
```

### 3. Redis Backup Script

```bash
# Create Redis backup script
cat > scripts/backup-redis.sh << 'EOF'
#!/bin/bash
set -euo pipefail

# Configuration
BACKUP_DIR="/backups"
REDIS_HOST="redis"
REDIS_PORT="6379"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Email alert function
send_alert() {
    local message="$1"
    local subject="Redis Backup Alert"
    echo "$message" | mail -s "$subject" \
        tiatheone@protonmail.com \
        garrett@sxc.codes \
        garrett.dillman@gmail.com
}

# Main backup process
main() {
    echo "🚀 Starting Redis backup process..."
    
    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"
    
    # Trigger Redis background save
    echo "Triggering Redis BGSAVE..."
    if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" BGSAVE; then
        echo "✅ Redis BGSAVE triggered successfully"
        
        # Wait for backup to complete
        while [ "$(redis-cli -h $REDIS_HOST -p $REDIS_PORT LASTSAVE)" = "$(redis-cli -h $REDIS_HOST -p $REDIS_PORT LASTSAVE)" ]; do
            sleep 1
        done
        
        # Copy RDB file
        if cp /data/dump.rdb "${BACKUP_DIR}/redis_${DATE}.rdb"; then
            echo "✅ Redis RDB backup successful"
            
            # Compress backup
            gzip "${BACKUP_DIR}/redis_${DATE}.rdb"
            echo "✅ Redis backup compressed"
        else
            echo "❌ Failed to copy Redis RDB file"
            send_alert "Failed to copy Redis RDB file"
            exit 1
        fi
        
        # Backup AOF file if it exists
        if [ -f /data/appendonly.aof ]; then
            if cp /data/appendonly.aof "${BACKUP_DIR}/redis_aof_${DATE}.aof"; then
                gzip "${BACKUP_DIR}/redis_aof_${DATE}.aof"
                echo "✅ Redis AOF backup successful"
            else
                echo "⚠️ Failed to backup Redis AOF file"
            fi
        fi
        
    else
        echo "❌ Redis BGSAVE failed"
        send_alert "Redis BGSAVE failed"
        exit 1
    fi
    
    # Cleanup old backups
    echo "Cleaning up old backups..."
    find "$BACKUP_DIR" -name "redis_*.gz" -type f -mtime +$RETENTION_DAYS -delete
    
    echo "✅ Redis backup process completed successfully"
}

# Execute main function
main "$@"
EOF

chmod +x scripts/backup-redis.sh
```

## 🚀 Database Deployment Commands

### Start All Database Services

```bash
# Copy-paste deployment script
cat > /srv/databases/deploy-all.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starting all database services..."

# Start PostgreSQL
cd /srv/databases/postgres
docker compose -f docker-compose.postgres.yml up -d
echo "✅ PostgreSQL started"

# Start MongoDB
cd /srv/databases/mongodb
docker compose -f docker-compose.mongodb.yml up -d
echo "✅ MongoDB started"

# Start Redis
cd /srv/databases/redis
docker compose -f docker-compose.redis.yml up -d
echo "✅ Redis started"

# Wait for all services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service status
echo "📊 Service Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "✅ All database services are running!"
echo ""
echo "🔗 Connection Information:"
echo "  PostgreSQL: localhost:5432"
echo "  MongoDB: localhost:27017"
echo "  Redis: localhost:6379"
EOF

chmod +x /srv/databases/deploy-all.sh

# Run deployment
/srv/databases/deploy-all.sh
```

## 🔧 Database Monitoring & Health Checks

### Health Check Script

```bash
cat > /srv/databases/health-check.sh << 'EOF'
#!/bin/bash
set -e

echo "🏥 Database Health Check Report"
echo "================================"

# PostgreSQL Health Check
echo "📊 PostgreSQL:"
if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "  ✅ PostgreSQL is running"
    echo "  📈 Active connections: $(psql -h localhost -U postgres -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null || echo "Unable to connect")"
else
    echo "  ❌ PostgreSQL is not responding"
fi

# MongoDB Health Check
echo "📊 MongoDB:"
if mongosh --host localhost:27017 --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
    echo "  ✅ MongoDB is running"
    echo "  📈 Active connections: $(mongosh --host localhost:27017 --quiet --eval "db.serverStatus().connections.current" 2>/dev/null || echo "Unable to connect")"
else
    echo "  ❌ MongoDB is not responding"
fi

# Redis Health Check
echo "📊 Redis:"
if redis-cli -h localhost -p 6379 ping >/dev/null 2>&1; then
    echo "  ✅ Redis is running"
    echo "  📈 Connected clients: $(redis-cli -h localhost -p 6379 info clients | grep connected_clients | cut -d: -f2 | tr -d '\r' 2>/dev/null || echo "Unable to connect")"
    echo "  💾 Memory usage: $(redis-cli -h localhost -p 6379 info memory | grep used_memory_human | cut -d: -f2 | tr -d '\r' 2>/dev/null || echo "Unable to connect")"
else
    echo "  ❌ Redis is not responding"
fi

echo ""
echo "🐳 Docker Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter name=postgres --filter name=mongodb --filter name=redis
EOF

chmod +x /srv/databases/health-check.sh

# Add to cron for regular health checks
(crontab -l 2>/dev/null; echo "*/15 * * * * /srv/databases/health-check.sh >> /var/log/database-health.log 2>&1") | crontab -
```

## 🎯 Verification Checklist

After database setup, verify:

- [ ] PostgreSQL container running and healthy
- [ ] MongoDB container running and healthy  
- [ ] Redis container running and healthy
- [ ] Database users created with proper permissions
- [ ] Backup scripts functional and scheduled
- [ ] Health monitoring active
- [ ] Log rotation configured
- [ ] Email alerts configured
- [ ] Connection strings documented
- [ ] Security configurations applied

## 🔗 Connection Strings

### Production Environment

```bash
# PostgreSQL connections
RIGGER_DB_URL="postgresql://rigger_user:RIGGER_SECURE_PASSWORD@localhost:5432/riggerdb"
AFL_DB_URL="postgresql://afl_user:AFL_SECURE_PASSWORD@localhost:5432/afldb"

# MongoDB connections  
RIGGER_MONGO_URL="mongodb://rigger_user:RIGGER_MONGO_PASSWORD@localhost:27017/riggerdb"
AFL_MONGO_URL="mongodb://afl_user:AFL_MONGO_PASSWORD@localhost:27017/afldb"

# Redis connection
REDIS_URL="redis://:REDIS_SECURE_PASSWORD@localhost:6379"
```

---

> **Databases configured and secured?** Continue with [SSL Certificate Setup](ssl-certificates.md)!
