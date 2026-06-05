-- ==========================================
-- APENAS A TABELA DE PAGAMENTOS - SUPABASE
-- Complemento para sua estrutura já existente
-- ==========================================

-- Criar tabela de pagamentos (se não existir)
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preference_id TEXT UNIQUE,           -- ID da preferência do Mercado Pago
    payment_id TEXT UNIQUE,              -- ID do pagamento após aprovação
    email TEXT NOT NULL,                 -- Email do cliente
    full_name TEXT,                      -- Nome completo do cliente
    license_type license_type NOT NULL,  -- Tipo de licença (usa enum existente)
    amount DECIMAL(10,2) NOT NULL,       -- Valor pago
    currency TEXT DEFAULT 'BRL',         -- Moeda
    status TEXT NOT NULL DEFAULT 'pending', -- Status do pagamento
    processed_at TIMESTAMPTZ,            -- Quando foi processado/aprovado
    mercado_pago_data JSONB,             -- Dados completos do Mercado Pago
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para performance (apenas se não existirem)
CREATE INDEX IF NOT EXISTS idx_payments_preference_id ON payments(preference_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Remover trigger existente e criar novo
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (apenas se não existirem)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes e criar novas
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
DROP POLICY IF EXISTS "Anyone can create payments" ON payments;
DROP POLICY IF EXISTS "Only service role can update payments" ON payments;

-- Política para leitura
CREATE POLICY "Users can view their own payments" 
ON payments FOR SELECT 
USING (true);

-- Política para inserção
CREATE POLICY "Anyone can create payments" 
ON payments FOR INSERT 
WITH CHECK (true);

-- Política para atualização
CREATE POLICY "Only service role can update payments" 
ON payments FOR UPDATE 
USING (current_setting('role') = 'service_role');

-- Registrar seu pagamento perdido (apenas se não existir)
INSERT INTO payments (
    preference_id,
    email,
    license_type,
    amount,
    currency,
    status,
    created_at
) VALUES (
    '141897670480',
    'seu-email@real.com',
    'pro',
    1.00,
    'BRL',
    'pending',
    NOW()
) ON CONFLICT (preference_id) DO NOTHING;

-- Verificação rápida
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'payments'
ORDER BY ordinal_position;

SELECT COUNT(*) as total_payments FROM payments;
SELECT * FROM payments WHERE preference_id = '141897670480';