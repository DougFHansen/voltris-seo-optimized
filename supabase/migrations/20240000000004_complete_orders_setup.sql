-- Script completo para configurar o sistema de pedidos
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Atualizar a tabela orders para incluir informações detalhadas dos serviços
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS service_name TEXT,
ADD COLUMN IF NOT EXISTS service_description TEXT,
ADD COLUMN IF NOT EXISTS plan_type TEXT CHECK (plan_type IN ('basico', 'profissional', 'empresarial', 'gamer', 'corporativa', 'Formatação Básica', 'Formatação Média', 'Formatação Avançada', 'Formatação Corporativa', 'Otimização Básica', 'Otimização Média', 'Otimização Avançada', 'Otimização Premium', 'Office 365', 'Office 2021', 'Office 2019', 'Office Empresarial')),
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Criar índices para melhorar performance de busca por serviço
CREATE INDEX IF NOT EXISTS idx_orders_service_id ON orders(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_service_name ON orders(service_name);
CREATE INDEX IF NOT EXISTS idx_orders_plan_type ON orders(plan_type);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 3. Atualizar políticas RLS para incluir os novos campos
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
CREATE POLICY "Users can insert their own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
CREATE POLICY "Users can update their own orders"
    ON orders FOR UPDATE
    USING (auth.uid() = user_id);

-- 4. Função para atualizar automaticamente o updated_at
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_orders_updated_at_trigger ON orders;
CREATE TRIGGER update_orders_updated_at_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_orders_updated_at();

-- 6. Função para buscar pedidos com detalhes dos serviços
CREATE OR REPLACE FUNCTION get_user_orders_with_details(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    service_id TEXT,
    service_name TEXT,
    service_description TEXT,
    plan_type TEXT,
    final_price NUMERIC,
    payment_method TEXT,
    status TEXT,
    payment_status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.user_id,
        o.service_id,
        o.service_name,
        o.service_description,
        o.plan_type,
        o.final_price,
        o.payment_method,
        o.status,
        o.payment_status,
        o.notes,
        o.created_at,
        o.updated_at
    FROM orders o
    WHERE o.user_id = user_uuid
    ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Política para permitir acesso à função
GRANT EXECUTE ON FUNCTION get_user_orders_with_details(UUID) TO authenticated;

-- 8. Verificar se a tabela services existe e criar se necessário
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    duration INTEGER NOT NULL CHECK (duration > 0),
    status service_status NOT NULL DEFAULT 'active',
    cover_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Inserir serviços padrão se a tabela estiver vazia
INSERT INTO public.services (name, description, price, duration, status) VALUES
('Criação de Site Básico', 'Site institucional com até 5 páginas, design responsivo e SEO básico', 997.00, 480, 'active'),
('Criação de Site Profissional', 'Site completo com até 10 páginas, blog integrado e SEO avançado', 1997.00, 720, 'active'),
('Criação de Site Empresarial', 'Site corporativo com e-commerce, painel administrativo e suporte premium', 3997.00, 1440, 'active'),
('Suporte Windows Básico', 'Suporte remoto em horário comercial para usuários domésticos', 349.90, 120, 'active'),
('Suporte Windows Business', 'Suporte prioritário para profissionais liberais e pequenas empresas', 549.90, 120, 'active'),
('Suporte Windows Enterprise', 'Solução completa para empresas e equipes maiores', 1259.90, 120, 'active'),
('Instalação de Programas Comuns', 'Instalação remota de programas essenciais para seu computador', 29.90, 60, 'active'),
('Formatação Básica', 'Backup, formatação, instalação de drivers e atualizações', 99.90, 180, 'active'),
('Formatação Média', 'Inclui "Básica" + antivírus e otimização básica', 149.90, 240, 'active'),
('Formatação Avançada', 'Inclui "Média" + otimização média de desempenho', 199.90, 300, 'active'),
('Formatação Corporativa', 'Inclui "Avançada" + Pacote Office e otimização avançada', 349.90, 360, 'active'),
('Formatação Gamer', 'Inclui "Avançada" + otimização extrema para jogos', 449.90, 420, 'active'),
('Otimização Básica', 'Limpeza e ajustes simples para melhorar performance', 79.90, 90, 'active'),
('Otimização Média', 'Limpeza + otimização de performance', 129.90, 120, 'active'),
('Otimização Avançada', 'Limpeza completa + performance máxima', 199.90, 150, 'active'),
('Correção de Erros no Windows', 'Solução remota de problemas e erros no seu sistema Windows', 49.90, 60, 'active'),
('Recuperação de Dados', 'Recuperação remota de dados e arquivos importantes do seu computador', 99.90, 120, 'active'),
('Instalação de Impressora', 'Instalação remota de drivers e configuração de impressoras', 49.90, 60, 'active'),
('Remoção de Vírus', 'Remoção remota de vírus e proteção do seu computador', 39.90, 90, 'active')
ON CONFLICT DO NOTHING;

-- 10. Habilitar RLS na tabela services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 11. Criar políticas para services
CREATE POLICY "Services are viewable by everyone"
    ON public.services FOR SELECT
    USING (status = 'active');

-- 12. Mensagem de confirmação
DO $$
BEGIN
    RAISE NOTICE 'Sistema de pedidos configurado com sucesso!';
    RAISE NOTICE 'Tabela orders atualizada com novos campos';
    RAISE NOTICE 'Índices criados para melhor performance';
    RAISE NOTICE 'Políticas RLS configuradas';
    RAISE NOTICE 'Função get_user_orders_with_details criada';
    RAISE NOTICE 'Serviços padrão inseridos';
END $$; 