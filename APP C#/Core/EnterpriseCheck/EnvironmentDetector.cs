using System;
using System.Management;
using System.Net.NetworkInformation;
using System.Runtime.InteropServices;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Core.EnterpriseCheck
{
    /// <summary>
    /// DETECTOR DE CONTEXTO EMPRESARIAL (ENTERPRISE CONTEXT AWARENESS)
    /// 
    /// Responsável por identificar o ambiente onde o software está rodando para
    /// evitar ações destrutivas em ambientes corporativos ou instáveis.
    /// </summary>
    public class EnvironmentDetector
    {
        private readonly ILoggingService _logger;

        public EnvironmentDetector(ILoggingService logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Detecta se o computador faz parte de um Domínio Active Directory (Corporativo).
        /// Em ambientes corporativos, muitas otimizações de rede e serviços devem ser DESABILITADAS
        /// para evitar conflitos com GPO e Agentes de Segurança.
        /// </summary>
        public bool IsCorporateManaged()
        {
            try
            {
                var domain = IPGlobalProperties.GetIPGlobalProperties().DomainName;
                bool isJoinedToDomain = !string.IsNullOrEmpty(domain) && domain != "WORKGROUP";

                if (isJoinedToDomain)
                {
                    _logger.LogWarning($"[ENV] Ambiente Corporativo Detectado! Domínio: {domain}");
                    return true;
                }
                
                // Verificação secundária via WMI para ter certeza
                using (var searcher = new ManagementObjectSearcher("SELECT PartOfDomain FROM Win32_ComputerSystem"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        if ((bool)obj["PartOfDomain"])
                        {
                            _logger.LogWarning("[ENV] Ambiente Corporativo Detectado (WMI)!");
                            return true;
                        }
                    }
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError("[ENV] Erro ao detectar ambiente corporativo", ex);
                // Fail-safe: Se der erro na detecção, assumir que NÃO é corporativo mas logar o erro
                return false; 
            }
        }

        /// <summary>
        /// Detecta se é um Laptop rodando na bateria.
        /// Otimizações de "Alto Desempenho" devem ser proibidas neste estado.
        /// </summary>
        public bool IsLaptopOnBattery()
        {
            try
            {
                var powerStatus = SystemParametersInfo.GetPowerStatus();
                // ACLineStatus: 0 = Battery, 1 = AC, 255 = Unknown
                bool onBattery = powerStatus.ACLineStatus == 0;

                if (onBattery)
                {
                    _logger.LogInfo("[ENV] Dispositivo operando na bateria. Modo performance restrito.");
                }

                return onBattery;
            }
            catch (Exception ex)
            {
                _logger.LogError("[ENV] Erro ao detectar status de energia", ex);
                return false;
            }
        }

        /// <summary>
        /// Detecta Thermal Throttling ativo ou temperaturas críticas.
        /// Impede Overclock/Boost se o PC já estiver derretendo.
        /// </summary>
        public bool ThermalThrottlingDetected()
        {
            try
            {
                // Verificação simplificada via WMI ThermalZoneTemperature
                // Note: Nem todos os drivers expõem isso corretamente, mas é a abordagem padrão Windows.
                using (var searcher = new ManagementObjectSearcher(@"root\WMI", "SELECT * FROM MSAcpi_ThermalZoneTemperature"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        // Temperatura vem em Kelvin * 10. Ex: 3000 = 300K = 26.85°C
                        double tempK10 = Convert.ToDouble(obj["CurrentTemperature"]);
                        double tempC = (tempK10 / 10.0) - 273.15;

                        // Se qualqer zona térmica passar de 90°C
                        if (tempC > 90)
                        {
                            _logger.LogWarning($"[ENV] ALERTA TÉRMICO: Zona detectada a {tempC:F1}°C. Throttling iminente.");
                            return true;
                        }
                    }
                }
                return false;
            }
            catch
            {
                // Falha silenciosa é aceitável aqui pois nem todo HW suporta essa query WMI padrão
                return false;
            }
        }

        // P/Invoke para PowerStatus
        private static class SystemParametersInfo
        {
            [DllImport("kernel32.dll", SetLastError = true)]
            public static extern bool GetSystemPowerStatus(out SYSTEM_POWER_STATUS lpSystemPowerStatus);

            public static SYSTEM_POWER_STATUS GetPowerStatus()
            {
                GetSystemPowerStatus(out var status);
                return status;
            }

            public struct SYSTEM_POWER_STATUS
            {
                public byte ACLineStatus;
                public byte BatteryFlag;
                public byte BatteryLifePercent;
                public byte SystemStatusFlag;
                public int BatteryLifeTime;
                public int BatteryFullLifeTime;
            }
        }
    }
}
