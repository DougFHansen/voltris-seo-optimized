using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Memória centralizada de estado do Modo Gamer.
    /// Registra o estado original de cada configuração antes de qualquer modificação,
    /// garantindo que a restauração seja fiel ao estado pré-ativação.
    /// Política: first-write-wins — o primeiro registro de uma chave não é sobrescrito.
    /// Suporta persistência em disco para recuperação após crash.
    /// </summary>
    public class GamerStateMemory
    {
        private readonly Dictionary<string, object?> _originalStates = new();
        private static readonly string _persistPath = Path.Combine(
            AppDomain.CurrentDomain.BaseDirectory, "gamer_state_memory.json");

        /// <summary>
        /// Registra o estado original de uma configuração.
        /// Se a chave já existir, o valor não é sobrescrito (first-write-wins).
        /// </summary>
        public void Register(string key, object? originalValue)
        {
            if (!_originalStates.ContainsKey(key))
                _originalStates[key] = originalValue;
        }

        /// <summary>
        /// Recupera o estado original registrado para uma chave.
        /// Retorna default(T) se a chave não foi registrada.
        /// </summary>
        public T? GetOriginal<T>(string key)
        {
            if (_originalStates.TryGetValue(key, out var value) && value is T typed)
                return typed;

            // Suporte a deserialização JSON: JsonElement → tipo primitivo
            if (_originalStates.TryGetValue(key, out var raw) && raw is JsonElement element)
            {
                try
                {
                    var converted = JsonSerializer.Deserialize<T>(element.GetRawText());
                    if (converted != null) return converted;
                }
                catch { }
            }

            return default;
        }

        /// <summary>
        /// Retorna true se a chave foi registrada (independente do valor).
        /// </summary>
        public bool WasModifiedByGamerMode(string key) => _originalStates.ContainsKey(key);

        /// <summary>
        /// Retorna true se há estados registrados aguardando restauração.
        /// </summary>
        public bool HasPendingRestoration() => _originalStates.Count > 0;

        /// <summary>
        /// Limpa todos os estados registrados. Deve ser chamado no início de cada sessão.
        /// </summary>
        public void Clear() => _originalStates.Clear();

        /// <summary>
        /// Exporta o dicionário interno como snapshot serializável para persistência.
        /// </summary>
        public Dictionary<string, object?> ExportSnapshot() => new(_originalStates);

        /// <summary>
        /// Importa um snapshot previamente exportado, restaurando o estado em memória.
        /// Usado na recuperação após crash.
        /// </summary>
        public void ImportSnapshot(Dictionary<string, object?>? snapshot)
        {
            _originalStates.Clear();
            if (snapshot != null)
            {
                foreach (var kvp in snapshot)
                    _originalStates[kvp.Key] = kvp.Value;
            }
        }

        /// <summary>
        /// Persiste o estado atual em disco (JSON) para recuperação após crash.
        /// </summary>
        public async Task SaveToDiskAsync()
        {
            try
            {
                if (_originalStates.Count == 0) return;

                var json = JsonSerializer.Serialize(_originalStates, new JsonSerializerOptions
                {
                    WriteIndented = false
                });
                await File.WriteAllTextAsync(_persistPath, json);
            }
            catch
            {
                // Falha silenciosa — não deve impedir o fluxo principal
            }
        }

        /// <summary>
        /// Carrega o estado persistido do disco. Retorna true se havia dados salvos.
        /// </summary>
        public async Task<bool> LoadFromDiskAsync()
        {
            try
            {
                if (!File.Exists(_persistPath)) return false;

                var json = await File.ReadAllTextAsync(_persistPath);
                var snapshot = JsonSerializer.Deserialize<Dictionary<string, object?>>(json);
                if (snapshot != null && snapshot.Count > 0)
                {
                    ImportSnapshot(snapshot);
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Remove o arquivo de persistência do disco (chamado após restauração bem-sucedida).
        /// </summary>
        public void ClearDiskState()
        {
            try
            {
                if (File.Exists(_persistPath))
                    File.Delete(_persistPath);
            }
            catch { }
        }
    }
}
