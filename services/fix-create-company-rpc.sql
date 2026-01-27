-- SOLUÇÃO DEFINITIVA PARA CRIAÇÃO DE EMPRESAS
-- O RLS é muito restritivo para criar registros interligados. 
-- Esta função roda como "Security Definer" (superusuário), ignorando as travas apenas para esta ação específica.

CREATE OR REPLACE FUNCTION create_new_organization(org_name TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- IMPORTANTE: Roda com permissões elevadas
AS $$
DECLARE
  new_company_id UUID;
  current_user_id UUID;
BEGIN
  -- 1. Verificar autenticação
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Você precisa estar logado.';
  END IF;

  -- 2. Inserir a Empresa
  INSERT INTO public.companies (name, plan_type, max_devices)
  VALUES (org_name, 'trial', 5)
  RETURNING id INTO new_company_id;

  -- 3. Inserir o Vínculo (Owner)
  INSERT INTO public.company_users (company_id, user_id, role)
  VALUES (new_company_id, current_user_id, 'owner');

  -- 4. Retornar dados
  RETURN jsonb_build_object('id', new_company_id, 'name', org_name);
END;
$$;
