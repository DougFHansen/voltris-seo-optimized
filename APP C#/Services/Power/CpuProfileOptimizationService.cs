using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Thermal;
using VoltrisOptimizer.Services.Thermal.Models;

namespace VoltrisOptimizer.Services.Power
{
    /// <summary>
    /// Enterprise-grade CPU optimization service integrated with Intelligent Profiles.
    /// Applies REAL Windows power settings via powrprof.dll native API — no placebo.
    /// 
    /// Settings controlled per profile:
    ///   - CPU Core Parking (min cores active)
    ///   - CPU Frequency Scaling (min/max processor state)
    ///   - Turbo Boost Policy (boost mode)
    ///   - Energy Performance Preference (Intel SpeedShift EPP)
    ///   - CPU Idle States (idle disable)
    ///   - Autonomous Mode (HWP)
    ///   
    /// All changes are applied to the ACTIVE power scheme only.
    /// Original state is captured for safe restoration.
    /// </summary>
    public sealed class CpuProfileOptimizationService : IDisposable
    {
        private const string TAG = "[CpuProfile]";

        #region Native API (powrprof.dll)

        [DllImport("powrprof.dll")]
        private static extern uint PowerWriteACValueIndex(
            IntPtr RootPowerKey, ref Guid SchemeGuid,
            ref Guid SubGroupGuid, ref Guid SettingGuid, uint AcValueIndex);

        [DllImport("powrprof.dll")]
        private static extern uint PowerGetActiveScheme(
            IntPtr UserRootPowerKey, out IntPtr ActivePolicyGuid);

        [DllImport("powrprof.dll")]
        private static extern uint PowerReadACValueIndex(
            IntPtr RootPowerKey, ref Guid SchemeGuid,
            ref Guid SubGroupGuid, ref Guid SettingGuid, out uint AcValueIndex);

        [DllImport("powrprof.dll")]
        private static extern uint PowerSetActiveScheme(
            IntPtr UserRootPowerKey, ref Guid SchemeGuid);

        // Also write DC (battery) values for laptops
        [DllImport("powrprof.dll")]
        private static extern uint PowerWriteDCValueIndex(
            IntPtr RootPowerKey, ref Guid SchemeGuid,
            ref Guid SubGroupGuid, ref Guid SettingGuid, uint DcValueIndex);

        #endregion

        #region Power Setting GUIDs

        // Processor subgroup
        private static Guid GUID_PROCESSOR = new("54533251-82be-4824-96c1-47b60b740d00");

        // Min/Max processor state (frequency scaling)
        private static Guid GUID_MIN_PROC_STATE = new("893dee8e-2bef-41e0-89c6-b55d0929964c");
        private static Guid GUID_MAX_PROC_STATE = new("bc5038f7-23e0-4960-96da-33abaf5935ec");

        // Core parking — min cores (0=all parked, 100=none parked)
        private static Guid GUID_CORE_PARKING_MIN = new("0cc5b647-c1df-4637-891a-dec35c318583");
        // Core parking — max cores
        private static Guid GUID_CORE_PARKING_MAX = new("ea062031-0e34-4ff1-9b6d-eb1059334028");

        // Turbo Boost mode (0=Disabled, 1=Enabled, 2=Aggressive, 3=EfficientEnabled, 4=EfficientAggressive, 6=AggressiveAtGuaranteed)
        private static Guid GUID_BOOST_MODE = new("be337238-0d82-4146-a960-4f3749d470c7");
        // Note: On some Windows builds, GUID_BOOST_MODE is the same as EPP.
        // The actual Turbo Boost Policy GUID:
        private static Guid GUID_PERF_BOOST_POLICY = new("45bcc044-d885-43e2-8605-ee0ec6e96b59");

        // Energy Performance Preference (EPP) — 0=max performance, 100=max efficiency
        private static Guid GUID_EPP = new("36687f9e-e3a5-4dbf-b1dc-15eb381c6863");

        // Processor idle disable (0=idle enabled, 1=idle disabled)
        private static Guid GUID_IDLE_DISABLE = new("5d76a2ca-e8c0-402f-a133-2158492d58ad");

        // Autonomous mode (Intel HWP) — 0=disabled, 1=enabled
        private static Guid GUID_AUTONOMOUS_MODE = new("8baa4d57-3d56-4ad3-91f6-d4f1952f3c75");

        #endregion

        #region Profile Definitions

        /// <summary>
        /// Defines the CPU power settings for each optimization tier.
        /// These map to the Intelligent Profiles.
        /// </summary>
        private record CpuProfileSettings(
            string Name,
            int MinProcessorState,    // 0-100%
            int MaxProcessorState,    // 0-100%
            int CoreParkingMin,       // 0-100% (100 = no parking)
            int CoreParkingMax,       // 0-100%
            int BoostMode,            // 0=Off, 2=Aggressive, 4=EfficientAggressive
            int Epp,                  // 0=MaxPerf, 100=MaxEfficiency
            int IdleDisable,          // 0=idle on, 1=idle off
            int AutonomousMode        // 0=off, 1=on (HWP)
        );

        private static CpuProfileSettings GetSettingsForProfile(IntelligentProfileType profile)
        {
            return profile switch
            {
                // ═══ DESEMPENHO MÁXIMO ═══
                IntelligentProfileType.GamerCompetitive => new CpuProfileSettings(
                    Name: "Game Competitivo",
                    MinProcessorState: 100,
                    MaxProcessorState: 100,
                    CoreParkingMin: 100,    // All cores unparked
                    CoreParkingMax: 100,
                    BoostMode: 2,           // Aggressive
                    Epp: 0,                 // Max performance
                    IdleDisable: 0,         // CORREÇÃO: Idle HABILITADO — desabilitar C-states em laptop
                                            // causa superaquecimento e ativa thermal throttle, tornando
                                            // o sistema mais lento. C-states são necessários para controle térmico.
                    AutonomousMode: 1       // HWP on
                ),

                IntelligentProfileType.GamerSinglePlayer => new CpuProfileSettings(
                    Name: "Game SinglePlayer",
                    MinProcessorState: 80,
                    MaxProcessorState: 100,
                    CoreParkingMin: 100,    // All cores unparked
                    CoreParkingMax: 100,
                    BoostMode: 4,           // Efficient Aggressive
                    Epp: 15,               // Near max performance
                    IdleDisable: 0,         // Idle allowed (less heat)
                    AutonomousMode: 1
                ),

                IntelligentProfileType.CreativeVideoEditing => new CpuProfileSettings(
                    Name: "Criativo",
                    MinProcessorState: 50,
                    MaxProcessorState: 100,
                    CoreParkingMin: 100,    // All cores for rendering
                    CoreParkingMax: 100,
                    BoostMode: 4,           // Efficient Aggressive
                    Epp: 25,
                    IdleDisable: 0,
                    AutonomousMode: 1
                ),

                // ═══ BALANCEADO ═══
                IntelligentProfileType.DeveloperProgramming => new CpuProfileSettings(
                    Name: "Desenvolvedor",
                    MinProcessorState: 10,
                    MaxProcessorState: 100,
                    CoreParkingMin: 75,     // Some parking allowed
                    CoreParkingMax: 100,
                    BoostMode: 4,           // Efficient Aggressive
                    Epp: 50,               // Balanced
                    IdleDisable: 0,
                    AutonomousMode: 1
                ),

                IntelligentProfileType.WorkOffice => new CpuProfileSettings(
                    Name: "Escritório",
                    MinProcessorState: 5,
                    MaxProcessorState: 100,
                    CoreParkingMin: 50,     // Moderate parking
                    CoreParkingMax: 100,
                    BoostMode: 4,           // Efficient Aggressive
                    Epp: 60,
                    IdleDisable: 0,
                    AutonomousMode: 1
                ),

                IntelligentProfileType.GeneralBalanced => new CpuProfileSettings(
                    Name: "Balanceado",
                    MinProcessorState: 10,
                    MaxProcessorState: 100,
                    CoreParkingMin: 50,
                    CoreParkingMax: 100,
                    BoostMode: 4,           // Efficient Aggressive
                    Epp: 50,
                    IdleDisable: 0,
                    AutonomousMode: 1
                ),

                // ═══ ECONÔMICO / ENTERPRISE ═══
                IntelligentProfileType.EnterpriseSecure => new CpuProfileSettings(
                    Name: "Enterprise",
                    MinProcessorState: 5,
                    MaxProcessorState: 70,
                    CoreParkingMin: 30,     // Aggressive parking
                    CoreParkingMax: 80,
                    BoostMode: 3,           // Efficient Enabled
                    Epp: 80,               // Efficiency biased
                    IdleDisable: 0,
                    AutonomousMode: 1
                ),

                _ => new CpuProfileSettings(
                    Name: "Padrão",
                    MinProcessorState: 10,
                    MaxProcessorState: 100,
                    CoreParkingMin: 50,
                    CoreParkingMax: 100,
                    BoostMode: 4,
                    Epp: 50,
                    IdleDisable: 0,
                    AutonomousMode: 1
                )
            };
        }

        #endregion

        #region Fields

        private readonly ILoggingService _logger;
        private readonly SettingsService _settings;
        private readonly IGlobalThermalMonitorService _thermal;

        // Original state for safe restoration
        private CpuStateSnapshot? _originalSnapshot;
        private IntelligentProfileType _appliedProfile;
        private bool _isApplied;
        private bool _thermalThrottled;
        private readonly SemaphoreSlim _applyLock = new(1, 1);
        private bool _disposed;

        // Persistent snapshot path — survives crashes
        private static readonly string SnapshotPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "Voltris", "cpu_snapshot.json");

        #endregion

        #region State Snapshot

        private class CpuStateSnapshot
        {
            public Guid ActiveScheme;
            public uint MinProcessorState;
            public uint MaxProcessorState;
            public uint CoreParkingMin;
            public uint CoreParkingMax;
            public uint BoostMode;
            public uint Epp;
            public uint IdleDisable;
            public uint AutonomousMode;
            public DateTime CapturedAt;
        }

        // DTO for JSON serialization (Guid not directly serializable as struct field)
        private class CpuSnapshotDto
        {
            public string ActiveScheme { get; set; } = "";
            public uint MinProcessorState { get; set; }
            public uint MaxProcessorState { get; set; }
            public uint CoreParkingMin { get; set; }
            public uint CoreParkingMax { get; set; }
            public uint BoostMode { get; set; }
            public uint Epp { get; set; }
            public uint IdleDisable { get; set; }
            public uint AutonomousMode { get; set; }
            public DateTime CapturedAt { get; set; }
        }

        private void SaveSnapshotToDisk(CpuStateSnapshot snap)
        {
            try
            {
                Directory.CreateDirectory(Path.GetDirectoryName(SnapshotPath)!);
                var dto = new CpuSnapshotDto
                {
                    ActiveScheme = snap.ActiveScheme.ToString(),
                    MinProcessorState = snap.MinProcessorState,
                    MaxProcessorState = snap.MaxProcessorState,
                    CoreParkingMin = snap.CoreParkingMin,
                    CoreParkingMax = snap.CoreParkingMax,
                    BoostMode = snap.BoostMode,
                    Epp = snap.Epp,
                    IdleDisable = snap.IdleDisable,
                    AutonomousMode = snap.AutonomousMode,
                    CapturedAt = snap.CapturedAt
                };
                File.WriteAllText(SnapshotPath, JsonSerializer.Serialize(dto));
                _logger.LogInfo($"{TAG} Snapshot salvo em disco: {SnapshotPath}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"{TAG} Falha ao salvar snapshot em disco: {ex.Message}");
            }
        }

        private CpuStateSnapshot? LoadSnapshotFromDisk()
        {
            try
            {
                if (!File.Exists(SnapshotPath)) return null;
                var dto = JsonSerializer.Deserialize<CpuSnapshotDto>(File.ReadAllText(SnapshotPath));
                if (dto == null) return null;

                // Validate: snapshot must not be throttled (MaxProcessorState >= 90%)
                // A throttled snapshot (70%) would restore to a degraded state
                if (dto.MaxProcessorState < 90)
                {
                    _logger.LogWarning($"{TAG} Snapshot em disco descartado — MaxCPU={dto.MaxProcessorState}% indica estado throttled anterior.");
                    File.Delete(SnapshotPath);
                    return null;
                }

                // CORREÇÃO: Snapshot com IdleDisable=1 é inválido — C-states desabilitados
                // causam superaquecimento permanente. Corrigir antes de usar.
                if (dto.IdleDisable != 0)
                {
                    _logger.LogWarning($"{TAG} Snapshot em disco tinha IdleDisable={dto.IdleDisable} — corrigido para 0.");
                    dto.IdleDisable = 0;
                    // Reescrever o snapshot corrigido em disco
                    try { File.WriteAllText(SnapshotPath, JsonSerializer.Serialize(dto)); } catch { }
                }

                return new CpuStateSnapshot
                {
                    ActiveScheme = Guid.Parse(dto.ActiveScheme),
                    MinProcessorState = dto.MinProcessorState,
                    MaxProcessorState = dto.MaxProcessorState,
                    CoreParkingMin = dto.CoreParkingMin,
                    CoreParkingMax = dto.CoreParkingMax,
                    BoostMode = dto.BoostMode,
                    Epp = dto.Epp,
                    IdleDisable = dto.IdleDisable,
                    AutonomousMode = dto.AutonomousMode,
                    CapturedAt = dto.CapturedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"{TAG} Falha ao carregar snapshot do disco: {ex.Message}");
                return null;
            }
        }

        private void DeleteSnapshotFromDisk()
        {
            try { if (File.Exists(SnapshotPath)) File.Delete(SnapshotPath); }
            catch { }
        }

        #endregion

        public CpuProfileOptimizationService(
            ILoggingService logger,
            SettingsService settings,
            IGlobalThermalMonitorService thermal)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _settings = settings ?? throw new ArgumentNullException(nameof(settings));
            _thermal = thermal ?? throw new ArgumentNullException(nameof(thermal));

            // CORREÇÃO CRÍTICA: Capturar snapshot ANTES de qualquer evento térmico ou de perfil.
            // Se existir snapshot em disco (de sessão anterior sem crash), usá-lo.
            // Isso evita que o snapshot seja capturado DEPOIS de um thermal throttle já aplicado.
            _originalSnapshot = LoadSnapshotFromDisk();
            if (_originalSnapshot != null)
            {
                // CORREÇÃO: Mesmo ao carregar do disco, garantir que IdleDisable=0.
                // C-states desabilitados (IdleDisable=1) causam superaquecimento permanente
                // e nunca devem ser restaurados — independente do que estava no sistema antes.
                if (_originalSnapshot.IdleDisable != 0)
                {
                    _logger.LogWarning($"{TAG} Snapshot do disco tinha IdleDisable={_originalSnapshot.IdleDisable} — corrigido para 0 (C-states habilitados).");
                    _originalSnapshot.IdleDisable = 0;
                }
                _logger.LogInfo($"{TAG} Snapshot restaurado do disco (sessão anterior).");
                LogSnapshot("DISCO", _originalSnapshot);
            }
            else
            {
                _originalSnapshot = CaptureCurrentState();

                // CORREÇÃO CRÍTICA: IdleDisable=1 (C-states desabilitados) nunca deve ser
                // restaurado — causa superaquecimento permanente no notebook.
                // Forçar sempre para 0 independente do que estava configurado antes.
                if (_originalSnapshot.IdleDisable != 0)
                {
                    _logger.LogWarning($"{TAG} Estado inicial tinha IdleDisable={_originalSnapshot.IdleDisable} — corrigido para 0 no snapshot.");
                    _originalSnapshot.IdleDisable = 0;
                }

                // Só salvar se o estado atual não estiver throttled
                if (_originalSnapshot.MaxProcessorState >= 90)
                {
                    SaveSnapshotToDisk(_originalSnapshot);
                    _logger.LogInfo($"{TAG} Snapshot inicial capturado e salvo em disco.");
                }
                else
                {
                    _logger.LogWarning($"{TAG} Estado inicial já throttled (MaxCPU={_originalSnapshot.MaxProcessorState}%) — snapshot NÃO salvo. Usando valores seguros.");
                    // Forçar valores seguros no snapshot para não restaurar estado degradado
                    _originalSnapshot.MaxProcessorState = 100;
                    _originalSnapshot.MinProcessorState = 10;
                    _originalSnapshot.CoreParkingMin = 50;
                    _originalSnapshot.BoostMode = 4; // Efficient Aggressive
                    _originalSnapshot.Epp = 50;
                    _originalSnapshot.IdleDisable = 0;
                }
                LogSnapshot("ORIGINAL", _originalSnapshot);
            }

            _settings.ProfileChanged += OnProfileChanged;
            _thermal.AlertGenerated += OnThermalAlert;

            _logger.LogInfo($"{TAG} Serviço inicializado.");
        }

        #region Public API

        /// <summary>
        /// Apply CPU optimizations for the current Intelligent Profile.
        /// Called on startup and on profile change.
        /// </summary>
        public async Task ApplyForCurrentProfileAsync(Action<int>? progressCallback = null)
        {
            var profile = _settings.Settings.IntelligentProfile;
            await ApplyProfileAsync(profile, progressCallback);
        }

        /// <summary>
        /// Apply CPU optimizations for a specific profile.
        /// </summary>
        public async Task ApplyProfileAsync(IntelligentProfileType profile, Action<int>? progressCallback = null)
        {
            if (!await _applyLock.WaitAsync(5000))
            {
                _logger.LogWarning($"{TAG} Aplicação já em andamento. Ignorando.");
                return;
            }

            try
            {
                await Task.Run(() =>
                {
                    var settings = GetSettingsForProfile(profile);
                    var sw = Stopwatch.StartNew();

                    _logger.LogInfo($"{TAG} ═══════════════════════════════════════════════");
                    _logger.LogInfo($"{TAG} APLICANDO OTIMIZAÇÕES CPU: {settings.Name}");
                    _logger.LogInfo($"{TAG} ═══════════════════════════════════════════════");

                    // 1. Snapshot já foi capturado no construtor — não sobrescrever aqui.
                    // Isso garante que o snapshot reflete o estado ANTES de qualquer throttle.
                    if (_originalSnapshot == null)
                    {
                        // Fallback de segurança (não deveria acontecer)
                        _originalSnapshot = CaptureCurrentState();
                        if (_originalSnapshot.MaxProcessorState >= 90)
                            SaveSnapshotToDisk(_originalSnapshot);
                        _logger.LogInfo($"{TAG} Estado original capturado (fallback)");
                        LogSnapshot("ORIGINAL", _originalSnapshot);
                    }
                    progressCallback?.Invoke(10);

                    // 2. Get active scheme
                    PowerGetActiveScheme(IntPtr.Zero, out IntPtr schemePtr);
                    var scheme = Marshal.PtrToStructure<Guid>(schemePtr);

                    // 3. Apply each setting with validation
                    int applied = 0;
                    // Total de configurações obrigatórias: MinProc, MaxProc, CoreParkingMax, BoostMode, EPP, IdleDisable = 6
                    // CoreParkingMin e HWP são opcionais (dependem do hardware/plano) e não entram no total.
                    int total = 6;

                    applied += ApplySetting(ref scheme, GUID_MIN_PROC_STATE, (uint)settings.MinProcessorState, "Min Processor State", $"{settings.MinProcessorState}%") ? 1 : 0;
                    progressCallback?.Invoke(20);

                    applied += ApplySetting(ref scheme, GUID_MAX_PROC_STATE, (uint)settings.MaxProcessorState, "Max Processor State", $"{settings.MaxProcessorState}%") ? 1 : 0;
                    progressCallback?.Invoke(30);

                    // Core Parking Min — opcional: nem todos os planos de energia expõem este GUID
                    if (!ApplySetting(ref scheme, GUID_CORE_PARKING_MIN, (uint)settings.CoreParkingMin, "Core Parking Min", $"{settings.CoreParkingMin}%", optional: true))
                        _logger.LogInfo($"{TAG}   ℹ Core Parking Min não suportado neste plano — ignorado.");
                    progressCallback?.Invoke(40);

                    applied += ApplySetting(ref scheme, GUID_CORE_PARKING_MAX, (uint)settings.CoreParkingMax, "Core Parking Max", $"{settings.CoreParkingMax}%") ? 1 : 0;
                    progressCallback?.Invoke(50);

                    applied += ApplyBoostMode(ref scheme, (uint)settings.BoostMode) ? 1 : 0;
                    progressCallback?.Invoke(60);

                    applied += ApplyEpp(ref scheme, (uint)settings.Epp) ? 1 : 0;
                    progressCallback?.Invoke(70);

                    applied += ApplySetting(ref scheme, GUID_IDLE_DISABLE, (uint)settings.IdleDisable, "Idle Disable", settings.IdleDisable == 1 ? "Desativado" : "Ativado") ? 1 : 0;
                    progressCallback?.Invoke(80);

                    // Autonomous Mode (HWP) — opcional: depende do hardware e firmware
                    if (!ApplySetting(ref scheme, GUID_AUTONOMOUS_MODE, (uint)settings.AutonomousMode, "Autonomous Mode (HWP)", settings.AutonomousMode == 1 ? "Ativado" : "Desativado", optional: true))
                        _logger.LogInfo($"{TAG}   ℹ HWP Autonomous Mode não suportado neste hardware — ignorado.");

                    // 4. Commit changes
                    var commitResult = PowerSetActiveScheme(IntPtr.Zero, ref scheme);
                    progressCallback?.Invoke(90);

                    sw.Stop();

                    if (commitResult == 0)
                    {
                        _isApplied = true;
                        _appliedProfile = profile;
                        _logger.LogSuccess($"{TAG} ✓ {applied}/{total} configurações aplicadas em {sw.ElapsedMilliseconds}ms");
                        LogAppliedSettings(settings);
                    }
                    else
                    {
                        _logger.LogError($"{TAG} ✗ PowerSetActiveScheme falhou (código={commitResult})");
                    }

                    progressCallback?.Invoke(100);
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} Exceção ao aplicar perfil: {ex.Message}", ex);
            }
            finally
            {
                _applyLock.Release();
            }
        }

        /// <summary>
        /// Restore original CPU settings captured before any optimization.
        /// </summary>
        public async Task RestoreOriginalAsync()
        {
            if (_originalSnapshot == null)
            {
                _logger.LogWarning($"{TAG} [RestoreOriginal] Nenhum snapshot original em memória para restaurar.");
                return;
            }

            await Task.Run(() =>
            {
                try
                {
                    var snap = _originalSnapshot;
                    _logger.LogInfo($"{TAG} ══════════════════════════════════════════");
                    _logger.LogInfo($"{TAG} RESTAURANDO ESTADO ORIGINAL DA CPU");
                    _logger.LogInfo($"{TAG} Snapshot capturado em: {snap.CapturedAt:HH:mm:ss}");
                    _logger.LogInfo($"{TAG} MinProc={snap.MinProcessorState}% | MaxProc={snap.MaxProcessorState}% | CoreParkMin={snap.CoreParkingMin}% | CoreParkMax={snap.CoreParkingMax}%");
                    _logger.LogInfo($"{TAG} BoostMode={snap.BoostMode} | EPP={snap.Epp} | IdleDisable={snap.IdleDisable} | HWP={snap.AutonomousMode}");
                    _logger.LogInfo($"{TAG} ══════════════════════════════════════════");

                    var scheme = snap.ActiveScheme;

                    ApplySetting(ref scheme, GUID_MIN_PROC_STATE, snap.MinProcessorState, "Min Processor State", $"{snap.MinProcessorState}%");
                    ApplySetting(ref scheme, GUID_MAX_PROC_STATE, snap.MaxProcessorState, "Max Processor State", $"{snap.MaxProcessorState}%");
                    ApplySetting(ref scheme, GUID_CORE_PARKING_MIN, snap.CoreParkingMin, "Core Parking Min", $"{snap.CoreParkingMin}%", optional: true);
                    ApplySetting(ref scheme, GUID_CORE_PARKING_MAX, snap.CoreParkingMax, "Core Parking Max", $"{snap.CoreParkingMax}%");
                    ApplyBoostMode(ref scheme, snap.BoostMode);
                    ApplyEpp(ref scheme, snap.Epp);
                    ApplySetting(ref scheme, GUID_IDLE_DISABLE, snap.IdleDisable, "Idle Disable", snap.IdleDisable == 1 ? "Desativado" : "Ativado");
                    ApplySetting(ref scheme, GUID_AUTONOMOUS_MODE, snap.AutonomousMode, "Autonomous Mode", snap.AutonomousMode == 1 ? "Ativado" : "Desativado", optional: true);

                    var commitResult = PowerSetActiveScheme(IntPtr.Zero, ref scheme);
                    if (commitResult == 0)
                    {
                        _isApplied = false;
                        _thermalThrottled = false;
                        DeleteSnapshotFromDisk();
                        _logger.LogSuccess($"{TAG} ✓ Estado original da CPU restaurado com sucesso.");
                    }
                    else
                    {
                        _logger.LogError($"{TAG} ✗ PowerSetActiveScheme falhou ao restaurar (código={commitResult}).");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"{TAG} [RestoreOriginal] Erro ao restaurar: {ex.Message}", ex);
                }
            });
        }

        /// <summary>
        /// Read current CPU power settings for diagnostics.
        /// </summary>
        public CpuPowerDiagnostics GetCurrentDiagnostics()
        {
            _logger.LogInfo($"{TAG} [GetCurrentDiagnostics] Lendo estado atual da CPU no plano ativo...");
            try
            {
                PowerGetActiveScheme(IntPtr.Zero, out IntPtr schemePtr);
                var scheme = Marshal.PtrToStructure<Guid>(schemePtr);

                var diag = new CpuPowerDiagnostics
                {
                    MinProcessorState = ReadSetting(ref scheme, GUID_MIN_PROC_STATE),
                    MaxProcessorState = ReadSetting(ref scheme, GUID_MAX_PROC_STATE),
                    CoreParkingMin    = ReadSetting(ref scheme, GUID_CORE_PARKING_MIN),
                    CoreParkingMax    = ReadSetting(ref scheme, GUID_CORE_PARKING_MAX),
                    BoostMode         = ReadSetting(ref scheme, GUID_PERF_BOOST_POLICY),
                    Epp               = ReadSetting(ref scheme, GUID_EPP),
                    IdleDisable       = ReadSetting(ref scheme, GUID_IDLE_DISABLE),
                    AutonomousMode    = ReadSetting(ref scheme, GUID_AUTONOMOUS_MODE),
                    IsApplied         = _isApplied,
                    AppliedProfile    = _appliedProfile,
                    ThermalThrottled  = _thermalThrottled
                };

                _logger.LogInfo($"{TAG} [GetCurrentDiagnostics] MinProc={diag.MinProcessorState}% | MaxProc={diag.MaxProcessorState}% | CoreParkMin={diag.CoreParkingMin}% | CoreParkMax={diag.CoreParkingMax}%");
                _logger.LogInfo($"{TAG} [GetCurrentDiagnostics] BoostMode={diag.BoostMode} | EPP={diag.Epp} | IdleDisable={diag.IdleDisable} | HWP={diag.AutonomousMode}");
                _logger.LogInfo($"{TAG} [GetCurrentDiagnostics] IsApplied={diag.IsApplied} | AppliedProfile={diag.AppliedProfile} | ThermalThrottled={diag.ThermalThrottled}");

                return diag;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} [GetCurrentDiagnostics] Erro ao ler diagnósticos: {ex.Message}", ex);
                return new CpuPowerDiagnostics();
            }
        }

        public bool IsApplied => _isApplied;
        public IntelligentProfileType AppliedProfile => _appliedProfile;

        #endregion

        #region Event Handlers

        private async void OnProfileChanged(object? sender, IntelligentProfileType newProfile)
        {
            if (_disposed) return;

            _logger.LogInfo($"{TAG} Perfil alterado para {newProfile} — aplicando otimizações CPU...");

            // Check thermal safety — apenas com temperatura REAL (não estimada)
            var metrics = _thermal.CurrentMetrics;
            if (metrics != null && metrics.IsValid && !metrics.IsCpuTemperatureEstimated)
            {
                var thresholds = ThermalThresholds.GetForProfile(newProfile);
                if (metrics.CpuTemperature > thresholds.CpuCriticalThreshold)
                {
                    _logger.LogWarning($"{TAG} Temperatura CPU crítica ({metrics.CpuTemperature:F1}°C). Aplicando perfil conservador.");
                    await ApplyThermalSafeSettingsAsync();
                    return;
                }
            }

            await ApplyProfileAsync(newProfile);
        }

        private async void OnThermalAlert(object? sender, ThermalAlert alert)
        {
            if (_disposed) return;
            if (alert.Level != ThermalAlertLevel.Critical) return;

            // CORREÇÃO CRÍTICA: Não aplicar throttle com temperatura estimada.
            // Verificar se a métrica atual é estimada antes de reagir ao alerta.
            var currentMetrics = _thermal.CurrentMetrics;
            if (currentMetrics != null && currentMetrics.IsCpuTemperatureEstimated)
            {
                _logger.LogInfo($"{TAG} Alerta térmico ignorado — temperatura é ESTIMADA (sensor real não disponível). Throttle não aplicado.");
                return;
            }

            _logger.LogWarning($"{TAG} ⚠ Alerta térmico CRÍTICO ({alert.Component}={alert.Temperature:F1}°C). Aplicando throttle de segurança.");
            await ApplyThermalSafeSettingsAsync();
        }

        private async Task ApplyThermalSafeSettingsAsync()
        {
            _thermalThrottled = true;
            await Task.Run(() =>
            {
                try
                {
                    PowerGetActiveScheme(IntPtr.Zero, out IntPtr schemePtr);
                    var scheme = Marshal.PtrToStructure<Guid>(schemePtr);

                    _logger.LogWarning($"{TAG} ═══ THERMAL THROTTLE ATIVADO ═══");

                    // Reduce to safe values
                    ApplySetting(ref scheme, GUID_MIN_PROC_STATE, 5, "Min Processor State", "5% (thermal)");
                    ApplySetting(ref scheme, GUID_MAX_PROC_STATE, 70, "Max Processor State", "70% (thermal)");
                    ApplySetting(ref scheme, GUID_CORE_PARKING_MIN, 30, "Core Parking Min", "30% (thermal)", optional: true);
                    ApplyBoostMode(ref scheme, 3); // Efficient Enabled
                    ApplyEpp(ref scheme, 80); // Efficiency biased
                    ApplySetting(ref scheme, GUID_IDLE_DISABLE, 0, "Idle Disable", "Ativado (thermal)");

                    PowerSetActiveScheme(IntPtr.Zero, ref scheme);
                    _logger.LogWarning($"{TAG} Configurações de segurança térmica aplicadas.");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"{TAG} Erro no thermal throttle: {ex.Message}", ex);
                }
            });

            // Iniciar monitoramento de recuperação térmica em background
            _ = MonitorThermalRecoveryAsync();
        }

        /// <summary>
        /// Monitora a temperatura e restaura o perfil original quando normalizar.
        /// Evita que o throttle fique permanente após o sistema esfriar.
        /// </summary>
        private async Task MonitorThermalRecoveryAsync()
        {
            const int checkIntervalMs = 30_000; // checar a cada 30s
            const int maxWaitMinutes = 15;       // desistir após 15min (reboot resolve)
            int attempts = 0;
            int maxAttempts = (maxWaitMinutes * 60_000) / checkIntervalMs;

            _logger.LogInfo($"{TAG} Monitoramento de recuperação térmica iniciado.");

            while (!_disposed && _thermalThrottled && attempts < maxAttempts)
            {
                await Task.Delay(checkIntervalMs);
                attempts++;

                try
                {
                    var metrics = _thermal.CurrentMetrics;
                    if (metrics == null || !metrics.IsValid) continue;

                    var profile = _settings.Settings.IntelligentProfile;
                    var thresholds = ThermalThresholds.GetForProfile(profile);

                    // Temperatura normalizada = abaixo do limite de warning (não apenas critical)
                    bool cpuOk = metrics.CpuTemperature < (thresholds.CpuCriticalThreshold - 10);
                    bool gpuOk = metrics.GpuTemperature < (thresholds.GpuCriticalThreshold - 10);

                    if (cpuOk && gpuOk)
                    {
                        _logger.LogInfo($"{TAG} ✅ Temperatura normalizada (CPU={metrics.CpuTemperature:F1}°C, GPU={metrics.GpuTemperature:F1}°C). Restaurando perfil.");
                        _thermalThrottled = false;
                        await ApplyProfileAsync(profile);
                        return;
                    }

                    _logger.LogInfo($"{TAG} Aguardando resfriamento... CPU={metrics.CpuTemperature:F1}°C GPU={metrics.GpuTemperature:F1}°C (tentativa {attempts}/{maxAttempts})");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"{TAG} Erro no monitoramento térmico: {ex.Message}");
                }
            }

            if (_thermalThrottled && !_disposed)
                _logger.LogWarning($"{TAG} Timeout de recuperação térmica. Throttle permanece ativo até reiniciar.");
        }

        #endregion

        #region Low-Level Helpers

        private bool ApplySetting(ref Guid scheme, Guid settingGuid, uint value, string name, string displayValue, bool optional = false)
        {
            try
            {
                // Read current value first (avoid unnecessary writes that cause WM_POWERBROADCAST stutter)
                if (PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR, ref settingGuid, out uint current) == 0)
                {
                    if (current == value)
                    {
                        _logger.LogInfo($"{TAG}   {name}: {displayValue} (já configurado)");
                        return true;
                    }
                }

                var result = PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR, ref settingGuid, value);
                if (result == 0)
                {
                    _logger.LogInfo($"{TAG}   ✓ {name}: {displayValue}");
                    return true;
                }
                else
                {
                    if (optional)
                        _logger.LogInfo($"{TAG}   ℹ {name}: não suportado (código={result}) — ignorado.");
                    else
                        _logger.LogWarning($"{TAG}   ✗ {name}: falhou (código={result}). Configuração pode não ser suportada.");
                    return false;
                }
            }
            catch (Exception ex)
            {
                if (optional)
                    _logger.LogInfo($"{TAG}   ℹ {name}: não disponível — {ex.Message}");
                else
                    _logger.LogWarning($"{TAG}   ✗ {name}: exceção — {ex.Message}");
                return false;
            }
        }

        private bool ApplyBoostMode(ref Guid scheme, uint mode)
        {
            string modeName = mode switch
            {
                0 => "Desativado",
                1 => "Ativado",
                2 => "Aggressive",
                3 => "Efficient Enabled",
                4 => "Efficient Aggressive",
                6 => "Aggressive At Guaranteed",
                _ => $"Modo {mode}"
            };

            // Try the standard boost policy GUID first
            bool ok = ApplySetting(ref scheme, GUID_PERF_BOOST_POLICY, mode, "Turbo Boost Policy", modeName);
            if (!ok)
            {
                // Fallback: some systems use powercfg command
                try
                {
                    using var process = Process.Start(new ProcessStartInfo
                    {
                        FileName = "powercfg.exe",
                        Arguments = $"/setacvalueindex scheme_current sub_processor PERFBOOSTMODE {mode}",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true
                    });
                    process?.WaitForExit(5000);
                    ok = process?.ExitCode == 0;
                    if (ok)
                        _logger.LogInfo($"{TAG}   ✓ Turbo Boost Policy (via powercfg): {modeName}");
                    else
                        _logger.LogWarning($"{TAG}   ✗ Turbo Boost Policy (via powercfg): falhou");
                }
                catch { }
            }
            return ok;
        }

        private bool ApplyEpp(ref Guid scheme, uint value)
        {
            // Try the standard EPP GUID
            bool ok = ApplySetting(ref scheme, GUID_EPP, value, "Energy Performance Preference", $"{value} (0=perf, 100=eco)");
            if (!ok)
            {
                // Fallback via powercfg
                try
                {
                    using var process = Process.Start(new ProcessStartInfo
                    {
                        FileName = "powercfg.exe",
                        Arguments = $"/setacvalueindex scheme_current sub_processor PERFEPP {value}",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true
                    });
                    process?.WaitForExit(5000);
                    ok = process?.ExitCode == 0;
                    if (ok)
                        _logger.LogInfo($"{TAG}   ✓ EPP (via powercfg): {value}");
                }
                catch { }
            }
            return ok;
        }

        private uint ReadSetting(ref Guid scheme, Guid settingGuid)
        {
            PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR, ref settingGuid, out uint value);
            return value;
        }

        private CpuStateSnapshot CaptureCurrentState()
        {
            PowerGetActiveScheme(IntPtr.Zero, out IntPtr schemePtr);
            var scheme = Marshal.PtrToStructure<Guid>(schemePtr);

            return new CpuStateSnapshot
            {
                ActiveScheme = scheme,
                MinProcessorState = ReadSetting(ref scheme, GUID_MIN_PROC_STATE),
                MaxProcessorState = ReadSetting(ref scheme, GUID_MAX_PROC_STATE),
                CoreParkingMin = ReadSetting(ref scheme, GUID_CORE_PARKING_MIN),
                CoreParkingMax = ReadSetting(ref scheme, GUID_CORE_PARKING_MAX),
                BoostMode = ReadSetting(ref scheme, GUID_PERF_BOOST_POLICY),
                Epp = ReadSetting(ref scheme, GUID_EPP),
                IdleDisable = ReadSetting(ref scheme, GUID_IDLE_DISABLE),
                AutonomousMode = ReadSetting(ref scheme, GUID_AUTONOMOUS_MODE),
                CapturedAt = DateTime.Now
            };
        }

        #endregion

        #region Logging

        private void LogSnapshot(string label, CpuStateSnapshot snap)
        {
            _logger.LogInfo($"{TAG} [{label}] MinCPU={snap.MinProcessorState}% | MaxCPU={snap.MaxProcessorState}% | " +
                           $"CoreParkMin={snap.CoreParkingMin}% | CoreParkMax={snap.CoreParkingMax}% | " +
                           $"Boost={snap.BoostMode} | EPP={snap.Epp} | IdleOff={snap.IdleDisable} | HWP={snap.AutonomousMode}");
        }

        private void LogAppliedSettings(CpuProfileSettings s)
        {
            _logger.LogInfo($"{TAG} ───── Configurações aplicadas ─────");
            _logger.LogInfo($"{TAG}   Perfil: {s.Name}");
            _logger.LogInfo($"{TAG}   CPU State: {s.MinProcessorState}% — {s.MaxProcessorState}%");
            _logger.LogInfo($"{TAG}   Core Parking: {s.CoreParkingMin}% — {s.CoreParkingMax}%");
            _logger.LogInfo($"{TAG}   Turbo Boost: modo {s.BoostMode}");
            _logger.LogInfo($"{TAG}   EPP: {s.Epp} (0=perf, 100=eco)");
            _logger.LogInfo($"{TAG}   Idle Disable: {(s.IdleDisable == 1 ? "Sim" : "Não")}");
            // HWP Autonomous Mode é opcional — só reportar como "Sim" se o hardware suportar.
            // ApplyProfileAsync já loga "não suportado" quando a chamada falha (código=2).
            // Aqui refletimos o valor desejado vs. o que foi efetivamente aplicado.
            _logger.LogInfo($"{TAG}   HWP Autonomous: {(s.AutonomousMode == 1 ? "Solicitado (verificar suporte do hardware)" : "Não")}");
            _logger.LogInfo($"{TAG} ──────────────────────────────────");
        }

        #endregion

        #region Diagnostics Model

        public class CpuPowerDiagnostics
        {
            public uint MinProcessorState { get; set; }
            public uint MaxProcessorState { get; set; }
            public uint CoreParkingMin { get; set; }
            public uint CoreParkingMax { get; set; }
            public uint BoostMode { get; set; }
            public uint Epp { get; set; }
            public uint IdleDisable { get; set; }
            public uint AutonomousMode { get; set; }
            public bool IsApplied { get; set; }
            public IntelligentProfileType AppliedProfile { get; set; }
            public bool ThermalThrottled { get; set; }
        }

        #endregion

        #region IDisposable

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;

            _settings.ProfileChanged -= OnProfileChanged;
            _thermal.AlertGenerated -= OnThermalAlert;
            _applyLock.Dispose();

            _logger.LogInfo($"{TAG} Serviço descartado.");
        }

        #endregion
    }
}
