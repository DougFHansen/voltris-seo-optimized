-- =========================================================================
-- FIX TELEMETRY SYSTEM - Create Missing Tables and Fix Data Structure
-- =========================================================================

-- 1. CREATE DEVICES TABLE (replaces partial functionality of installations)
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id UUID UNIQUE NOT NULL, -- Links to installations.id
  hostname TEXT NOT NULL,
  os_version TEXT,
  architecture TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE DEVICE_PROFILES TABLE (hardware information)
CREATE TABLE IF NOT EXISTS device_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE UNIQUE,
  cpu_model TEXT,
  gpu_model TEXT,
  ram_total_gb INTEGER,
  disk_type TEXT,
  os_version TEXT,
  windows_build TEXT,
  windows_edition TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE SESSIONS TABLE (tracks app sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active', -- 'active', 'idle', 'closed'
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_heartbeat_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  app_version TEXT,
  health_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE TELEMETRY_EVENTS TABLE (detailed event tracking)
CREATE TABLE IF NOT EXISTS telemetry_events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'SYSTEM_HEALTH', 'OPTIMIZATION', 'COMMAND', etc.
  feature_name TEXT,
  action_name TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE COMPANIES TABLE (if not exists)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  plan_type TEXT DEFAULT 'personal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MIGRATE EXISTING DATA FROM INSTALLATIONS TO NEW STRUCTURE
-- Create devices from installations
INSERT INTO devices (machine_id, hostname, os_version, architecture, created_at)
SELECT 
  id as machine_id,
  COALESCE(NULLIF(TRIM(cpu_name), ''), 'Unknown') as hostname, -- Temporary, will be fixed
  os_name as os_version,
  architecture,
  created_at
FROM installations
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE devices.machine_id = installations.id)
ON CONFLICT (machine_id) DO NOTHING;

-- Create device_profiles from installations
INSERT INTO device_profiles (device_id, cpu_model, gpu_model, ram_total_gb, disk_type, os_version, windows_build, windows_edition)
SELECT 
  d.id as device_id,
  i.cpu_name as cpu_model,
  i.gpu_name as gpu_model,
  i.ram_gb_total,
  i.disk_type,
  i.os_name as os_version,
  i.os_build as windows_build,
  i.windows_edition
FROM installations i
JOIN devices d ON d.machine_id = i.id
WHERE NOT EXISTS (SELECT 1 FROM device_profiles WHERE device_profiles.device_id = d.id)
ON CONFLICT (device_id) DO UPDATE SET
  cpu_model = EXCLUDED.cpu_model,
  gpu_model = EXCLUDED.gpu_model,
  ram_total_gb = EXCLUDED.ram_total_gb,
  disk_type = EXCLUDED.disk_type,
  os_version = EXCLUDED.os_version,
  windows_build = EXCLUDED.windows_build,
  windows_edition = EXCLUDED.windows_edition,
  updated_at = NOW();

-- Create active sessions for devices with recent heartbeats (last 30 minutes)
INSERT INTO sessions (device_id, status, started_at, last_heartbeat_at, app_version, health_score)
SELECT 
  d.id as device_id,
  CASE 
    WHEN i.last_heartbeat > NOW() - INTERVAL '5 minutes' THEN 'active'
    WHEN i.last_heartbeat > NOW() - INTERVAL '30 minutes' THEN 'idle'
    ELSE 'closed'
  END as status,
  i.created_at as started_at,
  i.last_heartbeat as last_heartbeat_at,
  i.app_version,
  100 as health_score -- Default health score
FROM installations i
JOIN devices d ON d.machine_id = i.id
WHERE i.last_heartbeat > NOW() - INTERVAL '30 minutes'
  AND NOT EXISTS (
    SELECT 1 FROM sessions s 
    WHERE s.device_id = d.id 
    AND s.last_heartbeat_at > NOW() - INTERVAL '30 minutes'
  );

-- 7. ADD MISSING COLUMNS TO INSTALLATIONS
ALTER TABLE installations ADD COLUMN IF NOT EXISTS gpu_name TEXT;
ALTER TABLE installations ADD COLUMN IF NOT EXISTS disk_type TEXT;
ALTER TABLE installations ADD COLUMN IF NOT EXISTS windows_edition TEXT;
ALTER TABLE installations ADD COLUMN IF NOT EXISTS hostname TEXT;

-- 8. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_devices_machine_id ON devices(machine_id);
CREATE INDEX IF NOT EXISTS idx_devices_hostname ON devices(hostname);
CREATE INDEX IF NOT EXISTS idx_device_profiles_device_id ON device_profiles(device_id);
CREATE INDEX IF NOT EXISTS idx_sessions_device_id ON sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_last_heartbeat ON sessions(last_heartbeat_at);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_session_id ON telemetry_events(session_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_event_type ON telemetry_events(event_type);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_created_at ON telemetry_events(created_at);

-- 9. ENABLE ROW LEVEL SECURITY
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- 10. CREATE POLICIES
-- Devices policies
DROP POLICY IF EXISTS "Service role can manage devices" ON devices;
CREATE POLICY "Service role can manage devices" ON devices FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can view all devices" ON devices;
CREATE POLICY "Admins can view all devices" ON devices FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Device profiles policies
DROP POLICY IF EXISTS "Service role can manage device_profiles" ON device_profiles;
CREATE POLICY "Service role can manage device_profiles" ON device_profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can view all device_profiles" ON device_profiles;
CREATE POLICY "Admins can view all device_profiles" ON device_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Sessions policies
DROP POLICY IF EXISTS "Service role can manage sessions" ON sessions;
CREATE POLICY "Service role can manage sessions" ON sessions FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can view all sessions" ON sessions;
CREATE POLICY "Admins can view all sessions" ON sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Telemetry events policies
DROP POLICY IF EXISTS "Service role can manage telemetry_events" ON telemetry_events;
CREATE POLICY "Service role can manage telemetry_events" ON telemetry_events FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can view all telemetry_events" ON telemetry_events;
CREATE POLICY "Admins can view all telemetry_events" ON telemetry_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Companies policies
DROP POLICY IF EXISTS "Service role can manage companies" ON companies;
CREATE POLICY "Service role can manage companies" ON companies FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can view all companies" ON companies;
CREATE POLICY "Admins can view all companies" ON companies FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 11. CREATE TRIGGERS
CREATE OR REPLACE FUNCTION update_device_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_devices_updated_at ON devices;
CREATE TRIGGER tr_devices_updated_at
BEFORE UPDATE ON devices FOR EACH ROW
EXECUTE PROCEDURE update_device_updated_at();

DROP TRIGGER IF EXISTS tr_device_profiles_updated_at ON device_profiles;
CREATE TRIGGER tr_device_profiles_updated_at
BEFORE UPDATE ON device_profiles FOR EACH ROW
EXECUTE PROCEDURE update_device_updated_at();

-- 12. CREATE FUNCTION TO CLEAN OLD SESSIONS
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
  -- Mark sessions as closed if no heartbeat for 30 minutes
  UPDATE sessions 
  SET status = 'closed', ended_at = last_heartbeat_at
  WHERE status IN ('active', 'idle') 
    AND last_heartbeat_at < NOW() - INTERVAL '30 minutes';
END;
$$ LANGUAGE plpgsql;

-- 13. ENABLE REALTIME FOR NEW TABLES
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- Add tables to realtime publication if not already added
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'sessions') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'devices') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE devices;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'device_profiles') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE device_profiles;
    END IF;
  END IF;
END $$;

-- 14. COMMENTS
COMMENT ON TABLE devices IS 'Stores unique device information for each machine running Voltris';
COMMENT ON TABLE device_profiles IS 'Hardware profiles for each device';
COMMENT ON TABLE sessions IS 'Active and historical app sessions';
COMMENT ON TABLE telemetry_events IS 'Detailed event tracking for analytics';
COMMENT ON TABLE companies IS 'Company/organization information for enterprise users';
