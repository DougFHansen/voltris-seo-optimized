using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.Models;

namespace VoltrisOptimizer.Services.Gamer.Interfaces
{
    /// <summary>
    /// Orquestra todas as operações do modo gamer
    /// </summary>
    public interface IGamerModeOrchestrator
    {
        /// <summary>
        /// Status atual do modo gamer
        /// </summary>
        Models.GamerModeStatus Status { get; }
        
        /// <summary>
        /// Indica se o modo gamer está ativo
        /// </summary>
        bool IsActive { get; }
        
        /// <summary>
        /// Evento disparado quando o status muda
        /// </summary>
        event EventHandler<Models.GamerModeStatus>? StatusChanged;
        
        /// <summary>
        /// Ativa o modo gamer com as opções especificadas
        /// </summary>
        Task<bool> ActivateAsync(Models.GamerOptimizationOptions options, string? gameExecutable = null, IProgress<int>? progress = null, CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Desativa o modo gamer e restaura configurações
        /// </summary>
        Task<bool> DeactivateAsync(IProgress<int>? progress = null, CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Obtém as opções atuais de otimização
        /// </summary>
        Models.GamerOptimizationOptions GetCurrentOptions();
        
        /// <summary>
        /// Define as opções de otimização
        /// </summary>
        void SetOptions(Models.GamerOptimizationOptions options);
    }

    /// <summary>
    /// Detecta jogos instalados e em execução
    /// </summary>
    public interface IGameDetector
    {
        /// <summary>
        /// Evento disparado quando um jogo é detectado em execução
        /// </summary>
        event EventHandler<Models.DetectedGame>? GameStarted;
        
        /// <summary>
        /// Evento disparado quando um jogo para de executar
        /// </summary>
        event EventHandler<Models.DetectedGame>? GameStopped;
        
        /// <summary>
        /// Detecta jogos instalados no sistema
        /// </summary>
        Task<IReadOnlyList<Models.DetectedGame>> DetectInstalledGamesAsync(CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Verifica se um processo é um jogo conhecido
        /// </summary>
        bool IsKnownGame(string processName, string? executablePath = null);
        
        /// <summary>
        /// Inicia monitoramento automático de jogos
        /// </summary>
        void StartMonitoring();
        
        /// <summary>
        /// Para monitoramento automático
        /// </summary>
        void StopMonitoring();
        
        /// <summary>
        /// Indica se o monitoramento está ativo
        /// </summary>
        bool IsMonitoring { get; }
    }

    /// <summary>
    /// Gerencia a biblioteca de jogos detectados
    /// </summary>
    public interface IGameLibraryService
    {
        /// <summary>
        /// Obtém todos os jogos na biblioteca
        /// </summary>
        IReadOnlyList<Models.DetectedGame> GetAllGames();
        
        /// <summary>
        /// Adiciona um jogo à biblioteca
        /// </summary>
        bool AddGame(Models.DetectedGame game);
        
        /// <summary>
        /// Remove um jogo da biblioteca por caminho do executável
        /// </summary>
        bool RemoveGame(string executablePath);
        
        /// <summary>
        /// Remove um jogo da biblioteca pelo nome
        /// </summary>
        bool RemoveGameByName(string gameName);
        
        /// <summary>
        /// Atualiza o perfil de um jogo
        /// </summary>
        void UpdateGameProfile(string gameName, Models.GameProfile profile);
        
        /// <summary>
        /// Verifica se um jogo está na biblioteca
        /// </summary>
        bool ContainsGame(string executablePath);
        
        /// <summary>
        /// Atualiza a biblioteca com novos jogos detectados
        /// </summary>
        Task<int> RefreshAsync(CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Salva a biblioteca em disco
        /// </summary>
        void Save();
        
        /// <summary>
        /// Carrega a biblioteca do disco
        /// </summary>
        void Load();
    }

    /// <summary>
    /// Gerencia perfis de otimização por jogo
    /// </summary>
    public interface IGameProfileService
    {
        /// <summary>
        /// Obtém todos os perfis
        /// </summary>
        IReadOnlyList<Models.GameProfile> GetAllProfiles();
        
        /// <summary>
        /// Obtém perfil por nome do jogo
        /// </summary>
        Models.GameProfile? GetProfile(string gameName);
        
        /// <summary>
        /// Obtém perfil por caminho do executável
        /// </summary>
        Models.GameProfile? GetProfileByPath(string executablePath);
        
        /// <summary>
        /// Cria ou atualiza um perfil
        /// </summary>
        void SaveProfile(Models.GameProfile profile);
        
        /// <summary>
        /// Remove um perfil
        /// </summary>
        bool DeleteProfile(string gameName);
        
        /// <summary>
        /// Aplica um perfil de otimização
        /// </summary>
        Task<bool> ApplyProfileAsync(string gameName, IProgress<int>? progress = null, CancellationToken cancellationToken = default);
    }

    /// <summary>
    /// Otimiza CPU para jogos
    /// </summary>
    public interface ICpuGamingOptimizer
    {
        /// <summary>
        /// Aplica otimizações de CPU para jogos
        /// </summary>
        Task<bool> OptimizeAsync(CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Restaura configurações originais de CPU
        /// </summary>
        Task<bool> RestoreAsync(CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Define prioridade alta para um processo de jogo
        /// </summary>
        bool SetGameProcessPriority(int processId, Models.ProcessPriorityLevel priority);
        
        /// <summary>
        /// Desabilita core parking
        /// </summary>
        bool DisableCoreParking();
        
        /// <summary>
        /// Aplica CPU sets para processo (CPUs híbridas)
        /// </summary>
        bool ApplyCpuSets(int processId);
    }

    /// <summary>
    /// Otimiza GPU para jogos
    /// </summary>
    public interface IGpuGamingOptimizer
    {
        /// <summary>
        /// Obtém informações da GPU
        /// </summary>
        Task<Models.GpuInfo> GetGpuInfoAsync(CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Obtém temperatura atual da GPU
        /// </summary>
        Task<Models.GpuTemperature> GetTemperatureAsync(CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Aplica otimizações de GPU para jogos
        /// </summary>
        Task<bool> OptimizeAsync(CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Restaura configurações originais de GPU
        /// </summary>
        Task<bool> RestoreAsync(CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Habilita/Desabilita HAGS
        /// </summary>
        bool SetHagsEnabled(bool enabled);
        
        /// <summary>
        /// Aplica tweaks de TDR para jogos
        /// </summary>
        bool ApplyTdrTweaks(bool enable);
    }

    /// <summary>
    /// Otimiza rede para jogos
    /// </summary>
    public interface INetworkGamingOptimizer
    {
        /// <summary>
        /// Aplica otimizações de rede para jogos
        /// </summary>
        Task<bool> OptimizeAsync(CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Restaura configurações originais de rede
        /// </summary>
        Task<bool> RestoreAsync(CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Aplica QoS DSCP para um aplicativo
        /// </summary>
        bool ApplyQosDscp(string executablePath, int dscpValue = 46);
        
        /// <summary>
        /// Remove QoS DSCP de um aplicativo
        /// </summary>
        bool RemoveQosDscp(string executablePath);
        
        /// <summary>
        /// Configura interrupt moderation da NIC
        /// </summary>
        bool SetNicInterruptModeration(bool enabled);
        
        /// <summary>
        /// Mede latência para um host
        /// </summary>
        Task<double> MeasureLatencyAsync(string host, CancellationToken cancellationToken = default);
    }

    /// <summary>
    /// Gerencia memória RAM para jogos
    /// </summary>
    public interface IMemoryGamingOptimizer
    {
        /// <summary>
        /// Limpa standby list
        /// </summary>
        bool CleanStandbyList();
        
        /// <summary>
        /// Inicia monitoramento contínuo de RAM
        /// </summary>
        void StartMonitoring(int thresholdMb = 1024, int standbyThresholdMb = 1024);
        
        /// <summary>
        /// Para monitoramento de RAM
        /// </summary>
        void StopMonitoring();
        
        /// <summary>
        /// Obtém memória livre em MB
        /// </summary>
        double GetFreeMemoryMb();
        
        /// <summary>
        /// Obtém tamanho da standby cache em MB
        /// </summary>
        double GetStandbyCacheMb();
    }

    /// <summary>
    /// Gerencia timer resolution do sistema
    /// </summary>
    public interface ITimerResolutionService
    {
        /// <summary>
        /// Define resolução máxima do timer
        /// </summary>
        bool SetMaximumResolution();
        
        /// <summary>
        /// Libera resolução do timer
        /// </summary>
        bool ReleaseResolution();
        
        /// <summary>
        /// Indica se a resolução máxima está ativa
        /// </summary>
        bool IsMaxResolutionActive { get; }
        
        /// <summary>
        /// Obtém resolução atual em 100ns units
        /// </summary>
        uint GetCurrentResolution();
    }

    /// <summary>
    /// Governança adaptativa de performance
    /// </summary>
    public interface IAdaptiveGovernor
    {
        /// <summary>
        /// Evento disparado quando um stutter é detectado
        /// </summary>
        event EventHandler<Models.StutterIncident>? StutterDetected;
        
        /// <summary>
        /// Inicia governança para um processo de jogo
        /// </summary>
        void Start(int gameProcessId, Models.GamerOptimizationOptions options);
        
        /// <summary>
        /// Para a governança
        /// </summary>
        void Stop();
        
        /// <summary>
        /// Indica se a governança está ativa
        /// </summary>
        bool IsRunning { get; }
        
        /// <summary>
        /// Obtém incidentes recentes de stutter
        /// </summary>
        IReadOnlyList<Models.StutterIncident> GetRecentIncidents();
        
        /// <summary>
        /// Limpa histórico de incidentes
        /// </summary>
        void ClearIncidents();
    }

    /// <summary>
    /// Detecta capacidades do hardware
    /// </summary>
    public interface IHardwareDetector
    {
        /// <summary>
        /// Obtém capacidades completas do hardware
        /// </summary>
        Task<Models.HardwareCapabilities> GetCapabilitiesAsync(CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Obtém informações da GPU
        /// </summary>
        Task<Models.GpuInfo> GetGpuInfoAsync(CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Verifica se a CPU é híbrida (P-cores + E-cores)
        /// </summary>
        bool IsHybridCpu();
        
        /// <summary>
        /// Obtém quantidade de RAM em GB
        /// </summary>
        int GetTotalRamGb();
    }

    /// <summary>
    /// Gerencia processos para otimização
    /// </summary>
    public interface IProcessPrioritizer
    {
        /// <summary>
        /// Fecha processos desnecessários para jogos
        /// </summary>
        int CloseUnnecessaryProcesses();
        
        /// <summary>
        /// Define prioridade de um processo
        /// </summary>
        bool SetPriority(int processId, Models.ProcessPriorityLevel priority);
        
        /// <summary>
        /// Reduz prioridade de processos de background
        /// </summary>
        int LowerBackgroundProcessesPriority();
        
        /// <summary>
        /// Restaura prioridades normais
        /// </summary>
        void RestoreAllPriorities();
        
        /// <summary>
        /// Verifica se um processo é protegido (não pode ser fechado)
        /// </summary>
        bool IsProtectedProcess(string processName);
    }
}

