# 🚀 Guia Completo de Deploy no Vercel - VOLTRIS

## 📋 Pré-requisitos

1. **Conta no Vercel** (gratuita): https://vercel.com/signup
2. **Repositório no GitHub/GitLab/Bitbucket** (seu código já deve estar versionado)
3. **Chaves do Supabase** (já deve ter)

---

## 🔑 Variáveis de Ambiente Necessárias

Você precisa configurar estas variáveis no Vercel:

### Obrigatórias:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Onde encontrar: Supabase Dashboard → Settings → API → Project URL
   - Formato: `https://xxxxxxxxxxxxx.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Onde encontrar: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`
   - Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Onde encontrar: Supabase Dashboard → Settings → API → Project API keys → `service_role` `secret`
   - ⚠️ **CUIDADO**: Esta chave é secreta! Não compartilhe publicamente.
   - Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Opcionais (se usar):

4. **OPENAI_API_KEY** (se usar geração de posts/imagens)
   - Onde encontrar: OpenAI Dashboard → API Keys
   - Formato: `sk-...`

---

## 📝 Passo a Passo para Deploy

### **Opção 1: Via Dashboard Vercel (Recomendado para iniciantes)**

1. **Acesse o Vercel:**
   - Vá em https://vercel.com
   - Faça login com GitHub/GitLab/Bitbucket

2. **Importe seu projeto:**
   - Clique em "Add New Project"
   - Selecione seu repositório (voltris-seo-optimized-main ou similar)
   - Clique em "Import"

3. **Configure o projeto:**
   - **Framework Preset**: Next.js (deve detectar automaticamente)
   - **Root Directory**: `./` (deixe padrão)
   - **Build Command**: `npm run build` (já configurado)
   - **Output Directory**: `.next` (já configurado)
   - **Install Command**: `npm install` (já configurado)

4. **Adicione as variáveis de ambiente:**
   - Role até "Environment Variables"
   - Adicione cada variável uma por uma:
     ```
     Name: NEXT_PUBLIC_SUPABASE_URL
     Value: [sua URL do Supabase]
     ✅ Marque: Production, Preview, Development
     ```
     Repita para:
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `OPENAI_API_KEY` (se usar)

5. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build (pode levar 2-5 minutos)
   - ✅ Pronto! Seu site estará no ar!

---

### **Opção 2: Via CLI (Para usuários avançados)**

1. **Instale o Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Faça login:**
   ```bash
   vercel login
   ```

3. **No diretório do projeto:**
   ```bash
   cd "d:\Desktop\voltris-seo-optimized-main"
   vercel
   ```

4. **Siga as perguntas:**
   - Set up and deploy? → **Y**
   - Which scope? → Selecione sua conta
   - Link to existing project? → **N** (primeira vez)
   - Project name? → **voltris** (ou outro nome)
   - Directory? → `./`
   - Override settings? → **N**

5. **Adicione variáveis de ambiente:**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   # Cole o valor quando solicitado
   # Selecione: Production, Preview, Development
   
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add OPENAI_API_KEY
   ```

6. **Deploy:**
   ```bash
   vercel --prod
   ```

---

## ✅ Configurações Adicionais Recomendadas

### **Domínio Personalizado (Opcional)**

1. No Vercel Dashboard → Seu Projeto → Settings → Domains
2. Adicione seu domínio: `voltris.com.br`
3. Siga as instruções para configurar DNS:
   - Adicione um registro `CNAME` apontando para o domínio fornecido pelo Vercel
   - Ou um registro `A` se o Vercel pedir

### **Configurações de Build**

O arquivo `vercel.json` já está configurado com:
- ✅ Build command
- ✅ Headers de segurança
- ✅ Cache para sitemap/robots.txt
- ✅ Timeout para API routes (30s)

---

## 🧪 Testar após o Deploy

1. **Verifique se o site está funcionando:**
   - Acesse a URL fornecida pelo Vercel (ex: `voltris.vercel.app`)
   - Teste navegação básica
   - Verifique se as páginas principais carregam

2. **Teste funcionalidades:**
   - Login/Cadastro (Supabase)
   - Páginas de serviços
   - Blog
   - Guias

3. **Verifique logs (se houver erros):**
   - Vercel Dashboard → Seu Projeto → Deployments → Clique no deployment → Logs

---

## 🐛 Problemas Comuns

### **Erro: "Missing environment variable"**
- **Solução**: Verifique se todas as variáveis estão configuradas no Vercel
- Vá em Settings → Environment Variables e confirme que estão marcadas para Production

### **Erro: "Build failed"**
- **Solução**: Verifique os logs no Vercel
- Common issues:
  - Node version incompatível (precisa Node 18+)
  - Dependências faltando
  - Erro de TypeScript

### **Erro: "Supabase connection failed"**
- **Solução**: 
  - Verifique se as URLs e keys estão corretas
  - Confirme que o Supabase permite conexões do domínio Vercel

---

## 📊 Monitoramento

Após o deploy, monitore:
- **Vercel Analytics**: Ver tráfego e performance
- **Logs**: Ver erros em tempo real
- **Deployments**: Histórico de deploys

---

## 🔄 Deploy Automático

O Vercel faz deploy automático quando você:
- Faz push para a branch `main` ou `master`
- Faz merge de Pull Request
- Clique em "Redeploy" no dashboard

---

## 📞 Precisa de Ajuda?

Se tiver problemas:
1. Verifique os logs no Vercel Dashboard
2. Confirme que todas as variáveis estão configuradas
3. Verifique a documentação: https://vercel.com/docs

---

**Próximos Passos Após Deploy:**
1. ✅ Configurar domínio personalizado (se tiver)
2. ✅ Verificar Google Search Console
3. ✅ Testar AdSense (já está configurado)
4. ✅ Monitorar performance

