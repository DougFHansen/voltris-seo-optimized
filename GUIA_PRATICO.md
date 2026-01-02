# 📖 GUIA PRÁTICO - SISTEMA VOLTRIS

**Para:** Desenvolvedor/Administrador  
**Objetivo:** Entender e operar o sistema completo  
**Última atualização:** 02/01/2026

---

## 🎯 INÍCIO RÁPIDO

### 1. Aplicar Migrations Pendentes

```bash
# Acesse o Supabase Dashboard
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor

# Execute em ordem:

# Migration 1: Corrigir chave secreta (JÁ APLICADA ✅)
# 20260102000000_fix_license_secret_key.sql

# Migration 2: Padronizar planos (JÁ APLICADA ✅)
# 20260102000001_standardize_license_plans.sql

# Migration 3: Sistema de assinaturas (APLICAR AGORA ⏳)
# 20260102000002_add_subscriptions.sql
```

**Como aplicar:**
1. Abra Supabase Dashboard
2. Vá em SQL Editor
3. Copie o conteúdo da migration
4. Execute
5. Verifique se não há erros

---

## 💳 TESTE DE PAGAMENTO

### Fluxo Completo

#### 1. **Acesse o Checkout**

```
URL: https://www.voltris.com.br/checkout
```

#### 2. **Escolha um Plano**

- Trial (R$ 0,01) - 7 dias
- Pro (R$ 49,90) - 1 mês, 1 dispositivo
- Premium (R$ 99,90) - 3 meses, 3 dispositivos
- Enterprise (R$ 149,90) - 6 meses, ILIMITADO

#### 3. **Preencha os Dados**

```
Email: seu@email.com.br (obrigatório)
Nome Completo: João Silva Santos (obrigatório)
Telefone: (11) 98765-4321 (opcional)
```

#### 4. **Finalize a Compra**

- Clique em "Finalizar Compra"
- Você será redirecionado para o Mercado Pago
- Preencha os dados do cartão
- Confirme o pagamento

#### 5. **Receba a Licença**

- Após aprovação, você receberá por email
- Formato: `VOLTRIS-LIC-abc123-20260102-A1B2C3D4E5F6G7H8`
- Copie a licença

---

## 🖥️ ATIVAR LICENÇA NO APP

### Passo a Passo

#### 1. **Abra o Voltris Optimizer**

```
Local: C:\Program Files\Voltris Optimizer\VoltrisOptimizer.exe
```

#### 2. **Clique em "Ativar Licença"**

- Localize o botão na interface principal
- Cole a chave de licença

#### 3. **Validação Online**

```
O app irá:
1. Validar a licença com o backend
2. Verificar se não expirou
3. Verificar limite de dispositivos
4. Registrar o dispositivo atual
5. Liberar funcionalidades
```

#### 4. **Verificação de Status**

```
✅ Licença válida
📅 Expira em: 02/07/2026
💻 Dispositivos: 1/3 em uso
🎮 Plano: Premium
```

---

## 🔍 VALIDAR LICENÇA MANUALMENTE

### Via API (Teste)

```bash
# PowerShell
$body = @{
    licenseKey = "VOLTRIS-LIC-abc123-20260102-A1B2C3D4E5F6G7H8"
    deviceId = "CPU123-MB456-BIOS789"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://www.voltris.com.br/api/v1/license/validate" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

```bash
# cURL (Git Bash/Linux)
curl -X POST https://www.voltris.com.br/api/v1/license/validate \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "VOLTRIS-LIC-abc123-20260102-A1B2C3D4E5F6G7H8",
    "deviceId": "CPU123-MB456-BIOS789"
  }'
```

### Respostas Esperadas

**Sucesso:**
```json
{
  "valid": true,
  "type": "premium",
  "maxDevices": 3,
  "devicesInUse": 1,
  "expiresAt": "2026-04-02T00:00:00Z",
  "deviceRegistered": false,
  "message": "Licença válida"
}
```

**Licença Expirada:**
```json
{
  "valid": false,
  "errorMessage": "Licença expirada",
  "errorCode": "LICENSE_EXPIRED",
  "type": "pro",
  "expiresAt": "2026-01-01T00:00:00Z"
}
```

**Licença Não Encontrada:**
```json
{
  "valid": false,
  "errorMessage": "Licença não encontrada",
  "errorCode": "LICENSE_NOT_FOUND"
}
```

---

## 📊 CONSULTAR BANCO DE DADOS

### Supabase Dashboard

#### 1. **Ver Todas as Licenças**

```sql
SELECT 
  license_key,
  license_type,
  is_active,
  expires_at,
  max_devices,
  devices_in_use,
  email,
  activated_at
FROM licenses
ORDER BY created_at DESC
LIMIT 50;
```

#### 2. **Ver Dispositivos Registrados**

```sql
SELECT 
  l.license_key,
  l.license_type,
  ld.device_id,
  ld.device_name,
  ld.machine_name,
  ld.activated_at,
  ld.last_used_at
FROM license_devices ld
JOIN licenses l ON l.id = ld.license_id
ORDER BY ld.activated_at DESC;
```

#### 3. **Ver Pagamentos**

```sql
SELECT 
  email,
  full_name,
  license_type,
  amount,
  status,
  payment_id,
  preference_id,
  created_at
FROM payments
ORDER BY created_at DESC
LIMIT 50;
```

#### 4. **Ver Assinaturas Ativas**

```sql
SELECT 
  s.email,
  s.full_name,
  s.plan_code,
  s.amount,
  s.status,
  s.next_billing_date,
  s.is_trial,
  l.license_key
FROM subscriptions s
JOIN licenses l ON l.id = s.license_id
WHERE s.status = 'active'
ORDER BY s.created_at DESC;
```

---

## 🛠️ ADMINISTRAÇÃO

### Desativar Licença Manualmente

```sql
-- Desativar licença específica
UPDATE licenses
SET is_active = false
WHERE license_key = 'VOLTRIS-LIC-abc123-20260102-A1B2C3D4E5F6G7H8';
```

### Estender Validade de Licença

```sql
-- Adicionar 30 dias
UPDATE licenses
SET expires_at = expires_at + INTERVAL '30 days'
WHERE license_key = 'VOLTRIS-LIC-abc123-20260102-A1B2C3D4E5F6G7H8';
```

### Remover Dispositivo

```sql
-- Remover dispositivo específico
DELETE FROM license_devices
WHERE device_id = 'CPU123-MB456-BIOS789';

-- Atualizar contador
UPDATE licenses
SET devices_in_use = devices_in_use - 1
WHERE id = (
  SELECT license_id FROM license_devices
  WHERE device_id = 'CPU123-MB456-BIOS789'
);
```

### Cancelar Assinatura

```sql
-- Via função
SELECT cancel_subscription(
  p_subscription_id := 'uuid-da-assinatura',
  p_reason := 'Solicitação do cliente',
  p_immediate := false
);

-- Ou manualmente
UPDATE subscriptions
SET 
  status = 'cancelled',
  cancelled_at = NOW(),
  cancellation_reason = 'Solicitação do cliente'
WHERE id = 'uuid-da-assinatura';
```

---

## 📧 WEBHOOKS E NOTIFICAÇÕES

### Verificar Webhooks Recebidos

**Logs do Vercel:**

1. Acesse: https://vercel.com/dashboard
2. Selecione projeto: voltris-seo-optimized
3. Vá em "Logs"
4. Filtre por: `/api/webhook/mercadopago`

**O que procurar:**

```
[WEBHOOK] ========== WEBHOOK RECEBIDO ==========
[WEBHOOK] Topic: payment
[WEBHOOK] Payment ID: 123456789
[WEBHOOK] Status: approved
[WEBHOOK] Licença gerada: VOLTRIS-LIC-...
```

### Reenviar Webhook Manualmente

Se um webhook falhou, você pode reprocessar:

```bash
# PowerShell
Invoke-WebRequest -Uri "https://www.voltris.com.br/api/webhook/mercadopago" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"action":"payment.updated","data":{"id":"123456789"}}'
```

---

## 🔐 SEGURANÇA E CREDENCIAIS

### Variáveis de Ambiente (Vercel)

```bash
# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN_PROD=APP_USR-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Site
NEXT_PUBLIC_SITE_URL=https://www.voltris.com.br
```

### Chave Secreta de Licença

**Local no código:**

```
Backend: supabase/migrations/20260102000000_fix_license_secret_key.sql
App C#: APLICATIVO VOLTRIS/LicenseGenerator/Program.cs
```

**Valor:**
```
VOLTRIS_SECRET_LICENSE_KEY_2025
```

> ⚠️ **NUNCA** compartilhe esta chave publicamente!

---

## 🐛 TROUBLESHOOTING

### Problema: Licença não gerada após pagamento

**Solução:**

1. Verifique os logs do webhook no Vercel
2. Verifique se `MERCADOPAGO_ACCESS_TOKEN_PROD` está correto
3. Verifique se `SUPABASE_SERVICE_ROLE_KEY` está correto
4. Procure erros no Supabase Dashboard → Logs

**Reprocessar manualmente:**

```sql
-- Buscar pagamento
SELECT * FROM payments
WHERE payment_id = '123456789';

-- Se não tem licença, gerar manualmente
SELECT generate_license_key(
  'client-id-from-payment',
  NOW() + INTERVAL '30 days',
  'pro'
);
```

### Problema: App não valida licença online

**Solução:**

1. Verifique conexão com internet
2. Teste endpoint manualmente (ver seção "Validar Licença")
3. Verifique firewall/antivírus
4. Verifique logs do app em: `%LOCALAPPDATA%\Voltris\logs\`

### Problema: Dispositivo não ativa (limite atingido)

**Solução:**

```sql
-- Ver dispositivos registrados
SELECT * FROM license_devices
WHERE license_id = (
  SELECT id FROM licenses
  WHERE license_key = 'VOLTRIS-LIC-...'
);

-- Remover dispositivo inativo (opcional)
DELETE FROM license_devices
WHERE id = 'uuid-do-device'
  AND last_used_at < NOW() - INTERVAL '30 days';
```

### Problema: Pagamento aprovado mas status pending

**Solução:**

```sql
-- Atualizar status manualmente
UPDATE payments
SET 
  status = 'approved',
  payment_id = '123456789',
  approved_at = NOW()
WHERE preference_id = 'preference-id-from-mp';

-- Gerar licença se não existe
INSERT INTO licenses (...)
-- ou usar função generate_license_key
```

---

## 📈 MONITORAMENTO E MÉTRICAS

### KPIs Importantes

#### 1. **Taxa de Conversão**

```sql
SELECT 
  COUNT(*) FILTER (WHERE status = 'approved') * 100.0 / COUNT(*) as conversion_rate,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected
FROM payments
WHERE created_at >= NOW() - INTERVAL '30 days';
```

#### 2. **MRR (Monthly Recurring Revenue)**

```sql
SELECT 
  SUM(CASE 
    WHEN plan_code = 'pro' THEN amount
    WHEN plan_code = 'premium' THEN amount / 3
    WHEN plan_code = 'enterprise' THEN amount / 6
    ELSE 0
  END) as mrr
FROM subscriptions
WHERE status = 'active';
```

#### 3. **Churn Rate**

```sql
SELECT 
  COUNT(*) FILTER (WHERE status = 'cancelled' AND cancelled_at >= NOW() - INTERVAL '30 days') * 100.0 /
  COUNT(*) FILTER (WHERE status = 'active' OR status = 'cancelled') as churn_rate
FROM subscriptions;
```

#### 4. **Dispositivos por Plano**

```sql
SELECT 
  l.license_type,
  COUNT(DISTINCT ld.device_id) as total_devices,
  COUNT(DISTINCT l.id) as total_licenses,
  ROUND(COUNT(DISTINCT ld.device_id)::numeric / NULLIF(COUNT(DISTINCT l.id), 0), 2) as avg_devices_per_license
FROM licenses l
LEFT JOIN license_devices ld ON ld.license_id = l.id
WHERE l.is_active = true
GROUP BY l.license_type;
```

---

## 🎓 BOAS PRÁTICAS

### 1. **Sempre Testar em Sandbox Primeiro**

```bash
# Usar test users do Mercado Pago
# Criar em: https://www.mercadopago.com.br/developers/panel/test-users
```

### 2. **Backup Regular do Banco**

```bash
# Supabase faz backup automático
# Mas é bom fazer dumps periódicos das tabelas críticas:
# - licenses
# - payments
# - subscriptions
```

### 3. **Monitorar Logs Regularmente**

```bash
# Verificar diariamente:
# - Vercel Dashboard → Logs
# - Supabase Dashboard → Logs
# - Mercado Pago Dashboard → Webhooks
```

### 4. **Documentar Mudanças**

```bash
# Sempre que alterar:
# - Migrations: documentar em comentários
# - APIs: atualizar documentação
# - Planos/preços: comunicar usuários
```

---

## 📞 SUPORTE

### Recursos

- **Documentação do Sistema:** `ARQUITETURA_FINAL.md`
- **Análise Completa:** `SISTEMA_VOLTRIS_ANALISE_COMPLETA.md`
- **Mercado Pago Docs:** https://www.mercadopago.com.br/developers
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

### Contatos Técnicos

- **Suporte Mercado Pago:** developers@mercadopago.com
- **Suporte Supabase:** support@supabase.io
- **Vercel Support:** https://vercel.com/support

---

## ✅ CHECKLIST DE DEPLOY

- [x] Migrations aplicadas no Supabase
- [x] Variáveis de ambiente configuradas no Vercel
- [x] Token do Mercado Pago configurado (PROD)
- [x] Webhook URL configurada no Mercado Pago
- [x] Site deployado e acessível
- [ ] Teste completo de compra (Trial → Pro → Premium → Enterprise)
- [ ] Teste de ativação no aplicativo
- [ ] Teste de renovação automática
- [ ] Monitoramento configurado

---

**Sistema Voltris - Guia Prático Completo** 🚀
