using Xunit;
using VoltrisOptimizer.Services.Gamer.Models;
using VoltrisOptimizer.Services.Gamer.Implementation;

namespace SystemIntelligenceProfiler.Tests
{
    /// <summary>
    /// Tests for the Gamer Mode deep audit — validates bug fixes and preservation of existing behavior.
    /// </summary>
    public class GamerModeAuditTests
    {
        // =====================================================================
        // Task 1 — Bug Condition Exploration: AnyOptimizationsEnabled
        // These tests confirm the fix for bug 1.9 (incomplete check).
        // On unfixed code, tests 1-5 would FAIL. After fix, they PASS.
        // =====================================================================

        [Fact]
        public void AnyOptimizationsEnabled_DisableHpetOnly_ReturnsTrue()
        {
            var options = AllFalseOptions();
            options.DisableHpet = true;
            Assert.True(options.AnyOptimizationsEnabled());
        }

        [Fact]
        public void AnyOptimizationsEnabled_VisualLevelMaxPerformance_ReturnsTrue()
        {
            var options = AllFalseOptions();
            options.VisualLevel = VisualOptimizationLevel.MaximumPerformance;
            Assert.True(options.AnyOptimizationsEnabled());
        }

        [Fact]
        public void AnyOptimizationsEnabled_DisableWallpaperSlideshowOnly_ReturnsTrue()
        {
            var options = AllFalseOptions();
            options.DisableWallpaperSlideshow = true;
            Assert.True(options.AnyOptimizationsEnabled());
        }

        [Fact]
        public void AnyOptimizationsEnabled_DisableUwpBackgroundAppsOnly_ReturnsTrue()
        {
            var options = AllFalseOptions();
            options.DisableUwpBackgroundApps = true;
            Assert.True(options.AnyOptimizationsEnabled());
        }

        [Fact]
        public void AnyOptimizationsEnabled_DisableHeavyServicesOnly_ReturnsTrue()
        {
            var options = AllFalseOptions();
            options.DisableHeavyServices = true;
            Assert.True(options.AnyOptimizationsEnabled());
        }

        [Theory]
        [InlineData(true, false, false, false, false, false, false, false, false, false, false, false, false, false, false)]
        [InlineData(false, true, false, false, false, false, false, false, false, false, false, false, false, false, false)]
        [InlineData(false, false, true, false, false, false, false, false, false, false, false, false, false, false, false)]
        [InlineData(false, false, false, true, false, false, false, false, false, false, false, false, false, false, false)]
        [InlineData(false, false, false, false, true, false, false, false, false, false, false, false, false, false, false)]
        [InlineData(false, false, false, false, false, true, false, false, false, false, false, false, false, false, false)]
        [InlineData(false, false, false, false, false, false, true, false, false, false, false, false, false, false, false)]
        [InlineData(false, false, false, false, false, false, false, true, false, false, false, false, false, false, false)]
        [InlineData(false, false, false, false, false, false, false, false, true, false, false, false, false, false, false)]
        [InlineData(false, false, false, false, false, false, false, false, false, true, false, false, false, false, false)]
        [InlineData(false, false, false, false, false, false, false, false, false, false, true, false, false, false, false)]
        [InlineData(false, false, false, false, false, false, false, false, false, false, false, true, false, false, false)]
        [InlineData(false, false, false, false, false, false, false, false, false, false, false, false, true, false, false)]
        [InlineData(false, false, false, false, false, false, false, false, false, false, false, false, false, true, false)]
        [InlineData(false, false, false, false, false, false, false, false, false, false, false, false, false, false, true)]
        public void AnyOptimizationsEnabled_SinglePropertyTrue_ReturnsTrue(
            bool cpu, bool gpu, bool net, bool mem, bool gameMode,
            bool latency, bool closeBg, bool fps, bool extreme, bool antiStutter,
            bool adaptiveNet, bool hpet, bool wallpaper, bool uwp, bool heavyServices)
        {
            var options = new GamerOptimizationOptions
            {
                OptimizeCpu = cpu, OptimizeGpu = gpu, OptimizeNetwork = net,
                OptimizeMemory = mem, EnableGameMode = gameMode, ReduceLatency = latency,
                CloseBackgroundApps = closeBg, ApplyFpsBoost = fps, EnableExtremeMode = extreme,
                EnableAntiStutter = antiStutter, EnableAdaptiveNetwork = adaptiveNet,
                DisableHpet = hpet, DisableWallpaperSlideshow = wallpaper,
                DisableUwpBackgroundApps = uwp, DisableHeavyServices = heavyServices,
                VisualLevel = VisualOptimizationLevel.None
            };
            Assert.True(options.AnyOptimizationsEnabled());
        }

        [Fact]
        public void AnyOptimizationsEnabled_VisualLevelBalanced_ReturnsTrue()
        {
            var options = AllFalseOptions();
            options.VisualLevel = VisualOptimizationLevel.Balanced;
            Assert.True(options.AnyOptimizationsEnabled());
        }

        // =====================================================================
        // Task 2 — Preservation Property Tests
        // These tests confirm existing behavior is preserved after the fix.
        // =====================================================================

        [Fact]
        public void AnyOptimizationsEnabled_AllFalse_ReturnsFalse()
        {
            var options = AllFalseOptions();
            Assert.False(options.AnyOptimizationsEnabled());
        }

        [Fact]
        public void AnyOptimizationsEnabled_OriginalPropertiesOnly_ReturnsTrue()
        {
            // When only original properties are active, behavior is preserved
            var options = AllFalseOptions();
            options.OptimizeCpu = true;
            Assert.True(options.AnyOptimizationsEnabled());
        }

        [Fact]
        public void AnyOptimizationsEnabled_DefaultOptions_ReturnsTrue()
        {
            // Default constructor has most booleans = true
            var options = new GamerOptimizationOptions();
            Assert.True(options.AnyOptimizationsEnabled());
        }

        [Fact]
        public void GamerStateMemory_FirstWriteWins()
        {
            var memory = new GamerStateMemory();
            memory.Register("TestKey", 42);
            memory.Register("TestKey", 99); // second write should be ignored
            Assert.Equal(42, memory.GetOriginal<int>("TestKey"));
        }

        [Fact]
        public void GamerStateMemory_UnregisteredKey_ReturnsDefault()
        {
            var memory = new GamerStateMemory();
            Assert.Equal(0, memory.GetOriginal<int>("NonExistent"));
            Assert.Null(memory.GetOriginal<string>("NonExistent"));
        }

        [Fact]
        public void GamerStateMemory_Clear_RemovesAllState()
        {
            var memory = new GamerStateMemory();
            memory.Register("Key1", "value1");
            Assert.True(memory.HasPendingRestoration());
            memory.Clear();
            Assert.False(memory.HasPendingRestoration());
            Assert.False(memory.WasModifiedByGamerMode("Key1"));
        }

        [Fact]
        public void GamerStateMemory_WasModifiedByGamerMode_TracksRegistration()
        {
            var memory = new GamerStateMemory();
            Assert.False(memory.WasModifiedByGamerMode("Key1"));
            memory.Register("Key1", null);
            Assert.True(memory.WasModifiedByGamerMode("Key1"));
        }

        // =====================================================================
        // Helper
        // =====================================================================

        private static GamerOptimizationOptions AllFalseOptions() => new()
        {
            OptimizeCpu = false, OptimizeGpu = false, OptimizeNetwork = false,
            OptimizeMemory = false, EnableGameMode = false, ReduceLatency = false,
            CloseBackgroundApps = false, ApplyFpsBoost = false, EnableExtremeMode = false,
            EnableAntiStutter = false, EnableAdaptiveNetwork = false,
            DisableHpet = false, DisableWallpaperSlideshow = false,
            DisableUwpBackgroundApps = false, DisableHeavyServices = false,
            VisualLevel = VisualOptimizationLevel.None
        };
    }
}
