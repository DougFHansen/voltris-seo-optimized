using System;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Services.Gamer.Implementation;
using VoltrisOptimizer.Services.Gamer.Models;

namespace VoltrisOptimizer.Services.Gamer.OptimizationModules
{
    /// <summary>
    /// Desativa animações e efeitos visuais do Windows durante o Modo Gamer.
    /// Reduz uso de GPU e CPU com renderização de UI desnecessária.
    /// </summary>
    public class VisualEffectsOptimizer : IGamerOptimizationModule
    {
        private const string VISUAL_FX_KEY = @"Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects";
        private const string PERSONALIZE_KEY = @"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize";
        private const string STATE_VISUAL_FX = "visual.visualFxSetting";
        private const string STATE_ANIMATION = "visual.animationEnabled";
        private const string STATE_TRANSPARENCY = "visual.transparencyEnabled";

        // SystemParametersInfo constants
        private const uint SPI_GETANIMATION = 0x0048;
        private const uint SPI_SETANIMATION = 0x0049;
        private const uint SPIF_SENDCHANGE = 0x0002;

        [StructLayout(LayoutKind.Sequential)]
        private struct ANIMATIONINFO
        {
            public uint cbSize;
            public int iMinAnimate; // 0 = desativado, 1 = ativado
        }

        [DllImport("user32.dll", SetLastError = true)]
        private static extern bool SystemParametersInfo(uint uiAction, uint uiParam, ref ANIMATIONINFO pvParam, uint fWinIni);

        private readonly GamerStateMemory _stateMemory;
        private VisualOptimizationLevel _level = VisualOptimizationLevel.Balanced;

        public string Name => "Visual Effects Optimizer";
        public string Description => "Desativa animações e efeitos visuais para liberar GPU e CPU";

        public VisualEffectsOptimizer(GamerStateMemory stateMemory)
        {
            _stateMemory = stateMemory;
        }

        /// <summary>
        /// Define o nível de otimização antes de chamar ApplyAsync.
        /// </summary>
        public void SetLevel(VisualOptimizationLevel level) => _level = level;

        public Task<ModuleApplyResult> ApplyAsync(GamerSessionContext ctx, CancellationToken ct = default)
        {
            var result = new ModuleApplyResult();
            var changes = new System.Collections.Generic.List<string>();

            try
            {
                var level = _level;

                if (level == VisualOptimizationLevel.None)
                {
                    ctx.Logger.LogInfo("[VisualFX] VisualLevel = None, nenhuma alteração aplicada.");
                    result.Success = true;
                    return Task.FromResult(result);
                }

                ctx.Logger.LogInfo($"[VisualFX] Aplicando otimizações visuais (nível: {level})...");

                // 1. Backup e desativar animações de janela (ambos os níveis)
                var animInfo = new ANIMATIONINFO { cbSize = (uint)Marshal.SizeOf<ANIMATIONINFO>() };
                if (SystemParametersInfo(SPI_GETANIMATION, animInfo.cbSize, ref animInfo, 0))
                {
                    _stateMemory.Register(STATE_ANIMATION, animInfo.iMinAnimate);
                    animInfo.iMinAnimate = 0;
                    if (SystemParametersInfo(SPI_SETANIMATION, animInfo.cbSize, ref animInfo, SPIF_SENDCHANGE))
                    {
                        changes.Add("Animações de janela desativadas");
                        ctx.Logger.LogSuccess("[VisualFX] ✅ Animações de janela desativadas.");
                    }
                    else
                    {
                        ctx.Logger.LogError("[VisualFX] ❌ Falha ao desativar animações via SystemParametersInfo.");
                    }
                }

                if (level == VisualOptimizationLevel.MaximumPerformance)
                {
                    // 2. VisualFXSetting = 2 (melhor desempenho)
                    using (var key = Registry.CurrentUser.OpenSubKey(VISUAL_FX_KEY, writable: true)
                                  ?? Registry.CurrentUser.CreateSubKey(VISUAL_FX_KEY))
                    {
                        if (key != null)
                        {
                            var current = key.GetValue("VisualFXSetting");
                            _stateMemory.Register(STATE_VISUAL_FX, current is int v ? v : 0);
                            key.SetValue("VisualFXSetting", 2, RegistryValueKind.DWord);
                            changes.Add("VisualFXSetting = 2 (máximo desempenho)");
                            ctx.Logger.LogSuccess("[VisualFX] ✅ VisualFXSetting definido para máximo desempenho.");
                        }
                    }

                    // 3. Desativar transparência
                    using (var key = Registry.CurrentUser.OpenSubKey(PERSONALIZE_KEY, writable: true)
                                  ?? Registry.CurrentUser.CreateSubKey(PERSONALIZE_KEY))
                    {
                        if (key != null)
                        {
                            var current = key.GetValue("EnableTransparency");
                            _stateMemory.Register(STATE_TRANSPARENCY, current is int t ? t : 1);
                            key.SetValue("EnableTransparency", 0, RegistryValueKind.DWord);
                            changes.Add("Transparência do sistema desativada");
                            ctx.Logger.LogSuccess("[VisualFX] ✅ Transparência do sistema desativada.");
                        }
                    }
                }

                result.Success = true;
                result.ChangesApplied = changes.Count;
                result.AppliedChanges = changes.ToArray();
                ctx.Logger.LogSuccess($"[VisualFX] {changes.Count} otimizações visuais aplicadas.");
            }
            catch (Exception ex)
            {
                ctx.Logger.LogError($"[VisualFX] ❌ Erro ao aplicar efeitos visuais: {ex.Message}", ex);
                result.Success = false;
                result.ErrorMessage = ex.Message;
            }

            return Task.FromResult(result);
        }

        public Task<ModuleRevertResult> RevertAsync(GamerSessionContext ctx, CancellationToken ct = default)
        {
            var result = new ModuleRevertResult();
            var changes = new System.Collections.Generic.List<string>();

            try
            {
                ctx.Logger.LogInfo("[VisualFX] Restaurando efeitos visuais...");

                // 1. Restaurar animações
                if (_stateMemory.WasModifiedByGamerMode(STATE_ANIMATION))
                {
                    int originalAnim = _stateMemory.GetOriginal<int>(STATE_ANIMATION);
                    ctx.Logger.LogInfo($"[VisualFX] Restaurando animações para iMinAnimate = {originalAnim}...");
                    var animInfo = new ANIMATIONINFO
                    {
                        cbSize = (uint)Marshal.SizeOf<ANIMATIONINFO>(),
                        iMinAnimate = originalAnim
                    };
                    if (SystemParametersInfo(SPI_SETANIMATION, animInfo.cbSize, ref animInfo, SPIF_SENDCHANGE))
                    {
                        changes.Add($"Animações restauradas (iMinAnimate = {originalAnim})");
                        ctx.Logger.LogSuccess("[VisualFX] ✅ Animações restauradas.");
                    }
                }

                // 2. Restaurar VisualFXSetting
                if (_stateMemory.WasModifiedByGamerMode(STATE_VISUAL_FX))
                {
                    int originalFx = _stateMemory.GetOriginal<int>(STATE_VISUAL_FX);
                    ctx.Logger.LogInfo($"[VisualFX] Restaurando VisualFXSetting = {originalFx}...");
                    using var key = Registry.CurrentUser.OpenSubKey(VISUAL_FX_KEY, writable: true)
                                 ?? Registry.CurrentUser.CreateSubKey(VISUAL_FX_KEY);
                    key?.SetValue("VisualFXSetting", originalFx, RegistryValueKind.DWord);
                    changes.Add($"VisualFXSetting = {originalFx}");
                    ctx.Logger.LogSuccess("[VisualFX] ✅ VisualFXSetting restaurado.");
                }

                // 3. Restaurar transparência
                if (_stateMemory.WasModifiedByGamerMode(STATE_TRANSPARENCY))
                {
                    int originalTransp = _stateMemory.GetOriginal<int>(STATE_TRANSPARENCY);
                    ctx.Logger.LogInfo($"[VisualFX] Restaurando transparência = {originalTransp}...");
                    using var key = Registry.CurrentUser.OpenSubKey(PERSONALIZE_KEY, writable: true)
                                 ?? Registry.CurrentUser.CreateSubKey(PERSONALIZE_KEY);
                    key?.SetValue("EnableTransparency", originalTransp, RegistryValueKind.DWord);
                    changes.Add($"Transparência restaurada ({originalTransp})");
                    ctx.Logger.LogSuccess("[VisualFX] ✅ Transparência restaurada.");
                }

                result.Success = true;
                result.ChangesReverted = changes.Count;
                result.RevertedChanges = changes.ToArray();
                ctx.Logger.LogSuccess($"[VisualFX] {changes.Count} efeitos visuais restaurados.");
            }
            catch (Exception ex)
            {
                ctx.Logger.LogError($"[VisualFX] ❌ Erro ao restaurar efeitos visuais: {ex.Message}", ex);
                result.Success = false;
                result.ErrorMessage = ex.Message;
            }

            return Task.FromResult(result);
        }
    }
}
