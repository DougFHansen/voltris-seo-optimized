# Script para deploy no Vercel
Write-Host "=== Voltris SEO Optimized - Deploy para Vercel ===" -ForegroundColor Green

# Verificar se o Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Erro: Node.js não encontrado. Por favor, instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o npm está instalado
try {
    $npmVersion = npm --version
    Write-Host "npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Erro: npm não encontrado. Por favor, instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Instalar dependências do projeto
Write-Host "Instalando dependências..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "Dependências instaladas com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao instalar dependências: $_" -ForegroundColor Red
    exit 1
}

# Instruções para deploy manual no Vercel
Write-Host "`n=== Instruções para Deploy no Vercel ===" -ForegroundColor Cyan
Write-Host "1. Acesse https://vercel.com" -ForegroundColor White
Write-Host "2. Faça login ou crie uma conta" -ForegroundColor White
Write-Host "3. Clique em 'New Project'" -ForegroundColor White
Write-Host "4. Importe o repositório 'voltris-seo-optimized' do GitHub" -ForegroundColor White
Write-Host "5. Configure as variáveis de ambiente:" -ForegroundColor White
Write-Host "   - Nome: MP_ACCESS_TOKEN" -ForegroundColor White
Write-Host "   - Valor: Seu token do Mercado Pago" -ForegroundColor White
Write-Host "6. Clique em 'Deploy'" -ForegroundColor White

Write-Host "`n=== Variáveis de Ambiente Necessárias ===" -ForegroundColor Cyan
Write-Host "MP_ACCESS_TOKEN = <seu_token_do_mercado_pago>" -ForegroundColor Yellow

Write-Host "`nDeploy preparado com sucesso! Siga as instruções acima para completar o deploy no Vercel." -ForegroundColor Green