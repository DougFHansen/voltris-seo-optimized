using System;

namespace VoltrisOptimizer.Core.Intelligence
{
    /// <summary>
    /// Status atual do sistema de inteligência
    /// </summary>
    public class IntelligenceStatus
    {
        /// <summary>
        /// Indica se há um jogo rodando
        /// </summary>
        public bool IsGameRunning { get; set; }

        /// <summary>
        /// Nome do processo do jogo (se houver)
        /// </summary>
        public string? GameProcessName { get; set; }

        /// <summary>
        /// ID do processo do jogo (se houver)
        /// </summary>
        public int? GameProcessId { get; set; }

        /// <summary>
        /// Score interno de "Game Score" (0-100)
        /// </summary>
        public int GameScore { get; set; }

        /// <summary>
        /// Indica se o modo gamer está ativo
        /// </summary>
        public bool IsGamerModeActive { get; set; }

        /// <summary>
        /// Temperatura atual da CPU (°C)
        /// </summary>
        public float CpuTemperature { get; set; }

        /// <summary>
        /// Temperatura atual da GPU (°C)
        /// </summary>
        public float GpuTemperature { get; set; }

        /// <summary>
        /// Uso de VRAM (%)
        /// </summary>
        public float VramUsagePercent { get; set; }

        /// <summary>
        /// Latência de input detectada (ms)
        /// </summary>
        public float InputLatency { get; set; }

        /// <summary>
        /// Frame time médio (ms)
        /// </summary>
        public float AverageFrameTime { get; set; }

        /// <summary>
        /// Modo de energia atual
        /// </summary>
        public string PowerMode { get; set; } = "Unknown";

        /// <summary>
        /// Timestamp da última execução do loop
        /// </summary>
        public DateTime LastLoopExecution { get; set; }

        /// <summary>
        /// Número de loops executados desde o início
        /// </summary>
        public long LoopCount { get; set; }

        /// <summary>
        /// Número de otimizações ativas
        /// </summary>
        public int ActiveOptimizations { get; set; }

        /// <summary>
        /// Mensagens de status (últimas 10)
        /// </summary>
        public string[] StatusMessages { get; set; } = Array.Empty<string>();
    }
}

