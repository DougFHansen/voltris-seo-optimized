-- =========================================================================
-- LIMPAR DADOS ANTIGOS E FORÇAR ATUALIZAÇÃO
-- =========================================================================

-- Limpar os dados antigos de os_name para forçar atualização
UPDATE installations 
SET 
    os_name = NULL,
    gpu_name = NULL,
    disk_type = NULL,
    windows_edition = NULL
WHERE os_name LIKE 'Microsoft Windows NT%' OR gpu_name IS NULL;

-- Comentário: Após executar este script, desvincule e vincule novamente o dispositivo
-- ou aguarde o próximo heartbeat para atualizar automaticamente
