# Driver Loading Fix - Changelog

## Problema Identificado
O kernel driver `LibreHardwareMonitor.sys` não estava carregando, resultando em:
- Timeout após 12 segundos
- Hardware control DISABLED
- MSR, Power Limits e BD PROCHOT inacessíveis

## Root Cause Analysis

### 1. Argumento Incorreto
- **Antes**: `/background` (não reconhecido pelo LibreHardwareMonitor.exe)
- **Depois**: `--minimized` (argumento documentado oficial)

### 2. Timeout Insuficiente
- **Antes**: 12 segundos
- **Depois**: 20 segundos (tempo suficiente para UAC + driver load + verificação de assinatura)

### 3. Processo Travado Não Detectado
- **Antes**: 3 tentativas (3s) para detectar processo travado
- **Depois**: 5 tentativas (5s) + melhor logging + cleanup de 2s após kill

### 4. Falta de Diagnóstico
- **Antes**: Apenas mensagem genérica de timeout
- **Depois**: Diagnóstico automático completo com verificação de:
  - Processo rodando
  - Serviço instalado
  - Arquivo do driver existente
  - Privilégios de administrador

### 5. Coordenação com GlobalThermalMonitor
- **Antes**: Timeout de 15s + 1s de estabilização
- **Depois**: Timeout de 25s + 2s de estabilização

## Mudanças Implementadas

### LowLevelHardwareService.cs

#### 1. Correção do Argumento
```csharp
// ANTES
Arguments = "/background"

// DEPOIS
Arguments = "--minimized"
```

#### 2. Aumento do Timeout
```csharp
// ANTES
for (int i = 0; i < 12; i++)

// DEPOIS
for (int i = 0; i < 20; i++)
```

#### 3. Melhor Detecção de Processo Travado
```csharp
// ANTES
for (int i = 0; i < 3; i++) // 3s

// DEPOIS
for (int i = 0; i < 5; i++) // 5s
await Task.Delay(2000); // Aguardar limpeza completa do driver
```

#### 4. Validação Robusta do Handle
```csharp
// ANTES
return handle;

// DEPOIS
if (handle != null && !handle.IsInvalid && !handle.IsClosed)
{
    return handle;
}
return null;
```

#### 5. Método de Diagnóstico Automático
```csharp
private async Task DiagnoseDriverFailureAsync()
{
    // Verifica:
    // - Processo rodando
    // - Serviço instalado
    // - Arquivo do driver
    // - Privilégios admin
}
```

#### 6. Melhor Inicialização via Library
```csharp
// ANTES
computer.IsCpuEnabled = true;
computer.Open();

// DEPOIS
computer.IsCpuEnabled = true;
computer.IsGpuEnabled = false; // Minimizar overhead
computer.IsMemoryEnabled = false;
// ... (desabilitar tudo exceto CPU)
await Task.Delay(3000); // Aguardar estabilização
```

### GlobalThermalMonitorService.cs

#### 1. Aumento do Timeout de Coordenação
```csharp
// ANTES
var timeoutTask = Task.Delay(15000);
await Task.Delay(1000);

// DEPOIS
var timeoutTask = Task.Delay(25000);
await Task.Delay(2000);
```

## Documentação Criada

### TROUBLESHOOTING_DRIVER.md
Guia completo de troubleshooting com:
- Causas comuns de falha
- Soluções passo a passo
- Diagnóstico manual
- Verificação de logs
- Modo fallback
- Solução definitiva

## Resultados Esperados

### Cenário 1: Driver Carrega com Sucesso
```
[LowLevelHW] 🛠️ Initializing Master Kernel Interface...
[LowLevelHW] 💡 Attempting silent driver initialization via library...
[LowLevelHW] ✅ Driver loaded successfully via library
[LowLevelHW] 🚀 MASTER INTERFACE ACTIVE (MSR + MMIO Sync Ready)
```

### Cenário 2: Driver Falha (com Diagnóstico)
```
[LowLevelHW] ⚠️ Driver initialization TIMEOUT after 20s
[LowLevelHW] 🔍 Running diagnostics...
[LowLevelHW] ✓ Process is running (PID: 1234)
[LowLevelHW] ✓ Driver file exists
[LowLevelHW] ✓ Running with administrator privileges
[LowLevelHW] ✗ Service is not running - driver may not be loaded
[LowLevelHW] 💡 Recommendation: Ensure Windows Defender/Antivirus is not blocking the driver
```

### Cenário 3: UAC Cancelado
```
[LowLevelHW] ⚠️ Failed to launch with elevation: The operation was canceled by the user
[LowLevelHW] User may have cancelled UAC prompt or insufficient permissions
```

## Próximos Passos para Teste

1. **Teste Normal**: Executar aplicação e verificar se driver carrega
2. **Teste UAC Cancelado**: Cancelar UAC e verificar mensagem apropriada
3. **Teste com Antivírus**: Verificar se diagnóstico detecta bloqueio
4. **Teste Processo Travado**: Simular processo travado e verificar cleanup

## Impacto

### Positivo
- ✅ Melhor taxa de sucesso no carregamento do driver
- ✅ Diagnóstico automático ajuda a identificar problemas
- ✅ Mensagens de erro mais claras e acionáveis
- ✅ Documentação completa para troubleshooting
- ✅ Melhor coordenação entre serviços

### Sem Impacto Negativo
- ✅ Modo fallback continua funcionando se driver falhar
- ✅ Aplicação não trava ou bloqueia
- ✅ Performance não afetada (timeouts são assíncronos)

## Versão
- Data: 2026-03-11
- Componentes Afetados: LowLevelHardwareService, GlobalThermalMonitorService
- Breaking Changes: Nenhum
- Compatibilidade: Mantida
