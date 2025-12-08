# 🔍 Diagnóstico de Problemas no Vercel

## ⚠️ PASSO A PASSO URGENTE:

### 1. Verificar os Logs de Erro no Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto `voltris-seo-optimized`
3. Vá em **Deployments**
4. Clique no deployment mais recente com erro (vermelho)
5. Clique na aba **"Logs"** ou **"Build Logs"**
6. **COPIE O ERRO COMPLETO** e me envie

### 2. Verificar Variáveis de Ambiente

1. No Vercel Dashboard → Seu Projeto
2. Vá em **Settings** → **Environment Variables**
3. Verifique se TODAS estas variáveis estão configuradas:

#### ✅ OBRIGATÓRIAS:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MP_ACCESS_TOKEN`
- `NEXT_PUBLIC_SITE_URL` (valor: `https://voltris.com.br`)

#### ⚠️ IMPORTANTE:
- Todas devem estar marcadas para: **Production**, **Preview** e **Development**
- Após adicionar/editar, você precisa fazer um **novo deploy**

### 3. Forçar Novo Deploy

1. Vercel Dashboard → Deployments
2. Clique nos **3 pontinhos** (⋯) no deployment mais recente
3. Clique em **"Redeploy"**
4. Aguarde e veja os logs

### 4. Verificar Configurações do Projeto

1. Vercel Dashboard → Seu Projeto → **Settings**
2. Vá em **General**
3. Verifique:
   - **Framework Preset**: Deve ser `Next.js`
   - **Build Command**: Deve ser `npm run build` (ou vazio para auto-detect)
   - **Output Directory**: Deve ser `.next` (ou vazio para auto-detect)
   - **Install Command**: Deve ser `npm install` (ou vazio para auto-detect)
   - **Node.js Version**: Deve ser `22.x` (ou deixe vazio para usar o `.nvmrc`)

### 5. Erros Comuns e Soluções

#### ❌ "Missing environment variable"
**Solução**: Adicione a variável faltante nas Environment Variables

#### ❌ "Build failed" / "Command failed"
**Solução**: 
- Verifique os logs completos
- Pode ser problema de dependências ou erro de TypeScript
- Tente fazer build local: `npm run build`

#### ❌ "Module not found"
**Solução**: 
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente para testar

#### ❌ "Type error" / "TypeScript error"
**Solução**: 
- O projeto tem `ignoreBuildErrors: true` no `next.config.js`
- Mas se o erro for crítico, precisa corrigir o código

---

## 🚀 Ação Imediata:

**ENVIE-ME OS LOGS DO VERCEL** para eu identificar o problema exato!

Como obter os logs:
1. Vercel Dashboard → Deployments → Clique no erro
2. Aba "Logs" ou "Build Logs"
3. Copie TODO o conteúdo do erro
4. Me envie aqui

