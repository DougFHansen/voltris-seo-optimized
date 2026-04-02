-- ============================================================
-- VOLTRIS — SECURITY BUGFIX: FIX INFINITE RLS RECURSION
-- Resolve o erro "infinite recursion detected in policy for relation profiles"
-- ============================================================

-- 1. Excluir a política defeituosa que causa o loop infinito
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 2. Garantir que todo usuário logado consiga pelo menos ver o seu PRÓPRIO perfil
-- (Criamos caso não exista ou sobreescrevemos a existente de forma segura)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT 
    TO authenticated 
    USING ( auth.uid() = id );

-- 3. Criar uma função ignorando RLS (SECURITY DEFINER) para verificar a flag de admin.
-- Isso é fundamental porque evita que a checagem de Admin dispare o RLS da tabela denovo.
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT is_admin FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 4. Criar a política de administradores utilizando a nova função segura
CREATE POLICY "Admins view all profiles securely" ON public.profiles
    FOR SELECT 
    TO authenticated 
    USING ( public.check_is_admin() );
