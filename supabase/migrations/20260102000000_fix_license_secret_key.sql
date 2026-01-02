-- =====================================================
-- FIX: Atualizar chave secreta na função generate_license_key
-- A chave deve ser idêntica à usada no aplicativo C#
-- =====================================================

-- Recriar função com chave correta
CREATE OR REPLACE FUNCTION generate_license_key(
    p_client_id TEXT,
    p_valid_until DATE,
    p_plan TEXT
) RETURNS TEXT AS $$
DECLARE
    v_content TEXT;
    v_signature TEXT;
    v_formatted_date TEXT;
BEGIN
    -- Formatar data
    v_formatted_date := TO_CHAR(p_valid_until, 'YYYYMMDD');
    
    -- Criar conteúdo da licença (mesmo formato do app C#)
    v_content := json_build_object(
        'id', p_client_id,
        'validUntil', p_valid_until::TEXT,
        'plan', p_plan
    )::TEXT;
    
    -- Gerar assinatura usando a MESMA chave secreta do aplicativo
    -- CRÍTICO: Esta chave DEVE ser idêntica à:
    -- - LicenseSecurityService.cs (app)
    -- - LicenseGenerator/Program.cs
    v_signature := SUBSTRING(
        ENCODE(
            DIGEST(
                v_content || 'VOLTRIS_SECRET_LICENSE_KEY_2025', 
                'sha256'
            ), 
            'hex'
        ), 
        1, 
        16
    );
    
    -- Formatar chave final
    RETURN 'VOLTRIS-LIC-' || p_client_id || '-' || v_formatted_date || '-' || UPPER(v_signature);
END;
$$ LANGUAGE plpgsql;

-- Comentário explicativo
COMMENT ON FUNCTION generate_license_key(TEXT, DATE, TEXT) IS 
'Gera chave de licença compatível com o aplicativo Voltris Optimizer. 
IMPORTANTE: A chave secreta VOLTRIS_SECRET_LICENSE_KEY_2025 deve ser idêntica 
à usada no código C# para garantir compatibilidade.';
