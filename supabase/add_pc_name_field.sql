-- =========================================================================
-- ADICIONAR CAMPO PC_NAME NA TABELA INSTALLATIONS
-- =========================================================================

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'pc_name'
    ) THEN
        ALTER TABLE installations ADD COLUMN pc_name TEXT;
        COMMENT ON COLUMN installations.pc_name IS 'Nome do computador (Hostname)';
    END IF;
END $$;
