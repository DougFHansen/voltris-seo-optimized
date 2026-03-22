using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;
using VoltrisOptimizer.Services.Gamer.Intelligence.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Models;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using GamerModels = VoltrisOptimizer.Services.Gamer.Models;

namespace VoltrisOptimizer.Services.Gamer.Intelligence.Implementation
{
    public class PowerProfileDiagnosticsService : IPowerProfileDiagnosticsService
    {
        private readonly ILoggingService _logger;
        private readonly IPowerPlanService _powerPlanService;
        private readonly IThermalMonitorService _thermalMonitor;
        private readonly IHardwareDetector _hardwareDetector;
        
        private PowerDiagnosticState _currentState = PowerDiagnosticState.Idle;
        private readonly SessionMetrics _highPerfMetrics = new();
        private readonly SessionMetrics _balancedMetrics = new();
        private string _currentGame = "";
        private DateTime _stateStartTime;
        private HardwareFingerprint _currentFingerprint = new();
        
        // Configurações Enterprise
        private const int StabilizingDurationSeconds = 20; // Tempo para sair de telas de loading
        private const int MonitoringDurationSeconds = 60;  // Amostragem robusta de 1 minuto
        private const int WarmupSeconds = 10;              // Estabilização térmica após troca de plano
        private const double MinGpuUsageForValidBaseline = 40.0; // Evita baselines em menus estáticos
        private const double ConfidenceThreshold = 0.05;   // 5% de ganho mínimo exigido
        
        private readonly SemaphoreSlim _stateLock = new(1, 1);
        private bool _diagnosticsExecutedThisSession = false;
        private string _sessionId = "";

        public PowerDiagnosticState CurrentState => _currentState;
        public event Action<string>? DiagnosticMessageGenerated;

        private static readonly string DbPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "power_diag_results.json");

        public PowerProfileDiagnosticsService(
            ILoggingService logger, 
            IPowerPlanService powerPlanService,
            IThermalMonitorService thermalMonitor,
            IHardwareDetector hardwareDetector)
        {
            _logger = logger;
            _powerPlanService = powerPlanService;
            _thermalMonitor = thermalMonitor;
            _hardwareDetector = hardwareDetector;
        }

        public async Task StartAnalysisAsync(string gameName, CancellationToken ct = default)
        {
            await _stateLock.WaitAsync();
            try
            {
                if (_currentState != PowerDiagnosticState.Idle || _diagnosticsExecutedThisSession) return;

                _sessionId = Guid.NewGuid().ToString("N").Substring(0, 4).ToUpper();
                _currentGame = gameName;
                
                // Obter capacidades de hardware de forma assíncrona e segura
                var caps = await _hardwareDetector.GetCapabilitiesAsync(ct);
                _currentFingerprint = GetHardwareFingerprint(caps);

                _logger.Log(LogLevel.Info, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Ciclo de diagnóstico iniciado para '{_currentGame}'");

                // 1. Verificação de Contexto: Notebook
                if (!caps.IsLaptop)
                {
                    _logger.Log(LogLevel.Info, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Dispositivo identificado como Desktop/Workstation (IsLaptop=false). Diagnóstico ignorado.");
                    return;
                }

                _logger.Log(LogLevel.Info, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Notebook detectado. HW: {_currentFingerprint.CpuModel} | {_currentFingerprint.GpuModel}");

                // 2. Verificar Persistência Inteligente (Fingerprint Matching)
                var previousResult = CheckPreviousResult();
                if (previousResult != null && previousResult.HighPerformanceDegrading)
                {
                    _logger.Log(LogLevel.Info, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] 🧠 Inteligência aprendida: '{gameName}' degrada Performance em HighPerf ({previousResult.Reason}). Aplicando correção imediata.");
                    ApplyBalancedFix();
                    _diagnosticsExecutedThisSession = true;
                    _currentState = PowerDiagnosticState.Applied;
                    DiagnosticMessageGenerated?.Invoke("Perfil energético otimizado aplicado com base no histórico do sistema.");
                    return;
                }

                // 3. Validar se o plano High Performance está ativo para iniciar teste
                // 3. Garantir que o plano High Performance está ativo para iniciar teste (Base de Comparação)
                var (activeGuid, _) = _powerPlanService.GetActivePowerPlan();
                var targetGuid = "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c"; // High Performance
                
                if (!activeGuid.Equals(targetGuid, StringComparison.OrdinalIgnoreCase))
                {
                    _logger.Log(LogLevel.Info, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Plano Alto Desempenho não estava ativo. Ativando para benchmark...");
                    
                    var (newGuid, _) = _powerPlanService.SetPowerPlan(PowerPlanType.HighPerformance);
                    
                    // Se o GUID retornado não for o alvo, falhou
                    if (!newGuid.Equals(targetGuid, StringComparison.OrdinalIgnoreCase))
                    {
                         _logger.Log(LogLevel.Error, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] FALHA AO ATIVAR High Performance. Ativo: {newGuid}. Ciclo abortado.");
                         return;
                    }
                    
                    // Aguardar estabilização do plano
                    await Task.Delay(2000, ct); 
                }

                // Iniciar Ciclo de Diagnóstico
                _currentState = PowerDiagnosticState.Stabilizing;
                _stateStartTime = DateTime.Now;
                _logger.Log(LogLevel.Info, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Iniciando fase de Estabilização ({StabilizingDurationSeconds}s)...");
            }
            finally
            {
                _stateLock.Release();
            }
        }

        public void ProcessSample(GameDiagnosticsService.Sample sample)
        {
            if (_currentState == PowerDiagnosticState.Idle || _currentState == PowerDiagnosticState.Applied) return;

            var elapsed = (DateTime.Now - _stateStartTime).TotalSeconds;

            switch (_currentState)
            {
                case PowerDiagnosticState.Stabilizing:
                    if (elapsed > StabilizingDurationSeconds)
                    {
                        // Validar se o jogo saiu do loading
                        if (sample.Fps > 5 && sample.GpuUtilPercent > MinGpuUsageForValidBaseline)
                        {
                            TransitionToState(PowerDiagnosticState.Monitoring);
                            _logger.Log(LogLevel.Info, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Baseline Validado (FPS: {sample.Fps:F0} | GPU: {sample.GpuUtilPercent:F0}%). Iniciando coleta.");
                        }
                        else
                        {
                            // Reset timer if still loading or idle
                            _stateStartTime = DateTime.Now;
                            _logger.Log(LogLevel.Debug, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Baseline Inválido (FPS: {sample.Fps:F0} < 5 ou GPU: {sample.GpuUtilPercent:F0}% < {MinGpuUsageForValidBaseline}%). Reiniciando estabilização...");
                        }
                    }
                    break;

                case PowerDiagnosticState.Monitoring:
                    if (elapsed > MonitoringDurationSeconds)
                    {
                        TransitionToTesting();
                    }
                    else
                    {
                        CollectMetrics(_highPerfMetrics, sample);
                    }
                    break;

                case PowerDiagnosticState.Testing:
                    if (elapsed < WarmupSeconds) return;

                    if (elapsed > MonitoringDurationSeconds + WarmupSeconds)
                    {
                        _logger.Log(LogLevel.Info, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Ciclo de monitoramento 'Balanced' concluído. Amostras: {_balancedMetrics.FpsValues.Count}.");
                        Task.Run(DecideAsync);
                    }
                    else
                    {
                        CollectMetrics(_balancedMetrics, sample);
                    }
                    break;
            }
        }

        private void TransitionToState(PowerDiagnosticState newState)
        {
            _currentState = newState;
            _stateStartTime = DateTime.Now;
            _logger.Log(LogLevel.Debug, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Transição de estado: {newState}");
            
            if (newState == PowerDiagnosticState.Monitoring)
            {
                DiagnosticMessageGenerated?.Invoke("Analisando eficiência térmica do perfil de energia...");
            }
        }

        private void TransitionToTesting()
        {
            _logger.Log(LogLevel.Info, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Baseline HighPerf concluído. FPS: {_highPerfMetrics.AvgFps:F1} | Clock: {_highPerfMetrics.AvgClock:F0}MHz");
            _logger.Log(LogLevel.Info, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Trocando para Balanced p/ Teste A/B...");
            
            _powerPlanService.SetPowerPlan(PowerPlanType.Balanced);
            
            _currentState = PowerDiagnosticState.Testing;
            _stateStartTime = DateTime.Now;
            _balancedMetrics.Clear();
            
            DiagnosticMessageGenerated?.Invoke("Validando estabilidade de clock no perfil equilibrado...");
        }

        private async Task DecideAsync()
        {
            await _stateLock.WaitAsync();
            try
            {
                _currentState = PowerDiagnosticState.Deciding;

                double highFps = _highPerfMetrics.AvgFps;
                double balFps = _balancedMetrics.AvgFps;
                double highClock = _highPerfMetrics.AvgClock;
                double balClock = _balancedMetrics.AvgClock;

                // Cálculo de Confidence Score e Deltas
                double fpsGain = (balFps - highFps) / Math.Max(1, highFps);
                double clockGain = (balClock - highClock) / Math.Max(1, highClock);
                
                bool isDegrading = false;
                string reason = "";
                double finalConfidence = 0;

                // 🛡️ Lógica Enterprise Anti-Falso Positivo
                if (fpsGain >= ConfidenceThreshold)
                {
                    isDegrading = true;
                    finalConfidence = fpsGain;
                    reason = $"Melhoria real de {fpsGain*100:F1}% no FPS médio.";
                }
                else if (clockGain > 0.10 && balFps >= highFps * 0.97)
                {
                    // Clock ganhou 10% e FPS não caiu drasticamente (throttling evitado)
                    isDegrading = true;
                    finalConfidence = clockGain;
                    reason = $"Clock estável ({clockGain*100:F1}% superior) e menor pressão térmica.";
                }

                if (isDegrading && finalConfidence >= ConfidenceThreshold)
                {
                    _logger.Log(LogLevel.AI_DECISION, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] ⚖️ DECISÃO: High Performance REPROVADO. Motivo: {reason} | Score: {finalConfidence:F2}");
                    SaveResult(true, highFps, balFps, highClock, balClock, finalConfidence, reason);
                    ApplyBalancedFix();
                }
                else
                {
                    _logger.Log(LogLevel.Info, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] ⚖️ DECISÃO: High Performance APROVADO. Ganhos do Balanced ({fpsGain*100:F1}%) insignificantes.");
                    _powerPlanService.SetPowerPlan(PowerPlanType.HighPerformance);
                }

                _diagnosticsExecutedThisSession = true;
                _currentState = PowerDiagnosticState.Applied;
            }
            finally
            {
                _stateLock.Release();
            }
        }

        private void CollectMetrics(SessionMetrics metrics, GameDiagnosticsService.Sample sample)
        {
            if (sample.Fps > 0) metrics.FpsValues.Add(sample.Fps);
            metrics.Temps.Add(sample.CpuTemperature);
            metrics.CpuUsage.Add(sample.CpuPercent);
            metrics.GpuUsage.Add(sample.GpuUtilPercent);
            if (sample.CpuCurrentMhz > 0) metrics.Clocks.Add(sample.CpuCurrentMhz);
        }

        private void ApplyBalancedFix()
        {
            _powerPlanService.SetPowerPlan(PowerPlanType.Balanced);
            DiagnosticMessageGenerated?.Invoke("Perfil Energético Adaptativo Ativado: Estabilidade superior detectada.");
        }

        #region Hardware & Context Helpers
        
        private HardwareFingerprint GetHardwareFingerprint(GamerModels.HardwareCapabilities caps)
        {
            var fp = new HardwareFingerprint
            {
                CpuModel = caps.CpuName ?? "Unknown CPU",
                GpuModel = caps.PrimaryGpu.Name ?? "Unknown GPU",
                WindowsVersion = Environment.OSVersion.VersionString,
                IsOnBattery = caps.IsOnBattery
            };
            return fp;
        }

        private PowerDiagnosticResult? CheckPreviousResult()
        {
            if (!File.Exists(DbPath)) return null;
            try
            {
                var json = File.ReadAllText(DbPath);
                var results = JsonSerializer.Deserialize<List<PowerDiagnosticResult>>(json);
                var match = results?.FirstOrDefault(r => r.GameName == _currentGame && r.Fingerprint.Equals(_currentFingerprint));
                
                if (match != null)
                    _logger.Log(LogLevel.Debug, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Resultado histórico encontrado para '{_currentGame}'.");
                
                return match;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[PowerDiag] Falha ao ler banco de diagnósticos: {ex.Message}");
                return null;
            }
        }

        private void SaveResult(bool degrading, double hFps, double bFps, double hClock, double bClock, double confidence, string reason)
        {
            try
            {
                var history = new List<PowerDiagnosticResult>();
                if (File.Exists(DbPath))
                {
                    try { history = JsonSerializer.Deserialize<List<PowerDiagnosticResult>>(File.ReadAllText(DbPath)) ?? new(); } catch { }
                }

                // Substituir se já existe p/ este contexto
                history.RemoveAll(r => r.GameName == _currentGame && r.Fingerprint.Equals(_currentFingerprint));

                history.Add(new PowerDiagnosticResult
                {
                    GameName = _currentGame,
                    HighPerformanceDegrading = degrading,
                    HighPerfAvgFps = hFps,
                    BalancedAvgFps = bFps,
                    HighPerfAvgClock = hClock,
                    BalancedAvgClock = bClock,
                    ConfidenceScore = confidence,
                    Reason = reason,
                    Fingerprint = _currentFingerprint,
                    TestedAt = DateTime.Now
                });

                // Manter apenas os últimos 50 resultados p/ evitar arquivo gigante
                if (history.Count > 50) history = history.OrderByDescending(x => x.TestedAt).Take(50).ToList();

                File.WriteAllText(DbPath, JsonSerializer.Serialize(history, new JsonSerializerOptions { WriteIndented = true }));
                _logger.Log(LogLevel.Info, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Resultados persistidos localmente (Contexto: {_currentGame}).");
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, LogCategory.Intelligence, $"[PowerDiag] [Session:{_sessionId}] Erro crítico ao persistir inteligência: {ex.Message}");
            }
        }

        #endregion
    }
}
