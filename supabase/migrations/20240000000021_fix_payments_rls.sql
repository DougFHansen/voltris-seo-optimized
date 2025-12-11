-- =====================================================
-- CORRIGIR POLÍTICAS RLS PARA PAGAMENTOS
-- =====================================================
-- Permite inserção de pagamentos sem autenticação
-- (necessário para criar pagamento antes do checkout)

-- Remover política antiga se existir
DROP POLICY IF EXISTS "Service role can manage all payments" ON payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;

-- Política para permitir INSERT sem autenticação (para criar pagamento antes do checkout)
CREATE POLICY "Allow payment creation without auth"
    ON payments FOR INSERT
    WITH CHECK (true); -- Permite qualquer inserção

-- Política para permitir UPDATE sem autenticação (para webhook do Mercado Pago)
CREATE POLICY "Allow payment updates without auth"
    ON payments FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Política para permitir SELECT por preference_id ou payment_id (para verificar status)
CREATE POLICY "Allow payment lookup by preference or payment id"
    ON payments FOR SELECT
    USING (true); -- Permite qualquer leitura (dados não sensíveis)

-- Política para service_role gerenciar tudo (mantém controle administrativo)
CREATE POLICY "Service role can manage all payments"
    ON payments FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Política para usuários verem seus próprios pagamentos (se tiverem user_id)
CREATE POLICY "Users can view their own payments"
    ON payments FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);






