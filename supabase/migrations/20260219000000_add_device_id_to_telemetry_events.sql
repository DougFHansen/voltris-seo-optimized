-- ============================================================================
-- CORREÇÃO: Adicionar device_id à tabela telemetry_events
-- Data: 19/02/2026
-- Problema: Logs de telemetria não aparecem no dashboard porque device_id está NULL
-- ============================================================================

-- 1. Adicionar coluna device_id
ALTER TABLE telemetry_events 
ADD COLUMN IF NOT EXISTS device_id UUID REFERENCES devices(id) ON DELETE CASCADE;

-- 2. Adicionar campos faltantes para compatibilidade com o schema esperado
ALTER TABLE telemetry_events 
ADD COLUMN IF NOT EXISTS success BOOLEAN DEFAULT true;

ALTER TABLE telemetry_events 
ADD COLUMN IF NOT EXISTS duration_ms INTEGER DEFAULT 0;

ALTER TABLE telemetry_events 
ADD COLUMN IF NOT EXISTS error_code TEXT;

-- 3. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_telemetry_events_device_id 
ON telemetry_events(device_id);

-- 4. Atualizar registros existentes (preencher device_id a partir de session_id)
UPDATE telemetry_events te
SET device_id = s.device_id
FROM sessions s
WHERE te.session_id = s.id
AND te.device_id IS NULL;

-- 5. Comentários para documentação
COMMENT ON COLUMN telemetry_events.device_id IS 'Foreign key to devices table for JOIN operations';
COMMENT ON COLUMN telemetry_events.success IS 'Indicates if the event/action was successful';
COMMENT ON COLUMN telemetry_events.duration_ms IS 'Duration of the action in milliseconds';
COMMENT ON COLUMN telemetry_events.error_code IS 'Error code if the action failed';

-- 6. Verificar integridade dos dados
DO $$
DECLARE
    null_device_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO null_device_count
    FROM telemetry_events
    WHERE device_id IS NULL;
    
    IF null_device_count > 0 THEN
        RAISE NOTICE 'AVISO: % eventos ainda têm device_id NULL (sessões órfãs ou deletadas)', null_device_count;
    ELSE
        RAISE NOTICE 'SUCESSO: Todos os eventos têm device_id preenchido';
    END IF;
END $$;
