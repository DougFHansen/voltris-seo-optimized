using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Toolkit.Uwp.Notifications;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Gerenciador profissional de notificações Toast nativas do Windows 10/11
    /// Wrapper inteligente e simples para o resto da aplicação
    /// Usa Microsoft.Toolkit.Uwp.Notifications (biblioteca oficial da Microsoft)
    /// </summary>
    public static class NotificationManager
    {
        private static readonly string AppId = GetAppId();
        private static DateTime _lastNotificationTime = DateTime.MinValue;
        private const int NotificationCooldownSeconds = 2; // Evitar spam de notificações

        /// <summary>
        /// Obtém o AppId correto para notificações Toast
        /// Para WPF, precisamos usar um AppId simples (não caminho completo)
        /// </summary>
        private static string GetAppId()
        {
            // Para WPF, usar um AppId simples funciona melhor
            // O Windows registra automaticamente o app quando a primeira notificação é enviada
            return "VoltrisOptimizer";
        }

        /// <summary>
        /// Exibe uma notificação Toast nativa do Windows 10/11
        /// Método principal e mais simples para uso
        /// CORREÇÃO CRÍTICA: Usa biblioteca diretamente em vez de PowerShell para evitar múltiplos processos
        /// </summary>
        /// <param name="title">Título da notificação</param>
        /// <param name="message">Mensagem da notificação</param>
        /// <param name="type">Tipo da notificação (opcional, padrão: Info)</param>
        public static void Show(string title, string message, NotificationType type = NotificationType.Info)
        {
            try
            {
                // Verificar cooldown para evitar spam
                var timeSinceLastNotification = DateTime.Now - _lastNotificationTime;
                if (timeSinceLastNotification.TotalSeconds < NotificationCooldownSeconds)
                {
                    return;
                }

                _lastNotificationTime = DateTime.Now;

                // CORREÇÃO CRÍTICA: Usar biblioteca diretamente em vez de PowerShell
                // Isso elimina completamente o problema de múltiplos processos PowerShell
                var iconEmoji = GetIconForType(type);
                if (TryShowToastDirectly(title, message, iconEmoji))
                {
                    Debug.WriteLine($"[NotificationManager] Toast exibido: {title} - {message}");
                    return; // Sucesso!
                }

                // Se falhar, logar erro (sem fallback para PowerShell para evitar processos extras)
                Debug.WriteLine($"[NotificationManager] Falha ao exibir Toast: {title}");
            }
            catch (Exception ex)
            {
                // Logar erro sem tentar PowerShell (evitar processos extras)
                Debug.WriteLine($"[NotificationManager] Erro ao exibir Toast: {ex.Message}");
            }
        }


        /// <summary>
        /// Exibe notificação de sucesso
        /// </summary>
        public static void ShowSuccess(string title, string message)
        {
            Show(title, message, NotificationType.Success);
        }

        /// <summary>
        /// Exibe notificação de erro
        /// </summary>
        public static void ShowError(string title, string message)
        {
            Show(title, message, NotificationType.Error);
        }

        /// <summary>
        /// Exibe notificação de aviso
        /// </summary>
        public static void ShowWarning(string title, string message)
        {
            Show(title, message, NotificationType.Warning);
        }

        /// <summary>
        /// Exibe notificação de informação
        /// </summary>
        public static void ShowInfo(string title, string message)
        {
            Show(title, message, NotificationType.Info);
        }

        /// <summary>
        /// Obtém o ícone emoji baseado no tipo de notificação
        /// </summary>
        private static string GetIconForType(NotificationType type)
        {
            return type switch
            {
                NotificationType.Success => "✅",
                NotificationType.Warning => "⚠️",
                NotificationType.Error => "❌",
                _ => "ℹ️"
            };
        }

        /// <summary>
        /// Método usando biblioteca diretamente (SEM PowerShell) para exibir Toast
        /// CORREÇÃO CRÍTICA: Elimina completamente processos PowerShell desnecessários
        /// </summary>
        private static bool TryShowToastDirectly(string title, string message, string iconEmoji)
        {
            try
            {
                // Usar ToastContentBuilder da biblioteca Microsoft.Toolkit.Uwp.Notifications
                var builder = new ToastContentBuilder()
                    .AddText(title)
                    .AddText(message)
                    .SetToastScenario(ToastScenario.Default);

                // Mostrar notificação usando a biblioteca diretamente
                builder.Show();
                
                return true;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[NotificationManager] Erro ao exibir Toast diretamente: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Método usando PowerShell para exibir Toast (DEPRECADO - não usar mais)
        /// Mantido apenas como referência, mas não deve ser chamado
        /// </summary>
        [Obsolete("Não usar mais - causa múltiplos processos PowerShell. Use TryShowToastDirectly()")]
        private static bool TryShowToastViaPowerShell(string title, string message, string iconEmoji)
        {
            try
            {
                var escapedTitle = EscapeXml(title);
                var escapedMessage = EscapeXml(message.Replace("\n", "&#10;").Replace("\r", ""));

                // Usar AppId simples (sem caminho completo) para melhor compatibilidade
                var appIdForPs = $"'{AppId}'";

                // Script PowerShell melhorado com melhor tratamento de erros
                var psScript = $@"
# Carregar assemblies WinRT necessários
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

# Criar XML da notificação
$xml = @'
<toast>
    <visual>
        <binding template=""ToastGeneric"">
            <text hint-maxLines=""1"">{escapedTitle}</text>
            <text hint-maxLines=""3"">{escapedMessage}</text>
            <text placement=""attribution"">Voltris Optimizer</text>
        </binding>
    </visual>
    <audio src=""ms-winsoundevent:Notification.Default"" />
</toast>
'@

try {{
    # Criar documento XML
    $toastXml = [Windows.Data.Xml.Dom.XmlDocument]::new()
    $toastXml.LoadXml($xml)
    
    # Criar notificação Toast
    $toast = [Windows.UI.Notifications.ToastNotification]::new($toastXml)
    $toast.ExpirationTime = [DateTimeOffset]::Now.AddMinutes(5)
    
    # Tentar criar notificador com AppId específico
    $appId = {appIdForPs}
    $notifier = $null
    
    try {{
        $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId)
        Write-Host ""[TOAST] Notificador criado com AppId: $appId""
    }} catch {{
        # Fallback: criar sem AppId (usa executável atual)
        try {{
            $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier()
            Write-Host ""[TOAST] Notificador criado sem AppId (fallback)""
        }} catch {{
            Write-Host ""[TOAST] ERRO ao criar notificador: $($_.Exception.Message)""
            exit 1
        }}
    }}
    
    # Verificar se notificações estão habilitadas
    $setting = $notifier.Setting
    Write-Host ""[TOAST] Status das notificações: $setting""
    
    if ($setting -eq [Windows.UI.Notifications.NotificationSetting]::Enabled) {{
        # Exibir notificação
        $notifier.Show($toast)
        Write-Host ""[TOAST] Notificação exibida com sucesso!""
        exit 0
    }} elseif ($setting -eq [Windows.UI.Notifications.NotificationSetting]::DisabledForUser) {{
        Write-Host ""[TOAST] Notificações desabilitadas pelo usuário""
        exit 1
    }} elseif ($setting -eq [Windows.UI.Notifications.NotificationSetting]::DisabledForApplication) {{
        Write-Host ""[TOAST] Notificações desabilitadas para este aplicativo""
        exit 1
    }} else {{
        # Tentar exibir mesmo assim (às vezes funciona mesmo com status desconhecido)
        try {{
            $notifier.Show($toast)
            Write-Host ""[TOAST] Notificação exibida (status desconhecido)""
            exit 0
        }} catch {{
            Write-Host ""[TOAST] ERRO ao exibir: $($_.Exception.Message)""
            exit 1
        }}
    }}
}} catch {{
    Write-Host ""[TOAST] ERRO GERAL: $($_.Exception.Message)""
    Write-Host ""[TOAST] StackTrace: $($_.Exception.StackTrace)""
    exit 1
}}
";

                var tempScript = Path.Combine(Path.GetTempPath(), $"toast_{Guid.NewGuid()}.ps1");
                File.WriteAllText(tempScript, psScript, Encoding.UTF8);

                // CORREÇÃO: Não usar mais PowerShell - método deprecado
                // Este código não deve ser executado, mas mantido para referência
                return false;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[NotificationManager] Exception: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Método alternativo usando PowerShell (DEPRECADO - não usar mais)
        /// Mantido apenas como referência, mas não deve ser chamado
        /// </summary>
        [Obsolete("Não usar mais - causa múltiplos processos PowerShell")]
        private static void TryShowViaPowerShell(string title, string message, NotificationType type)
        {
            try
            {
                var iconEmoji = GetIconForType(type);
                var escapedTitle = EscapeXml(title);
                var escapedMessage = EscapeXml(message.Replace("\n", "&#10;").Replace("\r", ""));

                var appIdForPs = AppId.Contains("\\") 
                    ? $"'{AppId.Replace("'", "''")}'" 
                    : $"'{AppId}'";

                var psScript = $@"
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

$xml = @'
<toast activationType=""foreground"" scenario=""reminder"">
    <visual>
        <binding template=""ToastGeneric"">
            <text hint-maxLines=""1"">{escapedTitle}</text>
            <text hint-maxLines=""3"">{escapedMessage}</text>
            <text placement=""attribution"">Voltris Optimizer</text>
        </binding>
    </visual>
    <audio src=""ms-winsoundevent:Notification.Default"" />
</toast>
'@

try {{
    $toastXml = [Windows.Data.Xml.Dom.XmlDocument]::new()
    $toastXml.LoadXml($xml)
    $toast = [Windows.UI.Notifications.ToastNotification]::new($toastXml)
    $toast.ExpirationTime = [DateTimeOffset]::Now.AddMinutes(5)
    
    $appId = {appIdForPs}
    try {{
        $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId)
        if ($notifier.Setting -eq [Windows.UI.Notifications.NotificationSetting]::Enabled) {{
            $notifier.Show($toast)
            exit 0
        }}
    }} catch {{
        $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier()
        $notifier.Show($toast)
        exit 0
    }}
}} catch {{
    exit 1
}}
";

                var tempScript = Path.Combine(Path.GetTempPath(), $"toast_{Guid.NewGuid()}.ps1");
                File.WriteAllText(tempScript, psScript, Encoding.UTF8);

                // CORREÇÃO: Não usar mais PowerShell - método deprecado
                // Este código não deve ser executado, mas mantido para referência
            }
            catch
            {
                // Se tudo falhar, apenas logar (não quebrar a aplicação)
                Debug.WriteLine("[NotificationManager] Falha ao exibir notificação via PowerShell");
            }
        }

        /// <summary>
        /// Escapa caracteres XML especiais
        /// </summary>
        private static string EscapeXml(string text)
        {
            if (string.IsNullOrEmpty(text))
                return string.Empty;

            return text
                .Replace("&", "&amp;")
                .Replace("<", "&lt;")
                .Replace(">", "&gt;")
                .Replace("\"", "&quot;")
                .Replace("'", "&apos;");
        }
    }

    /// <summary>
    /// Tipos de notificação disponíveis
    /// </summary>
    public enum NotificationType
    {
        Info,
        Success,
        Warning,
        Error
    }
}

