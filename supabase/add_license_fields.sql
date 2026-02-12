-- Adicionar campos de licença na tabela installations
-- Execute este SQL no Supabase SQL Editor

-- Verificar se o tipo ENUM já existe (já foi criado em setup_telemetry.sql)
-- license_status_type AS ENUM ('trial', 'active', 'expired', 'revoked')

-- Adicionar coluna license_status se não existir (usando o ENUM existente)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'license_status'
    ) THEN
        ALTER TABLE installations 
        ADD COLUMN license_status license_status_type DEFAULT 'trial';
    END IF;
END $$;

-- Adicionar coluna license_key (chave de licença do programa)
ALTER TABLE installations 
ADD COLUMN IF NOT EXISTS license_key TEXT;

-- Adicionar coluna license_activated_at (data de ativação da licença)
ALTER TABLE installations 
ADD COLUMN IF NOT EXISTS license_activated_at TIMESTAMPTZ;

-- Adicionar coluna license_expires_at (data de expiração da licença)
ALTER TABLE installations 
ADD COLUMN IF NOT EXISTS license_expires_at TIMESTAMPTZ;

-- Criar índice para melhorar performance de queries
CREATE INDEX IF NOT EXISTS idx_installations_license_status 
ON installations(license_status);

-- Comentários para documentação
COMMENT ON COLUMN installations.license_status IS 'Status da licença: trial (período de teste), active (licença ativa), expired (licença expirada), revoked (revogada)';
COMMENT ON COLUMN installations.license_key IS 'Chave de licença do Voltris Optimizer (formato: VOLTRIS-XXX-XXXXX-XXXXXXXX-XXXXXXXXXXXXXXXX)';
COMMENT ON COLUMN installations.license_activated_at IS 'Data e hora em que a licença foi ativada';
COMMENT ON COLUMN installations.license_expires_at IS 'Data e hora em que a licença expira (NULL para licenças vitalícias)';

-- Atualizar registros existentes para ter status 'trial' se estiverem NULL
-- (Não precisa verificar string vazia pois é ENUM)
UPDATE installations 
SET license_status = 'trial' 
WHERE license_status IS NULL;

SELECT 'Campos de licença adicionados/verificados com sucesso!' as message;
