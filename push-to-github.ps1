# Script para fazer push do código para GitHub
# Execute este script no PowerShell como Administrador

Write-Host "🚀 Preparando push para GitHub..." -ForegroundColor Green

# Verificar se Git está instalado
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git não está instalado!" -ForegroundColor Red
    Write-Host "📥 Instale o Git primeiro: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "⏸️  Após instalar, reinicie o PowerShell e execute este script novamente" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "✅ Git encontrado!" -ForegroundColor Green

# Verificar se já é um repositório Git
if (Test-Path .git) {
    Write-Host "📁 Repositório Git já existe" -ForegroundColor Cyan
} else {
    Write-Host "🔨 Inicializando repositório Git..." -ForegroundColor Cyan
    git init
}

# Adicionar arquivos
Write-Host "📦 Adicionando arquivos..." -ForegroundColor Cyan
git add .

# Fazer commit
Write-Host "💾 Fazendo commit..." -ForegroundColor Cyan
git commit -m "Update: Site otimizado para AdSense - Guias completos, SEO 10/10, Página de Contato, Melhorias de layout"

# Verificar se remote já existe
$remoteExists = git remote get-url origin -ErrorAction SilentlyContinue
if ($remoteExists) {
    Write-Host "🔄 Remote já configurado: $remoteExists" -ForegroundColor Cyan
    $override = Read-Host "Deseja substituir? (s/N)"
    if ($override -eq "s" -or $override -eq "S") {
        git remote set-url origin https://github.com/DougFHansen/voltris-seo-optimized.git
    }
} else {
    Write-Host "🔗 Configurando repositório remoto..." -ForegroundColor Cyan
    git remote add origin https://github.com/DougFHansen/voltris-seo-optimized.git
}

# Verificar branch
$currentBranch = git branch --show-current
if (-not $currentBranch) {
    Write-Host "🌿 Criando branch main..." -ForegroundColor Cyan
    git branch -M main
}

# Push
Write-Host "⬆️  Fazendo push para GitHub..." -ForegroundColor Cyan
Write-Host "⚠️  Você será solicitado a fazer login no GitHub" -ForegroundColor Yellow

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
    Write-Host "🎉 Código enviado para: https://github.com/DougFHansen/voltris-seo-optimized" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no push. Verifique as mensagens acima." -ForegroundColor Red
}

pause

