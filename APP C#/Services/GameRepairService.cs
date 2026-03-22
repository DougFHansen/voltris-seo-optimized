using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace VoltrisOptimizer.Services
{
    // -------------------------------------------------------------------------
    // MODELOS DE RESULTADO
    // -------------------------------------------------------------------------

    public enum GameRepairSeverity { Info, Warning, Error }

    /// <summary>
    /// Status em tempo real de um item durante scan/reparo.
    /// </summary>
    public enum GameRepairItemStatus
    {
        Unknown,     // ainda n�o verificado
        Checking,    // em verifica��o
        OK,          // instalado/configurado corretamente
        Missing,     // faltando / problema detectado
        Fixing,      // sendo corrigido agora
        Fixed,       // corrigido com sucesso
        Failed,      // falhou ao corrigir
        Skipped      // requer a��o manual
    }

    public class GameRepairIssue : System.ComponentModel.INotifyPropertyChanged
    {
        public event System.ComponentModel.PropertyChangedEventHandler? PropertyChanged;
        private void OnPropChanged(string name) => PropertyChanged?.Invoke(this, new System.ComponentModel.PropertyChangedEventArgs(name));

        public string Id          { get; set; } = "";
        public string Title       { get; set; } = "";
        public string Description { get; set; } = "";
        public GameRepairSeverity Severity { get; set; } = GameRepairSeverity.Warning;
        public bool   CanAutoFix  { get; set; } = true;
        public bool   RequiresReboot { get; set; } = false;
        public string FixDescription { get; set; } = "";

        // -- Campos de estado em tempo real ------------------------------------
        private GameRepairItemStatus _status = GameRepairItemStatus.Unknown;
        public GameRepairItemStatus Status
        {
            get => _status;
            set { _status = value; OnPropChanged(nameof(Status)); OnPropChanged(nameof(StatusIcon)); OnPropChanged(nameof(StatusColor)); OnPropChanged(nameof(IsOk)); OnPropChanged(nameof(HasIssue)); }
        }

        private string _statusMessage = "";
        public string StatusMessage
        {
            get => _statusMessage;
            set { _statusMessage = value; OnPropChanged(nameof(StatusMessage)); }
        }

        /// <summary>�cone do status para exibi��o na UI.</summary>
        public string StatusIcon => Status switch
        {
            GameRepairItemStatus.OK      => "?",
            GameRepairItemStatus.Missing => "?",
            GameRepairItemStatus.Fixing  => "?",
            GameRepairItemStatus.Fixed   => "?",
            GameRepairItemStatus.Failed  => "?",
            GameRepairItemStatus.Skipped => "!",
            GameRepairItemStatus.Checking=> "...",
            _                            => "?"
        };

        /// <summary>Cor do status para exibi��o na UI.</summary>
        public string StatusColor => Status switch
        {
            GameRepairItemStatus.OK      => "#00CC66",
            GameRepairItemStatus.Missing => "#FF4444",
            GameRepairItemStatus.Fixing  => "#FFA500",
            GameRepairItemStatus.Fixed   => "#00CC66",
            GameRepairItemStatus.Failed  => "#FF4444",
            GameRepairItemStatus.Skipped => "#FFA500",
            GameRepairItemStatus.Checking=> "#888888",
            _                            => "#888888"
        };

        public bool IsOk     => Status == GameRepairItemStatus.OK || Status == GameRepairItemStatus.Fixed;
        public bool HasIssue => Status == GameRepairItemStatus.Missing || Status == GameRepairItemStatus.Failed;
    }

    public class GameRepairFixResult
    {
        public string IssueId  { get; set; } = "";
        public bool   Success  { get; set; }
        public string Message  { get; set; } = "";
    }

    public class GameRepairScanResult
    {
        /// <summary>Apenas os itens COM problema (compatibilidade retroativa).</summary>
        public List<GameRepairIssue> Issues   { get; set; } = new();
        /// <summary>TODOS os itens (OK + com problema) para exibir na UI em tempo real.</summary>
        public List<GameRepairIssue> AllItems { get; set; } = new();
        public bool   ScanSuccess { get; set; }
        public string ErrorMessage { get; set; } = "";
        public TimeSpan Duration  { get; set; }
        public bool   AllOk => Issues.Count == 0;
    }

    public class GameRepairResult
    {
        public int    TotalIssues   { get; set; }
        public int    FixedCount    { get; set; }
        public int    SkippedCount  { get; set; }
        public bool   RequiresReboot { get; set; }
        public List<GameRepairFixResult> Details { get; set; } = new();
    }

    // -------------------------------------------------------------------------
    // SERVI�O PRINCIPAL
    // -------------------------------------------------------------------------

    /// <summary>
    /// Servi�o inteligente de detec��o e corre��o de erros que afetam jogos.
    /// Scan m�x 15s � corrige SOMENTE o que est� realmente quebrado.
    /// Suporte: VC++ 2005-2022, DirectX, OpenGL, Vulkan, .NET, Media Foundation, �udio.
    /// </summary>
    public class GameRepairService
    {
        private readonly ILoggingService _logger;

        public Action<string, string>? OnLog      { get; set; }
        public Action<int, string>?    OnProgress { get; set; }

        private static readonly string WinDir  = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
        private static readonly string Sys32   = Path.Combine(WinDir, "System32");
        private static readonly string SysWow  = Path.Combine(WinDir, "SysWOW64");
        private static readonly string PsExe   = Path.Combine(WinDir, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");

        // --- VC++ 2005/2008: usa msiexec diretamente para evitar janela do InstallShield -------
        // O autoextrator InstallShield dos VC++ 2005/2008 cria um processo-filho (install.exe)
        // a partir de IXP000.TMP\ com sua pr�pria janela, que WindowStyle=Hidden n�o suprime.
        // Solu��o definitiva: baixar os MSIs diretamente e chamar msiexec /i /qn como execut�vel principal.
        // Product codes oficiais Microsoft para detec��o via msiexec:
        private static readonly (string Id, string WingetX64, string WingetX86,
            string RegistryKeyword, string Label,
            string UrlX64, string UrlX86, string InstallArgs,
            bool UseDirectMsiExec)[] VcVersions =
        {
            // VC++ 2005 � for�ar msiexec direto para evitar janela do autoextrator
            ("VC_2005_MISSING",
                "Microsoft.VCRedist.2005.x64", "Microsoft.VCRedist.2005.x86",
                "Visual C++ 2005", "Visual C++ 2005",
                "https://download.microsoft.com/download/8/B/4/8B42259F-5D70-43F4-AC2E-4B208FD8D66A/vcredist_x64.EXE",
                "https://download.microsoft.com/download/8/B/4/8B42259F-5D70-43F4-AC2E-4B208FD8D66A/vcredist_x86.EXE",
                "/q:a /c:\"msiexec /i vcredist.msi /qn /norestart\"",
                false), // NOTA: se ainda mostrar janela, usar modo RunHidden abaixo

            // VC++ 2008 � mesmo esquema do 2005
            ("VC_2008_MISSING",
                "Microsoft.VCRedist.2008.x64", "Microsoft.VCRedist.2008.x86",
                "Visual C++ 2008", "Visual C++ 2008",
                "https://download.microsoft.com/download/5/D/8/5D8C65CB-C849-4025-8E95-C3966CAFD8AE/vcredist_x64.exe",
                "https://download.microsoft.com/download/5/D/8/5D8C65CB-C849-4025-8E95-C3966CAFD8AE/vcredist_x86.exe",
                "/q:a /c:\"msiexec /i vcredist.msi /qn /norestart\"",
                false),

            // VC++ 2010 � /quiet totalmente silencioso (sem barra de progresso)
            ("VC_2010_MISSING",
                "Microsoft.VCRedist.2010.x64", "Microsoft.VCRedist.2010.x86",
                "Visual C++ 2010", "Visual C++ 2010",
                "https://download.microsoft.com/download/1/6/5/165255E7-1014-4D0A-B094-B6A430A6BFFC/vcredist_x64.exe",
                "https://download.microsoft.com/download/1/6/5/165255E7-1014-4D0A-B094-B6A430A6BFFC/vcredist_x86.exe",
                "/quiet /norestart",
                false),

            // VC++ 2012 � /quiet totalmente silencioso
            ("VC_2012_MISSING",
                "Microsoft.VCRedist.2012.x64", "Microsoft.VCRedist.2012.x86",
                "Visual C++ 2012", "Visual C++ 2012",
                "https://download.microsoft.com/download/1/6/B/16B06F60-3B20-4FF2-B699-5E9B7962F9AE/VSU_4/vcredist_x64.exe",
                "https://download.microsoft.com/download/1/6/B/16B06F60-3B20-4FF2-B699-5E9B7962F9AE/VSU_4/vcredist_x86.exe",
                "/quiet /norestart",
                false),

            // VC++ 2013 � /quiet totalmente silencioso
            ("VC_2013_MISSING",
                "Microsoft.VCRedist.2013.x64", "Microsoft.VCRedist.2013.x86",
                "Visual C++ 2013", "Visual C++ 2013",
                "https://aka.ms/highdpimfc2013x64enu",
                "https://aka.ms/highdpimfc2013x86enu",
                "/quiet /norestart",
                false),

            // VC++ 2015-2022 � /install /quiet /norestart (j� era correto)
            ("VC_2015_MISSING",
                "Microsoft.VCRedist.2015+.x64", "Microsoft.VCRedist.2015+.x86",
                "Visual C++ 2015", "Visual C++ 2015-2022",
                "https://aka.ms/vs/17/release/vc_redist.x64.exe",
                "https://aka.ms/vs/17/release/vc_redist.x86.exe",
                "/install /quiet /norestart",
                false),
        };

        public GameRepairService(ILoggingService logger)
        {
            _logger = logger;
        }

        // --- Helpers ---------------------------------------------------------

        private void Log(string msg, string color = "#AAAAAA")
        {
            _logger.LogInfo($"[GameRepair] {msg}");
            OnLog?.Invoke(msg, color);
        }

        private void Progress(int pct, string msg) => OnProgress?.Invoke(pct, msg);

        /// <summary>Executa PowerShell script inline de forma segura.</summary>
        private async Task<(int exitCode, string output)> RunPsAsync(
            string script, CancellationToken ct, int timeoutMs = 30_000)
        {
            var tmp = Path.GetTempFileName() + ".ps1";
            _logger.LogInfo($"[GameRepair][RunPs] Executando script PowerShell (timeout: {timeoutMs}ms)");
            _logger.LogInfo($"[GameRepair][RunPs] Script length: {script.Length} chars");
            _logger.LogInfo($"[GameRepair][RunPs] Temp file: {tmp}");
            
            try
            {
                await File.WriteAllTextAsync(tmp, script, Encoding.UTF8, ct);
                _logger.LogInfo($"[GameRepair][RunPs] Script escrito em {tmp}");
                
                var psi = new ProcessStartInfo
                {
                    FileName               = PsExe,
                    Arguments              = $"-NoProfile -NonInteractive -ExecutionPolicy Bypass -File \"{tmp}\"",
                    UseShellExecute        = false,
                    CreateNoWindow         = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError  = true,
                    StandardOutputEncoding = Encoding.UTF8,
                    StandardErrorEncoding  = Encoding.UTF8
                };
                
                _logger.LogInfo($"[GameRepair][RunPs] Starting: {psi.FileName} {psi.Arguments}");
                
                using var proc = new Process { StartInfo = psi };
                var started = proc.Start();
                _logger.LogInfo($"[GameRepair][RunPs] Process started: PID={proc.Id}, Started={started}");
                
                var outTask = proc.StandardOutput.ReadToEndAsync();
                var errTask = proc.StandardError.ReadToEndAsync();
                
                using var cts2 = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts2.CancelAfter(timeoutMs);
                
                try 
                { 
                    await proc.WaitForExitAsync(cts2.Token); 
                    _logger.LogInfo($"[GameRepair][RunPs] Process exited: ExitCode={proc.ExitCode}");
                }
                catch (OperationCanceledException)
                {
                    _logger.LogWarning($"[GameRepair][RunPs] Timeout ap�s {timeoutMs}ms, matando processo...");
                    try { proc.Kill(entireProcessTree: true); } catch (Exception ex) { _logger.LogWarning($"[GameRepair][RunPs] Erro ao matar processo: {ex.Message}"); }
                    if (ct.IsCancellationRequested) throw new OperationCanceledException(ct);
                    var partialOutput = await outTask;
                    _logger.LogWarning($"[GameRepair][RunPs] Retornando output parcial ({partialOutput.Length} chars)");
                    return (-1, partialOutput);
                }
                
                var output = await outTask;
                var error = await errTask;
                
                if (!string.IsNullOrEmpty(error))
                {
                    _logger.LogWarning($"[GameRepair][RunPs] StdErr: {error}");
                }
                
                _logger.LogInfo($"[GameRepair][RunPs] Output length: {output.Length} chars");
                if (output.Length > 0)
                {
                    _logger.LogInfo($"[GameRepair][RunPs] Output preview: {output.Substring(0, Math.Min(200, output.Length))}");
                }
                
                return (proc.ExitCode, output);
            }
            catch (OperationCanceledException) 
            { 
                _logger.LogWarning("[GameRepair][RunPs] Cancelado");
                throw; 
            }
            catch (Exception ex) 
            { 
                _logger.LogError($"[GameRepair][RunPs] EXCE��O: {ex.GetType().Name} - {ex.Message}");
                return (-99, ex.Message); 
            }
            finally 
            { 
                try 
                { 
                    if (File.Exists(tmp)) 
                    {
                        await Task.Delay(1000, ct).ConfigureAwait(false); File.Delete(tmp);
                        _logger.LogInfo($"[GameRepair][RunPs] Temp file removido: {tmp}");
                    }
                } 
                catch (Exception ex) 
                { 
                    _logger.LogWarning($"[GameRepair][RunPs] Erro ao remover temp file: {ex.Message}");
                } 
            }
        }

        /// <summary>Executa processo simples.</summary>
        // Executa um instalador .exe com UseShellExecute=false + CreateNoWindow=true
        // CORRE��O DEFINITIVA: UseShellExecute=false propaga CreateNoWindow para todos os processos filhos
        // Isso resolve o problema do VC++ 2005/2008 que cria install.exe filho a partir de IXP000.TMP\
        // ATEN��O: UseShellExecute=false n�o funciona com UAC sem manifesto de eleva��o
        // Para instaladores que precisam de UAC, usar RunAsAdminAsync
        private async Task<(int exitCode, string output)> RunAsync(
            string exe, string args, CancellationToken ct, int timeoutMs = 20_000)
        {
            _logger.LogInfo($"[GameRepair][Run] Executando: {exe} {args}");
            _logger.LogInfo($"[GameRepair][Run] Timeout: {timeoutMs}ms");
            _logger.LogInfo($"[GameRepair][Run] Exe existe: {File.Exists(exe)}");
            
            try
            {
                // MODO �nico: UseShellExecute=false + CreateNoWindow=true
                // Isso garante que nenhuma janela seja exibida, incluindo processos FILHOS
                // quando o instalador usa CREATE_NO_WINDOW flag ao criar subprocessos.
                // Importante: o processo pai precisa ter token de admin (UAC j� elevado) para que
                // os filhos herdem sem mostrar prompt adicional.
                _logger.LogInfo($"[GameRepair][Run] Modo: SILENCIOSO TOTAL (UseShellExecute=false + CreateNoWindow=true)");
                var psi = new ProcessStartInfo
                {
                    FileName               = exe,
                    Arguments              = args,
                    UseShellExecute        = false,   // permite herdar CreateNoWindow para filhos
                    CreateNoWindow         = true,    // sem janela para o processo e seus filhos
                    RedirectStandardOutput = false,   // n�o redirecionar para n�o bloquear instaladores
                    RedirectStandardError  = false,
                    WindowStyle            = System.Diagnostics.ProcessWindowStyle.Hidden
                };
                
                using var proc = new Process { StartInfo = psi };
                _logger.LogInfo($"[GameRepair][Run] Starting process...");
                proc.Start();
                _logger.LogInfo($"[GameRepair][Run] Process started: PID={proc.Id}");
                
                using var cts2 = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts2.CancelAfter(timeoutMs);
                
                try
                {
                    await proc.WaitForExitAsync(cts2.Token);
                    _logger.LogInfo($"[GameRepair][Run] Process exited: ExitCode={proc.ExitCode}");
                }
                catch (OperationCanceledException)
                {
                    _logger.LogWarning($"[GameRepair][Run] Timeout ap�s {timeoutMs}ms");
                    try { proc.Kill(entireProcessTree: true); } catch (Exception ex) { _logger.LogWarning($"[GameRepair][Run] Erro ao matar: {ex.Message}"); }
                    if (ct.IsCancellationRequested) throw new OperationCanceledException(ct);
                    return (-1, "TIMEOUT");
                }
                
                return (proc.ExitCode, $"ExitCode={proc.ExitCode}");
            }
            catch (OperationCanceledException) 
            { 
                _logger.LogWarning("[GameRepair][Run] Cancelado");
                throw; 
            }
            catch (Exception ex) 
            { 
                _logger.LogError($"[GameRepair][Run] EXCE��O: {ex.GetType().Name} - {ex.Message}");
                return (-99, ex.Message); 
            }
        }

        // ---------------------------------------------------------------------
        // SCAN INTELIGENTE (m�x 15 segundos)
        // ---------------------------------------------------------------------

        public async Task<GameRepairScanResult> ScanAsync(
            IProgress<(int pct, string msg)>? progress = null,
            CancellationToken ct = default)
        {
            _logger.LogInfo("[GameRepair][ScanAsync] === INICIANDO SCAN ===");
            
            var sw = Stopwatch.StartNew();
            var result = new GameRepairScanResult { ScanSuccess = true };

            Log("--- SCAN: Corrigir Erros nos Jogos ---", "#31A8FF");
            progress?.Report((0, "Iniciando scan inteligente..."));

            try
            {
                using var scanCts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                scanCts.CancelAfter(TimeSpan.FromSeconds(14));
                _logger.LogInfo("[GameRepair][ScanAsync] Timeout configurado: 14 segundos");

                var tasks = new List<Task<List<GameRepairIssue>>>
                {
                    Task.Run(() => CheckVcRedistAsync(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckDirectXAsync(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckD3DXLegacyAsync(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckXAudio2Async(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckOpenGLAsync(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckVulkanAsync(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckDotNetRuntimeAsync(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckMediaFoundationAsync(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckGpuCrashesAsync(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckAudioServiceAsync(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckGameLaunchersAsync(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckGameModeAsync(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckHAGSAsync(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckXboxDVRAsync(scanCts.Token), scanCts.Token),
                    Task.Run(() => CheckPagefileAsync(scanCts.Token), scanCts.Token),
                };
                
                _logger.LogInfo($"[GameRepair][ScanAsync] Total de tarefas: {tasks.Count}");

                int completed = 0;
                var allResults = await Task.WhenAll(tasks.Select(async (t, idx) =>
                {
                    var taskNames = new[] { "VcRedist", "DirectX", "D3DXLegacy", "XAudio2", "OpenGL", "Vulkan", "DotNet", "MediaFoundation", "GpuCrashes", "AudioService", "GameLaunchers", "GameMode", "HAGS", "XboxDVR", "Pagefile" };
                    var taskName = taskNames[idx];
                    _logger.LogInfo($"[GameRepair][ScanAsync] Iniciando tarefa {taskName}...");
                    
                    try
                    {
                        var r = await t;
                        Interlocked.Increment(ref completed);
                        _logger.LogInfo($"[GameRepair][ScanAsync] Tarefa {taskName} conclu�da. Issues: {r.Count}");
                        progress?.Report((Math.Min(90, (completed * 90) / tasks.Count),
                            $"Verificando componentes... ({completed}/{tasks.Count})"));
                        return r;
                    }
                    catch (OperationCanceledException) 
                    { 
                        _logger.LogWarning($"[GameRepair][ScanAsync] Tarefa {taskName} cancelada");
                        Interlocked.Increment(ref completed); 
                        return new List<GameRepairIssue>(); 
                    }
                    catch (Exception ex) 
                    { 
                        _logger.LogError($"[GameRepair][ScanAsync] Tarefa {taskName} falhou: {ex.Message}");
                        Interlocked.Increment(ref completed); 
                        return new List<GameRepairIssue>(); 
                    }
                }));

                foreach (var issues in allResults)
                {
                    foreach (var issue in issues)
                    {
                        result.AllItems.Add(issue);
                        if (issue.Status == GameRepairItemStatus.Missing)
                            result.Issues.Add(issue);
                    }
                }

                progress?.Report((95, $"Scan conclu�do: {result.Issues.Count} problema(s) encontrado(s)"));

                if (result.AllOk)
                {
                    Log("? Tudo OK � nenhum problema detectado nos componentes de jogos", "#00FF88");
                    _logger.LogInfo("[GameRepair][ScanAsync] Nenhum problema detectado");
                }
                else
                {
                    Log($"? {result.Issues.Count} problema(s) detectado(s)", "#FFA500");
                    _logger.LogWarning($"[GameRepair][ScanAsync] {result.Issues.Count} problema(s) detectado(s)");
                    foreach (var issue in result.Issues)
                    {
                        _logger.LogWarning($"[GameRepair][ScanAsync]   - {issue.Id}: {issue.Title}");
                    }
                }
            }
            catch (OperationCanceledException) when (!ct.IsCancellationRequested)
            {
                _logger.LogWarning("[GameRepair][ScanAsync] Scan encerrado por timeout");
                Log("? Scan encerrado por timeout (15s) � resultados parciais", "#FFA500");
            }
            catch (OperationCanceledException) 
            { 
                _logger.LogWarning("[GameRepair][ScanAsync] Scan cancelado pelo usu�rio");
                throw; 
            }
            catch (Exception ex)
            {
                result.ScanSuccess = false;
                result.ErrorMessage = ex.Message;
                _logger.LogError($"[GameRepair][ScanAsync] EXCE��O: {ex.GetType().Name} - {ex.Message}");
                _logger.LogError($"[GameRepair][ScanAsync] Stack trace: {ex.StackTrace}");
                Log($"? Erro no scan: {ex.Message}", "#FF4444");
            }

            result.Duration = sw.Elapsed;
            _logger.LogInfo($"[GameRepair][ScanAsync] Dura��o: {result.Duration.TotalSeconds:F2}s");
            _logger.LogInfo($"[GameRepair][ScanAsync] ScanSuccess: {result.ScanSuccess}");
            _logger.LogInfo($"[GameRepair][ScanAsync] Total issues: {result.Issues.Count}");
            
            progress?.Report((100, result.AllOk ? "Tudo OK" : $"{result.Issues.Count} problema(s) encontrado(s)"));
            return result;
        }

        // ---------------------------------------------------------------------
        // VERIFICA��ES INDIVIDUAIS
        // ---------------------------------------------------------------------

        /// <summary>
        /// Verifica VC++ via registry (m�todo prim�rio e confi�vel).
        /// CORRE��O: No Windows 10/11 as DLLs ficam em WinSxS, n�o em System32 diretamente.
        /// O registry � a fonte de verdade correta para detectar VC++ instalado.
        /// Retorna TODOS os itens (OK + Missing) para exibi��o em tempo real na UI.
        /// </summary>
        private async Task<List<GameRepairIssue>> CheckVcRedistAsync(CancellationToken ct)
        {
            var items = new List<GameRepairIssue>();
            Log("  ? Verificando Visual C++ Redistributables (2005-2022)...", "#AAAAAA");
            _logger.LogInfo("[GameRepair][CheckVcRedist] Iniciando verifica��o de VC++ Redistributables");

            try
            {
                foreach (var vc in VcVersions)
                {
                    ct.ThrowIfCancellationRequested();

                    _logger.LogInfo($"[GameRepair][CheckVcRedist] Verificando {vc.Label}...");
                    _logger.LogInfo($"[GameRepair][CheckVcRedist]   RegistryKeyword: {vc.RegistryKeyword}");

                    var installed = IsVcRedistInstalledViaRegistry(vc.RegistryKeyword);
                    
                    _logger.LogInfo($"[GameRepair][CheckVcRedist]   Resultado: {(installed ? "INSTALADO" : "AUSENTE")}");

                    if (!installed)
                    {
                        var issue = new GameRepairIssue
                        {
                            Id           = vc.Id,
                            Title        = $"{vc.Label} n�o instalado",
                            Description  = $"{vc.Label} ausente. Jogos que dependem desta vers�o podem n�o iniciar.",
                            Severity     = GameRepairSeverity.Error,
                            CanAutoFix   = true,
                            FixDescription = $"Instalar {vc.Label} x64 + x86",
                            Status       = GameRepairItemStatus.Missing,
                            StatusMessage = $"{vc.Label}: n�o instalado"
                        };
                        items.Add(issue);
                        Log($"  ? {vc.Label} faltando", "#FF4444");
                        _logger.LogWarning($"[GameRepair][CheckVcRedist] {vc.Label} N�O encontrado no registry");
                    }
                    else
                    {
                        // Retorna item OK para exibi��o na UI
                        items.Add(new GameRepairIssue
                        {
                            Id     = vc.Id.Replace("_MISSING", "_OK"),
                            Title  = $"{vc.Label}",
                            Status = GameRepairItemStatus.OK,
                            StatusMessage = $"{vc.Label}: instalado",
                            CanAutoFix = false
                        });
                        Log($"  ? {vc.Label} OK", "#00FF88");
                        _logger.LogInfo($"[GameRepair][CheckVcRedist] {vc.Label} encontrado no registry");
                    }
                }
                
                _logger.LogInfo($"[GameRepair][CheckVcRedist] Verifica��o conclu�da. Issues encontradas: {items.Count(i => i.Status == GameRepairItemStatus.Missing)}");
            }
            catch (OperationCanceledException) 
            { 
                _logger.LogWarning("[GameRepair][CheckVcRedist] Verifica��o cancelada");
                throw; 
            }
            catch (Exception ex) 
            { 
                _logger.LogError($"[GameRepair][CheckVcRedist] EXCE��O: {ex.GetType().Name} - {ex.Message}");
                _logger.LogError($"[GameRepair][CheckVcRedist] Stack trace: {ex.StackTrace}");
            }

            return items;
        }

        /// <summary>
        /// Verifica instala��o de VC++ via registry.
        /// CORRE��O: Busca por keyword parcial no DisplayName para cobrir todas as varia��es.
        /// Ex: "Visual C++ 2015" bate com "Microsoft Visual C++ 2015-2022 Redistributable (x64)"
        /// </summary>
        private bool IsVcRedistInstalledViaRegistry(string keyword)
        {
            _logger.LogInfo($"[GameRepair][Registry] Buscando por keyword: '{keyword}'");
            
            var regPaths = new[]
            {
                @"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
                @"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"
            };
            
            foreach (var regPath in regPaths)
            {
                _logger.LogInfo($"[GameRepair][Registry] Verificando path: HKLM\\{regPath}");
                
                try
                {
                    using var key = Registry.LocalMachine.OpenSubKey(regPath);
                    if (key == null) 
                    {
                        _logger.LogWarning($"[GameRepair][Registry] Chave n�o encontrada: {regPath}");
                        continue;
                    }
                    
                    var subKeyNames = key.GetSubKeyNames();
                    _logger.LogInfo($"[GameRepair][Registry] Total de subchaves: {subKeyNames.Length}");
                    
                    foreach (var subName in subKeyNames)
                    {
                        try
                        {
                            using var sub = key.OpenSubKey(subName);
                            var name = sub?.GetValue("DisplayName") as string ?? "";
                            
                            if (!string.IsNullOrEmpty(name) && name.Contains(keyword, StringComparison.OrdinalIgnoreCase))
                            {
                                _logger.LogInfo($"[GameRepair][Registry] MATCH encontrado: '{name}' em {subName}");
                                return true;
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[GameRepair][Registry] Erro ao ler subchave {subName}: {ex.Message}");
                        }
                    }
                }
                catch (Exception ex) 
                { 
                    _logger.LogError($"[GameRepair][Registry] Erro ao acessar {regPath}: {ex.Message}");
                }
            }
            
            _logger.LogInfo($"[GameRepair][Registry] Keyword '{keyword}' N�O encontrada em nenhuma subchave");
            return false;
        }

        private async Task<List<GameRepairIssue>> CheckDirectXAsync(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  -> Verificando DirectX...", "#AAAAAA");
            try
            {
                var dxDlls = new[]
                {
                    ("d3d9.dll",          "DirectX 9"),
                    ("d3d11.dll",         "DirectX 11"),
                    ("d3d12.dll",         "DirectX 12"),
                    ("dxgi.dll",          "DXGI"),
                    ("d3dcompiler_47.dll", "D3D Compiler 47"),
                    ("xinput1_4.dll",      "XInput 1.4"),
                    ("xinput9_1_0.dll",    "XInput 9.1.0"),
                };
                var missing = new List<string>();
                foreach (var (dll, label) in dxDlls)
                {
                    ct.ThrowIfCancellationRequested();
                    bool has32 = System.IO.File.Exists(System.IO.Path.Combine(Sys32, dll));
                    bool has64 = System.IO.File.Exists(System.IO.Path.Combine(SysWow, dll));
                    bool ok = dll == "d3d12.dll" ? has32 : (has32 || has64);
                    if (!ok) missing.Add(label);
                }
                bool hasDx9Redist = System.IO.File.Exists(System.IO.Path.Combine(Sys32, "d3dx9_43.dll")) ||
                                    System.IO.File.Exists(System.IO.Path.Combine(SysWow, "d3dx9_43.dll"));
                if (!hasDx9Redist) missing.Add("DirectX 9 Redistributable (d3dx9_43)");
                if (missing.Any())
                {
                    issues.Add(new GameRepairIssue
                    {
                        Id = "DX_MISSING", Title = "Componentes DirectX ausentes",
                        Description = $"DLLs faltando: {string.Join(", ", missing)}. Jogos DirectX podem nao iniciar.",
                        Severity = GameRepairSeverity.Error, CanAutoFix = true,
                        FixDescription = "Executar DirectX End-User Runtime Web Installer"
                    });
                    Log($"  X DirectX: {string.Join(", ", missing)} faltando", "#FF4444");
                }
                else { Log("  OK DirectX OK", "#00FF88"); }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckDirectX: {ex.Message}"); }
            return issues;
        }

        private async Task<List<GameRepairIssue>> CheckOpenGLAsync(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  -> Verificando OpenGL...", "#AAAAAA");
            try
            {
                ct.ThrowIfCancellationRequested();
                bool hasOpenGL = System.IO.File.Exists(System.IO.Path.Combine(Sys32, "opengl32.dll"));
                if (!hasOpenGL)
                {
                    issues.Add(new GameRepairIssue
                    {
                        Id = "OPENGL_MISSING", Title = "OpenGL ausente (opengl32.dll)",
                        Description = "opengl32.dll nao encontrado em System32. Jogos OpenGL nao funcionarao.",
                        Severity = GameRepairSeverity.Error, CanAutoFix = true,
                        FixDescription = "Restaurar opengl32.dll via SFC /scannow"
                    });
                    Log("  X OpenGL: opengl32.dll ausente", "#FF4444");
                }
                else { Log("  OK OpenGL OK", "#00FF88"); }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckOpenGL: {ex.Message}"); }
            return issues;
        }

        private async Task<List<GameRepairIssue>> CheckVulkanAsync(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  -> Verificando Vulkan Runtime...", "#AAAAAA");
            try
            {
                ct.ThrowIfCancellationRequested();
                bool hasVulkan64 = System.IO.File.Exists(System.IO.Path.Combine(Sys32, "vulkan-1.dll"));
                bool hasVulkan32 = System.IO.File.Exists(System.IO.Path.Combine(SysWow, "vulkan-1.dll"));
                bool hasVulkanReg = false;
                try
                {
                    using var vkKey = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Khronos\Vulkan\Drivers");
                    hasVulkanReg = vkKey != null && vkKey.GetValueNames().Length > 0;
                }
                catch { }
                if (!hasVulkan64 && !hasVulkan32 && !hasVulkanReg)
                {
                    issues.Add(new GameRepairIssue
                    {
                        Id = "VULKAN_MISSING", Title = "Vulkan Runtime nao instalado",
                        Description = "vulkan-1.dll ausente. Jogos Vulkan nao funcionarao.",
                        Severity = GameRepairSeverity.Warning, CanAutoFix = true,
                        FixDescription = "Instalar Vulkan Runtime via driver de GPU (NVIDIA/AMD/Intel)"
                    });
                    Log("  X Vulkan Runtime ausente", "#FF4444");
                }
                else { Log("  OK Vulkan OK", "#00FF88"); }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckVulkan: {ex.Message}"); }
            return issues;
        }

        private async Task<List<GameRepairIssue>> CheckDotNetRuntimeAsync(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  -> Verificando .NET Runtime...", "#AAAAAA");
            try
            {
                ct.ThrowIfCancellationRequested();
                bool hasDotNet4 = false;
                try
                {
                    using var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(
                        @"SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full");
                    var release = key?.GetValue("Release") as int?;
                    hasDotNet4 = release.HasValue && release.Value >= 394802;
                }
                catch { }
                if (!hasDotNet4)
                {
                    issues.Add(new GameRepairIssue
                    {
                        Id = "DOTNET4_MISSING", Title = ".NET Framework 4.6.2+ nao instalado",
                        Description = ".NET Framework 4.6.2 ou superior ausente.",
                        Severity = GameRepairSeverity.Error, CanAutoFix = true,
                        FixDescription = "Instalar .NET Framework 4.8 via Windows Update"
                    });
                    Log("  X .NET Framework 4.6.2+ ausente", "#FF4444");
                }
                else { Log("  OK .NET Framework 4.x OK", "#00FF88"); }

                ct.ThrowIfCancellationRequested();
                var dotnetRoot = System.IO.Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles),
                    "dotnet", "shared", "Microsoft.NETCore.App");
                bool hasDotNetCore = System.IO.Directory.Exists(dotnetRoot) &&
                                     System.IO.Directory.GetDirectories(dotnetRoot).Length > 0;
                if (!hasDotNetCore)
                {
                    issues.Add(new GameRepairIssue
                    {
                        Id = "DOTNETCORE_MISSING", Title = ".NET 6/7/8 Runtime nao instalado",
                        Description = ".NET Runtime moderno ausente.",
                        Severity = GameRepairSeverity.Warning, CanAutoFix = true,
                        FixDescription = "Instalar .NET 8 Desktop Runtime automaticamente"
                    });
                    Log("  X .NET 6/7/8 Runtime ausente", "#FF4444");
                }
                else { Log("  OK .NET Runtime moderno OK", "#00FF88"); }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckDotNetRuntime: {ex.Message}"); }
            return issues;
        }

        private async Task<List<GameRepairIssue>> CheckMediaFoundationAsync(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  -> Verificando Media Foundation...", "#AAAAAA");
            try
            {
                ct.ThrowIfCancellationRequested();
                var mfDlls = new[] { "mf.dll", "mfplat.dll", "mfreadwrite.dll", "mfplay.dll" };
                var missing = mfDlls.Where(dll => !System.IO.File.Exists(System.IO.Path.Combine(Sys32, dll))).ToList();
                if (missing.Any())
                {
                    issues.Add(new GameRepairIssue
                    {
                        Id = "MF_MISSING", Title = "Media Foundation ausente",
                        Description = $"DLLs faltando: {string.Join(", ", missing)}.",
                        Severity = GameRepairSeverity.Warning, CanAutoFix = true,
                        FixDescription = "Habilitar Media Foundation via DISM"
                    });
                    Log($"  X Media Foundation: {string.Join(", ", missing)} faltando", "#FF4444");
                }
                else { Log("  OK Media Foundation OK", "#00FF88"); }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckMediaFoundation: {ex.Message}"); }
            return issues;
        }

        private async Task<List<GameRepairIssue>> CheckGpuCrashesAsync(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  -> Verificando crashes de GPU...", "#AAAAAA");
            try
            {
                ct.ThrowIfCancellationRequested();
                var script = @"
$events = Get-WinEvent -FilterHashtable @{ LogName='System'; Id=@(4101,4116); StartTime=(Get-Date).AddDays(-7) } -ErrorAction SilentlyContinue -MaxEvents 5
if ($events) { Write-Output ""GPU_TDR_COUNT=$($events.Count)"" } else { Write-Output 'GPU_TDR_NONE' }
";
                var (_, psOut) = await RunPsAsync(script, ct, timeoutMs: 10_000);
                if (psOut.Contains("GPU_TDR_COUNT="))
                {
                    var countStr = psOut.Split('\n').FirstOrDefault(l => l.StartsWith("GPU_TDR_COUNT="))?.Replace("GPU_TDR_COUNT=", "").Trim() ?? "0";
                    int.TryParse(countStr, out int tdrCount);
                    if (tdrCount > 0)
                    {
                        issues.Add(new GameRepairIssue
                        {
                            Id = "GPU_TDR", Title = $"GPU: {tdrCount} crash(es) de driver nos ultimos 7 dias",
                            Description = "Erros TDR de GPU detectados. Jogos podem travar.",
                            Severity = GameRepairSeverity.Warning, CanAutoFix = false,
                            FixDescription = "Atualizar ou reinstalar driver de GPU"
                        });
                        Log($"  X GPU: {tdrCount} TDR(s) detectado(s)", "#FF4444");
                    }
                    else { Log("  OK GPU: sem crashes recentes", "#00FF88"); }
                }
                else { Log("  OK GPU: sem crashes recentes", "#00FF88"); }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckGpuCrashes: {ex.Message}"); }
            return issues;
        }

        private async Task<List<GameRepairIssue>> CheckAudioServiceAsync(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  -> Verificando servico de audio...", "#AAAAAA");
            try
            {
                ct.ThrowIfCancellationRequested();
                var script = @"
$svc = Get-Service -Name 'AudioSrv' -ErrorAction SilentlyContinue
if ($svc) { Write-Output ""AUDIO_STATUS=$($svc.Status)"" } else { Write-Output 'AUDIO_NOT_FOUND' }
";
                var (_, psOut) = await RunPsAsync(script, ct, timeoutMs: 10_000);
                bool audioRunning = psOut.Contains("AUDIO_STATUS=Running");
                bool audioFound   = !psOut.Contains("AUDIO_NOT_FOUND");
                if (!audioFound)
                {
                    issues.Add(new GameRepairIssue { Id = "AUDIO_SVC_MISSING", Title = "Servico de Audio nao encontrado",
                        Description = "Windows Audio Service nao encontrado.", Severity = GameRepairSeverity.Error,
                        CanAutoFix = true, FixDescription = "Restaurar via SFC /scannow" });
                    Log("  X Servico de audio nao encontrado", "#FF4444");
                }
                else if (!audioRunning)
                {
                    issues.Add(new GameRepairIssue { Id = "AUDIO_SVC_STOPPED", Title = "Servico de Audio parado",
                        Description = "Windows Audio Service parado. Jogos nao terao audio.", Severity = GameRepairSeverity.Error,
                        CanAutoFix = true, FixDescription = "Iniciar Windows Audio Service" });
                    Log("  X Servico de audio parado", "#FF4444");
                }
                else { Log("  OK Servico de audio OK", "#00FF88"); }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckAudioService: {ex.Message}"); }
            return issues;
        }

        private async Task<List<GameRepairIssue>> CheckGameLaunchersAsync(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  -> Verificando launchers de jogos...", "#AAAAAA");
            try
            {
                ct.ThrowIfCancellationRequested();
                var launchers = new[]
                {
                    ("Steam",      @"SOFTWARE\Valve\Steam",                       "InstallPath",     "steam.exe"),
                    ("EA App",     @"SOFTWARE\Electronic Arts\EA Desktop",        "InstallLocation", "EADesktop.exe"),
                    ("Battle.net", @"SOFTWARE\Blizzard Entertainment\Battle.net", "InstallPath",     "Battle.net.exe"),
                };
                foreach (var (name, regKey, valueName, exeName) in launchers)
                {
                    ct.ThrowIfCancellationRequested();
                    try
                    {
                        using var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(regKey) ??
                                        Microsoft.Win32.Registry.CurrentUser.OpenSubKey(regKey);
                        if (key == null) continue;
                        var installPath = key.GetValue(valueName) as string;
                        if (!string.IsNullOrEmpty(installPath))
                        {
                            var exePath = System.IO.Path.Combine(installPath, exeName);
                            if (!System.IO.File.Exists(exePath))
                            {
                                issues.Add(new GameRepairIssue
                                {
                                    Id = $"LAUNCHER_{name.Replace(" ","_").ToUpper()}_CORRUPT",
                                    Title = $"{name}: executavel ausente",
                                    Description = $"{name} registrado mas executavel nao encontrado. Reinstale.",
                                    Severity = GameRepairSeverity.Warning, CanAutoFix = false,
                                    FixDescription = $"Reinstalar {name}"
                                });
                                Log($"  X {name}: executavel ausente", "#FF4444");
                                continue;
                            }
                        }
                        Log($"  OK {name} OK", "#00FF88");
                    }
                    catch { }
                }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckGameLaunchers: {ex.Message}"); }
            return issues;
        }

        // --- Novos checks profissionais ----------------------------------------

        /// <summary>
        /// Verifica DLLs D3DX legacy completas (d3dx9_24 at� d3dx9_43, d3dx10, d3dx11).
        /// Jogos antigos como GTA SA, Skyrim, etc. dependem dessas DLLs.
        /// </summary>
        private async Task<List<GameRepairIssue>> CheckD3DXLegacyAsync(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  ? Verificando DLLs D3DX Legacy (d3dx9_24~43, d3dx10, d3dx11)...", "#AAAAAA");
            try
            {
                ct.ThrowIfCancellationRequested();
                var missing = new List<string>();

                // d3dx9_24 at� d3dx9_43 � jogos at� ~2010
                for (int i = 24; i <= 43; i++)
                {
                    ct.ThrowIfCancellationRequested();
                    var dll = $"d3dx9_{i}.dll";
                    bool has = System.IO.File.Exists(System.IO.Path.Combine(Sys32, dll))
                            || System.IO.File.Exists(System.IO.Path.Combine(SysWow, dll));
                    if (!has) missing.Add(dll);
                }

                // d3dx10 e d3dx10_43
                foreach (var dll in new[] { "d3dx10.dll", "d3dx10_43.dll" })
                {
                    ct.ThrowIfCancellationRequested();
                    bool has = System.IO.File.Exists(System.IO.Path.Combine(Sys32, dll))
                            || System.IO.File.Exists(System.IO.Path.Combine(SysWow, dll));
                    if (!has) missing.Add(dll);
                }

                // d3dx11_43 � usado por jogos DX11 antigos
                {
                    var dll = "d3dx11_43.dll";
                    bool has = System.IO.File.Exists(System.IO.Path.Combine(Sys32, dll))
                            || System.IO.File.Exists(System.IO.Path.Combine(SysWow, dll));
                    if (!has) missing.Add(dll);
                }

                if (missing.Count > 0)
                {
                    issues.Add(new GameRepairIssue
                    {
                        Id = "D3DX_LEGACY_MISSING",
                        Title = $"D3DX Legacy: {missing.Count} DLL(s) ausente(s)",
                        Description = $"DLLs ausentes: {string.Join(", ", missing.Take(5))}{(missing.Count > 5 ? $" +{missing.Count - 5} mais" : "")}. Jogos antigos podem n�o iniciar.",
                        Severity = GameRepairSeverity.Error,
                        CanAutoFix = true,
                        FixDescription = "Instalar DirectX End-User Runtime (inclui todas as D3DX legacy)"
                    });
                    Log($"  ? D3DX Legacy: {missing.Count} DLL(s) faltando", "#FF4444");
                    _logger.LogWarning($"[GameRepair][CheckD3DXLegacy] {missing.Count} DLLs ausentes: {string.Join(", ", missing)}");
                }
                else
                {
                    Log("  ? D3DX Legacy OK", "#00FF88");
                    _logger.LogInfo("[GameRepair][CheckD3DXLegacy] Todas as DLLs D3DX Legacy presentes");
                }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckD3DXLegacy: {ex.Message}"); }
            return issues;
        }

        /// <summary>
        /// Verifica XAudio2 DLLs � necess�rio para �udio em jogos DirectX/XNA.
        /// </summary>
        private async Task<List<GameRepairIssue>> CheckXAudio2Async(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  ? Verificando XAudio2...", "#AAAAAA");
            try
            {
                ct.ThrowIfCancellationRequested();
                var missing = new List<string>();

                // xaudio2_0 at� xaudio2_9
                for (int i = 0; i <= 9; i++)
                {
                    ct.ThrowIfCancellationRequested();
                    var dll = $"xaudio2_{i}.dll";
                    bool has = System.IO.File.Exists(System.IO.Path.Combine(Sys32, dll))
                            || System.IO.File.Exists(System.IO.Path.Combine(SysWow, dll));
                    if (!has) missing.Add(dll);
                }

                // x3daudio1_7 (DirectX audio 3D)
                var x3d = "x3daudio1_7.dll";
                if (!System.IO.File.Exists(System.IO.Path.Combine(Sys32, x3d))
                 && !System.IO.File.Exists(System.IO.Path.Combine(SysWow, x3d)))
                    missing.Add(x3d);

                // XAPOFX1_5 (audio effects chain)
                var xapofx = "XAPOFX1_5.dll";
                if (!System.IO.File.Exists(System.IO.Path.Combine(Sys32, xapofx))
                 && !System.IO.File.Exists(System.IO.Path.Combine(SysWow, xapofx)))
                    missing.Add(xapofx);

                if (missing.Count > 0)
                {
                    issues.Add(new GameRepairIssue
                    {
                        Id = "XAUDIO2_MISSING",
                        Title = $"XAudio2: {missing.Count} DLL(s) ausente(s)",
                        Description = $"XAudio2 DLLs ausentes: {string.Join(", ", missing)}. Jogos podem n�o ter �udio.",
                        Severity = GameRepairSeverity.Error,
                        CanAutoFix = true,
                        FixDescription = "Instalar DirectX End-User Runtime (inclui XAudio2 completo)"
                    });
                    Log($"  ? XAudio2: {missing.Count} DLL(s) faltando", "#FF4444");
                    _logger.LogWarning($"[GameRepair][CheckXAudio2] {missing.Count} DLLs ausentes: {string.Join(", ", missing)}");
                }
                else
                {
                    Log("  ? XAudio2 OK", "#00FF88");
                    _logger.LogInfo("[GameRepair][CheckXAudio2] XAudio2 OK");
                }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckXAudio2: {ex.Message}"); }
            return issues;
        }

        /// <summary>
        /// Verifica se o Windows Game Mode est� ativado (melhora prioridade de CPU/GPU para jogos).
        /// </summary>
        private async Task<List<GameRepairIssue>> CheckGameModeAsync(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  ? Verificando Game Mode...", "#AAAAAA");
            try
            {
                ct.ThrowIfCancellationRequested();
                bool gameModeOk = false;
                try
                {
                    using var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(
                        @"Software\Microsoft\GameBar");
                    var val = key?.GetValue("AllowAutoGameMode") as int?;
                    var val2 = key?.GetValue("AutoGameModeEnabled") as int?;
                    // Game Mode est� OK se AutoGameMode est� habilitado (1) ou n�o foi desativado (null)
                    gameModeOk = val.GetValueOrDefault(1) != 0 && val2.GetValueOrDefault(1) != 0;
                }
                catch { gameModeOk = true; } // se n�o consegue ler, assume OK

                if (!gameModeOk)
                {
                    issues.Add(new GameRepairIssue
                    {
                        Id = "GAMEMODE_DISABLED",
                        Title = "Windows Game Mode desativado",
                        Description = "Game Mode desativado. Ative para melhorar FPS e reduzir stuttering.",
                        Severity = GameRepairSeverity.Warning,
                        CanAutoFix = true,
                        FixDescription = "Ativar Game Mode via Registry"
                    });
                    Log("  ? Game Mode desativado", "#FF4444");
                    _logger.LogWarning("[GameRepair][CheckGameMode] Game Mode desativado");
                }
                else
                {
                    Log("  ? Game Mode OK", "#00FF88");
                    _logger.LogInfo("[GameRepair][CheckGameMode] Game Mode ativo");
                }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckGameMode: {ex.Message}"); }
            return issues;
        }

        /// <summary>
        /// Verifica HAGS (Hardware-Accelerated GPU Scheduling) � reduz lat�ncia em GPUs modernas.
        /// Suportado em Windows 10 2004+ com GPU WDDM 2.7+.
        /// </summary>
        private async Task<List<GameRepairIssue>> CheckHAGSAsync(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  ? Verificando HAGS (Hardware GPU Scheduling)...", "#AAAAAA");
            try
            {
                ct.ThrowIfCancellationRequested();
                bool hagsEnabled = false;
                bool hagsSupported = false;
                try
                {
                    // Verifica se GPU suporta HAGS (WDDM 2.7+ = Windows 10 2004+)
                    using var gpuKey = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(
                        @"SYSTEM\CurrentControlSet\Control\GraphicsDrivers");
                    if (gpuKey != null)
                    {
                        hagsSupported = true;
                        var hagsVal = gpuKey.GetValue("HwSchMode") as int?;
                        hagsEnabled = hagsVal.HasValue && hagsVal.Value == 2;
                    }
                }
                catch { }

                if (hagsSupported && !hagsEnabled)
                {
                    issues.Add(new GameRepairIssue
                    {
                        Id = "HAGS_DISABLED",
                        Title = "HAGS (Hardware GPU Scheduling) desativado",
                        Description = "HAGS desativado. Ativar reduz lat�ncia de GPU e melhora performance em jogos modernos.",
                        Severity = GameRepairSeverity.Warning,
                        CanAutoFix = true,
                        FixDescription = "Ativar HAGS via Registry (requer reinicializa��o)"
                    });
                    Log("  ? HAGS desativado", "#FF4444");
                    _logger.LogWarning("[GameRepair][CheckHAGS] HAGS desativado");
                }
                else
                {
                    Log("  ? HAGS OK", "#00FF88");
                    _logger.LogInfo($"[GameRepair][CheckHAGS] HAGS OK (supported={hagsSupported}, enabled={hagsEnabled})");
                }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckHAGS: {ex.Message}"); }
            return issues;
        }

        /// <summary>
        /// Verifica Xbox Game Bar DVR (captura de tela em background) � pode causar stuttering e
        /// perda de ~10-15% de performance em jogos.
        /// </summary>
        private async Task<List<GameRepairIssue>> CheckXboxDVRAsync(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  ? Verificando Xbox Game Bar/DVR...", "#AAAAAA");
            try
            {
                ct.ThrowIfCancellationRequested();
                bool dvrActive = false;
                try
                {
                    // GameDVR_Enabled no HKCU
                    using var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(
                        @"System\GameConfigStore");
                    var dvrVal = key?.GetValue("GameDVR_Enabled") as int?;
                    dvrActive = dvrVal.GetValueOrDefault(1) == 1;

                    // Tamb�m verifica AppCaptureEnabled no HKLM
                    if (!dvrActive)
                    {
                        using var key2 = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(
                            @"SOFTWARE\Policies\Microsoft\Windows\GameDVR");
                        var captureVal = key2?.GetValue("AllowGameDVR") as int?;
                        dvrActive = captureVal == null || captureVal.Value != 0;
                    }
                }
                catch { dvrActive = false; }

                if (dvrActive)
                {
                    issues.Add(new GameRepairIssue
                    {
                        Id = "XBOX_DVR_ACTIVE",
                        Title = "Xbox Game Bar DVR ativo (impacto de FPS)",
                        Description = "Game Bar DVR ativo pode causar stuttering e reduzir FPS em at� 15%.",
                        Severity = GameRepairSeverity.Warning,
                        CanAutoFix = true,
                        FixDescription = "Desativar Game Bar DVR via Registry"
                    });
                    Log("  ? Xbox DVR ativo � pode causar stuttering", "#FF4444");
                    _logger.LogWarning("[GameRepair][CheckXboxDVR] Xbox DVR ativo");
                }
                else
                {
                    Log("  ? Xbox DVR OK (desativado)", "#00FF88");
                    _logger.LogInfo("[GameRepair][CheckXboxDVR] Xbox DVR desativado");
                }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckXboxDVR: {ex.Message}"); }
            return issues;
        }

        /// <summary>
        /// Verifica o tamanho do Pagefile (mem�ria virtual).
        /// Pagefile pequeno ou desativado causa crashes em jogos que precisam de muita RAM.
        /// </summary>
        private async Task<List<GameRepairIssue>> CheckPagefileAsync(CancellationToken ct)
        {
            var issues = new List<GameRepairIssue>();
            Log("  ? Verificando Pagefile (mem�ria virtual)...", "#AAAAAA");
            try
            {
                ct.ThrowIfCancellationRequested();
                long totalRamMb = 0;
                long pagefileMb = 0;

                try
                {
                    // RAM total via GlobalMemoryStatusEx
                    var script = @"
$cs = Get-CimInstance -ClassName Win32_ComputerSystem
$pf = Get-CimInstance -ClassName Win32_PageFileUsage
Write-Output ""RAM_MB=$([math]::Round($cs.TotalPhysicalMemory / 1MB))""
Write-Output ""PAGEFILE_MB=$($pf | Measure-Object -Property AllocatedBaseSize -Sum | Select-Object -ExpandProperty Sum)""
";
                    var (_, psOut) = await RunPsAsync(script, ct, timeoutMs: 10_000);
                    var ramLine = psOut.Split('\n').FirstOrDefault(l => l.StartsWith("RAM_MB="));
                    var pfLine  = psOut.Split('\n').FirstOrDefault(l => l.StartsWith("PAGEFILE_MB="));
                    if (ramLine != null) long.TryParse(ramLine.Replace("RAM_MB=", "").Trim(), out totalRamMb);
                    if (pfLine  != null) long.TryParse(pfLine.Replace("PAGEFILE_MB=", "").Trim(), out pagefileMb);
                }
                catch { }

                _logger.LogInfo($"[GameRepair][CheckPagefile] RAM={totalRamMb}MB, Pagefile={pagefileMb}MB");

                // Pagefile deve ser no m�nimo 1x RAM ou 4GB (o que for maior)
                long minRecommendedMb = Math.Max(totalRamMb, 4096);

                if (pagefileMb == 0)
                {
                    issues.Add(new GameRepairIssue
                    {
                        Id = "PAGEFILE_DISABLED",
                        Title = "Pagefile (mem�ria virtual) desativado",
                        Description = "Sem pagefile, jogos que precisam de mais RAM v�o travar ou crashar.",
                        Severity = GameRepairSeverity.Error,
                        CanAutoFix = true,
                        FixDescription = "Ativar pagefile gerenciado pelo Windows"
                    });
                    Log("  ? Pagefile desativado � risco de crash em jogos", "#FF4444");
                    _logger.LogWarning("[GameRepair][CheckPagefile] Pagefile desativado");
                }
                else if (totalRamMb > 0 && pagefileMb < minRecommendedMb)
                {
                    issues.Add(new GameRepairIssue
                    {
                        Id = "PAGEFILE_SMALL",
                        Title = $"Pagefile pequeno ({pagefileMb}MB � recomendado {minRecommendedMb}MB)",
                        Description = $"Pagefile de {pagefileMb}MB pode ser insuficiente. Recomendado: {minRecommendedMb}MB.",
                        Severity = GameRepairSeverity.Warning,
                        CanAutoFix = true,
                        FixDescription = "Aumentar pagefile para tamanho gerenciado pelo Windows"
                    });
                    Log($"  ? Pagefile pequeno: {pagefileMb}MB (recomendado {minRecommendedMb}MB)", "#FF4444");
                    _logger.LogWarning($"[GameRepair][CheckPagefile] Pagefile insuficiente: {pagefileMb}MB");
                }
                else
                {
                    Log($"  ? Pagefile OK ({pagefileMb}MB)", "#00FF88");
                    _logger.LogInfo($"[GameRepair][CheckPagefile] Pagefile OK: {pagefileMb}MB");
                }
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex) { _logger.LogWarning($"[GameRepair] CheckPagefile: {ex.Message}"); }
            return issues;
        }

        // -------------------------------------------------------------------------
        // REPARO

        public async Task<GameRepairResult> RepairAsync(
            List<GameRepairIssue> issues,
            IProgress<(int pct, string msg)>? progress = null,
            CancellationToken ct = default)
        {
            _logger.LogInfo($"[GameRepair][RepairAsync] Iniciando reparo. Total de issues: {issues.Count}");

            var result = new GameRepairResult { TotalIssues = issues.Count };
            Log("=== REPARO: Corrigindo problemas nos jogos ===", "#31A8FF");
            progress?.Report((0, $"Iniciando reparo de {issues.Count} problema(s)..."));

            // Separar issues por categoria de velocidade
            // — instantâneas: apenas registro/serviços, sem download (milissegundos)
            // — download: precisam baixar instaladores da internet
            // — manual: não têm correção automática
            var instantIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
                { "GAMEMODE_DISABLED", "HAGS_DISABLED", "XBOX_DVR_ACTIVE",
                  "PAGEFILE_DISABLED", "PAGEFILE_SMALL",
                  "AUDIO_SVC_STOPPED", "AUDIO_SVC_MISSING",
                  "OPENGL_MISSING" };

            var instantIssues = issues.Where(i =>  i.CanAutoFix && instantIds.Contains(i.Id)).ToList();
            var downloadIssues = issues.Where(i => i.CanAutoFix && !instantIds.Contains(i.Id)).ToList();
            var manualIssues   = issues.Where(i => !i.CanAutoFix).ToList();

            // ── ETAPA 1: Correções instantâneas em PARALELO (0-30%) ─────────────────────
            if (instantIssues.Count > 0)
            {
                progress?.Report((2, $"Aplicando {instantIssues.Count} correção(ões) instantânea(s)..."));
                _logger.LogInfo($"[GameRepair][RepairAsync] ETAPA 1: {instantIssues.Count} instantâneas em paralelo");

                var instantTasks = instantIssues.Select(async issue =>
                {
                    ct.ThrowIfCancellationRequested();
                    _logger.LogInfo($"[GameRepair][Instant] Corrigindo: {issue.Id}");
                    var fix = await FixIssueAsync(issue, null, ct).ConfigureAwait(false);
                    return (issue, fix);
                });

                var instantResults = await Task.WhenAll(instantTasks).ConfigureAwait(false);
                foreach (var (issue, fix) in instantResults)
                {
                    result.Details.Add(fix);
                    if (fix.Success) { result.FixedCount++;   Log($"  OK {issue.Title}: corrigido", "#00FF88"); }
                    else             { result.SkippedCount++; Log($"  X {issue.Title}: falhou - {fix.Message}", "#FF4444"); }
                }
                int instantOk = instantResults.Count(r => r.fix.Success);
                progress?.Report((30, $"Correções instantâneas: {instantOk}/{instantIssues.Count} OK"));
            }

            // ── ETAPA 2: Correções com download (30-95%) ────────────────────────
            int downloadStart = instantIssues.Count > 0 ? 30 : 0;
            int downloadRange = 95 - downloadStart;
            int downloadIdx   = 0;

            foreach (var issue in downloadIssues)
            {
                ct.ThrowIfCancellationRequested();
                downloadIdx++;

                int basePct = downloadStart + ((downloadIdx - 1) * downloadRange) / Math.Max(downloadIssues.Count, 1);
                int nextPct = downloadStart + (downloadIdx       * downloadRange) / Math.Max(downloadIssues.Count, 1);

                IProgress<(int pct, string msg)> subProgress = new Progress<(int pct, string msg)>(p =>
                {
                    int mapped = basePct + (int)((p.pct / 100.0) * (nextPct - basePct));
                    progress?.Report((Math.Min(mapped, 95), p.msg));
                });

                progress?.Report((basePct, $"[{downloadIdx}/{downloadIssues.Count}] Baixando/Instalando: {issue.Title}"));
                Log($"  -> Corrigindo (download): {issue.Title}", "#AAAAAA");
                _logger.LogInfo($"[GameRepair][Download] [{downloadIdx}/{downloadIssues.Count}] {issue.Id}");

                var fixResult = await FixIssueAsync(issue, subProgress, ct).ConfigureAwait(false);
                result.Details.Add(fixResult);

                if (fixResult.Success)
                {
                    result.FixedCount++;
                    Log($"  OK {issue.Title}: corrigido", "#00FF88");
                    progress?.Report((nextPct, $"✅ {issue.Title}: corrigido"));
                }
                else
                {
                    result.SkippedCount++;
                    Log($"  X {issue.Title}: falhou - {fixResult.Message}", "#FF4444");
                    _logger.LogError($"[GameRepair][Download] Falha: {issue.Id} - {fixResult.Message}");
                    progress?.Report((nextPct, $"⚠ {issue.Title}: falhou"));
                }
            }

            // ── ETAPA 3: Issues manuais (apenas registrar) ─────────────────────
            foreach (var issue in manualIssues)
            {
                result.SkippedCount++;
                result.Details.Add(new GameRepairFixResult { IssueId = issue.Id, Success = false, Message = "Correção manual: " + issue.FixDescription });
                Log($"  ! {issue.Title}: requer ação manual", "#FFA500");
            }

            progress?.Report((100, $"Reparo concluído: {result.FixedCount}/{result.TotalIssues} corrigidos"));
            Log($"OK Reparo concluido: {result.FixedCount}/{result.TotalIssues} corrigidos", "#00FF88");

            _logger.LogInfo($"[GameRepair][RepairAsync] Total={result.TotalIssues} Fixed={result.FixedCount} Skipped={result.SkippedCount} RequiresReboot={result.RequiresReboot}");

            return result;
        }

        private async Task<GameRepairFixResult> FixIssueAsync(GameRepairIssue issue, IProgress<(int pct, string msg)>? progress, CancellationToken ct)
        {
            _logger.LogInfo($"[GameRepair][FixIssueAsync] Issue ID: {issue.Id}");
            _logger.LogInfo($"[GameRepair][FixIssueAsync] Dispatching para handler apropriado...");
            
            try
            {
                GameRepairFixResult result;
                
                switch (issue.Id)
                {
                    case "D3DX_LEGACY_MISSING":
                        _logger.LogInfo($"[GameRepair][FixIssueAsync] Handler: FixDirectXAsync (D3DX Legacy)");
                        result = await FixDirectXAsync(progress, ct); // dxwebsetup instala tudo
                        result.IssueId = "D3DX_LEGACY_MISSING";
                        break;

                    case "XAUDIO2_MISSING":
                        _logger.LogInfo($"[GameRepair][FixIssueAsync] Handler: FixDirectXAsync (XAudio2)");
                        result = await FixDirectXAsync(progress, ct); // dxwebsetup tamb�m instala XAudio2
                        result.IssueId = "XAUDIO2_MISSING";
                        break;

                    case "GAMEMODE_DISABLED":
                        _logger.LogInfo($"[GameRepair][FixIssueAsync] Handler: FixGameModeAsync");
                        result = await FixGameModeAsync(ct);
                        break;

                    case "HAGS_DISABLED":
                        _logger.LogInfo($"[GameRepair][FixIssueAsync] Handler: FixHAGSAsync");
                        result = await FixHAGSAsync(ct);
                        break;

                    case "XBOX_DVR_ACTIVE":
                        _logger.LogInfo($"[GameRepair][FixIssueAsync] Handler: FixXboxDVRAsync");
                        result = await FixXboxDVRAsync(ct);
                        break;

                    case "PAGEFILE_DISABLED":
                    case "PAGEFILE_SMALL":
                        _logger.LogInfo($"[GameRepair][FixIssueAsync] Handler: FixPagefileAsync");
                        result = await FixPagefileAsync(issue.Id, ct);
                        break;

                    case var id when id.StartsWith("VC_") && id.EndsWith("_MISSING"):
                        _logger.LogInfo($"[GameRepair][FixIssueAsync] Handler: FixVcRedistAsync");
                        result = await FixVcRedistAsync(issue, progress, ct);
                        break;
                        
                    case "DX_MISSING":
                        _logger.LogInfo($"[GameRepair][FixIssueAsync] Handler: FixDirectXAsync");
                        result = await FixDirectXAsync(progress, ct);
                        break;
                        
                    case "OPENGL_MISSING":
                        _logger.LogInfo($"[GameRepair][FixIssueAsync] Handler: FixOpenGLAsync");
                        result = await FixOpenGLAsync(ct);
                        break;
                        
                    case "VULKAN_MISSING":
                        _logger.LogWarning($"[GameRepair][FixIssueAsync] Vulkan requer corre��o manual (driver GPU)");
                        result = new GameRepairFixResult { IssueId = issue.Id, Success = false, Message = "Vulkan requer reinstalacao do driver de GPU" };
                        break;
                        
                    case "DOTNET4_MISSING":
                        _logger.LogInfo($"[GameRepair][FixIssueAsync] Handler: FixDotNet4Async");
                        result = await FixDotNet4Async(progress, ct);
                        break;
                        
                    case "DOTNETCORE_MISSING":
                        _logger.LogInfo($"[GameRepair][FixIssueAsync] Handler: FixDotNetCoreAsync");
                        result = await FixDotNetCoreAsync(progress, ct);
                        break;
                        
                    case "MF_MISSING":
                        _logger.LogInfo($"[GameRepair][FixIssueAsync] Handler: FixMediaFoundationAsync");
                        result = await FixMediaFoundationAsync(progress, ct);
                        break;
                        
                    case "AUDIO_SVC_STOPPED":
                    case "AUDIO_SVC_MISSING":
                        _logger.LogInfo($"[GameRepair][FixIssueAsync] Handler: FixAudioServiceAsync");
                        result = await FixAudioServiceAsync(ct);
                        break;
                        
                    default:
                        _logger.LogWarning($"[GameRepair][FixIssueAsync] Sem handler autom�tico para: {issue.Id}");
                        result = new GameRepairFixResult { IssueId = issue.Id, Success = false, Message = "Sem correcao automatica: " + issue.FixDescription };
                        break;
                }
                
                _logger.LogInfo($"[GameRepair][FixIssueAsync] Resultado: Success={result.Success}, Message={result.Message}");
                return result;
            }
            catch (OperationCanceledException) 
            { 
                _logger.LogWarning($"[GameRepair][FixIssueAsync] Cancelado: {issue.Id}");
                throw; 
            }
            catch (Exception ex) 
            { 
                _logger.LogError($"[GameRepair][FixIssueAsync] EXCE��O em {issue.Id}: {ex.GetType().Name} - {ex.Message}");
                _logger.LogError($"[GameRepair][FixIssueAsync] Stack trace: {ex.StackTrace}");
                return new GameRepairFixResult { IssueId = issue.Id, Success = false, Message = ex.Message }; 
            }
        }

        private async Task<GameRepairFixResult> FixVcRedistAsync(GameRepairIssue issue, IProgress<(int pct, string msg)>? progress, CancellationToken ct)
        {
            _logger.LogInfo($"[GameRepair][FixVcRedist] Iniciando reparo para issue: {issue.Id}");
            _logger.LogInfo($"[GameRepair][FixVcRedist] T�tulo: {issue.Title}");
            
            var vc = VcVersions.FirstOrDefault(v => v.Id == issue.Id);
            if (string.IsNullOrEmpty(vc.Id))
            {
                _logger.LogError($"[GameRepair][FixVcRedist] Vers�o VC++ n�o mapeada para ID: {issue.Id}");
                return new GameRepairFixResult { IssueId = issue.Id, Success = false, Message = "Versao VC++ nao mapeada" };
            }
            
            _logger.LogInfo($"[GameRepair][FixVcRedist] Vers�o encontrada: {vc.Label}");
            _logger.LogInfo($"[GameRepair][FixVcRedist] URL x64: {vc.UrlX64}");
            _logger.LogInfo($"[GameRepair][FixVcRedist] URL x86: {vc.UrlX86}");
            _logger.LogInfo($"[GameRepair][FixVcRedist] InstallArgs: {vc.InstallArgs}");
            
            Log($"  -> Baixando e instalando {vc.Label}...", "#AAAAAA");
            
            // x64: ocupa 0-50% da fatia desta issue
            _logger.LogInfo($"[GameRepair][FixVcRedist] Iniciando download x64...");
            progress?.Report((5,  $"Baixando {vc.Label} x64..."));
            bool x64ok = await DownloadAndInstallAsync(vc.UrlX64, vc.InstallArgs, $"{vc.Label} x64", progress, 5, 45, ct);
            _logger.LogInfo($"[GameRepair][FixVcRedist] Resultado x64: {(x64ok ? "SUCESSO" : "FALHA")}");
            progress?.Report((50, $"{vc.Label} x64: {(x64ok ? "? instalado" : "? falhou")}"));

            // x86: ocupa 50-95% da fatia desta issue
            _logger.LogInfo($"[GameRepair][FixVcRedist] Iniciando download x86...");
            progress?.Report((55, $"Baixando {vc.Label} x86..."));
            bool x86ok = await DownloadAndInstallAsync(vc.UrlX86, vc.InstallArgs, $"{vc.Label} x86", progress, 55, 95, ct);
            _logger.LogInfo($"[GameRepair][FixVcRedist] Resultado x86: {(x86ok ? "SUCESSO" : "FALHA")}");
            progress?.Report((98, $"{vc.Label} x86: {(x86ok ? "? instalado" : "? falhou")}"));

            bool success = x64ok || x86ok;
            
            _logger.LogInfo($"[GameRepair][FixVcRedist] Resultado final: {(success ? "SUCESSO" : "FALHA")} (x64={x64ok}, x86={x86ok})");
            
            return new GameRepairFixResult 
            { 
                IssueId = issue.Id, 
                Success = success, 
                Message = success ? $"{vc.Label} instalado" : $"Falha ao instalar {vc.Label}" 
            };
        }

        private async Task<GameRepairFixResult> FixDirectXAsync(IProgress<(int pct, string msg)>? progress, CancellationToken ct)
        {
            Log("  -> Baixando DirectX End-User Runtime (D3D9/10/11)...", "#AAAAAA");
            // dxwebsetup.exe instala automaticamente DirectX 9.0c, 10, 11 e todos os componentes faltando
            const string url = "https://download.microsoft.com/download/1/7/1/1718CCC4-6315-4D8E-9543-8E28A4E18C4C/dxwebsetup.exe";
            progress?.Report((5, "Baixando DirectX End-User Runtime (D3D9/10/11)..."));
            bool ok = await DownloadAndInstallAsync(url, "/Q", "DirectX Web Installer (D3D9/10/11)", progress, 5, 90, ct);
            progress?.Report((100, ok ? "? DirectX instalado (D3D9/10/11)" : "? Falha ao instalar DirectX"));
            return new GameRepairFixResult { IssueId = "DX_MISSING", Success = ok, Message = ok ? "DirectX instalado" : "Falha ao instalar DirectX" };
        }

        private async Task<GameRepairFixResult> FixOpenGLAsync(CancellationToken ct)
        {
            Log("  -> Restaurando opengl32.dll via SFC...", "#AAAAAA");
            var sfc = System.IO.File.Exists(System.IO.Path.Combine(Sys32, "sfc.exe")) ? System.IO.Path.Combine(Sys32, "sfc.exe") : "sfc.exe";
            var (code, _) = await RunAsync(sfc, "/scannow", ct, timeoutMs: 300_000);
            return new GameRepairFixResult { IssueId = "OPENGL_MISSING", Success = code == 0, Message = code == 0 ? "SFC concluido" : $"SFC retornou {code}" };
        }

        private async Task<GameRepairFixResult> FixDotNet4Async(IProgress<(int pct, string msg)>? progress, CancellationToken ct)
        {
            Log("  -> Instalando .NET Framework 4.8...", "#AAAAAA");
            // Primeiro tenta habilitar via DISM (Windows 10/11 j� tem o .NET 3.5 inclu�do)
            var dism = System.IO.File.Exists(System.IO.Path.Combine(Sys32, "dism.exe")) ? System.IO.Path.Combine(Sys32, "dism.exe") : "dism.exe";
            progress?.Report((5, "Habilitando .NET Framework 3.5 via DISM..."));
            var (dismCode, _) = await RunAsync(dism, "/Online /Enable-Feature /FeatureName:NetFx3 /All /NoRestart /Quiet", ct, timeoutMs: 180_000);
            if (dismCode == 0 || dismCode == 3010)
            {
                progress?.Report((50, "Baixando .NET Framework 4.8..."));
            }

            // Baixa e instala .NET Framework 4.8 (funciona em Windows 7+ at� Windows 11)
            const string url48 = "https://go.microsoft.com/fwlink/?LinkId=2085155"; // ndp48-web.exe
            bool ok = await DownloadAndInstallAsync(url48, "/q /norestart", ".NET Framework 4.8", progress, 50, 95, ct);
            progress?.Report((100, ok ? "? .NET Framework 4.8 instalado" : "? Falha ao instalar .NET Framework 4.8"));
            return new GameRepairFixResult { IssueId = "DOTNET4_MISSING", Success = ok || dismCode == 0 || dismCode == 3010, Message = ok ? ".NET Framework 4.8 instalado" : $"DISM={dismCode}" };
        }

        private async Task<GameRepairFixResult> FixDotNetCoreAsync(IProgress<(int pct, string msg)>? progress, CancellationToken ct)
        {
            Log("  -> Instalando .NET 8 Desktop Runtime...", "#AAAAAA");
            // .NET 8 Desktop Runtime x64 � necess�rio para apps WPF/WinForms e jogos modernos
            const string urlDesktop64 = "https://download.visualstudio.microsoft.com/download/pr/dotnet-runtime-8.0-windows-x64.exe";
            progress?.Report((5, "Baixando .NET 8 Desktop Runtime x64..."));
            bool ok64 = await DownloadAndInstallAsync(urlDesktop64, "/install /quiet /norestart", ".NET 8 Desktop Runtime x64", progress, 5, 55, ct);
            progress?.Report((55, ok64 ? "? .NET 8 x64 instalado" : "? Falha .NET 8 x64"));

            // .NET 8 Desktop Runtime x86 � para jogos 32-bit
            const string urlDesktop86 = "https://download.visualstudio.microsoft.com/download/pr/dotnet-runtime-8.0-windows-x86.exe";
            progress?.Report((60, "Baixando .NET 8 Desktop Runtime x86..."));
            bool ok86 = await DownloadAndInstallAsync(urlDesktop86, "/install /quiet /norestart", ".NET 8 Desktop Runtime x86", progress, 60, 95, ct);
            progress?.Report((100, ok64 || ok86 ? "? .NET 8 Runtime instalado" : "? Falha ao instalar .NET 8"));
            return new GameRepairFixResult { IssueId = "DOTNETCORE_MISSING", Success = ok64 || ok86, Message = ok64 || ok86 ? ".NET 8 Runtime instalado" : "Falha ao instalar .NET 8" };
        }

        private async Task<GameRepairFixResult> FixMediaFoundationAsync(IProgress<(int pct, string msg)>? progress, CancellationToken ct)
        {
            Log("  -> Habilitando Media Foundation via DISM...", "#AAAAAA");
            progress?.Report((5, "Habilitando Media Foundation via DISM..."));
            var dism = System.IO.File.Exists(System.IO.Path.Combine(Sys32, "dism.exe")) ? System.IO.Path.Combine(Sys32, "dism.exe") : "dism.exe";
            var (code, _) = await RunAsync(dism, "/Online /Enable-Feature /FeatureName:MediaPlayback /All /NoRestart /Quiet", ct, timeoutMs: 120_000);
            bool ok = code == 0 || code == 3010;
            progress?.Report((100, ok ? "? Media Foundation habilitado" : $"? DISM retornou {code}"));
            return new GameRepairFixResult { IssueId = "MF_MISSING", Success = ok, Message = ok ? "Media Foundation habilitado" : $"DISM retornou {code}" };
        }

        private async Task<GameRepairFixResult> FixAudioServiceAsync(CancellationToken ct)
        {
            Log("  -> Iniciando servico de audio...", "#AAAAAA");
            var script = @"
Set-Service -Name 'AudioSrv' -StartupType Automatic -ErrorAction SilentlyContinue
Set-Service -Name 'AudioEndpointBuilder' -StartupType Automatic -ErrorAction SilentlyContinue
Start-Service -Name 'AudioEndpointBuilder' -ErrorAction SilentlyContinue
Start-Service -Name 'AudioSrv' -ErrorAction SilentlyContinue
Write-Output ""AUDIO_STATUS=$((Get-Service -Name 'AudioSrv').Status)""
";
            var (_, psOut) = await RunPsAsync(script, ct, timeoutMs: 30_000);
            bool ok = psOut.Contains("AUDIO_STATUS=Running");
            return new GameRepairFixResult { IssueId = "AUDIO_SVC_STOPPED", Success = ok, Message = ok ? "Servico de audio iniciado" : "Falha ao iniciar servico de audio" };
        }

        // --- Novos m�todos Fix ------------------------------------------------------

        private async Task<GameRepairFixResult> FixGameModeAsync(CancellationToken ct)
        {
            Log("  -> Ativando Windows Game Mode...", "#AAAAAA");
            try
            {
                using var key = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(
                    @"Software\Microsoft\GameBar", writable: true);
                key.SetValue("AllowAutoGameMode",   1, Microsoft.Win32.RegistryValueKind.DWord);
                key.SetValue("AutoGameModeEnabled", 1, Microsoft.Win32.RegistryValueKind.DWord);
                _logger.LogInfo("[GameRepair][FixGameMode] Game Mode ativado via Registry");
                return new GameRepairFixResult { IssueId = "GAMEMODE_DISABLED", Success = true, Message = "Game Mode ativado" };
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GameRepair][FixGameMode] Erro: {ex.Message}");
                return new GameRepairFixResult { IssueId = "GAMEMODE_DISABLED", Success = false, Message = ex.Message };
            }
        }

        private async Task<GameRepairFixResult> FixHAGSAsync(CancellationToken ct)
        {
            Log("  -> Ativando HAGS (Hardware GPU Scheduling)...", "#AAAAAA");
            try
            {
                using var key = Microsoft.Win32.Registry.LocalMachine.CreateSubKey(
                    @"SYSTEM\CurrentControlSet\Control\GraphicsDrivers", writable: true);
                key.SetValue("HwSchMode", 2, Microsoft.Win32.RegistryValueKind.DWord);
                _logger.LogInfo("[GameRepair][FixHAGS] HAGS ativado via Registry (requer reboot)");
                return new GameRepairFixResult { IssueId = "HAGS_DISABLED", Success = true, Message = "HAGS ativado (reinicialize o PC para aplicar)" };
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GameRepair][FixHAGS] Erro: {ex.Message}");
                return new GameRepairFixResult { IssueId = "HAGS_DISABLED", Success = false, Message = ex.Message };
            }
        }

        private async Task<GameRepairFixResult> FixXboxDVRAsync(CancellationToken ct)
        {
            Log("  -> Desativando Xbox Game Bar DVR...", "#AAAAAA");
            try
            {
                // Desativa GameDVR no perfil do usu�rio
                using var key1 = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(
                    @"System\GameConfigStore", writable: true);
                key1.SetValue("GameDVR_Enabled", 0, Microsoft.Win32.RegistryValueKind.DWord);

                // Bloqueia captura via policy do sistema
                using var key2 = Microsoft.Win32.Registry.LocalMachine.CreateSubKey(
                    @"SOFTWARE\Policies\Microsoft\Windows\GameDVR", writable: true);
                key2.SetValue("AllowGameDVR", 0, Microsoft.Win32.RegistryValueKind.DWord);

                _logger.LogInfo("[GameRepair][FixXboxDVR] Xbox DVR desativado via Registry");
                return new GameRepairFixResult { IssueId = "XBOX_DVR_ACTIVE", Success = true, Message = "Xbox Game Bar DVR desativado" };
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GameRepair][FixXboxDVR] Erro: {ex.Message}");
                return new GameRepairFixResult { IssueId = "XBOX_DVR_ACTIVE", Success = false, Message = ex.Message };
            }
        }

        private async Task<GameRepairFixResult> FixPagefileAsync(string issueId, CancellationToken ct)
        {
            Log("  -> Configurando Pagefile de forma inteligente...", "#AAAAAA");
            
            // INTELIGENTE: calcula tamanho �timo respeitando espa�o livre em disco
            // N�o usa gerenciamento autom�tico porque o Windows pode reservar espa�o excessivo
            // em discos com pouco espa�o (ex: SSD de 120GB)
            var script = @"
$cs  = Get-CimInstance -ClassName Win32_ComputerSystem
$pf  = Get-CimInstance -ClassName Win32_PageFileSetting -ErrorAction SilentlyContinue
$ramMb = [math]::Round($cs.TotalPhysicalMemory / 1MB)

# Detecta letra do drive do sistema (onde fica o pagefile)
$sysDrive = $env:SystemDrive
$disk = Get-PSDrive -Name ($sysDrive.TrimEnd(':')) -ErrorAction SilentlyContinue
$freeSpaceMb = if ($disk) { [math]::Round($disk.Free / 1MB) } else { 0 }

Write-Output ""RAM_MB=$ramMb""
Write-Output ""FREE_MB=$freeSpaceMb""
Write-Output ""SYS_DRIVE=$sysDrive""
";
            try
            {
                var (_, psOut) = await RunPsAsync(script, ct, timeoutMs: 15_000);
                
                long ramMb = 0;
                long freeMb = 0;
                string sysDrive = "C:";
                
                foreach (var line in psOut.Split('\n'))
                {
                    if (line.StartsWith("RAM_MB="))     long.TryParse(line.Replace("RAM_MB=", "").Trim(), out ramMb);
                    if (line.StartsWith("FREE_MB="))    long.TryParse(line.Replace("FREE_MB=", "").Trim(), out freeMb);
                    if (line.StartsWith("SYS_DRIVE="))  sysDrive = line.Replace("SYS_DRIVE=", "").Trim();
                }
                
                _logger.LogInfo($"[GameRepair][FixPagefile] RAM={ramMb}MB, Espa�oLivre={freeMb}MB, Drive={sysDrive}");

                // INTELIGENTE: c�lculo de tamanho �timo considerando espa�o dispon�vel
                // Regra:
                //   Ideal = 1.5x RAM (m�nimo para jogos AAA pesados)
                //   M�ximo = 4x RAM ou 16GB (nunca al�m disso)
                //   Limite = n�o usar mais que 15% do espa�o livre em disco
                //   Floor  = pelo menos 1024 MB (1GB) para evitar crashes b�sicos
                long idealMb   = (long)(ramMb * 1.5);
                long maxMb     = Math.Min((long)(ramMb * 4), 16 * 1024);  // m�x 16GB
                long diskCapMb = (long)(freeMb * 0.15);                    // 15% do espa�o livre
                long targetMb  = Math.Max(1024, Math.Min(idealMb, diskCapMb));
                targetMb = Math.Min(targetMb, maxMb);
                
                _logger.LogInfo($"[GameRepair][FixPagefile] Ideal={idealMb}MB, DiskCap={diskCapMb}MB, Target={targetMb}MB");

                // SEGURAN�A: se o disco tem menos de 2GB livres, n�o toca no pagefile
                if (freeMb < 2048 && issueId == "PAGEFILE_SMALL")
                {
                    _logger.LogWarning($"[GameRepair][FixPagefile] Espa�o insuficiente ({freeMb}MB livres) � pagefile mantido");
                    return new GameRepairFixResult
                    {
                        IssueId = issueId, Success = false,
                        Message = $"Espa�o insuficiente no disco ({freeMb}MB livres). Libere espa�o e tente novamente."
                    };
                }

                // Define pagefile com tamanho fixo calculado (inicial = target, m�x = target)
                // Desativa gerenciamento autom�tico para ter controle preciso do tamanho
                var setScript = $@"
$cs = Get-CimInstance -ClassName Win32_ComputerSystem
$cs.AutomaticManagedPagefile = $false
$cs.Put() | Out-Null
$existing = Get-CimInstance -ClassName Win32_PageFileSetting -ErrorAction SilentlyContinue
if ($existing) {{
    $existing | Remove-CimInstance -ErrorAction SilentlyContinue
}}
$pfs = New-CimInstance -ClassName Win32_PageFileSetting -Property @{{Name='{sysDrive}\\pagefile.sys'; InitialSize={targetMb}; MaximumSize={targetMb}}}
Write-Output 'PAGEFILE_SET=OK'
";
                var (_, setOut) = await RunPsAsync(setScript, ct, timeoutMs: 30_000);
                bool ok = setOut.Contains("PAGEFILE_SET=OK");
                
                _logger.LogInfo($"[GameRepair][FixPagefile] Resultado: {(ok ? $"OK � {targetMb}MB definido" : setOut)}");
                
                string msg = ok
                    ? $"Pagefile configurado: {targetMb}MB em {sysDrive} (RAM={ramMb}MB, livre={freeMb}MB) � reinicialize para aplicar"
                    : $"Falha ao configurar pagefile";
                    
                return new GameRepairFixResult { IssueId = issueId, Success = ok, Message = msg };
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GameRepair][FixPagefile] Erro: {ex.Message}");
                return new GameRepairFixResult { IssueId = issueId, Success = false, Message = ex.Message };
            }
        }

        // pctStart e pctEnd definem o intervalo de progresso a ser reportado para esta opera��o
        private async Task<bool> DownloadAndInstallAsync(string url, string installArgs, string label,
            IProgress<(int pct, string msg)>? progress, int pctStart, int pctEnd, CancellationToken ct)
        {
            var tmpExe = System.IO.Path.Combine(System.IO.Path.GetTempPath(), $"voltris_fix_{Guid.NewGuid():N}.exe");
            int downloadEnd = pctStart + (int)((pctEnd - pctStart) * 0.6); // 60% do range = download
            int installEnd  = pctEnd; // 40% restante = instala��o

            _logger.LogInfo($"[GameRepair][Download] Iniciando download de {label}");
            _logger.LogInfo($"[GameRepair][Download] URL: {url}");
            _logger.LogInfo($"[GameRepair][Download] Args: {installArgs}");
            progress?.Report((pctStart, $"Baixando {label}..."));
            
            try
            {
                Log($"    Baixando {label}...", "#888888");
                using var http = new System.Net.Http.HttpClient { Timeout = TimeSpan.FromMinutes(5) };
                http.DefaultRequestHeaders.Add("User-Agent", "VoltrisOptimizer/1.0");
                
                _logger.LogInfo($"[GameRepair][Download] Enviando request GET...");
                using var response = await http.GetAsync(url, System.Net.Http.HttpCompletionOption.ResponseHeadersRead, ct);
                
                _logger.LogInfo($"[GameRepair][Download] Response status: {response.StatusCode}");
                _logger.LogInfo($"[GameRepair][Download] Content-Length: {response.Content.Headers.ContentLength} bytes");
                
                response.EnsureSuccessStatusCode();
                
                // Baixa e fecha o FileStream ANTES de executar � evita Win32Exception "arquivo em uso"
                using (var fs = new System.IO.FileStream(tmpExe, System.IO.FileMode.Create, System.IO.FileAccess.Write, System.IO.FileShare.None))
                {
                    await response.Content.CopyToAsync(fs, ct);
                    await fs.FlushAsync(ct);
                } // fs fechado aqui � arquivo liberado para execu��o

                var fileInfo = new System.IO.FileInfo(tmpExe);
                _logger.LogInfo($"[GameRepair][Download] Arquivo salvo: {tmpExe}");
                _logger.LogInfo($"[GameRepair][Download] Tamanho em disco: {fileInfo.Length} bytes");
                progress?.Report((downloadEnd, $"Download conclu�do: {fileInfo.Length / 1024} KB � Instalando {label}..."));

                if (fileInfo.Length < 1024)
                {
                    _logger.LogError($"[GameRepair][Download] ERRO: Arquivo muito pequeno ({fileInfo.Length} bytes) - poss�vel redirecionamento ou erro");
                    return false;
                }

                progress?.Report((downloadEnd + 5, $"Instalando {label}..."));
                Log($"    Instalando {label}...", "#888888");
                _logger.LogInfo($"[GameRepair][Install] Executando: {tmpExe} {installArgs}");

                // Instala com UseShellExecute=true para evitar bloqueios de UAC/antiv�rus
                var (code, output) = await RunAsync(tmpExe, installArgs, ct, timeoutMs: 120_000);
                
                _logger.LogInfo($"[GameRepair][Install] Exit code: {code}");
                _logger.LogInfo($"[GameRepair][Install] Output: {output}");
                
                // C�digos de sucesso: 0 = sucesso, 3010 = sucesso mas requer reboot, 1638 = j� instalado
                bool success = code == 0 || code == 3010 || code == 1638;
                
                if (success)
                {
                    _logger.LogInfo($"[GameRepair][Install] SUCESSO: {label} instalado (exit code {code})");
                    progress?.Report((installEnd, $"? {label} instalado com sucesso (code {code})"));
                }
                else
                {
                    _logger.LogError($"[GameRepair][Install] FALHA: {label} retornou exit code {code}");
                    _logger.LogError($"[GameRepair][Install] Output: {output}");
                    progress?.Report((installEnd, $"? {label} falhou (code {code})"));
                }
                
                return success;
            }
            catch (OperationCanceledException) 
            { 
                _logger.LogWarning($"[GameRepair][Download] Cancelado: {label}");
                throw; 
            }
            catch (Exception ex) 
            { 
                _logger.LogError($"[GameRepair][Download] EXCE��O em {label}: {ex.GetType().Name} - {ex.Message}");
                _logger.LogError($"[GameRepair][Download] Stack trace: {ex.StackTrace}");
                return false; 
            }
            finally 
            { 
                try 
                { 
                    if (System.IO.File.Exists(tmpExe)) 
                    {
                        await Task.Delay(500).ConfigureAwait(false);
                        try { System.IO.File.Delete(tmpExe); } catch { }
                        _logger.LogInfo($"[GameRepair][Download] Arquivo temporário removido: {tmpExe}");
                    }
                } 
                catch (Exception ex) 
                { 
                    _logger.LogWarning($"[GameRepair][Download] Erro ao remover temp file: {ex.Message}");
                } 
            }
        }
    }
}
