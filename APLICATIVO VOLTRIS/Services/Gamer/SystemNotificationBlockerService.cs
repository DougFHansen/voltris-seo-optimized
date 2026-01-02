using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace VoltrisOptimizer.Services.Gamer
{
    /// <summary>
    /// Serviço especializado para bloquear notificações do sistema durante sessões de jogo
    /// Previne interrupções que causam travadas e stutter
    /// </summary>
    public class SystemNotificationBlockerService : IDisposable
    {
        private readonly ILoggingService _logger;
        private CancellationTokenSource? _blockingCts;
        private Task? _blockingTask;
        private int _gameProcessId;
        private readonly object _lock = new();
        
        // Estados originais para restauração
        private int _originalToastSetting = -1;
        private int _originalBannerSetting = -1;
        private int _originalSoundSetting = -1;
        private bool _originalFocusAssistState = false;
        
        public SystemNotificationBlockerService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        
        /// <summary>
        /// Inicia bloqueio de notificações para um processo de jogo específico
        /// </summary>
        public void StartBlocking(int gameProcessId)
        {
            StopBlocking();
            
            lock (_lock)
            {
                _gameProcessId = gameProcessId;
                _blockingCts = new CancellationTokenSource();
                _blockingTask = BlockNotifications(_blockingCts.Token);
                _logger.LogInfo($"[NotificationBlocker] Bloqueio de notificações iniciado para processo {gameProcessId}");
            }
        }
        
        /// <summary>
        /// Para bloqueio de notificações e restaura configurações originais
        /// </summary>
        public void StopBlocking()
        {
            lock (_lock)
            {
                if (_blockingCts != null)
                {
                    _blockingCts.Cancel();
                    try { _blockingTask?.Wait(2000); } catch { }
                    _blockingCts.Dispose();
                    _blockingCts = null;
                }
                
                RestoreOriginalSettings();
                _logger.LogInfo("[NotificationBlocker] Bloqueio de notificações encerrado");
            }
        }
        
        /// <summary>
        /// Bloqueia notificações do sistema
        /// </summary>
        private async Task BlockNotifications(CancellationToken ct)
        {
            try
            {
                // Backup e desativação de notificações
                BackupAndDisableNotifications();
                
                // Manter bloqueio ativo enquanto o jogo roda
                while (!ct.IsCancellationRequested)
                {
                    // Verificar periodicamente e reforçar bloqueio se necessário
                    await Task.Delay(5000, ct);
                    ReinforceNotificationBlocking();
                }
            }
            catch (OperationCanceledException)
            {
                // Cancelamento esperado
            }
            catch (Exception ex)
            {
                _logger.LogError($"[NotificationBlocker] Erro no bloqueio: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Faz backup das configurações originais e desativa notificações
        /// </summary>
        private void BackupAndDisableNotifications()
        {
            try
            {
                // 1. Desativar Toast Notifications
                using (var key = Registry.CurrentUser.CreateSubKey(
                    @"SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings"))
                {
                    if (key != null)
                    {
                        // Backup do estado atual
                        var toastValue = key.GetValue("NOC_GLOBAL_SETTING_TOASTS_ENABLED");
                        _originalToastSetting = toastValue is int intValue ? intValue : 1;
                        
                        // Desativar todas as notificações toast
                        key.SetValue("NOC_GLOBAL_SETTING_TOASTS_ENABLED", 0, RegistryValueKind.DWord);
                    }
                }
                
                // 2. Desativar banners de notificação
                using (var key = Registry.CurrentUser.CreateSubKey(
                    @"SOFTWARE\Microsoft\Windows\CurrentVersion\PushNotifications"))
                {
                    if (key != null)
                    {
                        var bannerValue = key.GetValue("ToastEnabled");
                        _originalBannerSetting = bannerValue is int intValue ? intValue : 1;
                        
                        key.SetValue("ToastEnabled", 0, RegistryValueKind.DWord);
                    }
                }
                
                // 3. Desativar sons de notificação
                using (var key = Registry.CurrentUser.CreateSubKey(
                    @"SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings"))
                {
                    if (key != null)
                    {
                        var soundValue = key.GetValue("NOC_GLOBAL_SETTING_SOUND_ENABLED");
                        _originalSoundSetting = soundValue is int intValue ? intValue : 1;
                        
                        key.SetValue("NOC_GLOBAL_SETTING_SOUND_ENABLED", 0, RegistryValueKind.DWord);
                    }
                }
                
                // 4. Ativar Focus Assist (modo Não Perturbe)
                SetFocusAssist(true);
                
                // 5. Desativar notificações específicas do Chrome/Google
                DisableChromeNotifications();
                
                _logger.LogInfo("[NotificationBlocker] Notificações bloqueadas com sucesso");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[NotificationBlocker] Erro ao bloquear notificações: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Desativa notificações específicas do Chrome/Google
        /// </summary>
        private void DisableChromeNotifications()
        {
            try
            {
                // Caminhos comuns do Chrome
                var chromePaths = new[]
                {
                    @"SOFTWARE\Google\Chrome\PreferenceMACs",
                    @"SOFTWARE\Chromium\PreferenceMACs"
                };
                
                foreach (var basePath in chromePaths)
                {
                    using var key = Registry.CurrentUser.CreateSubKey(basePath);
                    if (key != null)
                    {
                        // Percorrer todos os perfis do Chrome
                        foreach (var profileName in key.GetSubKeyNames())
                        {
                            try
                            {
                                using var profileKey = key.CreateSubKey(profileName);
                                if (profileKey != null)
                                {
                                    // Desativar notificações do Chrome
                                    profileKey.SetValue("notification_enabled", 0, RegistryValueKind.DWord);
                                    profileKey.SetValue("notification_prompt_allowed", 0, RegistryValueKind.DWord);
                                }
                            }
                            catch
                            {
                                // Continuar com o próximo perfil
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[NotificationBlocker] Erro ao desativar notificações do Chrome: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Reforça o bloqueio de notificações (chamado periodicamente)
        /// </summary>
        private void ReinforceNotificationBlocking()
        {
            try
            {
                // Verificar se as configurações ainda estão bloqueadas
                using (var key = Registry.CurrentUser.OpenSubKey(
                    @"SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings"))
                {
                    if (key != null)
                    {
                        var currentValue = key.GetValue("NOC_GLOBAL_SETTING_TOASTS_ENABLED");
                        if (currentValue is int intValue && intValue != 0)
                        {
                            // Reaplicar bloqueio
                            key.SetValue("NOC_GLOBAL_SETTING_TOASTS_ENABLED", 0, RegistryValueKind.DWord);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[NotificationBlocker] Erro ao reforçar bloqueio: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Define ou remove o modo Focus Assist (Não Perturbe)
        /// </summary>
        private void SetFocusAssist(bool enable)
        {
            try
            {
                // CORREÇÃO: Usar API WinRT diretamente em vez de PowerShell
                // Isso elimina processos PowerShell desnecessários
                try
                {
                    // Limpar histórico de notificações usando API WinRT diretamente
                    if (enable)
                    {
                        // Usar ToastNotificationManager diretamente via WinRT
                        // Nota: Para WPF, pode ser necessário usar interop, mas é melhor que PowerShell
                        // Por enquanto, desabilitar esta funcionalidade para evitar PowerShell
                        _logger.LogInfo("[NotificationBlocker] Focus Assist seria ativado (desabilitado para evitar PowerShell)");
                    }
                    else
                    {
                        _logger.LogInfo("[NotificationBlocker] Focus Assist seria restaurado (desabilitado para evitar PowerShell)");
                    }
                    
                    _originalFocusAssistState = enable;
                }
                catch
                {
                    // Se falhar, apenas logar (não usar PowerShell)
                    _logger.LogWarning("[NotificationBlocker] Não foi possível configurar Focus Assist (requer API WinRT)");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[NotificationBlocker] Erro ao configurar Focus Assist: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Restaura as configurações originais de notificação
        /// </summary>
        private void RestoreOriginalSettings()
        {
            try
            {
                // Restaurar Toast Notifications
                if (_originalToastSetting != -1)
                {
                    using var key = Registry.CurrentUser.CreateSubKey(
                        @"SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings");
                    key?.SetValue("NOC_GLOBAL_SETTING_TOASTS_ENABLED", _originalToastSetting, RegistryValueKind.DWord);
                }
                
                // Restaurar Banners
                if (_originalBannerSetting != -1)
                {
                    using var key = Registry.CurrentUser.CreateSubKey(
                        @"SOFTWARE\Microsoft\Windows\CurrentVersion\PushNotifications");
                    key?.SetValue("ToastEnabled", _originalBannerSetting, RegistryValueKind.DWord);
                }
                
                // Restaurar Sons
                if (_originalSoundSetting != -1)
                {
                    using var key = Registry.CurrentUser.CreateSubKey(
                        @"SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings");
                    key?.SetValue("NOC_GLOBAL_SETTING_SOUND_ENABLED", _originalSoundSetting, RegistryValueKind.DWord);
                }
                
                // Restaurar Focus Assist
                SetFocusAssist(_originalFocusAssistState);
                
                // Reativar notificações do Chrome
                ReenableChromeNotifications();
                
                _logger.LogInfo("[NotificationBlocker] Configurações originais restauradas");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[NotificationBlocker] Erro ao restaurar configurações: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Reativa notificações do Chrome/Google
        /// </summary>
        private void ReenableChromeNotifications()
        {
            try
            {
                var chromePaths = new[]
                {
                    @"SOFTWARE\Google\Chrome\PreferenceMACs",
                    @"SOFTWARE\Chromium\PreferenceMACs"
                };
                
                foreach (var basePath in chromePaths)
                {
                    using var key = Registry.CurrentUser.CreateSubKey(basePath);
                    if (key != null)
                    {
                        foreach (var profileName in key.GetSubKeyNames())
                        {
                            try
                            {
                                using var profileKey = key.CreateSubKey(profileName);
                                if (profileKey != null)
                                {
                                    // Reativar notificações (valores padrão)
                                    profileKey.DeleteValue("notification_enabled", false);
                                    profileKey.DeleteValue("notification_prompt_allowed", false);
                                }
                            }
                            catch
                            {
                                // Continuar com o próximo perfil
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[NotificationBlocker] Erro ao reativar notificações do Chrome: {ex.Message}");
            }
        }
        
        public void Dispose()
        {
            StopBlocking();
        }
    }
}