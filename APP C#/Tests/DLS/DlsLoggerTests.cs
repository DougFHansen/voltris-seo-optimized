using System.IO;
using VoltrisOptimizer.Services.Optimization;
using Xunit;

namespace DLS.Tests
{
    public class DlsLoggerTests
    {
        [Fact]
        public void Writes_Log_And_Json()
        {
            var logger = new DlsLogger();
            logger.Log("throttle strong test");
            logger.Log("release test");
            logger.Flush();
            var appData = System.Environment.GetFolderPath(System.Environment.SpecialFolder.ApplicationData);
            var dir = Path.Combine(appData, "VoltrisOptimizer", "logs");
            Assert.True(File.Exists(Path.Combine(dir, "dls.log")));
            Assert.True(File.Exists(Path.Combine(dir, "dls.json")));
        }
    }
}

