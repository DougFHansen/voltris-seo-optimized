using System;
using System.IO;
using System.Text.Json;

namespace DLS.Tests
{
    public static class TestReport
    {
        public static void Write(string name, bool passed, TimeSpan duration)
        {
            try
            {
                var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
                var dir = Path.Combine(appData, "VoltrisOptimizer", "logs");
                Directory.CreateDirectory(dir);
                var path = Path.Combine(dir, $"DLS-TestReport-{DateTime.Now:yyyyMMddHHmmss}.json");
                var obj = new { test = name, passed, durationMs = (int)duration.TotalMilliseconds };
                var json = JsonSerializer.Serialize(obj);
                File.AppendAllText(path, json + Environment.NewLine);
            }
            catch { }
        }
    }
}

