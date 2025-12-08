# 🧪 Como Testar o Checkout - Guia Completo

## 📋 Pré-requisitos

1. **Token do Mercado Pago configurado no Vercel:**
   - Acesse: https://vercel.com/dashboard
   - Vá em: Seu Projeto → Settings → Environment Variables
   - Adicione: `MP_ACCESS_TOKEN` = `APP_USR-1779915323498167-120406-7bd7b57f348d130c62a7f57975217fef-3039297620`
   - Adicione: `NEXT_PUBLIC_SITE_URL` = `https://voltris.com.br` (ou sua URL do Vercel)

2. **Banco de dados Supabase configurado:**
   - Certifique-se de que as migrations foram executadas
   - Tabelas `payments` e `licenses` devem existir

---

## 🚀 Método 1: Teste Direto pela API (Recomendado)

### Passo 1: Criar Preferência de Pagamento

Abra o navegador ou use o Postman/Insomnia e acesse:

```
GET https://voltris.com.br/api/pagamento?plan=pro&email=teste@example.com
```

**Parâmetros:**
- `plan`: `trial`, `pro` ou `premium` (padrão: `pro`)
- `email`: Email do comprador (opcional)

**Resposta esperada:**
```json
{
  "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
  "preference_id": "123456789-abc-def-ghi",
  "payment_id": "uuid-do-pagamento"
}
```

### Passo 2: Acessar o Link de Pagamento

Copie o `init_point` da resposta e abra no navegador. Você será redirecionado para o Mercado Pago.

### Passo 3: Testar Pagamento no Mercado Pago

**Para TESTE (Sandbox):**
- Use cartões de teste do Mercado Pago
- Cartão aprovado: `5031 4332 1540 6351` (CVV: 123)
- Nome: Qualquer nome
- Vencimento: Qualquer data futura
- CPF: Qualquer CPF válido

**Para PRODUÇÃO:**
- Use um cartão real (valor será cobrado de verdade)

### Passo 4: Verificar Webhook

Após o pagamento, o Mercado Pago enviará uma notificação para:
```
POST https://voltris.com.br/api/webhook/mercadopago
```

**Verificar logs no Vercel:**
- Acesse: Vercel Dashboard → Seu Projeto → Deployments → Logs
- Procure por: `[Webhook MP]` nos logs

### Passo 5: Verificar Licença Gerada

Após o pagamento aprovado, acesse:
```
GET https://voltris.com.br/api/license/get?preference_id=SEU_PREFERENCE_ID
```

Ou pela página de sucesso:
```
https://voltris.com.br/sucesso?preference_id=SEU_PREFERENCE_ID
```

---

## 🎨 Método 2: Teste pela Página de Teste

Acesse a página de teste que criamos:
```
https://voltris.com.br/teste-checkout
```

Esta página permite:
- Selecionar o plano (trial, pro, premium)
- Inserir email
- Gerar link de pagamento
- Ver status do pagamento
- Ver licença gerada

---

## 🔍 Verificações Importantes

### 1. Verificar Variáveis de Ambiente no Vercel

```bash
# No Vercel Dashboard → Settings → Environment Variables
MP_ACCESS_TOKEN=APP_USR-1779915323498167-120406-7bd7b57f348d130c62a7f57975217fef-3039297620
NEXT_PUBLIC_SITE_URL=https://voltris.com.br
```

### 2. Verificar Banco de Dados Supabase

Execute no Supabase SQL Editor:
```sql
-- Ver pagamentos
SELECT * FROM payments ORDER BY created_at DESC LIMIT 10;

-- Ver licenças
SELECT * FROM licenses ORDER BY created_at DESC LIMIT 10;

-- Verificar função de geração de licença
SELECT generate_license_key('TEST123', '2025-12-31', 'pro');
```

### 3. Verificar Webhook no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em: Sua Aplicação → Webhooks
3. Configure: `https://voltris.com.br/api/webhook/mercadopago`
4. Eventos: `payment`

---

## 🐛 Troubleshooting

### Erro: "MP_ACCESS_TOKEN not configured"
**Solução:** Configure a variável de ambiente no Vercel e faça um novo deploy.

### Erro: "Payment not found"
**Solução:** Verifique se o `preference_id` está correto e se o pagamento foi criado no banco.

### Webhook não está sendo chamado
**Soluções:**
1. Verifique se a URL do webhook está acessível publicamente
2. Verifique se o webhook está configurado no painel do Mercado Pago
3. Use o Mercado Pago Webhook Tester: https://www.mercadopago.com.br/developers/panel/app/APP_ID/webhooks

### Licença não está sendo gerada
**Soluções:**
1. Verifique os logs do webhook no Vercel
2. Verifique se o pagamento está com status `approved`
3. Verifique se a função `generate_license_key` existe no Supabase
4. Verifique se as tabelas `payments` e `licenses` existem

---

## 📊 Fluxo Completo de Teste

```
1. Cliente acessa: /api/pagamento?plan=pro&email=cliente@email.com
   ↓
2. API cria registro em `payments` (status: pending)
   ↓
3. API cria preferência no Mercado Pago
   ↓
4. Cliente é redirecionado para Mercado Pago
   ↓
5. Cliente realiza pagamento
   ↓
6. Mercado Pago envia webhook para /api/webhook/mercadopago
   ↓
7. Webhook atualiza `payments` (status: approved)
   ↓
8. Webhook gera licença em `licenses`
   ↓
9. Cliente retorna para /sucesso?preference_id=...
   ↓
10. Página de sucesso busca licença e exibe para o cliente
```

---

## ✅ Checklist de Teste

- [ ] Variável `MP_ACCESS_TOKEN` configurada no Vercel
- [ ] Variável `NEXT_PUBLIC_SITE_URL` configurada no Vercel
- [ ] Tabelas `payments` e `licenses` criadas no Supabase
- [ ] Função `generate_license_key` criada no Supabase
- [ ] API `/api/pagamento` retorna `init_point` corretamente
- [ ] Redirecionamento para Mercado Pago funciona
- [ ] Pagamento de teste é processado
- [ ] Webhook recebe notificação do Mercado Pago
- [ ] Pagamento é atualizado no banco (status: approved)
- [ ] Licença é gerada automaticamente
- [ ] Página `/sucesso` exibe a licença corretamente

---

## 🎯 Testes Recomendados

1. **Teste com plano PRO (R$ 49,90)**
2. **Teste com plano PREMIUM (R$ 99,90)**
3. **Teste com plano TRIAL (R$ 0,00)**
4. **Teste com pagamento rejeitado**
5. **Teste com webhook chegando antes do retorno do usuário**
6. **Teste com múltiplos pagamentos do mesmo email**

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Vercel
2. Verifique os logs no Supabase
3. Verifique o painel do Mercado Pago
4. Teste cada endpoint individualmente

