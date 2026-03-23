-- =========================================================================
-- ADICIONAR CAMPO PC_NAME NA TABELA INSTALLATIONS
-- =========================================================================

DO $$ 
BEGIN
    -- Verificar se a tabela existe antes de tentar alterá-la
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'installations'
    ) THEN
        -- Verificar se a coluna já não existe
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'installations' 
            AND column_name = 'pc_name'
        ) THEN
            ALTER TABLE public.installations ADD COLUMN pc_name TEXT;
            COMMENT ON COLUMN public.installations.pc_name IS 'Nome do computador (Hostname)';
        END IF;
    ELSE
        -- Se a tabela não existe, informa o motivo
        RAISE NOTICE 'A tabela public.installations não foi encontrada. Certifique-se de executar o setup_telemetry.sql primeiro.';
    END IF;
END $$;
