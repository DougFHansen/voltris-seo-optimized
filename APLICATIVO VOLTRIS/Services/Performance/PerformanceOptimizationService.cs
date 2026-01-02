using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Performance.Models;

namespace VoltrisOptimizer.Services.Performance{
    /// <summary>
    /// Wrapper para UltraPerformanceService que implementa IPerformanceOptimizationService
    /// Permite injeção de dependência e desacoplamento
    /// </summary>
    public class PerformanceOptimizationService : IPerformanceOptimizationService
    {
        private readonly UltraPerformanceService _ultraPerformance;
        private readonly ILoggingService _logger;

        public PerformanceOptimizationService(UltraPerformanceService ultraPerformance, ILoggingService logger)
        {
            _ultraPerformance = ultraPerformance ?? throw new ArgumentNullException(nameof(ultraPerformance));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public PerformanceSystemProfile DetectSystemProfile()
        {
            try
            {
                return _ultraPerformance.DetectSystemProfile();
            }
            catch (Exception ex)
            {
                _logger.LogError("[PerformanceOptimization] Erro ao detectar perfil do sistema", ex);
                throw;
            }
        }

        public IReadOnlyList<PerformanceCategory> GetOptimizationCategories()
        {
            try
            {
                return _ultraPerformance.GetOptimizationCategories();
            }
            catch (Exception ex)
            {
                _logger.LogError("[PerformanceOptimization] Erro ao obter categorias", ex);
                throw;
            }
        }

        public async Task<PerformanceOptimizationResult> ApplyRecommendedOptimizationsAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                return await _ultraPerformance.ApplyRecommendedOptimizationsAsync(cancellationToken).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogError("[PerformanceOptimization] Erro ao aplicar otimizações", ex);
                throw;
            }
        }
        
        public async Task<PerformanceOptimizationResult> ApplyOptimizationsAsync(IEnumerable<string> selectedOptimizationNames, CancellationToken cancellationToken = default)
        {
            try
            {
                return await _ultraPerformance.ApplyOptimizationsAsync(selectedOptimizationNames, cancellationToken).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogError("[PerformanceOptimization] Erro ao aplicar otimizações selecionadas", ex);
                throw;
            }
        }
        
        public async Task<PerformanceOptimizationResult> RevertAllOptimizationsAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                return await _ultraPerformance.RevertAllOptimizationsAsync(cancellationToken).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogError("[PerformanceOptimization] Erro ao reverter otimizações", ex);
                throw;
            }
        }
    }
}

