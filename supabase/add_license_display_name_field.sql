-- Adicionar campo license_display_name na tabela licenses
-- Execute este SQL no Supabase SQL Editor

-- Adicionar coluna license_display_name se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'licenses' 
        AND column_name = 'license_display_name'
    ) THEN
        ALTER TABLE licenses 
        ADD COLUMN license_display_name TEXT DEFAULT 'VOLTRIS STANDARD';
        
        -- Atualizar registros existentes com nomes apropriados
        UPDATE licenses 
        SET license_display_name = CASE 
            WHEN license_type = 'trial' THEN 'Trial'
            WHEN license_type = 'standard' THEN 'VOLTRIS STANDARD'
            WHEN license_type = 'pro' THEN 'VOLTRIS PRO'
            WHEN license_type = 'enterprise' THEN 'VOLTRIS ENTERPRISE'
            ELSE 'VOLTRIS STANDARD'
        END
        WHERE license_display_name = 'VOLTRIS STANDARD';
        
        RAISE NOTICE 'Campo license_display_name adicionado e registros atualizados';
    ELSE
        RAISE NOTICE 'Campo license_display_name já existe';
    END IF;
END $$;

-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_licenses_display_name 
ON licenses(license_display_name);

-- Comentário para documentação
COMMENT ON COLUMN licenses.license_display_name IS 'Nome completo da licença para exibição (ex: VOLTRIS STANDARD, VOLTRIS PRO)';

SELECT 'Campo license_display_name adicionado/verificado com sucesso!' as message;

