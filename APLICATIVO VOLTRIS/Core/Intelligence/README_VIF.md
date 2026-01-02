# 🧠 Voltris Intelligence Framework (VIF) v1.0

## 📋 Visão Geral

O **Voltris Intelligence Framework (VIF)** é uma camada de inteligência avançada, modular e centralizada que orquestra todos os módulos de otimização do Voltris Optimizer.

### 🎯 Objetivos

- **Orquestração Centralizada**: Coordena todos os módulos de inteligência em um único ponto
- **Loop de 1 Segundo**: Executa análises e otimizações a cada 1 segundo
- **Integração Não-Invasiva**: Usa serviços existentes sem duplicação
- **Heurísticas Inteligentes**: Predições baseadas em análise contextual (sem ML)
- **100% Seguro**: Nenhuma modificação perigosa ao sistema

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
Core/Intelligence/
├── IVoltrisIntelligenceOrchestrator.cs      # Interface principal
├── IntelligenceOrchestratorService.cs       # Implementação do orquestrador
├── IntelligenceStatus.cs                    # Modelo de status
├── IntelligenceServiceExtensions.cs        # Extensões de registro DI
└── README_VIF.md                           # Esta documentação
```

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│         IntelligenceOrchestratorService (VIF)               │
│                    (Loop de 1 segundo)                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├──► GameDetectionService (existente)
                            │    └──► Detecta jogos
                            │
                            ├──► IHardwareProfiler (existente)
                            │    └──► Perfila hardware
                            │
                            ├──► IGameIntelligence (existente)
                            │    └──► Análise de jogos
                            │
                            ├──► IFrameTimeOptimizer (existente)
                            │    └──► Otimiza frame time
                            │
                            ├──► IInputLagOptimizer (existente)
                            │    └──► Reduz input lag
                            │
                            ├──► IThermalMonitor (existente)
                            │    └──► Monitora temperaturas
                            │
                            ├──► IVramManager (existente)
                            │    └──► Gerencia VRAM
                            │
                            ├──► INetworkIntelligence (existente)
                            │    └──► Otimiza rede
                            │
                            └──► IPowerBalancer (existente)
                                 └──► Balanceia energia
```

### Fluxo de Execução

```
1. Start() → Inicia timer de 1 segundo
2. Loop a cada 1 segundo:
   ├── DetectGame() → Verifica se há jogo rodando
   ├── CalculateGameScore() → Calcula score (0-100)
   ├── Se jogo detectado:
   │   ├── OptimizeForGameAsync()
   │   │   ├── FrameTimeOptimizer
   │   │   ├── InputLagOptimizer
   │   │   ├── NetworkIntelligence
   │   │   └── VramManager
   │   └── MonitorVram()
   ├── Se não há jogo:
   │   └── MaintainSystemOptimizationsAsync()
   ├── MonitorThermals() → Sempre ativo
   ├── BalancePowerAsync()
   └── RunPredictiveAnalysisAsync() → Heurísticas preditivas
```

---

## 🔧 Integração com o Projeto

### 1. Registro no DI (App.xaml.cs)

```csharp
// No método OnStartup, após registrar outros serviços:

// 1. Registrar serviços de inteligência de gaming (já existente)
services.AddGamerIntelligenceServices();

// 2. Registrar o Voltris Intelligence Framework
services.AddVoltrisIntelligenceFramework();

// 3. Build do ServiceProvider
_serviceProvider = services.BuildServiceProvider();
```

### 2. Inicialização no App.xaml.cs

```csharp
// Após construir o ServiceProvider:

// Iniciar o VIF
var vif = _serviceProvider.GetRequiredService<IVoltrisIntelligenceOrchestrator>();
vif.Start();

// Opcional: Salvar referência para acesso posterior
App.VoltrisIntelligence = vif;
```

### 3. Acesso ao Status

```csharp
// Em qualquer lugar do código:

var status = App.VoltrisIntelligence.GetStatus();

// Propriedades disponíveis:
// - status.IsGameRunning
// - status.GameProcessName
// - status.GameScore (0-100)
// - status.IsGamerModeActive
// - status.CpuTemperature
// - status.GpuTemperature
// - status.VramUsagePercent
// - status.InputLatency
// - status.AverageFrameTime
// - status.PowerMode
// - status.ActiveOptimizations
// - status.StatusMessages
```

---

## 🧠 Sistema de Game Score

O VIF calcula um "Game Score" interno (0-100) baseado em múltiplos fatores:

### Fatores de Cálculo

1. **Processo em Primeiro Plano** (30 pontos)
   - Se o processo do jogo está em primeiro plano

2. **Uso de CPU Alto** (20 pontos)
   - Se o processo usa CPU significativamente

3. **Uso de Memória Alto** (20 pontos)
   - Se o processo usa > 500MB de RAM

4. **Múltiplas Threads** (15 pontos)
   - Se o processo tem > 10 threads

5. **Prioridade Alta** (15 pontos)
   - Se o processo tem prioridade High ou RealTime

### Threshold

- **Score >= 50**: Modo Gamer ativado automaticamente
- **Score < 50**: Modo normal (otimizações básicas)

---

## 🔄 Loop de Inteligência

### Execução a Cada 1 Segundo

O loop executa as seguintes etapas:

1. **Detecção de Jogo**
   - Verifica se há jogo rodando
   - Usa GameDetectionService existente

2. **Cálculo de Game Score**
   - Calcula score baseado em heurísticas
   - Determina se modo gamer deve ser ativo

3. **Perfilamento de Hardware** (a cada 10 loops = 10 segundos)
   - Atualiza perfil de hardware
   - Evita overhead desnecessário

4. **Otimizações para Jogo** (se jogo detectado)
   - Frame Time Optimizer
   - Input Lag Optimizer
   - Network Intelligence
   - VRAM Manager

5. **Otimizações Básicas** (se não há jogo)
   - Mantém sistema otimizado
   - Não aplica otimizações agressivas

6. **Monitoramento Térmico** (sempre)
   - Monitora CPU e GPU
   - Detecta throttling

7. **Monitoramento de VRAM** (se jogo ativo)
   - Monitora uso de VRAM
   - Alerta se crítico (>90%)

8. **Balanceamento de Energia**
   - Decide modo de energia ótimo
   - Baseado em hardware e uso

9. **Análises Preditivas**
   - Predição de throttling iminente
   - Predição de VRAM crítica
   - Predição de input lag alto

---

## 🛡️ Segurança e Limites

### Regras de Segurança

1. **Nenhuma Modificação Perigosa**
   - Não altera drivers
   - Não altera BIOS/ACPI/SMBus/VBIOS
   - Não faz modificações kernel-level

2. **Totalmente Reversível**
   - Todas as otimizações podem ser revertidas
   - Sistema de rollback implementado

3. **Respeita Limites**
   - Não força otimizações além dos limites seguros
   - Valida hardware antes de aplicar otimizações

4. **Tratamento de Erros**
   - Zero exceptions não tratadas
   - Logs detalhados de erros
   - Fallbacks seguros

---

## 📊 Monitoramento e Logs

### Logs

O VIF gera logs detalhados:

- **Inicialização**: `[VIF] Voltris Intelligence Framework iniciado`
- **Loop**: `[VIF] Loop #X executado em Yms` (a cada 60 loops = 1 minuto)
- **Jogo Detectado**: `[VIF] Jogo detectado: Nome (PID: X)`
- **Jogo Encerrado**: `[VIF] Jogo encerrado: Nome (PID: X)`
- **Erros**: `[VIF] Erro: Mensagem`

### Status Messages

O VIF mantém as últimas 10 mensagens de status:

```csharp
var status = vif.GetStatus();
foreach (var msg in status.StatusMessages)
{
    Console.WriteLine(msg); // [HH:mm:ss] Mensagem
}
```

---

## 🚀 Expansão Futura (VIF v2.0)

### Possíveis Melhorias

1. **Machine Learning Real** (opcional)
   - Aprendizado de padrões de uso
   - Otimizações personalizadas por usuário

2. **Análise de Performance em Tempo Real**
   - Métricas mais detalhadas
   - Gráficos de performance

3. **Perfis de Jogo Personalizados**
   - Aprendizado por jogo
   - Otimizações específicas por jogo

4. **Integração com APIs Externas**
   - APIs de hardware (MSI Afterburner, etc.)
   - APIs de jogos (Steam, Epic, etc.)

5. **Sistema de Plugins**
   - Extensibilidade via plugins
   - Comunidade pode criar módulos

---

## 🔍 Troubleshooting

### VIF não inicia

1. Verificar se serviços de inteligência estão registrados:
   ```csharp
   services.AddGamerIntelligenceServices(); // Deve ser chamado antes
   ```

2. Verificar logs para erros de inicialização

3. Verificar se GameDetectionService está registrado

### Loop não executa

1. Verificar se `Start()` foi chamado
2. Verificar se `IsActive` é `true`
3. Verificar logs para erros no loop

### Otimizações não aplicam

1. Verificar `GameScore` (deve ser >= 50)
2. Verificar se jogo está detectado
3. Verificar logs de cada módulo

---

## 📝 Exemplo de Uso Completo

```csharp
// 1. No App.xaml.cs (registro)
services.AddGamerIntelligenceServices();
services.AddVoltrisIntelligenceFramework();

// 2. No App.xaml.cs (inicialização)
var vif = _serviceProvider.GetRequiredService<IVoltrisIntelligenceOrchestrator>();
vif.Start();

// 3. Em qualquer View/ViewModel (acesso ao status)
var status = App.VoltrisIntelligence.GetStatus();

if (status.IsGameRunning)
{
    Console.WriteLine($"Jogo: {status.GameProcessName}");
    Console.WriteLine($"Score: {status.GameScore}");
    Console.WriteLine($"CPU: {status.CpuTemperature}°C");
    Console.WriteLine($"GPU: {status.GpuTemperature}°C");
    Console.WriteLine($"VRAM: {status.VramUsagePercent}%");
}

// 4. Parar o VIF (ao fechar aplicação)
vif.Stop();
vif.Dispose();
```

---

## ✅ Checklist de Implementação

- [x] Estrutura de pastas criada
- [x] Interface principal (IVoltrisIntelligenceOrchestrator)
- [x] Implementação do orquestrador
- [x] Modelo de status (IntelligenceStatus)
- [x] Sistema de registro DI
- [x] Loop de 1 segundo
- [x] Integração com serviços existentes
- [x] Sistema de Game Score
- [x] Monitoramento térmico
- [x] Monitoramento de VRAM
- [x] Análises preditivas
- [x] Tratamento de erros
- [x] Logs detalhados
- [x] Documentação completa

---

**Versão**: 1.0.0  
**Data**: 2025-01-XX  
**Autor**: Voltris Intelligence Framework Team

