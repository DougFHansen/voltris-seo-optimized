-- FUNÇÃO DE MOCK DE COMPRA (Simula o Webhook de Pagamento)
-- Aumenta as licenças e muda o plano, ignorando RLS travado
CREATE OR REPLACE FUNCTION mock_buy_licenses(p_company_id UUID, p_quantity INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_max INT;
BEGIN
  -- 1. Verificar se usuário é dono da empresa (Segurança básica)
  IF NOT EXISTS (
    SELECT 1 FROM public.company_users 
    WHERE company_id = p_company_id 
    AND user_id = auth.uid() 
    AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Apenas o dono da empresa pode comprar licenças.';
  END IF;

  -- 2. Atualizar Licenças
  UPDATE public.companies
  SET 
    max_devices = COALESCE(max_devices, 0) + p_quantity,
    plan_type = 'pro',
    updated_at = NOW()
  WHERE id = p_company_id
  RETURNING max_devices INTO v_new_max;

  -- 3. Retornar sucesso
  RETURN jsonb_build_object('success', true, 'new_limit', v_new_max);
END;
$$;
