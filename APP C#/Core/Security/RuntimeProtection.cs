using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Core.Security
{
    /// <summary>
    /// Proteção em tempo de execução contra debugging, tampering e engenharia reversa.
    /// Executa verificações periódicas em background sem impactar performance.
    /// </summary>
    public static class RuntimeProtection
    {
        private static CancellationTokenSource? _cts;
        private static string? _expectedHash;
        private static bool _initialized;

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool IsDebuggerPresent();

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool CheckRemoteDebuggerPresent(IntPtr hProcess, ref bool isDebuggerPresent);

        [DllImport("ntdll.dll", SetLastError = true)]
        private static extern int NtQueryInformationProcess(
            IntPtr processHandle, int processInformationClass,
            ref IntPtr processInformation, int processInformationLength, ref int returnLength);

        /// <summary>
        /// Inicia as verificações de proteção em background.
        /// Chamado uma vez durante o startup da aplicação.
        /// </summary>
        public static void Initialize()
        {
            if (_initialized) return;
            _initialized = true;

            Core.Diagnostics.CrashDiagnostics.Mark("RuntimeProtection.Initialize BEGIN");

            // Calcular hash do executável na primeira execução
            try
            {
                var exePath = Environment.ProcessPath;
                if (!string.IsNullOrEmpty(exePath) && File.Exists(exePath))
                {
                    _expectedHash = ComputeFileHash(exePath);
                }
            }
            catch { }

            _cts = new CancellationTokenSource();
            _ = RunProtectionLoopAsync(_cts.Token);
            Core.Diagnostics.CrashDiagnostics.Mark("RuntimeProtection.Initialize END (loop scheduled)");
        }

        /// <summary>
        /// Para as verificações de proteção (chamado no shutdown).
        /// </summary>
        public static void Shutdown()
        {
            try { _cts?.Cancel(); } catch { }
        }

        /// <summary>
        /// Verifica se um debugger está anexado ao processo.
        /// Combina múltiplas técnicas para detecção robusta.
        /// </summary>
        public static bool IsDebuggerAttached()
        {
            // 1. Managed debugger check
            if (Debugger.IsAttached)
                return true;

            // 2. Native debugger check (kernel32)
            try
            {
                Core.Diagnostics.CrashDiagnostics.Mark("RuntimeProtection IsDebuggerPresent native");
                if (IsDebuggerPresent())
                    return true;
            }
            catch { }

            // 3. Remote debugger check
            try
            {
                Core.Diagnostics.CrashDiagnostics.Mark("RuntimeProtection CheckRemoteDebuggerPresent");
                bool isRemoteDebugger = false;
                CheckRemoteDebuggerPresent(Process.GetCurrentProcess().Handle, ref isRemoteDebugger);
                if (isRemoteDebugger)
                    return true;
            }
            catch { }

            // 4. NtQueryInformationProcess — ProcessDebugPort (0x07)
            try
            {
                Core.Diagnostics.CrashDiagnostics.Mark("RuntimeProtection NtQueryInformationProcess");
                IntPtr debugPort = IntPtr.Zero;
                int returnLength = 0;
                int status = NtQueryInformationProcess(
                    Process.GetCurrentProcess().Handle,
                    0x07, // ProcessDebugPort
                    ref debugPort,
                    IntPtr.Size,
                    ref returnLength);

                if (status == 0 && debugPort != IntPtr.Zero)
                    return true;
                Core.Diagnostics.CrashDiagnostics.Mark("RuntimeProtection NtQueryInformationProcess OK");
            }
            catch { }

            return false;
        }

        /// <summary>
        /// Verifica integridade do executável comparando hash.
        /// Detecta modificação do binário em disco.
        /// </summary>
        public static bool IsExecutableTampered()
        {
            if (string.IsNullOrEmpty(_expectedHash))
                return false; // Não conseguiu calcular hash inicial

            try
            {
                Core.Diagnostics.CrashDiagnostics.Mark("IsExecutableTampered computing hash");
                var exePath = Environment.ProcessPath;
                if (string.IsNullOrEmpty(exePath) || !File.Exists(exePath))
                    return false;

                var currentHash = ComputeFileHash(exePath);
                Core.Diagnostics.CrashDiagnostics.Mark("IsExecutableTampered hash computed");
                return !string.Equals(_expectedHash, currentHash, StringComparison.OrdinalIgnoreCase);
            }
            catch
            {
                return false; // Em caso de erro, não alarmar falso positivo
            }
        }

        /// <summary>
        /// Verifica se DLLs suspeitas foram injetadas no processo.
        /// </summary>
        public static bool HasSuspiciousModules()
        {
            try
            {
                Core.Diagnostics.CrashDiagnostics.Mark("HasSuspiciousModules enumerating");
                var proc = Process.GetCurrentProcess();
                var modules = proc.Modules;
                int count = modules.Count;
                Core.Diagnostics.CrashDiagnostics.Mark($"HasSuspiciousModules {count} modules");
                for (int i = 0; i < count; i++)
                {
                    try
                    {
                        var name = modules[i].ModuleName?.ToLowerInvariant() ?? "";
                        
                        // DLLs conhecidas de ferramentas de hooking/injection
                        if (name.Contains("snxhk") ||     // Avecto/BeyondTrust hook
                            name.Contains("cmdvrt") ||     // Comodo sandbox
                            name.Contains("sbiedll") ||    // Sandboxie
                            name.Contains("dbghelp") ||    // Debug helper (pode ser legítimo)
                            name.Contains("api_log") ||    // API Monitor
                            name.Contains("dir_watch") ||  // Directory watcher hook
                            name.Contains("pstorec") ||    // Password store hook
                            name.Contains("vmcheck"))      // VM detection bypass
                        {
                            Core.Diagnostics.CrashDiagnostics.Mark($"HasSuspiciousModules FOUND: {name}");
                            return true;
                        }
                    }
                    catch { }
                }
            }
            catch (Exception ex)
            {
                Core.Diagnostics.CrashDiagnostics.TraceException("HasSuspiciousModules", ex);
            }

            return false;
        }

        private static async Task RunProtectionLoopAsync(CancellationToken token)
        {
            // Delay aumentado para 30s — separar do timing do DSL (que crasha ~12s)
            // para facilitar diagnóstico no crash_trace
            try { await Task.Delay(TimeSpan.FromSeconds(30), token); }
            catch (OperationCanceledException) { return; }

            Core.Diagnostics.CrashDiagnostics.Mark("RuntimeProtection loop STARTED (after 30s delay)");

            int cycleCount = 0;
            while (!token.IsCancellationRequested)
            {
                try
                {
                    cycleCount++;
                    
                    // Verificação anti-debug (leve, a cada ciclo)
                    Core.Diagnostics.CrashDiagnostics.Mark("RP check1 IsDebuggerAttached BEGIN");
                    if (IsDebuggerAttached())
                    {
                        OnProtectionViolation("Debugger detectado");
                    }
                    Core.Diagnostics.CrashDiagnostics.Mark("RP check1 IsDebuggerAttached END");

                    // Verificação de módulos suspeitos (leve, a cada ciclo)
                    Core.Diagnostics.CrashDiagnostics.Mark("RP check2 HasSuspiciousModules BEGIN");
                    if (HasSuspiciousModules())
                    {
                        OnProtectionViolation("Módulo suspeito detectado");
                    }
                    Core.Diagnostics.CrashDiagnostics.Mark("RP check2 HasSuspiciousModules END");

                    await Task.Delay(TimeSpan.FromSeconds(30), token);

                    // Verificação de integridade (IO pesado) — executar apenas a cada 3 ciclos (~15 min)
                    // Reduz overhead de disco sem comprometer segurança
                    if (cycleCount % 3 == 0)
                    {
                        Core.Diagnostics.CrashDiagnostics.Mark("RP check3 IsExecutableTampered BEGIN");
                        if (IsExecutableTampered())
                        {
                            OnProtectionViolation("Integridade do executável comprometida");
                        }
                        Core.Diagnostics.CrashDiagnostics.Mark("RP check3 IsExecutableTampered END");
                    }

                    await Task.Delay(TimeSpan.FromMinutes(4.5), token);
                }
                catch (OperationCanceledException) { break; }
                catch (Exception ex)
                {
                    Core.Diagnostics.CrashDiagnostics.TraceException("RuntimeProtection loop", ex);
                }
            }
        }

        private static void OnProtectionViolation(string reason)
        {
            try
            {
                // Log silencioso — não revelar ao atacante que foi detectado
                var logDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                Directory.CreateDirectory(logDir);
                File.AppendAllText(
                    Path.Combine(logDir, "security.log"),
                    $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] [SECURITY] {reason}\n");
            }
            catch { }

            // Em produção: pode-se degradar funcionalidade silenciosamente
            // ou enviar telemetria de segurança ao servidor
        }

        private static string ComputeFileHash(string filePath)
        {
            using var sha = SHA256.Create();
            using var stream = File.OpenRead(filePath);
            var hash = sha.ComputeHash(stream);
            return Convert.ToHexString(hash);
        }
    }
}
