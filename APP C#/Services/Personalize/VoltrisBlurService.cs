using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services.Personalize
{
    public enum ExplorerEffect
    {
        Blur      = 0,
        Acrylic   = 1,
        Mica      = 2,
        BlurClear = 3,
        MicaAlt   = 4,
    }

    public class VoltrisBlurService
    {
        private const string TAG = "[VoltrisBlur]";
        private readonly ILoggingService _logger;

        private readonly string _dllDir;
        private readonly string _dllPath;
        private readonly string _configPath;

        private bool _isInstalled = false;
        public bool IsInstalled => _isInstalled;

        public event EventHandler? ExplorerRestarted;
        public event EventHandler<bool>? InstalledStateResolved;

        private ExplorerEffect? _currentEffect = null;
        private Task? _checkInstalledTask;

        public VoltrisBlurService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            string exeDir = AppDomain.CurrentDomain.BaseDirectory;
            _dllDir     = Path.Combine(exeDir, "VoltrisBlur");
            _dllPath    = Path.Combine(_dllDir, "VoltrisBlur.dll");
            _configPath = Path.Combine(_dllDir, "config.ini");

            _logger.LogInfo($"{TAG} Serviço iniciado.");
            if (!File.Exists(_dllPath)) TryFindAndCopyDll();

            _checkInstalledTask = Task.Run(CheckInstalledStateAsync);
        }

        private void TryFindAndCopyDll()
        {
            string exeDir = AppDomain.CurrentDomain.BaseDirectory;
            var candidates = new[] {
                Path.Combine(exeDir, "DLLS", "VoltrisBlur", "VoltrisBlur.dll"),
                Path.Combine(exeDir, "VoltrisBlur.dll"),
                Path.GetFullPath(Path.Combine(exeDir, @"..\..\..\..", "DLLS", "VoltrisBlur", "VoltrisBlur.dll"))
            };
            foreach (var c in candidates)
            {
                if (File.Exists(c))
                {
                    try {
                        Directory.CreateDirectory(_dllDir);
                        File.Copy(c, _dllPath, true);
                        _logger.LogInfo($"{TAG} DLL copiada de: {c}");
                        break;
                    } catch {}
                }
            }
        }

        public bool IsDllPresent() => File.Exists(_dllPath);

        public async Task<bool> GetInstalledStateAsync()
        {
            if (_checkInstalledTask != null) await _checkInstalledTask;
            return _isInstalled;
        }

        public async Task<bool> InstallAsync(ExplorerEffect effect, bool clearAddress, bool clearBarBg, bool clearWinUIBg, bool showLine, int lightR, int lightG, int lightB, int lightA, int darkR, int darkG, int darkB, int darkA)
        {
            _logger.LogInfo($"{TAG} [Install] Iniciando...");
            if (!IsDllPresent()) return false;

            WriteConfig(effect, clearAddress, clearBarBg, clearWinUIBg, showLine, lightR, lightG, lightB, lightA, darkR, darkG, darkB, darkA);
            await RunRegsvr32Async(unregister: true);
            bool ok = await RunRegsvr32Async(unregister: false);
            if (ok) await RestartExplorerAsync();

            _isInstalled = ok;
            return ok;
        }

        public async Task<bool> UninstallAsync()
        {
            _logger.LogInfo($"{TAG} [Uninstall] Removendo...");
            await RunRegsvr32Async(unregister: true);
            await RestartExplorerAsync();
            _isInstalled = false;
            return true;
        }

        public async Task<bool> ApplyConfigOnlyAsync(ExplorerEffect effect, bool clearAddress, bool clearBarBg, bool clearWinUIBg, bool showLine, int lightR, int lightG, int lightB, int lightA, int darkR, int darkG, int darkB, int darkA, bool restartExplorer = true)
        {
            WriteConfig(effect, clearAddress, clearBarBg, clearWinUIBg, showLine, lightR, lightG, lightB, lightA, darkR, darkG, darkB, darkA);
            if (restartExplorer) await RestartExplorerAsync();
            return true;
        }

        private void WriteConfig(ExplorerEffect effect, bool clearAddress, bool clearBarBg, bool clearWinUIBg, bool showLine, int lightR, int lightG, int lightB, int lightA, int darkR, int darkG, int darkB, int darkA)
        {
            Directory.CreateDirectory(_dllDir);
            var sb = new StringBuilder();
            sb.Append("[config]\n");
            sb.Append($"effect={(int)effect}\n");
            sb.Append($"clearAddress={clearAddress.ToString().ToLower()}\n");
            sb.Append($"clearBarBg={clearBarBg.ToString().ToLower()}\n");
            sb.Append($"clearWinUIBg={clearWinUIBg.ToString().ToLower()}\n");
            sb.Append($"showLine={showLine.ToString().ToLower()}\n");
            sb.Append("[light]\n");
            sb.Append($"r={lightR}\ng={lightG}\nb={lightB}\na={lightA}\n");
            sb.Append("[dark]\n");
            sb.Append($"r={darkR}\ng={darkG}\nb={darkB}\na={darkA}\n");
            File.WriteAllText(_configPath, sb.ToString(), new UTF8Encoding(false));
        }

        private async Task<bool> RunRegsvr32Async(bool unregister)
        {
            string args = unregister ? $"/u /s \"{_dllPath}\"" : $"/s \"{_dllPath}\"";
            try {
                var psi = new ProcessStartInfo { FileName = "regsvr32.exe", Arguments = args, UseShellExecute = false, CreateNoWindow = true };
                using var proc = Process.Start(psi);
                if (proc == null) return false;
                await proc.WaitForExitAsync();
                return proc.ExitCode == 0;
            } catch { return false; }
        }

        private async Task RestartExplorerAsync()
        {
            _logger.LogInfo($"{TAG} [Explorer] Reiniciando...");
            try {
                foreach (var p in Process.GetProcessesByName("explorer")) { p.Kill(); p.WaitForExit(); }
                Process.Start("explorer.exe");
                await Task.Delay(2000);
                ExplorerRestarted?.Invoke(this, EventArgs.Empty);
            } catch (Exception ex) { _logger.LogError($"{TAG} [Explorer] Erro no restart: {ex.Message}"); }
        }

        public async Task DiagnoseAsync()
        {
            await Task.Run(() => {
                _logger.LogInfo($"{TAG} [Diagnose] ══════════ START ══════════");
                const string clsid = "{B44BD3C8-E597-4E08-AE43-246CE24698E7}";
                RunRegQuery($@"HKCR\CLSID\{clsid}\InProcServer32", "HKCR CLSID");
                var procs = Process.GetProcessesByName("explorer");
                foreach (var p in procs) {
                    try {
                        foreach (ProcessModule m in p.Modules)
                            if (m.FileName != null && m.FileName.Contains("VoltrisBlur", StringComparison.OrdinalIgnoreCase))
                                _logger.LogInfo($"{TAG} [Diagnose] PID={p.Id} - ✅ DLL: {m.FileName}");
                    } catch {}
                }
                _logger.LogInfo($"{TAG} [Diagnose] ══════════ FIM ══════════");
            });
        }

        private void RunRegQuery(string keyPath, string label)
        {
            try {
                var psi = new ProcessStartInfo { FileName = "reg.exe", Arguments = $"query \"{keyPath}\"", UseShellExecute = false, CreateNoWindow = true, RedirectStandardOutput = true };
                using var p = Process.Start(psi);
                if (p != null) { string o = p.StandardOutput.ReadToEnd(); p.WaitForExit(); if (p.ExitCode == 0) _logger.LogInfo($"{TAG} [Diag] ✅ {label}:\n{o.Trim()}"); }
            } catch {}
        }

        private async Task CheckInstalledStateAsync()
        {
            await Task.Run(() => {
                try {
                    string[] clsids = { "{887D3A6A-502E-4AF5-9CE6-D515E12AFE89}", "{B44BD3C8-E597-4E08-AE43-246CE24698E7}" };
                    bool found = false;
                    foreach (var c in clsids) {
                        if (found) break;
                        using (var key = Microsoft.Win32.Registry.ClassesRoot.OpenSubKey($@"CLSID\{c}\InProcServer32")) {
                            if (key != null) {
                                var val = key.GetValue(null) as string;
                                if (!string.IsNullOrEmpty(val) && (val.Contains("VoltrisBlur", StringComparison.OrdinalIgnoreCase) || val.Contains("ExplorerBlurMica", StringComparison.OrdinalIgnoreCase)))
                                    found = true;
                            }
                        }
                    }
                    _isInstalled = found;
                } catch { _isInstalled = false; }
            });
            InstalledStateResolved?.Invoke(this, _isInstalled);
        }
    }
}
