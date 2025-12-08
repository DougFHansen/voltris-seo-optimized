# 🔍 Debug do Mercado Pago - Guia Completo

## 🛠️ Ferramentas de Debug Criadas

### 1. Endpoint de Debug

Acesse para verificar a configuração:
```
https://voltris.com.br/api/pagamento/debug
```

**O que ele mostra:**
- Se o token está configurado
- Prefixo e tamanho do token
- Se consegue criar uma preferência de teste
- Detalhes da preferência criada (incluindo `test_mode`, `sandbox_init_point`)
- Erros detalhados se houver

### 2. Logs Detalhados na API

Agora a API `/api/pagamento` gera logs detalhados que você pode ver no Vercel:

**Como ver os logs:**
1. Acesse: https://vercel.com/dashboard
2. Vá em: Seu Projeto → Deployments → [Último Deploy] → Logs
3. Procure por: `[Pagamento req-...]`

**O que os logs mostram:**
- ID único da requisição
- Token usado (primeiros 20 caracteres)
- Dados da preferência sendo criada
- Resposta completa do Mercado Pago
- Erros detalhados com stack trace
- Tempo de execução

### 3. Resposta da API com Debug

A API agora retorna informações adicionais:
```json
{
  "init_point": "...",
  "sandbox_init_point": "...",
  "preference_id": "...",
  "test_mode": true/false,
  "debug": {
    "request_id": "req-...",
    "duration_ms": 123
  }
}
```

## 🔎 Como Usar para Identificar o Problema

### Passo 1: Verificar Configuração

Acesse:
```
https://voltris.com.br/api/pagamento/debug
```

**Verifique:**
- ✅ `token_configured: true`
- ✅ `preference_created: true`
- ✅ `test_mode: true` (se estiver em modo teste)
- ✅ `sandbox_init_point` existe (para testes)

### Passo 2: Criar Pagamento com Debug

Acesse:
```
https://voltris.com.br/api/pagamento?plan=pro&email=teste@example.com
```

**Copie o `request_id` da resposta** e use para ver os logs no Vercel.

### Passo 3: Verificar Logs no Vercel

1. Acesse: https://vercel.com/dashboard
2. Vá em: Seu Projeto → Deployments → [Último Deploy] → Logs
3. Procure pelo `request_id` que você copiou
4. Veja todos os logs dessa requisição

**Procure por:**
- Erros do Mercado Pago
- Status codes
- Mensagens de erro detalhadas

### Passo 4: Verificar Resposta do Mercado Pago

Na resposta da API, verifique:
- `test_mode`: Deve ser `true` para testes
- `sandbox_init_point`: Use este link se `test_mode` for `true`
- `init_point`: Use este link se `test_mode` for `false`

## 🐛 Possíveis Problemas e Soluções

### Problema 1: `test_mode: false` mas usando token de teste

**Solução:** O Mercado Pago pode estar detectando como produção. Verifique:
- Token está na seção "Credenciais de teste"?
- Use o `sandbox_init_point` mesmo que `test_mode` seja `false`

### Problema 2: Erro ao criar preferência

**Verifique nos logs:**
- Status code do erro
- Mensagem de erro do Mercado Pago
- Se o token está correto

### Problema 3: "Uma das partes é de teste"

**Possíveis causas:**
1. **Token de produção sendo usado:** Verifique se o token é da seção "Credenciais de teste"
2. **Conta não é de teste:** Use uma conta de teste do Mercado Pago
3. **Preferência criada em modo produção:** Use `sandbox_init_point` se disponível

## 📋 Checklist de Debug

- [ ] Endpoint `/api/pagamento/debug` acessível
- [ ] Token configurado (`token_configured: true`)
- [ ] Preferência pode ser criada (`preference_created: true`)
- [ ] `test_mode: true` na resposta (se em modo teste)
- [ ] `sandbox_init_point` existe na resposta
- [ ] Logs aparecem no Vercel
- [ ] Nenhum erro nos logs

## 🚀 Próximos Passos

1. **Acesse o endpoint de debug:**
   ```
   https://voltris.com.br/api/pagamento/debug
   ```

2. **Copie a resposta completa** e me envie

3. **Crie um pagamento:**
   ```
   https://voltris.com.br/api/pagamento?plan=pro&email=teste@example.com
   ```

4. **Copie o `request_id`** da resposta

5. **Veja os logs no Vercel** usando o `request_id`

6. **Me envie:**
   - Resposta do endpoint de debug
   - Resposta da API de pagamento
   - Logs do Vercel (se houver erros)

Com essas informações, conseguiremos identificar exatamente o problema!

