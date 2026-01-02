using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace VoltrisOptimizer.Services.Optimization
{
    public class DlsLogger
    {
        private readonly string _textPath;
        private readonly string _jsonPath;
        private readonly List<object> _session = new();
        public DlsLogger()
        {
            var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            var dir = Path.Combine(appData, "VoltrisOptimizer", "logs");
            Directory.CreateDirectory(dir);
            _textPath = Path.Combine(dir, "dls.log");
            _jsonPath = Path.Combine(dir, "dls.json");
        }
        public void Log(string message)
        {
            var line = $"[{DateTime.Now:HH:mm:ss}] {message}";
            try { File.AppendAllText(_textPath, line + Environment.NewLine); } catch { }
            try { _session.Add(new { ts = DateTime.Now, msg = message }); } catch { }
        }
        public void Flush()
        {
            try
            {
                var json = JsonSerializer.Serialize(_session, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_jsonPath, json);
            }
            catch { }
        }
    }
}

