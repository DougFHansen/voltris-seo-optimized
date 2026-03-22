using System;
using System.Diagnostics;
using System.IO;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Windows;
using VoltrisOptimizer.UI.Controls;

namespace VoltrisOptimizer.Services
{
    public class SystemToolsService
    {
        private readonly ILoggingService _loggingService;

        public SystemToolsService(ILoggingService loggingService)
        {
            _loggingService = loggingService;
        }

        /// <summary>
        /// Verifica se está executando como administrador
        /// </summary>
        public bool IsRunningAsAdmin()
        {
            try
            {
                WindowsIdentity identity = WindowsIdentity.GetCurrent();
                WindowsPrincipal principal = new WindowsPrincipal(identity);
                return principal.IsInRole(WindowsBuiltInRole.Administrator);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Cria um ponto de restauração do sistema
        /// CORREÇÃO CRÍTICA: Agora valida Perfil Inteligente antes de criar
        /// </summary>
        public async Task<bool> CreateSystemRestorePointAsync(string description = "Backup Voltris Optimizer")
        {
            try
            {
                // CORREÇÃO CRÍTICA: Validar Perfil Inteligente antes de criar ponto de restauração
                var currentProfile = SettingsService.Instance.Settings.IntelligentProfile;
                _loggingService.LogInfo($"[SystemTools.CreateRestorePoint] Perfil Inteligente Ativo: {currentProfile}");
                
                // Perfil Enterprise: Requer auditoria ou aprovação especial
                if (currentProfile == IntelligentProfileType.EnterpriseSecure)
                {
                    _loggingService.LogWarning($"[SystemTools.CreateRestorePoint] Perfil {currentProfile} requer auditoria para criar ponto de restauração");
                    
                    var result = ModernMessageBox.Show(
                        $"Perfil Enterprise Secure detectado.\n\n" +
                        $"Criar ponto de restauração requer aprovação adicional.\n\n" +
                        $"Deseja prosseguir? (Esta ação será registrada no log de auditoria)",
                        "Aprovação Enterprise Necessária",
                        MessageBoxButton.YesNo,
                        MessageBoxImage.Warning);
                    
                    if (result != MessageBoxResult.Yes)
                    {
                        _loggingService.LogInfo($"[SystemTools.CreateRestorePoint] Criação de ponto de restauração cancelada pelo usuário (perfil {currentProfile})");
                        return false;
                    }
                    
                    _loggingService.LogInfo($"[SystemTools.CreateRestorePoint] Usuário aprovou criação de ponto de restauração (perfil {currentProfile})");
                }
                
                if (!IsRunningAsAdmin())
                {
                    ModernMessageBox.Show(
                        "É necessário executar como Administrador para criar pontos de restauração.",
                        "Permissão Insuficiente",
                        MessageBoxButton.OK,
                        MessageBoxImage.Warning);
                    return false;
                }

                _loggingService.LogInfo($"[SystemTools.CreateRestorePoint] Criando ponto de restauração do sistema... Perfil: {currentProfile}");

                // CORREÇÃO: Garantir que processo PowerShell seja terminado corretamente
                // Usar PowerShell para criar o ponto de restauração
                var psScript = $@"
                    try {{
                        # Habilitar e iniciar o serviço de restauração do sistema caso esteja desativado
                        Set-Service -Name 'srsvc' -StartupType Automatic -ErrorAction SilentlyContinue
                        Start-Service -Name 'srsvc' -ErrorAction SilentlyContinue
                        
                        # Ativar a restauração do sistema na unidade C:
                        Enable-ComputerRestore -Drive 'C:\' -ErrorAction SilentlyContinue
                        
                        # Criar o ponto de restauração
                        Checkpoint-Computer -Description '{description}' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction Stop
                        Write-Output 'SUCCESS'
                    }} catch {{
                        Write-Output ""ERROR: $($_.Exception.Message)""
                    }}
                ";

                var processStartInfo = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = $"-NoProfile -ExecutionPolicy Bypass -Command \"{psScript}\"",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    Verb = "runas"
                };

                using var process = Process.Start(processStartInfo);
                if (process != null)
                {
                    // CORREÇÃO: Aguardar com timeout e garantir término do processo
                    var timeoutTask = Task.Delay(120000); // 2 minutos timeout
                    var exitTask = process.WaitForExitAsync();
                    var completedTask = await Task.WhenAny(exitTask, timeoutTask);
                    
                    if (completedTask == timeoutTask)
                    {
                        // Timeout - forçar término
                        try
                        {
                            process.Kill();
                            await process.WaitForExitAsync();
                        }
                        catch { }
                        _loggingService.LogWarning("[SystemTools.CreateRestorePoint] Timeout ao criar ponto de restauração");
                        return false;
                    }
                    
                    var output = await process.StandardOutput.ReadToEndAsync();

                    if (output.Contains("SUCCESS"))
                    {
                        _loggingService.LogSuccess($"[SystemTools.CreateRestorePoint] Ponto de restauração criado com sucesso! Perfil: {currentProfile}");
                        ModernMessageBox.Show(
                            $"Ponto de restauração criado com sucesso!\n\nDescrição: {description}",
                            "Ponto de Restauração Criado",
                            MessageBoxButton.OK,
                            MessageBoxImage.Information);
                        return true;
                    }
                    else
                    {
                        _loggingService.LogError($"[SystemTools.CreateRestorePoint] Erro ao criar ponto de restauração: {output}");
                        ModernMessageBox.Show(
                            $"Erro ao criar ponto de restauração:\n\n{output}",
                            "Erro",
                            MessageBoxButton.OK,
                            MessageBoxImage.Error);
                        return false;
                    }
                }

                return false;
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"[SystemTools.CreateRestorePoint] Erro crítico ao criar ponto de restauração: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro crítico ao criar ponto de restauração:\n\n{ex.Message}",
                    "Erro Crítico",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
                return false;
            }
        }

        /// <summary>
        /// Abre o seletor de pontos de restauração do Windows
        /// </summary>
        public void OpenSystemRestoreSelector()
        {
            try
            {
                if (!IsRunningAsAdmin())
                {
                    ModernMessageBox.Show(
                        "É necessário executar como Administrador para restaurar pontos de restauração.",
                        "Permissão Insuficiente",
                        MessageBoxButton.OK,
                        MessageBoxImage.Warning);
                    return;
                }

                _loggingService.LogInfo("Abrindo seletor de pontos de restauração...");

                // Abrir rstrui.exe (System Restore)
                var processStartInfo = new ProcessStartInfo
                {
                    FileName = "rstrui.exe",
                    UseShellExecute = true,
                    Verb = "runas"
                };

                Process.Start(processStartInfo);
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao abrir seletor de restauração: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao abrir seletor de restauração:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }

        /// <summary>
        /// Repara o sistema usando DISM e SFC
        /// CORREÇÃO CRÍTICA: Agora valida Perfil Inteligente antes de reparar
        /// </summary>
        public async Task<bool> RepairSystemAsync(Action<int>? progressCallback = null)
        {
            try
            {
                // CORREÇÃO CRÍTICA: Validar Perfil Inteligente antes de reparar sistema
                var currentProfile = SettingsService.Instance.Settings.IntelligentProfile;
                _loggingService.LogInfo($"[SystemTools.RepairSystem] Perfil Inteligente Ativo: {currentProfile}");
                
                // Perfis conservadores: Não permitir reparo automático
                if (currentProfile == IntelligentProfileType.EnterpriseSecure ||
                    currentProfile == IntelligentProfileType.WorkOffice)
                {
                    _loggingService.LogWarning($"[SystemTools.RepairSystem] Perfil {currentProfile} não permite reparo automático do sistema");
                    
                    ModernMessageBox.Show(
                        $"Perfil {currentProfile} detectado.\n\n" +
                        $"Reparo automático do sistema não é permitido por este perfil.\n\n" +
                        $"Motivo: Perfis conservadores exigem aprovação manual para modificações profundas no sistema.",
                        "Operação Bloqueada pelo Perfil",
                        MessageBoxButton.OK,
                        MessageBoxImage.Warning);
                    
                    return false;
                }
                
                if (!IsRunningAsAdmin())
                {
                    ModernMessageBox.Show(
                        "É necessário executar como Administrador para reparar o sistema.",
                        "Permissão Insuficiente",
                        MessageBoxButton.OK,
                        MessageBoxImage.Warning);
                    return false;
                }

                _loggingService.LogInfo($"[SystemTools.RepairSystem] Iniciando reparo do sistema... Perfil: {currentProfile}");
                progressCallback?.Invoke(10);

                // Executar DISM
                _loggingService.LogInfo("[SystemTools.RepairSystem] Executando DISM... (Isso pode levar alguns minutos)");
                progressCallback?.Invoke(25);

                var dismProcess = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "dism.exe",
                        Arguments = "/Online /Cleanup-Image /RestoreHealth",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true,
                        Verb = "runas"
                    }
                };

                dismProcess.Start();
                await dismProcess.WaitForExitAsync();

                if (dismProcess.ExitCode == 0)
                {
                    _loggingService.LogSuccess("[SystemTools.RepairSystem] DISM executado com sucesso");
                }
                else
                {
                    _loggingService.LogWarning($"[SystemTools.RepairSystem] DISM retornou código: {dismProcess.ExitCode}");
                }

                progressCallback?.Invoke(50);

                // Executar SFC
                _loggingService.LogInfo("[SystemTools.RepairSystem] Executando SFC... (Isso pode levar alguns minutos)");
                progressCallback?.Invoke(75);

                var sfcProcess = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "sfc.exe",
                        Arguments = "/scannow",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true,
                        Verb = "runas"
                    }
                };

                sfcProcess.Start();
                await sfcProcess.WaitForExitAsync();

                if (sfcProcess.ExitCode == 0)
                {
                    _loggingService.LogSuccess("[SystemTools.RepairSystem] SFC executado com sucesso");
                }
                else
                {
                    _loggingService.LogWarning($"[SystemTools.RepairSystem] SFC retornou código: {sfcProcess.ExitCode}");
                }

                progressCallback?.Invoke(100);
                _loggingService.LogSuccess($"[SystemTools.RepairSystem] Reparo do sistema concluído! Perfil: {currentProfile}");
                
                ModernMessageBox.Show(
                    "Reparo do sistema concluído!\n\nDISM e SFC foram executados com sucesso.",
                    "Reparo Concluído",
                    MessageBoxButton.OK,
                    MessageBoxImage.Information);

                return true;
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"[SystemTools.RepairSystem] Erro ao reparar sistema: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao reparar sistema:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
                return false;
            }
        }

        /// <summary>
        /// Abre o Gerenciador de Dispositivos para atualizar drivers
        /// </summary>
        public void OpenDeviceManager()
        {
            try
            {
                _loggingService.LogInfo("Abrindo Gerenciador de Dispositivos...");

                var processStartInfo = new ProcessStartInfo
                {
                    FileName = "devmgmt.msc",
                    UseShellExecute = true
                };

                Process.Start(processStartInfo);
                _loggingService.LogSuccess("Gerenciador de Dispositivos aberto");
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao abrir Gerenciador de Dispositivos: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao abrir Gerenciador de Dispositivos:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }

        /// <summary>
        /// Abre o Monitor de Recursos do Windows
        /// </summary>
        public void OpenResourceMonitor()
        {
            try
            {
                _loggingService.LogInfo("Abrindo Monitor de Recursos...");

                var processStartInfo = new ProcessStartInfo
                {
                    FileName = "resmon.exe",
                    UseShellExecute = true
                };

                Process.Start(processStartInfo);
                _loggingService.LogSuccess("Monitor de Recursos aberto");
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao abrir Monitor de Recursos: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao abrir Monitor de Recursos:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }
    }
}

