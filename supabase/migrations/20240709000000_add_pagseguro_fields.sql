-- Migração para adicionar campos do PagSeguro na tabela orders
-- Execute esta migração no painel do Supabase: SQL Editor

-- Adicionar campos do PagSeguro
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS pagseguro_code VARCHAR(100),
ADD COLUMN IF NOT EXISTS pagseguro_status INTEGER,
ADD COLUMN IF NOT EXISTS pagseguro_gross_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS pagseguro_net_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS pagseguro_transaction_date TIMESTAMP WITH TIME ZONE;

-- Criar índice para busca por código PagSeguro
CREATE INDEX IF NOT EXISTS idx_orders_pagseguro_code ON orders(pagseguro_code);

-- Criar índice para busca por status de pagamento
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Adicionar comentários das colunas
COMMENT ON COLUMN orders.payment_status IS 'Status do pagamento: pending, approved, cancelled, refunded, processing, disputed, returned';
COMMENT ON COLUMN orders.pagseguro_code IS 'Código da transação no PagSeguro';
COMMENT ON COLUMN orders.pagseguro_status IS 'Código numérico do status no PagSeguro';
COMMENT ON COLUMN orders.pagseguro_gross_amount IS 'Valor bruto da transação no PagSeguro';
COMMENT ON COLUMN orders.pagseguro_net_amount IS 'Valor líquido da transação no PagSeguro';
COMMENT ON COLUMN orders.pagseguro_transaction_date IS 'Data da transação no PagSeguro';

-- Verificar se a migração foi aplicada
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('payment_status', 'pagseguro_code', 'pagseguro_status', 'pagseguro_gross_amount', 'pagseguro_net_amount', 'pagseguro_transaction_date')
ORDER BY column_name; 