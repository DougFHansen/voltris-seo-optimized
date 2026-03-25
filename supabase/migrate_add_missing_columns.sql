-- =========================================================================
-- MIGRAÇÃO COMPLETA: DROP + RECREATE installations e device_commands
-- Projeto: Voltris Optimizer
-- Data: 2026-03-25
--
-- ATENÇÃO: Este script APAGA TODOS OS DADOS das tabelas abaixo.
-- Execute apenas se tiver certeza. Faça backup antes se necessário.
-- =========================================================================

-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 1: DROPAR TUDO (ordem inversa por causa das foreign keys)
-- ═══════════════════════════════════════════════════════════════════════════

-- Dropar tabelas dependentes primeiro (têm FK para installations)
DROP TABLE IF EXISTS device_commands CASCADE;
DROP TABLE IF EXISTS installation_heartbeats CASCADE;
DROP TABLE IF EXISTS installation_events CASCADE;

-- Dropar a tabela principal
DROP TABLE IF EXISTS installations CASCADE;

-- Dropar o tipo enum se existir (para recriar limpo)
DROP TYPE IF EXISTS license_status_type CASCADE;

-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 2: RECRIAR TIPO ENUM
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TYPE license_status_type AS ENUM ('trial', 'active', 'expired', 'revoked');

-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 3: RECRIAR TABELA installations (COM TODAS AS COLUNAS)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE installations (
  id UUID PRIMARY KEY,                                          -- GUID gerado pelo App WPF
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Vinculação com conta do site

  -- Identificação do PC
  pc_name TEXT,                                                  -- Nome do computador (Environment.MachineName)

  -- Hardware Info (enviado pelo app via /api/v1/install)
  app_version TEXT,
  cpu_name TEXT,                                                 -- Ex: "Intel Core i7-12700H"
  gpu_name TEXT,                                                 -- Ex: "NVIDIA GeForce RTX 3060"
  ram_gb_total INTEGER,                                          -- Ex: 16
  disk_type TEXT,                                                -- Ex: "SSD" ou "HDD"
  disk_main_type TEXT,                                           -- Alias legado (compatibilidade)
  os_name TEXT,                                                  -- Ex: "Microsoft Windows NT 10.0.22631.0"
  os_build TEXT,                                                 -- Ex: "22631"
  windows_edition TEXT,                                          -- Ex: "Windows 11 Pro"
  architecture TEXT,                                             -- Ex: "x64"

  -- Status de Licença
  license_key TEXT,
  license_status license_status_type DEFAULT 'trial',
  license_expires_at TIMESTAMPTZ,
  is_licensed BOOLEAN DEFAULT FALSE,                             -- Para o dashboard mostrar "Acesso Total" vs "Restrito"

  -- Estado de Operação
  is_optimized BOOLEAN DEFAULT FALSE,
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),                         -- Fallback/alias para last_heartbeat
  last_optimized_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 4: RECRIAR TABELA device_commands
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE device_commands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  installation_id UUID NOT NULL REFERENCES installations(id) ON DELETE CASCADE,
  command_type TEXT NOT NULL,                                     -- optimize, shutdown, restart_link, gamer_mode, prepare_pc, heartbeat
  status TEXT DEFAULT 'pending',                                  -- pending, grabbed, completed, failed
  payload JSONB DEFAULT '{}'::jsonb,
  result_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  executed_at TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 5: RECRIAR TABELAS DE TELEMETRIA (eventos + heartbeats)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE installation_events (
  id BIGSERIAL PRIMARY KEY,
  installation_id UUID REFERENCES installations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE installation_heartbeats (
  id BIGSERIAL PRIMARY KEY,
  installation_id UUID REFERENCES installations(id) ON DELETE CASCADE,
  is_optimized BOOLEAN,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 6: ÍNDICES DE PERFORMANCE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE INDEX idx_installations_user_id ON installations(user_id);
CREATE INDEX idx_installations_last_heartbeat ON installations(last_heartbeat);
CREATE INDEX idx_installations_license_key ON installations(license_key);
CREATE INDEX idx_device_commands_installation_id ON device_commands(installation_id);
CREATE INDEX idx_device_commands_status ON device_commands(status);
CREATE INDEX idx_device_commands_created ON device_commands(created_at DESC);
CREATE INDEX idx_events_inst_id_type ON installation_events(installation_id, event_type);
CREATE INDEX idx_heartbeats_timestamp ON installation_heartbeats(timestamp);

-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 7: TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════

-- Trigger: Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_installations_updated_at
BEFORE UPDATE ON installations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Sincronizar last_active com last_heartbeat
CREATE OR REPLACE FUNCTION sync_last_active()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.last_heartbeat IS DISTINCT FROM OLD.last_heartbeat THEN
        NEW.last_active = NEW.last_heartbeat;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sync_last_active
BEFORE UPDATE ON installations
FOR EACH ROW
EXECUTE FUNCTION sync_last_active();

-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 8: ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════

-- installations
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own installations"
ON installations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all installations"
ON installations FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Service role full access installations"
ON installations FOR ALL
USING (true) WITH CHECK (true);

-- device_commands
ALTER TABLE device_commands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert commands for own installations"
ON device_commands FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM installations
    WHERE installations.id = device_commands.installation_id
    AND installations.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view commands for own installations"
ON device_commands FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM installations
    WHERE installations.id = device_commands.installation_id
    AND installations.user_id = auth.uid()
  )
);

CREATE POLICY "Service role full access device_commands"
ON device_commands FOR ALL
USING (true) WITH CHECK (true);

-- installation_events
ALTER TABLE installation_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
ON installation_events FOR SELECT
USING (
  EXISTS (SELECT 1 FROM installations WHERE id = installation_id AND user_id = auth.uid())
);

CREATE POLICY "Admins can manage all events"
ON installation_events FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- installation_heartbeats
ALTER TABLE installation_heartbeats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own heartbeats"
ON installation_heartbeats FOR SELECT
USING (
  EXISTS (SELECT 1 FROM installations WHERE id = installation_id AND user_id = auth.uid())
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 9: REALTIME (Supabase)
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- installations
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'installations'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE installations;
    END IF;
    -- device_commands
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'device_commands'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE device_commands;
    END IF;
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- PASSO 10: COMENTÁRIOS
-- ═══════════════════════════════════════════════════════════════════════════

COMMENT ON TABLE installations IS 'Instâncias do Voltris Optimizer por máquina. Contém hardware, licença e status.';
COMMENT ON TABLE device_commands IS 'Comandos remotos enviados do dashboard web para o app desktop.';
COMMENT ON TABLE installation_events IS 'Telemetria de eventos e ações realizadas no software.';
COMMENT ON TABLE installation_heartbeats IS 'Logs periódicos de atividade para métricas de retenção.';

COMMENT ON COLUMN installations.pc_name IS 'Nome do computador (Environment.MachineName)';
COMMENT ON COLUMN installations.gpu_name IS 'Nome da GPU (ex: NVIDIA GeForce RTX 3060)';
COMMENT ON COLUMN installations.is_licensed IS 'Se o dispositivo tem licença ativa (para dashboard)';
COMMENT ON COLUMN installations.last_active IS 'Alias de last_heartbeat — sincronizado via trigger';
COMMENT ON COLUMN device_commands.command_type IS 'Tipos: optimize, shutdown, restart_link, gamer_mode, prepare_pc, heartbeat';
