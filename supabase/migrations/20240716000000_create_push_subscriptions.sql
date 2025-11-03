-- Migration: Sistema de Inscrições Push PWA VOLTRIS
-- Data: 2024-07-16
-- Descrição: Sistema profissional para gerenciar notificações push por navegador/dispositivo

-- 1. Tabela push_subscriptions para gerenciar inscrições push
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Dados da inscrição push
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    
    -- Identificação do navegador/dispositivo
    user_agent TEXT,
    browser_fingerprint TEXT, -- Hash único do navegador
    device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
    platform TEXT, -- Windows, macOS, Linux, Android, iOS
    
    -- Status e controle
    is_active BOOLEAN DEFAULT true,
    last_used TIMESTAMPTZ DEFAULT timezone('utc', now()),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON public.push_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_browser_fingerprint ON public.push_subscriptions(browser_fingerprint);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_is_active ON public.push_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_last_used ON public.push_subscriptions(last_used);

-- Índice único para evitar duplicatas por usuário/navegador
CREATE UNIQUE INDEX IF NOT EXISTS idx_push_subscriptions_user_browser ON public.push_subscriptions(user_id, browser_fingerprint);

-- RLS (Row Level Security)
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can view their own push subscriptions"
    ON public.push_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can insert their own push subscriptions"
    ON public.push_subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can update their own push subscriptions"
    ON public.push_subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can delete their own push subscriptions"
    ON public.push_subscriptions FOR DELETE
    USING (auth.uid() = user_id);

-- Admin policies
DROP POLICY IF EXISTS "Admin can view all push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Admin can view all push subscriptions"
    ON public.push_subscriptions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- 2. Função para gerar fingerprint do navegador
CREATE OR REPLACE FUNCTION generate_browser_fingerprint(
    p_user_agent TEXT,
    p_platform TEXT,
    p_device_type TEXT
) RETURNS TEXT AS $$
BEGIN
    -- Gerar hash único baseado nas características do navegador
    RETURN encode(
        sha256(
            (p_user_agent || '|' || p_platform || '|' || p_device_type)::bytea
        ),
        'hex'
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Função para atualizar timestamp de atualização
CREATE OR REPLACE FUNCTION update_push_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    NEW.last_used = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamps
DROP TRIGGER IF EXISTS trigger_update_push_subscription_updated_at ON public.push_subscriptions;
CREATE TRIGGER trigger_update_push_subscription_updated_at
    BEFORE UPDATE ON public.push_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_push_subscription_updated_at();

-- 4. Função para limpar inscrições inativas antigas (manutenção)
CREATE OR REPLACE FUNCTION cleanup_inactive_push_subscriptions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Remover inscrições inativas com mais de 30 dias
    DELETE FROM public.push_subscriptions 
    WHERE is_active = false 
    AND updated_at < timezone('utc', now()) - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 5. Comentários para documentação
COMMENT ON TABLE public.push_subscriptions IS 'Sistema profissional de inscrições push PWA para VOLTRIS';
COMMENT ON COLUMN public.push_subscriptions.browser_fingerprint IS 'Hash único do navegador para evitar duplicatas';
COMMENT ON COLUMN public.push_subscriptions.device_type IS 'Tipo de dispositivo: desktop, mobile, tablet';
COMMENT ON COLUMN public.push_subscriptions.platform IS 'Sistema operacional do dispositivo';
COMMENT ON COLUMN public.push_subscriptions.is_active IS 'Status da inscrição (ativa/inativa)';
COMMENT ON COLUMN public.push_subscriptions.last_used IS 'Última vez que a inscrição foi utilizada';

-- 6. Inserir dados de exemplo (opcional - para desenvolvimento)
-- INSERT INTO public.push_subscriptions (user_id, endpoint, p256dh, auth, user_agent, browser_fingerprint, device_type, platform)
-- VALUES (
--     '00000000-0000-0000-0000-000000000000', -- Substituir por ID real
--     'https://fcm.googleapis.com/fcm/send/example',
--     'example_p256dh_key',
--     'example_auth_key',
--     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
--     'example_fingerprint_hash',
--     'desktop',
--     'Windows'
-- );
