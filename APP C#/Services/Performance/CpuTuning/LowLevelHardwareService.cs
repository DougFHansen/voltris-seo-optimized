using System;
using System.IO;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32.SafeHandles;
using VoltrisOptimizer.Services;
using System.Linq;
using System.ServiceProcess;

namespace VoltrisOptimizer.Services.Performance.CpuTuning
{
    /// <summary>
    /// MASTER-GRADE LOW LEVEL HARDWARE SERVICE
    /// INDUSTRIAL IMPLEMENTATION FOR KERNEL-LEVEL CPU CONTROL
    /// COMMUNICATIONS: DIRECT IOCTL VIA LibreHardwareMonitor.sys
    /// </summary>
    public class LowLevelHardwareService : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly Mutex _accessMutex = new Mutex(false, "Global\\VoltrisLowLevelHardwareMutex");
        private SafeFileHandle? _driverHandle;
        private bool _isLoaded;
        private LibreHardwareMonitor.Hardware.Computer? _computer; // Manter instância ativa para o driver permanecer carregado

        // CTL_CODE(0x22, 0x800 + ID, METHOD_BUFFERED, FILE_ANY_ACCESS)
        private const uint IOCTL_RDMSR = 0x9C402400;
        private const uint IOCTL_WRMSR = 0x9C402404;
        private const uint IOCTL_READ_PHYSICAL_MEMORY = 0x9C402408;
        private const uint IOCTL_WRITE_PHYSICAL_MEMORY = 0x9C40240C;
        private const uint IOCTL_READ_PCI_CONFIG = 0x9C402410;

        // MSR Addresses (Architectural Intel)
        private const uint MSR_IA32_POWER_CTL = 0x1FC;
        private const uint MSR_RAPL_POWER_UNIT = 0x606;
        private const uint MSR_PKG_POWER_LIMIT = 0x610;
        private const uint MSR_PKG_POWER_INFO = 0x614;
        private const uint MSR_IA32_THERM_STATUS = 0x19C;
        private const uint MSR_IA32_PACKAGE_THERM_STATUS = 0x1B1;

        // MMIO Constants
        private const uint MCHBAR_PCI_ADDR = 0x80000048; // Bus 0, Dev 0, Func 0, Offset 0x48
        private const uint PACKAGE_POWER_LIMIT_MMIO_OFFSET = 0x59A0;

        // Units
        private double _powerUnit;
        private double _energyUnit;
        private double _timeUnit;
        private ulong _mchBarPhysAddr;

        [StructLayout(LayoutKind.Sequential)]
        private struct MSR_STRUCTURE
        {
            public uint Register;
            public uint Eax;
            public uint Edx;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct PHYS_MEM_STRUCTURE
        {
            public ulong PhysicalAddress;
            public uint Size;
            public ulong Data;
        }

        private static Task? _initializationTask;
        private static readonly object _initLock = new object();

        public LowLevelHardwareService(ILoggingService logger)
        {
            _logger = logger;
            // Disparar a inicialização de forma controlada
            Task.Run(() => EnsureInitializedAsync());
        }

        private void UnblockFiles(string directory)
        {
            try
            {
                if (!Directory.Exists(directory)) return;
                var files = Directory.GetFiles(directory, "*.*", SearchOption.AllDirectories);
                foreach (var file in files)
                {
                    // Remover o "Mark of the Web" (Zone.Identifier) via P/Invoke delete stream
                    DeleteFile(file + ":Zone.Identifier");
                }
            }
            catch { /* Ignorar falhas silenciosamente */ }
        }

        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool DeleteFile(string lpFileName);

        public async Task<bool> EnsureInitializedAsync()
        {
            if (_isLoaded) return true;

            lock (_initLock)
            {
                if (_initializationTask == null || _initializationTask.IsFaulted)
                {
                    _initializationTask = Task.Run(async () => await InitializeKernelInterfaceInternalAsync());
                }
            }

            await _initializationTask;
            return _isLoaded;
        }

        private async Task InitializeKernelInterfaceInternalAsync()
        {
            // Garantir que apenas um thread por vez tente inicializar fisicamente, 
            // mesmo que o Task.Run orquestre acima.
            if (!_accessMutex.WaitOne(30000)) 
            {
                _logger.LogWarning("[LowLevelHW] Mutex timeout waiting for initialization lock.");
                return;
            }

            try
            {
                if (_isLoaded) return;

                var baseDir = AppDomain.CurrentDomain.BaseDirectory;
                var lhmDir = Path.Combine(baseDir, "LibreHardwareMonitor");

                _logger.LogInfo("[LowLevelHW] 🛠️ Initializing Master Kernel Interface...");

                // 0) Desbloquear arquivos para evitar avisos do Windows
                UnblockFiles(lhmDir);

                // 1) Primeira tentativa: abrir o device já existente no kernel
                _driverHandle = TryOpenDriverHandle();

                // 2) Se falhar, tentar carregar o driver SILENCIOSAMENTE via biblioteca (dentro do nosso processo)
                if (_driverHandle == null || _driverHandle.IsInvalid)
                {
                    _logger.LogInfo("[LowLevelHW] 💡 Attempting silent driver initialization via library...");
                    try
                    {
                        _computer = new LibreHardwareMonitor.Hardware.Computer();
                        _computer.IsCpuEnabled = true;
                        _computer.IsGpuEnabled = true; // ✅ Habilitado para Ring 0 Access total
                        _computer.IsMemoryEnabled = false;
                        _computer.IsMotherboardEnabled = true;
                        _computer.IsStorageEnabled = false;
                        _computer.IsNetworkEnabled = false;
                        _computer.IsControllerEnabled = false;
                        
                        _logger.LogDebug("[LowLevelHW] Opening LibreHardwareMonitor Computer instance...");
                        _computer.Open();
                        _logger.LogDebug("[LowLevelHW] Computer.Open() completed, waiting for driver stabilization...");
                        
                        // Aguardar estabilização do driver (5s para dar tempo ao driver carregar)
                        await Task.Delay(5000);
                        
                        // Polling para o driver via library
                        _logger.LogDebug("[LowLevelHW] Polling for driver handle...");
                        for (int i = 0; i < 10; i++)
                        {
                            _driverHandle = TryOpenDriverHandle();
                            if (_driverHandle != null && !_driverHandle.IsInvalid)
                            {
                                _logger.LogSuccess($"[LowLevelHW] ✅ Driver loaded successfully via library (attempt {i + 1}/10)");
                                // NÃO fechar o computer aqui - mantê-lo aberto para o driver permanecer carregado
                                _logger.LogInfo("[LowLevelHW] Keeping Computer instance open to maintain driver loaded");
                                break; // Sair do loop mas manter _computer aberto
                            }
                            await Task.Delay(500);
                        }
                        
                        // Se ainda não conseguiu o handle após 10 tentativas
                        if (_driverHandle == null || _driverHandle.IsInvalid)
                        {
                            _logger.LogWarning("[LowLevelHW] ⚠️ Library method opened but driver handle not accessible after 10 attempts");
                            _logger.LogInfo("[LowLevelHW] This may indicate driver signature issues or antivirus blocking");
                            
                            // Diagnóstico após falha da biblioteca
                            await DiagnoseDriverFailureAsync();
                            
                            // Fechar o computer se não conseguiu o handle
                            _computer.Close();
                            _computer = null;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[LowLevelHW] Library initialization failed: {ex.Message}");
                        _logger.LogDebug($"[LowLevelHW] Stack trace: {ex.StackTrace}");
                        
                        // Limpar em caso de erro
                        if (_computer != null)
                        {
                            try { _computer.Close(); } catch { }
                            _computer = null;
                        }
                    }
                }

                // 3) Se ainda falhar após biblioteca, tentar FALLBACK EXTREMO (Executável Externo)
                if (_driverHandle == null || _driverHandle.IsInvalid)
                {
                    _logger.LogWarning("[LowLevelHW] 🔧 Driver ainda não acessível via library. Tentando lançar executável com privilégios elevados...");
                    var fallbackResult = await TryLaunchLibreHardwareMonitorExecutableAsync();
                    
                    if (fallbackResult)
                    {
                        _driverHandle = TryOpenDriverHandle();
                        if (_driverHandle != null && !_driverHandle.IsInvalid)
                        {
                            _logger.LogSuccess("[LowLevelHW] ✅ ✅ Driver carregado via FALLBACK EXECUTÁVEL!");
                        }
                    }
                }

                if (_driverHandle == null || _driverHandle.IsInvalid)
                {
                    _logger.LogWarning("[LowLevelHW] ❌ Kernel driver unavailable. Ring 0 optimizations DISABLED.");
                    _logger.LogInfo("[LowLevelHW] 💡 This is normal on systems with strict driver signature enforcement");
                    return;
                }

                InitializeRaplParameters();
                DiscoverMchBar();
                
                _isLoaded = true;
                _logger.LogSuccess("[LowLevelHW] 🚀 MASTER INTERFACE ACTIVE (MSR + MMIO Sync Ready)");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[LowLevelHW] Interface initialization failed: {ex.Message}");
            }
            finally
            {
                _accessMutex.ReleaseMutex();
            }
        }

        private SafeFileHandle? TryOpenDriverHandle()
        {
            try
            {
                var handle = CreateFile(@"\\.\LibreHardwareMonitor",
                    NativeFileAccess.ReadWrite,
                    FileShare.ReadWrite,
                    IntPtr.Zero,
                    FileMode.Open,
                    0,
                    IntPtr.Zero);

                if (handle != null && !handle.IsInvalid && !handle.IsClosed)
                {
                    return handle;
                }
                
                return null;
            }
            catch (Exception ex)
            {
                // Não logar aqui para evitar spam durante polling
                return null;
            }
        }

        private async Task DiagnoseDriverFailureAsync()
        {
            try
            {
                _logger.LogInfo("[LowLevelHW] 🔍 Running diagnostics...");
                
                // 1. Verificar se o processo está rodando
                var processes = Process.GetProcessesByName("LibreHardwareMonitor");
                if (processes.Length > 0)
                {
                    _logger.LogInfo($"[LowLevelHW] ✓ Process is running (PID: {processes[0].Id})");
                }
                else
                {
                    _logger.LogWarning("[LowLevelHW] ✗ Process is NOT running - UAC may have been cancelled");
                }
                
                // 2. Verificar se o serviço existe
                try
                {
                    using var sc = new ServiceController("LibreHardwareMonitor");
                    _logger.LogInfo($"[LowLevelHW] ✓ Service exists (Status: {sc.Status})");
                    
                    if (sc.Status != ServiceControllerStatus.Running)
                    {
                        _logger.LogWarning("[LowLevelHW] ✗ Service is not running - driver may not be loaded");
                    }
                }
                catch
                {
                    _logger.LogInfo("[LowLevelHW] ℹ Service not installed (this is normal for portable mode)");
                }
                
                // 3. Verificar se o arquivo do driver existe
                var baseDir = AppDomain.CurrentDomain.BaseDirectory;
                
                // Diversos caminhos possíveis (Desenvolvimento vs Produção)
                string[] possiblePaths = new[]
                {
                    Path.Combine(baseDir, "LibreHardwareMonitor", "LibreHardwareMonitor.sys"),
                    Path.Combine(baseDir, "LibreHardwareMonitor.sys"),
                    Path.Combine(baseDir, "artifacts_app", "LibreHardwareMonitor", "LibreHardwareMonitor.sys")
                };

                var driverPath = possiblePaths.FirstOrDefault(p => File.Exists(p)) ?? possiblePaths[0];
                if (File.Exists(driverPath))
                {
                    _logger.LogInfo("[LowLevelHW] ✓ Driver file exists");
                }
                else
                {
                    _logger.LogWarning($"[LowLevelHW] ✗ Driver file NOT found at: {driverPath}");
                }
                
                // 4. Verificar se estamos rodando como admin
                bool isAdmin = new System.Security.Principal.WindowsPrincipal(
                    System.Security.Principal.WindowsIdentity.GetCurrent())
                    .IsInRole(System.Security.Principal.WindowsBuiltInRole.Administrator);
                    
                if (isAdmin)
                {
                    _logger.LogInfo("[LowLevelHW] ✓ Running with administrator privileges");
                }
                else
                {
                    _logger.LogWarning("[LowLevelHW] ✗ NOT running as administrator - this may prevent driver loading");
                }
                
                _logger.LogInfo("[LowLevelHW] 💡 Recommendation: Ensure Windows Defender/Antivirus is not blocking the driver");
            }
            catch (Exception ex)
            {
                _logger.LogDebug($"[LowLevelHW] Diagnostics failed: {ex.Message}");
            }
        }

        private void TryStartLibreHardwareMonitorService()
        {
            try
            {
                using var sc = new ServiceController("LibreHardwareMonitor");
                if (sc.Status != ServiceControllerStatus.Running &&
                    sc.Status != ServiceControllerStatus.StartPending)
                {
                    _logger.LogInfo("[LowLevelHW] Attempting to start LibreHardwareMonitor service...");
                    sc.Start();
                    sc.WaitForStatus(ServiceControllerStatus.Running, TimeSpan.FromSeconds(5));
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[LowLevelHW] Could not start LibreHardwareMonitor service: {ex.Message}");
            }
        }

        private async Task<bool> TryLaunchLibreHardwareMonitorExecutableAsync()
        {
            try
            {
                var baseDir = AppDomain.CurrentDomain.BaseDirectory;
                
                // Diversos caminhos possíveis
                string[] possibleExePaths = new[]
                {
                    Path.Combine(baseDir, "LibreHardwareMonitor", "LibreHardwareMonitor.exe"),
                    Path.Combine(baseDir, "LibreHardwareMonitor.exe"),
                    Path.Combine(baseDir, "artifacts_app", "LibreHardwareMonitor", "LibreHardwareMonitor.exe")
                };

                var exePath = possibleExePaths.FirstOrDefault(p => File.Exists(p)) ?? possibleExePaths[0];

                // Verificar se já existe uma instância rodando
                var existing = Process.GetProcessesByName("LibreHardwareMonitor");
                bool processAlreadyRunning = existing.Length > 0;
                
                if (processAlreadyRunning)
                {
                    _logger.LogInfo("[LowLevelHW] LibreHardwareMonitor process already detected. Attempting quick sync...");
                    
                    // Se o processo já existe, tentar 5 tentativas (5s total)
                    for (int i = 0; i < 5; i++)
                    {
                        _driverHandle = TryOpenDriverHandle();
                        if (_driverHandle != null && !_driverHandle.IsInvalid)
                        {
                            _logger.LogSuccess($"[LowLevelHW] ✅ Synced with existing instance. Handle obtained after {i + 1}s");
                            return true;
                        }
                        await Task.Delay(1000);
                    }
                    
                    _logger.LogWarning("[LowLevelHW] ⚠️ Existing process detected but driver not responding after 5s.");
                    _logger.LogInfo("[LowLevelHW] This usually means the driver failed to load. Attempting restart...");
                    
                    // Tentar matar o processo travado e reiniciar
                    try
                    {
                        foreach (var proc in existing)
                        {
                            if (!proc.HasExited)
                            {
                                proc.Kill();
                                proc.WaitForExit(3000);
                            }
                        }
                        await Task.Delay(2000); // Aguardar limpeza completa do driver no kernel
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[LowLevelHW] Could not terminate existing process: {ex.Message}");
                    }
                }

                if (!File.Exists(exePath))
                {
                    _logger.LogWarning($"[LowLevelHW] CRITICAL: LibreHardwareMonitor.exe missing at: {exePath}");
                    return false;
                }

                _logger.LogInfo("[LowLevelHW] 🚀 Launching LibreHardwareMonitor.exe (Elevated) to initialize Ring 0 driver...");

                var psi = new ProcessStartInfo(exePath)
                {
                    UseShellExecute = true,
                    Verb = "runas",
                    Arguments = "--minimized", 
                    WindowStyle = ProcessWindowStyle.Minimized,
                    CreateNoWindow = false
                };

                try
                {
                    var proc = Process.Start(psi);
                    if (proc != null)
                    {
                        _logger.LogInfo($"[LowLevelHW] Process started successfully (PID: {proc.Id}), polling for driver handle...");
                    }
                    else
                    {
                        _logger.LogWarning("[LowLevelHW] ⚠️ Process.Start returned null - UAC may have been cancelled");
                        return false;
                    }
                }
                catch (System.ComponentModel.Win32Exception ex)
                {
                    _logger.LogWarning($"[LowLevelHW] ⚠️ Failed to launch with elevation: {ex.Message}");
                    _logger.LogInfo("[LowLevelHW] User may have cancelled UAC prompt or insufficient permissions");
                    return false;
                }
                
                // Poll for driver handle for up to 20 seconds
                _logger.LogInfo("[LowLevelHW] Waiting for kernel driver to load (this may take up to 20s)...");
                for (int i = 0; i < 20; i++)
                {
                    _driverHandle = TryOpenDriverHandle();
                    if (_driverHandle != null && !_driverHandle.IsInvalid)
                    {
                        _logger.LogSuccess($"[LowLevelHW] ✅ ✅ Driver handle obtained after {i + 1}s (via executable)");
                        return true;
                    }
                    await Task.Delay(1000);
                }

                _logger.LogWarning("[LowLevelHW] ❌ Driver still not accessible after 20s. Giving up.");
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[LowLevelHW] Error in TryLaunchLibreHardwareMonitorExecutableAsync: {ex.Message}");
                return false;
            }
        }

        private void InitializeRaplParameters()
        {
            if (ReadMsr(MSR_RAPL_POWER_UNIT, out ulong value))
            {
                _powerUnit = 1.0 / Math.Pow(2, (byte)(value & 0xF));
                _energyUnit = 1.0 / Math.Pow(2, (byte)((value >> 8) & 0x1F));
                _timeUnit = 1.0 / Math.Pow(2, (byte)((value >> 16) & 0xF));
            }
        }

        private void DiscoverMchBar()
        {
            // Read MCHBAR from PCI config to enable MMIO sync
            // Typically requires Bus 0, Dev 0, Func 0
            if (ReadPciConfig(MCHBAR_PCI_ADDR, out uint mchBarValue))
            {
                _mchBarPhysAddr = (ulong)(mchBarValue & 0xFFFFFFF0); // Mask low bits
                if (_mchBarPhysAddr > 0)
                    _logger.LogDebug($"[LowLevelHW] MCHBAR discovered at 0x{_mchBarPhysAddr:X}");
            }
        }

        public bool IsAvailable => _isLoaded;

        public bool ReadMsr(uint register, out ulong value)
        {
            value = 0;
            if (!_isLoaded || _driverHandle == null) return false;

            var input = new MSR_STRUCTURE { Register = register };
            int size = Marshal.SizeOf(input);
            IntPtr ptrIn = Marshal.AllocHGlobal(size);
            IntPtr ptrOut = Marshal.AllocHGlobal(8);

            try
            {
                Marshal.StructureToPtr(input, ptrIn, false);
                uint bytesReturned;
                if (DeviceIoControl(_driverHandle, IOCTL_RDMSR, ptrIn, size, ptrOut, 8, out bytesReturned, IntPtr.Zero))
                {
                    value = (ulong)Marshal.ReadInt64(ptrOut);
                    return true;
                }
            }
            catch (Exception ex) { _logger.LogError($"[LowLevelHW] RDMSR 0x{register:X} failed: {ex.Message}"); }
            finally { Marshal.FreeHGlobal(ptrIn); Marshal.FreeHGlobal(ptrOut); }
            return false;
        }

        public bool WriteMsr(uint register, ulong value)
        {
            if (!_isLoaded || _driverHandle == null) return false;

            var input = new MSR_STRUCTURE { 
                Register = register,
                Eax = (uint)(value & 0xFFFFFFFF),
                Edx = (uint)(value >> 32)
            };

            int size = Marshal.SizeOf(input);
            IntPtr ptrIn = Marshal.AllocHGlobal(size);

            try
            {
                Marshal.StructureToPtr(input, ptrIn, false);
                uint bytesReturned;
                return DeviceIoControl(_driverHandle, IOCTL_WRMSR, ptrIn, size, IntPtr.Zero, 0, out bytesReturned, IntPtr.Zero);
            }
            catch (Exception ex) { _logger.LogError($"[LowLevelHW] WRMSR 0x{register:X} failed: {ex.Message}"); return false; }
            finally { Marshal.FreeHGlobal(ptrIn); }
        }

        public (int pl1, int pl2, double tau, bool locked) GetDetailedPowerLimits()
        {
            if (!ReadMsr(MSR_PKG_POWER_LIMIT, out ulong val)) return (0, 0, 0, false);

            int pl1 = (int)((val & 0x7FFF) * _powerUnit);
            int pl2 = (int)(((val >> 32) & 0x7FFF) * _powerUnit);
            double tau = TauRawToSeconds((byte)((val >> 17) & 0x7F));
            bool locked = (val & (1UL << 63)) != 0;

            return (pl1, pl2, tau, locked);
        }

        public bool SetPowerLimitsManaged(double pl1, double pl2, double tauSeconds)
        {
            if (!_accessMutex.WaitOne(1000)) return false;
            try
            {
                if (!ReadMsr(MSR_PKG_POWER_LIMIT, out ulong currentVal)) return false;

                // PRESERVE RESERVED BITS AND LOCK BIT
                ulong newVal = currentVal;
                
                // Encoder Tau
                byte tauRaw = SecondsToTauRaw(tauSeconds);
                
                // PL1 (Watts to Raw)
                ulong pl1Raw = (ulong)(pl1 / _powerUnit) & 0x7FFF;
                ulong pl2Raw = (ulong)(pl2 / _powerUnit) & 0x7FFF;

                // Build newVal PL1
                newVal &= ~0x7FFFUL; // Clear PL1
                newVal |= pl1Raw;
                newVal |= (1UL << 15); // Enable PL1
                newVal |= (1UL << 16); // Clamp PL1 (Ensure limit is strictly followed)

                // Build newVal Tau
                newVal &= ~(0x7FUL << 17);
                newVal |= ((ulong)tauRaw << 17);

                // Build newVal PL2
                newVal &= ~(0x7FFFUL << 32); 
                newVal |= (pl2Raw << 32);
                newVal |= (1UL << 47); // Enable PL2
                newVal |= (1UL << 48); // Clamp PL2

                // WRITING MSR
                bool msrSuccess = WriteMsr(MSR_PKG_POWER_LIMIT, newVal);

                // MMIO SYNC (Crucial for Dell/Lenovo/Some Samsung)
                if (_mchBarPhysAddr > 0)
                {
                    WritePhysicalMemory(_mchBarPhysAddr + PACKAGE_POWER_LIMIT_MMIO_OFFSET, newVal);
                }

                return msrSuccess;
            }
            finally { _accessMutex.ReleaseMutex(); }
        }

        public (bool thermal, bool power, bool current) GetSiliconThrottlingFlags()
        {
            if (ReadMsr(MSR_IA32_THERM_STATUS, out ulong val))
            {
                bool thermal = (val & 1UL) != 0; // Bit 0
                bool power = (val & (1UL << 10)) != 0; // Bit 10 (Package Power Limit)
                bool current = (val & (1UL << 3)) != 0; // Bit 3 (Critical Temperature/Current)
                return (thermal, power, current);
            }
            return (false, false, false);
        }

        public bool GetThermalThrottlingStatus()
        {
            if (ReadMsr(MSR_IA32_THERM_STATUS, out ulong val))
            {
                return (val & 0x1UL) != 0; // Bit 0 indicates ACTIVE throttling
            }
            return false;
        }

        public bool SetBdProchot(bool enabled)
        {
            if (!_accessMutex.WaitOne(1000)) return false;
            try
            {
                if (!ReadMsr(MSR_IA32_POWER_CTL, out ulong val)) return false;
                
                if (enabled) val |= 0x1UL;
                else val &= ~0x1UL;
                
                return WriteMsr(MSR_IA32_POWER_CTL, val);
            }
            finally { _accessMutex.ReleaseMutex(); }
        }

        #region Helpers
        private bool ReadPciConfig(uint address, out uint value)
        {
            value = 0;
            if (!_isLoaded || _driverHandle == null) return false;
            IntPtr ptrOut = Marshal.AllocHGlobal(4);
            try
            {
                uint bytesReturned;
                bool success = DeviceIoControl(_driverHandle, IOCTL_READ_PCI_CONFIG, (IntPtr)address, 4, ptrOut, 4, out bytesReturned, IntPtr.Zero);
                if (success) value = (uint)Marshal.ReadInt32(ptrOut);
                return success;
            }
            finally { Marshal.FreeHGlobal(ptrOut); }
        }

        private bool WritePhysicalMemory(ulong address, ulong data)
        {
            if (!_isLoaded || _driverHandle == null) return false;
            var input = new PHYS_MEM_STRUCTURE { PhysicalAddress = address, Size = 8, Data = data };
            int size = Marshal.SizeOf(input);
            IntPtr ptrIn = Marshal.AllocHGlobal(size);
            try
            {
                Marshal.StructureToPtr(input, ptrIn, false);
                uint bytesReturned;
                return DeviceIoControl(_driverHandle, IOCTL_WRITE_PHYSICAL_MEMORY, ptrIn, size, IntPtr.Zero, 0, out bytesReturned, IntPtr.Zero);
            }
            finally { Marshal.FreeHGlobal(ptrIn); }
        }

        public byte SecondsToTauRaw(double seconds)
        {
            for (byte y = 0; y < 32; y++)
            {
                for (byte x = 0; x < 4; x++)
                {
                    double test = (1.0 + x / 4.0) * Math.Pow(2, y) * _timeUnit;
                    if (test >= seconds) return (byte)((x << 5) | y);
                }
            }
            return 0x6E; 
        }

        public double TauRawToSeconds(byte raw)
        {
            uint x = (uint)((raw >> 5) & 0x3);
            uint y = (uint)(raw & 0x1F);
            return (1.0 + x / 4.0) * Math.Pow(2, y) * _timeUnit;
        }
        #endregion

        #region Native P/Invoke
        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        private static extern SafeFileHandle CreateFile(string lpFileName, NativeFileAccess dwDesiredAccess, FileShare dwShareMode, IntPtr lpSecurityAttributes, FileMode dwCreationDisposition, uint dwFlagsAndAttributes, IntPtr hTemplateFile);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool DeviceIoControl(SafeFileHandle hDevice, uint dwIoControlCode, IntPtr lpInBuffer, int nInBufferSize, IntPtr lpOutBuffer, int nOutBufferSize, out uint lpBytesReturned, IntPtr lpOverlapped);

        [Flags] public enum NativeFileAccess : uint { ReadDevice = 0x80000000, WriteDevice = 0x40000000, ReadWrite = ReadDevice | WriteDevice }
        #endregion

        public void Dispose()
        {
            try
            {
                // Fechar a instância do Computer se estiver aberta
                if (_computer != null)
                {
                    _logger.LogDebug("[LowLevelHW] Closing LibreHardwareMonitor Computer instance...");
                    _computer.Close();
                    _computer = null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogDebug($"[LowLevelHW] Error closing Computer: {ex.Message}");
            }
            
            _driverHandle?.Dispose();
            _accessMutex.Dispose();
        }
    }
}
