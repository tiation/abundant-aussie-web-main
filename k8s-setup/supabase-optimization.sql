-- Supabase PostgreSQL Performance Optimization Script
-- Run this on supabase.sxc.codes to optimize database performance

-- ===========================================
-- DATABASE PERFORMANCE TUNING
-- ===========================================

-- Adjust PostgreSQL configuration for better performance
-- Add these to postgresql.conf or via ALTER SYSTEM

-- Memory settings (adjust based on 7.8GB RAM available)
ALTER SYSTEM SET shared_buffers = '2GB';
ALTER SYSTEM SET effective_cache_size = '6GB';
ALTER SYSTEM SET work_mem = '256MB';
ALTER SYSTEM SET maintenance_work_mem = '512MB';
ALTER SYSTEM SET wal_buffers = '64MB';

-- Connection settings
ALTER SYSTEM SET max_connections = '200';
ALTER SYSTEM SET superuser_reserved_connections = '10';

-- Checkpoint settings
ALTER SYSTEM SET checkpoint_completion_target = '0.9';
ALTER SYSTEM SET checkpoint_timeout = '15min';
ALTER SYSTEM SET max_wal_size = '4GB';
ALTER SYSTEM SET min_wal_size = '1GB';

-- Query planner settings
ALTER SYSTEM SET random_page_cost = '1.1';
ALTER SYSTEM SET effective_io_concurrency = '200';
ALTER SYSTEM SET default_statistics_target = '100';

-- Logging settings for performance monitoring
ALTER SYSTEM SET log_min_duration_statement = '1000';
ALTER SYSTEM SET log_checkpoints = 'on';
ALTER SYSTEM SET log_connections = 'on';
ALTER SYSTEM SET log_disconnections = 'on';
ALTER SYSTEM SET log_lock_waits = 'on';

-- Apply changes (requires restart)
SELECT pg_reload_conf();

-- ===========================================
-- CONNECTION POOLING OPTIMIZATION
-- ===========================================

-- Create database users for different environments
CREATE USER rigger_dev WITH PASSWORD 'dev_secure_password_2024';
CREATE USER rigger_staging WITH PASSWORD 'staging_secure_password_2024';  
CREATE USER rigger_prod WITH PASSWORD 'prod_secure_password_2024';

-- Create databases for different environments
CREATE DATABASE rigger_development OWNER rigger_dev;
CREATE DATABASE rigger_staging OWNER rigger_staging;
CREATE DATABASE rigger_production OWNER rigger_prod;

-- Grant appropriate permissions
GRANT CONNECT ON DATABASE rigger_development TO rigger_dev;
GRANT CONNECT ON DATABASE rigger_staging TO rigger_staging;
GRANT CONNECT ON DATABASE rigger_production TO rigger_prod;

-- ===========================================
-- PERFORMANCE MONITORING SETUP
-- ===========================================

-- Enable query statistics extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Create monitoring views
CREATE OR REPLACE VIEW performance_overview AS
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation,
    most_common_vals,
    most_common_freqs
FROM pg_stats 
WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
ORDER BY schemaname, tablename, attname;

-- Slow query monitoring view
CREATE OR REPLACE VIEW slow_queries AS
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements 
WHERE mean_time > 100
ORDER BY mean_time DESC;

-- ===========================================
-- INDEXING OPTIMIZATION
-- ===========================================

-- Function to create indexes based on common query patterns
CREATE OR REPLACE FUNCTION create_performance_indexes()
RETURNS void AS $$
BEGIN
    -- Add indexes for common Supabase auth patterns
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_auth_users_email 
    ON auth.users(email) WHERE email IS NOT NULL;
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_auth_users_created_at 
    ON auth.users(created_at);
    
    -- Add indexes for real-time subscriptions
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_realtime_subscription_user
    ON realtime.subscription(subscription_id, entity);
    
    -- Composite indexes for common query patterns
    -- Adjust these based on your actual application tables
    /*
    Example indexes - uncomment and modify for your tables:
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_status_created 
    ON public.users(status, created_at) WHERE status IS NOT NULL;
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_date 
    ON public.orders(user_id, created_at);
    */
    
    RAISE NOTICE 'Performance indexes created successfully';
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT create_performance_indexes();

-- ===========================================
-- BACKUP AND MAINTENANCE PROCEDURES
-- ===========================================

-- Create backup function
CREATE OR REPLACE FUNCTION perform_maintenance()
RETURNS void AS $$
BEGIN
    -- Vacuum and analyze all tables
    VACUUM ANALYZE;
    
    -- Update table statistics
    ANALYZE;
    
    -- Log maintenance completion
    INSERT INTO maintenance_log (performed_at, operation) 
    VALUES (NOW(), 'vacuum_analyze');
    
    RAISE NOTICE 'Database maintenance completed at %', NOW();
END;
$$ LANGUAGE plpgsql;

-- Create maintenance log table
CREATE TABLE IF NOT EXISTS maintenance_log (
    id SERIAL PRIMARY KEY,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    operation TEXT NOT NULL,
    details JSONB
);

-- ===========================================
-- ROW LEVEL SECURITY OPTIMIZATION
-- ===========================================

-- Optimize RLS policies for better performance
-- Example policy optimization (adjust for your tables)
/*
-- Instead of complex subqueries, use simpler conditions
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own data" ON public.user_data
    FOR ALL USING (auth.uid() = user_id);

-- Use indexes to support RLS policies
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_data_user_id 
ON public.user_data(user_id);
*/

-- ===========================================
-- ENVIRONMENT-SPECIFIC CONFIGURATIONS
-- ===========================================

-- Development environment settings
\c rigger_development;
ALTER DATABASE rigger_development SET log_statement = 'all';
ALTER DATABASE rigger_development SET log_min_duration_statement = 0;

-- Staging environment settings  
\c rigger_staging;
ALTER DATABASE rigger_staging SET log_statement = 'mod';
ALTER DATABASE rigger_staging SET log_min_duration_statement = 500;

-- Production environment settings
\c rigger_production;
ALTER DATABASE rigger_production SET log_statement = 'ddl';
ALTER DATABASE rigger_production SET log_min_duration_statement = 1000;
ALTER DATABASE rigger_production SET log_checkpoints = 'on';

-- ===========================================
-- MONITORING QUERIES
-- ===========================================

-- Query to check database performance
CREATE OR REPLACE VIEW db_performance_summary AS
SELECT 
    'Database Size' as metric,
    pg_size_pretty(pg_database_size(current_database())) as value
UNION ALL
SELECT 
    'Active Connections',
    count(*)::text
FROM pg_stat_activity 
WHERE state = 'active'
UNION ALL
SELECT 
    'Idle Connections',
    count(*)::text  
FROM pg_stat_activity 
WHERE state = 'idle'
UNION ALL
SELECT 
    'Cache Hit Ratio',
    round(
        100.0 * sum(blks_hit) / (sum(blks_hit) + sum(blks_read)), 2
    )::text || '%'
FROM pg_stat_database;

-- Function to get table sizes
CREATE OR REPLACE FUNCTION get_table_sizes()
RETURNS TABLE(
    schema_name text,
    table_name text,
    size text,
    pretty_size text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname::text,
        tablename::text,
        pg_total_relation_size(schemaname||'.'||tablename)::text,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
    FROM pg_tables 
    WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- CLEANUP AND OPTIMIZATION SCHEDULE
-- ===========================================

-- Create function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Clean up old log entries (keep last 30 days)
    DELETE FROM maintenance_log 
    WHERE performed_at < NOW() - INTERVAL '30 days';
    
    -- Clean up old query statistics
    SELECT pg_stat_statements_reset();
    
    -- Vacuum deleted data
    VACUUM;
    
    RAISE NOTICE 'Cleanup completed at %', NOW();
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- PERFORMANCE RECOMMENDATIONS
-- ===========================================

/*
1. Connection Pooling:
   - Configure Supavisor with appropriate pool sizes
   - Use transaction-level pooling for better performance
   - Monitor connection usage with pg_stat_activity

2. Query Optimization:
   - Use EXPLAIN ANALYZE for slow queries
   - Add appropriate indexes based on query patterns
   - Avoid N+1 query problems in applications

3. Resource Monitoring:
   - Monitor CPU and memory usage
   - Set up alerts for slow queries
   - Track database growth and plan for scaling

4. Regular Maintenance:
   - Run VACUUM ANALYZE regularly
   - Monitor and clean up unused indexes
   - Update table statistics periodically

5. Security:
   - Use environment-specific database users
   - Implement proper RLS policies
   - Regular security updates and patches
*/

-- Display completion message
SELECT 'Supabase optimization script completed successfully!' as status;
