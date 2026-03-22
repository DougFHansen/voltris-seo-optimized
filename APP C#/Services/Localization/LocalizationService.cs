using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace VoltrisOptimizer.Services.Localization
{
    public class LocalizationService
    {
        private CultureInfo _currentCulture;
        private readonly Dictionary<string, string> _ptBrStrings = new();
        private readonly Dictionary<string, string> _enUsStrings = new();

        public event EventHandler CultureChanged;

        public LocalizationService()
        {
            _currentCulture = CultureInfo.CurrentUICulture;
            SeedLanguages();
            App.LoggingService?.LogTrace($"[LOCALIZATION] Serviço inicializado. Idioma atual: {_currentCulture.Name}");
        }

        public CultureInfo CurrentCulture
        {
            get => _currentCulture;
            set
            {
                if (_currentCulture.Name != value.Name)
                {
                    App.LoggingService?.LogInfo($"[LOCALIZATION] Mudando idioma de {_currentCulture.Name} para {value.Name}");
                    _currentCulture = value;
                    CultureChanged?.Invoke(this, EventArgs.Empty);
                }
            }
        }

        public string GetString(string key)
        {
            if (_currentCulture.Name.StartsWith("pt"))
            {
                return _ptBrStrings.TryGetValue(key, out var ptVal) ? ptVal : key;
            }
            return _enUsStrings.TryGetValue(key, out var enVal) ? enVal : key;
        }

        private void SeedLanguages()
        {
            // Portuguese (Default)
            _ptBrStrings["APP_TITLE"] = "Voltris Optimizer";
            _ptBrStrings["GAMER_MODE_ON"] = "Ativado";
            _ptBrStrings["GAMER_MODE_OFF"] = "Desativado";
            _ptBrStrings["START_SCAN"] = "Iniciar Varredura";
            _ptBrStrings["CLEANING"] = "Limpando...";
            _ptBrStrings["OPTIMIZATION_APPLIED"] = "Otimização Aplicada";
            _ptBrStrings["NETWORK_STABILIZED"] = "Rede Estabilizada";
            _ptBrStrings["RAM_CLEANED"] = "RAM Liberada";
            _ptBrStrings["SYSTEM_HEALTH"] = "Saúde do Sistema";
            _ptBrStrings["PREMIUM_FEATURES"] = "Recursos Premium";
            _ptBrStrings["ID_ERROR_LOADING"] = "Erro ao carregar recomendações. Tente novamente.";
            _ptBrStrings["ID_TIMEOUT"] = "Tempo limite excedido. Tente novamente.";
            _ptBrStrings["ID_RECS_LOADED"] = "Recomendações carregadas";
            _ptBrStrings["ID_APPLYING_SAFE"] = "Aplicando ações seguras...";
            _ptBrStrings["ID_SAFE_APPLIED"] = "ações SAFE aplicadas";
            _ptBrStrings["ID_SAFE_NONE"] = "Nenhuma ação SAFE disponível";
            _ptBrStrings["ID_READY"] = "Sistema pronto";

            // English
            _enUsStrings["APP_TITLE"] = "Voltris Optimizer";
            _enUsStrings["GAMER_MODE_ON"] = "Gamer Mode Enabled";
            _enUsStrings["GAMER_MODE_OFF"] = "Gamer Mode Disabled";
            _enUsStrings["START_SCAN"] = "Start Scan";
            _enUsStrings["CLEANING"] = "Cleaning...";
            _enUsStrings["OPTIMIZATION_APPLIED"] = "Optimization Applied";
            _enUsStrings["NETWORK_STABILIZED"] = "Network Stabilized";
            _enUsStrings["RAM_CLEANED"] = "RAM Freed";
            _enUsStrings["SYSTEM_HEALTH"] = "System Health";
            _enUsStrings["PREMIUM_FEATURES"] = "Premium Features";
            _enUsStrings["ID_ERROR_LOADING"] = "Error loading recommendations. Please try again.";
            _enUsStrings["ID_TIMEOUT"] = "Operation timed out. Please try again.";
            _enUsStrings["ID_RECS_LOADED"] = "Recommendations loaded";
            _enUsStrings["ID_APPLYING_SAFE"] = "Applying safe actions...";
            _enUsStrings["ID_SAFE_APPLIED"] = "SAFE actions applied";
            _enUsStrings["ID_SAFE_NONE"] = "No SAFE actions available";
            _enUsStrings["ID_READY"] = "System ready";
        }
    }
}
