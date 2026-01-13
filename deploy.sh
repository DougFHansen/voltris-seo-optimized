#!/bin/bash

echo "🚀 PREPARANDO DEPLOY PARA PRODUÇÃO"
echo "=================================="
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
  echo "❌ Erro: package.json não encontrado"
  echo "Certifique-se de estar no diretório raiz do projeto"
  exit 1
fi

echo "✅ Diretório do projeto verificado"

# Criar build de produção
echo ""
echo "🔨 Criando build de produção..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Erro no build. Verificando problemas..."
  npm run type-check
  exit 1
fi

echo "✅ Build criado com sucesso"

# Verificar arquivos de configuração
echo ""
echo "📋 Verificando configurações:"
if [ -f "vercel.json" ]; then
  echo "✅ vercel.json encontrado"
else
  echo "❌ vercel.json não encontrado"
fi

if [ -f ".vercelignore" ]; then
  echo "✅ .vercelignore encontrado"
else
  echo "ℹ️  .vercelignore não encontrado (opcional)"
fi

echo ""
echo "📤 INSTRUÇÕES PARA DEPLOY:"
echo "========================="
echo ""
echo "1. Faça login no Vercel:"
echo "   vercel login"
echo ""
echo "2. Deploy para produção:"
echo "   vercel --prod"
echo ""
echo "3. Ou deploy com configurações específicas:"
echo "   vercel --prod --confirm"
echo ""
echo "🔧 CONFIGURAÇÕES NECESSÁRIAS NO DASHBOARD VERCEL:"
echo "================================================"
echo "- Variáveis de ambiente:"
echo "  NEXT_PUBLIC_SUPABASE_URL"
echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY"  
echo "  SUPABASE_SERVICE_ROLE_KEY"
echo "  MP_ACCESS_TOKEN"
echo "  MP_PUBLIC_KEY"
echo "  NEXT_PUBLIC_SITE_URL"
echo ""
echo "✅ PROJETO PRONTO PARA DEPLOY!"
echo "O sistema está otimizado e todos os testes foram removidos."