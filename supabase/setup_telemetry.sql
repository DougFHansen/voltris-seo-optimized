-- =========================================================================
-- MASTER SQL: SISTEMA DE TELEMETRIA, INSTALAÇÕES E LICENCIAMENTO ENTERPRISE
-- Projeto: Voltris Optimizer (Silicon Valley Standard)
-- =========================================================================

-- 1. EXTENSÕES E TIPOS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'license_status_type') THEN
        CREATE TYPE license_status_type AS ENUM ('trial', 'active', 'expired', 'revoked');
    END IF;
END $$;

-- 2. TABELA DE INSTALAÇÕES (CORE)
-- Representa cada máquina única onde o Voltris está instalado.
CREATE TABLE IF NOT EXISTS installations (
  id UUID PRIMARY KEY, -- O GUID gerado internamente pelo App WPF
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, 
  
  -- Hardware Info (Telemetria Técnica)
  app_version TEXT,
  cpu_name TEXT,
  ram_gb_total INTEGER,
  disk_main_type TEXT,
  os_name TEXT,
  os_build TEXT,
  architecture TEXT,
  
  -- Status de Licença (Sincronizado via Telemetria)
  license_key TEXT,
  license_status license_status_type DEFAULT 'trial',
  license_expires_at TIMESTAMPTZ,
  
  -- Estado de Operação
  is_optimized BOOLEAN DEFAULT FALSE,
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  last_optimized_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE EVENTOS (TELEMETRIA E AUDITORIA)
-- Registra ações específicas como "Otizimização Aplicada", "Crash", "Troca de Plano".
CREATE TABLE IF NOT EXISTS installation_events (
  id BIGSERIAL PRIMARY KEY,
  installation_id UUID REFERENCES installations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- Ex: 'APP_START', 'OPTIMIZATION_ON', 'CRASH', 'LICENSE_ACTIVATE'
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE HEARTBEATS (MÉTRICAS DE UPTIME)
-- Histórico bruto para geração de gráficos de uso/retenção.
CREATE TABLE IF NOT EXISTS installation_heartbeats (
  id BIGSERIAL PRIMARY KEY,
  installation_id UUID REFERENCES installations(id) ON DELETE CASCADE,
  is_optimized BOOLEAN,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ÍNDICES DE PERFORMANCE (ESTRUTURA ENTERPRISE)
CREATE INDEX IF NOT EXISTS idx_installations_user_id ON installations(user_id);
CREATE INDEX IF NOT EXISTS idx_installations_last_heartbeat ON installations(last_heartbeat);
CREATE INDEX IF NOT EXISTS idx_installations_license_key ON installations(license_key);
CREATE INDEX IF NOT EXISTS idx_events_inst_id_type ON installation_events(installation_id, event_type);
CREATE INDEX IF NOT EXISTS idx_heartbeats_timestamp ON installation_heartbeats(timestamp);

-- 6. HABILITAR REALTIME (PARA DASHBOARD ADMIN)
DO $$ 
BEGIN
  -- Verificar se a publicação existe
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- Verificar se a tabela já faz parte da publicação para não dar erro ao adicionar
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'installations'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE installations;
    END IF;
  ELSE
    -- Se não existir a publicação padrão, cria ela com a tabela
    CREATE PUBLICATION supabase_realtime FOR TABLE installations;
  END IF;
END $$;

-- 7. SEGURANÇA (ROW LEVEL SECURITY)
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_heartbeats ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA 'installations'
DROP POLICY IF EXISTS "Users can view own installations" ON installations;
CREATE POLICY "Users can view own installations" ON installations 
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all installations" ON installations;
CREATE POLICY "Admins can view all installations" ON installations 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

DROP POLICY IF EXISTS "Service role can manage everything" ON installations;
CREATE POLICY "Service role can manage everything" ON installations 
FOR ALL USING (true) WITH CHECK (true); -- Seguro pois Service Role ignora RLS ou o backend controla.

-- POLÍTICAS PARA 'installation_events'
DROP POLICY IF EXISTS "Users can view own events" ON installation_events;
CREATE POLICY "Users can view own events" ON installation_events 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM installations WHERE id = installation_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can view all events" ON installation_events;
CREATE POLICY "Admins can view all events" ON installation_events 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 8. TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_installations_updated_at ON installations;
CREATE TRIGGER tr_installations_updated_at
BEFORE UPDATE ON installations FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- 9. COMENTÁRIOS (DOCUMENTAÇÃO SQL)
COMMENT ON TABLE installations IS 'Armazena instâncias únicas do software Voltris por máquina.';
COMMENT ON TABLE installation_events IS 'Telemetria de eventos e ações realizadas no software.';
COMMENT ON TABLE installation_heartbeats IS 'Logs periódicos de atividade para métricas de retenção.';
