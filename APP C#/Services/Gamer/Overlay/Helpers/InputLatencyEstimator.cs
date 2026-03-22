using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services.Gamer.Overlay.Helpers
{
    /// <summary>
    /// Estimador de latência de entrada (Input Lag)
    /// Calcula latência total do sistema: Input Device → CPU → GPU → Display
    /// </summary>
    public class InputLatencyEstimator
    {
        private readonly ILoggingService? _logger;
        private double _lastEstimatedLatency = 0;
        private readonly Stopwatch _measurementTimer = new Stopwatch();
        
        // Win32 API para obter informações de dispositivos de entrada
        [DllImport("user32.dll")]
        private static extern int GetSystemMetrics(int nIndex);
        
        private const int SM_MOUSEPRESENT = 19;
        private const int SM_CMOUSEBUTTONS = 43;
        
        public InputLatencyEstimator(ILoggingService? logger = null)
        {
            _logger = logger;
            _measurementTimer.Start();
        }
        
        /// <summary>
        /// Estima a latência total de entrada em milissegundos
        /// Fórmula: Input Device Latency + Processing Latency + Render Latency + Display Latency
        /// </summary>
        public double EstimateInputLatency(double frameTimeMs, double cpuUsage, double gpuUsage)
        {
            try
            {
                // 1. Input Device Latency (Mouse/Keyboard)
                // Polling rate típico: 125Hz (8ms), 500Hz (2ms), 1000Hz (1ms)
                // Estimamos baseado na presença de mouse
                double inputDeviceLatency = EstimateInputDeviceLatency();
                
                // 2. Processing Latency (CPU)
                // Baseado no uso da CPU - quanto maior o uso, maior a latência
                double processingLatency = EstimateProcessingLatency(cpuUsage);
                
                // 3. Render Latency (GPU)
                // Baseado no frame time e uso da GPU
                double renderLatency = EstimateRenderLatency(frameTimeMs, gpuUsage);
                
                // 4. Display Latency
                // Latência típica de monitores: 1-10ms (estimamos 5ms como média)
                double displayLatency = EstimateDisplayLatency();
                
                // Latência total
                double totalLatency = inputDeviceLatency + processingLatency + renderLatency + displayLatency;
                
                // Suavizar valores para evitar oscilações bruscas
                _lastEstimatedLatency = (_lastEstimatedLatency * 0.7) + (totalLatency * 0.3);
                
                // Log detalhado a cada 5 segundos
                if (_measurementTimer.ElapsedMilliseconds > 5000)
                {
                    _logger?.LogInfo($"[InputLatency] Breakdown: Device={inputDeviceLatency:F2}ms, CPU={processingLatency:F2}ms, GPU={renderLatency:F2}ms, Display={displayLatency:F2}ms | Total={_lastEstimatedLatency:F2}ms");
                    _measurementTimer.Restart();
                }
                
                return Math.Round(_lastEstimatedLatency, 2);
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[InputLatency] Erro ao estimar latência: {ex.Message}");
                return _lastEstimatedLatency;
            }
        }
        
        /// <summary>
        /// Estima latência do dispositivo de entrada (mouse/teclado)
        /// </summary>
        private double EstimateInputDeviceLatency()
        {
            try
            {
                // Verificar se há mouse presente
                int mousePresent = GetSystemMetrics(SM_MOUSEPRESENT);
                
                if (mousePresent > 0)
                {
                    // Polling rate típico de mouses:
                    // - Mouses básicos: 125Hz = 8ms
                    // - Mouses gaming: 500Hz = 2ms ou 1000Hz = 1ms
                    // Estimamos 2ms como média para mouses modernos
                    return 2.0;
                }
                else
                {
                    // Teclado típico: 125Hz = 8ms
                    return 8.0;
                }
            }
            catch
            {
                // Fallback: assumir mouse gaming médio
                return 2.0;
            }
        }
        
        /// <summary>
        /// Estima latência de processamento da CPU
        /// </summary>
        private double EstimateProcessingLatency(double cpuUsage)
        {
            // Quanto maior o uso da CPU, maior a latência de processamento
            // Fórmula: Base 1ms + (uso da CPU / 100) * 5ms
            // Exemplo: 50% CPU = 1 + 2.5 = 3.5ms
            //          90% CPU = 1 + 4.5 = 5.5ms
            double baseLatency = 1.0;
            double cpuFactor = (cpuUsage / 100.0) * 5.0;
            
            return baseLatency + cpuFactor;
        }
        
        /// <summary>
        /// Estima latência de renderização da GPU
        /// </summary>
        private double EstimateRenderLatency(double frameTimeMs, double gpuUsage)
        {
            // A latência de renderização é aproximadamente o frame time
            // Mas ajustamos baseado no uso da GPU
            // Se GPU está em 100%, pode haver buffering adicional
            
            double renderLatency = frameTimeMs;
            
            // Se GPU está muito carregada (>90%), adicionar latência de buffering
            if (gpuUsage > 90)
            {
                double bufferingPenalty = (gpuUsage - 90) * 0.5; // Até 5ms extra
                renderLatency += bufferingPenalty;
            }
            
            return renderLatency;
        }
        
        /// <summary>
        /// Estima latência do display (monitor)
        /// </summary>
        private double EstimateDisplayLatency()
        {
            // Latência típica de monitores:
            // - Monitores gaming (144Hz+): 1-3ms
            // - Monitores normais (60Hz): 5-10ms
            // - TVs: 10-50ms
            
            // Estimamos 5ms como média razoável para monitores modernos
            return 5.0;
        }
        
        /// <summary>
        /// Retorna uma classificação da latência
        /// </summary>
        public static string GetLatencyRating(double latencyMs)
        {
            if (latencyMs < 20) return "Excelente";
            if (latencyMs < 30) return "Muito Bom";
            if (latencyMs < 40) return "Bom";
            if (latencyMs < 50) return "Aceitável";
            return "Alto";
        }
    }
}
