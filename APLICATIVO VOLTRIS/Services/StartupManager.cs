using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace VoltrisOptimizer.Services
{
    public class StartupManager
    {
        private const string RunKey = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run";
        private const string ApprovedKey = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\Run";
        private const string Name = "Voltris Optimizer";
        private const string LegacyName = "VoltrisOptimizer";

        public Task<bool> IsEnabledAsync()
        {
            return Task.Run(() =>
            {
                var run = GetValueFromAnyView(RunKey, Name) ?? GetValueFromAnyView(RunKey, LegacyName);
                if (run == null) return false;

                var kind = GetValueKindFromAnyView(ApprovedKey, Name) ?? GetValueKindFromAnyView(ApprovedKey, LegacyName);
                var val = GetValueFromAnyView(ApprovedKey, Name) ?? GetValueFromAnyView(ApprovedKey, LegacyName);
                if (val == null) return true;

                if (kind == RegistryValueKind.DWord)
                {
                    var v = (int)val;
                    return v == 2;
                }
                if (kind == RegistryValueKind.Binary)
                {
                    var b = val as byte[];
                    if (b != null && b.Length >= 4)
                    {
                        var status = BitConverter.ToInt32(b, 0);
                        return status == 2;
                    }
                }
                return true;
            });
        }

        public Task EnableStartupAsync(bool startMinimized)
        {
            return Task.Run(() =>
            {
                var exe = ResolveExePath();
                if (string.IsNullOrEmpty(exe) || !File.Exists(exe)) 
                {
                    throw new Exception($"Executável não encontrado. Tentou: {exe ?? "(null)"}");
                }
                
                // Normalizar caminho para evitar problemas com espaços e caracteres especiais
                exe = Path.GetFullPath(exe);
                var cmd = startMinimized ? $"\"{exe}\" /minimized" : $"\"{exe}\"";

                var kDef = OpenOrCreateKey(RegistryView.Default, RunKey, true);
                var k64 = OpenOrCreateKey(RegistryView.Registry64, RunKey, true);
                var k32 = OpenOrCreateKey(RegistryView.Registry32, RunKey, true);
                foreach (var k in new[] { kDef, k64, k32 })
                {
                    k?.DeleteValue(LegacyName, false);
                    k?.SetValue(Name, cmd, RegistryValueKind.String);
                    k?.Flush();
                }

                var aDef = OpenOrCreateKey(RegistryView.Default, ApprovedKey, true);
                var a64 = OpenOrCreateKey(RegistryView.Registry64, ApprovedKey, true);
                var a32 = OpenOrCreateKey(RegistryView.Registry32, ApprovedKey, true);
                var bin = new byte[] { 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
                foreach (var a in new[] { aDef, a64, a32 })
                {
                    a?.DeleteValue(LegacyName, false);
                    // Usar apenas Binary (formato correto do Windows para StartupApproved)
                    a?.SetValue(Name, bin, RegistryValueKind.Binary);
                    a?.Flush();
                }
            });
        }

        public Task DisableStartupAsync()
        {
            return Task.Run(() =>
            {
                var kDef = OpenOrCreateKey(RegistryView.Default, RunKey, true);
                var k64 = OpenOrCreateKey(RegistryView.Registry64, RunKey, true);
                var k32 = OpenOrCreateKey(RegistryView.Registry32, RunKey, true);
                foreach (var k in new[] { kDef, k64, k32 })
                {
                    k?.DeleteValue(Name, false);
                    k?.DeleteValue(LegacyName, false);
                    k?.Flush();
                }

                var aDef = OpenOrCreateKey(RegistryView.Default, ApprovedKey, true);
                var a64 = OpenOrCreateKey(RegistryView.Registry64, ApprovedKey, true);
                var a32 = OpenOrCreateKey(RegistryView.Registry32, ApprovedKey, true);
                foreach (var a in new[] { aDef, a64, a32 })
                {
                    a?.DeleteValue(Name, false);
                    a?.DeleteValue(LegacyName, false);
                    a?.Flush();
                }
            });
        }

        private static RegistryKey? OpenOrCreateKey(RegistryView view, string subKey, bool writable)
        {
            try
            {
                var baseKey = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, view);
                var k = baseKey.OpenSubKey(subKey, writable);
                if (k != null) return k;
                var parts = subKey.Split('\\');
                RegistryKey current = baseKey;
                foreach (var p in parts)
                {
                    var next = current.CreateSubKey(p, true);
                    current = next;
                }
                return current;
            }
            catch { return null; }
        }

        private static object? GetValueFromAnyView(string subKey, string name)
        {
            try
            {
                using var def = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Default).OpenSubKey(subKey, false);
                var v = def?.GetValue(name);
                if (v != null) return v;
                using var v64 = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Registry64).OpenSubKey(subKey, false);
                v = v64?.GetValue(name);
                if (v != null) return v;
                using var v32 = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Registry32).OpenSubKey(subKey, false);
                return v32?.GetValue(name);
            }
            catch { return null; }
        }

        private static RegistryValueKind? GetValueKindFromAnyView(string subKey, string name)
        {
            try
            {
                using var def = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Default).OpenSubKey(subKey, false);
                if (def != null) { try { return def.GetValueKind(name); } catch { } }
                using var v64 = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Registry64).OpenSubKey(subKey, false);
                if (v64 != null) { try { return v64.GetValueKind(name); } catch { } }
                using var v32 = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Registry32).OpenSubKey(subKey, false);
                if (v32 != null) { try { return v32.GetValueKind(name); } catch { } }
                return null;
            }
            catch { return null; }
        }

        private static string? ResolveExePath()
        {
            try { var p = Environment.ProcessPath; if (!string.IsNullOrEmpty(p)) return Path.GetFullPath(p); } catch { }
            try { var a = System.Reflection.Assembly.GetEntryAssembly()?.Location; if (!string.IsNullOrEmpty(a)) return Path.GetFullPath(a); } catch { }
            var fallback = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "VoltrisOptimizer.exe");
            if (File.Exists(fallback)) return fallback;
            return null;
        }
    }
}
