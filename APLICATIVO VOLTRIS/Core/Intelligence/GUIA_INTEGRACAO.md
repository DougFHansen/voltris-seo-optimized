# 🚀 Guia de Integração - Voltris Intelligence Framework (VIF) v1.0

## 📋 Pré-requisitos

Antes de integrar o VIF, certifique-se de que:

1. ✅ Os serviços de inteligência de gaming estão registrados
2. ✅ O `GameDetectionService` está registrado
3. ✅ O projeto está usando .NET 8.0
4. ✅ O projeto está usando Dependency Injection (Microsoft.Extensions.DependencyInjection)

---

## 🔧 Passo 1: Registro no DI

### No arquivo `App.xaml.cs`

Localize o método `OnStartup` e adicione o registro do VIF:

```csharp
protected override async void OnStartup(StartupEventArgs e)
{
    base.OnStartup(e);
    
    // ... código existente ...
    
    var services = new ServiceCollection();
    
    // 1. Registrar serviços existentes (se ainda não estiver)
    services.AddSingleton<ILoggingService>(_loggingService);
    services.AddSingleton<GameDetectionService>();
    
    // 2. Registrar serviços de inteligência de gaming (OBRIGATÓRIO - deve vir antes)
    services.AddGamerIntelligenceServices();
    
    // 3. Registrar o Voltris Intelligence Framework
    services.AddVoltrisIntelligenceFramework();
    
    // 4. Build do ServiceProvider
    _serviceProvider = services.BuildServiceProvider();
    Services = _serviceProvider;
    
    // ... resto do código ...
}
```

**⚠️ IMPORTANTE**: `AddGamerIntelligenceServices()` deve ser chamado **ANTES** de `AddVoltrisIntelligenceFramework()`.

---

## 🎬 Passo 2: Inicialização

### No arquivo `App.xaml.cs`

Após construir o `ServiceProvider`, inicie o VIF:

```csharp
// Após _serviceProvider = services.BuildServiceProvider();

try
{
    // Iniciar o Voltris Intelligence Framework
    var vif = _serviceProvider.GetRequiredService<IVoltrisIntelligenceOrchestrator>();
    vif.Start();
    
    // Opcional: Salvar referência para acesso global
    App.VoltrisIntelligence = vif;
    
    _loggingService?.LogInfo("[App] Voltris Intelligence Framework iniciado");
}
catch (Exception ex)
{
    _loggingService?.LogError($"[App] Erro ao iniciar VIF: {ex.Message}", ex);
    // Continuar mesmo se VIF falhar (não é crítico)
}
```

### Adicionar propriedade estática no `App.xaml.cs`

```csharp
public partial class App : Application
{
    // ... código existente ...
    
    /// <summary>
    /// Referência global ao Voltris Intelligence Framework
    /// </summary>
    public static IVoltrisIntelligenceOrchestrator? VoltrisIntelligence { get; set; }
    
    // ... resto do código ...
}
```

---

## 📊 Passo 3: Acesso ao Status

### Em qualquer View/ViewModel

```csharp
using VoltrisOptimizer.Core.Intelligence;

// Obter status
var status = App.VoltrisIntelligence?.GetStatus();

if (status != null)
{
    // Verificar se há jogo rodando
    if (status.IsGameRunning)
    {
        Console.WriteLine($"Jogo: {status.GameProcessName}");
        Console.WriteLine($"Score: {status.GameScore}/100");
        Console.WriteLine($"Modo Gamer: {status.IsGamerModeActive}");
    }
    
    // Temperaturas
    Console.WriteLine($"CPU: {status.CpuTemperature}°C");
    Console.WriteLine($"GPU: {status.GpuTemperature}°C");
    
    // VRAM
    Console.WriteLine($"VRAM: {status.VramUsagePercent}%");
    
    // Performance
    Console.WriteLine($"Input Latency: {status.InputLatency}ms");
    Console.WriteLine($"Frame Time: {status.AverageFrameTime}ms");
    
    // Energia
    Console.WriteLine($"Power Mode: {status.PowerMode}");
    
    // Estatísticas
    Console.WriteLine($"Loops executados: {status.LoopCount}");
    Console.WriteLine($"Otimizações ativas: {status.ActiveOptimizations}");
    
    // Mensagens de status
    foreach (var msg in status.StatusMessages)
    {
        Console.WriteLine(msg);
    }
}
```

---

## 🎮 Passo 4: Integração com GamerView

### Exemplo de uso no `GamerView.xaml.cs`

```csharp
using VoltrisOptimizer.Core.Intelligence;

public partial class GamerView : UserControl
{
    private DispatcherTimer? _statusTimer;
    
    public GamerView()
    {
        InitializeComponent();
        
        // Atualizar status a cada 2 segundos
        _statusTimer = new DispatcherTimer
        {
            Interval = TimeSpan.FromSeconds(2)
        };
        _statusTimer.Tick += UpdateIntelligenceStatus;
        _statusTimer.Start();
    }
    
    private void UpdateIntelligenceStatus(object? sender, EventArgs e)
    {
        var status = App.VoltrisIntelligence?.GetStatus();
        if (status == null) return;
        
        // Atualizar UI com status
        if (status.IsGameRunning)
        {
            GameNameTextBlock.Text = status.GameProcessName ?? "Unknown";
            GameScoreTextBlock.Text = $"Score: {status.GameScore}/100";
            GamerModeActiveIndicator.Visibility = status.IsGamerModeActive 
                ? Visibility.Visible 
                : Visibility.Collapsed;
        }
        else
        {
            GameNameTextBlock.Text = "Nenhum jogo detectado";
            GameScoreTextBlock.Text = "";
            GamerModeActiveIndicator.Visibility = Visibility.Collapsed;
        }
        
        // Atualizar temperaturas
        CpuTempTextBlock.Text = $"{status.CpuTemperature:F1}°C";
        GpuTempTextBlock.Text = $"{status.GpuTemperature:F1}°C";
        
        // Atualizar VRAM
        VramUsageTextBlock.Text = $"{status.VramUsagePercent:F1}%";
        
        // Atualizar performance
        InputLatencyTextBlock.Text = $"{status.InputLatency:F1}ms";
        FrameTimeTextBlock.Text = $"{status.AverageFrameTime:F1}ms";
    }
    
    protected override void OnUnloaded(RoutedEventArgs e)
    {
        _statusTimer?.Stop();
        base.OnUnloaded(e);
    }
}
```

---

## 🛑 Passo 5: Parar o VIF (ao fechar aplicação)

### No arquivo `App.xaml.cs`

```csharp
protected override void OnExit(ExitEventArgs e)
{
    try
    {
        // Parar o VIF
        App.VoltrisIntelligence?.Stop();
        App.VoltrisIntelligence?.Dispose();
    }
    catch (Exception ex)
    {
        _loggingService?.LogError($"[App] Erro ao parar VIF: {ex.Message}", ex);
    }
    
    base.OnExit(e);
}
```

---

## ✅ Checklist de Integração

- [ ] Serviços de inteligência registrados (`AddGamerIntelligenceServices()`)
- [ ] VIF registrado (`AddVoltrisIntelligenceFramework()`)
- [ ] VIF inicializado (`vif.Start()`)
- [ ] Referência global salva (`App.VoltrisIntelligence`)
- [ ] VIF parado ao fechar (`vif.Stop()` e `Dispose()`)
- [ ] UI atualizada com status (opcional)
- [ ] Logs verificados para erros

---

## 🐛 Troubleshooting

### Erro: "Service not registered"

**Causa**: Serviços de inteligência não foram registrados antes do VIF.

**Solução**: Certifique-se de chamar `AddGamerIntelligenceServices()` **antes** de `AddVoltrisIntelligenceFramework()`.

### Erro: "NullReferenceException"

**Causa**: Tentativa de acessar `App.VoltrisIntelligence` antes de ser inicializado.

**Solução**: Sempre verifique se é `null` antes de usar:
```csharp
if (App.VoltrisIntelligence != null)
{
    var status = App.VoltrisIntelligence.GetStatus();
}
```

### VIF não inicia

**Causa**: Erro na inicialização de algum serviço dependente.

**Solução**: Verifique os logs para identificar qual serviço está falhando.

### Loop não executa

**Causa**: `Start()` não foi chamado ou `IsActive` é `false`.

**Solução**: Verifique se `vif.Start()` foi chamado e se `vif.IsActive` é `true`.

### Otimizações não aplicam

**Causa**: `GameScore` pode estar abaixo de 50 (threshold).

**Solução**: Verifique o `GameScore` no status. Se estiver < 50, o modo gamer não será ativado.

---

## 📝 Exemplo Completo de Integração

```csharp
// App.xaml.cs

protected override async void OnStartup(StartupEventArgs e)
{
    base.OnStartup(e);
    
    // ... código existente de inicialização ...
    
    var services = new ServiceCollection();
    
    // Registrar serviços base
    services.AddSingleton<ILoggingService>(_loggingService);
    services.AddSingleton<GameDetectionService>();
    
    // Registrar serviços de inteligência (OBRIGATÓRIO - antes do VIF)
    services.AddGamerIntelligenceServices();
    
    // Registrar VIF
    services.AddVoltrisIntelligenceFramework();
    
    // Build
    _serviceProvider = services.BuildServiceProvider();
    Services = _serviceProvider;
    
    // Iniciar VIF
    try
    {
        var vif = _serviceProvider.GetRequiredService<IVoltrisIntelligenceOrchestrator>();
        vif.Start();
        App.VoltrisIntelligence = vif;
        _loggingService?.LogInfo("[App] VIF iniciado com sucesso");
    }
    catch (Exception ex)
    {
        _loggingService?.LogError($"[App] Erro ao iniciar VIF: {ex.Message}", ex);
    }
    
    // ... resto do código ...
}

protected override void OnExit(ExitEventArgs e)
{
    try
    {
        App.VoltrisIntelligence?.Stop();
        App.VoltrisIntelligence?.Dispose();
    }
    catch { }
    
    base.OnExit(e);
}
```

---

## 🎯 Próximos Passos

Após a integração bem-sucedida:

1. ✅ Teste o sistema iniciando um jogo
2. ✅ Verifique os logs para confirmar que o VIF está funcionando
3. ✅ Monitore o `GameScore` para entender quando o modo gamer é ativado
4. ✅ Ajuste o threshold do `GameScore` se necessário (padrão: 50)
5. ✅ Integre o status na UI para feedback visual ao usuário

---

**Versão**: 1.0.0  
**Data**: 2025-01-XX  
**Autor**: Voltris Intelligence Framework Team

