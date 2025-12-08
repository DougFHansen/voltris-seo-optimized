# Variáveis de Ambiente Necessárias no Vercel

Configure estas variáveis no Vercel Dashboard → Settings → Environment Variables:

## Obrigatórias:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - URL do seu projeto Supabase
   - Formato: `https://xxxxxxxxxxxxx.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Chave pública anônima do Supabase
   - Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Chave de serviço do Supabase (SECRETA)
   - Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. **MP_ACCESS_TOKEN**
   - Token de acesso do Mercado Pago
   - Formato: `APP_USR-...`

5. **NEXT_PUBLIC_SITE_URL**
   - URL do site em produção
   - Valor: `https://voltris.com.br`

## Opcionais:

6. **OPENAI_API_KEY** (se usar geração de posts/imagens)
   - Chave da API OpenAI
   - Formato: `sk-...`

## Como Configurar:

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em Settings → Environment Variables
4. Adicione cada variável acima
5. Marque todas para: Production, Preview, Development
6. Salve e faça um novo deploy

