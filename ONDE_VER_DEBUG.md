# 📍 Onde Ver os Logs de Debug

## 🎯 3 Locais para Ver os Debugs

### 1️⃣ Endpoint de Debug (Mais Fácil)

**Acesse no navegador:**
```
https://voltris.com.br/api/pagamento/debug
```

**O que você verá:**
```json
{
  "token_configured": true,
  "token_prefix": "APP_USR-17",
  "token_length": 80,
  "dominio": "https://voltris.com.br",
  "preference_created": true,
  "preference_id": "...",
  "init_point": "...",
  "sandbox_init_point": "...",
  "test_mode": true,
  "status": "success"
}
```

**✅ Use este primeiro!** É o mais fácil e mostra tudo de uma vez.

---

### 2️⃣ Logs no Vercel (Mais Detalhado)

**Passo a passo:**

1. **Acesse:** https://vercel.com/dashboard
2. **Abra o projeto:** `voltris-seo-optimized`
3. **Vá em:** Deployments → [Último Deploy] → **Logs**
4. **Procure por:** `[Pagamento req-...]`

**Como usar:**

1. **Crie um pagamento:**
   ```
   https://voltris.com.br/api/pagamento?plan=pro&email=teste@example.com
   ```

2. **Copie o `request_id` da resposta:**
   ```json
   {
     "debug": {
       "request_id": "req-1234567890-abc"
     }
   }
   ```

3. **No Vercel, procure por esse `request_id` nos logs**

**O que você verá nos logs:**
```
[Pagamento req-1234567890-abc] Iniciando requisição
[Pagamento req-1234567890-abc] Token encontrado: APP_USR-1779915323...
[Pagamento req-1234567890-abc] Cliente Mercado Pago configurado
[Pagamento req-1234567890-abc] Criando preferência: { plan: 'pro', price: 49.9, ... }
[Pagamento req-1234567890-abc] Preferência criada com sucesso: { preference_id: '...', test_mode: true }
[Pagamento req-1234567890-abc] Requisição concluída em 234ms
```

**Ou se houver erro:**
```
[Pagamento req-1234567890-abc] Erro ao criar preferência: {
  message: "...",
  status: 400,
  cause: "..."
}
```

---

### 3️⃣ Resposta da API (Informações Rápidas)

**Ao criar um pagamento, a resposta inclui:**

```json
{
  "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
  "sandbox_init_point": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
  "preference_id": "3039297620-...",
  "payment_id": "uuid-...",
  "test_mode": true,
  "debug": {
    "request_id": "req-1234567890-abc",
    "duration_ms": 234
  }
}
```

**O que verificar:**
- ✅ `test_mode: true` → Está em modo teste
- ✅ `sandbox_init_point` existe → Use este link para testes!
- ✅ `debug.request_id` → Use para encontrar logs no Vercel

---

## 🚀 Passo a Passo Completo

### Passo 1: Verificar Configuração

Acesse:
```
https://voltris.com.br/api/pagamento/debug
```

**Envie a resposta completa para mim!**

### Passo 2: Criar Pagamento

Acesse:
```
https://voltris.com.br/api/pagamento?plan=pro&email=teste@example.com
```

**Copie:**
- O `request_id` do campo `debug.request_id`
- O valor de `test_mode`
- O `sandbox_init_point` (se existir)

### Passo 3: Ver Logs no Vercel

1. Acesse: https://vercel.com/dashboard
2. Vá em: Deployments → [Último Deploy] → Logs
3. Procure pelo `request_id` que você copiou
4. Veja todos os logs dessa requisição

### Passo 4: Usar o Link Correto

**Se `test_mode: true`:**
- Use o `sandbox_init_point` (se existir)
- Ou use o `init_point` normal

**Se `test_mode: false`:**
- Use o `init_point` normal

---

## 📋 Checklist

- [ ] Endpoint `/api/pagamento/debug` acessível
- [ ] Resposta mostra `test_mode: true`
- [ ] `sandbox_init_point` existe na resposta
- [ ] Logs aparecem no Vercel
- [ ] `request_id` funciona para buscar logs

---

## 🆘 Se Não Conseguir Ver os Logs

1. **Verifique se o deploy foi concluído:**
   - Vercel Dashboard → Deployments → Verifique se está "Ready"

2. **Aguarde 1-2 minutos** após o deploy

3. **Tente novamente** criar um pagamento

4. **Verifique se as variáveis de ambiente estão configuradas:**
   - Vercel Dashboard → Settings → Environment Variables
   - `MP_ACCESS_TOKEN` deve estar configurado

---

## 💡 Dica

**Comece sempre pelo endpoint de debug!** Ele mostra tudo de uma vez e é mais fácil de entender.

