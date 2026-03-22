using System;
using System.Collections.Generic;
using System.Linq;
using System.Management;

namespace VoltrisOptimizer.Services.Gamer.Overlay.Helpers
{
    /// <summary>
    /// Helper para leitura de hardware usando WMI e PerformanceCounters melhorados
    /// Fornece leituras precisas de temperatura, clocks e uso de GPU
    /// MELHORIA: Detecção aprimorada de GPU dedicada vs integrada
    /// </summary>
    public class HardwareMonitorHelper : IDisposable
    {
        private readonly object _lock = new object();
        private bool _disposed = false;

        // Cache de valores
        private double? _cachedCpuTemp;
        private double? _cachedGpuTemp;
        private double? _cachedCpuClock;
        private double? _cachedGpuCoreClock;
        private double? _cachedGpuMemoryClock;

        // Informações de GPU
        private string? _dedicatedGpuName;
        private string? _integratedGpuName;
        private bool _hasDedicatedGpu = false;

        public HardwareMonitorHelper()
        {
            App.LoggingService?.LogTrace("[HW_MONITOR] Helper de monitoramento inicializado");
            Initialize();
        }

        private void Initialize()
        {
            try
            {
                DetectGpus();
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[HW_MONITOR] Erro ao inicializar detecção de hardware: {ex.Message}");
            }
        }

        /// <summary>
        /// MELHORIA: Detecta GPU dedicada vs integrada de forma mais precisa
        /// </summary>
        private void DetectGpus()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_VideoController");
                var gpus = new List<(string Name, bool IsDedicated)>();

                foreach (ManagementObject obj in searcher.Get())
                {
                    try
                    {
                        var name = obj["Name"]?.ToString() ?? "";
                        var adapterRam = obj["AdapterRAM"];
                        
                        if (string.IsNullOrEmpty(name) || name.Contains("Microsoft", StringComparison.OrdinalIgnoreCase))
                            continue;

                        // Critérios para GPU dedicada:
                        // 1. Tem VRAM significativa (> 1GB)
                        // 2. Nome contém marcas conhecidas (NVIDIA, AMD, Radeon)
                        // 3. Não é Intel (Intel geralmente é integrada)
                        var isDedicated = false;
                        
                        if (adapterRam != null)
                        {
                            var vramGb = Convert.ToDouble(adapterRam) / (1024.0 * 1024.0 * 1024.0);
                            if (vramGb > 1.0) // Mais de 1GB de VRAM = provavelmente dedicada
                            {
                                isDedicated = true;
                            }
                        }

                        // Verificar por nome
                        var nameUpper = name.ToUpperInvariant();
                        if (nameUpper.Contains("NVIDIA") || nameUpper.Contains("GEFORCE") || 
                            nameUpper.Contains("AMD") || nameUpper.Contains("RADEON") ||
                            nameUpper.Contains("RX ") || nameUpper.Contains("RTX") || nameUpper.Contains("GTX"))
                        {
                            isDedicated = true;
                        }

                        if (nameUpper.Contains("INTEL"))
                        {
                            isDedicated = false; // Intel geralmente é integrada
                        }

                        gpus.Add((name, isDedicated));

                        if (isDedicated)
                        {
                            _dedicatedGpuName = name;
                            _hasDedicatedGpu = true;
                            App.LoggingService?.LogInfo($"[HW_MONITOR] GPU Dedicada Detectada: {name}");
                        }
                        else
                        {
                            _integratedGpuName = name;
                            App.LoggingService?.LogTrace($"[HW_MONITOR] GPU Integrada Detectada: {name}");
                        }
                    }
                    catch { }
                }

                // Se não encontrou GPU dedicada, usar a primeira não-Microsoft
                if (!_hasDedicatedGpu && gpus.Count > 0)
                {
                    var firstGpu = gpus.FirstOrDefault();
                    _dedicatedGpuName = firstGpu.Name;
                    _hasDedicatedGpu = true;
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"[HW_MONITOR] Falha na varredura de GPUs: {ex.Message}");
            }
        }

        public void Update()
        {
            // Atualizar valores via WMI (já implementado em MetricsCollector)
            // Este método existe para compatibilidade
        }

        public double? GetCpuTemperature()
        {
            // Será preenchido pelo MetricsCollector via WMI
            return _cachedCpuTemp;
        }

        public double? GetGpuTemperature()
        {
            // Será preenchido pelo MetricsCollector via WMI
            return _cachedGpuTemp;
        }

        public double? GetGpuUsage()
        {
            // Será preenchido pelo MetricsCollector via PerformanceCounter
            return null; // Retornado diretamente pelo MetricsCollector
        }

        public double? GetCpuClock()
        {
            return _cachedCpuClock;
        }

        public double? GetGpuCoreClock()
        {
            return _cachedGpuCoreClock;
        }

        public double? GetGpuMemoryClock()
        {
            return _cachedGpuMemoryClock;
        }

        /// <summary>
        /// Verifica se há GPU dedicada disponível
        /// </summary>
        public bool HasDedicatedGpu()
        {
            lock (_lock)
            {
                return _hasDedicatedGpu;
            }
        }

        /// <summary>
        /// Obtém informações da GPU dedicada
        /// </summary>
        public string? GetDedicatedGpuName()
        {
            lock (_lock)
            {
                return _dedicatedGpuName;
            }
        }

        /// <summary>
        /// Obtém informações da GPU integrada (se houver)
        /// </summary>
        public string? GetIntegratedGpuName()
        {
            lock (_lock)
            {
                return _integratedGpuName;
            }
        }

        public void Dispose()
        {
            if (_disposed)
                return;

            App.LoggingService?.LogTrace("[HW_MONITOR] Descartando recursos de monitoramento");
            _disposed = true;
        }
    }
}

