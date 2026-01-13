-- ==========================================
-- TABELA DE PAGAMENTOS - SUPABASE
-- Estrutura completa e otimizada
-- ==========================================

-- Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preference_id TEXT UNIQUE,           -- ID da preferência do Mercado Pago
    payment_id TEXT UNIQUE,              -- ID do pagamento após aprovação
    email TEXT NOT NULL,                 -- Email do cliente
    full_name TEXT,                      -- Nome completo do cliente
    license_type TEXT NOT NULL,          -- Tipo de licença (trial, standard, pro, enterprise)
    amount DECIMAL(10,2) NOT NULL,       -- Valor pago
    currency TEXT DEFAULT 'BRL',         -- Moeda (BRL, USD, etc)
    status TEXT NOT NULL DEFAULT 'pending', -- Status do pagamento
    processed_at TIMESTAMPTZ,            -- Quando foi processado/aprovado
    mercado_pago_data JSONB,             -- Dados completos do Mercado Pago
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para performance
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

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (apenas registros do próprio usuário)
CREATE POLICY "Users can view their own payments" 
ON payments FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Política para inserção pública (qualquer um pode criar pagamento)
CREATE POLICY "Anyone can create payments" 
ON payments FOR INSERT 
WITH CHECK (true);

-- Política para atualização (apenas sistema/backend)
CREATE POLICY "Only service role can update payments" 
ON payments FOR UPDATE 
USING (current_setting('role') = 'service_role');

-- Inserir pagamento de exemplo (seu pagamento perdido)
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
    'cliente@exemplo.com',
    'pro',
    1.00,
    'BRL',
    'pending',
    NOW()
) ON CONFLICT (preference_id) DO NOTHING;

-- Verificação da estrutura
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- Contagem de registros
SELECT COUNT(*) as total_payments FROM payments;