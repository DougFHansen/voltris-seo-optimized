using System;
using System.Collections.Generic;

namespace VoltrisOptimizer.Services.Performance.Models
{
    public class PerformanceSystemProfile
    {
        public bool HasSSD { get; set; }
        public bool HasNVMe { get; set; }
        public double TotalRAMGB { get; set; }
        public bool IsLowRAM { get; set; }
        public bool IsHighRAM { get; set; }
        public int CPUCores { get; set; }
        public bool IsMultiCore { get; set; }
        public string CPUName { get; set; } = "";
        public bool HasDedicatedGPU { get; set; }
        public string GPUName { get; set; } = "";
        public bool IsLaptop { get; set; }
        public bool IsGamingPC { get; set; }
        public bool IsWorkstation { get; set; }
        public Version WindowsVersion { get; set; } = new();
        public bool IsWindows11 { get; set; }
    }

    public class PerformanceCategory
    {
        public string Name { get; set; } = "";
        public string Icon { get; set; } = "";
        public string Description { get; set; } = "";
        public List<PerformanceOptimization> Optimizations { get; set; } = new();
    }

    public class PerformanceOptimization
    {
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public OptimizationImpact Impact { get; set; }
        public OptimizationSafety Safety { get; set; }
        public bool IsRecommended { get; set; }
        public Action? ApplyAction { get; set; }
        public Action? RevertAction { get; set; }
        
        /// <summary>
        /// Tipo de reinício necessário para esta otimização
        /// </summary>
        public RestartScope RequiredRestart { get; set; } = RestartScope.None;
        
        // ============================================
        // PROPRIEDADES DE RESTRIÇÃO POR HARDWARE
        // ============================================
        
        /// <summary>
        /// Tier mínimo de hardware necessário para esta otimização
        /// </summary>
        public HardwareTier? MinimumTier { get; set; }
        
        /// <summary>
        /// Requer GPU dedicada
        /// </summary>
        public bool RequiresDedicatedGPU { get; set; }
        
        /// <summary>
        /// Requer SSD (não funciona bem em HDD)
        /// </summary>
        public bool RequiresSSD { get; set; }
        
        /// <summary>
        /// RAM mínima em GB necessária
        /// </summary>
        public int? MinimumRAMGB { get; set; }
        
        /// <summary>
        /// Número mínimo de cores de CPU necessários
        /// </summary>
        public int? MinimumCores { get; set; }
        
        /// <summary>
        /// Não aplicar em laptops (pode causar problemas de energia)
        /// </summary>
        public bool NotForLaptops { get; set; }
        
        /// <summary>
        /// Conflita com Modo Gamer ativo
        /// </summary>
        public bool ConflictsWithGamerMode { get; set; }
        
        /// <summary>
        /// Mensagem de aviso se não for compatível
        /// </summary>
        public string? IncompatibilityReason { get; set; }
    }

    public enum RestartScope
    {
        None,
        App,
        Explorer,
        PC
    }

    public enum OptimizationImpact
    {
        Low,
        Medium,
        High
    }

    public enum OptimizationSafety
    {
        Safe,
        Moderate,
        Advanced
    }

    /// <summary>
    /// Classificação de hardware para otimizações adaptativas
    /// </summary>
    public enum HardwareTier
    {
        /// <summary>
        /// PC Fraco - Hardware limitado, otimizações conservadoras
        /// </summary>
        LowEnd,
        
        /// <summary>
        /// PC Médio - Hardware intermediário, otimizações moderadas
        /// </summary>
        MidRange,
        
        /// <summary>
        /// PC Forte - Hardware potente, todas as otimizações disponíveis
        /// </summary>
        HighEnd
    }

    public class OptimizationProgress
    {
        public string Category { get; set; } = "";
        public string CurrentOptimization { get; set; } = "";
        public int PercentComplete { get; set; }
    }

    public class PerformanceOptimizationResult
    {
        public bool Success { get; set; }
        public int TotalApplied { get; set; }
        public List<string> Applied { get; set; } = new();
        public List<string> Errors { get; set; } = new();
    }
}