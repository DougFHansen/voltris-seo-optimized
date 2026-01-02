# 🔍 GUIA DE DEBUG - MERCADO PAGO

Este documento explica como usar o sistema de logs implementado para rastrear problemas no checkout.

## ⚠️ **PROBLEMA RESOLVIDO - LEIA ISTO PRIMEIRO**

### **CAUSA RAIZ IDENTIFICADA E CORRIGIDA**

O pagamento de teste estava falhando porque:

**PROBLEMA:**
- Token configurado: `APP_USR-...` (PRODUÇÃO)
- Tentativa de uso: Sandbox (TESTE)
- Resultado: ❌ **INCOMPATIBILIDADE - Pagamento falha no checkout**

**POR QUE ISSO ACONTECE:**

Quando você usa um token de **PRODUÇÃO** (`APP_USR-`), o Mercado Pago GERA o `sandbox_init_point`, mas quando você tenta pagar usando esse link de sandbox, o sistema verifica que o token NÃO TEM PERMISSÃO para processar pagamentos de teste e REJEITA a transação.

É como tentar usar uma chave de produção para abrir uma porta de teste - a chave existe, a porta existe, mas elas não são compatíveis.

### **SOLUÇÃO DEFINITIVA**

1. **Acesse o painel do Mercado Pago:**
   - URL: https://www.mercadopago.com.br/developers/panel/credentials

2. **Clique em "Credenciais de teste"** (NÃO "Produção")

3. **Copie o Access Token que COMEÇA com `TEST-`**
   - Exemplo: `TEST-1234567890123456-010100-abc...`

4. **No Vercel (ou arquivo .env local):**
   - Vá em: Settings → Environment Variables
   - Edite: `MP_ACCESS_TOKEN`
   - Cole o token que começa com `TEST-`
   - Salve

5. **Faça redeploy do projeto**

6. **Teste novamente** - Agora o pagamento de sandbox funcionará! ✅

### **COMO DETECTAR O PROBLEMA AUTOMATICAMENTE**

Agora o sistema detecta automaticamente este erro e exibe:

**No console do servidor (Vercel Logs):**
```
[MERCADO PAGO DEBUG] ⚠️⚠️⚠️ AVISO CRÍTICO ⚠️⚠️⚠️
[MERCADO PAGO DEBUG] TOKEN DE PRODUÇÃO DETECTADO (APP_USR-)
[MERCADO PAGO DEBUG] 
[MERCADO PAGO DEBUG] PROBLEMA:
[MERCADO PAGO DEBUG] - Você está usando um token de PRODUÇÃO
[MERCADO PAGO DEBUG] - Para TESTES em SANDBOX, use um token que comece com TEST-
[MERCADO PAGO DEBUG] 
[MERCADO PAGO DEBUG] CONSEQUÊNCIA:
[MERCADO PAGO DEBUG] - O sandbox_init_point será gerado, MAS NÃO FUNCIONARÁ
[MERCADO PAGO DEBUG] - Pagamentos de teste FALHARÃO no checkout
```

**No console do navegador (Frontend):**
```
[MERCADO PAGO DEBUG] ❌❌❌ ERROS CRÍTICOS DETECTADOS ❌❌❌
[MERCADO PAGO DEBUG] ❌ ERRO CRÍTICO: Token de PRODUÇÃO detectado, mas tentando usar SANDBOX.
[MERCADO PAGO DEBUG] O pagamento de teste FALHARÁ.
```

**Popup de alerta automático:**
```
⚠️ ERRO DETECTADO:

❌ ERRO CRÍTICO: Token de PRODUÇÃO detectado, mas tentando usar SANDBOX. 
Pagamento de teste FALHARÁ.

O pagamento provavelmente FALHARÁ no checkout.
Verifique os logs do console para mais detalhes.
```

---

## ✅ O QUE FOI IMPLEMENTADO

### 1. **BACKEND - API de Pagamento** (`/api/pagamento`)

Logs implementados com prefixo `[MERCADO PAGO DEBUG]`:

- ✓ Validação do token (tipo, tamanho, ambiente)
- ✓ Payload enviado ao Mercado Pago (completo)
- ✓ Resposta da API Mercado Pago (completa)
- ✓ URLs geradas (init_point, sandbox_init_point)
- ✓ Erros detalhados com status HTTP, cause, stack
- ✓ Verificação de variáveis de ambiente
- ✓ Registro no banco de dados

### 2. **FRONTEND - Página de Teste** (`/teste-checkout`)

Logs implementados com prefixo `[MERCADO PAGO DEBUG]`:

- ✓ Parâmetros enviados para API
- ✓ Status HTTP recebido
- ✓ Validação de campos obrigatórios (preference_id)
- ✓ Tipo de URL usada (sandbox vs produção)
- ✓ Erros no fetch
- ✓ Abertura da janela de checkout

### 3. **WEBHOOK - Notificações** (`/api/webhook/mercadopago`)

Logs implementados com prefixo `[MERCADO PAGO DEBUG]`:

- ✓ Tipo de notificação recebida
- ✓ Dados do pagamento (status, valor, etc)
- ✓ Atualização do banco de dados
- ✓ Geração de licença
- ✓ Erros na comunicação com API MP

## 🧪 COMO TESTAR

### Passo 1: Acessar página de teste

```
https://voltris.com.br/teste-checkout
```

### Passo 2: Abrir DevTools do navegador

- Chrome/Edge: F12 ou Ctrl+Shift+I
- Firefox: F12 ou Ctrl+Shift+K

### Passo 3: Ir para aba "Console"

### Passo 4: Criar um pagamento de teste

1. Selecione um plano
2. Clique em "Criar Pagamento"
3. Observe os logs no console

### Passo 5: Verificar logs no terminal/servidor

Se estiver rodando localmente:
```bash
npm run dev
```

Se estiver no Vercel:
- Vá em: Dashboard → Deployments → [última deployment] → Logs

## 📋 CHECKLIST DE DIAGNÓSTICO

Quando um erro ocorrer, verifique na ordem:

### ✅ 1. FRONTEND (Console do navegador)

Procure por:
```
[MERCADO PAGO DEBUG] ========== FRONTEND: INICIANDO CHAMADA ==========
```

Verifique:
- [ ] Parâmetros estão corretos?
- [ ] Status HTTP é 200?
- [ ] `preference_id` está presente?
- [ ] `sandbox_init_point` existe? (para testes)
- [ ] Janela de checkout abriu?

### ✅ 2. BACKEND (Logs do servidor)

Procure por:
```
[MERCADO PAGO DEBUG] ========== INÍCIO REQUISIÇÃO ==========
```

Verifique:
- [ ] Token está configurado?
- [ ] Token é de teste (começa com TEST-)?
- [ ] Payload está válido?
- [ ] API respondeu com sucesso?
- [ ] URLs foram geradas?

### ✅ 3. MERCADO PAGO (Resposta da API)

Procure por:
```
[MERCADO PAGO DEBUG] ========== RESPOSTA MERCADO PAGO ==========
```

Verifique:
- [ ] `sandbox_init_point` existe?
- [ ] `test_mode` é `true`?
- [ ] Há mensagem de erro?

### ✅ 4. WEBHOOK (Após pagamento)

Procure por:
```
[MERCADO PAGO DEBUG] ========== WEBHOOK RECEBIDO ==========
```

Verifique:
- [ ] Webhook foi chamado?
- [ ] Status do pagamento (approved/rejected)?
- [ ] Licença foi gerada?

## 🚨 ERROS COMUNS E SOLUÇÕES

### ❌ Erro: "Pagamento falha no checkout de sandbox" (ESTE ERA SEU PROBLEMA)

**Causa**: Token de PRODUÇÃO sendo usado para pagamentos de TESTE

**Sintomas:**
- Preferência é criada com sucesso
- `sandbox_init_point` é gerado
- Checkout abre normalmente
- Mas ao tentar pagar, dá erro ou não processa

**Solução:**
1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Clique em "Credenciais de teste" (não "Produção")
3. Copie o token que COMEÇA com `TEST-`
4. Atualize `MP_ACCESS_TOKEN` com o token de teste
5. Faça redeploy

**Como detectar:**
- Logs mostram: `ambiente: 'PRODUÇÃO'` mas você está testando
- `token_type: 'PRODUCAO'` no debug
- Alerta automático no console e popup

---

### Erro: "MP_ACCESS_TOKEN não configurado"

**Causa**: Variável de ambiente ausente

**Solução**:
1. Verificar arquivo `.env.local` (local)
2. Verificar Vercel → Settings → Environment Variables (produção)
3. Adicionar: `MP_ACCESS_TOKEN=seu_token_aqui`

### Erro: "sandbox_init_point não disponível"

**Causa**: Token de produção sendo usado ao invés de teste

**Solução**:
1. Obter token de TESTE no painel Mercado Pago
2. Token deve começar com `TEST-`
3. Atualizar variável de ambiente

### Erro: "preference_id ausente"

**Causa**: Falha na criação da preferência no Mercado Pago

**Solução**:
1. Ver logs do backend para erro detalhado
2. Verificar se payload está válido
3. Verificar se token tem permissões corretas

### Erro: "Webhook não recebe notificação"

**Causa**: Webhook não configurado no painel MP

**Solução**:
1. Ir em: Mercado Pago → Desenvolvedores → Webhooks
2. Adicionar URL: `https://voltris.com.br/api/webhook/mercadopago`
3. Selecionar evento: "Pagamentos"

## 📝 EXEMPLO DE LOG COMPLETO (SUCESSO)

```
[MERCADO PAGO DEBUG] ========== INÍCIO REQUISIÇÃO req-xxx ==========
[MERCADO PAGO DEBUG] Token configurado: { prefix: 'TEST-...', isTestToken: true }
[MERCADO PAGO DEBUG] Parâmetros: { plan: 'pro', email: 'teste@teste.com' }
[MERCADO PAGO DEBUG] Cliente Mercado Pago configurado
[MERCADO PAGO DEBUG] ========== PAYLOAD PARA MERCADO PAGO ==========
[MERCADO PAGO DEBUG] Payload: { items: [...], back_urls: {...} }
[MERCADO PAGO DEBUG] Enviando requisição para API...
[MERCADO PAGO DEBUG] ========== RESPOSTA MERCADO PAGO ==========
[MERCADO PAGO DEBUG] Preferência criada com sucesso!
[MERCADO PAGO DEBUG] URLs geradas: { sandbox_url: 'https://...' }
[MERCADO PAGO DEBUG] ========== FIM REQUISIÇÃO (250ms) ==========
```

## 🔧 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

Verifique se TODAS estão configuradas:

```env
# Mercado Pago
MP_ACCESS_TOKEN=TEST-xxxxx  # Token de TESTE

# Site
NEXT_PUBLIC_SITE_URL=https://voltris.com.br

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

## 📞 SUPORTE

Se após verificar todos os logs ainda houver problemas:

1. Copiar TODOS os logs (console + servidor)
2. Tirar screenshot do erro
3. Verificar se o token é realmente de TESTE
4. Verificar se a conta de teste do comprador está configurada

## 📝 CHECKLIST FINAL - ANTES DE TESTAR PAGAMENTOS

### Para testes em SANDBOX:

- [ ] Token começa com `TEST-` (NÃO `APP_USR-`)
- [ ] Variavel `MP_ACCESS_TOKEN` atualizada no Vercel
- [ ] Redeploy feito após atualizar token
- [ ] Console não mostra avisos críticos sobre token de produção
- [ ] `sandbox_init_point` é gerado na resposta
- [ ] Usar cartão de teste: 5031 4332 1540 6351
- [ ] Fazer login com conta de teste do Mercado Pago antes de pagar

### Para produção:

- [ ] Token começa com `APP_USR-`
- [ ] Webhook configurado no painel Mercado Pago
- [ ] URLs de retorno (success/failure) estão corretas
- [ ] Testado em sandbox primeiro
- [ ] Sistema de geração de licenças funcionando

---

**Última atualização**: 2026-01-02 - Problema de token produção/sandbox diagnosticado e corrigido
