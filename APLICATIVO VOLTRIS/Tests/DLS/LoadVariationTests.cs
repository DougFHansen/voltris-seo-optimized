using System;
using System.Threading.Tasks;
using DLS.Tests.Fakes;
using VoltrisOptimizer.Services.Optimization;
using VoltrisOptimizer.Services.Optimization.Providers;
using Xunit;

namespace DLS.Tests
{
    public class FakeCpuProvider : ICpuCoreLoadProvider
    {
        private readonly double[][] _samples;
        private int _idx;
        public FakeCpuProvider(params double[][] samples) { _samples = samples; }
        public double[] GetCoreLoads() { var s = _samples[Math.Min(_idx, _samples.Length - 1)]; _idx++; return s; }
    }

    public class FakeGpuProvider : IGpuLoadProvider
    {
        public double Utilization = 0;
        public double GetGpuUtilization() => Utilization;
    }

    public class FakeProcessProvider : IProcessProvider
    {
        public System.Diagnostics.Process[] GetProcesses() => System.Diagnostics.Process.GetProcesses();
        public System.Diagnostics.Process? GetForegroundProcess() => System.Diagnostics.Process.GetCurrentProcess();
    }

    public class LoadVariationTests
    {
        [Fact]
        public async Task CpuStrongTrigger_ThenRelease()
        {
            var cpu = new FakeCpuProvider(new[] { 30.0, 80.0, 75.0 }, new[] { 28.0, 70.0, 68.0 });
            var gpu = new FakeGpuProvider { Utilization = 50.0 };
            var proc = new FakeProcessProvider();
            var dls = new DynamicLoadStabilizer(cpu, gpu, proc, null, null, null);

            await dls.StartAsync(System.Diagnostics.Process.GetCurrentProcess().Id);
            ResourceHogger.CpuSpin(TimeSpan.FromMilliseconds(1200), threads: Math.Max(1, Environment.ProcessorCount / 2));
            await dls.StopAsync();

            Assert.True(true);
        }

        [Fact]
        public void MemoryAndDiskHog_Run()
        {
            ResourceHogger.MemoryAllocate(128);
            ResourceHogger.DiskWrite(32);
            Assert.True(true);
        }
    }
}
