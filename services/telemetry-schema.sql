-- =============================================
-- VOLTRIS OPTIMIZER - ENTERPRISE TELEMETRY SCHEMA
-- =============================================

-- 1. DEVICE INTELLIGENCE (Perfil detalhado do Hardware)
CREATE TABLE IF NOT EXISTS public.device_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    cpu_model TEXT,
    gpu_model TEXT,
    ram_total_gb NUMERIC(5,2),
    disk_type TEXT, -- SSD, NVMe, HDD
    os_version TEXT, -- Windows 11 Pro
    windows_build TEXT, -- 22631.3007
    is_64bit BOOLEAN,
    is_admin BOOLEAN,
    screen_resolution TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(device_id) 
);

-- 2. ACTIVITY SESSIONS (Sessões detalhadas)
-- (Sua tabela 'sessions' atual foca em estado, vamos criar uma de histórico se necessário, 
-- ou alterar a session atual para suportar metrics de encerramento)
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS close_reason TEXT DEFAULT 'unknown', -- 'user_exit', 'crash', 'shutdown', 'update'
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER DEFAULT 0;

-- 3. TELEMETRY EVENTS (Log Comportamental - A "Jornada do Usuário")
CREATE TABLE IF NOT EXISTS public.telemetry_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'APP_START', 'FEATURE_USE', 'ERROR', 'PERFORMANCE'
    feature_name TEXT, -- 'SmartResume', 'GamerMode', 'Cleaner'
    action_name TEXT, -- 'Click', 'Execute', 'View'
    duration_ms INTEGER, -- Tempo que a ação levou (ex: limpeza demorou 500ms)
    success BOOLEAN,
    error_code TEXT,
    metadata JSONB, -- Dados extras flexíveis
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PERFORMANCE METRICS (Antes e Depois)
CREATE TABLE IF NOT EXISTS public.performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.telemetry_events(id) ON DELETE CASCADE,
    cpu_usage_before NUMERIC(5,2),
    cpu_usage_after NUMERIC(5,2),
    ram_usage_before_mb INTEGER,
    ram_usage_after_mb INTEGER,
    disk_free_before_gb NUMERIC(10,2),
    disk_free_after_gb NUMERIC(10,2),
    processes_count_before INTEGER,
    processes_count_after INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. POLICIES (Segurança RLS)
ALTER TABLE public.device_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Permitir INSERT público (o app manda dados), mas SELECT apenas para admin (service_role ignora RLS, admin dashboard usa service role ou admin user)
DROP POLICY IF EXISTS "Apps can insert profiles" ON public.device_profiles;
CREATE POLICY "Apps can insert profiles" ON public.device_profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Apps can update profiles" ON public.device_profiles;
CREATE POLICY "Apps can update profiles" ON public.device_profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Apps can insert events" ON public.telemetry_events;
CREATE POLICY "Apps can insert events" ON public.telemetry_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Apps can insert metrics" ON public.performance_metrics;
CREATE POLICY "Apps can insert metrics" ON public.performance_metrics FOR INSERT WITH CHECK (true);

-- Indexação para Alta Performance no Dashboard
CREATE INDEX IF NOT EXISTS idx_telemetry_session ON public.telemetry_events(session_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_device ON public.telemetry_events(device_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_type ON public.telemetry_events(event_type);
CREATE INDEX IF NOT EXISTS idx_telemetry_created ON public.telemetry_events(created_at DESC);
