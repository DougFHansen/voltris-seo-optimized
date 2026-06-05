-- CORREÇÃO DE PERMISSÕES (RLS POLICIES)
-- Rode este script no Supabase SQL Editor para corrigir o erro "violates row-level security policy"

-- 1. COMPANIES: Permitir criar e visualizar
DROP POLICY IF EXISTS "Users can create companies" ON public.companies;
CREATE POLICY "Users can create companies" 
ON public.companies FOR INSERT 
TO authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own companies" ON public.companies;
CREATE POLICY "Users can view their own companies" 
ON public.companies FOR SELECT 
TO authenticated 
USING (
  id IN (
    SELECT company_id FROM public.company_users 
    WHERE user_id = auth.uid()
  )
);

-- 2. COMPANY_USERS: Permitir auto-vinculação
DROP POLICY IF EXISTS "Users can join companies" ON public.company_users;
CREATE POLICY "Users can join companies" 
ON public.company_users FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their memberships" ON public.company_users;
CREATE POLICY "Users can view their memberships" 
ON public.company_users FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- 3. DEVICES: Visualizar e Editar (apenas da própria empresa)
DROP POLICY IF EXISTS "Users can view company devices" ON public.devices;
CREATE POLICY "Users can view company devices" 
ON public.devices FOR SELECT 
TO authenticated 
USING (
  company_id IN (
    SELECT company_id FROM public.company_users 
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update company devices" ON public.devices;
CREATE POLICY "Users can update company devices" 
ON public.devices FOR UPDATE
TO authenticated 
USING (
  company_id IN (
    SELECT company_id FROM public.company_users 
    WHERE user_id = auth.uid()
    AND role IN ('owner', 'admin')
  )
);

-- 4. COMMANDS: Enviar comandos
DROP POLICY IF EXISTS "Users can send commands" ON public.remote_commands;
CREATE POLICY "Users can send commands" 
ON public.remote_commands FOR INSERT 
TO authenticated 
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.company_users 
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can view commands" ON public.remote_commands;
CREATE POLICY "Users can view commands" 
ON public.remote_commands FOR SELECT 
TO authenticated 
USING (
  company_id IN (
    SELECT company_id FROM public.company_users 
    WHERE user_id = auth.uid()
  )
);

-- 5. ALERTS: Visualizar
DROP POLICY IF EXISTS "Users can view company alerts" ON public.device_alerts;
CREATE POLICY "Users can view company alerts" 
ON public.device_alerts FOR SELECT 
TO authenticated 
USING (
  company_id IN (
    SELECT company_id FROM public.company_users 
    WHERE user_id = auth.uid()
  )
);
