using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using VoltrisOptimizer.Core.PreparePc;
using VoltrisOptimizer.Core.PreparePc.Interfaces;

namespace VoltrisOptimizer.UI.ViewModels
{
    /// <summary>
    /// Partial class do DashboardViewModel para funcionalidade Prepare PC
    /// </summary>
    public partial class DashboardViewModel
    {
        #region Prepare PC Properties
        
        private bool _isPreparing;
        public bool IsPreparing
        {
            get => _isPreparing;
            set => SetProperty(ref _isPreparing, value);
        }
        
        private double _prepareProgress;
        public double PrepareProgress
        {
            get => _prepareProgress;
            set => SetProperty(ref _prepareProgress, value);
        }
        
        private string _currentStatusMessage = string.Empty;
        public string CurrentStatusMessage
        {
            get => _currentStatusMessage;
            set => SetProperty(ref _currentStatusMessage, value);
        }
        
        private string _staticMessage = "Estamos analisando, corrigindo erros e otimizando seu sistema. Por favor, não desligue o computador, não reinicie e não feche o programa.";
        public string StaticMessage
        {
            get => _staticMessage;
            set => SetProperty(ref _staticMessage, value);
        }
        
        #endregion
        
        #region Prepare PC Commands
        
        private ICommand? _preparePcCommand;
        public ICommand PreparePcCommand => _preparePcCommand ??= new RelayCommand(async () => await RunPreparationAsync());

        private ICommand? _cancelPreparationCommand;
        public ICommand CancelPreparationCommand => _cancelPreparationCommand ??= new RelayCommand(CancelPreparation, () => IsPreparing);
        
        #endregion
        
        #region Prepare PC Methods
        
        private readonly List<string> _dynamicMessages = new()
        {
            "Analisando integridade do sistema...",
            "Aplicando otimizações inteligentes...",
            "Limpando arquivos temporários...",
            "Corrigindo inconsistências...",
            "Ajustando configurações de desempenho...",
            "Finalizando otimizações..."
        };
        
        private async Task RunPreparationAsync()
        {
            if (IsPreparing) return;
            
            IsPreparing = true;
            PrepareProgress = 0;
            
            try
            {
                // Obter PreparePcManager do ServiceLocator
                var preparePcManager = Core.ServiceLocator.GetService<PreparePcManager>();
                if (preparePcManager == null)
                {
                    _logger?.LogError("[DashboardVM] PreparePcManager não encontrado no ServiceLocator");
                    CurrentStatusMessage = "Erro: Serviço não disponível";
                    await Task.Delay(2000);
                    return;
                }
                
                // Configurar opções
                var options = new PreparePcOptions
                {
                    Mode = PreparePcMode.Recommended,
                    CleanBrowserCaches = true,
                    CleanShaderCaches = true,
                    OptimizeServices = true,
                    ApplyPowerPlan = true
                };
                
                // Progress handler
                var progress = new Progress<PreparePcProgress>(p =>
                {
                    PrepareProgress = p.OverallPercent;
                    
                    // Rotacionar mensagens dinâmicas
                    if (p.CurrentStepIndex > 0 && p.CurrentStepIndex <= _dynamicMessages.Count)
                    {
                        CurrentStatusMessage = _dynamicMessages[p.CurrentStepIndex - 1];
                    }
                    else
                    {
                        CurrentStatusMessage = p.CurrentAction;
                    }
                });
                
                // Executar preparação
                var result = await preparePcManager.ExecuteAsync(options, progress);
                
                // Mostrar resultado
                if (result.Success)
                {
                    CurrentStatusMessage = "Preparação concluída com sucesso!";
                    PrepareProgress = 100;
                    await Task.Delay(2000);
                }
                else
                {
                    CurrentStatusMessage = $"Preparação concluída com {result.FailedSteps} erro(s)";
                    await Task.Delay(3000);
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError("[DashboardVM] Erro ao executar Prepare PC", ex);
                CurrentStatusMessage = $"Erro: {ex.Message}";
                await Task.Delay(3000);
            }
            finally
            {
                IsPreparing = false;
                PrepareProgress = 0;
                CurrentStatusMessage = string.Empty;
            }
        }
        
        private void CancelPreparation()
        {
            var preparePcManager = Core.ServiceLocator.GetService<PreparePcManager>();
            preparePcManager?.Cancel();
        }
        
        #endregion
    }
}
