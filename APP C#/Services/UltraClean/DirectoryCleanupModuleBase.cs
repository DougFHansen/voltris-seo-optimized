using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.UltraClean
{
    public abstract class DirectoryCleanupModuleBase : UltraCleanModuleBase
    {
        protected abstract string[] TargetDirectories { get; }
        protected virtual string[] FilePatterns => new[] { "*.*" };
        protected virtual bool Recursive => true;
        protected virtual bool DeleteDirectories => true;

        protected DirectoryCleanupModuleBase(ILoggingService logger) : base(logger) { }

        public override async Task<long> AnalyzeAsync(CancellationToken ct)
        {
            _logger.LogInfo($"[UltraClean] Analisando módulo: {Name} (ID: {Id})");
            return await Task.Run(() =>
            {
                long totalSize = 0;
                foreach (var dir in TargetDirectories)
                {
                    if (ct.IsCancellationRequested) break;
                    try
                    {
                        var expandedDir = Environment.ExpandEnvironmentVariables(dir);
                        if (Directory.Exists(expandedDir))
                        {
                            totalSize += GetDirectorySize(new DirectoryInfo(expandedDir), ct);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[UltraClean] Erro ao analisar diretório {dir}: {ex.Message}");
                    }
                }
                _logger.LogSuccess($"[UltraClean] Análise do módulo {Name} concluída. Espaço: {totalSize} bytes");
                return totalSize;
            }, ct);
        }

        public override async Task<bool> CleanAsync(CancellationToken ct, IProgress<double>? progress = null)
        {
            _logger.LogInfo($"[UltraClean] Iniciando limpeza: {Name}");
            return await Task.Run(() =>
            {
                int totalDirs = TargetDirectories.Length;
                int processed = 0;

                foreach (var dir in TargetDirectories)
                {
                    if (ct.IsCancellationRequested) return false;
                    try
                    {
                        var expandedDir = Environment.ExpandEnvironmentVariables(dir);
                        if (Directory.Exists(expandedDir))
                        {
                            CleanDirectoryInternal(new DirectoryInfo(expandedDir), ct);
                        }
                        else
                        {
                            _logger.LogDebug($"[UltraClean] Diretório não encontrado, pulando: {expandedDir}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[UltraClean] Falha ao processar diretório {dir}: {ex.Message}");
                    }
                    processed++;
                    ReportProgress(progress, (double)processed / totalDirs * 100);
                }
                _logger.LogSuccess($"[UltraClean] Limpeza de {Name} concluída.");
                return true;
            }, ct);
        }

        private long GetDirectorySize(DirectoryInfo d, CancellationToken ct)
        {
            long size = 0;
            try
            {
                // Files
                var files = d.GetFiles();
                foreach (var f in files)
                {
                    if (ct.IsCancellationRequested) return 0;
                    size += f.Length;
                }
                
                // Subdirectories
                if (Recursive)
                {
                    var dirs = d.GetDirectories();
                    foreach (var di in dirs)
                    {
                        if (ct.IsCancellationRequested) return 0;
                        size += GetDirectorySize(di, ct);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogTrace($"[UltraClean] Tamanho de {d.FullName} pode estar incompleto: {ex.Message}");
            }
            return size;
        }

        private void CleanDirectoryInternal(DirectoryInfo d, CancellationToken ct)
        {
            try
            {
                foreach (var file in d.GetFiles())
                {
                    if (ct.IsCancellationRequested) return;
                    try 
                    { 
                        file.Delete(); 
                    } 
                    catch (Exception ex) 
                    { 
                        _logger.LogTrace($"[UltraClean] Não foi possível deletar arquivo {file.Name}: {ex.Message}");
                    }
                }

                if (Recursive)
                {
                    foreach (var subDir in d.GetDirectories())
                    {
                        if (ct.IsCancellationRequested) return;
                        CleanDirectoryInternal(subDir, ct);
                        if (DeleteDirectories)
                        {
                            try 
                            { 
                                subDir.Delete(true); 
                            } 
                            catch (Exception ex) 
                            { 
                                _logger.LogTrace($"[UltraClean] Não foi possível deletar pasta {subDir.Name}: {ex.Message}");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Falha interna ao limpar diretório {d.FullName}: {ex.Message}");
            }
        }
    }
}
