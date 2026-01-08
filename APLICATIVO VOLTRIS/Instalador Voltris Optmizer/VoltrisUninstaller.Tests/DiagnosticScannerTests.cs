using System;
using System.IO;
using Xunit;
using VoltrisUninstaller.Core;

namespace VoltrisUninstaller.Tests
{
    public class DiagnosticScannerTests
    {
        [Fact]
        public void Scanner_Should_Create_Report()
        {
            // Arrange
            var logger = new Logger(Path.Combine(Path.GetTempPath(), "test.log"));
            var scanner = new DiagnosticScanner(logger);

            // Act
            var report = scanner.Scan();

            // Assert
            Assert.NotNull(report);
            Assert.NotNull(report.ScanDate);
            Assert.NotNull(report.RegistryEntries);
            Assert.NotNull(report.Shortcuts);
            Assert.NotNull(report.Services);
        }

        [Fact]
        public void Scanner_Should_Export_Report_To_Json()
        {
            // Arrange
            var logger = new Logger(Path.Combine(Path.GetTempPath(), "test.log"));
            var scanner = new DiagnosticScanner(logger);
            var report = scanner.Scan();
            var outputPath = Path.Combine(Path.GetTempPath(), $"diagnostic-{Guid.NewGuid()}.json");

            try
            {
                // Act
                scanner.ExportReport(report, outputPath);

                // Assert
                Assert.True(File.Exists(outputPath));
                var content = File.ReadAllText(outputPath);
                Assert.Contains("ScanDate", content);
            }
            finally
            {
                if (File.Exists(outputPath))
                    File.Delete(outputPath);
            }
        }
    }
}






