# Script de Deploy para Vercel
Write-Host "=== Deploy Voltris para Vercel ===" -ForegroundColor Green

# Verificar Node.js
$nodePath = $null
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodePath = "node"
    Write-Host "Node.js encontrado no PATH" -ForegroundColor Green
} else {
    $possiblePaths = @(
        "C:\Program Files\nodejs\node.exe",
        "$env:APPDATA\npm\node.exe",
        "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $nodePath = $path
            Write-Host "Node.js encontrado em: $path" -ForegroundColor Green
            break
        }
    }
}

if (-not $nodePath) {
    Write-Host "ERRO: Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Node.js de: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar se está no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "ERRO: package.json não encontrado!" -ForegroundColor Red
    Write-Host "Execute este script dentro da pasta 'Site Voltris'" -ForegroundColor Yellow
    exit 1
}

# Verificar variáveis de ambiente necessárias
Write-Host "`n=== Verificando Variáveis de Ambiente ===" -ForegroundColor Cyan
$requiredVars = @(
    "MP_ACCESS_TOKEN",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
)

$missingVars = @()
foreach ($var in $requiredVars) {
    if (-not $env:$var) {
        $missingVars += $var
        Write-Host "  ❌ $var não configurada" -ForegroundColor Red
    } else {
        Write-Host "  ✅ $var configurada" -ForegroundColor Green
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "`n⚠️  ATENÇÃO: Algumas variáveis não estão configuradas!" -ForegroundColor Yellow
    Write-Host "Configure-as no Vercel Dashboard após o deploy." -ForegroundColor Yellow
}

# Instalar dependências se necessário
if (-not (Test-Path "node_modules")) {
    Write-Host "`n=== Instalando Dependências ===" -ForegroundColor Cyan
    & $nodePath "$(Split-Path $nodePath)\npm.cmd" install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
}

# Fazer build
Write-Host "`n=== Fazendo Build ===" -ForegroundColor Cyan
& $nodePath "$(Split-Path $nodePath)\npm.cmd" run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO no build!" -ForegroundColor Red
    exit 1
}

# Deploy no Vercel
Write-Host "`n=== Fazendo Deploy no Vercel ===" -ForegroundColor Cyan
Write-Host "Isso abrirá o navegador para autenticação..." -ForegroundColor Yellow

& $nodePath "$(Split-Path $nodePath)\npx.cmd" vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deploy concluído com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Erro no deploy. Verifique os logs acima." -ForegroundColor Red
}


