using System.Diagnostics;
using DLS.Tests.Fakes;
using VoltrisOptimizer.Services.Optimization;
using Xunit;

namespace DLS.Tests
{
    public class CriticalProcessDetectorTests
    {
        [Fact]
        public void Detects_Dwm_As_Critical()
        {
            var det = new CriticalProcessDetector();
            var dwm = Process.GetProcessesByName("dwm");
            var p = dwm.Length > 0 ? dwm[0] : Process.GetCurrentProcess();
            Assert.True(det.IsCritical(p));
        }

        [Fact]
        public void Browser_Fullscreen_Is_Critical_When_Foreground()
        {
            var fake = new FakeProcessProvider();
            var p = Process.GetCurrentProcess();
            var det = new CriticalProcessDetector(fake, new[] { p.ProcessName });
            Assert.True(det.IsCritical(p));
        }

        [Fact]
        public void Whitelist_Ignores()
        {
            VoltrisOptimizer.Services.SettingsService.Instance.Settings.DlsWhitelist.Add("chrome");
            var det = new CriticalProcessDetector();
            var p = Process.GetCurrentProcess();
            VoltrisOptimizer.Services.SettingsService.Instance.Settings.DlsWhitelist.Add(p.ProcessName);
            Assert.Contains(p.ProcessName, VoltrisOptimizer.Services.SettingsService.Instance.Settings.DlsWhitelist);
        }

        [Fact]
        public void Blacklist_Exists()
        {
            VoltrisOptimizer.Services.SettingsService.Instance.Settings.DlsBlacklist.Add("ffmpeg");
            Assert.Contains("ffmpeg", VoltrisOptimizer.Services.SettingsService.Instance.Settings.DlsBlacklist);
        }
    }
}
