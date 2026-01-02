using VoltrisOptimizer.Core.SystemIntelligenceProfiler;
using Xunit;

namespace SystemIntelligenceProfiler.Tests
{
    public class RollbackManagerTests
    {
        [Fact]
        public void BeginSession_Creates_Directory()
        {
            var rb = new RollbackManager();
            var dir = rb.BeginSession();
            Assert.True(System.IO.Directory.Exists(dir));
        }

        [Fact]
        public void SaveText_Writes_File()
        {
            var rb = new RollbackManager();
            var dir = rb.BeginSession();
            rb.SaveText(dir, "test.txt", "hello");
            var path = System.IO.Path.Combine(dir, "test.txt");
            Assert.True(System.IO.File.Exists(path));
        }
    }
}
