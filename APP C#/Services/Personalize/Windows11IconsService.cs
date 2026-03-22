using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.Personalize
{
    public class Windows11IconsService
    {
        private const string TAG = "[Win11Icons]";
        private readonly ILoggingService _logger;

        private const string SHELL_ICONS_KEY = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Shell Icons";
        private const string CLSID_BASE_KEY = @"Software\Microsoft\Windows\CurrentVersion\Explorer\CLSID";

        private const string RECYCLE_BIN_CLSID = "{645FF040-5081-101B-9F08-00AA002F954E}";
        private const string THIS_PC_CLSID = "{20D04FE0-3AEA-1069-A2D8-08002B30309D}";
        private const string NETWORK_CLSID = "{208D2C60-3AEA-1069-A2D7-08002B30309D}";

        // Import do SHChangeNotify para refresh do explorer imediato sem precisar de reiniciar processo (ou ajudar nisso)
        [DllImport("shell32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern void SHChangeNotify(int wEventId, int uFlags, IntPtr dwItem1, IntPtr dwItem2);
        private const int SHCNE_ASSOCCHANGED = 0x08000000;
        private const int SHCNF_IDLIST = 0x0000;

        [DllImport("user32.dll", SetLastError = true)]
        private static extern IntPtr SendMessageTimeout(IntPtr hWnd, uint Msg, IntPtr wParam, string lParam, uint fuFlags, uint uTimeout, out IntPtr lpdwResult);
        private const uint WM_SETTINGCHANGE = 0x1A;
        private const uint SMTO_ABORTIFHUNG = 0x0002;
        private static readonly IntPtr HWND_BROADCAST = new IntPtr(0xffff);

        // Mapeamento massivo das chaves "Shell Icons" englobando o MÁXIMO da UI nativa
        private readonly Dictionary<string, string> _shellIconsMap = new()
        {
            { "0", @"files\generic.ico" },
            { "1", @"files\document.ico" },
            { "3", @"folders\folder.ico" },
            { "4", @"folders\folder.ico" },
            { "5", @"devices\drives\floppy1.ico" },
            { "6", @"devices\drives\floppy2.ico" },
            { "7", @"devices\drives\drive.ico" },
            { "8", @"devices\drives\drive.ico" },
            { "9", @"devices\drives\network.ico" },
            { "10", @"devices\drives\networkdelete.ico" },
            { "11", @"devices\drives\disc.ico" },
            { "12", @"devices\drives\card.ico" },
            { "13", @"folders\network.ico" },
            { "14", @"folders\network.ico" },
            { "15", @"folders\network.ico" },
            { "16", @"devices\printers\printer.ico" },
            { "17", @"folders\network.ico" },
            { "18", @"folders\network.ico" },
            { "19", @"folders\recent.ico" },
            { "20", @"folders\recent.ico" },
            { "21", @"objects\options.ico" },
            { "22", @"objects\options.ico" },
            { "23", @"files\configuration.ico" },
            { "24", @"objects\magnifier.ico" },
            { "27", @"emblems\shortcut.ico" },
            { "28", @"emblems\share.ico" },
            { "29", @"emblems\shortcut.ico" },
            { "31", @"objects\recyclebinempty.ico" },
            { "32", @"objects\recyclebinfull.ico" },
            { "34", @"folders\desktop.ico" },
            { "35", @"applications\controlpanel.ico" },
            { "38", @"folders\fonts.ico" },
            { "39", @"applications\taskmanager.ico" },
            { "40", @"folders\music.ico" },
            { "41", @"emblems\error.ico" },
            { "42", @"folders\folder.ico" },
            { "43", @"folders\favorites.ico" },
            { "44", @"folders\favorites.ico" },
            { "46", @"objects\lock.ico" },
            { "47", @"objects\lock.ico" },
            { "51", @"objects\pin.ico" },
            { "54", @"objects\options.ico" },
            { "71", @"devices\printers\check.ico" },
            { "72", @"devices\printers\network.ico" },
            { "73", @"devices\printers\file.ico" },
            { "77", @"files\generic.ico" },
            { "137", @"files\configuration.ico" },
            { "156", @"files\text.ico" },
            { "167", @"folders\links.ico" },
            { "235", @"folders\games.ico" },
            { "275", @"folders\downloads.ico" },
            { "290", @"folders\user.ico" }
        };

        // Mapeamento específico para as pastas de usuário (Downloads, Documentos, etc.) que não usam shell32 
        private readonly Dictionary<string, string> _userFoldersMap = new()
        {
            { "{B4BFCC3A-DB2C-424C-B029-7FE99A87C641}", @"folders\desktop.ico" },
            { "{d3162b92-9365-467a-956b-92703aca08af}", @"folders\documents.ico" },
            { "{088e3905-0323-4b02-9826-5d99428e115f}", @"folders\downloads.ico" },
            { "{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}", @"folders\music.ico" },
            { "{24ad3ad4-a569-4530-98e1-ab02f9417aa8}", @"folders\pictures.ico" },
            { "{f86fa3ab-70d2-4fc7-9c99-fcbf05467f3a}", @"folders\videos.ico" },
            { "{0DB7E03F-FC29-4DC6-9020-FF41B59E513A}", @"folders\3dobjects.ico" },
            // Physical known folders (Essenciais para o lado direito do Acesso Rápido)
            { "{7B0DB17D-9CD2-4A93-9733-46CC89022E7C}", @"folders\desktop.ico" },
            { "{FDD39AD0-238F-46AF-ADB4-6C85480369C7}", @"folders\documents.ico" },
            { "{374DE290-123F-4565-9164-39C4925E467B}", @"folders\downloads.ico" },
            { "{4BD8D571-6D19-48D3-BE97-422220080E43}", @"folders\music.ico" },
            { "{33E28130-4E1E-4676-835A-98395C3BC3BB}", @"folders\pictures.ico" },
            { "{18989B1D-99B5-455B-841C-AB7C74E4DDFC}", @"folders\videos.ico" },
            
            // "Local" Physical known folders (Quando OneDrive está ativo ou redirecionado)
            { "{f42ee2d3-909f-4907-8871-4c22fc0bf756}", @"folders\documents.ico" },
            { "{7d83ee9b-2244-4e70-b1f5-5393042af1e4}", @"folders\downloads.ico" },
            { "{a0c69a99-21c8-4671-8703-7934162fcf1d}", @"folders\music.ico" },
            { "{0ddd015d-b06c-45d5-8c4c-f59713854639}", @"folders\pictures.ico" },
            { "{35286a68-3c57-41a1-bbb1-0eae73d76c95}", @"folders\videos.ico" },
            
            { "{679f85cb-0220-4080-b29b-5540cc05aab6}", @"folders\favorites.ico" }, // Acesso Rápido (Quick Access)
            { "{018D5C66-4533-4307-9B53-224DE2ED1FE6}", @"onedrive\cloud.ico" }      // Ícone do OneDrive na árvore de navegação
        };

        public Windows11IconsService(ILoggingService logger)
        {
            _logger = logger;
        }

        public bool IsInstalled()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(SHELL_ICONS_KEY);
                if (key != null)
                {
                    // Se a chave existe e tem pelo menos o valor "3" (pasta), consideramos instalado
                    return key.GetValue("3") != null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} Erro ao verificar estado da instalação: {ex.Message}", ex);
            }
            return false;
        }

        public async Task<bool> InstallIconsAsync()
        {
            _logger.LogInfo($"{TAG} Iniciando instalação dos ícones do Windows 11...");
            return await Task.Run(() =>
            {
                try
                {
                    string sourceDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Windows11Icons");
                    _logger.LogDebug($"{TAG} Tentando sourceDir principal: {sourceDir}");
                    // Se não tiver na BaseDirectory, tenta no root do projeto em desenvolvimento
                    if (!Directory.Exists(sourceDir))
                    {
                        sourceDir = Path.Combine(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory)?.Parent?.Parent?.Parent?.FullName ?? "", "Windows11Icons");
                        _logger.LogDebug($"{TAG} Tentando sourceDir de desenvolvimento: {sourceDir}");
                    }

                    if (!Directory.Exists(sourceDir))
                    {
                        _logger.LogError($"{TAG} Pasta fonte dos ícones não encontrada em nenhum local: {sourceDir}", null);
                        return false;
                    }
                    _logger.LogInfo($"{TAG} Pasta fonte dos ícones resolvida e validada: {sourceDir}");

                    // A pasta de destino persistente do Voltris
                    string destDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Voltris", "Windows11Icons");
                    _logger.LogDebug($"{TAG} Diretório de destino persistente (AppData): {destDir}");
                    if (!Directory.Exists(destDir))
                    {
                        Directory.CreateDirectory(destDir);
                        _logger.LogInfo($"{TAG} O diretório de destino não existia e foi criado com sucesso.");
                    }

                    _logger.LogInfo($"{TAG} Copiando ícones para {destDir}");

                    // Registra os Shell Icons em HKLM
                    using (var key = Registry.LocalMachine.CreateSubKey(SHELL_ICONS_KEY))
                    {
                        _logger.LogDebug($"{TAG} Chave HKLM Shell Icons criada/aberta. Iniciando rastreio de { _shellIconsMap.Count } mapeamentos.");
                        foreach (var kvp in _shellIconsMap)
                        {
                            string sourceFile = Path.Combine(sourceDir, kvp.Value);
                            if (File.Exists(sourceFile))
                            {
                                // Prevenir colisão de nomes adicionando o ID (kvp.Key) da chave do registry
                                string destFile = Path.Combine(destDir, $"icon_{kvp.Key}_{Path.GetFileName(sourceFile)}");
                                _logger.LogDebug($"{TAG} [Shell Icons] Key '{kvp.Key}' -> Copiando de '{sourceFile}' para '{destFile}'.");
                                File.Copy(sourceFile, destFile, true);
                                // O Windows exige ",0" no final para capturar o primeiro índice do ícone e evitar bugs de renderização
                                key.SetValue(kvp.Key, $"{destFile},0", RegistryValueKind.String);
                                _logger.LogDebug($"{TAG} [Shell Icons] Key '{kvp.Key}' salva com sucesso em '{destFile},0' no Registro.");
                            }
                            else
                            {
                                _logger.LogWarning($"{TAG} [Shell Icons] [FALHA] Ícone não encontrado fisicamente: {sourceFile}");
                            }
                        }
                    }

                    // Registra Lixeira e Este Computador (HKCU)
                    string clsidKey = CLSID_BASE_KEY;
                    _logger.LogDebug($"{TAG} Prosseguindo para modificar as chaves HKCU de CLSIDs de Desktop...");

                    // Lixeira
                    string rbEmpty = Path.Combine(sourceDir, @"objects\recyclebinempty.ico");
                    string rbFull = Path.Combine(sourceDir, @"objects\recyclebinfull.ico");
                    if (File.Exists(rbEmpty) && File.Exists(rbFull))
                    {
                        var destEmpty = Path.Combine(destDir, "sys_recyclebinempty.ico");
                        var destFull = Path.Combine(destDir, "sys_recyclebinfull.ico");
                        _logger.LogDebug($"{TAG} Copiando ícones da Lixeira ('{rbEmpty}' e '{rbFull}').");
                        File.Copy(rbEmpty, destEmpty, true);
                        File.Copy(rbFull, destFull, true);

                        using var lixeiraKey = Registry.CurrentUser.CreateSubKey($@"{clsidKey}\{RECYCLE_BIN_CLSID}\DefaultIcon");
                        lixeiraKey.SetValue("", $"{destEmpty},0");
                        lixeiraKey.SetValue("empty", $"{destEmpty},0");
                        lixeiraKey.SetValue("full", $"{destFull},0");
                        _logger.LogDebug($"{TAG} Lixeira ativada com sucesso no Registro HKCU.");
                    }
                    else { _logger.LogWarning($"{TAG} [CLSIDs] Os ícones da Lixeira não foram achados no source dir."); }

                    // Este Computador
                    string thisPcIcon = Path.Combine(sourceDir, @"devices\monitors\monitor.ico");
                    if (File.Exists(thisPcIcon))
                    {
                        var destPc = Path.Combine(destDir, "sys_monitor.ico");
                        _logger.LogDebug($"{TAG} Copiando ícone d'Este Computador ('{thisPcIcon}').");
                        File.Copy(thisPcIcon, destPc, true);
                        using var pcKey = Registry.CurrentUser.CreateSubKey($@"{clsidKey}\{THIS_PC_CLSID}\DefaultIcon");
                        pcKey.SetValue("", $"{destPc},0");
                        _logger.LogDebug($"{TAG} Este Computador ativado com sucesso no Registro HKCU.");
                    }
                    else { _logger.LogWarning($"{TAG} [CLSIDs] O ícone d'Este Computador não foi achado no source dir."); }

                    // Rede
                    string networkIcon = Path.Combine(sourceDir, @"folders\network.ico");
                    if (File.Exists(networkIcon))
                    {
                        var destNet = Path.Combine(destDir, "sys_network.ico");
                        _logger.LogDebug($"{TAG} Copiando ícone da Rede ('{networkIcon}').");
                        File.Copy(networkIcon, destNet, true);
                        using var netKey = Registry.CurrentUser.CreateSubKey($@"{clsidKey}\{NETWORK_CLSID}\DefaultIcon");
                        netKey.SetValue("", $"{destNet},0");
                        _logger.LogDebug($"{TAG} Rede ativada com sucesso no Registro HKCU.");
                    }
                    else { _logger.LogWarning($"{TAG} [CLSIDs] O ícone de Rede não foi achado no source dir."); }

                    // Drive Exclusivo do Sistema (Onde o Windows está instalado)
                    string osDriveLetter = Path.GetPathRoot(Environment.SystemDirectory)?.TrimEnd('\\', ':') ?? "C";
                    string osDriveIcon = Path.Combine(sourceDir, @"devices\drives\windows.ico");
                    if (File.Exists(osDriveIcon))
                    {
                        var destOsDrive = Path.Combine(destDir, "sys_osdrive.ico");
                        _logger.LogDebug($"{TAG} Configurando o logo do Windows exclusivamente para o drive {osDriveLetter}:");
                        File.Copy(osDriveIcon, destOsDrive, true);
                        using var driveKey = Registry.CurrentUser.CreateSubKey($@"Software\Classes\DriveIcons\{osDriveLetter}\DefaultIcon");
                        driveKey.SetValue("", $"{destOsDrive},0");
                    }

                    // Diretórios locais físicos para injetar via desktop.ini (garante Quick Access Right Pane)
                    try
                    {
                        var specialFolders = new Dictionary<Environment.SpecialFolder, string>
                        {
                            { Environment.SpecialFolder.Desktop, "userfolder_{B4BFCC3A-DB2C-424C-B029-7FE99A87C641}.ico" },
                            { Environment.SpecialFolder.MyDocuments, "userfolder_{d3162b92-9365-467a-956b-92703aca08af}.ico" },
                            { Environment.SpecialFolder.UserProfile, "userfolder_{downloads_placeholder}" }, // Processado manualmente abaixo
                            { Environment.SpecialFolder.MyMusic, "userfolder_{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}.ico" },
                            { Environment.SpecialFolder.MyPictures, "userfolder_{24ad3ad4-a569-4530-98e1-ab02f9417aa8}.ico" },
                            { Environment.SpecialFolder.MyVideos, "userfolder_{f86fa3ab-70d2-4fc7-9c99-fcbf05467f3a}.ico" }
                        };

                        foreach (var f in specialFolders)
                        {
                            string path = f.Key == Environment.SpecialFolder.UserProfile ? 
                                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads") : 
                                Environment.GetFolderPath(f.Key);

                            string iconName = f.Key == Environment.SpecialFolder.UserProfile ? 
                                "userfolder_{088e3905-0323-4b02-9826-5d99428e115f}.ico" : f.Value;

                            if (Directory.Exists(path))
                            {
                                string iniPath = Path.Combine(path, "desktop.ini");
                                string targetIco = Path.Combine(destDir, iconName);
                                
                                if (File.Exists(targetIco))
                                {
                                    // Remove colunas de leitura caso existam
                                    if (File.Exists(iniPath)) File.SetAttributes(iniPath, File.GetAttributes(iniPath) & ~FileAttributes.ReadOnly & ~FileAttributes.Hidden & ~FileAttributes.System);
                                    
                                    var iniContent = new List<string>();
                                    bool hasClassInfo = false;
                                    
                                    if (File.Exists(iniPath))
                                    {
                                        var lines = File.ReadAllLines(iniPath);
                                        foreach(var line in lines)
                                        {
                                            if (line.StartsWith("IconResource", StringComparison.OrdinalIgnoreCase)) continue;
                                            if (line.StartsWith("IconFile", StringComparison.OrdinalIgnoreCase)) continue;
                                            if (line.StartsWith("IconIndex", StringComparison.OrdinalIgnoreCase)) continue;
                                            
                                            iniContent.Add(line);
                                            if (line.Trim().Equals("[.ShellClassInfo]", StringComparison.OrdinalIgnoreCase)) hasClassInfo = true;
                                        }
                                    }
                                    
                                    if (!hasClassInfo) iniContent.Insert(0, "[.ShellClassInfo]");
                                    
                                    int classInfoIdx = iniContent.FindIndex(l => l.Trim().Equals("[.ShellClassInfo]", StringComparison.OrdinalIgnoreCase));
                                    iniContent.Insert(classInfoIdx + 1, $"IconResource={targetIco},0");
                                    
                                    File.WriteAllLines(iniPath, iniContent);
                                    File.SetAttributes(iniPath, FileAttributes.Hidden | FileAttributes.System);
                                    File.SetAttributes(path, File.GetAttributes(path) | FileAttributes.ReadOnly);
                                    _logger.LogDebug($"{TAG} Desktop.ini atualizado para a pasta física: {path}");
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"{TAG} Erro ao aplicar desktop.ini nas pastas físicas: {ex.Message}");
                    }

                    // Registra User Folders (Desktop, Docs, Downloads, etc.) que usam imageres.dll no Windows 10
                    string classesClsidKey = @"Software\Classes\CLSID";
                    string explorerClsidKey = @"Software\Microsoft\Windows\CurrentVersion\Explorer\CLSID";
                    _logger.LogDebug($"{TAG} Configurando ícones para Pastas de Usuário explícitas...");
                    using (var rootKey = Registry.CurrentUser.CreateSubKey(classesClsidKey))
                    using (var expRootKey = Registry.CurrentUser.CreateSubKey(explorerClsidKey))
                    {
                        foreach (var kvp in _userFoldersMap)
                        {
                            string sourceFile = Path.Combine(sourceDir, kvp.Value);
                            if (File.Exists(sourceFile))
                            {
                                string destFile = Path.Combine(destDir, $"userfolder_{kvp.Key}.ico");
                                File.Copy(sourceFile, destFile, true);
                                using var folderKey = Registry.CurrentUser.CreateSubKey($@"{classesClsidKey}\{kvp.Key}\DefaultIcon");
                                folderKey.SetValue("", $"{destFile},0", RegistryValueKind.String);
                                using var expFolderKey = Registry.CurrentUser.CreateSubKey($@"{explorerClsidKey}\{kvp.Key}\DefaultIcon");
                                expFolderKey.SetValue("", $"{destFile},0", RegistryValueKind.String);
                                _logger.LogDebug($"{TAG} [UserFolders] Key '{kvp.Key}' ativada com sucesso com ícone '{destFile}'. (HKCU)");
                            }
                            else
                            {
                                _logger.LogWarning($"{TAG} [UserFolders] [FALHA] Ícone não encontrado: {sourceFile} para chave {kvp.Key}");
                            }
                        }
                    }

                    // Forçar HKLM para o Acesso Rápido (Quick Access) que às vezes ignora o HKCU
                    string qaDestFile = Path.Combine(destDir, "userfolder_{679f85cb-0220-4080-b29b-5540cc05aab6}.ico");
                    if (File.Exists(qaDestFile))
                    {
                        try
                        {
                            using var qaKey = Registry.LocalMachine.CreateSubKey($@"SOFTWARE\Classes\CLSID\{{679f85cb-0220-4080-b29b-5540cc05aab6}}\DefaultIcon");
                            if (qaKey != null)
                            {
                                qaKey.SetValue("", $"{qaDestFile},0", RegistryValueKind.String);
                                _logger.LogDebug($"{TAG} Forçou o ícone do Acesso Rápido globalmente no HKLM.");
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"{TAG} Não foi possível forçar HKLM para Acesso Rápido: {ex.Message}");
                        }
                    }

                    // Garantia Definitiva de PROGIDs base do Windows (Pastas base e HDs genéricos fora do Shell32)
                    _logger.LogDebug($"{TAG} Adicionando chaves blindadas de redundância para PROGIDs principais...");
                    var progIdMap = new Dictionary<string, string>
                    {
                        { @"Drive\DefaultIcon", @"devices\drives\drive.ico" }
                    };
                    foreach (var kvp in progIdMap)
                    {
                        string sFile = Path.Combine(sourceDir, kvp.Value);
                        if (File.Exists(sFile))
                        {
                            string dFile = Path.Combine(destDir, $"progid_{Path.GetFileName(kvp.Value)}");
                            File.Copy(sFile, dFile, true);
                            using var pkKey = Registry.CurrentUser.CreateSubKey($@"Software\Classes\{kvp.Key}");
                            pkKey.SetValue("", $"{dFile},0");
                            _logger.LogDebug($"{TAG} Redundância garantida para PROGID: {kvp.Key}");
                        }
                    }

                    // Limpeza de Chaves Destrutivas (Corrigir o Taskbar Bug)
                    // Nunca devemos sobrescrever exefile, batfile, cmdfile, dllfile, pois eles usam "%1" nativamente para puxar as engrenagens e ícones embutidos. 
                    var badProgIds = new string[] {
                        @"Software\Classes\exefile\DefaultIcon",
                        @"Software\Classes\batfile\DefaultIcon",
                        @"Software\Classes\cmdfile\DefaultIcon",
                        @"Software\Classes\dllfile\DefaultIcon",
                        @"Software\Classes\vbsfile\DefaultIcon",
                        @"Software\Classes\regfile\DefaultIcon"
                    };
                    foreach (var bad in badProgIds) {
                        try { Registry.CurrentUser.DeleteSubKeyTree(bad, false); } catch {}
                    }

                    // 4. Processar TODAS as extensões e tipos de arquivos genéricos em massa
                    string filesDir = Path.Combine(sourceDir, "files");
                    if (Directory.Exists(filesDir))
                    {
                        var fileTypeMap = new Dictionary<string, string>
                        {
                            { "audio", @"SystemFileAssociations\audio\DefaultIcon" },
                            { "video", @"SystemFileAssociations\video\DefaultIcon" },
                            { "image", @"SystemFileAssociations\image\DefaultIcon" },
                            { "text", @"txtfile\DefaultIcon" },
                            { "document", @"SystemFileAssociations\document\DefaultIcon" },
                            { "zip", @"CompressedFolder\DefaultIcon" },
                            { "font", @"ttffile\DefaultIcon" },
                            { "text2", @"inifile\DefaultIcon" }
                        };
                        foreach (var kvp in fileTypeMap)
                        {
                            string iconPath = Path.Combine(filesDir, $"{kvp.Key}.ico");
                            if (File.Exists(iconPath))
                            {
                                string destFile = Path.Combine(destDir, $"filetype_{kvp.Key}.ico");
                                File.Copy(iconPath, destFile, true);
                                using var fileKey = Registry.CurrentUser.CreateSubKey($@"Software\Classes\{kvp.Value}");
                                fileKey.SetValue("", $"{destFile},0", RegistryValueKind.String);
                                _logger.LogDebug($"{TAG} [Files] Extensão '{kvp.Key}' vinculada ao ícone sem exceções.");
                            }
                        }
                    }

                    // 5. Processar TODOS os aplicativos listados no pacote sem exceção
                    string appsDir = Path.Combine(sourceDir, "applications");
                    if (Directory.Exists(appsDir))
                    {
                        foreach (var appIcon in Directory.GetFiles(appsDir, "*.ico"))
                        {
                            string appName = Path.GetFileNameWithoutExtension(appIcon);
                            if (string.IsNullOrWhiteSpace(appName)) continue;

                            string destFile = Path.Combine(destDir, $"app_{appName}.ico");
                            File.Copy(appIcon, destFile, true);
                            
                            string exeName = appName.ToLower() switch
                            {
                                "word" => "winword.exe",
                                "excel" => "excel.exe",
                                "powerpoint" => "powerpnt.exe",
                                "access" => "msaccess.exe",
                                "publisher" => "mspub.exe",
                                "outlook" => "outlook.exe",
                                "project" => "winproj.exe",
                                "visio" => "visio.exe",
                                "visualcode" => "code.exe",
                                "visualstudio" => "devenv.exe",
                                "teams" => "teams.exe",
                                "edge" => "msedge.exe",
                                "chrome" => "chrome.exe",
                                "calculator" => "calc.exe",
                                _ => $"{appName}.exe"
                            };

                            using var appKey = Registry.CurrentUser.CreateSubKey($@"Software\Classes\Applications\{exeName}\DefaultIcon");
                            appKey.SetValue("", $"{destFile},0", RegistryValueKind.String);
                        }
                        _logger.LogDebug($"{TAG} [Apps] Todos os ícones de aplicativos injetados em Software\\Classes\\Applications\\<exe>.");
                    }

                    RefreshExplorer();
                    _logger.LogSuccess($"{TAG} Ícones do Windows 11 aplicados. Tudo profissional e sem trocar DLL.");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"{TAG} Erro ao instalar os ícones: {ex.Message}", ex);
                    return false;
                }
            });
        }

        public async Task<bool> UninstallIconsAsync()
        {
            _logger.LogInfo($"{TAG} Revertendo alterações de ícones para o padrão do sistema...");
            return await Task.Run(() =>
            {
                try
                {
                    // Apaga as chaves "Shell Icons"
                    Registry.LocalMachine.DeleteSubKeyTree(SHELL_ICONS_KEY, false);
                    _logger.LogDebug($"{TAG} Chave do Registro (HKLM) de Shell Icons deletada da máquina.");

                    // Reverter Lixeira e Este Computador
                    Registry.CurrentUser.DeleteSubKeyTree($@"{CLSID_BASE_KEY}\{RECYCLE_BIN_CLSID}\DefaultIcon", false);
                    _logger.LogDebug($"{TAG} Chaves de ícone da Lixeira (HKCU) revertidas ao original.");
                    
                    Registry.CurrentUser.DeleteSubKeyTree($@"{CLSID_BASE_KEY}\{THIS_PC_CLSID}\DefaultIcon", false);
                    _logger.LogDebug($"{TAG} Chaves de ícone de Este Computador (HKCU) revertidas ao original.");

                    Registry.CurrentUser.DeleteSubKeyTree($@"{CLSID_BASE_KEY}\{NETWORK_CLSID}\DefaultIcon", false);
                    _logger.LogDebug($"{TAG} Chaves de ícone de Rede (HKCU) revertidas ao original.");

                    // Reverter Drive de Sistema Exclusivo
                    string osDriveLetter = Path.GetPathRoot(Environment.SystemDirectory)?.TrimEnd('\\', ':') ?? "C";
                    Registry.CurrentUser.DeleteSubKeyTree($@"Software\Classes\DriveIcons\{osDriveLetter}\DefaultIcon", false);

                    // Reverter User Folders explícitos
                    foreach (var kvp in _userFoldersMap)
                    {
                        Registry.CurrentUser.DeleteSubKeyTree($@"Software\Classes\CLSID\{kvp.Key}\DefaultIcon", false);
                        Registry.CurrentUser.DeleteSubKeyTree($@"Software\Microsoft\Windows\CurrentVersion\Explorer\CLSID\{kvp.Key}\DefaultIcon", false);
                        _logger.LogDebug($"{TAG} Chave HKCU UserFolder ({kvp.Key}) revertida.");
                    }

                    try 
                    {
                        Registry.LocalMachine.DeleteSubKeyTree($@"SOFTWARE\Classes\CLSID\{{679f85cb-0220-4080-b29b-5540cc05aab6}}\DefaultIcon", false);
                    } 
                    catch { }

                    // Reverter TODAS as extensões e aplicativos em massa
                    try
                    {
                        var fileTypeMap = new string[] {
                            @"Software\Classes\Folder\DefaultIcon",
                            @"Software\Classes\Directory\DefaultIcon",
                            @"Software\Classes\Drive\DefaultIcon",
                            @"Software\Classes\SystemFileAssociations\audio\DefaultIcon",
                            @"Software\Classes\SystemFileAssociations\video\DefaultIcon",
                            @"Software\Classes\SystemFileAssociations\image\DefaultIcon",
                            @"Software\Classes\txtfile\DefaultIcon",
                            @"Software\Classes\SystemFileAssociations\document\DefaultIcon",
                            @"Software\Classes\CompressedFolder\DefaultIcon",
                            @"Software\Classes\exefile\DefaultIcon",
                            @"Software\Classes\batfile\DefaultIcon",
                            @"Software\Classes\cmdfile\DefaultIcon",
                            @"Software\Classes\ttffile\DefaultIcon",
                            @"Software\Classes\dllfile\DefaultIcon",
                            @"Software\Classes\inifile\DefaultIcon",
                            @"Software\Classes\vbsfile\DefaultIcon",
                            @"Software\Classes\regfile\DefaultIcon"
                        };
                        foreach (var k in fileTypeMap) Registry.CurrentUser.DeleteSubKeyTree(k, false);

                        using var appsRoot = Registry.CurrentUser.OpenSubKey(@"Software\Classes\Applications", true);
                        if (appsRoot != null)
                        {
                            foreach (var exeKey in appsRoot.GetSubKeyNames())
                            {
                                appsRoot.DeleteSubKeyTree($@"{exeKey}\DefaultIcon", false);
                            }
                        }
                        
                        // Remover desktop.ini overloads
                        var paths = new[] { Environment.GetFolderPath(Environment.SpecialFolder.Desktop), Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), Environment.GetFolderPath(Environment.SpecialFolder.MyMusic), Environment.GetFolderPath(Environment.SpecialFolder.MyPictures), Environment.GetFolderPath(Environment.SpecialFolder.MyVideos), Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads") };
                        foreach(var p in paths) {
                            string ini = Path.Combine(p, "desktop.ini");
                            if (File.Exists(ini)) {
                                File.SetAttributes(ini, File.GetAttributes(ini) & ~FileAttributes.ReadOnly & ~FileAttributes.Hidden & ~FileAttributes.System);
                                var lines = File.ReadAllLines(ini).Where(l => !l.StartsWith("IconResource") && !l.StartsWith("IconFile") && !l.StartsWith("IconIndex")).ToList();
                                File.WriteAllLines(ini, lines);
                                File.SetAttributes(ini, FileAttributes.Hidden | FileAttributes.System);
                            }
                        }

                        _logger.LogDebug($"{TAG} Todas as extensões e aplicativos e INIs foram removidos ou limpos.");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"{TAG} Falha não crítica ao limpar extensões: {ex.Message}");
                    }

                    // Pode limpar a pasta destDir também, mas vamos deixar lá caso ele reinstale.

                    RefreshExplorer();
                    _logger.LogSuccess($"{TAG} Ícones revertidos ao padrão original (sem tela preta e seguro).");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"{TAG} Erro ao remover ícones: {ex.Message}", ex);
                    return false;
                }
            });
        }

        private void RefreshExplorer()
        {
            // Notifica o Windows para recarregar todos os ícones da cache (SHChangeNotify)
            _logger.LogInfo($"{TAG} Enviando flush de ícones para o Explorer...");
            SHChangeNotify(SHCNE_ASSOCCHANGED, SHCNF_IDLIST, IntPtr.Zero, IntPtr.Zero);
            
            // Broadcast WM_SETTINGCHANGE para as janelas se atualizarem
            SendMessageTimeout(HWND_BROADCAST, WM_SETTINGCHANGE, IntPtr.Zero, "Environment", SMTO_ABORTIFHUNG, 5000, out _);

            // Executar ie4uinit para forçar a renovação do cache de ícones (processo no Windows 10 responsável por recarregar ícones sem tela preta)
            try
            {
                using var p = new System.Diagnostics.Process();
                p.StartInfo.FileName = "ie4uinit.exe";
                p.StartInfo.Arguments = "-show";
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.CreateNoWindow = true;
                p.Start();
                _logger.LogInfo($"{TAG} O comando ie4uinit.exe foi enviado para reconstruir o cache de ícones.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} Erro ao executar ie4uinit.exe: {ex.Message}", ex);
            }
        }
    }
}
