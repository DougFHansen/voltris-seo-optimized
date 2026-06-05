-- =====================================================
-- SISTEMA COMPLETO DE LICENÇAS E PAGAMENTOS - VOLTRIS
-- Versão corrigida com políticas RLS adequadas
-- =====================================================

-- =====================================================
-- PARTE 1: LIMPEZA (remover políticas e triggers existentes)
-- =====================================================
-- NOTA: Só remove se as tabelas existirem

DO $$
BEGIN
    -- Remover políticas RLS de payments (se tabela existir)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
        DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
        DROP POLICY IF EXISTS "Service role can manage all payments" ON payments;
        DROP POLICY IF EXISTS "Allow payment creation without auth" ON payments;
        DROP POLICY IF EXISTS "Allow payment updates without auth" ON payments;
        DROP POLICY IF EXISTS "Allow payment lookup by preference or payment id" ON payments;
        DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
    END IF;

    -- Remover políticas RLS de licenses (se tabela existir)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'licenses') THEN
        DROP POLICY IF EXISTS "Users can view their own licenses" ON licenses;
        DROP POLICY IF EXISTS "Service role can manage all licenses" ON licenses;
        DROP POLICY IF EXISTS "Allow license creation without auth" ON licenses;
        DROP POLICY IF EXISTS "Allow license updates without auth" ON licenses;
        DROP TRIGGER IF EXISTS update_licenses_updated_at ON licenses;
    END IF;

    -- Remover políticas RLS de license_devices (se tabela existir)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'license_devices') THEN
        DROP POLICY IF EXISTS "Users can view devices of their licenses" ON license_devices;
        DROP POLICY IF EXISTS "Service role can manage all devices" ON license_devices;
        DROP POLICY IF EXISTS "Allow device activation without auth" ON license_devices;
        DROP POLICY IF EXISTS "Allow device updates without auth" ON license_devices;
    END IF;
END$$;

-- Remover função (se existir)
DROP FUNCTION IF EXISTS generate_license_key(TEXT, DATE, TEXT);

-- =====================================================
-- PARTE 2: CRIAÇÃO DE TIPOS E EXTENSÕES
-- =====================================================

-- 1. ENUM PARA TIPO DE LICENÇA
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'license_type') THEN
        CREATE TYPE license_type AS ENUM ('trial', 'pro', 'premium', 'enterprise');
    END IF;
END$$;

-- 2. ENUM PARA STATUS DE PAGAMENTO
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_mp') THEN
        CREATE TYPE payment_status_mp AS ENUM ('pending', 'approved', 'rejected', 'cancelled', 'refunded', 'charged_back');
    END IF;
END$$;

-- 3. HABILITAR EXTENSÃO PARA CRIPTOGRAFIA
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 4. FUNÇÃO PARA UPDATED_AT (se não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PARTE 3: CRIAÇÃO DE TABELAS
-- =====================================================

-- 1. TABELA DE PAGAMENTOS (Mercado Pago)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    preference_id TEXT UNIQUE, -- ID da preferência do Mercado Pago (pode ser NULL inicialmente)
    payment_id TEXT UNIQUE, -- ID do pagamento do Mercado Pago (quando aprovado)
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    license_type license_type NOT NULL DEFAULT 'pro',
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'BRL',
    status payment_status_mp NOT NULL DEFAULT 'pending',
    mercado_pago_data JSONB, -- Dados completos do Mercado Pago
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- 2. TABELA DE LICENÇAS
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_key TEXT UNIQUE NOT NULL, -- Chave única da licença
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    license_type license_type NOT NULL DEFAULT 'pro',
    max_devices INTEGER NOT NULL DEFAULT 1 CHECK (max_devices > 0),
    devices_in_use INTEGER NOT NULL DEFAULT 0 CHECK (devices_in_use >= 0),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    activated_at TIMESTAMPTZ
);

-- 3. TABELA DE DISPOSITIVOS (para controle de ativação)
CREATE TABLE IF NOT EXISTS license_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_id UUID REFERENCES licenses(id) ON DELETE CASCADE NOT NULL,
    device_id TEXT NOT NULL, -- ID único do dispositivo
    device_name TEXT,
    machine_name TEXT,
    os_version TEXT,
    processor_count INTEGER,
    activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(license_id, device_id)
);

-- =====================================================
-- PARTE 4: ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_payments_preference_id ON payments(preference_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(email);

CREATE INDEX IF NOT EXISTS idx_licenses_license_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_payment_id ON licenses(payment_id);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(email);
CREATE INDEX IF NOT EXISTS idx_licenses_is_active ON licenses(is_active);

CREATE INDEX IF NOT EXISTS idx_license_devices_license_id ON license_devices(license_id);
CREATE INDEX IF NOT EXISTS idx_license_devices_device_id ON license_devices(device_id);

-- =====================================================
-- PARTE 5: TRIGGERS
-- =====================================================

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licenses_updated_at
    BEFORE UPDATE ON licenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PARTE 6: FUNÇÃO PARA GERAR CHAVE DE LICENÇA
-- =====================================================

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
    
    -- Criar conteúdo da licença
    v_content := json_build_object(
        'id', p_client_id,
        'validUntil', p_valid_until::TEXT,
        'plan', p_plan
    )::TEXT;
    
    -- Gerar assinatura (usando SHA256 com chave secreta)
    v_signature := SUBSTRING(
        ENCODE(
            DIGEST(v_content || COALESCE(current_setting('app.license_secret', true), 'VOLTRIS_SECRET_KEY_2024'), 
            'sha256'), 
            'hex'
        ), 
        1, 
        16
    );
    
    -- Formatar chave final
    RETURN 'VOLTRIS-LIC-' || p_client_id || '-' || v_formatted_date || '-' || UPPER(v_signature);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PARTE 7: POLÍTICAS RLS PARA PAGAMENTOS
-- =====================================================

-- Habilitar RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir INSERT sem autenticação (para criar pagamento antes do checkout)
CREATE POLICY "Allow payment creation without auth"
    ON payments FOR INSERT
    WITH CHECK (true);

-- Política 2: Permitir UPDATE sem autenticação (para webhook do Mercado Pago)
CREATE POLICY "Allow payment updates without auth"
    ON payments FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Política 3: Permitir SELECT sem autenticação (para verificar status do pagamento)
CREATE POLICY "Allow payment lookup by preference or payment id"
    ON payments FOR SELECT
    USING (true);

-- Política 4: Service role pode gerenciar tudo (controle administrativo)
CREATE POLICY "Service role can manage all payments"
    ON payments FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Política 5: Usuários podem ver seus próprios pagamentos (se tiverem user_id)
CREATE POLICY "Users can view their own payments"
    ON payments FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

-- =====================================================
-- PARTE 8: POLÍTICAS RLS PARA LICENÇAS
-- =====================================================

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Política 1: Usuários podem ver suas próprias licenças
CREATE POLICY "Users can view their own licenses"
    ON licenses FOR SELECT
    USING (
        auth.uid() = user_id 
        OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
        OR user_id IS NULL
    );

-- Política 2: Permitir INSERT sem autenticação (para webhook criar licença)
CREATE POLICY "Allow license creation without auth"
    ON licenses FOR INSERT
    WITH CHECK (true);

-- Política 3: Permitir UPDATE sem autenticação (para atualizar status)
CREATE POLICY "Allow license updates without auth"
    ON licenses FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Política 4: Service role pode gerenciar tudo
CREATE POLICY "Service role can manage all licenses"
    ON licenses FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- PARTE 9: POLÍTICAS RLS PARA DISPOSITIVOS
-- =====================================================

ALTER TABLE license_devices ENABLE ROW LEVEL SECURITY;

-- Política 1: Usuários podem ver dispositivos de suas licenças
CREATE POLICY "Users can view devices of their licenses"
    ON license_devices FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM licenses 
            WHERE licenses.id = license_devices.license_id 
            AND (
                licenses.user_id = auth.uid() 
                OR licenses.email = (SELECT email FROM auth.users WHERE id = auth.uid())
                OR licenses.user_id IS NULL
            )
        )
    );

-- Política 2: Permitir INSERT sem autenticação (para ativar dispositivo)
CREATE POLICY "Allow device activation without auth"
    ON license_devices FOR INSERT
    WITH CHECK (true);

-- Política 3: Permitir UPDATE sem autenticação (para atualizar last_used_at)
CREATE POLICY "Allow device updates without auth"
    ON license_devices FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Política 4: Service role pode gerenciar tudo
CREATE POLICY "Service role can manage all devices"
    ON license_devices FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- PARTE 10: COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE payments IS 'Armazena pagamentos do Mercado Pago';
COMMENT ON TABLE licenses IS 'Armazena licenças geradas após pagamento aprovado';
COMMENT ON TABLE license_devices IS 'Controla dispositivos ativados por licença';

COMMENT ON COLUMN payments.preference_id IS 'ID da preferência do Mercado Pago (pode ser NULL inicialmente)';
COMMENT ON COLUMN payments.payment_id IS 'ID do pagamento do Mercado Pago (quando aprovado)';
COMMENT ON COLUMN payments.user_id IS 'ID do usuário (opcional, pode ser NULL para pagamentos sem login)';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

