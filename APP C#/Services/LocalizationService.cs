using System;
using System.Collections.Generic;
using System.Globalization;
using System.Resources;
using System.Windows;

namespace VoltrisOptimizer.Services
{
    public enum Language
    {
        Portuguese,
        Spanish,
        English
    }

    public class LocalizationService
    {
        private static LocalizationService? _instance;
        private Language _currentLanguage;
        private Dictionary<string, Dictionary<Language, string>> _strings = null!;

        public static LocalizationService Instance => _instance ??= new LocalizationService();

        public event EventHandler? LanguageChanged;

        public Language CurrentLanguage
        {
            get => _currentLanguage;
            set
            {
                if (_currentLanguage != value)
                {
                    _currentLanguage = value;
                    LoadStrings();
                    LanguageChanged?.Invoke(this, EventArgs.Empty);
                }
            }
        }

        private LocalizationService()
        {
            _currentLanguage = Language.Portuguese;
            InitializeStrings();
            LoadStrings();
        }

        private void InitializeStrings()
        {
            _strings = new Dictionary<string, Dictionary<Language, string>>
            {
                // Menu Principal
                ["Dashboard"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Dashboard",
                    [Language.Spanish] = "Panel de Control",
                    [Language.English] = "Dashboard"
                },
                ["Cleanup"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Limpeza",
                    [Language.Spanish] = "Limpieza",
                    [Language.English] = "Cleanup"
                },
                ["Performance"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Desempenho",
                    [Language.Spanish] = "Rendimiento",
                    [Language.English] = "Performance"
                },
                ["Network"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Rede",
                    [Language.Spanish] = "Red",
                    [Language.English] = "Network"
                },
                ["System"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Sistema",
                    [Language.Spanish] = "Sistema",
                    [Language.English] = "System"
                },
                ["Gamer"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Gamer",
                    [Language.Spanish] = "Gamer",
                    [Language.English] = "Gamer"
                },
                ["Format"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Formatação",
                    [Language.Spanish] = "Formateo",
                    [Language.English] = "Format"
                },
                ["Logs"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Logs",
                    [Language.Spanish] = "Registros",
                    [Language.English] = "Logs"
                },
                ["StatusReady"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Status: Pronto",
                    [Language.Spanish] = "Estado: Listo",
                    [Language.English] = "Status: Ready"
                },
                ["Ready"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Pronto",
                    [Language.Spanish] = "Listo",
                    [Language.English] = "Ready"
                },
                // Configurações
                ["Settings"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Configurações",
                    [Language.Spanish] = "Configuración",
                    [Language.English] = "Settings"
                },
                ["Language"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Idioma",
                    [Language.Spanish] = "Idioma",
                    [Language.English] = "Language"
                },
                ["StartWithWindows"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Iniciar com o Windows",
                    [Language.Spanish] = "Iniciar con Windows",
                    [Language.English] = "Start with Windows"
                },
                ["MinimizeToTray"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Minimizar para a bandeja",
                    [Language.Spanish] = "Minimizar a la bandeja",
                    [Language.English] = "Minimize to tray"
                },
                ["StartMinimized"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Iniciar minimizado",
                    [Language.Spanish] = "Iniciar minimizado",
                    [Language.English] = "Start minimized"
                },
                ["VoiceControlEnabled"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Ativar Controle de Voz",
                    [Language.Spanish] = "Activar Control de Voz",
                    [Language.English] = "Enable Voice Control"
                },
                ["StartNormal"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Iniciar normalmente",
                    [Language.Spanish] = "Iniciar normalmente",
                    [Language.English] = "Start normally"
                },
                ["AdvancedSettings"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Configurações Avançadas",
                    [Language.Spanish] = "Configuración Avanzada",
                    [Language.English] = "Advanced Settings"
                },
                ["CloseToTray"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Fechar para a bandeja",
                    [Language.Spanish] = "Cerrar a la bandeja",
                    [Language.English] = "Close to tray"
                },
                ["Portuguese"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Português",
                    [Language.Spanish] = "Portugués",
                    [Language.English] = "Portuguese"
                },
                ["Spanish"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Espanhol",
                    [Language.Spanish] = "Español",
                    [Language.English] = "Spanish"
                },
                ["English"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Inglês",
                    [Language.Spanish] = "Inglés",
                    [Language.English] = "English"
                },
                ["SelectLanguage"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Selecione o idioma",
                    [Language.Spanish] = "Seleccione el idioma",
                    [Language.English] = "Select language"
                },
                ["StartWithWindowsQuestion"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Deseja iniciar o Voltris Optimizer com o Windows?",
                    [Language.Spanish] = "¿Desea iniciar Voltris Optimizer con Windows?",
                    [Language.English] = "Do you want to start Voltris Optimizer with Windows?"
                },
                ["HowToStart"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Como deseja iniciar?",
                    [Language.Spanish] = "¿Cómo desea iniciar?",
                    [Language.English] = "How do you want to start?"
                },
                ["Yes"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Sim",
                    [Language.Spanish] = "Sí",
                    [Language.English] = "Yes"
                },
                ["No"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Não",
                    [Language.Spanish] = "No",
                    [Language.English] = "No"
                },
                ["Cancel"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Cancelar",
                    [Language.Spanish] = "Cancelar",
                    [Language.English] = "Cancel"
                },
                ["Save"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Salvar",
                    [Language.Spanish] = "Guardar",
                    [Language.English] = "Save"
                },
                ["Close"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Fechar",
                    [Language.Spanish] = "Cerrar",
                    [Language.English] = "Close"
                },
                ["Minimize"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Minimizar",
                    [Language.Spanish] = "Minimizar",
                    [Language.English] = "Minimize"
                },
                ["Maximize"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Maximizar",
                    [Language.Spanish] = "Maximizar",
                    [Language.English] = "Maximize"
                },
                ["Restore"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Restaurar",
                    [Language.Spanish] = "Restaurar",
                    [Language.English] = "Restore"
                },
                ["Show"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Mostrar",
                    [Language.Spanish] = "Mostrar",
                    [Language.English] = "Show"
                },
                ["Exit"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Sair",
                    [Language.Spanish] = "Salir",
                    [Language.English] = "Exit"
                },
                ["OK"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "OK",
                    [Language.Spanish] = "OK",
                    [Language.English] = "OK"
                },
                ["Cancel"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Cancelar",
                    [Language.Spanish] = "Cancelar",
                    [Language.English] = "Cancel"
                },
                // Perfis Inteligentes
                ["IntelligentProfile"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Perfil Inteligente",
                    [Language.Spanish] = "Perfil Inteligente",
                    [Language.English] = "Intelligent Profile"
                },
                ["IntelligentProfileDesc"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "Define como o motor de IA prioriza as otimizações do sistema",
                    [Language.Spanish] = "Define cómo el motor de IA prioriza las optimizaciones del sistema",
                    [Language.English] = "Defines how the AI engine prioritizes system optimizations"
                },
                ["ProfileGamerCompetitive"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "🎮 Gamer Competitivo",
                    [Language.Spanish] = "🎮 Gamer Competitivo",
                    [Language.English] = "🎮 Gamer Competitive"
                },
                ["ProfileGamerSinglePlayer"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "🎯 Gamer Single Player",
                    [Language.Spanish] = "🎯 Gamer Un jugador",
                    [Language.English] = "🎯 SinglePlayer Gamer"
                },
                ["ProfileWorkOffice"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "💼 Trabalho / Office",
                    [Language.Spanish] = "💼 Trabajo / Oficina",
                    [Language.English] = "💼 Work / Office"
                },
                ["ProfileCreativeVideoEditing"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "🎬 Vídeo / Design",
                    [Language.Spanish] = "🎬 Video / Diseño",
                    [Language.English] = "🎬 Video / Design"
                },
                ["ProfileDeveloperProgramming"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "💻 Programação / Dev",
                    [Language.Spanish] = "💻 Programación / Desarrollo",
                    [Language.English] = "💻 Programming / Dev"
                },
                ["ProfileGeneralBalanced"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "⚖️ Uso Geral",
                    [Language.Spanish] = "⚖️ Uso General",
                    [Language.English] = "⚖️ General Use"
                },
                ["ProfileEnterpriseSecure"] = new Dictionary<Language, string>
                {
                    [Language.Portuguese] = "🏢 Enterprise Seguro",
                    [Language.Spanish] = "🏢 Enterprise Seguro",
                    [Language.English] = "🏢 Secure Enterprise"
                }
            };
        }

        private void LoadStrings()
        {
            // Strings já estão carregadas no dicionário
        }

        public string GetString(string key)
        {
            if (_strings.TryGetValue(key, out var languageDict))
            {
                if (languageDict.TryGetValue(_currentLanguage, out var value))
                {
                    return value;
                }
            }
            return key; // Retorna a chave se não encontrar
        }

        public void SetLanguage(Language language)
        {
            CurrentLanguage = language;
        }

        public string GetLanguageName(Language language)
        {
            return language switch
            {
                Language.Portuguese => GetString("Portuguese"),
                Language.Spanish => GetString("Spanish"),
                Language.English => GetString("English"),
                _ => "Unknown"
            };
        }
    }
}

