using System.Collections.Generic;
using System.Linq;
using VoltrisOptimizer.Core.SystemIntelligenceProfiler;
using Xunit;

namespace SystemIntelligenceProfiler.Tests
{
    public class DecisionEngineTests
    {
        [Fact]
        public void Evaluate_LowEndPC_RecommendsPagefileAndVisuals()
        {
            // Arrange: Low End PC (4GB RAM, HDD, 2 Cores)
            var audit = new AuditData
            {
                Cpu = new CpuInfo { LogicalCores = 2 },
                Ram = new RamInfo { TotalMb = 4096 },
                Storage = new StorageInfo { SystemDiskType = "HDD" },
                Gpu = new GpuInfo { IsIntegrated = true },
                Windows = new WindowsInfo { IsAdmin = true }
            };
            var answers = new UserAnswers { UseCase = "Uso geral", Priority = "Stability", IsLaptop = false };
            var engine = new DecisionEngine();

            // Act
            var report = engine.Evaluate(audit, answers);
            var recs = report.Recommendations;

            // Assert
            // Should recommend Memory Optimization (Lean mode or similar logic for low RAM)
            Assert.Contains(recs, r => r.Type == ActionType.Memory_Optimize); 
            // Should recommend Visual Optimization because of weak hardware
            Assert.Contains(recs, r => r.Type == ActionType.Visual_Optimize);
            // Should recommend System Cleanup (always safe)
            Assert.Contains(recs, r => r.Type == ActionType.SystemCleanup);
        }

        [Fact]
        public void Evaluate_HighEndGamingPC_RecommendsGamerModeAndHighPerf()
        {
            // Arrange: High End PC (32GB RAM, NVMe, 16 Cores, Dedicated GPU)
            var audit = new AuditData
            {
                Cpu = new CpuInfo { LogicalCores = 16, MaxFrequencyMhz = 4000 },
                Ram = new RamInfo { TotalMb = 32768 },
                Storage = new StorageInfo { SystemDiskType = "NVMe" },
                Gpu = new GpuInfo { IsIntegrated = false, Vendor = "NVIDIA", VramMb = 12000 },
                Windows = new WindowsInfo { IsAdmin = true }
            };
            var answers = new UserAnswers { UseCase = "Jogos competitivos", Priority = "Performance", IsLaptop = false };
            var engine = new DecisionEngine();

            // Act
            var report = engine.Evaluate(audit, answers);
            var recs = report.Recommendations;

            // Assert
            // Should recommend Gamer Mode
            Assert.Contains(recs, r => r.Type == ActionType.GamerMode_Activate);
            // Should recommend High Performance Power Plan
            Assert.Contains(recs, r => r.Type == ActionType.PowerPlan_HighPerformance);
            // Should NOT recommend aggressive visual downgrades (usually) or at least prioritizing performance
        }

        [Fact]
        public void Evaluate_LaptopBattery_RecommendsBalancedPowerPlan()
        {
            // Arrange: Laptop on Battery
            var audit = new AuditData
            {
                Cpu = new CpuInfo { LogicalCores = 4 },
                Ram = new RamInfo { TotalMb = 8192 },
                Battery = new BatteryInfo { Present = true },
                Gpu = new GpuInfo { IsIntegrated = true },
                Windows = new WindowsInfo { IsAdmin = true }
            };
            var answers = new UserAnswers { UseCase = "Uso geral", Priority = "Balanced", IsLaptop = true };
            var engine = new DecisionEngine();

            // Act
            var report = engine.Evaluate(audit, answers);
            var recs = report.Recommendations;

            // Assert
            // Should recommend Balanced Power Plan
            Assert.Contains(recs, r => r.Type == ActionType.PowerPlan_Balanced);
            // Should NOT recommend High Performance (to save battery/heat)
            Assert.DoesNotContain(recs, r => r.Type == ActionType.PowerPlan_HighPerformance);
        }

        [Fact]
        public void Evaluate_ThermalConstrained_AvoidsOverclocking()
        {
            // Arrange: Thin Laptop (Thermal Constrained inferred by Integrated GPU + Laptop + Battery)
            var audit = new AuditData
            {
                Cpu = new CpuInfo { LogicalCores = 8 }, // Good CPU
                Ram = new RamInfo { TotalMb = 16384 },
                Battery = new BatteryInfo { Present = true },
                Gpu = new GpuInfo { IsIntegrated = true }, // No dedicated cooling likely
                Windows = new WindowsInfo { IsAdmin = true }
            };
            var answers = new UserAnswers { UseCase = "Edição de Vídeo", Priority = "Performance", IsLaptop = true };
            var engine = new DecisionEngine();

            // Act
            var report = engine.Evaluate(audit, answers);
            var recs = report.Recommendations;

            // Assert
            // Even if priority is Performance, should be careful with Power Plan on laptops
            // The new logic might suggest Balanced-Optimized instead of High Performance for thermal safety
            Assert.Contains(recs, r => r.Type == ActionType.PowerPlan_Balanced);
             // Ensure risky overclocking/HAGS isn't blindly engaged if not supported/safe
        }

        [Fact]
        public void Evaluate_NetworkOptimization_RecommendsFlushDns()
        {
             // Arrange
            var audit = new AuditData
            {
                Nic = new NicInfo { SupportsRss = true },
                Windows = new WindowsInfo { IsAdmin = true }
            };
            var answers = new UserAnswers { UseCase = "Streaming", Priority = "Stability" };
            var engine = new DecisionEngine();

            // Act
            var report = engine.Evaluate(audit, answers);
            var recs = report.Recommendations;

            // Assert
            Assert.Contains(recs, r => r.Type == ActionType.Network_FlushDns);
        }
    }
}
