# 🏗️ Arquitetura do Voltris Intelligence Framework (VIF) v1.0

## 📐 Diagrama UML Textual

```
┌─────────────────────────────────────────────────────────────────┐
│                    IVoltrisIntelligenceOrchestrator             │
│                         (Interface)                             │
├─────────────────────────────────────────────────────────────────┤
│ + Start() : void                                                │
│ + Stop() : void                                                 │
│ + IsActive : bool                                               │
│ + GetStatus() : IntelligenceStatus                              │
│ + ExecuteLoopAsync() : Task                                     │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ implements
                              │
┌─────────────────────────────────────────────────────────────────┐
│              IntelligenceOrchestratorService                     │
│                    (Implementação)                               │
├─────────────────────────────────────────────────────────────────┤
│ - _logger : ILoggingService                                     │
│ - _gameDetection : GameDetectionService                         │
│ - _hardwareProfiler : IHardwareProfiler                         │
│ - _gameIntelligence : IGameIntelligence                         │
│ - _frameTimeOptimizer : IFrameTimeOptimizer                     │
│ - _inputLagOptimizer : IInputLagOptimizer                       │
│ - _thermalMonitor : IThermalMonitor                            │
│ - _vramManager : IVramManager                                  │
│ - _networkIntelligence : INetworkIntelligence                   │
│ - _powerBalancer : IPowerBalancer                              │
│ - _loopTimer : Timer                                            │
│ - _isActive : bool                                              │
│ - _loopCount : long                                             │
│ - _currentGameProcess : Process                                 │
│ - _currentStatus : IntelligenceStatus                           │
├─────────────────────────────────────────────────────────────────┤
│ + Start() : void                                                │
│ + Stop() : void                                                 │
│ + ExecuteLoopAsync() : Task                                      │
│ + GetStatus() : IntelligenceStatus                              │
│ - ExecuteLoopCallback() : void                                  │
│ - DetectGame() : bool                                           │
│ - CalculateGameScore() : int                                    │
│ - OptimizeForGameAsync() : Task                                 │
│ - MaintainSystemOptimizationsAsync() : Task                     │
│ - MonitorThermals() : void                                      │
│ - MonitorVram() : void                                          │
│ - BalancePowerAsync() : Task                                    │
│ - RunPredictiveAnalysisAsync() : Task                           │
│ - OnGameStarted() : void                                        │
│ - OnGameStopped() : void                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      IntelligenceStatus                          │
│                        (Model)                                  │
├─────────────────────────────────────────────────────────────────┤
│ + IsGameRunning : bool                                          │
│ + GameProcessName : string                                      │
│ + GameProcessId : int?                                         │
│ + GameScore : int                                               │
│ + IsGamerModeActive : bool                                      │
│ + CpuTemperature : float                                        │
│ + GpuTemperature : float                                        │
│ + VramUsagePercent : float                                      │
│ + InputLatency : float                                          │
│ + AverageFrameTime : float                                      │
│ + PowerMode : string                                            │
│ + LastLoopExecution : DateTime                                  │
│ + LoopCount : long                                              │
│ + ActiveOptimizations : int                                     │
│ + StatusMessages : string[]                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

### 1. Inicialização

```
App.xaml.cs
    │
    ├─► services.AddGamerIntelligenceServices()
    │   └─► Registra serviços de inteligência existentes
    │
    ├─► services.AddVoltrisIntelligenceFramework()
    │   └─► Registra IntelligenceOrchestratorService
    │
    └─► vif.Start()
        ├─► Inicializa HardwareProfiler
        ├─► Inicia ThermalMonitor
        └─► Inicia Timer (1 segundo)
```

### 2. Loop Principal (1 segundo)

```
Timer Tick
    │
    └─► ExecuteLoopAsync()
        │
        ├─► DetectGame()
        │   └─► Verifica GameDetectionService
        │       └─► Atualiza _currentGameProcess
        │
        ├─► CalculateGameScore()
        │   ├─► Processo em primeiro plano? (+30)
        │   ├─► Uso de CPU alto? (+20)
        │   ├─► Uso de memória alto? (+20)
        │   ├─► Múltiplas threads? (+15)
        │   └─► Prioridade alta? (+15)
        │
        ├─► Se GameScore >= 50:
        │   │
        │   └─► OptimizeForGameAsync()
        │       ├─► FrameTimeOptimizer.StartMonitoring()
        │       ├─► InputLagOptimizer.OptimizeAsync()
        │       ├─► NetworkIntelligence.OptimizeForGameAsync()
        │       └─► VramManager.StartMonitoring()
        │
        ├─► Se GameScore < 50:
        │   │
        │   └─► MaintainSystemOptimizationsAsync()
        │       └─► Para monitoramentos específicos de jogo
        │
        ├─► MonitorThermals()
        │   └─► ThermalMonitor.CurrentThermal
        │       └─► Atualiza _currentStatus.CpuTemperature
        │       └─► Atualiza _currentStatus.GpuTemperature
        │
        ├─► Se jogo ativo:
        │   │
        │   └─► MonitorVram()
        │       └─► VramManager.CurrentStatus
        │           └─► Atualiza _currentStatus.VramUsagePercent
        │
        ├─► BalancePowerAsync()
        │   └─► PowerBalancer.GetOptimalPowerMode()
        │       └─► Atualiza _currentStatus.PowerMode
        │
        └─► RunPredictiveAnalysisAsync()
            ├─► Se temperatura > 85°C:
            │   └─► Ação preventiva de throttling
            │
            ├─► Se VRAM > 85%:
            │   └─► VramManager.FreeVramAsync()
            │
            └─► Se InputLatency > 20ms:
                └─► InputLagOptimizer.OptimizeAsync()
```

### 3. Eventos de Jogo

```
GameDetectionService
    │
    ├─► OnGameStarted Event
    │   └─► IntelligenceOrchestratorService.OnGameStarted()
    │       └─► Atualiza _currentGameProcess
    │       └─► Adiciona status message
    │
    └─► OnGameStopped Event
        └─► IntelligenceOrchestratorService.OnGameStopped()
            └─► Limpa _currentGameProcess
            └─► Adiciona status message
```

## 🔌 Integração com Serviços Existentes

### Serviços Utilizados (Não Duplicados)

1. **GameDetectionService** (`Services/GameDetectionService.cs`)
   - Usado para detectar jogos
   - Eventos: `OnGameStarted`, `OnGameStopped`
   - Não modificado pelo VIF

2. **IHardwareProfiler** (`Services/Gamer/Intelligence/Interfaces/`)
   - Usado para perfilar hardware
   - Método: `AnalyzeAsync()`
   - Propriedade: `CurrentProfile`

3. **IGameIntelligence** (`Services/Gamer/Intelligence/Interfaces/`)
   - Usado para análise de jogos
   - Método: `GetGameStrategy()`

4. **IFrameTimeOptimizer** (`Services/Gamer/Intelligence/Interfaces/`)
   - Usado para otimizar frame time
   - Métodos: `StartMonitoring()`, `StopMonitoring()`, `ApplyPreventiveFixesAsync()`
   - Propriedade: `CurrentMetrics`

5. **IInputLagOptimizer** (`Services/Gamer/Intelligence/Interfaces/`)
   - Usado para reduzir input lag
   - Métodos: `OptimizeAsync()`, `RestoreAsync()`
   - Propriedade: `CurrentLatency`

6. **IThermalMonitor** (`Services/Gamer/Intelligence/Interfaces/`)
   - Usado para monitorar temperaturas
   - Métodos: `StartMonitoring()`, `StopMonitoring()`, `IsThrottling()`, `GetRecommendedAction()`
   - Propriedade: `CurrentThermal`

7. **IVramManager** (`Services/Gamer/Intelligence/Interfaces/`)
   - Usado para gerenciar VRAM
   - Métodos: `StartMonitoring()`, `StopMonitoring()`, `ManageVramAsync()`, `FreeVramAsync()`
   - Propriedade: `CurrentStatus`

8. **INetworkIntelligence** (`Services/Gamer/Intelligence/Interfaces/`)
   - Usado para otimizar rede
   - Método: `OptimizeForGameAsync()`

9. **IPowerBalancer** (`Services/Gamer/Intelligence/Interfaces/`)
   - Usado para balancear energia
   - Método: `GetOptimalPowerMode()`

## 🧩 Padrões de Design Utilizados

### 1. **Orchestrator Pattern**
- O `IntelligenceOrchestratorService` coordena múltiplos serviços
- Centraliza a lógica de decisão
- Facilita manutenção e expansão

### 2. **Dependency Injection**
- Todos os serviços são injetados via construtor
- Facilita testes e substituição de implementações

### 3. **Observer Pattern**
- Subscreve eventos do `GameDetectionService`
- Reage a mudanças de estado (jogo iniciado/encerrado)

### 4. **Strategy Pattern**
- Diferentes estratégias baseadas em `GameScore`
- Otimizações diferentes para jogo vs. sistema normal

### 5. **Timer Pattern**
- Loop de 1 segundo usando `Timer`
- Execução assíncrona para não bloquear UI

## 🔒 Segurança e Resiliência

### Tratamento de Erros

1. **Try-Catch em Todos os Métodos**
   - Nenhuma exception não tratada
   - Logs detalhados de erros

2. **Validação de Null**
   - Verificação de `_currentGameProcess` antes de usar
   - Verificação de serviços antes de chamar métodos

3. **Fallbacks Seguros**
   - Se um serviço falhar, continua com outros
   - Não interrompe o loop principal

### Limites de Segurança

1. **Temperaturas**
   - Ação preventiva em 85°C
   - Throttling em 90°C
   - Emergência em 95°C

2. **VRAM**
   - Alerta em 85%
   - Ação em 90%
   - Crítico em 95%

3. **Input Latency**
   - Otimização automática em > 20ms

## 📊 Métricas e Monitoramento

### Métricas Coletadas

1. **Game Score** (0-100)
   - Calculado a cada loop
   - Baseado em heurísticas

2. **Temperaturas**
   - CPU e GPU
   - Atualizadas a cada loop

3. **VRAM Usage**
   - Percentual de uso
   - Atualizado quando jogo ativo

4. **Input Latency**
   - Milissegundos
   - Atualizado pelo InputLagOptimizer

5. **Frame Time**
   - Milissegundos
   - Atualizado pelo FrameTimeOptimizer

6. **Loop Count**
   - Número de loops executados
   - Útil para debugging

### Logs

- **Nível Info**: Inicialização, loops periódicos (a cada 60 loops)
- **Nível Warning**: Avisos de temperatura, VRAM, etc.
- **Nível Error**: Erros críticos com stack trace

## 🚀 Performance

### Otimizações

1. **Perfilamento de Hardware** (a cada 10 loops)
   - Evita overhead desnecessário
   - Hardware não muda frequentemente

2. **Logs Periódicos** (a cada 60 loops)
   - Reduz poluição de logs
   - Mantém informações importantes

3. **Execução Assíncrona**
   - Loop não bloqueia UI
   - Usa `Task.Run()` para execução em background

4. **Cache de Status**
   - `_currentStatus` é atualizado incrementalmente
   - `GetStatus()` retorna cópia (thread-safe)

## 📝 Extensibilidade

### Como Adicionar Novo Módulo

1. **Criar Interface**
   ```csharp
   public interface INovoModulo
   {
       Task OtimizarAsync();
   }
   ```

2. **Registrar no DI**
   ```csharp
   services.AddSingleton<INovoModulo, NovoModulo>();
   ```

3. **Injetar no Orquestrador**
   ```csharp
   public IntelligenceOrchestratorService(
       ...,
       INovoModulo novoModulo)
   {
       _novoModulo = novoModulo;
   }
   ```

4. **Chamar no Loop**
   ```csharp
   private async Task ExecuteLoopAsync()
   {
       ...
       await _novoModulo.OtimizarAsync();
       ...
   }
   ```

---

**Versão**: 1.0.0  
**Data**: 2025-01-XX  
**Autor**: Voltris Intelligence Framework Team

