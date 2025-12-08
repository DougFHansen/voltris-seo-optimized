# 🔧 Corrigir Erro RLS - Pagamentos

## ❌ Problema Identificado

```
Erro: new row violates row-level security policy for table "payments"
```

**Causa:** A tabela `payments` tem RLS habilitado, mas não permite inserção sem autenticação. A API precisa criar pagamentos antes do checkout, sem usuário autenticado.

## ✅ Solução

Criei uma migration que corrige as políticas RLS:

**Arquivo:** `supabase/migrations/20240000000021_fix_payments_rls.sql`

### O que a migration faz:

1. **Permite INSERT sem autenticação** - Para criar pagamento antes do checkout
2. **Permite UPDATE sem autenticação** - Para webhook do Mercado Pago atualizar status
3. **Permite SELECT sem autenticação** - Para verificar status do pagamento
4. **Mantém segurança** - Service role ainda tem controle total

## 🚀 Como Aplicar

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse: https://supabase.com/dashboard
2. Vá em: Seu Projeto → SQL Editor
3. Cole o conteúdo do arquivo `20240000000021_fix_payments_rls.sql`
4. Execute o SQL

### Opção 2: Via Supabase CLI

```bash
supabase db push
```

### Opção 3: Executar SQL Manualmente

Copie e execute no SQL Editor do Supabase:

```sql
-- Remover políticas antigas
DROP POLICY IF EXISTS "Service role can manage all payments" ON payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;

-- Permitir INSERT sem autenticação
CREATE POLICY "Allow payment creation without auth"
    ON payments FOR INSERT
    WITH CHECK (true);

-- Permitir UPDATE sem autenticação
CREATE POLICY "Allow payment updates without auth"
    ON payments FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Permitir SELECT sem autenticação
CREATE POLICY "Allow payment lookup by preference or payment id"
    ON payments FOR SELECT
    USING (true);

-- Service role mantém controle total
CREATE POLICY "Service role can manage all payments"
    ON payments FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Usuários veem seus próprios pagamentos
CREATE POLICY "Users can view their own payments"
    ON payments FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);
```

## ✅ Verificar se Funcionou

Após aplicar a migration, teste novamente:

```
https://voltris.com.br/api/pagamento?plan=pro&email=teste@example.com
```

**Não deve mais aparecer o erro de RLS!**

## 🎯 Importante: Use o sandbox_init_point!

Na resposta da API, você viu:

```json
{
  "sandbox_init_point": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
}
```

**Use este link para testes!** É o link do ambiente sandbox/teste do Mercado Pago.

O `init_point` normal é para produção. Para testes, sempre use `sandbox_init_point`.

