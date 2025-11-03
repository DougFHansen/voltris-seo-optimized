-- =====================================================
-- SISTEMA COMPLETO DE SERVIÇOS E PEDIDOS - VOLTRIS
-- =====================================================

-- 1. ENUM PARA STATUS DO SERVIÇO
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_status') THEN
        CREATE TYPE service_status AS ENUM ('active', 'inactive', 'maintenance');
    END IF;
END$$;

-- 2. TABELA DE SERVIÇOS (SEU CÓDIGO ATUAL)
DROP TABLE IF EXISTS services CASCADE;
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    duration INTEGER NOT NULL CHECK (duration > 0), -- duração em minutos
    status service_status NOT NULL DEFAULT 'active',
    cover_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TRIGGER PARA UPDATED_AT (SEU CÓDIGO ATUAL)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. POPULANDO TODOS OS SERVIÇOS (SEU CÓDIGO ATUAL)
INSERT INTO services (name, description, price, duration, status) VALUES
('Formatação Básica', 'Backup, formatação, instalação de drivers e atualizações.', 99.90, 60, 'active'),
('Formatação Média', 'Inclui "Básica" + antivírus e otimização básica.', 149.90, 90, 'active'),
('Formatação Avançada', 'Inclui "Média" + otimização média de desempenho.', 199.90, 120, 'active'),
('Formatação Corporativa', 'Inclui "Avançada" + Pacote Office (permanente*) e otimização avançada.', 349.90, 180, 'active'),
('Formatação Gamer', 'Inclui "Avançada" + Pacote Office (opcional) e otimização extrema para jogos.', 449.90, 180, 'active'),
('Otimização Básica', 'Drivers, atualizações, correção de erros e otimização básica.', 79.90, 60, 'active'),
('Otimização Média', 'Inclui "Básica" + otimização média de performance.', 99.90, 90, 'active'),
('Otimização Avançada', 'Inclui "Média" + otimização avançada de performance.', 149.90, 120, 'active'),
('Correção de Erros no Windows', 'Solução remota de problemas e erros no seu sistema Windows.', 49.90, 60, 'active'),
('Instalação de Impressora', 'Instalação simples, driver e teste de impressão local.', 49.90, 60, 'active'),
('Remoção de Vírus', 'Varredura e remoção de vírus simples, malware e spyware.', 39.90, 60, 'active'),
('Recuperação Básica', 'Recuperação de arquivos deletados/corrompidos.', 100.00, 90, 'active'),
('Recuperação Média', 'Casos complexos, ferramentas especializadas.', 150.00, 120, 'active'),
('Recuperação Avançada', 'Discos com falhas graves, clonagem, tratamento de bad blocks.', 200.00, 180, 'active'),
('Instalação de Programas', 'Instalação e configuração de programas no Windows.', 49.00, 60, 'active'),
('Criação de Site Básico', 'Site institucional com até 5 páginas, design responsivo e SEO básico.', 997.00, 480, 'active'),
('Criação de Site Profissional', 'Site completo com até 10 páginas, blog integrado e SEO avançado.', 1997.00, 720, 'active'),
('Criação de Site Empresarial', 'Site corporativo com e-commerce, painel administrativo e suporte premium.', 3997.00, 1440, 'active');

-- 5. ADICIONAR SERVIÇOS QUE FALTAM (SUPORTE WINDOWS)
INSERT INTO services (name, description, price, duration, status) VALUES
('Suporte Windows Básico', 'Suporte remoto em horário comercial (9h às 18h), otimização mensal, remoção de vírus, backup básico, atendimento em até 24h, suporte para até 3 computadores.', 349.90, 120, 'active'),
('Suporte Windows Business', 'Suporte remoto prioritário (8h às 20h), otimização quinzenal, proteção avançada, backup em nuvem 100GB, atendimento em até 4h, suporte para até 6 computadores.', 549.90, 120, 'active'),
('Suporte Windows Enterprise', 'Suporte remoto e presencial 24/7, otimização semanal, proteção em tempo real, backup ilimitado, atendimento em até 1h, suporte ilimitado.', 1259.90, 120, 'active')
ON CONFLICT (name) DO NOTHING;

-- 6. ATUALIZAR TABELA ORDERS (ADICIONAR CAMPOS NECESSÁRIOS)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS service_name TEXT,
ADD COLUMN IF NOT EXISTS service_description TEXT,
ADD COLUMN IF NOT EXISTS plan_type TEXT CHECK (plan_type IN ('basico', 'profissional', 'empresarial', 'gamer', 'corporativa')),
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 7. CRIAR ÍNDICES PARA MELHOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_service_id ON orders(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_service_name ON orders(service_name);
CREATE INDEX IF NOT EXISTS idx_orders_plan_type ON orders(plan_type);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- 8. ATUALIZAR POLÍTICAS RLS PARA ORDERS
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

-- 9. HABILITAR RLS NAS TABELAS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 10. CRIAR POLÍTICAS PARA SERVICES
CREATE POLICY "Services are viewable by everyone"
    ON public.services FOR SELECT
    USING (status = 'active');

-- 11. FUNÇÃO PARA ATUALIZAR ORDERS UPDATED_AT
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. TRIGGER PARA ORDERS UPDATED_AT
DROP TRIGGER IF EXISTS update_orders_updated_at_trigger ON orders;
CREATE TRIGGER update_orders_updated_at_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_orders_updated_at();

-- 13. FUNÇÃO PARA BUSCAR PEDIDOS COM DETALHES
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

-- 14. CONCEDER PERMISSÕES PARA A FUNÇÃO
GRANT EXECUTE ON FUNCTION get_user_orders_with_details(UUID) TO authenticated;

-- 15. FUNÇÃO PARA CRIAR PEDIDO AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION create_order_from_service(
    p_user_id UUID,
    p_service_id TEXT,
    p_service_name TEXT DEFAULT NULL,
    p_service_description TEXT DEFAULT NULL,
    p_plan_type TEXT DEFAULT NULL,
    p_final_price NUMERIC DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_payment_method TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
    v_service services%ROWTYPE;
BEGIN
    -- Buscar informações do serviço
    SELECT * INTO v_service FROM services WHERE id::TEXT = p_service_id OR name = p_service_id LIMIT 1;
    
    -- Se não encontrou o serviço, usar valores padrão
    IF v_service.id IS NULL THEN
        v_service.name := COALESCE(p_service_name, 'Serviço Personalizado');
        v_service.description := COALESCE(p_service_description, 'Serviço solicitado pelo cliente');
        v_service.price := COALESCE(p_final_price, 0);
    END IF;
    
    -- Criar o pedido
    INSERT INTO orders (
        user_id,
        service_id,
        service_name,
        service_description,
        plan_type,
        final_price,
        notes,
        payment_method,
        status,
        payment_status
    ) VALUES (
        p_user_id,
        COALESCE(p_service_id, v_service.id::TEXT),
        COALESCE(p_service_name, v_service.name),
        COALESCE(p_service_description, v_service.description),
        p_plan_type,
        COALESCE(p_final_price, v_service.price),
        p_notes,
        p_payment_method,
        'pending',
        'pending'
    ) RETURNING id INTO v_order_id;
    
    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. CONCEDER PERMISSÕES PARA A FUNÇÃO
GRANT EXECUTE ON FUNCTION create_order_from_service(UUID, TEXT, TEXT, TEXT, TEXT, NUMERIC, TEXT, TEXT) TO authenticated;

-- 17. MENSAGEM DE CONFIRMAÇÃO
DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'SISTEMA COMPLETO DE SERVIÇOS E PEDIDOS CONFIGURADO!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE '✅ Tabela services criada com % serviços', (SELECT COUNT(*) FROM services);
    RAISE NOTICE '✅ Tabela orders atualizada com novos campos';
    RAISE NOTICE '✅ Índices criados para melhor performance';
    RAISE NOTICE '✅ Políticas RLS configuradas';
    RAISE NOTICE '✅ Funções auxiliares criadas';
    RAISE NOTICE '✅ Sistema pronto para uso!';
    RAISE NOTICE '=====================================================';
END $$; 