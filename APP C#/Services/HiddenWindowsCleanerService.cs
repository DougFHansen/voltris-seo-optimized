using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço para executar limpeza oculta do Windows usando cleanmgr.exe
    /// com todas as opções pré-selecionadas via registro, sem mostrar interface
    /// </summary>
    public class HiddenWindowsCleanerService
    {
        private readonly ILoggingService _logger;

        public HiddenWindowsCleanerService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Executa limpeza oculta do Windows usando cleanmgr.exe
        /// com todas as opções de limpeza marcadas por padrão
        /// </summary>
        /// <param name="cancellationToken">Token para cancelamento da operação</param>
        /// <returns>Quantidade de espaço liberado em bytes</returns>
        /// <summary>
        /// Executa análise de limpeza oculta do Windows usando cleanmgr.exe
        /// Estima o espaço que pode ser liberado sem realmente executar a limpeza
        /// </summary>
        /// <param name="cancellationToken">Token para cancelamento da operação</param>
        /// <returns>Quantidade estimada de espaço que pode ser liberado em bytes</returns>
        public async Task<long> AnalyzeHiddenCleanmgrCleanupAsync(CancellationToken cancellationToken = default)
        {
            _logger.LogInfo("[HiddenCleaner] Iniciando análise de limpeza oculta do Windows (cleanmgr.exe)...");
            
            try
            {
                // Etapa 1: Preparar o perfil oculto no registro para análise
                PrepareHiddenCleanmgrProfile();
                
                // Etapa 2: Estimar espaço que pode ser liberado
                var estimatedSpace = await EstimateCleanmgrSpaceAsync(cancellationToken);
                
                _logger.LogInfo($"[HiddenCleaner] Análise de limpeza oculta concluída. Espaço estimado: {FormatBytes(estimatedSpace)}");
                
                return estimatedSpace;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[HiddenCleaner] Erro na análise de limpeza oculta: {ex.Message}", ex);
                return 0;
            }
        }
        
        public async Task<long> PerformHiddenCleanmgrCleanupAsync(CancellationToken cancellationToken = default)
        {
            _logger.LogInfo("[HiddenCleaner] Iniciando limpeza oculta do Windows (cleanmgr.exe)...");

            try
            {
                // Etapa 1: Preparar o perfil oculto no registro
                PrepareHiddenCleanmgrProfile();

                // Etapa 2: Executar cleanmgr com o perfil oculto
                var spaceFreed = await ExecuteHiddenCleanmgrAsync(cancellationToken);

                _logger.LogSuccess($"[HiddenCleaner] Limpeza oculta concluída. Espaço liberado: {FormatBytes(spaceFreed)}");
                
                return spaceFreed;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[HiddenCleaner] Erro na limpeza oculta: {ex.Message}", ex);
                return 0;
            }
        }

        /// <summary>
        /// Prepara o perfil oculto do cleanmgr no registro
        /// Define StateFlags99 = 2 para todas as categorias disponíveis
        /// </summary>
        private void PrepareHiddenCleanmgrProfile()
        {
            const string registryPath = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches";
            const int profileId = 99; // ID exclusivo para o perfil oculto
            
            try
            {
                using var baseKey = Registry.LocalMachine.OpenSubKey(registryPath, true);
                if (baseKey == null)
                {
                    _logger.LogWarning("[HiddenCleaner] Não foi possível acessar chave do registro do VolumeCaches");
                    return;
                }

                var subKeyNames = baseKey.GetSubKeyNames();
                int categoriesConfigured = 0;

                foreach (var subKeyName in subKeyNames)
                {
                    try
                    {
                        using var subKey = baseKey.OpenSubKey(subKeyName, true);
                        if (subKey == null) continue;

                        // Criar ou atualizar o valor StateFlags99 = 2 (selecionado para limpeza automática)
                        var stateFlagsValue = $"StateFlags{profileId:D2}"; // Formata como "StateFlags99"
                        subKey.SetValue(stateFlagsValue, 2, RegistryValueKind.DWord);
                        
                        categoriesConfigured++;
                        
                        _logger.LogInfo($"[HiddenCleaner] Configurada categoria: {subKeyName} (StateFlags{profileId:D2} = 2)");
                    }
                    catch (Exception ex)
                    {
                        // Ignorar erros silenciosamente como exigido
                        _logger.LogInfo($"[HiddenCleaner] Ignorado erro na categoria {subKeyName}: {ex.Message}");
                    }
                }

                _logger.LogInfo($"[HiddenCleaner] {categoriesConfigured} categorias configuradas para perfil oculto (ID: {profileId})");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[HiddenCleaner] Erro ao configurar perfil oculto no registro: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Executa o cleanmgr.exe com o perfil oculto
        /// </summary>
        /// <param name="cancellationToken">Token para cancelamento</param>
        /// <returns>Espaço liberado em bytes</returns>
        private async Task<long> ExecuteHiddenCleanmgrAsync(CancellationToken cancellationToken)
        {
            try
            {
                // Obter espaço livre antes da limpeza
                var beforeSpace = GetDiskFreeSpace();
                
                var processStartInfo = new ProcessStartInfo
                {
                    FileName = "cleanmgr.exe",
                    Arguments = "/sagerun:99", // Usa o perfil oculto com ID 99
                    UseShellExecute = false,
                    CreateNoWindow = true,      // Janela oculta como exigido
                    Verb = "runas",             // Elevação administrativa
                    WindowStyle = ProcessWindowStyle.Hidden, // Garantir que fique oculto
                    RedirectStandardOutput = true, // Redirecionar saída para evitar qualquer exibição
                    RedirectStandardError = true,  // Redirecionar erros para evitar qualquer exibição
                    LoadUserProfile = false,     // Evitar carregar perfil do usuário que pode causar aberturas indesejadas
                    WorkingDirectory = Environment.SystemDirectory // Definir diretório de trabalho para evitar problemas
                };

                using var process = Process.Start(processStartInfo);
                if (process == null)
                {
                    _logger.LogWarning("[HiddenCleaner] Não foi possível iniciar cleanmgr.exe");
                    return 0;
                }

                // Aguardar conclusão com timeout e verificação de cancelamento
                // Timeout de 30 minutos para limpeza completa
                var timeoutMs = 30 * 60 * 1000; // 30 minutos em milissegundos
                
                // Aguardar processo ou cancelamento
                var processTask = Task.Run(() => process.WaitForExit(timeoutMs));
                
                // Criar uma task que completa quando o cancelamento é solicitado
                var cancelTask = WaitForCancellation(cancellationToken);

                var completedTask = await Task.WhenAny(processTask, cancelTask);

                if (completedTask == cancelTask)
                {
                    _logger.LogWarning("[HiddenCleaner] Operação cancelada pelo usuário");
                    
                    // Tentar encerrar o processo de forma segura
                    try
                    {
                        if (!process.HasExited)
                        {
                            process.Kill();
                        }
                    }
                    catch { /* Ignorar erros ao tentar matar o processo */ }
                    
                    return 0;
                }

                // Verificar se o processo terminou dentro do tempo
                if (!process.HasExited)
                {
                    _logger.LogWarning("[HiddenCleaner] Timeout na execução do cleanmgr.exe");
                    
                    try
                    {
                        if (!process.HasExited)
                        {
                            process.Kill();
                        }
                    }
                    catch { /* Ignorar erros */ }
                    
                    return 0;
                }

                // Calcular espaço liberado
                var afterSpace = GetDiskFreeSpace();
                var spaceFreed = afterSpace - beforeSpace;

                _logger.LogInfo($"[HiddenCleaner] cleanmgr.exe concluído. Código saída: {process.ExitCode}");
                _logger.LogInfo($"[HiddenCleaner] Espaço antes: {FormatBytes(beforeSpace)}, depois: {FormatBytes(afterSpace)}, liberado: {FormatBytes(spaceFreed)}");

                return Math.Max(0, spaceFreed); // Garantir valor positivo
            }
            catch (Exception ex)
            {
                _logger.LogError($"[HiddenCleaner] Erro ao executar cleanmgr.exe: {ex.Message}", ex);
                return 0;
            }
        }



        /// <summary>
        /// Obtém espaço livre no disco C:
        /// </summary>
        private long GetDiskFreeSpace()
        {
            try
            {
                var drive = new System.IO.DriveInfo("C");
                return drive.AvailableFreeSpace;
            }
            catch
            {
                return 0;
            }
        }

        /// <summary>
        /// Formata bytes em formato legível
        /// </summary>
        private string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            
            return $"{len:0.##} {sizes[order]}";
        }
        
        /// <summary>
        /// Estima o espaço que pode ser liberado pelo cleanmgr
        /// Esta é uma estimativa baseada em diretórios típicos de limpeza
        /// </summary>
        private async Task<long> EstimateCleanmgrSpaceAsync(CancellationToken cancellationToken)
        {
            try
            {
                // Obter espaço antes da estimativa
                var beforeSpace = GetDiskFreeSpace();
                
                // Estimar espaço baseado em diretórios conhecidos sem executar o cleanmgr
                // pois o modo /analyze ainda pode mostrar interface gráfica
                var estimatedSpace = await EstimatePotentialCleanmgrSpace();
                
                _logger.LogInfo($"[HiddenCleaner] Estimativa de espaço baseada em diretórios: {FormatBytes(estimatedSpace)}");
                
                return estimatedSpace;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[HiddenCleaner] Erro na estimativa de espaço: {ex.Message}");
                // Retornar estimativa alternativa baseada em diretórios comuns
                return await EstimatePotentialCleanmgrSpace();
            }
        }
        
        /// <summary>
        /// Estimativa alternativa de espaço potencial para limpeza
        /// </summary>
        private async Task<long> EstimatePotentialCleanmgrSpace()
        {
            try
            {
                long totalEstimated = 0;
                
                // Diretórios típicos que o cleanmgr limpa
                var directoriesToCheck = new[]
                {
                    @"C:\Windows\Temp",
                    @"C:\Users\Public\Documents\Shared Templates",
                    @"C:\Windows\Prefetch",
                    @"C:\Windows\SoftwareDistribution\Download",
                    @"C:\$Recycle.Bin"
                };
                
                foreach (var dir in directoriesToCheck)
                {
                    try
                    {
                        if (Directory.Exists(dir))
                        {
                            totalEstimated += GetDirectorySize(dir);
                        }
                    }
                    catch { /* Ignorar erros de acesso */ }
                }
                
                // Adicionar estimativa de arquivos temporários do usuário
                var tempDir = Path.GetTempPath();
                if (Directory.Exists(tempDir))
                {
                    totalEstimated += GetDirectorySize(tempDir);
                }
                
                // Adicionar estimativa para logs antigos
                var logDirs = new[]
                {
                    @"C:\Windows\Logs",
                    @"C:\Windows\SoftwareDistribution\Log",
                    @"C:\Windows\Panther"
                };
                
                foreach (var logDir in logDirs)
                {
                    try
                    {
                        if (Directory.Exists(logDir))
                        {
                            totalEstimated += GetDirectorySize(logDir);
                        }
                    }
                    catch { /* Ignorar erros de acesso */ }
                }
                
                _logger.LogInfo($"[HiddenCleaner] Estimativa alternativa de espaço para limpeza: {FormatBytes(totalEstimated)}");
                return totalEstimated;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[HiddenCleaner] Erro na estimativa alternativa: {ex.Message}");
                return 0;
            }
        }
        
        /// <summary>
        /// Obtém o tamanho de um diretório recursivamente
        /// </summary>
        private long GetDirectorySize(string path)
        {
            // Usar o helper otimizado com timeout de 2 segundos para estimativas rápidas
            return VoltrisOptimizer.Helpers.FileSystemHelper.GetDirectorySize(path, maxSeconds: 2);
        }
        
        /// <summary>
        /// Espera até que o cancelamento seja solicitado
        /// </summary>
        private async Task WaitForCancellation(CancellationToken cancellationToken)
        {
            try
            {
                await Task.Delay(Timeout.Infinite, cancellationToken);
            }
            catch (OperationCanceledException)
            {
                // Cancelamento foi solicitado
            }
        }
    }
}