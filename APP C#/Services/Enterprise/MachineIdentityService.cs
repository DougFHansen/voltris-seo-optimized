using System;
using System.Text;
using System.Security.Cryptography;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Enterprise.Models;

namespace VoltrisOptimizer.Services.Enterprise
{
    public class MachineIdentityService
    {
        private readonly ISystemInfoService _systemInfoService;
        private MachineIdentity? _cachedIdentity;

        public MachineIdentityService(ISystemInfoService systemInfoService)
        {
            _systemInfoService = systemInfoService;
        }

        public async Task<MachineIdentity> GetMachineIdentityAsync()
        {
            if (_cachedIdentity != null) return _cachedIdentity;

            var cpu = await _systemInfoService.GetCpuInfoAsync();
            var ram = await _systemInfoService.GetRamInfoAsync();
            var firstDisk = (await _systemInfoService.GetDrivesInfoAsync())?[0]; // Pega o primeiro disco (C:)
            var networks = await _systemInfoService.GetNetworkInfoAsync();
            
            // Tenta pegar o MAC Address mais estável (primeiro ativo)
            string mac = "00:00:00:00:00:00";
            if (networks != null && networks.Length > 0)
            {
               foreach(var net in networks)
               {
                   if(!string.IsNullOrEmpty(net.MacAddress))
                   {
                       mac = net.MacAddress;
                       break;
                   }
               }
            }

            var identity = new MachineIdentity
            {
                Hostname = Environment.MachineName,
                OsVersion = Environment.OSVersion.ToString(),
                CpuModel = (cpu?.Name ?? "Unknown CPU").Replace("™", "").Replace("®", "").Trim(),
                RamTotalGb = ram != null ? (int)Math.Round(ram.TotalBytes / (1024.0 * 1024 * 1024)) : 0,
                DiskSerial = firstDisk?.Label ?? "Unknown Disk", // Em app real usaria serial fisico via WMI
                MacAddress = mac,
                Architecture = Environment.Is64BitOperatingSystem ? "x64" : "x86"
            };

            // Gerar Hash Único (Machine ID) baseado no InstallationId original se disponível
            // Isso garante compatibilidade com o sistema de vinculação (Welcome screen)

            // Se já temos um ID salvo, validamos se é um UUID v4 RFC 4122 válido.
            // Guid.TryParse aceita qualquer GUID, mas o servidor exige UUID v1-v8 (RFC 4122).
            var settings = SettingsService.Instance.Settings;
            if (!string.IsNullOrEmpty(settings.InstallationId) && IsValidRfc4122Uuid(settings.InstallationId))
            {
                identity.MachineId = settings.InstallationId;
            }
            else
            {
                // CORREÇÃO: ID salvo é inválido (ex: versão 0 como 0BBC2D9A-0039-FD42-...).
                // Gerar novo UUID v4 válido e sobrescrever o ID corrompido nas configurações.
                var oldId = settings.InstallationId;
                identity.MachineId = GenerateStableMachineId(identity);
                
                // Salvar o ID gerado nas configurações para manter consistência
                settings.InstallationId = identity.MachineId;
                SettingsService.Instance.SaveSettings();

                // Log explícito para rastreabilidade da correção
                System.Diagnostics.Debug.WriteLine(
                    $"[MachineIdentity] ID inválido detectado e corrigido: '{oldId}' → '{identity.MachineId}'");
            }

            _cachedIdentity = identity;
            return identity;
        }

        private static bool IsValidRfc4122Uuid(string id)
        {
            // Valida UUID RFC 4122: versão 1-8 no nibble de versão, variante 8/9/A/B no nibble de variante
            // Padrão: xxxxxxxx-xxxx-[1-8]xxx-[89abAB]xxx-xxxxxxxxxxxx
            if (!Guid.TryParse(id, out var guid)) return false;
            var bytes = guid.ToByteArray();
            // Em Guid .NET, byte[7] contém o nibble de versão no nibble alto (big-endian no campo time_hi_and_version)
            // Mas Guid.ToByteArray() usa little-endian para os primeiros 3 componentes
            // Verificar via string é mais simples e confiável
            var s = guid.ToString(); // xxxxxxxx-xxxx-Vxxx-Wxxx-xxxxxxxxxxxx
            var versionChar = s[14]; // posição do nibble de versão
            var variantChar = s[19]; // posição do nibble de variante
            var validVersion = versionChar >= '1' && versionChar <= '8';
            var variantLower = char.ToLower(variantChar);
            var validVariant = variantLower == '8' || variantLower == '9' || variantLower == 'a' || variantLower == 'b';
            return validVersion && validVariant;
        }

        private string GenerateStableMachineId(MachineIdentity identity)
        {
            // Combina dados imutáveis do hardware
            string rawId = $"{identity.CpuModel}-{identity.MacAddress}";
            
            // Tenta pegar UUID via WMI se possível (mais robusto)
            try
            {
#if  NET8_0_OR_GREATER && WINDOWS
                if (OperatingSystem.IsWindows())
                {
                    using (var searcher = new System.Management.ManagementObjectSearcher("SELECT UUID FROM Win32_ComputerSystemProduct"))
                    {
                        foreach (System.Management.ManagementObject obj in searcher.Get())
                        {
                            var uuid = obj["UUID"]?.ToString();
                            if (!string.IsNullOrEmpty(uuid))
                            {
                                // Se o WMI já retornar um UUID válido, usamos ele diretamente
                                if (Guid.TryParse(uuid, out _))
                                    return uuid;
                                
                                rawId = uuid; 
                            }
                        }
                    }
                }
#endif
            }
            catch { }

            // Gera um UUID v4 determinístico baseado no hash SHA256 do hardware
            // IMPORTANTE: MD5 pode gerar GUIDs com versão inválida (ex: 0xF no nibble de versão)
            // UUID v4 requer: nibble de versão = 4, nibble de variante = 8/9/A/B
            using (var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(rawId);
                var hash = sha256.ComputeHash(bytes); // 32 bytes — usamos os primeiros 16
                
                // Forçar formato UUID v4 (RFC 4122):
                // byte[6]: nibble alto = 0x4 (versão 4)
                // byte[8]: nibble alto = 0x8, 0x9, 0xA ou 0xB (variante RFC 4122)
                hash[6] = (byte)((hash[6] & 0x0F) | 0x40); // versão 4
                hash[8] = (byte)((hash[8] & 0x3F) | 0x80); // variante RFC 4122
                
                var guidBytes = new byte[16];
                Array.Copy(hash, guidBytes, 16);
                return new Guid(guidBytes).ToString();
            }
        }
    }
}
