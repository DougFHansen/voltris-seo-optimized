using System;
using System.Threading;
using DLS.Tests.Fakes;
using VoltrisOptimizer.Services.Optimization;
using Xunit;

namespace DLS.Tests
{
    public class CoreLoadHeuristicsTests
    {
        [Fact]
        public void Strong_When_Any_Core_Above_70_For_1600ms()
        {
            var fake = new FakeCpuLoadProvider();
            var h = new CoreLoadHeuristics(fake);
            fake.Enqueue(new[] { 10.0, 10.0, 75.0, 12.0 });
            Thread.Sleep(200);
            var d1 = h.Sample();
            fake.Enqueue(new[] { 10.0, 10.0, 78.0, 12.0 });
            Thread.Sleep(1400);
            var d2 = h.Sample();
            Assert.True(d1 == CoreDecision.None || d1 == CoreDecision.ModerateThrottle);
            Assert.Equal(CoreDecision.StrongThrottle, d2);
        }

        [Fact]
        public void Moderate_When_Two_Cores_Above_55()
        {
            var fake = new FakeCpuLoadProvider();
            var h = new CoreLoadHeuristics(fake);
            fake.Enqueue(new[] { 60.0, 58.0, 10.0, 12.0 });
            var d = h.Sample();
            Assert.True(d == CoreDecision.ModerateThrottle || d == CoreDecision.StrongThrottle);
        }

        [Fact]
        public void Release_When_All_Cores_Under_20()
        {
            var fake = new FakeCpuLoadProvider();
            var h = new CoreLoadHeuristics(fake);
            fake.Enqueue(new[] { 10.0, 15.0, 12.0, 18.0 });
            Thread.Sleep(2000);
            var d = h.Sample();
            Assert.Equal(CoreDecision.Release, d);
        }

        [Fact]
        public void Debounce_Prevents_Oscillation()
        {
            var fake = new FakeCpuLoadProvider();
            var h = new CoreLoadHeuristics(fake);
            fake.Enqueue(new[] { 80.0, 10.0 });
            var d1 = h.Sample();
            fake.Enqueue(new[] { 10.0, 10.0 });
            var d2 = h.Sample();
            Assert.NotEqual(CoreDecision.StrongThrottle, d2);
        }
    }
}

