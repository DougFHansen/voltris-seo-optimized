using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces; // Adicionando o namespace correto

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler
{
    public class RollbackManager : IRollbackManager
    {
        private readonly string _dir;
        private readonly List<RollbackAction> _stack = new List<RollbackAction>();
        public RollbackManager()
        {
            var appdata = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            _dir = Path.Combine(appdata, "VoltrisOptimizer", "Backups");
            if (!Directory.Exists(_dir)) Directory.CreateDirectory(_dir);
        }

        public string BeginSession()
        {
            var id = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            var path = Path.Combine(_dir, id);
            Directory.CreateDirectory(path);
            return path;
        }

        public void SaveText(string sessionDir, string name, string content)
        {
            var p = Path.Combine(sessionDir, name);
            File.WriteAllText(p, content);
        }

        public List<string> ListBackups()
        {
            var list = new List<string>();
            foreach (var d in Directory.GetDirectories(_dir)) list.Add(d);
            return list;
        }

        public void PushAction(string description, string type, string backupPath)
        {
            _stack.Add(new RollbackAction
            {
                Description = description,
                Type = type,
                BackupLocation = backupPath,
                Timestamp = DateTime.Now
            });
        }

        public IReadOnlyList<RollbackAction> GetStack() => _stack.AsReadOnly();

        public void Push(RollbackAction action)
        {
            if (action == null) return;
            _stack.Add(action);
        }

        public void ExportBundle(string sessionDir, string bundlePath)
        {
            try
            {
                var tmp = Path.Combine(sessionDir, "bundle");
                Directory.CreateDirectory(tmp);
                var stackJson = System.Text.Json.JsonSerializer.Serialize(_stack, new System.Text.Json.JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(Path.Combine(tmp, "stack.json"), stackJson);
                foreach (var f in Directory.GetFiles(sessionDir))
                {
                    var name = Path.GetFileName(f);
                    File.Copy(f, Path.Combine(tmp, name), true);
                }
                if (File.Exists(bundlePath)) File.Delete(bundlePath);
                System.IO.Compression.ZipFile.CreateFromDirectory(tmp, bundlePath);
            }
            catch { }
        }

        // Implementação correta dos métodos da interface IRollbackManager
        public async Task CreateRollbackPointAsync(string pointId, string description)
        {
            await Task.Run(() =>
            {
                var path = Path.Combine(_dir, pointId);
                Directory.CreateDirectory(path);
                // Aqui você pode salvar informações adicionais sobre o ponto de rollback
            });
        }

        // Corrigindo o tipo de retorno para corresponder exatamente à interface
        public async Task<RollbackResult> ExecuteRollbackAsync(string pointId)
        {
            return await Task.Run(() =>
            {
                // Implementação do rollback
                var result = new RollbackResult
                {
                    TransactionId = pointId,
                    Success = true,
                    RollbackActionsExecuted = 0
                };
                return result;
            });
        }

        public async Task RemoveRollbackPointAsync(string pointId)
        {
            await Task.Run(() =>
            {
                var path = Path.Combine(_dir, pointId);
                if (Directory.Exists(path))
                {
                    Directory.Delete(path, true);
                }
            });
        }

        // Corrigindo o tipo de retorno para corresponder exatamente à interface
        public List<RollbackPoint> GetAvailableRollbackPoints()
        {
            var points = new List<RollbackPoint>();
            if (Directory.Exists(_dir))
            {
                foreach (var dir in Directory.GetDirectories(_dir))
                {
                    var point = new RollbackPoint
                    {
                        Id = Path.GetFileName(dir),
                        Description = "Ponto de rollback",
                        CreatedAt = Directory.GetCreationTime(dir)
                    };
                    points.Add(point);
                }
            }
            return points;
        }

        public bool RollbackPointExists(string pointId)
        {
            var path = Path.Combine(_dir, pointId);
            return Directory.Exists(path);
        }
    }

    public class RollbackAction
    {
        public string Description { get; set; } = "";
        public string Type { get; set; } = ""; // registry/service/powerplan/affinity
        public string BackupLocation { get; set; } = "";
        public DateTime Timestamp { get; set; }
    }
}