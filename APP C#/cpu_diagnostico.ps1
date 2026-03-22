# Diagnostico de CPU - PowerShell (sem dependencias externas)
# Identifica causa raiz de uso excessivo de CPU

$DURACAO = 60
$INTERVALO = 3
$LIMITE_CPU = 5.0

function Formatar-Bytes($bytes) {
    if ($bytes -gt 1GB) { return "{0:N1} GB" -f ($bytes / 1GB) }
    if ($bytes -gt 1MB) { return "{0:N1} MB" -f ($bytes / 1MB) }
    if ($bytes -gt 1KB) { return "{0:N1} KB" -f ($bytes / 1KB) }
    return "$bytes B"
}

Write-Host ""
Write-Host ("="*60)
Write-Host "  DIAGNOSTICO DE SISTEMA - CPU & PERFORMANCE"
Write-Host ("  " + (Get-Date -Format "dd/MM/yyyy HH:mm:ss"))
Write-Host ("="*60)

# Info CPU
$cpu = Get-WmiObject Win32_Processor
$loadNow = (Get-WmiObject Win32_Processor).LoadPercentage
Write-Host ""
Write-Host "[CPU]"
Write-Host ("  Modelo     : " + $cpu.Name.Trim())
Write-Host ("  Nucleos    : " + $cpu.NumberOfCores + " fisicos | " + $cpu.NumberOfLogicalProcessors + " logicos")
Write-Host ("  Uso atual  : " + $loadNow + "%")
if ($loadNow -gt 80) {
    Write-Host "  *** CPU JA ESTA ACIMA DE 80% AGORA ***" -ForegroundColor Red
}

# Frequencia atual via WMI
$freqAtual = $cpu.CurrentClockSpeed
$freqMax   = $cpu.MaxClockSpeed
Write-Host ("  Freq atual : " + $freqAtual + " MHz | Max: " + $freqMax + " MHz")
$pct = [math]::Round(($freqAtual / $freqMax) * 100, 1)
Write-Host ("  Freq %     : " + $pct + "%")
if ($pct -lt 60) {
    Write-Host "  *** THROTTLING DETECTADO - CPU rodando abaixo de 60% da frequencia maxima! ***" -ForegroundColor Yellow
    Write-Host "  Verifique: plano de energia, temperatura, configuracao de bateria." -ForegroundColor Yellow
}

# Plano de energia
Write-Host ""
Write-Host "[Plano de Energia]"
$plano = powercfg /getactivescheme 2>$null
Write-Host ("  " + $plano)
if ($plano -match "Economia" -or $plano -match "Power saver" -or $plano -match "economizador") {
    Write-Host "  *** PLANO DE ECONOMIA ATIVO - isso limita a CPU diretamente! ***" -ForegroundColor Red
    Write-Host "  Mude para Alto Desempenho: powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c" -ForegroundColor Yellow
}

# RAM
Write-Host ""
Write-Host "[Memoria RAM]"
$os = Get-WmiObject Win32_OperatingSystem
$totalRAM  = $os.TotalVisibleMemorySize * 1KB
$livreRAM  = $os.FreePhysicalMemory * 1KB
$usadaRAM  = $totalRAM - $livreRAM
$pctRAM    = [math]::Round(($usadaRAM / $totalRAM) * 100, 1)
Write-Host ("  Total : " + (Formatar-Bytes $totalRAM))
Write-Host ("  Usada : " + (Formatar-Bytes $usadaRAM) + " (" + $pctRAM + "%)")
Write-Host ("  Livre : " + (Formatar-Bytes $livreRAM))

$swap = Get-WmiObject Win32_PageFileUsage
if ($swap) {
    foreach ($s in $swap) {
        $swapUsado = $s.CurrentUsage * 1MB
        if ($swapUsado -gt 100MB) {
            Write-Host ("  *** PAGEFILE EM USO: " + (Formatar-Bytes $swapUsado) + " - pressao de memoria! ***") -ForegroundColor Yellow
        }
    }
}

# Temperatura via WMI (nem sempre disponivel)
Write-Host ""
Write-Host "[Temperatura]"
try {
    $temps = Get-WmiObject MSAcpi_ThermalZoneTemperature -Namespace "root/wmi" -ErrorAction Stop
    foreach ($t in $temps) {
        $celsius = [math]::Round(($t.CurrentTemperature - 2732) / 10, 1)
        $alerta = if ($celsius -gt 90) { " *** CRITICO ***" } elseif ($celsius -gt 80) { " (alto)" } else { "" }
        Write-Host ("  " + $t.InstanceName + ": " + $celsius + " C" + $alerta)
    }
} catch {
    Write-Host "  (WMI nao retornou dados de temperatura - use HWMonitor para isso)"
}

# Monitoramento de processos
Write-Host ""
Write-Host ("="*60)
Write-Host ("  MONITORANDO PROCESSOS POR $DURACAO segundos...")
Write-Host "  Reproduza o engasgo agora (abra apps, Explorer, etc.)"
Write-Host ("="*60)
Write-Host ""

$acumulado = @{}
$iteracoes = [math]::Floor($DURACAO / $INTERVALO)

# Primeira leitura baseline
Get-Process | ForEach-Object {
    try { $_.CPU } catch {}
} | Out-Null
Start-Sleep -Seconds $INTERVALO

for ($i = 0; $i -lt $iteracoes; $i++) {
    $ts = Get-Date -Format "HH:mm:ss"
    
    $procs = Get-Process | Where-Object { $_.CPU -ne $null } | 
             Sort-Object CPU -Descending | 
             Select-Object -First 8

    Write-Host "[$ts] Top processos (CPU acumulada):"
    foreach ($p in $procs) {
        $cpuVal = [math]::Round($p.CPU, 1)
        $memVal = $p.WorkingSet64
        $nome   = $p.ProcessName
        Write-Host ("  {0,-35} CPU: {1,8}s  RAM: {2}" -f $nome, $cpuVal, (Formatar-Bytes $memVal))

        if (-not $acumulado.ContainsKey($p.Id)) {
            $acumulado[$p.Id] = @{ Nome = $nome; CpuAmostras = @(); Mem = $memVal }
        }
        $acumulado[$p.Id].CpuAmostras += $cpuVal
        $acumulado[$p.Id].Mem = $memVal
    }
    Write-Host ""

    if ($i -lt $iteracoes - 1) { Start-Sleep -Seconds $INTERVALO }
}

# Relatorio final
Write-Host ("="*60)
Write-Host "  RELATORIO FINAL"
Write-Host ("="*60)
Write-Host ""

# Pega uso de CPU por processo no momento atual (% real)
$snapshot = Get-WmiObject Win32_PerfFormattedData_PerfProc_Process |
            Where-Object { $_.Name -ne "_Total" -and $_.Name -ne "Idle" } |
            Sort-Object PercentProcessorTime -Descending |
            Select-Object -First 20

Write-Host ("{0,-35} {1,10} {2,12}" -f "Processo", "CPU %", "RAM")
Write-Host ("-"*60)
foreach ($p in $snapshot) {
    $cpuPct = [math]::Round($p.PercentProcessorTime / $env:NUMBER_OF_PROCESSORS, 1)
    if ($cpuPct -lt 1) { continue }
    
    # Pega RAM do Get-Process
    $proc = Get-Process -Name $p.Name -ErrorAction SilentlyContinue | Select-Object -First 1
    $mem  = if ($proc) { Formatar-Bytes $proc.WorkingSet64 } else { "N/A" }
    
    Write-Host ("  {0,-33} {1,9}%  {2}" -f $p.Name, $cpuPct, $mem)
}

# Diagnostico automatico
Write-Host ""
Write-Host "[Diagnostico Automatico]"

$top = $snapshot | Select-Object -First 5
foreach ($p in $top) {
    $cpuPct = [math]::Round($p.PercentProcessorTime / $env:NUMBER_OF_PROCESSORS, 1)
    if ($cpuPct -lt 10) { continue }
    
    $nome = $p.Name.ToLower()
    Write-Host ""
    Write-Host ("  -> " + $p.Name + " (" + $cpuPct + "%)") -ForegroundColor Cyan
    
    switch -Wildcard ($nome) {
        "*msmpeng*"        { Write-Host "     Windows Defender fazendo scan. Adicione exclusoes nas pastas de trabalho." -ForegroundColor Yellow }
        "*antimalware*"    { Write-Host "     Windows Defender fazendo scan. Adicione exclusoes nas pastas de trabalho." -ForegroundColor Yellow }
        "*searchindexer*"  { Write-Host "     Indexacao do Windows em andamento. Desative em Propriedades do disco > Indexacao." -ForegroundColor Yellow }
        "*tiworker*"       { Write-Host "     Windows Update preparando atualizacoes. Aguarde ou pause updates." -ForegroundColor Yellow }
        "*wuauclt*"        { Write-Host "     Windows Update baixando atualizacoes." -ForegroundColor Yellow }
        "*svchost*"        { Write-Host "     Servico Windows em background. Abra resmon.exe para ver qual servico especifico." -ForegroundColor Yellow }
        "*chrome*"         { Write-Host "     Navegador com muitas abas/extensoes." -ForegroundColor Yellow }
        "*msedge*"         { Write-Host "     Edge com muitas abas/extensoes." -ForegroundColor Yellow }
        "*steam*"          { Write-Host "     Steam atualizando ou fazendo scan de arquivos." -ForegroundColor Yellow }
        "*compattelrunner*"{ Write-Host "     Telemetria do Windows coletando dados. Pode ser desativado." -ForegroundColor Yellow }
        "*runtime broker*" { Write-Host "     Apps UWP/Store consumindo recursos. Verifique apps em background." -ForegroundColor Yellow }
        default            { Write-Host "     Investigar no Resource Monitor: resmon.exe" -ForegroundColor Gray }
    }
}

# Verifica throttling no final
$cpuFinal = Get-WmiObject Win32_Processor
$pctFinal = [math]::Round(($cpuFinal.CurrentClockSpeed / $cpuFinal.MaxClockSpeed) * 100, 1)
if ($pctFinal -lt 60) {
    Write-Host ""
    Write-Host "  *** THROTTLING CONFIRMADO: CPU a $pctFinal% da frequencia maxima ***" -ForegroundColor Red
    Write-Host "  Causa mais provavel: plano de energia em economia ou temperatura alta." -ForegroundColor Red
}

Write-Host ""
Write-Host ("="*60)
Write-Host "  Diagnostico concluido."
Write-Host ("="*60)
Write-Host ""
