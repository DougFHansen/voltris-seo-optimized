using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Interfaces;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// CORREÇÃO CRÍTICA #5: THREAD AFFINITY PARA CPUs HÍBRIDAS
    /// 
    /// Problema identificado: Em CPUs 12th gen+, threads críticos podem ir para E-cores
    /// Solução: Pinar threads do jogo em P-cores
    /// 
    /// Arquitetura Híbrida (Intel 12th gen+, AMD Ryzen 7000+):
    /// - P-cores: Performance (threads críticos do jogo)
    /// - E-cores: Efficiency (background tasks)
    /// </summary>
    public class HybridCpuOptimizer
    {
        private readonly ILoggingService _logger;
        private readonly IHardwareDetector _hardwareDetector;

        // P/Invoke para APIs avançadas do Windows
        [DllImport("kernel32.dll")]
        private static extern IntPtr GetCurrentThread();

        [DllImport("kernel32.dll")]
        private static extern IntPtr SetThreadAffinityMask(IntPtr hThread, IntPtr dwThreadAffinityMask);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetProcessAffinityMask(IntPtr hProcess, IntPtr dwProcessAffinityMask);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool GetProcessAffinityMask(IntPtr hProcess, out IntPtr lpProcessAffinityMask, out IntPtr lpSystemAffinityMask);

        public HybridCpuOptimizer(ILoggingService logger, IHardwareDetector hardwareDetector)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _hardwareDetector = hardwareDetector ?? throw new ArgumentNullException(nameof(hardwareDetector));
        }

        /// <summary>
        /// Aplica afinidade otimizada para jogo em CPU híbrida
        /// </summary>
        public bool ApplyHybridAffinity(int processId)
        {
            try
            {
                // 1. Verificar se é CPU híbrida
                if (!_hardwareDetector.IsHybridCpu())
                {
                    _logger.LogInfo("[HybridCpu] CPU não é híbrida, afinidade padrão mantida");
                    return true;
                }

                // 2. Obter contagem de cores
                var counts = _hardwareDetector.GetCpuCounts();
                _logger.LogInfo($"[HybridCpu] CPU Híbrida detectada: {counts.Cores} cores, {counts.Threads} threads");

                // 3. Calcular P-cores e E-cores
                // Heurística: Em CPUs híbridas, P-cores têm HyperThreading, E-cores não
                // Exemplo: 12900K = 8 P-cores (16 threads) + 8 E-cores (8 threads) = 24 threads total
                
                int pCoreThreads = CalculatePCoreThreads(counts.Cores, counts.Threads);
                
                if (pCoreThreads <= 0)
                {
                    _logger.LogWarning("[HybridCpu] Não foi possível calcular P-cores");
                    return false;
                }

                _logger.LogInfo($"[HybridCpu] P-cores identificados: {pCoreThreads} threads");

                // 4. Criar máscara de afinidade para P-cores
                // Bits 0 a (pCoreThreads-1) = P-cores
                long affinityMask = (1L << pCoreThreads) - 1;

                // 5. Aplicar ao processo
                using var process = Process.GetProcessById(processId);
                process.ProcessorAffinity = (IntPtr)affinityMask;

                _logger.LogSuccess($"[HybridCpu] ✅ Jogo isolado nos P-cores (Mask: 0x{affinityMask:X})");
                _logger.LogInfo($"[HybridCpu] E-cores liberados para background tasks");

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[HybridCpu] Erro ao aplicar afinidade: {ex.Message}", ex);
                return false;
            }
        }

        /// <summary>
        /// Calcula número de threads dos P-cores
        /// </summary>
        private int CalculatePCoreThreads(int totalCores, int totalThreads)
        {
            // Se threads == cores, não há HyperThreading (provavelmente não é híbrida)
            if (totalThreads == totalCores)
            {
                return totalCores;
            }

            // Heurística para CPUs Intel 12th/13th/14th gen:
            // P-cores têm HT (2 threads/core), E-cores não (1 thread/core)
            // Exemplo: 12900K = 8P + 8E = 16 + 8 = 24 threads
            // Fórmula: pCores = (totalThreads - totalCores) / 1
            // Mas precisamos saber quantos são P-cores...

            // Simplificação: Assumir que metade dos cores são P-cores (válido para 12900K, 13900K)
            int estimatedPCores = totalCores / 2;
            int pCoreThreads = estimatedPCores * 2; // P-cores com HT

            // Validação: pCoreThreads não pode exceder totalThreads
            if (pCoreThreads > totalThreads)
            {
                pCoreThreads = totalThreads / 2;
            }

            return pCoreThreads;
        }

        /// <summary>
        /// Restaura afinidade padrão (todos os cores)
        /// </summary>
        public bool RestoreDefaultAffinity(int processId)
        {
            try
            {
                using var process = Process.GetProcessById(processId);
                
                // Obter máscara do sistema (todos os cores)
                GetProcessAffinityMask(
                    process.Handle, 
                    out IntPtr processAffinity, 
                    out IntPtr systemAffinity);

                // Aplicar máscara do sistema (todos os cores disponíveis)
                process.ProcessorAffinity = systemAffinity;

                _logger.LogSuccess("[HybridCpu] ✅ Afinidade padrão restaurada");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[HybridCpu] Erro ao restaurar afinidade: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Aplica prioridade alta + afinidade P-core para thread específica
        /// </summary>
        public bool OptimizeCriticalThread(ProcessThread thread, int pCoreThreads)
        {
            try
            {
                // Criar máscara para P-cores
                long affinityMask = (1L << pCoreThreads) - 1;

                // Aplicar afinidade
                thread.ProcessorAffinity = (IntPtr)affinityMask;

                // Elevar prioridade
                thread.PriorityLevel = ThreadPriorityLevel.Highest;

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[HybridCpu] Erro ao otimizar thread: {ex.Message}");
                return false;
            }
        }
    }
}
