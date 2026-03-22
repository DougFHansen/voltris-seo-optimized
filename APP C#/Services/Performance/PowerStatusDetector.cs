using System;
using System.Management;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Performance
{
    /// <summary>
    /// Detecta status de energia (AC/DC) de forma confiável usando WMI
    /// CORREÇÃO: RISCO #5 - Detecção AC/DC não confiável
    /// </summary>
    public class PowerStatusDetector
    {
        private readonly ILoggingService _logger;
        private PowerStatus _lastKnownStatus = PowerStatus.Unknown;
        private int _consecutiveReadings = 0;
        private const int HYSTERESIS_THRESHOLD = 2; // Exigir 2 leituras consistentes

        public PowerStatusDetector(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Detecta se está conectado à energia AC (com hysteresis)
        /// </summary>
        public bool IsOnACPower()
        {
            var currentStatus = DetectPowerStatusInternal();

            // Implementar hysteresis: exigir leituras consistentes
            if (currentStatus == _lastKnownStatus)
            {
                _consecutiveReadings++;
            }
            else
            {
                _consecutiveReadings = 1;
                _lastKnownStatus = currentStatus;
            }

            // Se ainda não temos leituras consistentes, usar último estado conhecido
            if (_consecutiveReadings < HYSTERESIS_THRESHOLD)
            {
                _logger.LogDebug($"[PowerStatus] Aguardando leitura consistente ({_consecutiveReadings}/{HYSTERESIS_THRESHOLD})");
                
                // Fallback conservador: assumir bateria se incerto
                if (_lastKnownStatus == PowerStatus.Unknown)
                {
                    _logger.LogWarning("[PowerStatus] Status desconhecido - assumindo BATERIA por segurança");
                    return false;
                }
            }

            bool isAC = _lastKnownStatus == PowerStatus.AC;
            _logger.LogDebug($"[PowerStatus] Status: {(isAC ? "AC (Plugado)" : "DC (Bateria)")}");
            return isAC;
        }

        /// <summary>
        /// Detecta mudança de AC para DC ou vice-versa
        /// </summary>
        public bool HasPowerStatusChanged(out bool isNowOnAC)
        {
            var previousStatus = _lastKnownStatus;
            isNowOnAC = IsOnACPower();
            var currentStatus = _lastKnownStatus;

            bool changed = previousStatus != PowerStatus.Unknown && 
                          currentStatus != PowerStatus.Unknown && 
                          previousStatus != currentStatus &&
                          _consecutiveReadings >= HYSTERESIS_THRESHOLD;

            if (changed)
            {
                _logger.LogInfo($"[PowerStatus] Mudança detectada: {previousStatus} → {currentStatus}");
            }

            return changed;
        }

        private PowerStatus DetectPowerStatusInternal()
        {
            try
            {
                // Método 1: WMI Win32_Battery (mais confiável)
                using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_Battery"))
                {
                    foreach (ManagementObject battery in searcher.Get())
                    {
                        // BatteryStatus: 1=Discharging, 2=AC, 3=Fully Charged, 4=Low, 5=Critical
                        ushort batteryStatus = Convert.ToUInt16(battery["BatteryStatus"] ?? 0);
                        
                        if (batteryStatus == 2 || batteryStatus == 3) // AC ou Fully Charged
                        {
                            return PowerStatus.AC;
                        }
                        else if (batteryStatus == 1 || batteryStatus == 4 || batteryStatus == 5) // Discharging
                        {
                            return PowerStatus.DC;
                        }
                    }
                }

                // Método 2: Fallback para SystemInformation (menos confiável)
                var powerStatus = System.Windows.Forms.SystemInformation.PowerStatus;
                if (powerStatus.PowerLineStatus == System.Windows.Forms.PowerLineStatus.Online)
                {
                    return PowerStatus.AC;
                }
                else if (powerStatus.PowerLineStatus == System.Windows.Forms.PowerLineStatus.Offline)
                {
                    return PowerStatus.DC;
                }

                // Se chegou aqui, não conseguiu determinar
                _logger.LogWarning("[PowerStatus] Não foi possível determinar status de energia");
                return PowerStatus.Unknown;
            }
            catch (Exception ex)
            {
                _logger.LogError("[PowerStatus] Erro ao detectar status de energia", ex);
                return PowerStatus.Unknown;
            }
        }
    }

    public enum PowerStatus
    {
        Unknown,
        AC,  // Plugado na tomada
        DC   // Bateria
    }
}
