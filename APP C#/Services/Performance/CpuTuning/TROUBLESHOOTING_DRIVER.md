# LibreHardwareMonitor Driver Troubleshooting Guide

## Problema: Driver não carrega (Ring 0 optimizations DISABLED)

### Sintomas nos Logs
```
[LowLevelHW] ❌ Kernel driver unavailable. Ring 0 optimizations DISABLED.
[LowLevelHW] ⚠️ Driver initialization TIMEOUT after 20s
```

### Causas Comuns

#### 1. UAC (User Account Control) Cancelado
**Sintoma**: Processo não inicia ou retorna null
**Solução**: 
- Aceitar o prompt do UAC quando solicitado
- Executar Voltris Optimizer como Administrador
- Verificar logs: `Process.Start returned null - UAC may have been cancelled`

#### 2. Windows Defender / Antivírus Bloqueando
**Sintoma**: Processo inicia mas driver não carrega
**Solução**:
- Adicionar exceção para `LibreHardwareMonitor.exe` e `LibreHardwareMonitor.sys`
- Adicionar exceção para pasta completa do Voltris Optimizer
- Verificar quarentena do antivírus

#### 3. Driver Não Assinado (Windows 10/11)
**Sintoma**: Driver rejeitado pelo Windows
**Solução**:
- Desabilitar Secure Boot no BIOS/UEFI (temporariamente)
- Ou: Habilitar Test Mode: `bcdedit /set testsigning on` (requer reinicialização)
- Ou: Assinar o driver com certificado válido

#### 4. Conflito com Outros Drivers de Monitoramento
**Sintoma**: Driver trava ou não responde
**Solução**:
- Fechar HWiNFO, AIDA64, CPU-Z, GPU-Z, MSI Afterburner
- Esses programas podem bloquear acesso exclusivo ao hardware

#### 5. Permissões Insuficientes
**Sintoma**: Falha ao criar device handle
**Solução**:
- Executar como Administrador
- Verificar políticas de grupo que podem bloquear drivers

### Diagnóstico Automático

O sistema executa diagnóstico automático quando o driver falha:

```
[LowLevelHW] 🔍 Running diagnostics...
[LowLevelHW] ✓ Process is running (PID: 1234)
[LowLevelHW] ✓ Driver file exists
[LowLevelHW] ✓ Running with administrator privileges
[LowLevelHW] ✗ Service is not running - driver may not be loaded
```

### Verificação Manual

#### 1. Verificar se o driver está carregado
```powershell
# PowerShell como Admin
Get-Service | Where-Object {$_.Name -like "*LibreHardware*"}
```

#### 2. Verificar processos
```powershell
Get-Process | Where-Object {$_.Name -like "*LibreHardware*"}
```

#### 3. Verificar logs do Windows
```
Event Viewer > Windows Logs > System
Filtrar por: Kernel-PnP, Service Control Manager
```

### Modo Fallback

Se o driver não carregar, o sistema opera em **Modo Fallback**:
- ✅ Leitura de sensores via biblioteca (funciona)
- ❌ Controle MSR (Power Limits) - DESABILITADO
- ❌ Controle BD PROCHOT - DESABILITADO
- ❌ Leitura de throttling flags - DESABILITADO

**Impacto**: CPU Tuning Module não consegue aplicar otimizações de hardware, mas o sistema continua funcional.

### Solução Definitiva

Para garantir que o driver carregue sempre:

1. **Instalar como Serviço** (requer admin):
```cmd
sc create LibreHardwareMonitor binPath= "C:\Path\To\LibreHardwareMonitor.sys" type= kernel start= demand
```

2. **Adicionar Exceções de Segurança**:
- Windows Defender: Settings > Virus & threat protection > Exclusions
- Adicionar pasta completa do Voltris Optimizer

3. **Executar sempre como Admin**:
- Propriedades do executável > Compatibility > Run as administrator

### Logs Importantes

Procurar por estas mensagens nos logs:

**Sucesso**:
```
[LowLevelHW] 🚀 MASTER INTERFACE ACTIVE (MSR + MMIO Sync Ready)
[LowLevelHW] ✅ Ring 0 Driver active. Handle obtained after Xs
```

**Falha**:
```
[LowLevelHW] ❌ Kernel driver unavailable
[LowLevelHW] ⚠️ Driver initialization TIMEOUT
[LowLevelHW] ✗ Process is NOT running - UAC may have been cancelled
```

### Contato Suporte

Se o problema persistir após seguir este guia:
1. Coletar logs completos da aplicação
2. Executar diagnóstico automático
3. Verificar Event Viewer do Windows
4. Reportar com informações do sistema (Windows version, antivirus, etc.)
