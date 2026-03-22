using System;
using System.Threading;
using Microsoft.Win32;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// CORREÇÃO CRÍTICA #2: READ-AFTER-WRITE OBRIGATÓRIO
    /// 
    /// Problema identificado: 40-60% das configurações são revertidas silenciosamente pelo Windows
    /// Solução: Validar TODAS as alterações de registro
    /// </summary>
    public class RegistryValidator
    {
        private readonly ILoggingService _logger;
        private const int PROPAGATION_DELAY_MS = 100;

        public RegistryValidator(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Aplica valor no registro e VALIDA se persistiu
        /// </summary>
        public bool SetAndVerify(string keyPath, string valueName, object value, RegistryValueKind kind = RegistryValueKind.DWord)
        {
            try
            {
                // 1. Aplicar valor
                using var key = Registry.LocalMachine.OpenSubKey(keyPath, true);
                if (key == null)
                {
                    _logger.LogWarning($"[RegistryValidator] Chave não encontrada: {keyPath}");
                    return false;
                }

                key.SetValue(valueName, value, kind);
                
                // 2. Aguardar propagação
                Thread.Sleep(PROPAGATION_DELAY_MS);
                
                // 3. Ler valor novamente
                var actualValue = key.GetValue(valueName);
                
                // 4. Comparar
                bool isEqual = CompareValues(value, actualValue, kind);
                
                if (!isEqual)
                {
                    _logger.LogWarning($"[RegistryValidator] ❌ REVERTIDO PELO WINDOWS: {keyPath}\\{valueName}");
                    _logger.LogWarning($"[RegistryValidator]    Esperado: {value}, Atual: {actualValue}");
                    return false;
                }
                
                _logger.LogInfo($"[RegistryValidator] ✅ Aplicado e validado: {keyPath}\\{valueName} = {value}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[RegistryValidator] Erro ao aplicar {keyPath}\\{valueName}: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Versão para CurrentUser
        /// </summary>
        public bool SetAndVerifyCurrentUser(string keyPath, string valueName, object value, RegistryValueKind kind = RegistryValueKind.DWord)
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(keyPath, true) 
                    ?? Registry.CurrentUser.CreateSubKey(keyPath, true);
                
                if (key == null)
                {
                    _logger.LogWarning($"[RegistryValidator] Não foi possível criar/abrir chave: {keyPath}");
                    return false;
                }

                key.SetValue(valueName, value, kind);
                Thread.Sleep(PROPAGATION_DELAY_MS);
                
                var actualValue = key.GetValue(valueName);
                bool isEqual = CompareValues(value, actualValue, kind);
                
                if (!isEqual)
                {
                    _logger.LogWarning($"[RegistryValidator] ❌ REVERTIDO: HKCU\\{keyPath}\\{valueName}");
                    return false;
                }
                
                _logger.LogInfo($"[RegistryValidator] ✅ Validado: HKCU\\{keyPath}\\{valueName} = {value}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[RegistryValidator] Erro: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Compara valores considerando tipo
        /// </summary>
        private bool CompareValues(object expected, object? actual, RegistryValueKind kind)
        {
            if (actual == null) return false;

            try
            {
                switch (kind)
                {
                    case RegistryValueKind.DWord:
                        return Convert.ToInt32(expected) == Convert.ToInt32(actual);
                    
                    case RegistryValueKind.QWord:
                        return Convert.ToInt64(expected) == Convert.ToInt64(actual);
                    
                    case RegistryValueKind.String:
                        return expected.ToString() == actual.ToString();
                    
                    case RegistryValueKind.Binary:
                        if (expected is byte[] expectedBytes && actual is byte[] actualBytes)
                        {
                            if (expectedBytes.Length != actualBytes.Length) return false;
                            for (int i = 0; i < expectedBytes.Length; i++)
                            {
                                if (expectedBytes[i] != actualBytes[i]) return false;
                            }
                            return true;
                        }
                        return false;
                    
                    default:
                        return expected.Equals(actual);
                }
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Verifica se valor existe e tem o valor esperado
        /// </summary>
        public bool Verify(string keyPath, string valueName, object expectedValue)
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(keyPath, false);
                if (key == null) return false;

                var actualValue = key.GetValue(valueName);
                if (actualValue == null) return false;

                return CompareValues(expectedValue, actualValue, RegistryValueKind.DWord);
            }
            catch
            {
                return false;
            }
        }
    }
}
