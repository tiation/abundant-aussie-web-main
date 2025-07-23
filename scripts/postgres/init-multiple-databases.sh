#!/bin/bash
# PostgreSQL Multiple Database Initialization Script
# Creates separate databases for each Rigger service
# ChaseWhiteRabbit NGO

set -e
set -u

function create_user_and_database() {
    local database=$1
    local user=$2
    echo "Creating user '$user' and database '$database'"
    
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        -- Create user if not exists
        DO \$\$
        BEGIN
            IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$user') THEN
                CREATE ROLE $user LOGIN PASSWORD '${POSTGRES_PASSWORD}';
            END IF;
        END
        \$\$;
        
        -- Create database if not exists
        SELECT 'CREATE DATABASE $database OWNER $user'
        WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$database')\gexec
        
        -- Grant privileges
        GRANT ALL PRIVILEGES ON DATABASE $database TO $user;
        
        -- Connect to the new database and set up extensions
        \c $database
        
        -- Enable commonly used extensions
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        CREATE EXTENSION IF NOT EXISTS "pg_trgm";
        CREATE EXTENSION IF NOT EXISTS "btree_gin";
        
        -- Create application schema
        CREATE SCHEMA IF NOT EXISTS app AUTHORIZATION $user;
        CREATE SCHEMA IF NOT EXISTS audit AUTHORIZATION $user;
        
        -- Set default privileges
        ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON TABLES TO $user;
        ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON SEQUENCES TO $user;
        ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON FUNCTIONS TO $user;
        
        -- Create audit table template
        CREATE TABLE IF NOT EXISTS audit.activity_log (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            table_name VARCHAR(64) NOT NULL,
            operation VARCHAR(16) NOT NULL,
            old_data JSONB,
            new_data JSONB,
            user_id UUID,
            timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            ip_address INET,
            user_agent TEXT
        );
        
        -- Create indexes for performance
        CREATE INDEX IF NOT EXISTS idx_activity_log_table_name ON audit.activity_log(table_name);
        CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON audit.activity_log(timestamp);
        CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON audit.activity_log(user_id);
        
        GRANT ALL PRIVILEGES ON SCHEMA audit TO $user;
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA audit TO $user;
        
EOSQL
}

# Parse POSTGRES_MULTIPLE_DATABASES environment variable
if [[ -n "${POSTGRES_MULTIPLE_DATABASES:-}" ]]; then
    echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
    
    # Split databases by comma and process each
    IFS=',' read -ra DATABASES <<< "$POSTGRES_MULTIPLE_DATABASES"
    for database in "${DATABASES[@]}"; do
        # Create user with same name as database
        user="${database}_user"
        create_user_and_database "$database" "$user"
    done
    
    echo "Multiple databases created successfully!"
else
    echo "POSTGRES_MULTIPLE_DATABASES not specified, skipping multiple database creation"
fi

# Create read-only monitoring user
echo "Creating monitoring user..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create monitoring user
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'monitoring') THEN
            CREATE ROLE monitoring LOGIN PASSWORD '${POSTGRES_PASSWORD}' CONNECTION LIMIT 5;
        END IF;
    END
    \$\$;
    
    -- Grant connect privileges to all databases
    GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO monitoring;
EOSQL

# Set permissions for monitoring on each database
if [[ -n "${POSTGRES_MULTIPLE_DATABASES:-}" ]]; then
    IFS=',' read -ra DATABASES <<< "$POSTGRES_MULTIPLE_DATABASES"
    for database in "${DATABASES[@]}"; do
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$database" <<-EOSQL
            GRANT CONNECT ON DATABASE $database TO monitoring;
            GRANT USAGE ON SCHEMA public TO monitoring;
            GRANT SELECT ON ALL TABLES IN SCHEMA public TO monitoring;
            ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO monitoring;
            
            -- Grant access to app schema if it exists
            GRANT USAGE ON SCHEMA app TO monitoring;
            GRANT SELECT ON ALL TABLES IN SCHEMA app TO monitoring;
            ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT SELECT ON TABLES TO monitoring;
EOSQL
    done
fi

echo "Database initialization completed successfully!"
