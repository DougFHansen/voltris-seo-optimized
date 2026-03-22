using System;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Core.Intelligence;

namespace VoltrisOptimizer.Services.Enterprise
{
    /// <summary>
    /// EnterpriseService — telemetria remota removida.
    /// Mantido como stub para compatibilidade com código de licença e vínculo de conta.
    /// </summary>
    public class EnterpriseService
    {
        private static EnterpriseService? _instance;
        public static EnterpriseService Instance => _instance ??= new EnterpriseService();

        public EnterpriseService() { _instance = this; }

        public EnterpriseService(
            object identityService,
            object monitorService,
            IVoltrisIntelligenceOrchestrator intelligenceOrchestrator,
            ILoggingService? logger = null)
        {
            _instance = this;
        }

        public Task InitializeAsync() => Task.CompletedTask;
        public void StartBackgroundServices() { }
        public Task StopBackgroundServicesAsync() => Task.CompletedTask;

        /// <summary>Stub — sem sincronização remota de licença.</summary>
        public Task SyncLicenseStatusAsync() => Task.CompletedTask;

        /// <summary>Stub — desvinculação local apenas.</summary>
        public Task UnlinkThisDeviceAsync()
        {
            try
            {
                var settings = SettingsService.Instance.Settings;
                settings.IsDeviceLinked = false;
                settings.LinkedUserEmail = null;
                SettingsService.Instance.SaveSettings();
            }
            catch { }
            return Task.CompletedTask;
        }

        /// <summary>Stub — retorna email salvo localmente.</summary>
        public Task<string?> GetLinkingStatusAsync()
        {
            try
            {
                var settings = SettingsService.Instance.Settings;
                if (settings.IsDeviceLinked && !string.IsNullOrEmpty(settings.LinkedUserEmail))
                    return Task.FromResult<string?>(settings.LinkedUserEmail);
            }
            catch { }
            return Task.FromResult<string?>(null);
        }
    }
}
