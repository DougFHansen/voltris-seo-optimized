using System;
using Microsoft.Win32;
using VoltrisOptimizer.Helpers;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Gerenciador centralizado para otimizações da barra de tarefas
    /// Controla: Widgets, Copilot, Chat, Task View, Search, News and Interests
    /// Implementa sistema de memória de estado para restauração precisa
    /// </summary>
    public class TaskbarOptimizationManager
    {
        private readonly ILoggingService _logger;
        private readonly WindowsShellControlService _shellControl;
        private readonly bool _isWindows11;
        
        // Estados originais capturados
        private TaskbarState? _originalState;
        private bool _statesCaptured = false;

        public TaskbarOptimizationManager(ILoggingService logger, WindowsShellControlService shellControl)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _shellControl = shellControl ?? throw new ArgumentNullException(nameof(shellControl));
            _isWindows11 = WindowsCompatibilityHelper.IsWindows11();
        }

        /// <summary>
        /// Captura o estado atual de todos os elementos da taskbar
        /// </summary>
        public void CaptureCurrentState()
        {
            try
            {
                _logger.LogInfo("[TaskbarOptimization] 📸 Capturando estado atual da barra de tarefas...");
                
                _originalState = new TaskbarState
                {
                    // News and Interests / Weather Widget
                    NewsAndInterests = GetNewsAndInterestsState(),
                    
                    // Widgets (Windows 11)
                    Widgets = GetWidgetsState(),
                    
                    // Search Highlights
                    SearchHighlights = GetSearchHighlightsState(),
                    
                    // Task View Button
                    TaskView = GetTaskViewState(),
                    
                    // Chat / Teams (Windows 11)
                    Chat = GetChatState(),
                    
                    // Copilot Button (Windows 11)
                    Copilot = GetCopilotState(),
                    
                    // Search Box Mode
                    SearchBox = GetSearchBoxState()
                };
                
                _statesCaptured = true;
                
                _logger.LogInfo($"[TaskbarOptimization] Estado capturado:");
                _logger.LogInfo($"  • News/Weather: {_originalState.NewsAndInterests ?? -1}");
                _logger.LogInfo($"  • Widgets: {_originalState.Widgets ?? -1}");
                _logger.LogInfo($"  • Search Highlights: {_originalState.SearchHighlights ?? -1}");
                _logger.LogInfo($"  • Task View: {_originalState.TaskView ?? -1}");
                _logger.LogInfo($"  • Chat: {_originalState.Chat ?? -1}");
                _logger.LogInfo($"  • Copilot: {_originalState.Copilot ?? -1}");
                _logger.LogInfo($"  • Search Box: {_originalState.SearchBox ?? -1}");
                
                _logger.LogSuccess("[TaskbarOptimization] ✅ Estados capturados com sucesso");
            }
            catch (Exception ex)
            {
                _logger.LogError("[TaskbarOptimization] Erro ao capturar estados", ex);
            }
        }

        /// <summary>
        /// Aplica otimizações para Modo Gamer (desativa elementos desnecessários)
        /// </summary>
        public void ApplyGamingOptimizations()
        {
            if (!_statesCaptured)
            {
                _logger.LogWarning("[TaskbarOptimization] Estados não capturados! Capturando agora...");
                CaptureCurrentState();
            }

            try
            {
                _logger.LogInfo("[TaskbarOptimization] 🎮 Aplicando otimizações para Modo Gamer...");
                _logger.LogInfo($"[TaskbarOptimization] Sistema: {(_isWindows11 ? "Windows 11" : "Windows 10")}");
                
                // Desativar News and Interests (Windows 10 APENAS)
                // VALORES CORRETOS: 0 = Habilitado, 1 = Ícone apenas, 2 = DESABILITADO
                // IMPORTANTE: SetNewsAndInterestsState já reinicia o Explorer automaticamente
                if (!_isWindows11)
                {
                    _logger.LogInfo("[TaskbarOptimization] 📰 Desativando News and Interests (Windows 10)...");
                    SetNewsAndInterestsState(2); // 2 = DESABILITADO no Windows 10 (já reinicia Explorer)
                    _logger.LogSuccess("[TaskbarOptimization] ✓ News and Interests desativado (Win10)");
                    
                    // Search Highlights também no Windows 10
                    _logger.LogInfo("[TaskbarOptimization] 🔍 Desativando Search Highlights (Windows 10)...");
                    SetSearchHighlightsState(0); // 0 = Desativado
                    _logger.LogSuccess("[TaskbarOptimization] ✓ Search Highlights desativado (Win10)");
                }
                else
                {
                    // Windows 11: Desativar Widgets, Search Highlights, Chat, Copilot
                    _logger.LogInfo("[TaskbarOptimization] 🧩 Desativando Widgets (Windows 11)...");
                    SetWidgetsState(0); // 0 = Oculto
                    _logger.LogSuccess("[TaskbarOptimization] ✓ Widgets ocultos (Win11)");
                    
                    _logger.LogInfo("[TaskbarOptimization] 🔍 Desativando Search Highlights (Windows 11)...");
                    SetSearchHighlightsState(0); // 0 = Desativado
                    _logger.LogSuccess("[TaskbarOptimization] ✓ Search Highlights desativado (Win11)");
                    
                    _logger.LogInfo("[TaskbarOptimization] 💬 Desativando Chat/Teams (Windows 11)...");
                    SetChatState(0); // 0 = Oculto
                    _logger.LogSuccess("[TaskbarOptimization] ✓ Chat oculto");
                    
                    _logger.LogInfo("[TaskbarOptimization] 🤖 Desativando Copilot (Windows 11)...");
                    SetCopilotState(0); // 0 = Oculto
                    _logger.LogSuccess("[TaskbarOptimization] ✓ Copilot oculto");
                    
                    // Aplicar mudanças no shell - Windows 11 usa ShellExperienceHost restart
                    _logger.LogInfo("[TaskbarOptimization] 🔄 Aplicando mudanças no shell do Windows 11...");
                    _shellControl.ApplyShellChanges("Taskbar Gaming Mode");
                }
                
                _logger.LogSuccess("[TaskbarOptimization] ✅ Otimizações aplicadas com sucesso");
                _logger.LogInfo("[TaskbarOptimization] ℹ️ As mudanças devem ser visíveis imediatamente na barra de tarefas");
            }
            catch (Exception ex)
            {
                _logger.LogError("[TaskbarOptimization] Erro ao aplicar otimizações", ex);
            }
        }

        /// <summary>
        /// Restaura o estado original da taskbar
        /// INTELIGENTE: Só restaura valores que foram capturados
        /// </summary>
        public void RestoreOriginalState()
        {
            if (!_statesCaptured || _originalState == null)
            {
                _logger.LogWarning("[TaskbarOptimization] Nenhum estado foi capturado, nada a restaurar");
                return;
            }

            try
            {
                _logger.LogInfo("[TaskbarOptimization] 🔄 Restaurando estado original da barra de tarefas...");
                
                // Restaurar News and Interests / Weather Widget
                if (_originalState.NewsAndInterests.HasValue)
                {
                    SetNewsAndInterestsState(_originalState.NewsAndInterests.Value);
                    _logger.LogInfo($"[TaskbarOptimization] ✓ News/Weather restaurado: {_originalState.NewsAndInterests.Value}");
                }
                
                // Restaurar Widgets
                if (_originalState.Widgets.HasValue)
                {
                    SetWidgetsState(_originalState.Widgets.Value);
                    _logger.LogInfo($"[TaskbarOptimization] ✓ Widgets restaurado: {_originalState.Widgets.Value}");
                }
                
                // Restaurar Search Highlights
                if (_originalState.SearchHighlights.HasValue)
                {
                    SetSearchHighlightsState(_originalState.SearchHighlights.Value);
                    _logger.LogInfo($"[TaskbarOptimization] ✓ Search Highlights restaurado: {_originalState.SearchHighlights.Value}");
                }
                
                // Restaurar Task View
                if (_originalState.TaskView.HasValue)
                {
                    SetTaskViewState(_originalState.TaskView.Value);
                    _logger.LogInfo($"[TaskbarOptimization] ✓ Task View restaurado: {_originalState.TaskView.Value}");
                }
                
                // Restaurar Chat
                if (_originalState.Chat.HasValue)
                {
                    SetChatState(_originalState.Chat.Value);
                    _logger.LogInfo($"[TaskbarOptimization] ✓ Chat restaurado: {_originalState.Chat.Value}");
                }
                
                // Restaurar Copilot
                if (_originalState.Copilot.HasValue)
                {
                    SetCopilotState(_originalState.Copilot.Value);
                    _logger.LogInfo($"[TaskbarOptimization] ✓ Copilot restaurado: {_originalState.Copilot.Value}");
                }
                
                // Restaurar Search Box
                if (_originalState.SearchBox.HasValue)
                {
                    SetSearchBoxState(_originalState.SearchBox.Value);
                    _logger.LogInfo($"[TaskbarOptimization] ✓ Search Box restaurado: {_originalState.SearchBox.Value}");
                }
                
                // Aplicar mudanças no shell
                _shellControl.ApplyShellChanges("Taskbar Restore");
                
                // Limpar estados capturados
                _statesCaptured = false;
                _originalState = null;
                
                _logger.LogSuccess("[TaskbarOptimization] ✅ Estado original restaurado com sucesso");
            }
            catch (Exception ex)
            {
                _logger.LogError("[TaskbarOptimization] Erro ao restaurar estado original", ex);
            }
        }

        /// <summary>
        /// Retorna o estado capturado para serialização
        /// </summary>
        public TaskbarState? GetCapturedState() => _originalState;

        /// <summary>
        /// Restaura a partir de um estado serializado
        /// </summary>
        public void RestoreFromState(TaskbarState state)
        {
            if (state == null) return;
            
            _originalState = state;
            _statesCaptured = true;
            RestoreOriginalState();
        }

        #region Registry Operations

        private int? GetNewsAndInterestsState()
        {
            try
            {
                // Windows 10: News and Interests
                // IMPORTANTE: 0 = Habilitado, 1 = Ícone apenas, 2 = Desabilitado
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Feeds");
                if (key != null)
                {
                    var value = key.GetValue("ShellFeedsTaskbarViewMode");
                    if (value != null) return Convert.ToInt32(value);
                }
                
                // Windows 11: Weather Widget NÃO usa TaskbarDa (isso é para Widgets)
                // Windows 11 não tem News & Interests, tem Widgets separado
            }
            catch { }
            return null;
        }

        private void SetNewsAndInterestsState(int state)
        {
            try
            {
                // Windows 10 APENAS: News and Interests
                // VALORES CORRETOS: 0 = Habilitado, 1 = Ícone apenas, 2 = DESABILITADO
                if (!_isWindows11)
                {
                    _logger.LogInfo($"[TaskbarOptimization] 📝 Definindo News/Interests para: {state} (0=Habilitado, 1=Ícone, 2=Desabilitado)");
                    
                    // MÉTODO 1: Tentar via Registry API primeiro (funciona se o app já tem admin)
                    bool registrySuccess = false;
                    try
                    {
                        using (var key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Feeds", true))
                        {
                            if (key != null)
                            {
                                key.SetValue("ShellFeedsTaskbarViewMode", state, RegistryValueKind.DWord);
                                
                                // Verificar se foi aplicado
                                var newValue = key.GetValue("ShellFeedsTaskbarViewMode");
                                if (newValue != null && Convert.ToInt32(newValue) == state)
                                {
                                    _logger.LogSuccess($"[TaskbarOptimization] ✅ News/Interests definido via Registry API: {state}");
                                    registrySuccess = true;
                                }
                            }
                        }
                    }
                    catch (UnauthorizedAccessException)
                    {
                        _logger.LogWarning("[TaskbarOptimization] ⚠️ Registry API negou acesso, tentando método alternativo...");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[TaskbarOptimization] ⚠️ Registry API falhou: {ex.Message}");
                    }
                    
                    // MÉTODO 2: Se Registry API falhou, usar REG.EXE (sem runas - app já deve ter admin)
                    if (!registrySuccess)
                    {
                        try
                        {
                            var psi = new System.Diagnostics.ProcessStartInfo
                            {
                                FileName = "reg.exe",
                                Arguments = $"add \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Feeds\" /v ShellFeedsTaskbarViewMode /t REG_DWORD /d {state} /f",
                                CreateNoWindow = true,
                                UseShellExecute = false,
                                RedirectStandardOutput = true,
                                RedirectStandardError = true
                                // NÃO usar Verb = "runas" - o app já deve estar rodando como admin
                            };
                            
                            _logger.LogInfo("[TaskbarOptimization]   → Executando REG.EXE...");
                            
                            using (var process = System.Diagnostics.Process.Start(psi))
                            {
                                if (process != null)
                                {
                                    string output = process.StandardOutput.ReadToEnd();
                                    string error = process.StandardError.ReadToEnd();
                                    
                                    process.WaitForExit(5000);
                                    
                                    if (process.ExitCode == 0)
                                    {
                                        _logger.LogSuccess($"[TaskbarOptimization] ✅ News/Interests definido via REG.EXE: {state}");
                                        
                                        // Verificar se foi aplicado
                                        try
                                        {
                                            using (var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Feeds"))
                                            {
                                                var newValue = key?.GetValue("ShellFeedsTaskbarViewMode");
                                                _logger.LogInfo($"[TaskbarOptimization]   Verificação: valor atual = {newValue}");
                                            }
                                        }
                                        catch { }
                                    }
                                    else
                                    {
                                        _logger.LogWarning($"[TaskbarOptimization] ⚠️ REG.EXE falhou com código: {process.ExitCode}");
                                        if (!string.IsNullOrEmpty(error))
                                        {
                                            _logger.LogWarning($"[TaskbarOptimization]   Erro: {error}");
                                        }
                                    }
                                }
                            }
                        }
                        catch (Exception regEx)
                        {
                            _logger.LogWarning($"[TaskbarOptimization] ⚠️ Método REG.EXE falhou: {regEx.Message}");
                        }
                    }
                    
                    // MÉTODO 3: CRÍTICO - Forçar restart do Explorer para aplicar mudanças
                    // News & Interests é notoriamente teimoso e requer restart do Explorer
                    _logger.LogInfo("[TaskbarOptimization] 🔄 Forçando restart do Explorer para aplicar News & Interests...");
                    _shellControl.RestartExplorerFallback();
                }
                else
                {
                    _logger.LogInfo("[TaskbarOptimization] ℹ️ Windows 11 detectado - News & Interests não existe (apenas Widgets)");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[TaskbarOptimization] ❌ Erro ao definir News/Weather: {ex.Message}", ex);
            }
        }

        private int? GetWidgetsState()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced");
                var value = key?.GetValue("TaskbarDa");
                return value != null ? Convert.ToInt32(value) : null;
            }
            catch { return null; }
        }

        private void SetWidgetsState(int state)
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (key != null)
                {
                    key.SetValue("TaskbarDa", state, RegistryValueKind.DWord);
                    _logger.LogInfo($"[TaskbarOptimization] Widgets definido: {state}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[TaskbarOptimization] Erro ao definir Widgets: {ex.Message}");
            }
        }

        private int? GetSearchHighlightsState()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\SearchSettings");
                var value = key?.GetValue("IsDynamicSearchBoxEnabled");
                return value != null ? Convert.ToInt32(value) : null;
            }
            catch { return null; }
        }

        private void SetSearchHighlightsState(int state)
        {
            try
            {
                _logger.LogInfo($"[TaskbarOptimization] 📝 Definindo Search Highlights para: {state} (0=Desabilitado, 1=Habilitado)");
                
                using var key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\SearchSettings", true);
                if (key != null)
                {
                    // Ler valor atual
                    var currentValue = key.GetValue("IsDynamicSearchBoxEnabled");
                    _logger.LogInfo($"[TaskbarOptimization]   Valor atual: {currentValue ?? "NULL"}");
                    
                    // Definir novo valor
                    key.SetValue("IsDynamicSearchBoxEnabled", state, RegistryValueKind.DWord);
                    
                    // Verificar se foi aplicado
                    var newValue = key.GetValue("IsDynamicSearchBoxEnabled");
                    _logger.LogInfo($"[TaskbarOptimization]   Novo valor: {newValue}");
                    
                    if (Convert.ToInt32(newValue) == state)
                    {
                        _logger.LogSuccess($"[TaskbarOptimization] ✅ Search Highlights definido com sucesso: {state}");
                    }
                    else
                    {
                        _logger.LogWarning($"[TaskbarOptimization] ⚠️ Valor não foi aplicado corretamente!");
                    }
                }
                else
                {
                    _logger.LogWarning("[TaskbarOptimization] ⚠️ Não foi possível criar/abrir chave do registro");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[TaskbarOptimization] ❌ Erro ao definir Search Highlights: {ex.Message}", ex);
            }
        }

        private int? GetTaskViewState()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced");
                var value = key?.GetValue("ShowTaskViewButton");
                return value != null ? Convert.ToInt32(value) : null;
            }
            catch { return null; }
        }

        private void SetTaskViewState(int state)
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (key != null)
                {
                    key.SetValue("ShowTaskViewButton", state, RegistryValueKind.DWord);
                    _logger.LogInfo($"[TaskbarOptimization] Task View definido: {state}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[TaskbarOptimization] Erro ao definir Task View: {ex.Message}");
            }
        }

        private int? GetChatState()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced");
                var value = key?.GetValue("TaskbarMn");
                return value != null ? Convert.ToInt32(value) : null;
            }
            catch { return null; }
        }

        private void SetChatState(int state)
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (key != null)
                {
                    key.SetValue("TaskbarMn", state, RegistryValueKind.DWord);
                    _logger.LogInfo($"[TaskbarOptimization] Chat definido: {state}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[TaskbarOptimization] Erro ao definir Chat: {ex.Message}");
            }
        }

        private int? GetCopilotState()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced");
                var value = key?.GetValue("ShowCopilotButton");
                return value != null ? Convert.ToInt32(value) : null;
            }
            catch { return null; }
        }

        private void SetCopilotState(int state)
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (key != null)
                {
                    key.SetValue("ShowCopilotButton", state, RegistryValueKind.DWord);
                    _logger.LogInfo($"[TaskbarOptimization] Copilot definido: {state}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[TaskbarOptimization] Erro ao definir Copilot: {ex.Message}");
            }
        }

        private int? GetSearchBoxState()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Search");
                var value = key?.GetValue("SearchboxTaskbarMode");
                return value != null ? Convert.ToInt32(value) : null;
            }
            catch { return null; }
        }

        private void SetSearchBoxState(int state)
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Search", true);
                if (key != null)
                {
                    key.SetValue("SearchboxTaskbarMode", state, RegistryValueKind.DWord);
                    _logger.LogInfo($"[TaskbarOptimization] Search Box definido: {state}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[TaskbarOptimization] Erro ao definir Search Box: {ex.Message}");
            }
        }

        #endregion
    }

    /// <summary>
    /// Estrutura para armazenar o estado da taskbar
    /// </summary>
    public class TaskbarState
    {
        public int? NewsAndInterests { get; set; }
        public int? Widgets { get; set; }
        public int? SearchHighlights { get; set; }
        public int? TaskView { get; set; }
        public int? Chat { get; set; }
        public int? Copilot { get; set; }
        public int? SearchBox { get; set; }
    }
}
