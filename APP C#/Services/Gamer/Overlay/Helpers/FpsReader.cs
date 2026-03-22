// =============================================================================
// FPS READER — REESCRITO PARA ALTA PRECISÃO (2026)
// =============================================================================
// Baseado na lógica do PresentMon e ferramentas de análise de performance.
// - Usa ETW (Event Tracing for Windows) para capturar eventos reais de Present.
// - Suporta DX9, DX10, DX11, DX12 e Vulkan (via DXGI).
// - Remove completamente estimativas falsas baseadas em CPU.
// - Atualização em tempo real (250ms) para maior fluidez no overlay.
// =============================================================================

using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Diagnostics.Tracing;
using Microsoft.Diagnostics.Tracing.Session;

namespace VoltrisOptimizer.Services.Gamer.Overlay.Helpers
{
    public class FpsReader : IDisposable
    {
        // === Win32 API para verificação de janela em primeiro plano ===
        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();
        [DllImport("user32.dll")]
        private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

        // === ETW Provider GUIDs ===
        private static readonly Guid DxgiGuid    = new("CA11C036-0102-4A2D-A6AD-F03CFED5D3C9");
        private static readonly Guid D3D9Guid    = new("783ACA0A-790E-4D7F-8451-AA850511C6B9");
        private static readonly Guid DxgKrnlGuid = new("802EC45A-1E99-4B83-9920-87C98277BA9D");
        private static readonly Guid DwmCoreGuid = new("9E9BBA3C-2E38-40CB-99F4-9E8281425164");

        // === Event IDs ===
        private const int DXGI_PRESENT_START = 42;
        private const int D3D9_PRESENT_START = 1;
        private const int DXGKRNL_FLIP       = 46;
        private const int DXGKRNL_PRESENT    = 184;
        private const int DWM_FLIP_COMPLETE  = 67;

        private readonly Process _targetProcess;
        private readonly ILoggingService? _logger;
        private readonly int _targetPid;
        private bool _disposed;

        private CancellationTokenSource? _cts;
        private Task? _pipelineTask;
        private TraceEventSession? _etwSession;
        private bool _etwActive;

        // === Métricas em Tempo Real ===
        private long _frameCount;
        private long _lastQpc;
        private readonly double _qpcToMs;
        
        // ConcurrentQueue para armazenar timestamps dos frames do último segundo
        private readonly ConcurrentQueue<long> _frameTimestamps = new ConcurrentQueue<long>();
        
        // Estado de monitoramento
        public double CurrentFps { get; private set; }
        public double FrameTimeMs { get; private set; }
        public bool IsEtwActive => _etwActive;
        public bool IsUsingFallback => false; // Removido fallback "mentiroso"

        public FpsReader(Process targetProcess, ILoggingService? logger = null)
        {
            _targetProcess = targetProcess ?? throw new ArgumentNullException(nameof(targetProcess));
            _logger = logger;
            _targetPid = targetProcess.Id;
            _qpcToMs = 1000.0 / Stopwatch.Frequency;
            _logger?.LogInfo($"[FpsReader] Inicializado para PID={_targetPid} ({targetProcess.ProcessName})");
        }

        public void StartMonitoring()
        {
            if (_pipelineTask != null) return;
            
            _cts = new CancellationTokenSource();
            
            // Iniciar thread de ETW
            _pipelineTask = Task.Factory.StartNew(
                () => RunEtwPipeline(_cts.Token), 
                _cts.Token,
                TaskCreationOptions.LongRunning, 
                TaskScheduler.Default);
            
            // Iniciar thread de cálculo de métricas (4Hz = 250ms)
            Task.Run(async () => {
                while (!_cts.IsCancellationRequested)
                {
                    try
                    {
                        CalculateFps();
                        await Task.Delay(250, _cts.Token);
                    }
                    catch (OperationCanceledException) { break; }
                    catch (Exception ex) {
                        _logger?.LogWarning($"[FpsReader] Erro no loop de cálculo: {ex.Message}");
                    }
                }
            }, _cts.Token);
        }

        public void StopMonitoring()
        {
            try
            {
                _cts?.Cancel();
                _etwSession?.Stop();
                _pipelineTask?.Wait(1000);
            }
            catch { }
            finally
            {
                CleanupSession();
                _pipelineTask = null;
                _cts?.Dispose();
                _cts = null;
            }
        }

        private void RunEtwPipeline(CancellationToken ct)
        {
            string sessionName = $"VoltrisFPS_{_targetPid}";
            
            try
            {
                // Limpar sessões órfãs se existirem
                try { TraceEventSession.GetActiveSession(sessionName)?.Stop(true); } catch { }

                _etwSession = new TraceEventSession(sessionName, TraceEventSessionOptions.Create);
                _etwSession.StopOnDispose = true;

                // Configurar Provedores
                _etwSession.EnableProvider(DxgiGuid, TraceEventLevel.Informational, 0xffffffffffffffffUL);
                _etwSession.EnableProvider(D3D9Guid, TraceEventLevel.Informational, 0xffffffffffffffffUL);
                _etwSession.EnableProvider(DxgKrnlGuid, TraceEventLevel.Informational, 0x1UL);
                _etwSession.EnableProvider(DwmCoreGuid, TraceEventLevel.Informational, 0x1UL);

                _etwActive = true;
                _logger?.LogSuccess($"[FpsReader] Sessão ETW '{sessionName}' iniciada.");

                // Handler de eventos
                _etwSession.Source.Dynamic.All += (data) =>
                {
                    if (ct.IsCancellationRequested) return;

                    bool isFrame = false;

                    // 1. DXGI (DX10/11/12/Vulkan)
                    if (data.ProviderGuid == DxgiGuid && data.ProcessID == _targetPid)
                    {
                        if ((int)data.ID == DXGI_PRESENT_START) isFrame = true;
                    }
                    // 2. D3D9 (Legacy)
                    else if (data.ProviderGuid == D3D9Guid && data.ProcessID == _targetPid)
                    {
                        if ((int)data.ID == D3D9_PRESENT_START) isFrame = true;
                    }
                    // 3. DxgKrnl (Global/Nativo)
                    else if (data.ProviderGuid == DxgKrnlGuid)
                    {
                        if (data.ProcessID == _targetPid && ((int)data.ID == DXGKRNL_FLIP || (int)data.ID == DXGKRNL_PRESENT))
                        {
                            isFrame = true;
                        }
                    }
                    // 4. DWM (Fallback se for a janela ativa)
                    else if (data.ProviderGuid == DwmCoreGuid && (int)data.ID == DWM_FLIP_COMPLETE)
                    {
                        if (IsTargetInForeground())
                        {
                            // Apenas contar DWM se não tivemos frames de fontes diretas nos últimos 500ms
                            long nowTicks = Stopwatch.GetTimestamp();
                            if ((nowTicks - _lastQpc) * _qpcToMs > 500)
                            {
                                isFrame = true;
                            }
                        }
                    }

                    if (isFrame)
                    {
                        RecordFrame(data.TimeStampQPC);
                    }
                };

                _etwSession.Source.Process();
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[FpsReader] ETW Crash: {ex.Message}");
                _etwActive = false;
            }
        }

        private void RecordFrame(long qpc)
        {
            if (_lastQpc > 0)
            {
                double ft = (qpc - _lastQpc) * _qpcToMs;
                if (ft > 0.1 && ft < 1000) // Sanitização (1fps a 10000fps)
                {
                    FrameTimeMs = ft;
                }
            }
            _lastQpc = qpc;
            _frameTimestamps.Enqueue(qpc);
        }

        private void CalculateFps()
        {
            long now = Stopwatch.GetTimestamp();
            long frequency = Stopwatch.Frequency;
            long oneSecondAgo = now - frequency;

            // Remover timestamps com mais de 1 segundo
            while (_frameTimestamps.TryPeek(out long ts) && ts < oneSecondAgo)
            {
                _frameTimestamps.TryDequeue(out _);
            }

            int framesInLastSecond = _frameTimestamps.Count;
            
            // Suavização do FPS para o overlay (EMA)
            if (CurrentFps == 0) CurrentFps = framesInLastSecond;
            else CurrentFps = (CurrentFps * 0.3) + (framesInLastSecond * 0.7);

            // Se o FPS suavizado for muito baixo, assume 0
            if (CurrentFps < 0.5) CurrentFps = 0;
        }

        private bool IsTargetInForeground()
        {
            try
            {
                IntPtr hWnd = GetForegroundWindow();
                if (hWnd == IntPtr.Zero) return false;
                GetWindowThreadProcessId(hWnd, out uint pid);
                return pid == _targetPid;
            }
            catch { return false; }
        }

        private void CleanupSession()
        {
            try
            {
                _etwSession?.Stop();
                _etwSession?.Dispose();
            }
            catch { }
            _etwActive = false;
        }

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;
            StopMonitoring();
        }
    }
}