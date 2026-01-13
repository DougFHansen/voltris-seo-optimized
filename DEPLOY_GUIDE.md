# 🚀 GUIA COMPLETO PARA DEPLOY EM PRODUÇÃO

## 📋 PRÉ-REQUISITOS

Antes de fazer o deploy, certifique-se de ter:

1. **Conta no Vercel** - [vercel.com/signup](https://vercel.com/signup)
2. **Projeto configurado** no dashboard do Vercel
3. **Variáveis de ambiente** configuradas

## 🔧 PASSO A PASSO PARA DEPLOY

### 1. LOGIN NO VERCEL
```bash
vercel login
```
- Será gerado um código de usuário
- Acesse a URL mostrada no navegador
- Confirme o login

### 2. VERIFICAR CONFIGURAÇÕES
```bash
vercel whoami
```

### 3. DEPLOY PARA PRODUÇÃO
```bash
vercel --prod --yes
```

## ⚙️ VARIÁVEIS DE AMBIENTE NECESSÁRIAS

Configure estas variáveis no dashboard do Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=***seu-url-supabase***
NEXT_PUBLIC_SUPABASE_ANON_KEY=***sua-public-key***
SUPABASE_SERVICE_ROLE_KEY=***sua-service-role-key***
MP_ACCESS_TOKEN=***seu-access-token-mercado-pago***
MP_PUBLIC_KEY=***sua-public-key-mercado-pago***
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
```

## 📁 ARQUIVOS DE CONFIGURAÇÃO

### vercel.json
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    },
    "app/api/**/*.js": {
      "maxDuration": 30
    },
    "app/api/webhook/mercadopago/route.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

## ✅ VERIFICAÇÕES ANTES DO DEPLOY

### 1. Estrutura do Projeto
```
✅ app/api/pagamento/              (API principal)
✅ app/api/pagamento/simular-pagamento/ (Simulação)
✅ app/api/pagamento/webhook/      (Webhooks)
✅ app/api/license/get/            (Licenças)
✅ app/api/redirect-sucesso/       (Redirecionamento)
✅ app/pagina-sucesso/             (Sucesso principal)
✅ app/pagina-sucesso-simples/     (Sucesso otimizada)
✅ app/simular-pagamento/          (Interface teste)
```

### 2. Arquivos Removidos (Otimização)
```
🗑️ Arquivos de teste (.js) - 20+ arquivos removidos
🗑️ Diretórios de debug - 4 diretórios removidos
🗑️ Componentes temporários - 3 componentes removidos
```

## 🚀 COMANDOS ÚTEIS

### Deploy completo
```bash
# 1. Login (primeiro uso)
vercel login

# 2. Deploy para produção
vercel --prod --yes

# 3. Ver deployments
vercel list

# 4. Abrir dashboard
vercel open
```

## 🔍 MONITORAMENTO PÓS-DEPLOY

### Verificar logs
```bash
vercel logs [url-do-deploy]
```

### Verificar status
```bash
vercel inspect [url-do-deploy]
```

## 🎯 TESTES PÓS-DEPLOY

### 1. Teste de Simulação
Acesse: `https://seu-dominio.vercel.app/simular-pagamento`

### 2. Teste de Pagamento Real
Configure webhooks no dashboard do Mercado Pago:
- URL: `https://seu-dominio.vercel.app/api/pagamento/webhook`

### 3. Teste de Licenças
Verifique se as licenças são geradas corretamente após pagamento

## 🆘 PROBLEMAS COMUNS

### Erro de build
```bash
# Verificar tipos
npm run type-check

# Limpar cache
rm -rf .next
npm run build
```

### Erro de ambiente
- Verifique se todas as variáveis estão configuradas
- Confirme se as URLs estão corretas

### Erro de permissões
- Certifique-se de que o usuário tem acesso ao projeto
- Verifique permissões do Supabase

## ✅ CHECKLIST FINAL

- [ ] Login realizado no Vercel CLI
- [ ] Variáveis de ambiente configuradas
- [ ] Build local funcionando
- [ ] Deploy realizado com sucesso
- [ ] Testes básicos realizados
- [ ] Monitoramento configurado

---

**Sistema otimizado e pronto para produção! 🚀**