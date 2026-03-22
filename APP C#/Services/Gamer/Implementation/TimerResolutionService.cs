using System;
using System.Runtime.InteropServices;
using System.Threading;
using VoltrisOptimizer.Services.Gamer.Interfaces;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Serviço para controle de Timer Resolution do Windows
    /// IMPACTO REAL: Reduz input lag de 15.6ms para 0.5ms
    /// </summary>
    public class TimerResolutionService : ITimerResolutionService, IDisposable
    {
        private readonly ILoggingService _logger;
        private bool _isHighResolutionActive;
        private uint _originalResolution;
        private uint _currentResolution;
        private readonly object _lock = new();

        // =====================================================
        // WINDOWS API - NTDLL (Timer Resolution real)
        // =====================================================
        [DllImport("ntdll.dll", SetLastError = true)]
        private static extern int NtSetTimerResolution(uint DesiredResolution, bool SetResolution, out uint CurrentResolution);

        [DllImport("ntdll.dll", SetLastError = true)]
        private static extern int NtQueryTimerResolution(out uint MinimumResolution, out uint MaximumResolution, out uint CurrentResolution);

        // timeBeginPeriod/timeEndPeriod como fallback
        [DllImport("winmm.dll", SetLastError = true)]
        private static extern uint timeBeginPeriod(uint uPeriod);

        [DllImport("winmm.dll", SetLastError = true)]
        private static extern uint timeEndPeriod(uint uPeriod);

        // Constantes
        private const uint TIMER_RESOLUTION_05MS = 5000;   // 0.5ms em unidades de 100ns
        private const uint TIMER_RESOLUTION_1MS = 10000;   // 1ms
        private const uint DEFAULT_RESOLUTION = 156250;    // 15.625ms (padrão Windows)

        public bool IsActive => _isHighResolutionActive;
        public bool IsMaxResolutionActive => _isHighResolutionActive;
        public double CurrentResolutionMs => _currentResolution / 10000.0;
        
        /// <summary>
        /// Obtém resolução atual em unidades de 100ns
        /// </summary>
        public uint GetCurrentResolution()
        {
            QueryCurrentResolution();
            return _currentResolution;
        }

        public TimerResolutionService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            QueryCurrentResolution();
        }

        /// <summary>
        /// Define a resolução máxima do timer (0.5ms)
        /// EFEITO IMEDIATO em input lag e frame pacing
        /// </summary>
        public bool SetMaximumResolution()
        {
            lock (_lock)
            {
                if (_isHighResolutionActive)
                {
                    _logger.LogInfo("[TimerRes] Timer já está em alta resolução");
                    return true;
                }

                try
                {
                    // Salvar resolução original
                    NtQueryTimerResolution(out _, out _, out _originalResolution);
                    
                    _logger.LogInfo($"[TimerRes] Resolução original: {_originalResolution / 10000.0:F2}ms");

                    // Tentar definir 0.5ms via NtSetTimerResolution
                    var status = NtSetTimerResolution(TIMER_RESOLUTION_05MS, true, out _currentResolution);
                    
                    if (status == 0)
                    {
                        _isHighResolutionActive = true;
                        _logger.LogSuccess($"[TimerRes] ✓ Timer Resolution: {_currentResolution / 10000.0:F2}ms (era {_originalResolution / 10000.0:F2}ms)");
                        
                        // Também usar timeBeginPeriod como garantia
                        timeBeginPeriod(1);
                        
                        return true;
                    }
                    else
                    {
                        // Fallback: usar timeBeginPeriod (menos preciso mas funciona)
                        _logger.LogWarning("[TimerRes] NtSetTimerResolution falhou, usando fallback...");
                        
                        if (timeBeginPeriod(1) == 0)
                        {
                            _isHighResolutionActive = true;
                            _currentResolution = 10000;
                            _logger.LogSuccess("[TimerRes] ✓ Timer Resolution via timeBeginPeriod: ~1ms");
                            return true;
                        }
                    }

                    _logger.LogError("[TimerRes] Falha ao definir timer resolution");
                    return false;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[TimerRes] Erro: {ex.Message}", ex);
                    return false;
                }
            }
        }

        /// <summary>
        /// Define resolução específica em milissegundos
        /// </summary>
        public bool SetResolution(double milliseconds)
        {
            lock (_lock)
            {
                try
                {
                    uint desired = (uint)(milliseconds * 10000);
                    var status = NtSetTimerResolution(desired, true, out _currentResolution);
                    
                    if (status == 0)
                    {
                        _isHighResolutionActive = milliseconds < 10;
                        _logger.LogInfo($"[TimerRes] Resolução definida: {_currentResolution / 10000.0:F2}ms");
                        return true;
                    }

                    return false;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[TimerRes] Erro em SetResolution: {ex.Message}", ex);
                    return false;
                }
            }
        }

        /// <summary>
        /// Libera a resolução de volta ao padrão do Windows
        /// </summary>
        public bool ReleaseResolution()
        {
            lock (_lock)
            {
                if (!_isHighResolutionActive)
                {
                    return true;
                }

                try
                {
                    // Liberar timeBeginPeriod
                    timeEndPeriod(1);
                    
                    // Restaurar via NtSetTimerResolution
                    var status = NtSetTimerResolution(DEFAULT_RESOLUTION, false, out _currentResolution);
                    
                    _isHighResolutionActive = false;
                    _logger.LogInfo($"[TimerRes] Timer Resolution restaurado: {_currentResolution / 10000.0:F2}ms");
                    
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[TimerRes] Erro ao liberar: {ex.Message}", ex);
                    return false;
                }
            }
        }

        /// <summary>
        /// Consulta a resolução atual do timer
        /// </summary>
        public (double current, double max) GetResolutionInfo()
        {
            try
            {
                NtQueryTimerResolution(out uint min, out uint max, out uint current);
                return (current / 10000.0, max / 10000.0);
            }
            catch
            {
                return (15.625, 0.5);
            }
        }

        private void QueryCurrentResolution()
        {
            try
            {
                NtQueryTimerResolution(out _, out _, out _currentResolution);
            }
            catch
            {
                _currentResolution = DEFAULT_RESOLUTION;
            }
        }

        public void Dispose()
        {
            ReleaseResolution();
        }
    }
}

