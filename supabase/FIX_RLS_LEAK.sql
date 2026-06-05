-- ============================================================
-- VOLTRIS — SECURITY HARDENING: FIX RLS LEAKS
-- Este script corrige políticas que permitem acesso anônimo excessivo.
-- ============================================================

-- 1. TABELA: payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_all_payments" ON public.payments;
CREATE POLICY "service_all_payments" ON public.payments
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 2. TABELA: licenses
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_all_licenses" ON public.licenses;
CREATE POLICY "service_all_licenses" ON public.licenses
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. TABELA: subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access subscriptions" ON public.subscriptions;
CREATE POLICY "Service role full access subscriptions" ON public.subscriptions
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. TABELA: audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_all_audit_logs" ON public.audit_logs;
CREATE POLICY "service_all_audit_logs" ON public.audit_logs
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. TABELA: profiles (Garantindo que admins podem ver tudo, mas anônimos não)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
      (auth.jwt() ->> 'email') IN (SELECT email FROM public.profiles WHERE is_admin = true)
      OR auth.uid() = id
    );

-- Nota: Para o 'service_role' (usado nos Server Actions / API), o RLS é ignorado por padrão.
-- Estas políticas garantem que o 'anon' role não consiga ler dados via 'true' sem verificação.
