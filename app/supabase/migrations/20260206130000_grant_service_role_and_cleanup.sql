-- Grant service_role access to molthome schema
GRANT USAGE ON SCHEMA molthome TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA molthome TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA molthome TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA molthome GRANT ALL ON TABLES TO service_role;

-- Clean up old test data
DELETE FROM molthome.api_keys;
DELETE FROM molthome.instances;
