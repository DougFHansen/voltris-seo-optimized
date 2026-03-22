using System;
using System.Collections.Generic;
using System.Management;
using System.Threading.Tasks;
using System.Linq;
using System.Runtime.ExceptionServices;
using System.Security;
using System.Threading;

namespace VoltrisOptimizer.Utils
{
    /// <summary>
    /// Versão blindada de objeto WMI que não mantém conexão viva
    /// </summary>
    public class WmiObject
    {
        private readonly Dictionary<string, object?> _properties = new(StringComparer.OrdinalIgnoreCase);

        public WmiObject(ManagementObject source)
        {
            if (source == null) return;
            
            try
            {
                // Tenta capturar todas as propriedades enquanto o objeto está vivo
                foreach (PropertyData prop in source.Properties)
                {
                    try
                    {
                        if (prop != null)
                        {
                            _properties[prop.Name] = prop.Value;
                        }
                    }
                    catch
                    {
                        // Algumas propriedades podem falhar (ex: DeviceID em alguns drivers)
                    }
                }
            }
            catch
            {
                // Erro ao acessar a coleção de propriedades em si
            }
        }

        public object? this[string propertyName]
        {
            get
            {
                _properties.TryGetValue(propertyName, out var value);
                return value;
            }
        }

        public IEnumerable<string> PropertyNames => _properties.Keys;
        
        public T GetValue<T>(string propertyName, T defaultValue = default)
        {
            var val = this[propertyName];
            if (val == null) return defaultValue;
            try
            {
                return (T)Convert.ChangeType(val, typeof(T));
            }
            catch
            {
                return defaultValue;
            }
        }
    }

    /// <summary>
    /// Helper robusto para consultas WMI com proteção contra travamentos (Hang Protection)
    /// </summary>
    public static class WmiHelper
    {
        private static readonly TimeSpan DefaultTimeout = TimeSpan.FromSeconds(10);
        private static readonly SemaphoreSlim _globalWmiLock = new(1, 1);

        /// <summary>
        /// Executa uma query WMI de forma segura com timeout e snapshot imediato.
        /// Protege contra COM Access Violations e ObjectDisposedException.
        /// </summary>
        [HandleProcessCorruptedStateExceptions]
        public static async Task<IEnumerable<WmiObject>> QuerySafeAsync(string query, string scope = "root\\CIMV2", TimeSpan? timeout = null)
        {
            var actualTimeout = timeout ?? DefaultTimeout;
            
            try
            {
                // Serialização global de WMI para evitar conflitos de driver/COM
                var task = Task.Run(async () =>
                {
                    if (!await _globalWmiLock.WaitAsync(actualTimeout))
                    {
                        App.LoggingService?.LogWarning($"[WMI Global Lock Timeout] Query: {query}");
                        return new List<WmiObject>();
                    }

                    try
                    {
                        var results = new List<WmiObject>();
                        try
                        {
                            using var searcher = new ManagementObjectSearcher(scope, query);
                            searcher.Options.ReturnImmediately = true;
                            searcher.Options.Rewindable = false;
                            
                            using var collection = searcher.Get();
                            foreach (ManagementObject obj in collection)
                            {
                                try
                                {
                                    results.Add(new WmiObject(obj));
                                }
                                finally
                                {
                                    try { obj.Dispose(); } catch { }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            App.LoggingService?.LogError($"[WMI Error] Query: {query} | Error: {ex.Message}", ex);
                        }
                        return results;
                    }
                    finally
                    {
                        _globalWmiLock.Release();
                    }
                });

                // ✅ CORREÇÃO: Usar WaitAsync em vez de Wait() + Result
                if (await Task.WhenAny(task, Task.Delay(actualTimeout)) == task)
                {
                    return await task;
                }

                App.LoggingService?.LogWarning($"[WMI Timeout] Query: {query} (Wait Limit {actualTimeout.TotalSeconds}s)");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[Wmi Critical Error] {query}: {ex.Message}", ex);
            }
            
            return Enumerable.Empty<WmiObject>();
        }

        /// <summary>
        /// Wrapper síncrono para QuerySafeAsync (para compatibilidade com código legado)
        /// </summary>
        public static IEnumerable<WmiObject> QuerySafe(string query, string scope = "root\\CIMV2", TimeSpan? timeout = null)
        {
            return QuerySafeAsync(query, scope, timeout).GetAwaiter().GetResult();
        }

        /// <summary>
        /// Retorna o primeiro resultado de uma query de forma segura.
        /// </summary>
        public static WmiObject? QueryFirstSafe(string query, string scope = "root\\CIMV2", TimeSpan? timeout = null)
        {
            return QuerySafe(query, scope, timeout).FirstOrDefault();
        }

        /// <summary>
        /// Helper para facilitar a transição de código antigo
        /// </summary>
        public static T? GetPropertySafe<T>(this WmiObject obj, string propertyName)
        {
            return obj.GetValue<T>(propertyName);
        }
    }
}
