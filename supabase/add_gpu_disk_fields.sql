-- =========================================================================
-- ADICIONAR CAMPOS GPU E DISK TYPE NA TABELA INSTALLATIONS
-- =========================================================================

-- Adicionar campo gpu_name se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'gpu_name'
    ) THEN
        ALTER TABLE installations ADD COLUMN gpu_name TEXT;
        COMMENT ON COLUMN installations.gpu_name IS 'Nome da placa de vídeo (GPU)';
    END IF;
END $$;

-- Adicionar campo disk_type se não existir (renomear disk_main_type para disk_type)
DO $$ 
BEGIN
    -- Se disk_type não existe mas disk_main_type existe, renomear
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'disk_type'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'disk_main_type'
    ) THEN
        ALTER TABLE installations RENAME COLUMN disk_main_type TO disk_type;
        COMMENT ON COLUMN installations.disk_type IS 'Tipo do disco principal (SSD ou HDD)';
    -- Se disk_type não existe e disk_main_type também não, criar disk_type
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'disk_type'
    ) THEN
        ALTER TABLE installations ADD COLUMN disk_type TEXT;
        COMMENT ON COLUMN installations.disk_type IS 'Tipo do disco principal (SSD ou HDD)';
    END IF;
END $$;

-- Adicionar campo windows_edition se não existir (para LTSC, Pro, Home, etc)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installations' 
        AND column_name = 'windows_edition'
    ) THEN
        ALTER TABLE installations ADD COLUMN windows_edition TEXT;
        COMMENT ON COLUMN installations.windows_edition IS 'Edição do Windows (LTSC, Pro, Home, Enterprise, etc)';
    END IF;
END $$;

-- Comentários para documentação
COMMENT ON COLUMN installations.os_name IS 'Nome completo do sistema operacional com versão legível';
COMMENT ON COLUMN installations.os_build IS 'Build number do Windows (ex: 19044)';
