-- =========================================================================
-- FIX TELEMETRY SYSTEM - Final Version (handles existing tables)
-- =========================================================================

-- 1. DROP EXISTING TABLES IF THEY HAVE WRONG SCHEMA
DROP TABLE IF EXISTS telemetry_events CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS device_profiles CASCADE;
DROP TABLE IF EXISTS devices CASCADE;

-- 2. CREATE COMPANIES TABLE
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  plan_type TEXT DEFAULT 'personal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE DEVICES TABLE (fresh with correct schema)
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id UUID UNIQUE NOT NULL,
  hostname TEXT NOT NULL DEFAULT 'Unknown',
  os_version TEXT,
  architecture TEXT DEFAULT 'x64',
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE DEVICE_PROFILES TABLE
CREATE TABLE device_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  cpu_model TEXT,
  gpu_model TEXT,
  ram_total_gb INTEGER,
  disk_type TEXT,
  os_version TEXT,
  windows_build TEXT,
  windows_edition TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(device_id)
);

-- 5. CREATE SESSIONS TABLE
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_heartbeat_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  app_version TEXT,
  health_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CREATE TELEMETRY_EVENTS TABLE
CREATE TABLE telemetry_events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  feature_name TEXT,
  action_name TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ADD MISSING COLUMNS TO INSTALLATIONS
ALTER TABLE installations ADD COLUMN IF NOT EXISTS gpu_name TEXT;
ALTER TABLE installations ADD COLUMN IF NOT EXISTS disk_type TEXT;
ALTER TABLE installations ADD COLUMN IF NOT EXISTS windows_edition TEXT;
ALTER TABLE installations ADD COLUMN IF NOT EXISTS hostname TEXT;
ALTER TABLE installations ADD COLUMN IF NOT EXISTS architecture TEXT DEFAULT 'x64';

-- 8. MIGRATE DATA FROM INSTALLATIONS
-- Insert devices
INSERT INTO devices (machine_id, hostname, os_version, architecture, created_at)
SELECT 
  i.id,
  COALESCE(NULLIF(TRIM(i.hostname), ''), 'Unknown'),
  COALESCE(i.os_name, 'Windows'),
  COALESCE(i.architecture, 'x64'),
  i.created_at
FROM installations i;

-- Insert device profiles
INSERT INTO device_profiles (device_id, cpu_model, gpu_model, ram_total_gb, disk_type, os_version, windows_build, windows_edition)
SELECT 
  d.id,
  i.cpu_name,
  COALESCE(i.gpu_name, 'Unknown GPU'),
  i.ram_gb_total,
  COALESCE(i.disk_type, 'HDD'),
  i.os_name,
  i.os_build,
  i.windows_edition
FROM installations i
JOIN devices d ON d.machine_id = i.id;

-- Create sessions for recent heartbeats
INSERT INTO sessions (device_id, status, started_at, last_heartbeat_at, app_version, health_score)
SELECT 
  d.id,
  CASE 
    WHEN i.last_heartbeat > NOW() - INTERVAL '5 minutes' THEN 'active'
    WHEN i.last_heartbeat > NOW() - INTERVAL '30 minutes' THEN 'idle'
    ELSE 'closed'
  END,
  i.created_at,
  i.last_heartbeat,
  i.app_version,
  100
FROM installations i
JOIN devices d ON d.machine_id = i.id
WHERE i.last_heartbeat > NOW() - INTERVAL '30 minutes';

-- 9. CREATE INDEXES
CREATE INDEX idx_devices_machine_id ON devices(machine_id);
CREATE INDEX idx_devices_hostname ON devices(hostname);
CREATE INDEX idx_device_profiles_device_id ON device_profiles(device_id);
CREATE INDEX idx_sessions_device_id ON sessions(device_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_last_heartbeat ON sessions(last_heartbeat_at);
CREATE INDEX idx_telemetry_events_session_id ON telemetry_events(session_id);
CREATE INDEX idx_telemetry_events_event_type ON telemetry_events(event_type);
CREATE INDEX idx_telemetry_events_created_at ON telemetry_events(created_at);

-- 10. ENABLE ROW LEVEL SECURITY
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- 11. CREATE POLICIES
CREATE POLICY "Service role can manage devices" ON devices FOR ALL USING (true);
CREATE POLICY "Admins can view all devices" ON devices FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Service role can manage device_profiles" ON device_profiles FOR ALL USING (true);
CREATE POLICY "Admins can view all device_profiles" ON device_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Service role can manage sessions" ON sessions FOR ALL USING (true);
CREATE POLICY "Admins can view all sessions" ON sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Service role can manage telemetry_events" ON telemetry_events FOR ALL USING (true);
CREATE POLICY "Admins can view all telemetry_events" ON telemetry_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Service role can manage companies" ON companies FOR ALL USING (true);
CREATE POLICY "Admins can view all companies" ON companies FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 12. CREATE TRIGGERS
CREATE OR REPLACE FUNCTION update_device_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_devices_updated_at
BEFORE UPDATE ON devices FOR EACH ROW
EXECUTE PROCEDURE update_device_updated_at();

CREATE TRIGGER tr_device_profiles_updated_at
BEFORE UPDATE ON device_profiles FOR EACH ROW
EXECUTE PROCEDURE update_device_updated_at();

-- 13. CREATE FUNCTION TO CLEAN OLD SESSIONS
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
  UPDATE sessions 
  SET status = 'closed', ended_at = last_heartbeat_at
  WHERE status IN ('active', 'idle') 
    AND last_heartbeat_at < NOW() - INTERVAL '30 minutes';
END;
$$ LANGUAGE plpgsql;

-- 14. ENABLE REALTIME
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
    ALTER PUBLICATION supabase_realtime ADD TABLE devices;
    ALTER PUBLICATION supabase_realtime ADD TABLE device_profiles;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 15. COMMENTS
COMMENT ON TABLE devices IS 'Stores unique device information for each machine running Voltris';
COMMENT ON TABLE device_profiles IS 'Hardware profiles for each device';
COMMENT ON TABLE sessions IS 'Active and historical app sessions';
COMMENT ON TABLE telemetry_events IS 'Detailed event tracking for analytics';
COMMENT ON TABLE companies IS 'Company/organization information for enterprise users';
