using System;
using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Gamer;
using VoltrisOptimizer.Services.Gamer.Intelligence;
using VoltrisOptimizer.Services.Optimization;
using VoltrisOptimizer.Services.Performance;
using VoltrisOptimizer.Services.SystemSnapshot;
using VoltrisOptimizer.Services.RateLimiting;
using VoltrisOptimizer.Services.Licensing;
using VoltrisOptimizer.Services.Power;
using VoltrisOptimizer.Services.Display;
using VoltrisOptimizer.Services.Personalize;
using VoltrisOptimizer.Services.StreamHub.Interfaces;
using VoltrisOptimizer.Services.StreamHub.Implementation;
using VoltrisOptimizer.UI.ViewModels;

namespace VoltrisOptimizer.Core
{
    public static class Bootstrapper
    {
        public static IServiceProvider ConfigureServices(ILoggingService loggingService)
        {
            var services = new ServiceCollection();
            
            // 1. Core Services
            services.AddSingleton<ILoggingService>(loggingService);
            
            // 2. CORREÃ‡ÃƒO ENTERPRISE: Novos serviÃ§os crÃ­ticos
            services.AddSingleton<PerformanceMetricsCollector>();
            services.AddSingleton<SystemSnapshotService>();
            services.AddSingleton<ServerSideLicenseValidator>();
            services.AddSingleton(GlobalRateLimiter.Instance);
            
            // 3. Main Service Registration
            services.AddVoltrisServices();
            services.AddGamerIntelligenceServices();
            
            // 4. Specific Singletons
            services.AddSingleton<AIOptimizerService>();

            // 5. Smart Energy Engine
            services.AddSingleton<SmartEnergyService>();
            services.AddSingleton<PowerPlanEditorService>();
            services.AddSingleton<EnergyDiagnosticsService>();
            services.AddTransient<EnergyMonitorService>();

            // 6. Display & Personalize
            services.AddSingleton<DisplayService>();
            services.AddSingleton<SystemTweaksService>();
            services.AddSingleton<Windows11IconsService>();
            services.AddSingleton<GpuControlService>();
            services.AddSingleton<DisplayViewModel>();
            services.AddSingleton<VoltrisBlurService>();
            services.AddSingleton<TaskbarControlService>();
            services.AddSingleton<CursorThemeService>();
            services.AddSingleton<PersonalizeViewModel>();
            
            // 7. Stream Hub
            services.AddSingleton<IObsService, ObsWebSocketService>();
            services.AddSingleton<ITwitchService, TwitchService>();
            services.AddSingleton<IYouTubeService, YouTubeService>();
            services.AddSingleton<IStreamHealthMonitor, StreamHealthMonitor>();
            services.AddSingleton<IHighlightDetectorService, HighlightDetectorService>();
            services.AddSingleton<EngagementAssistantService>();
            services.AddSingleton<IStreamHubService, StreamHubOrchestrator>();
            services.AddSingleton<StreamHubViewModel>();
            
            return services.BuildServiceProvider();
        }
    }
}

