-- =====================================================
-- PADRONIZAÇÃO DE PLANOS - VOLTRIS OPTIMIZER
-- Define planos corretos conforme requisito do usuário
-- =====================================================

-- Criar tabela de configuração de planos (se não existir)
CREATE TABLE IF NOT EXISTS license_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code license_type NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    price_monthly NUMERIC(10,2),
    price_display TEXT NOT NULL,
    max_devices INTEGER NOT NULL DEFAULT 1,
    duration_months INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    features JSONB,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Limpar dados existentes
TRUNCATE TABLE license_plans;

-- Inserir planos corretos
INSERT INTO license_plans (code, name, description, price_monthly, price_display, max_devices, duration_months, features, display_order) VALUES
(
    'trial',
    'Trial',
    'Período de teste gratuito por 7 dias',
    0.00,
    'Grátis por 7 dias',
    1,
    0, -- Trial não tem duração fixa em meses
    '["Todas as funcionalidades básicas", "1 dispositivo", "7 dias de teste", "Suporte por email"]'::jsonb,
    0
),
(
    'pro',
    'Pro',
    'Plano mensal ideal para uso pessoal',
    49.90,
    'R$ 49,90/mês',
    1,
    1,
    '["Todas as funcionalidades", "1 dispositivo", "Renovação mensal", "Suporte prioritário", "Modo Gamer avançado", "Otimizações de rede"]'::jsonb,
    1
),
(
    'premium',
    'Premium',
    'Plano trimestral para múltiplos dispositivos',
    99.90,
    'R$ 99,90 a cada 3 meses',
    3,
    3,
    '["Todas as funcionalidades", "3 dispositivos", "Renovação a cada 3 meses", "Suporte prioritário", "Modo Gamer avançado", "Otimizações de rede", "Perfis automáticos por jogo"]'::jsonb,
    2
),
(
    'enterprise',
    'Enterprise',
    'Plano semestral para uso ilimitado',
    149.90,
    'R$ 149,90 a cada 6 meses',
    9999, -- Ilimitado
    6,
    '["Todas as funcionalidades", "Dispositivos ilimitados", "Renovação a cada 6 meses", "Suporte 24/7", "Todas as otimizações", "API de integração", "Painel de administração", "Implantação em lote"]'::jsonb,
    3
);

-- Criar função helper para obter configuração de plano
CREATE OR REPLACE FUNCTION get_plan_config(p_plan_code license_type)
RETURNS TABLE (
    code license_type,
    name TEXT,
    description TEXT,
    price NUMERIC(10,2),
    price_display TEXT,
    max_devices INTEGER,
    duration_months INTEGER,
    features JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lp.code,
        lp.name,
        lp.description,
        lp.price_monthly,
        lp.price_display,
        lp.max_devices,
        lp.duration_months,
        lp.features
    FROM license_plans lp
    WHERE lp.code = p_plan_code AND lp.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Criar função para calcular data de expiração baseada no plano
CREATE OR REPLACE FUNCTION calculate_expiry_date(
    p_plan_code license_type,
    p_start_date TIMESTAMPTZ DEFAULT NOW()
) RETURNS TIMESTAMPTZ AS $$
DECLARE
    v_months INTEGER;
    v_days INTEGER;
BEGIN
    -- Trial: 7 dias
    IF p_plan_code = 'trial' THEN
        RETURN p_start_date + INTERVAL '7 days';
    END IF;
    
    -- Obter duração em meses do plano
    SELECT duration_months INTO v_months
    FROM license_plans
    WHERE code = p_plan_code AND is_active = true;
    
    -- Se não encontrou, usar 1 mês como padrão
    IF v_months IS NULL THEN
        v_months := 1;
    END IF;
    
    -- Adicionar meses à data de início
    RETURN p_start_date + (v_months || ' months')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Adicionar índice
CREATE INDEX IF NOT EXISTS idx_license_plans_code ON license_plans(code);
CREATE INDEX IF NOT EXISTS idx_license_plans_is_active ON license_plans(is_active);

-- Comentários
COMMENT ON TABLE license_plans IS 'Configuração centralizada dos planos de licença do Voltris Optimizer';
COMMENT ON FUNCTION get_plan_config(license_type) IS 'Retorna configuração completa de um plano';
COMMENT ON FUNCTION calculate_expiry_date(license_type, TIMESTAMPTZ) IS 'Calcula data de expiração baseada no plano e data de início';
