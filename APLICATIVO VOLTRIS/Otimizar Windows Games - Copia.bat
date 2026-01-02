@echo off
setlocal enabledelayedexpansion

openfiles >nul 2>&1
if %errorlevel% neq 0 (
    color 4
    echo This script requires administrator privileges.
    echo Please run WinScript as an administrator.
    pause
    exit /b 1
)

REM Loop para otimizar todas as unidades disponíveis
for %%d in (C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
    if exist %%d:\ (
        echo Otimizando unidade %%d:...
        defrag %%d: /O /V
    )
)

:: Reinicialização da Rede
:: Limpa o cache DNS e renova a configuração de IP para corrigir problemas de rede.
echo -- Resetting Network
ipconfig /flushdns
ipconfig /release
ipconfig /renew

:: Desativação do Internet Explorer
:: Remove o Internet Explorer como recurso opcional do Windows.
echo -- Disabling Internet Explorer
dism /online /Remove-Capability /CapabilityName:Browser.InternetExplorer~~~~0.0.11.0.

:: Desativação do Hyper-V
:: Desativa o recurso de virtualização Hyper-V, se presente, sem reiniciar.
echo -- Disabling Hyper-V
powershell -Command "try { Disable-WindowsOptionalFeature -FeatureName "Microsoft-Hyper-V-All" -Online -NoRestart -ErrorAction Stop; Write-Output "Successfully disabled the feature Microsoft-Hyper-V-All." } catch { Write-Output "Feature not found." }"

:: Desativação de Fax e Scan
:: Desativa o recurso de Fax e Scan, se presente, sem reiniciar.
echo -- Disabling Fax and Scan
powershell -Command "try { Disable-WindowsOptionalFeature -FeatureName "FaxServicesClientPackage" -Online -NoRestart -ErrorAction Stop; Write-Output "Successfully disabled the feature FaxServicesClientPackage." } catch { Write-Output "Feature not found." }"

:: Desativação do Windows Media Player
:: Desativa o Windows Media Player como recurso opcional, se presente, sem reiniciar.
echo -- Disabling Windows Media Player
powershell -Command "try { Disable-WindowsOptionalFeature -FeatureName "WindowsMediaPlayer" -Online -NoRestart -ErrorAction Stop; Write-Output "Successfully disabled the feature WindowsMediaPlayer." } catch { Write-Output "Feature not found." }"

:: Encerramento e Remoção do OneDrive
:: Encerra o processo do OneDrive, desinstala o aplicativo e remove pastas e chaves de registro associadas.
echo -- Killing OneDrive Process
taskkill /f /im OneDrive.exe
echo -- Uninstalling OneDrive through the installers
if exist "%SystemRoot%\System32\OneDriveSetup.exe" (
    "%SystemRoot%\System32\OneDriveSetup.exe" /uninstall
)
if exist "%SystemRoot%\SysWOW64\OneDriveSetup.exe" (
    "%SystemRoot%\SysWOW64\OneDriveSetup.exe" /uninstall
)
echo -- Removing OneDrive registry keys
reg delete "HKEY_CLASSES_ROOT\WOW6432Node\CLSID\{018D5C66-4533-4307-9B53-224DE2ED1FE6}" /f
reg delete "HKEY_CLASSES_ROOT\CLSID\{018D5C66-4533-4307-9B53-224DE2ED1FE6}" /f
echo -- Removing OneDrive folders
rd "%UserProfile%\OneDrive" /Q /S
rd "%LocalAppData%\Microsoft\OneDrive" /Q /S
rd "%ProgramData%\Microsoft\OneDrive" /Q /S
rd "C:\OneDriveTemp" /Q /S

:: Configurações de Privacidade do Microsoft Edge
:: Ajusta políticas do Edge para desativar recursos de telemetria, recomendações e outras funcionalidades.
echo -- Configuring Edge Privacy Settings
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "EdgeEnhanceImagesEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "PersonalizationReportingEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "ShowRecommendationsEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "HideFirstRunExperience" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "UserFeedbackAllowed" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "ConfigureDoNotTrack" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "AlternateErrorPagesEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "EdgeCollectionsEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "EdgeFollowEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "EdgeShoppingAssistantEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "MicrosoftEdgeInsiderPromotionEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "ShowMicrosoftRewards" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "WebWidgetAllowed" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "DiagnosticData" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "EdgeAssetDeliveryServiceEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "CryptoWalletEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "WalletDonationEnabled" /t REG_DWORD /d 0 /f
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage "Microsoft.CoPilot" | Remove-AppxPackage"
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" /v "TurnOffWindowsCopilot" /t "REG_DWORD" /d "1" /f
reg add "HKCU\Software\Policies\Microsoft\Windows\WindowsCopilot" /v "TurnOffWindowsCopilot" /t "REG_DWORD" /d "1" /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Notifications\Settings" /v "AutoOpenCopilotLargeScreens" /t "REG_DWORD" /d "0" /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "ShowCopilotButton" /t "REG_DWORD" /d "0" /f
reg add "HKCU\Software\Microsoft\Windows\Shell\Copilot\BingChat" /v "IsUserEligible" /t "REG_DWORD" /d "0" /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "HubsSidebarEnabled" /t "REG_DWORD" /d "0" /f
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"king.com.CandyCrushSaga\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"king.com.CandyCrushSodaSaga\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"ShazamEntertainmentLtd.Shazam\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Flipboard.Flipboard\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"9E2F88E3.Twitter\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"ClearChannelRadioDigital.iHeartRadio\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"D5EA27B7.Duolingo-LearnLanguagesforFree\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"AdobeSystemsIncorporated.AdobePhotoshopExpress\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"PandoraMediaInc.29680B314EFC2\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"46928bounde.EclipseManager\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"ActiproSoftwareLLC.562882FEEB491\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"SpotifyAB.SpotifyMusic\" | Remove-AppxPackage"

:: Desinstalação de Extensões de Mídia
:: Remove extensões de mídia opcionais que podem não ser necessárias para todos os usuários.
echo -- Uninstalling extensions
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.HEIFImageExtension\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.VP9VideoExtensions\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.WebpImageExtension\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.HEVCVideoExtension\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.RawImageExtension\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.WebMediaExtensions\" | Remove-AppxPackage"

:: Desinstalação de Aplicativos da Microsoft
:: Remove aplicativos padrão da Microsoft que podem ser considerados bloatware.
echo -- Uninstalling Microsoft apps
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"MicrosoftCorporationII.MicrosoftFamily\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.OutlookForWindows\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Clipchamp.Clipchamp\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.3DBuilder\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.Microsoft3DViewer\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.BingWeather\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.BingSports\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.BingFinance\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.MicrosoftOfficeHub\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.BingNews\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.Office.OneNote\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.Office.Sway\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.WindowsPhone\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.CommsPhone\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.YourPhone\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.Getstarted\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.549981C3F5F10\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.Messaging\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.WindowsSoundRecorder\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.MixedReality.Portal\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.WindowsFeedbackHub\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.WindowsAlarms\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.WindowsCamera\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.MSPaint\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.WindowsMaps\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.MinecraftUWP\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.People\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.Wallet\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.Print3D\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.OneConnect\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.MicrosoftSolitaireCollection\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.MicrosoftStickyNotes\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"microsoft.windowscommunicationsapps\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.SkypeApp\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.GroupMe10\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.Todos\" | Remove-AppxPackage"

:: Desinstalação de Aplicativos Xbox
:: Remove aplicativos relacionados ao Xbox que podem não ser úteis para todos os usuários.
echo -- Uninstalling Xbox apps
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.XboxApp\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.Xbox.TCUI\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.XboxGamingOverlay\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.XboxGameOverlay\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.XboxIdentityProvider\" | Remove-AppxPackage"
PowerShell -ExecutionPolicy Unrestricted -Command "Get-AppxPackage \"Microsoft.XboxSpeechToTextOverlay\" | Remove-AppxPackage"

:: Desativação da Gravação de Tela do Xbox
:: Desativa o recurso de gravação de tela do Xbox (Game DVR) via registro.
echo -- Disabling Xbox Screen Recording
reg add "HKCU\System\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\GameDVR" /v "AllowGameDVR" /t REG_DWORD /d 0 /f

:: Desativação de Downloads Automáticos de Mapas
:: Impede o Windows Maps de baixar e atualizar mapas automaticamente.
echo -- Disabling Auto Map Downloads
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Maps" /v "AllowUntriggeredNetworkTrafficOnSettingsPage" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Maps" /v "AutoDownloadAndUpdateMapData" /t REG_DWORD /d 0 /f

:: Desativação do Feed de Atividades
:: Desativa o feed de atividades do sistema para reduzir rastreamento.
echo -- Disabling Activity Feed
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "EnableActivityFeed" /t REG_DWORD /d 0 /f

:: Desativação do Acesso à Localização
:: Bloqueia o acesso à localização por aplicativos no sistema.
echo -- Disabling Location Access
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\location" /v "Value" /t REG_SZ /d "Deny" /f

:: Desativação do Acesso aos Contatos
:: Impede que aplicativos acessem os contatos do usuário.
echo -- Disabling Contacts Access
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\contacts" /v "Value" /t REG_SZ /d "Deny" /f

:: Desativação do Acesso ao Histórico de Chamadas
:: Bloqueia o acesso ao histórico de chamadas por aplicativos.
echo -- Disabling Call History Access
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\phoneCallHistory" /v "Value" /t REG_SZ /d "Deny" /f

:: Desativação do Acesso a Mensagens
:: Impede que aplicativos acessem mensagens (SMS ou chat).
echo -- Disabling Messaging Access
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\chat" /v "Value" /t REG_SZ /d "Deny" /f

:: Desativação do Acesso ao Email
:: Bloqueia o acesso ao email por aplicativos.
echo -- Disabling Email Access
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\email" /v "Value" /t REG_SZ /d "Deny" /f
reg add "HKCU\Software\Microsoft\Speech_OneCore\Settings\VoiceActivation\UserPreferenceForAllApps" /v "AgentActivationEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\radios" /v "Value" /t REG_SZ /d "Deny" /f
schtasks /change /TN "\Microsoft\Windows\Customer Experience Improvement Program\Consolidator" /DISABLE > NUL 2>&1
schtasks /change /TN "\Microsoft\Windows\Customer Experience Improvement Program\KernelCeipTask" /DISABLE > NUL 2>&1
schtasks /change /TN "\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip" /DISABLE > NUL 2>&1
schtasks /change /TN "\Microsoft\Windows\Autochk\Proxy" /DISABLE > NUL 2>&1
schtasks /change /TN "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector" /DISABLE > NUL 2>&1
schtasks /change /TN "\Microsoft\Windows\Feedback\Siuf\DmClient" /DISABLE > NUL 2>&1
schtasks /change /TN "\Microsoft\Windows\Feedback\Siuf\DmClientOnScenarioDownload" /DISABLE > NUL 2>&1
schtasks /change /TN "\Microsoft\Windows\Windows Error Reporting\QueueReporting" /DISABLE > NUL 2>&1
schtasks /change /TN "\Microsoft\Windows\Maps\MapsUpdateTask" /DISABLE > NUL 2>&1
sc config DiagnosticsHub.StandardCollector.Service start=demand
sc config DiagSvc start=demand
sc config WerSvc start=demand
sc config wercplsupport start=demand
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowDesktopAnalyticsProcessing" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowDeviceNameInTelemetry" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "MicrosoftEdgeDataOptIn" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowWUfBCloudProcessing" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowUpdateComplianceProcessing" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowCommercialDataPipeline" /t REG_DWORD /d 0 /f
reg add "HKLM\Software\Policies\Microsoft\SQMClient\Windows" /v "CEIPEnable" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 0 /f
reg add "HKLM\Software\Policies\Microsoft\Windows\DataCollection" /v "DisableOneSettingsDownloads" /t REG_DWORD /d 1 /f
reg add "HKLM\Software\Policies\Microsoft\Windows NT\CurrentVersion\Software Protection Platform" /v "NoGenTicket" /t REG_DWORD /d 1 /f
reg add "HKLM\Software\Policies\Microsoft\Windows\Windows Error Reporting" /v "Disabled" /t REG_DWORD /d 1 /f
reg add "HKLM\Software\Microsoft\Windows\Windows Error Reporting\Consent" /v "DefaultConsent" /t REG_DWORD /d 0 /f
reg add "HKLM\Software\Microsoft\Windows\Windows Error Reporting\Consent" /v "DefaultOverrideBehavior" /t REG_DWORD /d 1 /f
reg add "HKLM\Software\Microsoft\Windows\Windows Error Reporting" /v "DontSendAdditionalData" /t REG_DWORD /d 1 /f
reg add "HKLM\Software\Microsoft\Windows\Windows Error Reporting" /v "LoggingDisabled" /t REG_DWORD /d 1 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "ContentDeliveryAllowed" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "OemPreInstalledAppsEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "PreInstalledAppsEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "PreInstalledAppsEverEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SilentInstalledAppsEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SystemPaneSuggestionsEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\Software\Microsoft\Windows\CurrentVersion\SystemSettings\AccountNotifications" /v "EnableAccountNotifications" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\SystemSettings\AccountNotifications" /v "EnableAccountNotifications" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Notifications\Settings" /v "NOC_GLOBAL_SETTING_TOASTS_ENABLED" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Policies\Microsoft\Windows\EdgeUI" /v "DisableMFUTracking" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\EdgeUI" /v "DisableMFUTracking" /t REG_DWORD /d 1 /f
reg add "HKCU\Control Panel\International\User Profile" /v "HttpAcceptLanguageOptOut" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "PublishUserActivities" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DeliveryOptimization" /v "DODownloadMode" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "ConnectedSearchPrivacy" /t REG_DWORD /d 3 /f
reg add "HKLM\Software\Policies\Microsoft\Windows\Explorer" /v "DisableSearchHistory" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowSearchToUseLocation" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "EnableDynamicContentInWSB" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "ConnectedSearchUseWeb" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "DisableWebSearch" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Explorer" /v "DisableSearchBoxSuggestions" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "PreventRemoteQueries" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AlwaysUseAutoLangDetection" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowIndexingEncryptedStoresOrItems" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Search" /v "DisableSearchBoxSuggestions" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Search" /v "CortanaInAmbientMode" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "ShowCortanaButton" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Search" /v "CanCortanaBeEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "ConnectedSearchUseWebOverMeteredConnections" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowCortanaAboveLock" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowCortana" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Search" /v "DeviceHistoryEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Search" /v "HistoryViewEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Search" /v "CortanaEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Search" /v "CortanaEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\SearchSettings" /v "IsMSACloudSearchEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\SearchSettings" /v "IsAADCloudSearchEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowCloudSearch" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Search" /v "CortanaConsent" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Speech_OneCore\Preferences" /v "ModelDownloadAllowed" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Speech_OneCore\Preferences" /v "VoiceActivationOn" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Speech_OneCore\Preferences" /v "VoiceActivationEnableAboveLockscreen" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\OOBE" /v "DisableVoice" /t REG_DWORD /d 1 /f
reg add "HKLM\Software\Microsoft\Speech_OneCore\Preferences" /v "VoiceActivationDefaultOn" /t REG_DWORD /d 0 /f

schtasks /change /TN "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser" /DISABLE
schtasks /change /TN "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser Exp" /DISABLE
schtasks /change /TN "\Microsoft\Windows\Application Experience\StartupAppTask" /DISABLE
schtasks /change /TN "\Microsoft\Windows\Application Experience\PcaPatchDbTask" /DISABLE
schtasks /change /TN "\Microsoft\Windows\Application Experience\MareBackup" /DISABLE


reg add "HKCU\SOFTWARE\Microsoft\Office\15.0\Outlook\Options\Mail" /v "EnableLogging" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\Outlook\Options\Mail" /v "EnableLogging" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Office\15.0\Outlook\Options\Calendar" /v "EnableCalendarLogging" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\Outlook\Options\Calendar" /v "EnableCalendarLogging" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Office\15.0\Word\Options" /v "EnableLogging" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\Word\Options" /v "EnableLogging" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Policies\Microsoft\Office\15.0\OSM" /v "EnableLogging" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Policies\Microsoft\Office\16.0\OSM" /v "EnableLogging" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Policies\Microsoft\Office\15.0\OSM" /v "EnableUpload" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Policies\Microsoft\Office\16.0\OSM" /v "EnableUpload" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Office\Common\ClientTelemetry" /v "DisableTelemetry" /t REG_DWORD /d 1 /f
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\Common\ClientTelemetry" /v "DisableTelemetry" /t REG_DWORD /d 1 /f
reg add "HKCU\SOFTWARE\Microsoft\Office\Common\ClientTelemetry" /v "VerboseLogging" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\Common\ClientTelemetry" /v "VerboseLogging" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Office\15.0\Common" /v "QMEnable" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\Common" /v "QMEnable" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Office\15.0\Common\Feedback" /v "Enabled" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\Common\Feedback" /v "Enabled" /t REG_DWORD /d 0 /f
schtasks /change /TN "\Microsoft\Office\OfficeTelemetryAgentFallBack" /DISABLE > NUL 2>&1
schtasks /change /TN "\Microsoft\Office\OfficeTelemetryAgentLogOn" /DISABLE > NUL 2>&1
schtasks /change /TN "\Microsoft\Office\OfficeTelemetryAgentFallBack2016" /DISABLE > NUL 2>&1
schtasks /change /TN "\Microsoft\Office\OfficeTelemetryAgentLogOn2016" /DISABLE > NUL 2>&1
schtasks /change /TN "\Microsoft\Office\Office 15 Subscription Heartbeat" /DISABLE > NUL 2>&1
schtasks /change /TN "\Microsoft\Office\Office 16 Subscription Heartbeat" /DISABLE > NUL 2>&1


reg add "HKCU\SOFTWARE\Microsoft\Siuf\Rules" /v "NumberOfSIUFInPeriod" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection" /v "DoNotShowFeedbackNotifications" /t REG_DWORD /d 1 /f


:: Desativação da Telemetria de Escrita Manual
:: Restringe a coleta de dados de escrita manual e personalização de entrada.
echo -- Disabling Handwriting Telemetry
reg add "HKCU\Software\Policies\Microsoft\InputPersonalization" /v "RestrictImplicitInkCollection" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\InputPersonalization" /v "RestrictImplicitInkCollection" /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Policies\Microsoft\InputPersonalization" /v "RestrictImplicitTextCollection" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\InputPersonalization" /v "RestrictImplicitTextCollection" /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Policies\Microsoft\Windows\HandwritingErrorReports" /v "PreventHandwritingErrorReports" /t REG_DWORD /d 1 /f
reg add "HKLM\Software\Policies\Microsoft\Windows\HandwritingErrorReports" /v "PreventHandwritingErrorReports" /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Policies\Microsoft\Windows\TabletPC" /v "PreventHandwritingDataSharing" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\TabletPC" /v "PreventHandwritingDataSharing" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\InputPersonalization" /v "AllowInputPersonalization" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\InputPersonalization\TrainedDataStore" /v "HarvestContacts" /t REG_DWORD /d 0 /f

:: Desativação do Histórico e Clipboard na Nuvem
:: Desativa o histórico da área de transferência e sincronização na nuvem.
echo -- Disabling Clipboard History and Cloud Clipboard
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "AllowCrossDeviceClipboard" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Clipboard" /v "CloudClipboardAutomaticUpload" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Clipboard" /v "EnableClipboardHistory" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "AllowClipboardHistory" /t REG_DWORD /d 0 /f
:: Comandos duplicados de "Handwriting Telemetry" removidos, já cobertos acima

:: Bloqueio da Telemetria da Adobe via Hosts
:: Faz o download de uma lista de hosts para bloquear telemetria da Adobe no arquivo hosts.
echo -- Disabling Adobe Telemetry
set "hostspath=%windir%\System32\drivers\etc\hosts"
set "downloadedlist=%temp%\list.txt"

type "%downloadedlist%" >> "%hostspath%"
del "%downloadedlist%"

:: Desativação da Telemetria da NVIDIA
:: Desativa a coleta de dados pelos drivers e serviços da NVIDIA.
echo -- Disabling NVIDIA Telemetry
reg add "HKLM\SOFTWARE\NVIDIA Corporation\NvControlPanel2\Client" /v "OptInOrOutPreference" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\NVIDIA Corporation\Global\FTS" /v "EnableRID44231" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\NVIDIA Corporation\Global\FTS" /v "EnableRID64640" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\NVIDIA Corporation\Global\FTS" /v "EnableRID66610" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm\Global\Startup" /v "SendTelemetryData" /t REG_DWORD /d 0 /f
schtasks /change /TN "NvTmMon_{B2FE1952-0186-46C3-BAEC-A80AA35AC5B8}" /DISABLE
schtasks /change /TN "NvTmRep_{B2FE1952-0186-46C3-BAEC-A80AA35AC5B8}" /DISABLE
schtasks /change /TN "NvTmRepOnLogon_{B2FE1952-0186-46C3-BAEC-A80AA35AC5B8}" /DISABLE

:: Desativação da Telemetria do Visual Studio
:: Desativa telemetria e feedback nas versões 14 a 17 do Visual Studio.
echo -- Disabling Visual Studio Telemetry
reg add "HKLM\SOFTWARE\Wow6432Node\Microsoft\VSCommon\14.0\SQM" /v "OptIn" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Wow6432Node\Microsoft\VSCommon\15.0\SQM" /v "OptIn" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Wow6432Node\Microsoft\VSCommon\16.0\SQM" /v "OptIn" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Wow6432Node\Microsoft\VSCommon\17.0\SQM" /v "OptIn" /t REG_DWORD /d 0 /f
reg add "HKLM\Software\Policies\Microsoft\VisualStudio\SQM" /v "OptIn" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\VisualStudio\Telemetry" /v "TurnOffSwitch" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\VisualStudio\Feedback" /v "DisableFeedbackDialog" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\VisualStudio\Feedback" /v "DisableEmailInput" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\VisualStudio\Feedback" /v "DisableScreenshotCapture" /t REG_DWORD /d 1 /f
reg delete "HKLM\Software\Microsoft\VisualStudio\DiagnosticsHub" /v "LogLevel" /f 2>nul
reg add "HKLM\SOFTWARE\Policies\Microsoft\VisualStudio\IntelliCode" /v "DisableRemoteAnalysis" /t REG_DWORD /d 1 /f
reg add "HKCU\SOFTWARE\Microsoft\VSCommon\16.0\IntelliCode" /v "DisableRemoteAnalysis" /t REG_DWORD /d 1 /f
reg add "HKCU\SOFTWARE\Microsoft\VSCommon\17.0\IntelliCode" /v "DisableRemoteAnalysis" /t REG_DWORD /d 1 /f

:: Desativação da Telemetria do PowerShell
:: Define uma variável de ambiente para desativar telemetria no PowerShell.
echo -- Disabling PowerShell Telemetry
setx POWERSHELL_TELEMETRY_OPTOUT 1

:: Desativação da Telemetria do CCleaner
:: Desativa monitoramento, atualizações automáticas e coleta de dados no CCleaner.
echo -- Disabling CCleaner Telemetry
reg add "HKCU\Software\Piriform\CCleaner" /v "Monitoring" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Piriform\CCleaner" /v "HelpImproveCCleaner" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Piriform\CCleaner" /v "SystemMonitoring" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Piriform\CCleaner" /v "UpdateAuto" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Piriform\CCleaner" /v "UpdateCheck" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Piriform\CCleaner" /v "CheckTrialOffer" /t REG_DWORD /d 0 /f
reg add "HKLM\Software\Piriform\CCleaner" /v "(Cfg)HealthCheck" /t REG_DWORD /d 0 /f
reg add "HKLM\Software\Piriform\CCleaner" /v "(Cfg)QuickClean" /t REG_DWORD /d 0 /f
reg add "HKLM\Software\Piriform\CCleaner" /v "(Cfg)QuickCleanIpm" /t REG_DWORD /d 0 /f
reg add "HKLM\Software\Piriform\CCleaner" /v "(Cfg)GetIpmForTrial" /t REG_DWORD /d 0 /f
reg add "HKLM\Software\Piriform\CCleaner" /v "(Cfg)SoftwareUpdater" /t REG_DWORD /d 0 /f
reg add "HKLM\Software\Piriform\CCleaner" /v "(Cfg)SoftwareUpdaterIpm" /t REG_DWORD /d 0 /f

:: Desativação da Telemetria do Windows Media Player
:: Impede a coleta de dados de uso e recuperação de metadados no Media Player.
echo -- Disabling Media Player Telemetry
reg add "HKCU\SOFTWARE\Microsoft\MediaPlayer\Preferences" /v "UsageTracking" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Policies\Microsoft\WindowsMediaPlayer" /v "PreventCDDVDMetadataRetrieval" /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Policies\Microsoft\WindowsMediaPlayer" /v "PreventMusicFileMetadataRetrieval" /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Policies\Microsoft\WindowsMediaPlayer" /v "PreventRadioPresetsRetrieval" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\WMDRM" /v "DisableOnline" /t REG_DWORD /d 1 /f

:: Desativação de Atualizações do Google
:: Desativa serviços de atualização automática do Google.
echo -- Disabling Google Updates
sc config gupdate start=disabled
sc config gupdatem start=disabled

:: Desativação de Atualizações da Adobe
:: Desativa serviços e tarefas de atualização automática da Adobe.
echo -- Disabling Adobe Updates
schtasks /change /TN "\Adobe Acrobat Update Task" /DISABLE > NUL 2>&1
sc config AdobeARMservice start=disabled
sc config adobeupdateservice start=disabled

:: Desativação do Modo de Jogo
:: Desativa o Modo de Jogo automático para evitar interferências em jogos.
echo -- Disabling Game Mode
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR" /v "AutoGameModeEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\GameBar" /v "AutoGameModeEnabled" /t REG_DWORD /d 0 /f

:: Desativação da Barra de Jogos
:: Desativa a Barra de Jogos e captura de tela em jogos.
echo -- Disabling Game Bar
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\GameDVR" /v "AllowGameDVR" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR" /v "AppCaptureEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\GameBar" /v "UseNexusForGameBarEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\GameBar" /v "ShowStartupPanel" /t REG_DWORD /d 0 /f

:: Desativação da Aceleração do Mouse
:: Desativa a aceleração do mouse para maior precisão em jogos ou uso geral.
echo -- Disabling Mouse Acceleration
reg add "HKCU\Control Panel\Mouse" /v "MouseSpeed" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Mouse" /v "MouseThreshold1" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Mouse" /v "MouseThreshold2" /t REG_SZ /d "0" /f

:: Desativação de Otimizações de Tela Cheia
:: Ajusta configurações para evitar otimizações automáticas em jogos.
echo -- Disabling Fullscreen Optimizations
reg add "HKCU\System\GameConfigStore" /v "GameDVR_DXGIHonorFSEWindowsCompatible" /t REG_DWORD /d 1 /f

:: Desativação do Agendamento de Hardware Acelerado por GPU (HAGS)
:: Desativa o HAGS para compatibilidade ou desempenho em certos sistemas.
echo -- Disabling HAGS
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "HwSchMode" /t REG_DWORD /d 1 /f

:: Ativação do Modo de Desempenho Máximo
:: Ativa o plano de energia "Ultimate Performance" para máximo desempenho.
echo -- Activating Ultimate Performance Mode
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61

:: Desativação de Serviços Manuais
:: Configura serviços do Windows para inicialização manual ou desativada, reduzindo processos em segundo plano.
echo -- Disabling Manual Services
sc config AJRouter start=disabled
sc config ALG start=demand
sc config AppIDSvc start=demand
sc config AppMgmt start=demand
sc config AppReadiness start=demand
sc config AppVClient start=disabled
sc config AppXSvc start=demand
sc config Appinfo start=demand
sc config AssignedAccessManagerSvc start=disabled
sc config AxInstSV start=demand
sc config BDESVC start=demand
sc config BTAGService start=demand
sc config BcastDVRUserService start=demand
sc config BluetoothUserService start=demand
sc config Browser start=demand
sc config CDPSvc start=demand
sc config COMSysApp start=demand
sc config CaptureService start=demand
sc config CertPropSvc start=demand
sc config ClipSVC start=demand
sc config ConsentUxUserSvc start=demand
sc config CscService start=demand
sc config DevQueryBroker start=demand
sc config DeviceAssociationService start=demand
sc config DeviceInstall start=demand
sc config DevicePickerUserSvc start=demand
sc config DevicesFlowUserSvc start=demand
sc config DiagTrack start=disabled
sc config DialogBlockingService start=disabled
sc config DisplayEnhancementService start=demand
sc config DmEnrollmentSvc start=demand
sc config DsSvc start=demand
sc config DsmSvc start=demand
sc config EFS start=demand
sc config EapHost start=demand
sc config EntAppSvc start=demand
sc config FDResPub start=demand
sc config Fax start=demand
sc config FrameServer start=demand
sc config FrameServerMonitor start=demand
sc config GraphicsPerfSvc start=demand
sc config HvHost start=demand
sc config IEEtwCollectorService start=demand
sc config IKEEXT start=demand
sc config InstallService start=demand
sc config InventorySvc start=demand
sc config IpxlatCfgSvc start=demand
sc config KtmRm start=demand
sc config LicenseManager start=demand
sc config LxpSvc start=demand
sc config MSDTC start=demand
sc config MSiSCSI start=demand
sc config McpManagementService start=demand
sc config MessagingService start=demand
sc config MicrosoftEdgeElevationService start=demand
sc config MsKeyboardFilter start=demand
sc config NPSMSvc start=demand
sc config NaturalAuthentication start=demand
sc config NcaSvc start=demand
sc config NcbService start=demand
sc config NcdAutoSetup start=demand
sc config NetSetupSvc start=demand
sc config NetTcpPortSharing start=disabled
sc config Netman start=demand
sc config NgcCtnrSvc start=demand
sc config NgcSvc start=demand
sc config NlaSvc start=demand
sc config P9RdrService start=demand
sc config PNRPAutoReg start=demand
sc config PNRPsvc start=demand
sc config PcaSvc start=demand
sc config PeerDistSvc start=demand
sc config PenService start=demand
sc config PerfHost start=demand
sc config PhoneSvc start=demand
sc config PimIndexMaintenanceSvc start=demand
sc config PlugPlay start=demand
sc config PolicyAgent start=demand
sc config PrintNotify start=demand
sc config PushToInstall start=demand
sc config QWAVE start=demand
sc config RasAuto start=demand
sc config RasMan start=demand
sc config RemoteAccess start=disabled
sc config RemoteRegistry start=disabled
sc config RetailDemo start=demand
sc config RmSvc start=demand
sc config RpcLocator start=demand
sc config SCPolicySvc start=demand
sc config SCardSvr start=demand
sc config SDRSVC start=demand
sc config SEMgrSvc start=demand
sc config SNMPTRAP start=demand
sc config SNMPTrap start=demand
sc config SSDPSRV start=demand
sc config ScDeviceEnum start=demand
sc config SensorDataService start=demand
sc config SensorService start=demand
sc config SensrSvc start=demand
sc config SessionEnv start=demand
sc config SharedAccess start=demand
sc config SmsRouter start=demand
sc config SstpSvc start=demand
sc config StiSvc start=demand
sc config StateRepository start=demand
sc config StorSvc start=demand
sc config TapiSrv start=demand
sc config TextInputManagementService start=demand
sc config TieringEngineService start=demand
sc config TokenBroker start=demand
sc config TroubleshootingSvc start=demand
sc config TrustedInstaller start=demand
sc config UdkUserSvc start=demand
sc config UmRdpService start=demand
sc config UnistoreSvc start=demand
sc config UserDataSvc start=demand
sc config UsoSvc start=demand
sc config VSS start=demand
sc config VacSvc start=demand
sc config W32Time start=demand
sc config WEPHOSTSVC start=demand
sc config WFDSConMgrSvc start=demand
sc config WMPNetworkSvc start=demand
sc config WManSvc start=demand
sc config WPDBusEnum start=demand
sc config WalletService start=demand
sc config WarpJITSvc start=demand
sc config WbioSrvc start=demand
sc config WdNisSvc start=demand
sc config WdiServiceHost start=demand
sc config WdiSystemHost start=demand
sc config WebClient start=demand
sc config Wecsvc start=demand
sc config WerSvc start=demand
sc config WiaRpc start=demand
sc config WinHttpAutoProxySvc start=demand
sc config WinRM start=demand
sc config WpcMonSvc start=demand
sc config WpnService start=demand
sc config WwanSvc start=demand
sc config XblAuthManager start=demand
sc config XblGameSave start=demand
sc config XboxGipSvc start=demand
sc config XboxNetApiSvc start=demand
sc config autotimesvc start=demand
sc config bthserv start=demand
sc config camsvc start=demand
sc config cbdhsvc start=demand
sc config cloudidsvc start=demand
sc config dcsvc start=demand
sc config defragsvc start=demand
sc config diagnosticshub.standardcollector.service start=demand
sc config diagsvc start=demand
sc config dmwappushservice start=demand
sc config dot3svc start=demand
sc config edgeupdate start=demand
sc config edgeupdatem start=demand
sc config embeddedmode start=demand
sc config fdPHost start=demand
sc config fhsvc start=demand
sc config hidserv start=demand
sc config icssvc start=demand
sc config lfsvc start=demand
sc config lltdsvc start=demand
sc config lmhosts start=demand
sc config msiserver start=demand
sc config netprofm start=demand
sc config p2pimsvc start=demand
sc config p2psvc start=demand
sc config perceptionsimulation start=demand
sc config pla start=demand
sc config seclogon start=demand
sc config shpamsvc start=disabled
sc config smphost start=demand
sc config ssh-agent start=disabled
sc config svsvc start=demand
sc config swprv start=demand
sc config tzautoupdate start=disabled
sc config upnphost start=demand
sc config vds start=demand
sc config vmicguestinterface start=demand
sc config vmicheartbeat start=demand
sc config vmickvpexchange start=demand
sc config vmicrdv start=demand
sc config vmicshutdown start=demand
sc config vmictimesync start=demand
sc config vmicvmsession start=demand
sc config vmicvss start=demand
sc config vmvss start=demand
sc config wbengine start=demand
sc config wcncsvc start=demand
sc config webthreatdefsvc start=demand
sc config wercplsupport start=demand
sc config wisvc start=demand
sc config wlidsvc start=demand
sc config wlpasvc start=demand
sc config wmiApSrv start=demand
sc config workfolderssvc start=demand
sc config wuauserv start=demand
sc config wudfsvc start=demand
sc config IObitUnSvr start= demand
sc config AnyDesk start= demand
sc config TeamViewer start= demand
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Scan" /v "AvgCPULoadFactor" /t REG_DWORD /d 25 /f
reg add "HKLM\SOFTWARE\CurrentControlSet\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" /v "Enabled" /t REG_DWORD /d 0 /f
sc stop sysmain
sc config sysmain start=disabled
sc stop "wsearch"
sc config "wsearch" start=disabled

powercfg.exe /hibernate off


reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v "AppsUseLightTheme" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v "SystemUsesLightTheme" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control" /v "WaitToKillServiceTimeout" /t REG_SZ /d "500" /f
reg add "HKCU\Control Panel\Desktop" /v "WaitToKillAppTimeout" /t REG_SZ /d "500" /f
reg add "HKCU\Control Panel\Desktop" /v "HungAppTimeout" /t REG_SZ /d "500" /f
reg add "HKCU\Control Panel\Desktop" /v "AutoEndTasks" /t REG_SZ /d "1" /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" /v "VisualFXSetting" /t REG_DWORD /d 2 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "CsEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v "TcpWindowSize" /t REG_DWORD /d 0x5ae4c /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v "Tcp1323Opts" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v "TcpAckFrequency" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" /v "MaxCacheTtl" /t REG_DWORD /d 60 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" /v "MaxNegativeCacheTtl" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v "DisableDeleteNotification" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows Search" /v "SetupCompletedSuccessfully" /t REG_DWORD /d 0 /f
reg add "HKCU\Control Panel\Mouse" /v "MouseThreshold1" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Mouse" /v "MouseThreshold2" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Mouse" /v "MouseSpeed" /t REG_SZ /d "1" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d 38 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Explorer" /v "DisableSearchBoxSuggestions" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "DisableWebSearch" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowCortana" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "EnableDynamicContentInWSB" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "ConnectedSearchUseWeb" /t REG_DWORD /d 1 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Search" /v "DisableSearchBoxSuggestions" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Search" /v "CortanaInAmbientMode" /t REG_DWORD /d 1 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Search" /v "BingSearchEnabled" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows Defender\Virtualization" /v "DisableVirtualizationBasedSecurity" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" /v "Enabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\HypervisorEnlightenment" /v "Enabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Control Panel\Keyboard" /v "InitialKeyboardIndicators" /t REG_SZ /d "2" /f
reg add "HKCU\Control Panel\Keyboard" /v "KeyboardDelay" /t REG_SZ /d "0" /f
reg add "HKLM\SOFTWARE\Microsoft\Windows Search" /v "SetupCompletedSuccessfully" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows Defender\ExploitGuard\ControlledFolderAccess" /v "EnableControlledFolderAccess" /t REG_DWORD /d 0 /f
reg add "HKCU\Control Panel\PowerCfg" /v "CurrentPowerPolicy" /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\UserProfileEngagement" /v "ScoobeSystemSettingEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "RotatingLockScreenOverlayEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SubscribedContent-338393Enabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SubscribedContent-353694Enabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SubscribedContent-353696Enabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SubscribedContent-338389Enabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Privacy" /v "TailoredExperiencesWithDiagnosticDataEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SubscribedContent-310093Enabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "ShowSyncProviderNotifications" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SubscribedContent-338387Enabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo" /v "Enabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "Start_IrisRecommendations" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Enum\PCI" /v "MessageSignaledInterruptProperties" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v "NtfsDisableLastAccessUpdate" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\StorageDevicePolicies" /v "WriteCacheEnabled" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\StorageDevicePolicies" /v "WriteThrough" /t REG_DWORD /d 1 /f

defrag c: /O

reg add "HKLM\SYSTEM\CurrentControlSet\Services\storahci\Parameters\Device" /v "NoLPM" /t REG_DWORD /d 1 /f

sc config DiagTrack start=disabled
sc stop DiagTrack
sc config diagnosticshub.standardcollector.service start=disabled
sc stop diagnosticshub.standardcollector.service

reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v "EnablePrefetcher" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v "EnableSuperfetch" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Dfrg\BootOptimizeFunction" /v "Enable" /t REG_SZ /d "N" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\nvme" /v "Start" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\nvme" /v "InterruptManagement" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\nvme" /v "PerformanceMode" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger" /v "EnableLogging" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager" /v "MemoryDump" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\WindowsRuntime\ActivatableClassId\Windows.Gaming.GameBar.PresenceServer.Internal.PresenceWriter" /v "ActivationType" /t REG_DWORD /d 0 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "IRQ8Priority" /t REG_DWORD /d 1 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "IRQ16Priority" /t REG_DWORD /d 2 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\A2D805F1-E904-460C-A7E3-CD5E8C0B058A" /v "TcpAckFrequency" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\VxD\BIOS" /v "CPUPriority" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "ProccesorThrottlingEnabled" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "CpuIdleThreshold" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "CpuIdle" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "CpuLatencyTimer" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "CpuSlowdown" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "DedicatedSegmentSize" /t REG_DWORD /d 1298 /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "Threshold" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "CpuDebuggingEnabled" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "ProccesorLatencyThrottlingEnabled" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\HardCap0" /v "SchedulingType" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\Paused" /v "CapPercentage" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\Paused" /v "SchedulingType" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapFull" /v "CapPercentage" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapFull" /v "SchedulingType" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapFullAboveNormal" /v "CapPercentage" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapFullAboveNormal" /v "PriorityClass" /t REG_DWORD /d 32 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapFullAboveNormal" /v "SchedulingType" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapLow" /v "CapPercentage" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapLow" /v "SchedulingType" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapLowBackgroundBegin" /v "CapPercentage" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapLowBackgroundBegin" /v "PriorityClass" /t REG_DWORD /d 32 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapLowBackgroundBegin" /v "SchedulingType" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\UnmanagedAboveNormal" /v "CapPercentage" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\UnmanagedAboveNormal" /v "PriorityClass" /t REG_DWORD /d 32 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\UnmanagedAboveNormal" /v "SchedulingType" /t REG_DWORD /d 0 /f
SCEWIN_64.exe /i /ms "PEP CPU" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "CPU Wakeup Timer" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "CPU Attached Storage" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "CPU PkgC10 Long Sleep" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "CPU Run Control" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "CPU Run Control Lock" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "Processor trace memory allocation" /qv 0xFF /lang en-US
SCEWIN_64.exe /i /ms "Cpu CrashLog (Device 10)" /qv 0x0 /lang en-US

REG ADD "HKCU\System\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d 0 /f
REG ADD "HKCU\System\GameConfigStore" /v "GameDVR_FSEBehaviorMode" /t REG_DWORD /d 2 /f
REG ADD "HKCU\System\GameConfigStore" /v "GameDVR_HonorFSEBehaviorMode" /t REG_DWORD /d 0 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "EnablePreemption" /t REG_DWORD /d 0 /f
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f
REG ADD "HKEY_CURRENT_USER\System\GameConfigStore" /v "windowsCompatible" /t REG_DWORD /d 1 /f
REG ADD "HKEY_CURRENT_USER\System\GameConfigStore" /v "behaviorMode" /t REG_DWORD /d 0 /f
REG DELETE "HKEY_CURRENT_USER\System\GameConfigStore\children" /f
REG DELETE "HKEY_CURRENT_USER\System\GameConfigStore\parents" /f
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\Default\GPUCache"
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\GrShaderCache\GPUCache"
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\ShaderCache\GPUCache"
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\Profile 1\GPUCache"
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\Profile 2\GPUCache"
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "DpiMapIommuContiguous" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "HwSchedMode" /t REG_DWORD /d 2 /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Flags\ThrottleGPUInterference" /v "IsLowPriority" /t REG_DWORD /d 0 /f
SCEWIN_64.exe /i /ms "PEP Graphics" /qv 0x0 /lang en-US

REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v "EnablePrefetch" /t REG_DWORD /d 0 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v "EnableSuperfetch" /t REG_DWORD /d 0 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "RMHdcpKeyglobZero" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "DpcWatchdogProfileOffset" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "DpcWatchdogPeriod" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DynamicBacklogGrowthDelta" /t REG_DWORD /d 256 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "DynamicBacklogGrowthDelta" /t REG_DWORD /d 256 /f
SCEWIN_64.exe /i /ms "HDC Control" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "WatchDog" /qv 0x0 /lang en-US
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\943c8cb6-6f93-4227-ad87-e9a3feec08d1" /v "Attributes" /t REG_DWORD /d 2 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling" /v "PowerThrottlingOff" /t REG_DWORD /d 1 /f
SCEWIN_64.exe /i /ms "EC Low Power Mode" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "Energy Performance Gain" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "Energy Efficient P-state" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "Energy Efficient Turbo" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "JTAG C10 Power Gate" /qv 0x1 /lang en-US
SCEWIN_64.exe /i /ms "Clock Power Management" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "SLP_LAN# Low on DC Power" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "DeepSx Power Policies" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "USB2 PHY Sus Well Power Gating" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "Disable Gen2 Pll Shutdown and L1 Controller Power gating" /qv 0x1 /lang en-US
SCEWIN_64.exe /i /ms "USB Standby Power at S4/S5" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "PCI Express Power Gating" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "Power Gating" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "Power Loss Notification Feature" /qv 0x0 /lang en-US
SCEWIN_64.exe /i /ms "Enable DCI ModPHY Power Gate" /qv 0x0 /lang en-US

:: Otimização de Serviços e Inicialização
:: Ajusta serviços e parâmetros para reduzir atrasos e melhorar desempenho de rede e jogos.
REG ADD "HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Serialize" /v "StartupDelayInMSec" /t REG_DWORD /d 0 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\Ndu" /v "Start" /t REG_DWORD /d 4 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v "IRPStackSize" /t REG_DWORD /d 20 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v "SizReqBuf" /t REG_DWORD /d 17424 /f

:: Configuração de Prioridades para Jogos
:: Ajusta prioridades de sistema e rede para tarefas de jogos.
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Affinity" /t REG_DWORD /d 8 /f
:: "Affinity" duplicado removido (mantido o valor 8 como mais recente)
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "SystemPerformance" /t REG_DWORD /d 8 /f
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "NetworkPerformance" /t REG_DWORD /d 6 /f

:: Otimização de Rede
:: Habilita TCP NoDelay para reduzir latência em uma interface específica.
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\A2D805F1-E904-460C-A7E3-CD5E8C0B058A" /v "TCPNoDelay" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "DefaultReceiveWindow" /t REG_DWORD /d 16384 /f

:: Limpeza de Processos e Arquivos
:: Encerra processos específicos e remove arquivos de cache do Edge e Spotify.
taskkill /f /im "spotify.exe" >NUL 2>&1
del /f /s /q "%appdata%\Spotify\SpotifyStartupTask.exe" >NUL 2>&1
taskkill /F /IM "msedge.exe"
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\Default\Service Worker\Database"
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\Default\Service Worker\CacheStorage"
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\Default\Service Worker\ScriptCache"
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\Profile 1\Service Worker\Database"
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\Profile 1\Service Worker\CacheStorage"
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\Profile 1\Service Worker\ScriptCache"
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\Profile 2\Service Worker\Database"
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\Profile 2\Service Worker\CacheStorage"
rmdir /q /s "C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\User Data\Profile 2\Service Worker\ScriptCache"

:: Otimização de Hardware (BIOS e Gráficos)
:: Ajusta configurações de BIOS e drivers gráficos para desempenho.
Reg.exe add "HKLM\System\CurrentControlSet\Services\VxD\BIOS" /v "FastDRAM" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\VxD\BIOS" /v "AGPConcur" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\VxD\BIOS" /v "PCIConcur" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\DXGKrnl" /v "MonitorLatencyTolerance" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\DXGKrnl" /v "MonitorRefreshLatencyTolerance" /t REG_DWORD /d 0 /f

    :: Otimização Avançada de Rede (AFD)
:: Ajusta parâmetros do AFD (Ancillary Function Driver) para melhorar desempenho de rede.
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "DefaultSendWindow" /t REG_DWORD /d 4294967295 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "FastCopyReceiveThreshold" /t REG_DWORD /d 4294967295 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "FastSendDatagramThreshold" /t REG_DWORD /d 4294967295 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "DynamicSendBufferDisable" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "IgnorePushBitOnReceives" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "NonBlockingSendSpecialBuffering" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "DisableRawSecurity" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "DefaultReceiveWindow" /t REG_DWORD /d 4294967295 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "DisableAddressSharing" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "DoNotHoldNicBuffers" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "EnableDynamicBacklog" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "EnablePMTUDiscovery" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "EnableWsd" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "GlobalMaxTcpWindowSize" /t REG_DWORD /d 3539039 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "KeepAliveInterval" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "MaxHashTableSize" /t REG_DWORD /d 4096 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "MaximumDynamicBacklog" /t REG_DWORD /d 131072 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "MinimumDynamicBacklog" /t REG_DWORD /d 512 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "TcpMaxDupAcks" /t REG_DWORD /d 3 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "TcpTimedWaitDelay" /t REG_DWORD /d 30 /f

:: Otimização Avançada de Rede (ControlSet001\AFD)
:: Configurações adicionais no ControlSet001 para o AFD.
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "DefaultReceiveWindow" /t REG_DWORD /d 8192 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "DefaultSendWindow" /t REG_DWORD /d 4096 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "DisableAddressSharing" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "FastSendDatagramThreshold" /t REG_DWORD /d 1024 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "IgnorePushBitOnReceives" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "InitialLargeBufferCount" /t REG_DWORD /d 20 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "InitialMediumBufferCount" /t REG_DWORD /d 48 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "InitialSmallBufferCount" /t REG_DWORD /d 64 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "LargeBufferSize" /t REG_DWORD /d 40960 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "MaxFastTransmit" /t REG_DWORD /d 6400 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "MediumBufferSize" /t REG_DWORD /d 15040 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "PriorityBoost" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "SmallBufferSize" /t REG_DWORD /d 1280 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "TransmitWorker" /t REG_DWORD /d 32 /f
Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "BufferMultiplier" /t REG_DWORD /d 1024 /f

:: Otimização de Serviços (ADF)
:: Ajusta parâmetros do ADF para desempenho de rede e sistema.
Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "DisablePagingExecutive" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "DisableStrictNameChecking" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "EnableDynamicBacklog" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "IRPStackSize" /t REG_DWORD /d 32 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "MaximumDynamicBacklog" /t REG_DWORD /d 131072 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "MaxMpxCt" /t REG_DWORD /d 2048 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "MaxWorkItems" /t REG_DWORD /d 8192 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "MinimumDynamicBacklog" /t REG_DWORD /d 512 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "Size" /t REG_DWORD /d 3 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "SizReqBuf" /t REG_DWORD /d 17424 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "SystemPages" /t REG_DWORD /d 4294967295 /f

:: Desativação de Serviços Específicos
:: Desativa o AeLookupSvc para reduzir uso de recursos.
Reg.exe add "HKLM\System\CurrentControlSet\services\AeLookupSvc" /v "Start" /t REG_DWORD /d 4 /f

:: Otimização Avançada de DNS
:: Ajusta parâmetros do DNS para desempenho e latência reduzida.
Reg.exe add "HKLM\System\CurrentControlSet\Services\DNS\Parameters" /v "MaximumUdpPacketSize" /t REG_DWORD /d 1398 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "CacheHashTableBucketSize" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "CacheHashTableSize" /t REG_DWORD /d 900 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "DefaultTTL" /t REG_DWORD /d 64 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "EnableAutoDoh" /t REG_DWORD /d 2 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "EnableDynamicBacklog" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "MaxCacheEntryTtlLimit" /t REG_DWORD /d 409600 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "MaxCacheTtl" /t REG_DWORD /d 14400 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "MaximumDynamicBacklog" /t REG_DWORD /d 131072 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "MaximumUdpPacketSize" /t REG_DWORD /d 4864 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "MaxNegativeCacheTtl" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "MaxSOACacheEntryTtlLimit" /t REG_DWORD /d 769 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "MinimumDynamicBacklog" /t REG_DWORD /d 512 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "NegativeCacheTime" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "NegativeSOACacheTime" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "NetFailureCacheTime" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "ServerPriorityTimeLimit" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "ServiceDll" /t REG_EXPAND_SZ /d "%%SystemRoot%%\System32\dnsrslvr.dll" /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "ServiceDllUnloadOnStop" /t REG_DWORD /d 1 /f

:: Configuração do Firewall
:: Desativa serviços de compartilhamento de arquivos e desktop remoto no firewall.
Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\Services\FileAndPrint" /v "Enabled" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\Services\RemoteDesktop" /v "Enabled" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\Services\FileAndPrint" /v "Enabled" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\Services\RemoteDesktop" /v "Enabled" /t REG_DWORD /d 0 /f






:: Ajusta o tamanho do buffer de requisição para melhorar transmissão de dados em jogos online.
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v "SizReqBuf" /t REG_DWORD /d 17424 /f
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d 0xffffffff /f
REG add "HKLM\SYSTEM\CurrentControlSet\Control" /v "SvcHostSplitThresholdInKB" /t REG_DWORD /d 4194304 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "SecondLevelDataCache" /t REG_DWORD /d 1264 /f
:: Define o cache L3 (8 MB = 8192 KB) para CPUs com cache compartilhado, melhorando jogos multi-threaded.
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "ThirdLevelDataCache" /t REG_DWORD /d 8192 /f
:: Configurações de recursos para otimizar uso de memória em jogos (FeatureSettingsOverride=3 é otimizado para desempenho).
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverride" /t REG_DWORD /d 3 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverrideMask" /t REG_DWORD /d 3 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" /v "AdditionalCriticalWorkerThreads" /t REG_DWORD /d 8 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" /v "AdditionalDelayedWorkerThreads" /t REG_DWORD /d 8 /f



:: Desativação de Recursos de Acessibilidade
:: Desativa MouseKeys, StickyKeys, etc., para evitar interferências em jogos.
REG ADD "HKEY_CURRENT_USER\Control Panel\Accessibility\MouseKeys" /v "Flags" /t REG_DWORD /d 0 /f
REG ADD "HKEY_CURRENT_USER\Control Panel\Accessibility\StickyKeys" /v "Flags" /t REG_DWORD /d 0 /f
REG ADD "HKEY_CURRENT_USER\Control Panel\Accessibility\Keyboard Response" /v "Flags" /t REG_DWORD /d 0 /f
REG ADD "HKEY_CURRENT_USER\Control Panel\Accessibility\ToggleKeys" /v "Flags" /t REG_DWORD /d 0 /f

:: Desativação de Serviços Não Essenciais para Jogos
:: Desativa manutenção automática para reduzir interrupções durante jogos.
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Schedule\Maintenance" /v "MaintenanceDisabled" /t REG_DWORD /d 1 /f
:: Desativa Restauração do Sistema para liberar recursos (menos relevante para jogos, mas reduz overhead).
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows NT\SystemRestore" /v "DisableSR" /t REG_DWORD /d 1 /f

:: Limpeza de Arquivos do Spotify
:: Remove componentes não essenciais do Spotify para liberar recursos durante jogos.
del /f /s /q "%appdata%\Spotify\SpotifyMigrator.exe" >NUL 2>&1
del /f /s /q "%appdata%\Spotify\Apps\Buddy-list.spa" >NUL 2>&1
del /f /s /q "%appdata%\Spotify\Apps\Concert.spa" >NUL 2>&1
del /f /s /q "%appdata%\Spotify\Apps\Concerts.spa" >NUL 2>&1
del /f /s /q "%appdata%\Spotify\Apps\Error.spa" >NUL 2>&1
del /f /s /q "%appdata%\Spotify\Apps\Findfriends.spa" >NUL 2>&1
del /f /s /q "%appdata%\Spotify\Apps\Legacy-lyrics.spa" >NUL 2>&1
del /f /s /q "%appdata%\Spotify\Apps\Lyrics.spa" >NUL 2>&1
del /f /s /q "%appdata%\Spotify\Apps\Show.spa" >NUL 2>&1
:: Remove pacotes de localização desnecessários para reduzir carregamento em segundo plano.
del /f /s /q "%appdata%\Spotify\locales\*.pak" >NUL 2>&1
del /f /s /q "%appdata%\Spotify\locales\*.mo" >NUL 2>&1
:: Remove o Spotify da inicialização automática.
Reg.exe delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "Spotify" /f >NUL 2>&1

:: Limpeza de Arquivos do Discord
:: Remove arquivos e atualizadores do Discord para evitar processos em segundo plano que afetem jogos.
del "%HOMEPATH%\Desktop\Discord.lnk" /F /Q >NUL 2>&1
del "%HOMEPATH%\Desktop\Discord.lnk - Shortcut" /F /Q >NUL 2>&1
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\Squirrel.exe" /F /Q >NUL 2>&1
del "%HOMEPATH%\appdata\Local\discord\SquirrelSetup.log" /F /Q >NUL 2>&1
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\SquirrelSetup.log" /F /Q >NUL 2>&1
del "%HOMEPATH%\appdata\Local\Discord\Discord_updater_r00000.log" /F /Q >NUL 2>&1
del "%HOMEPATH%\appdata\Local\Discord\Discord_updater_r00001.log" /F /Q >NUL 2>&1
del "%HOMEPATH%\appdata\Local\Discord\Discord_updater_rCURRENT.log" /F /Q >NUL 2>&1

:: Otimização de Recursos para Jogos
:: Remove módulos e arquivos desnecessários do Discord e Edge para liberar recursos.

:: Limpeza de Módulos do Discord
:: Remove módulos não essenciais do Discord para reduzir uso de CPU e memória em jogos.
rmdir /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_cloudsync" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_dispatch" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_erlpack" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_game_utils" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_media" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_spellcheck" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_krisp" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_rpc" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_overlay2" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_cloudsync" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_dispatch" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_erlpack" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_game_utils" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_media" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_spellcheck" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_krisp" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_rpc" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_overlay2" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_hook-1" >NUL 2>&1
:: Remove variantes numeradas de módulos para evitar redundância.
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_cloudsync-1" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_dispatch-1" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_erlpack-1" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_game_utils-1" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_media-1" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_spellcheck-1" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_spellcheck-2" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_krisp-1" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_rpc-1" >NUL 2>&1
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_overlay2-1" >NUL 2>&1
:: Remove SwiftShader para evitar renderização por software que prejudica jogos.
rmdir /s /q "%HOMEPATH%\AppData\Local\Discord\app-1.0.9006\swiftshader" >NUL 2>&1






:: Desativação de Recursos de Segurança Não Essenciais
:: Desativa virtualização e proteções que podem impactar desempenho em jogos.
Reg.exe add "HKLM\Software\Policies\Microsoft\FVE" /v "DisableExternalDMAUnderLock" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows\DeviceGuard" /v "EnableVirtualizationBasedSecurity" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows\DeviceGuard" /v "HVCIMATRequired" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "DisableExceptionChainValidation" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "KernelSEHOPEnabled" /t REG_DWORD /d 0 /f



:: Otimização do Kernel
:: Ajustes para melhorar desempenho de DPC e interrupções em jogos.
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "DisableAutoBoost" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "DpcTimeout" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "ThreadDpcEnable" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "InterruptSteeringDisabled" /t REG_DWORD /d 1 /f

:: Desativação de Recursos de Interface Não Essenciais
:: Desativa MTCUVC (Modern Taskbar) para reduzir overhead em jogos.
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\MTCUVC" /v "EnableMtcUvc" /t REG_DWORD /d 0 /f


:: Otimização de Rede e DNS
:: Configurações para reduzir latência de rede em jogos online.
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows NT\DNSClient" /v "DisableSmartNameResolution" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows NT\DNSClient" /v "DisableSmartProtocolReordering" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows NT\DNSClient" /v "EnableIdnMapping" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows NT\DNSClient" /v "EnableMulticast" /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows NT\DNSClient" /v "PreferLocalOverLowerBindingDNS" /t REG_DWORD /d 1 /f

:: Otimização de Conexões de Rede
:: Minimiza conexões simultâneas e desativa WCN para reduzir overhead.
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows\WcmSvc\GroupPolicy" /v "fMinimizeConnections" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows\WcmSvc\GroupPolicy" /v "fSoftDisconnectConnections" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows\WCN\UI" /v "DisableWcnUi" /t REG_DWORD /d 1 /f

:: Configuração do Firewall para Jogos
:: Desativa notificações e tráfego desnecessário para reduzir interrupções.
Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile" /v "DisableNotifications" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile" /v "DisableUnicastResponsesToMulticastBroadcast" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile" /v "DisableNotifications" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile" /v "DisableUnicastResponsesToMulticastBroadcast" /t REG_DWORD /d 1 /f

:: Configuração de Inicialização (BCDedit)
:: Otimiza parâmetros de boot para desempenho em jogos.
bcdedit /set useplatformtick yes >NUL 2>&1
bcdedit /set disabledynamictick yes >NUL 2>&1
bcdedit /set nx optout >NUL 2>&1
bcdedit /set bootux disabled >NUL 2>&1
bcdedit /set bootmenupolicy standard >NUL 2>&1
bcdedit /set hypervisorlaunchtype off >NUL 2>&1
bcdedit /set tpmbootentropy ForceDisable >NUL 2>&1
bcdedit /set quietboot yes >NUL 2>&1
bcdedit /set linearaddress57 OptOut >NUL 2>&1
bcdedit /set increaseuserva 268435328 >NUL 2>&1
bcdedit /set firstmegabytepolicy UseAll >NUL 2>&1
bcdedit /set avoidlowmemory 0x8000000 >NUL 2>&1
bcdedit /set nolowmem Yes >NUL 2>&1
bcdedit /set allowedinmemorysettings 0x0 >NUL 2>&1
bcdedit /set isolatedcontext No >NUL 2>&1

SCEWIN_64.exe /i /ms "PUIS Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel Ready Mode Technology" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel RMT State" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP IPU" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP GNA" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PEG0" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP SATA" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP enumerated SATA ports" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PCIe LAN" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PCIe WLAN" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PCIe GFX" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PCIe Other" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PCIe Storage" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PCIe DG1" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP UART" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C0" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C1" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C2" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C3" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C4" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C5" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C6" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C7" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP SPI" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP XHCI" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP Audio" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP SDXC" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP CSME" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP HECI3" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP LAN(GBE)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP THC0" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP THC1" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP TCSS" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP VMD" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP EMMC" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP TBT RP" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "C6DRAM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "AP threads Idle Manner" /qv 0x3 /lang en-US 
SCEWIN_64.exe /i /ms "PECI" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel Trusted Execution Technology" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Race To Halt (RTH)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "CFG Lock" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Tcc Offset Time Window" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Bi-directional PROCHOT#" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "ACPI T-States" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enable xdpclock" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "WDT Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "BCLK Aware Adaptive Voltage" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Ring Down Bin" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PET Progress" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Thunderbolt Boot Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Wake From Thunderbolt(TM) Devices" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Thunderbolt Usb Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Windows 10 Thunderbolt support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "IGD VTD Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "IPU VTD Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "IOP VTD Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "USB3 Type-C UFP2DFP Kernel/Platform Debug Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Three Strike Counter" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "CrashLog Feature" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "RAM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Legacy UART" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "USB3" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Serial IO UART" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Trace Hub" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "MRC Serial Debug Messages" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Serial Debug Messages" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enable Hibernation" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "ACPI Standby State" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "SR-IOV Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "BME DMA Mitigation" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Extended Tag" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "Maximum Payload" /qv 0x5 /lang en-US 
SCEWIN_64.exe /i /ms "Maximum Read Request" /qv 0x5 /lang en-US 
SCEWIN_64.exe /i /ms "ASPM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "ARI Forwarding" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LTR Mechanism Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Port 60/64 Emulation" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "USB S5 Wakeup Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Ipv4 PXE Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Ipv6 PXE Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Option ROM Messages" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Launch PXE OpROM policy" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Type C Support" /qv 0x2 /lang en-US 
SCEWIN_64.exe /i /ms "Enable RH Prevention" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enable/Disable IED (Intel Enhanced Debug)" /qv 0x0 /lang en-US  
SCEWIN_64.exe /i /ms "CHAP Device (B0:D7:F0)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Thermal Device (B0:D4:F0)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "GNA Device (B0:D8:F0)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "ALS Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "VDD Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PAVP Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enable Display Audio Link in Pre-OS" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "DMI Gen3 ASPM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "DMI ASPM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "RC6(Render Standby)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEG0 Hotplug" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEG1 Hotplug" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEG2 Hotplug" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PCIe Spread Spectrum Clocking" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "LAN Wake From DeepSx" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Wake on LAN Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "DeepSx Wake on WLAN and BT Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Foxville I225 Wake on LAN Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Wake on WLAN and BT Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Disable DSX ACPRESENT PullDown" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "PS_ON Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enhance Port 80h LPC Decoding" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Legacy IO Low Latency" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "PCH Cross Throttling" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "IOAPIC 24-119 Entries" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enable 8254 Clock Gate" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel Rapid Recovery Technology" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Smart Response Technology" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel(R) Optane(TM) Memory" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "System Acceleration with Intel(R) Optane(TM) Memory" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "RGB Light" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Modern StandBy" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LAN Option ROM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEG0 - ASPM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEG1 - ASPM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEG2 - ASPM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PCIE Spread Spectrum" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PCI Delay Optimization" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "PCI Express Clock Gating" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Vmax Stress" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "IOTG Spread Spectrum" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i3.4" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i3.3" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i3.2" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i3.1" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i3.0" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i2.2" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i2.1" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i2.0" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel(R) Turbo Boost Max Technology 3.0" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "Tcc Offset Lock Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PS2 Keyboard and Mouse" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "USB DbC Enable Mode" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "USB Overcurrent Override for DbC" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Hardware Autonomous Width" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "Hardware Autonomous Speed" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "BIOS Hot-Plug Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "DMI Link ASPM Control" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "OS IDLE Mode" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "S0ix Auto Demotion" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Hybrid Storage Detection and Configuration Mode" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "FIVR Dynamic PM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "ECC Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Row Hammer Mode" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "In-Band ECC Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPMode" /qv 0x2 /lang en-US 
SCEWIN_64.exe /i /ms "KT Device" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "IPU Device (B0:D5:F0)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel(R) Speed Shift Technology Interrupt Control" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "HwP Autonomous Per Core P State" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "HwP Autonomous EPP Grouping" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enhanced Thermal Velocity Boost" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "TVB Voltage Optimizations" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Thermal Velocity Boost" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Interrupt Redirection Mode Selection" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "Disable Fast PKG C State Ramp for IA Domain" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "INT3400 Device" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enable Remote Platform Erase Feature" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "ITBT RTD3" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PCI Buses Padding" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "I/O Resources Padding" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "MMIO 32 bit Resources Padding" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PFMMIO 32 bit Resources Padding" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Pcie Pll SSC" /qv 0xFE /lang en-US 
SCEWIN_64.exe /i /ms "WoV (Wake on Voice)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Bluetooth Sideband" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "BT Intel HFP" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "BT Intel A2DP" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "DMI Gen3 L1 Exit Latency" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "FIVR Spread Spectrum" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "RFI Spread Spectrum" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Per Core P State OS control mode" /qv 0x0 /lang en-US 

reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{01578F96-C270-4602-ADE0-578D9C29FC0C}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{0BD3506A-9030-4F76-9B88-3E8FE1F7CFB6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{12d25187-6c0d-4783-ad3a-84caa135acfd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{15A7A4F8-0072-4EAB-ABAD-F98A4D666AED}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{1C95126E-7EEA-49A9-A3FE-A378B03DDB4D}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{1E39B4CE-D1E6-46CE-B65B-5AB05D6CC266}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{2F07E2EE-15DB-40F1-90EF-9D7BA282188A}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{314DE49F-CE63-4779-BA2B-D616F6963A88}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{315a8872-923e-4ea2-9889-33cd4754bf64}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{3CB40AAA-1145-4FB8-B27B-7E30F0454316}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{3EB875EB-8F4A-4800-A00B-E484C97D7551}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{43D1A55C-76D6-4F7E-995C-64C711E5CAFE}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{63B530F8-29C9-4880-A5B4-B8179096E7B8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{67D07935-283A-4791-8F8D-FA9117F3E6F2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{6A1F2B00-6A90-4C38-95A5-5CAB3B056778}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{7868B0D4-1423-4681-AFDF-27913575441E}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{88CD9180-4491-4640-B571-E3BEE2527943}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{9580D7DD-0379-4658-9870-D5BE7D52D6DE}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{A6BF0DEB-3659-40AD-9F81-E25AF62CE3C7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{AB0D8EF9-866D-4D39-B83F-453F3B8F6325}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{CDEAD503-17F5-4A3E-B7AE-DF8CC2902EB9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{DF271536-4298-45E1-B0F2-E88F78619C5D}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{e6835967-e0d2-41fb-bcec-58387404e25a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{FBCFAC3F-8459-419F-8E48-1F0B49CDB85E}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{0063715b-eeda-4007-9429-ad526f62696e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{11CD958A-C507-4EF3-B3F2-5FD9DFBD2C78}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{30336ed4-e327-447c-9de0-51b652c86108}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{331c3b3a-2005-44c2-ac5e-77220c37d6b4}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{530FB9B9-C515-4472-9313-FB346F9255E3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{75EBC33E-0CC6-49da-8CD9-8903A5222AA0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{75EBC33E-77B8-4ba8-9474-4F4A9DB2F5C6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{75EBC33E-8670-4eb6-B535-3B9D6BB222FD}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{75EBC33E-997F-49cf-B49F-ECC50184B75D}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{75EBC33E-C8AE-4f93-9CA1-683A53E20CB6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{75EBC33E-D017-4D0F-93AB-0B4F86579164}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{B9DA9FE6-AE5F-4f3e-B2FA-8E623C11DC75}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{C553CED4-9BA3-478F-98EA-906CE99C2E4F}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{f0be35f8-237b-4814-86b5-ade51192e503}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{f5dbaa02-15d6-4644-a784-7032d508bf64}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{19E464A4-7408-49BD-B960-53446AE47820}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{19E93940-A1BD-497F-BC58-CA333880BAB4}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{3048407B-56AA-4D41-82B2-7d5F4b1CDD39}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{402E812D-04E6-4E66-ABDB-32E5F79D36A2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{49868e3d-77fb-5083-9e09-61e3f37e0309}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{62A0EB6C-3E3E-471d-960C-7C574A72534C}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{6d5ca4bb-df8e-41bc-b554-8aeab241f206}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{6fb61ac3-3455-4da4-8313-c1a855ee64c5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{836767A6-AF31-4938-B4C0-EF86749A9AEF}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{9558985e-3bc8-45ef-a2fd-2e6ff06fb886}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{99F5F45C-FD1E-439F-A910-20D0DC759D28}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{acf1e4a7-9241-4fbf-9555-c27638434f8d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{B795C7DF-07BC-4362-938E-E8ABD81A9A01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{C9BF4A01-D547-4d11-8242-E03A18B5BE01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{C9BF4A02-D547-4d11-8242-E03A18B5BE01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{C9BF4A03-D547-4d11-8242-E03A18B5BE01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{C9BF4A05-D547-4d11-8242-E03A18B5BE01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{C9BF4A9E-D547-4d11-8242-E03A18B5BE01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{C9BF4A9F-D547-4d11-8242-E03A18B5BE01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{047FB417-39E6-4B79-A52C-C436B60011AD}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{0BD3506A-9030-4f76-9B88-3E8FE1F7CFB6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{111ffc99-3987-4bf8-8398-61853120cb3d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{1193FF07-26A3-4ECA-9384-12CCF39CAE03}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{21ba7b61-05f8-41f1-9048-c09493dcfe38}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{2D0CC56C-874F-422C-B25F-246F286A24BA}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{314DE49F-CE63-4779-BA2B-D616F6963A88}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{3496b396-5c43-45e7-b38e-d509b79ae721}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{3D42A67D-9CE8-4284-B755-2550672B0CE0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{4D946A46-275B-4C9D-B835-0B2160559256}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{58980F4B-BD39-4a3e-B344-492ED2254A4E}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{5CA18737-22AC-4050-85BC-B8DBB9F7D986}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{681E3481-7510-4053-8C87-A6305EAFC4FA}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{6BE684E4-194C-43B0-B9B8-8269646DE989}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{6eb8db94-fe96-443f-a366-5fe0cee7fb1c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{7D7180B3-A452-4FFF-8D1F-7B32B248AB70}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{802ec45b-1e99-4b83-9920-87c98277ba9d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{814182FF-58F7-11E1-853C-78E7D1CA7337}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{90BBBABB-255B-4FE3-A06F-685A15E93A4C}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{914598a6-28f0-42ac-bf3d-a29c6047a739}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{949D7457-6151-4FA0-9E46-D82A6F9927CF}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{9580d7dd-0379-4658-9870-d5be7d52d6de}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{999AC137-42DC-41D3-BA9D-A325A9E1A986}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{9B322459-4AD9-4F81-8EEA-DC77CDD18CA6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{9B694F87-000E-4BE6-91AC-FE2E50D61A6F}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{9CC0413E-5717-4af5-82EB-6103D8707B45}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{9CC9BEB7-9D24-47C7-8F9D-CCC9DCAC29EB}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{AB0D8EF9-866D-4d39-B83F-453F3B8F6325}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{abe47285-c002-46d1-95e4-c4aec3c78f50}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{B8794785-F7E3-4C2D-A33D-7B0BA0D30E18}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{c02edc8d-d627-46c9-abd9-c8b78f88c223}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{C100BECE-D33A-4A4B-BF23-BBEF4663D017}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{c7491fe4-66f4-4421-9954-b55f03db3186}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{D28262A1-8066-492D-BCE8-635DA75368B7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{E5C16D49-2464-4382-BB20-97A4B5465DB9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{e6dec100-4e0f-4927-92be-e69d7c15c821}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{01979c6a-42fa-414c-b8aa-eee2c8202018}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{04268430-d489-424d-b914-0cff741d6684}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{059f0f37-910e-4ff0-a7ee-ae8d49dd319b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{05f02597-fe85-4e67-8542-69567ab8fd4f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{06edcfeb-0fd0-4e53-acca-a6f8bbf81bcb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0b886108-1899-4d3a-9c0d-42d8fc4b9108}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0b9fdccc-451c-449c-9bd8-6756fcc6091a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0bf2fb94-7b60-4b4d-9766-e82f658df540}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0c478c5b-0351-41b1-8c58-4a6737da32e3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0d4fdc09-8c27-494a-bda0-505e4fd8adae}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0f67e49f-fe51-4e9f-b490-6f2948cc6027}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0fa2ee03-1feb-5057-3bb3-eb25521b8482}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{11c5d8ad-756a-42c2-8087-eb1b4a72a846}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{11cd958a-c507-4ef3-b3f2-5fd9dfbd2c78}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{125f2cf1-2768-4d33-976e-527137d080f8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{15a7a4f8-0072-4eab-abad-f98a4d666aed}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{15ca44ff-4d7a-4baa-bba5-0998955e531e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{199fe037-2b82-40a9-82ac-e1d46c792b99}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{1b562e86-b7aa-4131-badc-b6f3a001407e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{1b6b0772-251b-4d42-917d-faca166bc059}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{1c95126e-7eea-49a9-a3fe-a378b03ddb4d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{1db28f2e-8f80-4027-8c5a-a11f7f10f62d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{1e9a4978-78c2-441e-8858-75b5d1326bc5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{1f678132-5938-4686-9fdc-c8ff68f15c85}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{206f6dea-d3c5-4d10-bc72-989f03c8b84b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{21b7c16e-c5af-4a69-a74a-7245481c1b97}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{2a274310-42d5-4019-b816-e4b8c7abe95c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{2e35aaeb-857f-4beb-a418-2e6c0e54d988}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{2e6cb42e-161d-413b-a6c1-84ca4c1e5890}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{2f07e2ee-15db-40f1-90ef-9d7ba282188a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{2ff3e6b7-cb90-4700-9621-443f389734ed}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{306c4e0b-e148-543d-315b-c618eb93157c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{30e1d284-5d88-459c-83fd-6345b39b19ec}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{331c3b3a-2005-44c2-ac5e-77220c37d6b4}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{355c44fe-0c8e-4bf8-be28-8bc7b5a42720}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{3629dd4d-d6f1-4302-a623-0768b51501c7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{36c23e18-0e66-11d9-bbeb-505054503030}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{3903d5b9-988d-4c31-9ccd-4022f96703f0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{3cb2a168-fe19-4a4e-bdad-dcf422f13473}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{3e59a529-b0b3-4a11-8129-9ffe6bb46eb9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{3f471139-acb7-4a01-b7a7-ff5da4ba2d43}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{3ff37a1c-a68d-4d6e-8c9b-f79e8b16c482}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{40783728-8921-45d0-b231-919037b4b4fd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{412bdff2-a8c4-470d-8f33-63fe0d8c20e2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{43e63da5-41d1-4fbf-aded-1bbed98fdd1d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{45eec9e5-4a1b-5446-7ad8-a4ab1313c437}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{46c78e5c-a213-46a8-8a6b-622f6916201d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{47bc9477-a8ba-452e-b951-4f2ed3593cf9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{47bfa2b7-bd54-4fac-b70b-29021084ca8f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{494e7a3d-8db9-4ec4-b43e-2844af6e38d6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{4af188ac-e9c4-4c11-b07b-1fabc07dfeb2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{4cb314df-c11f-47d7-9c04-65fb0051561b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{4cec9c95-a65f-4591-b5c4-30100e51d870}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{4ee76bd8-3cf4-44a0-a0ac-3937643e37a3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{52fc89f8-995e-434c-a91e-199986449890}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{530fb9b9-c515-4472-9313-fb346f9255e3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{538cbbad-4877-4eb2-b26e-7caee8f0f8cb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{54cb22ff-26b4-4393-a8c2-6b0715912c5f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{555908d1-a6d7-4695-8e1e-26931d2012f4}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{55ab77f6-fa04-43ef-af45-688fbf500482}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{595f7f52-c90a-4026-a125-8eb5e083f15e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{5d674230-ca9f-11da-a94d-0800200c9a66}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{5d896912-022d-40aa-a3a8-4fa5515c76d7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{5f92bc59-248f-4111-86a9-e393e12c6139}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{62de9e48-90c6-4755-8813-6a7d655b0802}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{632f767e-0ec3-47b9-ba1c-a0e62a74728a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{63d1e632-95cc-4443-9312-af927761d52a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{64ef2b1c-4ae1-4e64-8599-1636e441ec88}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{651df93b-5053-4d1e-94c5-f6e6d25908d0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{66a5c15c-4f8e-4044-bf6e-71d896038977}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{67fe2216-727a-40cb-94b2-c02211edb34a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{6a1f2b00-6a90-4c38-95a5-5cab3b056778}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{6b93bf66-a922-4c11-a617-cf60d95c133d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{6bba3851-2c7e-4dea-8f54-31e5afd029e3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{7237fff9-a08a-4804-9c79-4a8704b70b87}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{72cd9ff7-4af8-4b89-aede-5f26fda13567}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{73a33ab2-1966-4999-8add-868c41415269}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{73e9c9de-a148-41f7-b1db-4da051fdc327}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{74c2135f-cc76-45c3-879a-ef3bb1eeaf86}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{75ebc33e-997f-49cf-b49f-ecc50184b75d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{7725b5f9-1f2e-4e21-baeb-b2af4690bc87}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{7b563579-53c8-44e7-8236-0f87b9fe6594}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{7b6bc78c-898b-4170-bbf8-1a469ea43fc5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{7d5387b0-cbe0-11da-a94d-0800200c9a66}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{7da4fe0e-fd42-4708-9aa5-89b77a224885}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{85a62a0d-7e17-485f-9d4f-749a287193a6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{89203471-d554-47d4-bde4-7552ec219999}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{89592015-d996-4636-8f61-066b5d4dd739}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{89fe8f40-cdce-464e-8217-15ef97d4c7c3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{8c416c79-d49b-4f01-a467-e56d3aa8234c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{8e6a5303-a4ce-498f-afdb-e03a8a82b077}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{945a8954-c147-4acd-923f-40c45405a658}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{951b41ea-c830-44dc-a671-e2c9958809b8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{95353826-4fbe-41d4-9c42-f521c6e86360}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{9580d7dd-0379-4658-9870-d5be7d52d6de}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{96f4a050-7e31-453c-88be-9634f4e02139}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{9741fd4e-3757-479f-a3c6-fc49f6d5edd0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{988c59c5-0a1c-45b6-a555-0c62276e327d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{991f8fe6-249d-44d6-b93d-5a3060c1dedb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{9988748e-c2e8-4054-85f6-0c3e1cad2470}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{9c205a39-1250-487d-abd7-e831c6290539}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{9f650c63-9409-453c-a652-83d7185a2e83}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{9f7b5df4-b902-48bc-bc94-95068c6c7d26}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a0e3d8ea-c34f-4419-a1db-90435b8b21d0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a4445c76-ed85-c8a3-02c1-532a38614a9e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a67075c2-3e39-4109-b6cd-6d750058a731}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a68ca8b7-004f-d7b6-a698-07e2de0f1f5d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a6ad76e3-867a-4635-91b3-4904ba6374d7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a7f2235f-be51-51ed-decf-f4498812a9a2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a8a1f2f6-a13a-45e9-b1fe-3419569e5ef2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{aa3aa23b-bb6d-425a-b58c-1d7e37f5d02a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{abf1f586-2e50-4ba8-928d-49044e6f0db7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ac43300d-5fcc-4800-8e99-1bd3f85f0320}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ac52ad17-cc01-4f85-8df5-4dce4333c99b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ad5162d8-daf0-4a25-88a7-01cbeb33902e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ae4bd3be-f36f-45b6-8d21-bdd6fb832853}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{aea1b4fa-97d1-45f2-a64c-4d69fffd92c9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{aec5c129-7c10-407d-be97-91a042c61aaa}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{b0aa8734-56f7-41cc-b2f4-de228e98b946}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{b2fcd41f-9a40-4150-8c92-b224b7d8c8aa}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{b675ec37-bdb6-4648-bc92-f3fdc74d3ca2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{b977cf02-76f6-df84-cc1a-6a4b232322b6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{b99317e5-89b7-4c0d-abd1-6e705f7912dc}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ba093605-3909-4345-990b-26b746adee0a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ba2ffb5c-e20a-4fb9-91b4-45f61b4b66a0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{babda89a-4d5e-48eb-af3d-e0e8410207c0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{bc0669e1-a10d-4a78-834e-1ca3c806c93b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c02afc2b-e24e-4449-ad76-bcc2c2575ead}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c03715ce-ea6f-5b67-4449-da1d1e1afeb8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c18672d1-dc18-4dfd-91e4-170cf37160cf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c26c4f3c-3f66-4e99-8f8a-39405cfed220}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c4636a1e-7986-4646-bf10-7bc3b4a76e8e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c76baa63-ae81-421c-b425-340b4b24157f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c914f0df-835a-4a22-8c70-732c9a80c634}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{cb017cd2-1f37-4e65-82bc-3e91f6a37559}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{cbda4dbf-8d5d-4f69-9578-be14aa540d22}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{cd9c6198-bf73-4106-803b-c17d26559018}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{cdc05e28-c449-49c6-b9d2-88cf761644df}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{cdead503-17f5-4a3e-b7ae-df8cc2902eb9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ce8dee0b-d539-4000-b0f8-77bed049c590}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{cfc18ec0-96b1-4eba-961b-622caee05b0a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{d0e22efc-ac66-4b25-a72d-382736b5e940}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{d1bc9aff-2abf-4d71-9146-ecb2a986eb85}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{d48ce617-33a2-4bc3-a5c7-11aa4f29619e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{d5c25f9a-4d47-493e-9184-40dd397a004d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{d6f68875-cdf5-43a5-a3e3-53ffd683311c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{dbe9b383-7cf3-4331-91cc-a3cb16a3b538}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{dd70bc80-ef44-421b-8ac3-cd31da613a4e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{de29cf61-5ee6-43ff-9aac-959c4e13cc6c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{de7b24ea-73c8-4a09-985d-5bdadcfa9017}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{dea07764-0790-44de-b9c4-49677b17174f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e104fb41-6b04-4f3a-b47d-f0df2f02b954}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e2816346-87f4-4f85-95c3-0c79409aa89d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e3bac9f8-27be-4823-8d7f-1cc320c05fa7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e4480490-85b6-11dd-ad8b-0800200c9a66}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e4f68870-5ae8-4e5b-9ce7-ca9ed75b0245}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e595f735-b42a-494b-afcd-b68666945cd3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e5ba83f6-07d0-46b1-8bc7-7e669a1d31dc}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e670a5a2-ce74-4ab4-9347-61b815319f4c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e8f9af91-afbe-5a03-dfec-5d591686326c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ea216962-877b-5b73-f7c5-8aef5375959e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{eee173ef-7ed2-45de-9877-01c70a852fbd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ef1cc15b-46c1-414e-bb95-e76b077bd51e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f029ac39-38f0-4a40-b7de-404d244004cb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f2e2ce31-0e8a-4e46-a03b-2e0fe97e93c2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f3c5e28e-63f6-49c7-a204-e48a1bc4b09d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f5d05b38-80a6-4653-825d-c414e4ab3c68}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f708c483-4880-11e6-9121-5cf37068b67b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f717d024-f5b4-4f03-9ab9-331b2dc38ffb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f9fe3908-44b8-48d9-9a32-5a763ff5ed79}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{fae10392-f0af-4ac0-b8ff-9f4d920c3cdf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{fc4e8f51-7a04-4bab-8b91-6321416f72ab}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{fc65ddd8-d6ef-4962-83d5-6e5cfe9ce148}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{fcbb06bb-6a2a-46e3-abaa-246cb4e508b2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{01090065-b467-4503-9b28-533766761087}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{06edcfeb-0fd0-4e53-acca-a6f8bbf81bcb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{08466062-aed4-4834-8b04-cddb414504e5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{0888e5ef-9b98-4695-979d-e92ce4247224}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{09608c12-c1da-4104-a6fe-b959cf57560a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{09ac07b9-6ac9-43bc-a50f-58419a797c69}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{09ec9687-d7ad-40ca-9c5e-78a04a5ae993}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{0dd4d48e-2bbf-452f-a7ec-ba3dba8407ae}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{0ff1c24b-7f05-45c0-abdc-3c8521be4f62}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{10a208dd-a372-421c-9d99-4fad6db68b62}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1139c61b-b549-4251-8ed3-27250a1edec8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{11a75546-3234-465e-bec8-2d301cb501ac}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{126cdb97-d346-4894-8a34-658da5eea1b6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{134ea407-755d-4a93-b8a6-f290cd155023}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{13bc4371-4e21-4e46-a84f-8c0ffb548ced}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1418ef04-b0b4-4623-bf7e-d74ab47bbdaa}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{15a7a4f8-0072-4eab-abad-f98a4d666aed}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1b8b402d-78dc-46fb-bf71-46e64aedf165}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1bda2ab1-bbc1-4acb-a849-c0ef2b249672}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1db28f2e-8f80-4027-8c5a-a11f7f10f62d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1ed6976a-4171-4764-b415-7ea08bc46c51}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1edeee53-0afe-4609-b846-d8c0b2075b1f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{21d79db0-8e03-41cd-9589-f3ef7001a92a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{23b8d46b-67dd-40a3-b636-d43e50552c6d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{27a8c1e2-eb19-463e-8424-b399df27a216}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{287d59b6-79ba-4741-a08b-2fedeede6435}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{28aa95bb-d444-4719-a36f-40462168127e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{28e25b07-c47f-473d-8b24-2e171cca808a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{2a45d52e-bbf3-4843-8e18-b356ed5f6a65}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{2a576b87-09a7-520e-c21a-4942f0271d67}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{2cd58181-0bb6-463e-828a-056ff837f966}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{2d318b91-e6e7-4c46-bd04-bfe6db412cf9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{2ed299d2-2f6b-411d-8d15-f4cc6fde0c70}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{2f94e1cc-a8c5-4fe7-a1c3-53d7bda8e73e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{30336ed4-e327-447c-9de0-51b652c86108}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{314de49f-ce63-4779-ba2b-d616f6963a88}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{315a8872-923e-4ea2-9889-33cd4754bf64}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{319122a9-1485-4e48-af35-7db2d93b8ad2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{32254f6c-aa33-46f0-a5e3-1cbcc74bf683}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3527cb55-1298-49d4-ab94-1243db0fcaff}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3663a992-84be-40ea-bba9-90c7ed544222}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{36c23e18-0e66-11d9-bbeb-505054503030}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3a5bef13-d0f7-4e7f-9ec8-5e707df711d0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3a718a68-6974-4075-abd3-e8243caef398}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3aa52b8b-6357-4c18-a92e-b53fb177853b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3ae1ea61-c002-47fb-b06c-4022a8c98929}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3c088e51-65be-40d1-9b90-62bfec076737}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3cb40aaa-1145-4fb8-b27b-7e30f0454316}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3cc2d4af-da5e-4ed4-bcbe-3cf995940483}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3d42a67d-9ce8-4284-b755-2550672b0ce0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3da494e4-0fe2-415c-b895-fb5265c5c83b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3f471139-acb7-4a01-b7a7-ff5da4ba2d43}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{40ab57c2-1c53-4df9-9324-ff7cf898a02c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{41862974-da3b-4f0b-97d5-bb29fbb9b71e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{442c11c5-304b-45a4-ae73-dc2194c4e876}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{46098845-8a94-442d-9095-366a6bcfefa9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{4a104570-ec6d-4560-a40f-858fa955e84f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{4a933674-fb3d-4e8d-b01d-17ee14e91a3e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{4cb314df-c11f-47d7-9c04-65fb0051561b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{4de9bc9c-b27a-43c9-8994-0915f1a5e24f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{4eacb4d0-263b-4b93-8cd6-778a278e5642}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{50df9e12-a8c4-4939-b281-47e1325ba63e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{50f99b2d-96d2-421f-be4c-222c4140da9f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{530fb9b9-c515-4472-9313-fb346f9255e3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5402e5ea-1bdd-4390-82be-e108f1e634f5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{54164045-7c50-4905-963f-e5bc1eef0cca}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{57003e21-269b-4bdc-8434-b3bf8d57d2d5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{579402a2-883c-45d8-b70a-9bc856407751}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{58980f4b-bd39-4a3e-b344-492ed2254a4e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{595f33ea-d4af-4f4d-b4dd-9dacdd17fc6e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5b0a651a-8807-45cc-9656-7579815b6af0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5b5ab841-7d2e-4a95-bb4f-095cdf66d8f0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5bbca4a8-b209-48dc-a8c7-b23d3e5216fb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5d674230-ca9f-11da-a94d-0800200c9a66}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5d896912-022d-40aa-a3a8-4fa5515c76d7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5ec13d8e-4b3f-422e-a7e7-3121a1d90c7a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5f0e257f-c224-43e5-9555-2adcb8540a58}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{63b530f8-29c9-4880-a5b4-b8179096e7b8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{63d2bb1d-e39a-41b8-9a3d-52dd06677588}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6489b27f-7c43-5886-1d00-0a61bb2a375b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{64a98c25-9e00-404e-84ad-6700dfe02529}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{64ef2b1c-4ae1-4e64-8599-1636e441ec88}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{66a5c15c-4f8e-4044-bf6e-71d896038977}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{67d07935-283a-4791-8f8d-fa9117f3e6f2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{699e309c-e782-4400-98c8-e21d162d7b7b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{69c8ca7e-1adf-472b-ba4c-a0485986b9f6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6a1f2b00-6a90-4c38-95a5-5cab3b056778}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6b1ffe48-5b1e-4793-9f7f-ae926454499d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6d7662a9-034e-4b1f-a167-67819c401632}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6d8a3a60-40af-445a-98ca-99359e500146}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6df57621-e7e4-410f-a7e9-e43eeb61b11f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6e400999-5b82-475f-b800-cef6fe361539}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6eb8db94-fe96-443f-a366-5fe0cee7fb1c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{712abb2d-d806-4b42-9682-26da01d8b307}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{72561cf0-c85c-4f78-9e8d-cba9093df62d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{728b02d9-bf21-49f6-be3f-91bc06f7467e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{72d211e1-4c54-4a93-9520-4901681b2271}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{73370bd6-85e5-430b-b60a-fea1285808a7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{741bb90c-a7a3-49d6-bd82-1e6b858403f7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{741fc222-44ed-4ba7-98e3-f405b2d2c4b4}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{747ef6fd-e535-4d16-b510-42c90f6873a1}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-0870-49e5-bdce-9d7028279489}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-0936-4a55-9d26-5f298f3180bf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-0cc6-49da-8cd9-8903a5222aa0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-77b8-4ba8-9474-4f4a9db2f5c6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-8670-4eb6-b535-3b9d6bb222fd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-997f-49cf-b49f-ecc50184b75d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-c8ae-4f93-9ca1-683a53e20cb6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{76ab12d5-c986-4e60-9d7c-2a092b284cdd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{770ca594-b467-4811-b355-28f5e5706987}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{777ba8fe-2498-4875-933a-3067de883070}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{7d29d58a-931a-40ac-8743-48c733045548}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{7d7b0c39-93f6-4100-bd96-4dda859652c5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{7e58e69a-e361-4f06-b880-ad2f4b64c944}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{7e87506f-bace-4bf1-bc09-3a1f37045c71}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{7eafcf79-06a7-460b-8a55-bd0a0c9248aa}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{8127f6d4-59f9-4abf-8952-3e3a02073d5f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{83d6e83b-900b-48a3-9835-57656b6f6474}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{8530db6e-51c0-43d6-9d02-a8c2088526cd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{85a62a0d-7e17-485f-9d4f-749a287193a6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{85be49ea-38f1-4547-a604-80060202fb27}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{85fe7609-ff4a-48e9-9d50-12918e43e1da}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{88c09888-118d-48fc-8863-e1c6d39ca4df}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{88cd9180-4491-4640-b571-e3bee2527943}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{8939299f-2315-4c5c-9b91-abb86aa0627d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{89592015-d996-4636-8f61-066b5d4dd739}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{89a2278b-c662-4aff-a06c-46ad3f220bca}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{89b1e9f0-5aff-44a6-9b44-0a07a7ce5845}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{8bcdf442-3070-4118-8c94-e8843be363b3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{8ce93926-bdae-4409-9155-2fe4799ef4d3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{906b8a99-63ce-58d7-86ab-10989bbd5567}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{91f5fb12-fdea-4095-85d5-614b495cd9de}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9213c3e1-0d6c-52dd-78ea-f3b082111406}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9363ccd9-d429-4452-9adb-2501e704b810}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{93a19ab3-fb2c-46eb-91ef-56b0a318b983}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{952773bf-c2b7-49bc-88f4-920744b82c43}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{95353826-4fbe-41d4-9c42-f521c6e86360}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9580d7dd-0379-4658-9870-d5be7d52d6de}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{968f313b-097f-4e09-9cdd-bc62692d138b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{96f4a050-7e31-453c-88be-9634f4e02139}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{973143dd-f3c7-4ef5-b156-544ac38c39b6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{97ca8142-10b1-4baa-9fbb-70a7d11231c3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9803daa0-81ba-483a-986c-f0e395b9f8d1}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{98bf1cd3-583e-4926-95ee-a61bf3f46470}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{98e0765d-8c42-44a3-a57b-760d7f93225a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9c2a37f3-e5fd-5cae-bcd1-43dafeee1ff0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9cc0413e-5717-4af5-82eb-6103d8707b45}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9d55b53d-449b-4824-a637-24f9d69aa02f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9f973c1d-d056-4e38-84a5-7be81cdd6ab6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9fc66dd7-98c7-4b83-8293-46a18439b03b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{a0c1853b-5c40-4b15-8766-3cf1c58f985a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{a615acb9-d5a4-4738-b561-1df301d207f8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{a7975c8f-ac13-49f1-87da-5a984a4ab417}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{a83fa99f-c356-4ded-9fd6-5a5eb8546d68}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{a9c11050-9e93-4fa4-8fe0-7c4750a345b2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{aa4c798d-d91b-4b07-a013-787f5803d6fc}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{aabf8b86-7936-4fa2-acb0-63127f879dbf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{aaeac398-3028-487c-9586-44eacad03637}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{aaf67066-0bf8-469f-ab76-275590c434ee}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{add0de40-32b0-4b58-9d5e-938b2f5c1d1f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ae4bd3be-f36f-45b6-8d21-bdd6fb832853}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{af0a5a6d-e009-46d4-8867-42f2240f8a72}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b059b83f-d946-4b13-87ca-4292839dc2f2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b2fcd41f-9a40-4150-8c92-b224b7d8c8aa}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b447b4db-7780-11e0-ada3-18a90531a85a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b447b4de-7780-11e0-ada3-18a90531a85a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b447b4df-7780-11e0-ada3-18a90531a85a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b447b4e1-7780-11e0-ada3-18a90531a85a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b6cc0d55-9ecc-49a8-b929-2b9022426f2a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b6d775ef-1436-4fe6-bad3-9e436319e218}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b92cf7fd-dc10-4c6b-a72d-1613bf25e597}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b977cf02-76f6-df84-cc1a-6a4b232322b6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b9da9fe6-ae5f-4f3e-b2fa-8e623c11dc75}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ba093605-3909-4345-990b-26b746adee0a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ba723d81-0d0c-4f1e-80c8-54740f508ddf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{bd12f3b8-fc40-4a61-a307-b7a013a069c1}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{bea18b89-126f-4155-9ee4-d36038b02680}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{bf406804-6afa-46e7-8a48-6c357e1d6d61}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{bff15e13-81bf-45ee-8b16-7cfead00da86}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{c2f36562-a1e4-4bc3-a6f6-01a7adb643e8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{c4efc9bb-2570-4821-8923-1bad317d2d4b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{c651f5f6-1c0d-492e-8ae1-b4efd7c9d503}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{c6bf6832-f7bd-4151-ac21-753ce4707453}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{c76baa63-ae81-421c-b425-340b4b24157f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{c9bdb4eb-9287-4c8e-8378-6896f0d1c5ef}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{cab2b8a5-49b9-4eec-b1b0-fac21da05a3b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{cb070027-1534-4cf3-98ea-b9751f508376}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{cbda4dbf-8d5d-4f69-9578-be14aa540d22}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{cd7cf0d0-02cc-4872-9b65-0dba0a90efe8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{cf3f502e-b40d-4071-996f-00981edf938e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d0e22efc-ac66-4b25-a72d-382736b5e940}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d1bc9aff-2abf-4d71-9146-ecb2a986eb85}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d2e990da-8504-4702-a5e5-367fc2f823bf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d39b6336-cfcb-483b-8c76-7c3e7d02bcb8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d3f29eda-805d-428a-9902-b259b937f84b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d710d46c-235d-4798-ac20-9f83e1dcd557}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d8965fcf-7397-4e0e-b750-21a4580bd880}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{dab3b18c-3c0f-43e8-80b1-e44bc0dad901}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{db00dfb6-29f9-4a9c-9b3b-1f4f9e7d9770}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{dbe9b383-7cf3-4331-91cc-a3cb16a3b538}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{dcbe5aaa-16e2-457c-9337-366950045f0a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{de095dbe-8667-4168-94c2-48ca61665aca}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{de513a55-c345-438b-9a74-e18cac5c5cc5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{de7b24ea-73c8-4a09-985d-5bdadcfa9017}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e0c6f6de-258a-50e0-ac1a-103482d118bc}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e1dd7e52-621d-44e3-a1ad-0370c2b25946}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e4d53f84-7de3-11d8-9435-505054503030}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e4f68870-5ae8-4e5b-9ce7-ca9ed75b0245}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e53df8ba-367a-4406-98d5-709ffb169681}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e5c16d49-2464-4382-bb20-97a4b5465db9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e6307a09-292c-497e-aad6-498f68e2b619}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e6835967-e0d2-41fb-bcec-58387404e25a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e7558269-3fa5-46ed-9f4d-3c6e282dde55}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ea8cd8a5-78ff-4418-b292-aadc6a7181df}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ec23f986-ae2d-4269-b52f-4e20765c1a94}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ed8b9bd3-f66e-4ff2-b86b-75c7925f72a9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{eef54e71-0661-422d-9a98-82fd4940b820}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f0be35f8-237b-4814-86b5-ade51192e503}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f0db7ef8-b6f3-4005-9937-feb77b9e1b43}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f1201b5a-e170-42b6-8d20-b57ac57e6416}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f1394de0-32c7-4a76-a6de-b245e48f4615}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f1ef270a-0d32-4352-ba52-dbab41e1d859}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f2311b48-32be-4902-a22a-7240371dbb2c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f3f53c76-b06d-4f15-b412-61164a0d2b73}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f43c3c35-22e2-53eb-f169-07594054779e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f4aed7c7-a898-4627-b053-44a7caa12fcd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f5dbaa02-15d6-4644-a784-7032d508bf64}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f82fb576-e941-4956-a2c7-a0cf83f6450a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f8ad09ba-419c-5134-1750-270f4d0fb889}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f9fe3908-44b8-48d9-9a32-5a763ff5ed79}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{fa773482-f6ed-4895-8a7d-4f5850678e59}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{fae10392-f0af-4ac0-b8ff-9f4d920c3cdf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{fae96d09-ade1-5223-0098-af7b67348531}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{fb829150-cd7d-44c3-af5b-711a3c31cedc}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{fbcfac3f-8459-419f-8e48-1f0b49cdb85e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{fc65ddd8-d6ef-4962-83d5-6e5cfe9ce148}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ff79a477-c45f-4a52-8ae0-2b324346d4e4}" /v "Enabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKU\.DEFAULT\Control Panel\Mouse" /v "Beep" /t REG_SZ /d "No" /f
Reg.exe add "HKU\.DEFAULT\Control Panel\Mouse" /v "ExtendedSounds" /t REG_SZ /d "No" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "ActiveWindowTracking" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "Beep" /t REG_SZ /d "No" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "DoubleClickHeight" /t REG_SZ /d "4" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "DoubleClickSpeed" /t REG_SZ /d "500" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "DoubleClickWidth" /t REG_SZ /d "4" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "ExtendedSounds" /t REG_SZ /d "No" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseHoverHeight" /t REG_SZ /d "4" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseHoverWidth" /t REG_SZ /d "4" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseSensitivity" /t REG_SZ /d "10" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseSpeed" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseThreshold1" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseThreshold2" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseTrails" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "SmoothMouseXCurve" /t REG_BINARY /d "0000000000000000c0cc0c0000000000809919000000000040662600000000000033330000000000" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "SmoothMouseYCurve" /t REG_BINARY /d "0000000000000000000038000000000000007000000000000000a800000000000000e00000000000" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "SnapToDefaultButton" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "SwapMouseButtons" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseHoverTime" /t REG_SZ /d "8" /f
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Flags" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\Control Panel\Keyboard" /v "KeyboardDelay" /t REG_SZ /d "0" /f 
Reg.exe add "HKCU\Control Panel\Keyboard" /v "InitialKeyboardIndicators" /t REG_SZ /d "0" /f 
Reg.exe add "HKCU\Control Panel\Keyboard" /v "KeyboardSpeed" /t REG_SZ /d "31" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "DelayBeforeAcceptance" /t REG_SZ /d "0" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last BounceKey Setting" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last Valid Delay" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last Valid Repeat" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last Valid Wait" /t REG_DWORD /d "0" /f 
echo Todas as otimizações foram aplicadas com sucesso.
del /f /s /q %systemdrive%\*.etl
del /f /s /q %systemdrive%\*.log
del /f /s /q %systemdrive%\*.tmp
del /f /s /q %systemdrive%\*.old
del /f /s /q %systemdrive%\*.bak
del /f /s /q %systemdrive%\*.bac
del /f /s /q %systemdrive%\*.bup
del /f /s /q %systemdrive%\*.chk
del /f /s /q %systemdrive%\*.dmp
del /f /s /q %systemdrive%\*.temp
RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 8
RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 16384
RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 2
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\SystemRestore" /v DisableConfig /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\SystemRestore" /v DisableSR /t REG_DWORD /d 0 /f
REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "PerformancePolicy" /t REG_DWORD /d 1 /f
REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "EnergyEstimationEnabled" /t REG_DWORD /d 0 /f
REG ADD "HKCU\Software\Microsoft\DirectStorage" /v "Enable" /t REG_DWORD /d 1 /f

REM Desabilitar tarefas relacionadas à Manutenção e Winsat
schtasks /Change /TN "Microsoft\Windows\Maintenance\WinSAT" /Disable
schtasks /Change /TN "Microsoft\Windows\Defrag\ScheduledDefrag" /Disable

REM Desabilitar tarefas relacionadas ao Bluetooth
schtasks /Change /TN "Microsoft\Windows\Bluetooth\UninstallDeviceTask" /Disable

REM Desabilitar tarefas de Localização
schtasks /Change /TN "Microsoft\Windows\Location\WindowsActionDialog" /Disable

REM Desabilitar tarefas de Fala (Speech)
schtasks /Change /TN "Microsoft\Windows\Speech\SpeechModelDownloadTask" /Disable

REM Desabilitar tarefas de Mapas
schtasks /Change /TN "Microsoft\Windows\Maps\MapsToastTask" /Disable

schtasks /Change /TN "Microsoft\Windows\Windows Error Reporting\QueueReporting" /Disable

REM Desabilitar tarefas de Windows Update
schtasks /Change /TN "Microsoft\Windows\WindowsUpdate\Refresh Group Policy Cache" /Disable
schtasks /Change /TN "Microsoft\Windows\WindowsUpdate\Scheduled Start" /Disable

:: Remover restrições de instalação de drivers
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\DeviceInstall" /f
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\DeviceInstall\Restrictions" /f
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Printers" /f
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Printers\PointAndPrint" /f

:: Remover todas as configurações aplicadas pelo gpedit.msc
RD /S /Q "C:\Windows\System32\GroupPolicy"
RD /S /Q "C:\Windows\System32\GroupPolicyUsers"

:: Atualizar as políticas para aplicar imediatamente
gpupdate /force

reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Power" /v "HiberbootEnabled" /t REG_DWORD /d 1 /f

:: 2. Desativar Power Throttling para maximizar desempenho da CPU
echo -- Desativando Power Throttling
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling" /v "PowerThrottlingOff" /t REG_DWORD /d 1 /f


REG add "HKCU\Control Panel\Desktop" /v "UserPreferencesMask" /t REG_BINARY /d 9012078010000000 /f

:: 4. Desativar notificacoes de sistema para evitar interrupcoes em jogos
echo -- Desativando notificacoes de sistema
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\PushNotifications" /v "ToastEnabled" /t REG_DWORD /d 0 /f


:: 5. Desativar Game Bar para liberar recursos
echo -- Desativando Game Bar
reg add "HKCU\System\GameConfigStore" /v "GameDVR_FSEBehaviorMode" /t REG_DWORD /d 2 /f
reg add "HKCU\Software\Microsoft\GameBar" /v "AutoGameModeEnabled" /t REG_DWORD /d 0 /f


:: 6. Desativar otimizacoes de tela cheia para jogos
echo -- Desativando otimizacoes de tela cheia
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "UseDpiScaling" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "DirectXUserGlobalSettings" /t REG_SZ /d "SwapEffectUpgradeEnable=1;VRROptimizeEnable=0;" /f


:: 7. Desativar tarefas agendadas adicionais que afetam desempenho
echo -- Desativando tarefas agendadas adicionais
schtasks /change /TN "\Microsoft\Windows\Application Experience\ProgramDataUpdater" /DISABLE >nul 2>&1
schtasks /change /TN "\Microsoft\Windows\Power Efficiency Diagnostics\AnalyzeSystem" /DISABLE >nul 2>&1


:: 8. Ajustar prioridade de desempenho para processos em primeiro plano
echo -- Priorizando processos em primeiro plano
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d 38 /f


:: 1. Desativar hibernacao para liberar espaco e reduzir overhead
echo -- Desativando hibernacao
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "HibernateEnabled" /t REG_DWORD /d 0 /f


:: 2. Desativar efeitos visuais avancados para reduzir uso de GPU
echo -- Desativando efeitos visuais avancados
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "TaskbarAnimations" /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "ListviewAlphaSelect" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "ListviewShadow" /t REG_DWORD /d 0 /f


:: 3. Desativar indexacao de pesquisa para reduzir uso de disco
echo -- Desativando indexacao de pesquisa
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowIndexingEncryptedStoresOrItems" /t REG_DWORD /d 0 /f


:: 4. Desativar atualizacoes automaticas de mapas para evitar uso de rede
echo -- Desativando atualizacoes automaticas de mapas
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Maps" /v "AutoDownloadAndUpdateMapData" /t REG_DWORD /d 0 /f


:: 5. Desativar coletor de diagnosticos de energia para reduzir uso de CPU
echo -- Desativando coletor de diagnosticos de energia
schtasks /change /TN "\Microsoft\Windows\Power Efficiency Diagnostics\ExamineSystem" /DISABLE >nul 2>&1


:: 6. Desativar sincronizacao de conteudo automatico para reduzir uso de disco/rede
echo -- Desativando sincronizacao de conteudo automatico
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SilentInstalledAppsEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SystemPaneSuggestionsEnabled" /t REG_DWORD /d 0 /f


:: 7. Desativar modo de jogo automatico para evitar interferencias indesejadas
echo -- Desativando modo de jogo automatico
reg add "HKCU\Software\Microsoft\GameBar" /v "UseNexusForGameBarEnabled" /t REG_DWORD /d 0 /f


:: 3. Desativar atualizacoes automaticas da Store para reduzir uso de rede
echo -- Desativando atualizacoes automaticas da Store
reg add "HKLM\SOFTWARE\Policies\Microsoft\WindowsStore" /v "AutoDownload" /t REG_DWORD /d 2 /f

:: 4. Desativar otimizacoes de energia USB para evitar latencia
echo -- Desativando otimizacoes de energia USB
reg add "HKLM\System\ControlSet001\Control\Power\PowerSettings\2a737441-1930-4402-8d77-b2bebba308a3\0853a681-27c8-4100-a2fd-82013e970683" /v "Attributes" /t REG_DWORD /d 2 /f
reg add "HKLM\System\ControlSet001\Control\Power\PowerSettings\2a737441-1930-4402-8d77-b2bebba308a3\d4e98f31-5ffe-4ce1-be31-1b38b384c009" /v "Attributes" /t REG_DWORD /d 2 /f


:: 6. Desativar efeitos de som de comunicacao para evitar interrupcoes
echo -- Desativando efeitos de som de comunicacao
reg add "HKCU\Software\Microsoft\Multimedia\Audio" /v "UserDuckingPreference" /t REG_DWORD /d 3 /f


:: 7. Desativar tarefas agendadas adicionais de diagnostico e atualizacoes
echo -- Desativando tarefas agendadas adicionais
schtasks /change /TN "\Microsoft\Windows\Diagnosis\Scheduled" /DISABLE >nul 2>&1
schtasks /change /TN "\Microsoft\Windows\UpdateOrchestrator\Schedule Scan" /DISABLE >nul 2>&1


:: 8. Desativar aceleracao de hardware para impressoras para reduzir latencia
echo -- Desativando aceleracao de hardware para impressoras
reg add "HKCU\Software\Microsoft\Windows NT\CurrentVersion\Windows" /v "DeviceAcceleration" /t REG_DWORD /d 0 /f
	

:: 9. Desativar dicas e sugestoes do Windows para reduzir uso de CPU
echo -- Desativando dicas e sugestoes do Windows
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "Start_IrisRecommendations" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\UserProfileEngagement" /v "ScoobeSystemSettingEnabled" /t REG_DWORD /d 0 /f


:: 10. Desativar historico de atividades para reduzir uso de disco
echo -- Desativando historico de atividades
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "PublishUserActivities" /t REG_DWORD /d 0 /f


:: 1. Desativar recursos de personalizacao dinamica para reduzir uso de CPU
echo -- Desativando personalizacao dinamica
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "FeatureManagementEnabled" /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SubscribedContentEnabled" /t REG_DWORD /d 0 /f


:: 2. Desativar rastreamento de apps para reduzir uso de disco
echo -- Desativando rastreamento de apps
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "Start_TrackDocs" /t REG_DWORD /d 0 /f


:: 3. Desativar efeitos de som adicionais para reduzir latencia de audio
echo -- Desativando efeitos de som adicionais
reg add "HKCU\Control Panel\Accessibility\SoundSentry" /v "Flags" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Accessibility\SoundSentry" /v "FSTextEffect" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Accessibility\SoundSentry" /v "TextEffect" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Accessibility\SoundSentry" /v "WindowsEffect" /t REG_SZ /d "0" /f


:: 4. Desativar recursos de acessibilidade que consomem CPU
echo -- Desativando recursos de acessibilidade
reg add "HKCU\Control Panel\Accessibility\StickyKeys" /v "Flags" /t REG_SZ /d "2" /f
reg add "HKCU\Control Panel\Accessibility\ToggleKeys" /v "Flags" /t REG_SZ /d "34" /f


:: 5. Desativar atualizacoes de idioma automatico para reduzir uso de rede
echo -- Desativando atualizacoes de idioma automatico
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AlwaysUseAutoLangDetection" /t REG_DWORD /d 0 /f


:: 6. Desativar inicializacao de apps UWP em segundo plano
echo -- Desativando inicializacao de apps UWP
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Dsh" /v "IsPrelaunchEnabled" /t REG_DWORD /d 0 /f

echo Desativando a Assistencia Remota...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Remote Assistance" /v "fAllowToGetHelp" /t REG_DWORD /d 0 /f >nul 2>&1


echo Desativando todas as funcionalidades de assistencia remota e acesso remoto...

:: 1. Desativar Assistencia Remota (opcao principal)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Remote Assistance" /v "fAllowToGetHelp" /t REG_DWORD /d 0 /f >nul 2>&1


:: 2. Desativar convites de Assistencia Remota (solicitacoes)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Remote Assistance" /v "fAllowFullControl" /t REG_DWORD /d 0 /f >nul 2>&1

:: 3. Desativar Remote Desktop (Area de Trabalho Remota)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v "fDenyTSConnections" /t REG_DWORD /d 1 /f >nul 2>&1


:: 4. Desativar acesso remoto via politica de grupo
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v "fDenyTSConnections" /t REG_DWORD /d 1 /f >nul 2>&1


:: 5. Desativar solicitacao de credenciais para Remote Desktop
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v "PromptForCredentials" /t REG_DWORD /d 0 /f >nul 2>&1


:: 6. Desativar sessao remota via firewall (bloqueia regras relacionadas)
echo Configurando firewall para bloquear assistencia remota...
netsh advfirewall firewall set rule group="Remote Assistance" new enable=no >nul 2>&1


:: 7. Desativar servico de Terminal Services (Remote Desktop)
echo Parando e desativando o servico de Terminal Services...
sc stop TermService >nul 2>&1
sc config TermService start=disabled >nul 2>&1

:: 2. Desativar logs de eventos via Registro (Application)
reg add "HKLM\SYSTEM\CurrentControlSet\Services\EventLog\Application" /v "Enabled" /t REG_DWORD /d 0 /f >nul 2>&1


:: 3. Desativar logs de eventos via Registro (System)
reg add "HKLM\SYSTEM\CurrentControlSet\Services\EventLog\System" /v "Enabled" /t REG_DWORD /d 0 /f >nul 2>&1


:: 4. Desativar logs de eventos via Registro (Security)
reg add "HKLM\SYSTEM\CurrentControlSet\Services\EventLog\Security" /v "Enabled" /t REG_DWORD /d 0 /f >nul 2>&1


echo Desativando o Thumbnail Cache para melhorar desempenho de SSD/HD...

:: Desativar o cache de miniaturas no Windows Explorer
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "DisableThumbnailCache" /t REG_DWORD /d 1 /f >nul 2>&1

echo Ativando Don't Limit NTFS Memory Usage...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v "NtfsMemoryUsage" /t REG_DWORD /d 2 /f >nul 2>&1

echo Desativando o File Data Stamping para melhorar a velocidade do SSD...

:: Desativar a atualizacao de ultimo acesso no NTFS
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v "NtfsDisableLastAccessUpdate" /t REG_DWORD /d 1 /f >nul 2>&1

echo Desativando o Program Compatibility Assistant para melhorar a velocidade do SSD...

:: Desativar o Assistente de Compatibilidade de Programas via Registro
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppCompat" /v "DisablePCA" /t REG_DWORD /d 1 /f >nul 2>&1

:: Desativa serviços de telemetria (reduz processos em segundo plano)
REG add "HKLM\SYSTEM\CurrentControlSet\Services\DiagTrack" /v "Start" /t REG_DWORD /d 4 /f
REG add "HKLM\SYSTEM\CurrentControlSet\Services\dmwappushservice" /v "Start" /t REG_DWORD /d 4 /f

:: Desativa Windows Search (indexação, se não usa busca frequentemente)
REG add "HKLM\SYSTEM\CurrentControlSet\Services\WSearch" /v "Start" /t REG_DWORD /d 4 /f

:: Desativa atualizações automáticas do Windows Update (libera recursos, mas exige atualização manual)
REG add "HKLM\SYSTEM\CurrentControlSet\Services\wuauserv" /v "Start" /t REG_DWORD /d 4 /f
REG add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" /v "NoAutoUpdate" /t REG_DWORD /d 1 /f

:: Desativa BITS (Background Intelligent Transfer Service, usado para downloads em segundo plano)
REG add "HKLM\SYSTEM\CurrentControlSet\Services\BITS" /v "Start" /t REG_DWORD /d 4 /f

:: Desativa Superfetch e SysMain (se ainda estiver ativo)
REG add "HKLM\SYSTEM\CurrentControlSet\Services\SysMain" /v "Start" /t REG_DWORD /d 4 /f

:: Aumenta limite de Svchost para 16 MB (otimização extrema)
REG add "HKLM\SYSTEM\CurrentControlSet\Control" /v "SvcHostSplitThresholdInKB" /t REG_DWORD /d 16777216 /f	

:: Desativa o Nagle’s Algorithm (melhora latência de rede para jogos online)
REG add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v "TcpNoDelay" /t REG_DWORD /d 1 /f

:: Desativa limite de banda reservada para QoS (libera largura de banda)
REG add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Psched" /v "NonBestEffortLimit" /t REG_DWORD /d 0 /f

:: Desativa o Windows Defender Real-Time Protection (se usar outro antivírus)
REG add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /v "DisableRealtimeMonitoring" /t REG_DWORD /d 1 /f

:: Desativa dicas e notificações do Windows (menos processos de UI)
REG add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "EnableBalloonTips" /t REG_DWORD /d 0 /f
REG add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SubscribedContent-338389Enabled" /t REG_DWORD /d 0 /f

:: Força o uso de memória física antes do arquivo de paginação
REG add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "DisablePagingCombine" /t REG_DWORD /d 1 /f

:: Adicionar as chaves de registro diretamente
reg add "HKEY_CURRENT_USER\Control Panel\Desktop" /v LogPixels /t REG_DWORD /d 108 /f
reg add "HKEY_CURRENT_USER\Control Panel\Desktop" /v Win8DpiScaling /t REG_DWORD /d 1 /f
reg add "HKEY_CURRENT_USER\Control Panel\Desktop" /v EnablePerProcessSystemDPI /t REG_DWORD /d 0 /f

:: Desativar Assistencia Remota (desmarca a caixa em Configuracoes Avancadas do Sistema)
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Remote Assistance" /v fAllowToGetHelp /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Remote Assistance" /v fAllowFullControl /t REG_DWORD /d 0 /f >nul 2>&1

:: Desativar Remote Desktop (Area de Trabalho Remota)
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fAllowToGetHelp /t REG_DWORD /d 0 /f >nul 2>&1

:: Desativar o serviço de Remote Desktop Services (TermService)
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\TermService" /v Start /t REG_DWORD /d 4 /f >nul 2>&1

:: Desativar o serviço de Remote Desktop Services UserMode Port Redirector (UmRdpService)
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\UmRdpService" /v Start /t REG_DWORD /d 4 /f >nul 2>&1

:: Desativar o serviço de Remote Assistance (se disponível)
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\RAServer" /v Start /t REG_DWORD /d 4 /f >nul 2>&1

:: Desativar regras de firewall relacionadas ao Remote Desktop
netsh advfirewall firewall set rule group="Remote Desktop" new enable=no >nul 2>&1

:: Desativar regras de firewall relacionadas a Assistencia Remota
netsh advfirewall firewall set rule group="Remote Assistance" new enable=no >nul 2>&1

:: REM Impedir conexoes remotas via RPC (Remote Procedure Call)
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows NT\Rpc" /v RestrictRemoteClients /t REG_DWORD /d 1 /f >nul 2>&1

:: REM Desativar o protocolo Remote Desktop Protocol (RDP) no nivel de rede
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v fEnableWinStation /t REG_DWORD /d 0 /f >nul 2>&1

::REM Desativar o Remote Registry Service (Registro Remoto)
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\RemoteRegistry" /v Start /t REG_DWORD /d 4 /f >nul 2>&1

:: Desativar o serviço de Remote Management (WinRM - Windows Remote Management)
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WinRM" /v Start /t REG_DWORD /d 4 /f >nul 2>&1
sc config WinRM start= disabled >nul 2>&1

:: Desativar o compartilhamento remoto de areas de trabalho (Remote Desktop Sharing)
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 0 /f >nul 2>&1

:: Desativa a Otimização de Entrega via Registro
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\DeliveryOptimization" /v DODownloadMode /t REG_DWORD /d 0 /f

:: Para garantir a aplicação, reinicia o serviço de entrega (opcional)
net stop DoSvc /y

:: Ajusta o Session Manager I/O Boost (melhora carregamento de jogos)
echo -- Aumentando I/O Boost
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\I/O System" /v "IoPriorityBoost" /t REG_DWORD /d 1 /f

:: Habilita o Direct Storage Boost (melhora carregamento em SSDs NVMe)
echo -- Habilitando Direct Storage Boost
reg add "HKLM\SOFTWARE\Microsoft\DirectStorage" /v "BoostPriority" /t REG_DWORD /d 1 /f

:: Desativa o Kernel Idle State Logging (menos overhead em CPUs modernas)
echo -- Desativando Idle State Logging
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "IdleStateLogging" /t REG_DWORD /d 0 /f

:: Otimiza o NDIS para redes mais rápidas (jogos online)
echo -- Otimizando NDIS
reg add "HKLM\SYSTEM\CurrentControlSet\Services\NDIS\Parameters" /v "MaxNumRssCpus" /t REG_DWORD /d 8 /f

:: Desativa o Windows Kernel Logging (menos escrita em disco)
echo -- Desativando Kernel Logging
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Debug Print Filter" /v "DEFAULT" /t REG_DWORD /d 0 /f

:: Ajusta o Thread Quantum para jogos (menor latência)
echo -- Otimizando Thread Quantum
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "ThreadQuantum" /t REG_DWORD /d 6 /f

:: Desativa o Kernel Executive Resource Locks (menos contenção em multithread)
echo -- Reduzindo Resource Locks
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" /v "ResourceTimeoutCount" /t REG_DWORD /d 0 /f

:: Desativa o Kernel Object Reference Tracking (menos overhead)
echo -- Desativando Object Reference Tracking
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "ObjectReferenceTracking" /t REG_DWORD /d 0 /f

:: Desativa o Kernel Paged Pool Quota (menos restrições em RAM alta)
echo -- Desativando Paged Pool Quota
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "PagedPoolQuota" /t REG_DWORD /d 0 /f

:: Desativa o Kernel DPC Latency (reduz latência de interrupções)
echo -- Reduzindo Latência DPC
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "DpcTimeout" /t REG_DWORD /d 30 /f

:: Ajusta o tamanho do Lookaside List (melhora alocação de memória pequena)
echo -- Otimizando Lookaside List
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "LookasideListIncrease" /t REG_DWORD /d 1 /f

:: Desativa o Kernel Paged Pool Quota (menos restrições em RAM alta)
echo -- Desativando Paged Pool Quota
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "PagedPoolQuota" /t REG_DWORD /d 0 /f

:: Desativa o Kernel Security Check Failure Logging (menos processos)
echo -- Desativando Security Check Logging
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "SecurityCheckFailureLogging" /t REG_DWORD /d 0 /f












echo %w% - Disabling Setting Synchronization%b%
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\SettingSync\Groups\Accessibility" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\SettingSync\Groups\AppSync" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\SettingSync\Groups\BrowserSettings" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\SettingSync\Groups\Credentials" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\SettingSync\Groups\DesktopTheme" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\SettingSync\Groups\Language" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\SettingSync\Groups\PackageState" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\SettingSync\Groups\Personalization" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\SettingSync\Groups\StartLayout" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\SettingSync\Groups\Windows" /v "Enabled" /t REG_DWORD /d "0" /f 

echo %w% - Disabling Windows Error Reporting%b%
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting" /v "DoReport" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting" /v "LoggingDisabled" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\PCHealth\ErrorReporting" /v "DoReport" /t REG_DWORD /d "0" /f 


echo %w% - Disable GameDVR%b%
Reg.exe add "HKCU\Software\Microsoft\GameBar" /v "UseNexusForGameBarEnabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\Software\Microsoft\GameBar" /v "GameDVR_Enabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\Software\Microsoft\Windows\CurrentVersion\GameDVR" /v "AppCaptureEnabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\Software\Microsoft\Windows\CurrentVersion\GameDVR" /v "AudioCaptureEnabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\Software\Microsoft\Windows\CurrentVersion\GameDVR" /v "CursorCaptureEnabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\Software\Microsoft\Windows\CurrentVersion\GameDVR" /v "HistoricalCaptureEnabled" /t REG_DWORD /d "0" /f


echo %w% - Disable Notifications%b%
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\PushNotifications" /v "ToastEnabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings" /v "NOC_GLOBAL_SETTING_ALLOW_NOTIFICATION_SOUND" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings" /v "NOC_GLOBAL_SETTING_ALLOW_CRITICAL_TOASTS_ABOVE_LOCK" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings\QuietHours" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings\windows.immersivecontrolpanel_cw5n1h2txyewy!microsoft.windows.immersivecontrolpanel" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings\Windows.SystemToast.AutoPlay" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings\Windows.SystemToast.LowDisk" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings\Windows.SystemToast.Print.Notification" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings\Windows.SystemToast.SecurityAndMaintenance" /v "Enabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings\Windows.SystemToast.WiFiNetworkManager" /v "Enabled" /t REG_DWORD /d "0" /f 


echo %w% - Disable Xbox Services%b%
sc config xbgm start= disabled >nul 2>&1
sc config XblAuthManager start= disabled
sc config XblGameSave start= disabled
sc config XboxGipSvc start= disabled
sc config XboxNetApiSvc start= disabled
echo %w% - Disabling Cortana%b%
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowCortana" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowCloudSearch" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowCortanaAboveLock" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowSearchToUseLocation" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "ConnectedSearchUseWeb" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "ConnectedSearchUseWebOverMeteredConnections" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "DisableWebSearch" /t REG_DWORD /d "0" /f 

echo %w% - Disable Customer Experience Improvement Program%b%
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\Consolidator" > nul 2>&1
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\Consolidator" /disable > nul 2>&1
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\BthSQM" > nul 2>&1 
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\BthSQM" /disable > nul 2>&1
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\KernelCeipTask" > nul 2>&1
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\KernelCeipTask" /disable > nul 2>&1
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip" > nul 2>&1 
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip" /disable > nul 2>&1
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\Uploader" > nul 2>&1
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\Uploader" /disable > nul 2>&1
schtasks /end /tn "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser" > nul 2>&1
schtasks /change /tn "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser" /disable > nul 2>&1
schtasks /end /tn "\Microsoft\Windows\Application Experience\ProgramDataUpdater" > nul 2>&1
schtasks /change /tn "\Microsoft\Windows\Application Experience\ProgramDataUpdater" /disable > nul 2>&1
schtasks /end /tn "\Microsoft\Windows\Application Experience\StartupAppTask" > nul 2>&1
schtasks /end /tn "\Microsoft\Windows\Shell\FamilySafetyMonitor" > nul 2>&1
schtasks /change /tn "\Microsoft\Windows\Shell\FamilySafetyMonitor" /disable > nul 2>&1
schtasks /end /tn "\Microsoft\Windows\Shell\FamilySafetyRefresh" > nul 2>&1
schtasks /change /tn "\Microsoft\Windows\Shell\FamilySafetyRefresh" /disable > nul 2>&1
schtasks /end /tn "\Microsoft\Windows\Shell\FamilySafetyUpload" > nul 2>&1
schtasks /change /tn "\Microsoft\Windows\Shell\FamilySafetyUpload" /disable > nul 2>&1
schtasks /end /tn "\Microsoft\Windows\Maintenance\WinSAT" > nul 2>&1

echo %w% - Disabling Automatic Maintenance%b%
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Schedule\Maintenance" /v "MaintenanceDisabled" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disable Activity feed%b%
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft" /v "AllowNewsAndInterests" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "EnableActivityFeed" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\Control Panel\International\User Profile" /v "HttpAcceptLanguageOptOut" /t REG_DWORD /d "1" /f
Reg.exe add "HKCU\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo" /v "Enabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows\System" /v "EnableActivityFeed" /t REG_DWORD /d "0" /f
timeout /t 1 /nobreak > NUL

echo %w% - Disable Popups, baloon tips etc%b%
Reg.exe add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "DisallowShaking" /t REG_DWORD /d "1" /f
Reg.exe add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "EnableBalloonTips" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "ShowSyncProviderNotifications" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\userNotificationListener" /v "Value" /t REG_SZ /d "Deny" /f
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows\AdvertisingInfo" /v "DisabledByGroupPolicy" /t REG_DWORD /d "1" /f
timeout /t 1 /nobreak > NUL


echo %w% - Enabling GameMode%b%
Reg.exe add "HKCU\SOFTWARE\Microsoft\GameBar" /v "AllowAutoGameMode" /t REG_DWORD /d "1" /f 
Reg.exe add "HKCU\SOFTWARE\Microsoft\GameBar" /v "AutoGameModeEnabled" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Windows Insider Experiments%b%
Reg.exe add "HKLM\SOFTWARE\Microsoft\PolicyManager\current\device\System" /v "AllowExperimentation" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SOFTWARE\Microsoft\PolicyManager\default\System\AllowExperimentation" /v "value" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Telemetry Services%b%
sc stop DiagTrack 
sc config DiagTrack start= disabled 
sc stop dmwappushservice 
sc config dmwappushservice start= disabled 
sc stop diagnosticshub.standardcollector.service 
sc config diagnosticshub.standardcollector.service start= disabled 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Telemetry Through Task Scheduler%b%
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\Consolidator" 
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\Consolidator" /disable 
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\BthSQM" 
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\BthSQM" /disable 
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\KernelCeipTask" 
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\KernelCeipTask" /disable 
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip" 
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip" /disable 
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\Uploader" 
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\Uploader" /disable 
schtasks /end /tn "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser" 
schtasks /change /tn "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser" /disable 
schtasks /end /tn "\Microsoft\Windows\Application Experience\ProgramDataUpdater" 
schtasks /change /tn "\Microsoft\Windows\Application Experience\ProgramDataUpdater" /disable 
schtasks /end /tn "\Microsoft\Windows\Application Experience\StartupAppTask" 
schtasks /change /tn "\Microsoft\Windows\Application Experience\StartupAppTask" /disable 
schtasks /end /tn "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector" 
schtasks /change /tn "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector" /disable 
schtasks /end /tn "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticResolver" 
schtasks /change /tn "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticResolver" /disable 
schtasks /end /tn "\Microsoft\Windows\Power Efficiency Diagnostics\AnalyzeSystem" 
schtasks /change /tn "\Microsoft\Windows\Power Efficiency Diagnostics\AnalyzeSystem" /disable 
schtasks /end /tn "\Microsoft\Windows\Shell\FamilySafetyMonitor" 
schtasks /change /tn "\Microsoft\Windows\Shell\FamilySafetyMonitor" /disable 
schtasks /end /tn "\Microsoft\Windows\Shell\FamilySafetyRefresh" 
schtasks /change /tn "\Microsoft\Windows\Shell\FamilySafetyRefresh" /disable 
schtasks /end /tn "\Microsoft\Windows\Shell\FamilySafetyUpload" 
schtasks /change /tn "\Microsoft\Windows\Shell\FamilySafetyUpload" /disable 
schtasks /end /tn "\Microsoft\Windows\Autochk\Proxy" 
schtasks /change /tn "\Microsoft\Windows\Autochk\Proxy" /disable 
schtasks /end /tn "\Microsoft\Windows\Maintenance\WinSAT" 
schtasks /change /tn "\Microsoft\Windows\Maintenance\WinSAT" /disable 
schtasks /end /tn "\Microsoft\Windows\Application Experience\AitAgent" 
schtasks /change /tn "\Microsoft\Windows\Application Experience\AitAgent" /disable 
schtasks /end /tn "\Microsoft\Windows\Windows Error Reporting\QueueReporting" 
schtasks /change /tn "\Microsoft\Windows\Windows Error Reporting\QueueReporting" /disable 
schtasks /end /tn "\Microsoft\Windows\CloudExperienceHost\CreateObjectTask" 
schtasks /change /tn "\Microsoft\Windows\CloudExperienceHost\CreateObjectTask" /disable 
schtasks /end /tn "\Microsoft\Windows\DiskFootprint\Diagnostics" 
schtasks /change /tn "\Microsoft\Windows\DiskFootprint\Diagnostics" /disable 
schtasks /end /tn "\Microsoft\Windows\PI\Sqm-Tasks" 
schtasks /change /tn "\Microsoft\Windows\PI\Sqm-Tasks" /disable 
schtasks /end /tn "\Microsoft\Windows\NetTrace\GatherNetworkInfo" 
schtasks /change /tn "\Microsoft\Windows\NetTrace\GatherNetworkInfo" /disable 
schtasks /end /tn "\Microsoft\Windows\AppID\SmartScreenSpecific" 
schtasks /change /tn "\Microsoft\Windows\AppID\SmartScreenSpecific" /disable 
schtasks /end /tn "\Microsoft\Office\OfficeTelemetryAgentFallBack2016" 
schtasks /change /tn "\Microsoft\Office\OfficeTelemetryAgentFallBack2016" /disable 
schtasks /end /tn "\Microsoft\Office\OfficeTelemetryAgentLogOn2016" 
schtasks /change /tn "\Microsoft\Office\OfficeTelemetryAgentLogOn2016" /disable 
schtasks /end /tn "\Microsoft\Office\OfficeTelemetryAgentLogOn" 
schtasks /change /TN "\Microsoft\Office\OfficeTelemetryAgentLogOn" /disable 
schtasks /end /tn "\Microsoftd\Office\OfficeTelemetryAgentFallBack" 
schtasks /change /TN "\Microsoftd\Office\OfficeTelemetryAgentFallBack" /disable 
schtasks /end /tn "\Microsoft\Office\Office 15 Subscription Heartbeat" 
schtasks /change /TN "\Microsoft\Office\Office 15 Subscription Heartbeat" /disable 
schtasks /end /tn "\Microsoft\Windows\Time Synchronization\ForceSynchronizeTime" 
schtasks /change /TN "\Microsoft\Windows\Time Synchronization\ForceSynchronizeTime" /disable 
schtasks /end /tn "\Microsoft\Windows\Time Synchronization\SynchronizeTime" 
schtasks /change /TN "\Microsoft\Windows\Time Synchronization\SynchronizeTime" /disable 
schtasks /end /tn "\Microsoft\Windows\WindowsUpdate\Automatic App Update" 
schtasks /change /TN "\Microsoft\Windows\WindowsUpdate\Automatic App Update" /disable 
schtasks /end /tn "\Microsoft\Windows\Device Information\Device" 
schtasks /change /TN "\Microsoft\Windows\Device Information\Device" /disable 
timeout /t 1 /nobreak > NUL

echo %w% - Removing Unnecessary Powershell Packages %b%
PowerShell -Command "Get-AppxPackage -allusers *3DBuilder* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *bing* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *bingfinance* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *bingsports* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *BingWeather* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *CommsPhone* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *Drawboard PDF* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *Facebook* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *Getstarted* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *Microsoft.Messaging* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *Office.OneNote* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *OneNote* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *SkypeApp* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *solit* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *Sway* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *Twitter* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *WindowsMaps* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *WindowsFeedbackHub* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *WindowsSoundRecorder* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *windowscommunicationsapps* | Remove-AppxPackage" 
PowerShell -Command "Get-AppxPackage -allusers *zune* | Remove-AppxPackage" 
timeout /t 1 /nobreak > NUL

echo %w% - Intel Gpu Tweaks%b%
for /f %%t in ('Reg query "HKLM\System\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}" /t REG_SZ /s /e /f "Intel" ^| findstr "HKEY"') do (

	Reg.exe add "%%t" /v "Disable_OverlayDSQualityEnhancement" /t REG_DWORD /d "1" /f
    Reg.exe add "%%t" /v "IncreaseFixedSegment" /t REG_DWORD /d "1" /f
    Reg.exe add "%%t" /v "AdaptiveVsyncEnable" /t REG_DWORD /d "0" /f
    Reg.exe add "%%t" /v "DisablePFonDP" /t REG_DWORD /d "1" /f
    Reg.exe add "%%t" /v "EnableCompensationForDVI" /t REG_DWORD /d "1" /f
    Reg.exe add "%%t" /v "NoFastLinkTrainingForeDP" /t REG_DWORD /d "0" /f
    Reg.exe add "%%t" /v "ACPowerPolicyVersion" /t REG_DWORD /d "16898" /f
    Reg.exe add "%%t" /v "DCPowerPolicyVersion" /t REG_DWORD /d "16642" /f
)


Reg.exe add "HKLM\Software\Intel\GMM" /v "DedicatedSegmentSize" /t REG_DWORD /d "512" /f

timeout /t 1 /nobreak > NUL

echo %w% - Disabling Hibernation%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "SleepReliabilityDetailedDiagnostics" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Sleep Study%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Power" /v "SleepStudyDisabled" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disable Dynamic Tick%b%
bcdedit /set disabledynamictick yes >nul 2>&1
timeout /t 1 /nobreak > NUL

echo %w% - Disable High Precision Event Timer (HPET)%b%
bcdedit /deletevalue useplatformclock  >nul 2>&1
timeout /t 1 /nobreak > NUL

echo %w% - Disable Synthetic Timers%b%
bcdedit /set useplatformtick yes  >nul 2>&1
timeout /t 1 /nobreak > NUL

echo %w% - NFTS Tweaks%b%
fsutil behavior set memoryusage 2 >nul 2>&1
fsutil behavior set mftzone 4 >nul 2>&1
fsutil behavior set disablelastaccess 1 >nul 2>&1
fsutil behavior set disabledeletenotify 0 >nul 2>&1
fsutil behavior set encryptpagingfile 0 >nul 2>&1
timeout /t 1 /nobreak > nul

echo %w% - Network Throttoling Index%b%
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d "4294967295" /f

echo %w% - MMCSS Priority For Low Latency%b%
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Low Latency" /v "Affinity" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Low Latency" /v "Background Only" /t REG_SZ /d "False" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Low Latency" /v "BackgroundPriority" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Low Latency" /v "Clock Rate" /t REG_DWORD /d "10000" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Low Latency" /v "GPU Priority" /t REG_DWORD /d "8" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Low Latency" /v "Priority" /t REG_DWORD /d "2" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Low Latency" /v "Scheduling Category" /t REG_SZ /d "Medium" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Low Latency" /v "SFIO Priority" /t REG_SZ /d "High" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Low Latency" /v "Latency Sensitive" /t REG_SZ /d "True" /f
timeout /t 1 /nobreak > nul

echo %w% - MMCSS Priority For Games%b%
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Affinity" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Background Only" /t REG_SZ /d "False" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "BackgroundPriority" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Clock Rate" /t REG_DWORD /d "10000" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Latency Sensitive" /t REG_SZ /d "True" /f
timeout /t 1 /nobreak > nul



echo %w% - Disabling Preemption%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "EnablePreemption" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "GPUPreemptionLevel" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "EnableAsyncMidBufferPreemption" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "EnableMidGfxPreemptionVGPU" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "EnableMidBufferPreemptionForHighTdrTimeout" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "EnableSCGMidBufferPreemption" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "PerfAnalyzeMidBufferPreemption" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "EnableMidGfxPreemption" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "EnableMidBufferPreemption" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "EnableCEPreemption" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "DisableCudaContextPreemption" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "DisablePreemptionOnS3S4" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "ComputePreemptionLevel" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "DisablePreemption" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling VirtualizationBasedSecurity%b%
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DeviceGuard" /v "EnableVirtualizationBasedSecurity" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL
echo %w% - Disabling HVCIMATRequired%b%
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DeviceGuard" /v "HVCIMATRequired" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL
echo %w% - Disabling ExceptionChainValidation%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "DisableExceptionChainValidation" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL
echo %w% - Disabling Sehop%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "KernelSEHOPEnabled" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL
echo %w% - Disabling CFG%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "EnableCfg" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL
echo %w% - Disabling Protection Mode%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager" /v "ProtectionMode" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL
echo %w% - Disabling Spectre And Meltdown%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettings" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverride" /t REG_DWORD /d "3" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverrideMask" /t REG_DWORD /d "3" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Other Mitigations%b%
chcp 437 >nul 
timeout /t 1 /nobreak > NUL
powershell "Remove-Item -Path \"HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\*\" -Recurse -ErrorAction SilentlyContinue"
timeout /t 1 /nobreak > NUL
chcp 65001 >nul  
timeout /t 1 /nobreak > NUL

echo %w% - IRQ8 Priority %b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "IRQ8Priority" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\PriorityControl" /v "IRQ8Priority" /t REG_DWORD /d "1" /f
timeout /t 1 /nobreak > NUL

echo %w% - IRQ16 Priority %b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "IRQ16Priority" /t REG_DWORD /d "2" /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\PriorityControl" /v "IRQ16Priority" /t REG_DWORD /d "2" /f
timeout /t 1 /nobreak > NUL


echo %w% - Disabling Paging Executive%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "DpiMapIommuContiguous" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Address Space Layout Randomization%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "MoveImages" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NULw


echo %w% - SVC split host%b%
for /f "skip=1" %%i in ('wmic os get TotalVisibleMemorySize') do if not defined TOTAL_MEMORY set "TOTAL_MEMORY=%%i" & set /a SVCHOST=%%i+1024000
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control" /v "SvcHostSplitThresholdInKB" /t REG_DWORD /d "!SVCHOST!" /f 
timeout /t 1 /nobreak > NUL


echo %w% - Disable Prefetch and superfetch%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v "EnablePrefetcher" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v "EnableSuperfetch" /t REG_DWORD /d "0" /f
timeout /t 1 /nobreak > NUL

echo %w% - Decrease processes kill time and menu show delay%b%
Reg.exe add "HKCU\Control Panel\Desktop" /v "LowLevelHooksTimeout" /t REG_SZ /d "1000" /f



echo %w% - Setting Time Stamp%b%
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Reliability" /v "TimeStampInterval" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Reliability" /v "IoPriority" /t REG_DWORD /d "3" /f 
timeout /t 1 /nobreak > NUL


echo %w% - Setting CSRSS to Realtime%b%
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\csrss.exe\PerfOptions" /v "CpuPriorityClass" /t REG_DWORD /d "4" /f 
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\csrss.exe\PerfOptions" /v "IoPriority" /t REG_DWORD /d "3" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Setting Latency Tolerance%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\DXGKrnl" /v "MonitorLatencyTolerance" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\DXGKrnl" /v "MonitorRefreshLatencyTolerance" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "ExitLatency" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "ExitLatencyCheckEnabled" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "Latency" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "LatencyToleranceDefault" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "LatencyToleranceFSVP" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "LatencyTolerancePerfOverride" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "LatencyToleranceScreenOffIR" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "LatencyToleranceVSyncEnabled" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "RtlCapabilityCheckLatency" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultD3TransitionLatencyActivelyUsed" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultD3TransitionLatencyIdleLongTime" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultD3TransitionLatencyIdleMonitorOff" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultD3TransitionLatencyIdleNoContext" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultD3TransitionLatencyIdleShortTime" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultD3TransitionLatencyIdleVeryLongTime" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultLatencyToleranceIdle0" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultLatencyToleranceIdle0MonitorOff" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultLatencyToleranceIdle1" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultLatencyToleranceIdle1MonitorOff" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultLatencyToleranceMemory" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultLatencyToleranceNoContext" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultLatencyToleranceNoContextMonitorOff" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultLatencyToleranceOther" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultLatencyToleranceTimerPeriod" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultMemoryRefreshLatencyToleranceActivelyUsed" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultMemoryRefreshLatencyToleranceMonitorOff" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "DefaultMemoryRefreshLatencyToleranceNoContext" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "Latency" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "MaxIAverageGraphicsLatencyInOneBucket" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "MiracastPerfTrackGraphicsLatency" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "MonitorLatencyTolerance" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "MonitorRefreshLatencyTolerance" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "TransitionLatency" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\mouclass\Parameters" /v "MouseDataQueueSize" /t REG_DWORD /d "32" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\kbdclass\Parameters" /v "KeyboardDataQueueSize" /t REG_DWORD /d "32" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\mouclass\Parameters" /v "MouseDataQueueSize" /t REG_DWORD /d "23" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\kbdclass\Parameters" /v "KeyboardDataQueueSize" /t REG_DWORD /d "23" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\mouclass\Parameters" /v "MouseDataQueueSize" /t REG_DWORD /d "20" /f


echo %w% - Disabling Filter Keys (the filterkeys app is completely useless, dont use it)%b%
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Flags" /t REG_SZ /d "122" /f
timeout /t 1 /nobreak > NUL
echo %w% - Disabling Toggle Keys%b%
Reg.exe add "HKCU\Control Panel\Accessibility\ToggleKeys" /v "Flags" /t REG_SZ /d "58" /f
timeout /t 1 /nobreak > NUL
echo %w% - Disabling Sticky Keys%b%
Reg.exe add "HKCU\Control Panel\Accessibility\StickyKeys" /v "Flags" /t REG_SZ /d "506" /f
timeout /t 1 /nobreak > NUL
echo %w% - Disabling Mouse Keys%b%
Reg.exe add "HKCU\Control Panel\Accessibility\MouseKeys" /v "Flags" /t REG_SZ /d "0" /f

echo %w% - Reducing Keyboard Repeat Delay%b%
Reg.exe add "HKCU\Control Panel\Keyboard" /v "KeyboardDelay" /t REG_SZ /d "0" /f
timeout /t 1 /nobreak > NUL

echo %w% - Increasing Keyboard Repeat Rate%b%
Reg.exe add "HKCU\Control Panel\Keyboard" /v "KeyboardSpeed" /t REG_SZ /d "31" /f
timeout /t 1 /nobreak > NUL

echo %w% - Setting CSRSS to Realtime%b%
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\csrss.exe\PerfOptions" /v "CpuPriorityClass" /t REG_DWORD /d "4" /f 
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\csrss.exe\PerfOptions" /v "IoPriority" /t REG_DWORD /d "3" /f 
timeout /t 1 /nobreak > NUL 

echo %w% - Disabling USB PowerSavings%b%
for /f %%i in ('wmic path Win32_USBController get PNPDeviceID^| findstr /l "PCI\VEN_"') do (
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Enum\%%i\Device Parameters" /v "AllowIdleIrpInD3" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Enum\%%i\Device Parameters" /v "D3ColdSupported" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Enum\%%i\Device Parameters" /v "DeviceSelectiveSuspended" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Enum\%%i\Device Parameters" /v "EnableSelectiveSuspend" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Enum\%%i\Device Parameters" /v "EnhancedPowerManagementEnabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Enum\%%i\Device Parameters" /v "SelectiveSuspendEnabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Enum\%%i\Device Parameters" /v "SelectiveSuspendOn" /t REG_DWORD /d "0" /f 
)
timeout /t 1 /nobreak > NUL

echo %w% - Thread Priority%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\usbxhci\Parameters" /v "ThreadPriority" /t REG_DWORD /d "31" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\USBHUB3\Parameters" /v "ThreadPriority" /t REG_DWORD /d "31" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm\Parameters" /v "ThreadPriority" /t REG_DWORD /d "31" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\NDIS\Parameters" /v "ThreadPriority" /t REG_DWORD /d "31" /f
timeout /t 1 /nobreak > NUL

echo %w% - Disabling USB Selective Suspend%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\USB" /v "DisableSelectiveSuspend" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Enabing MSI mode on usb%b%
for /f %%i in ('wmic path Win32_USBController get PNPDeviceID') do set "str=%%i" & (
echo.DEL USB Device Priority %b%
Reg.exe add "HKLM\System\CurrentControlSet\Enum\%%i\Device Parameters\Interrupt Management\Affinity Policy" /v "DevicePriority" /f
echo.Enable MSI Mode on USB %b%
Reg.exe add "HKLM\System\CurrentControlSet\Enum\%%i\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties" /v "MSISupported" /t REG_DWORD /d "1" /f
)

echo %w% - USB Msi Priority%b%
for /f %%i in ('wmic path Win32_IDEController get PNPDeviceID 2^>nul') do set "str=%%i" & if "!str:PCI\VEN_=!" neq "!str!" (
echo %w%- DEL Sata controllers Device Priority %b%
Reg.exe add "HKLM\System\CurrentControlSet\Enum\%%i\Device Parameters\Interrupt Management\Affinity Policy" /v "DevicePriority" /f
)


echo %w% -  Enabling MSI Mode %b%
for /f %%g in ('wmic path win32_videocontroller get PNPDeviceID ^| findstr /L "VEN_"') do (
reg add "HKLM\SYSTEM\CurrentControlSet\Enum\%%g\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties" /v "MSISupported" /t REG_DWORD /d "1" /f  
reg add "HKLM\SYSTEM\CurrentControlSet\Enum\%%g\Device Parameters\Interrupt Management\Affinity Policy" /v "DevicePriority" /t REG_DWORD /d "0" /f 
)
timeout /t 1 /nobreak > NUL


echo %w% - Disabling Display Refresh Rate Override%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "3D_Refresh_Rate_Override_DEF" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL


echo %w% - Disabling SnapShot%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "AllowSnapshot" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Anti Aliasing%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "AAF_NA" /t REG_DWORD /d "0" /f 
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "AntiAlias_NA" /t REG_SZ /d "0" /f 
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "ASTT_NA" /t REG_SZ /d "0" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Subscriptions%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "AllowSubscription" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Anisotropic Filtering%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "AreaAniso_NA" /t REG_SZ /d "0" /f 
timeout /t 1 /nobreak > NUL


echo %w% - Disabling Radeon Overlay%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "AllowRSOverlay" /t REG_SZ /d "false" /f  
timeout /t 1 /nobreak > NUL

echo Enabling Adaptive DeInterlacing%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "Adaptive De-interlacing" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL


echo %w% - Disabling Skins%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "AllowSkins" /t REG_SZ /d "false" /f  
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Automatic Color Depth Reduction%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "AutoColorDepthReduction_NA" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL


echo %w% - Disabling Power Gating%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "DisableSAMUPowerGating" /t REG_DWORD /d "1" /f 
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "DisableUVDPowerGatingDynamic" /t REG_DWORD /d "1" /f 
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "DisableVCEPowerGating" /t REG_DWORD /d "1" /f 
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "DisablePowerGating" /t REG_DWORD /d "1" /f 
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "DisableDrmdmaPowerGating" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL


echo %w% - Disabling Clock Gating%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "EnableVceSwClockGating" /t REG_DWORD /d "1" /f 
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "EnableUvdClockGating" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Active State Power Management%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "EnableAspmL0s" /t REG_DWORD /d "0" /f 
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "EnableAspmL1" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL


echo %w% - Disabling Ultra Low Power States%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "EnableUlps" /t REG_DWORD /d "0" /f 
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "EnableUlps_NA" /t REG_SZ /d "0" /f 
timeout /t 1 /nobreak > NUL


echo %w% - Enabling De-Lag%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "KMD_DeLagEnabled" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Frame Rate Target%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "KMD_FRTEnabled" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling DMA%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "DisableDMACopy" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Enable BlockWrite%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "DisableBlockWrite" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Stutter Mode%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "StutterMode" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling GPU Memory Clock Sleep State%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "PP_SclkDeepSleepDisable" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Thermal Throttling%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "PP_ThermalAutoThrottlingEnable" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Preemption%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "KMD_EnableComputePreemption" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Setting Main3D%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000\UMD" /v "Main3D_DEF" /t REG_SZ /d "1" /f 
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000\UMD" /v "Main3D" /t REG_BINARY /d "3100" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Setting FlipQueueSize%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000\UMD" /v "FlipQueueSize" /t REG_BINARY /d "3100" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Setting Shader Cache Size%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000\UMD" /v "ShaderCache" /t REG_BINARY /d "3200" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Configuring TFQ%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000\UMD" /v "TFQ" /t REG_BINARY /d "3200" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling High-Bandwidth Digital Content Protection%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000\\DAL2_DATA__2_0\DisplayPath_4\EDID_D109_78E9\Option" /v "ProtectionControl" /t REG_BINARY /d "0100000001000000" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling GPU Power Down%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "PP_GPUPowerDownEnabled" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling AMD Logging%b%
reg add "HKLM\SYSTEM\CurrentControlSet\Services\amdlog" /v "Start" /t REG_DWORD /d "4" /f 
timeout /t 1 /nobreak > NUL



Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Enum\%%g\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties" /v "MSISupported" /t REG_DWORD /d "1" /f  
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Enum\%%g\Device Parameters\Interrupt Management\Affinity Policy" /v "DevicePriority" /t REG_DWORD /d "0" /f
timeout /t 1 /nobreak > NUL

echo %w% - Setting NVIDIA Latency Tolerance%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "D3PCLatency" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "F1TransitionLatency" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "LOWLATENCY" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "Node3DLowLatency" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "PciLatencyTimerControl" /t REG_DWORD /d "20" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "RMDeepL1EntryLatencyUsec" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "RmGspcMaxFtuS" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "RmGspcMinFtuS" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "RmGspcPerioduS" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "RMLpwrEiIdleThresholdUs" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "RMLpwrGrIdleThresholdUs" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "RMLpwrGrRgIdleThresholdUs" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "RMLpwrMsIdleThresholdUs" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "VRDirectFlipDPCDelayUs" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "VRDirectFlipTimingMarginUs" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "VRDirectJITFlipMsHybridFlipDelayUs" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "vrrCursorMarginUs" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "vrrDeflickerMarginUs" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v "vrrDeflickerMaxUs" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling NVIDIA Telemetry%b%
reg delete "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" /v "NvBackend" /f 
Reg.exe add "HKLM\SOFTWARE\NVIDIA Corporation\Global\FTS" /v "EnableRID66610" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SOFTWARE\NVIDIA Corporation\Global\FTS" /v "EnableRID64640" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SOFTWARE\NVIDIA Corporation\Global\FTS" /v "EnableRID44231" /t REG_DWORD /d "0" /f 
schtasks /change /disable /tn "NvTmRep_CrashReport1_{B2FE1952-0186-46C3-BAEC-A80AA35AC5B8}" 
schtasks /change /disable /tn "NvTmRep_CrashReport2_{B2FE1952-0186-46C3-BAEC-A80AA35AC5B8}" 
schtasks /change /disable /tn "NvTmRep_CrashReport3_{B2FE1952-0186-46C3-BAEC-A80AA35AC5B8}" 
schtasks /change /disable /tn "NvTmRep_CrashReport4_{B2FE1952-0186-46C3-BAEC-A80AA35AC5B8}" 
schtasks /change /disable /tn "NvDriverUpdateCheckDaily_{B2FE1952-0186-46C3-BAEC-A80AA35AC5B8}" 
schtasks /change /disable /tn "NVIDIA GeForce Experience SelfUpdate_{B2FE1952-0186-46C3-BAEC-A80AA35AC5B8}" 
schtasks /change /disable /tn "NvTmMon_{B2FE1952-0186-46C3-BAEC-A80AA35AC5B8}" 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Write Combining%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm" /v "DisableWriteCombining" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Preemption%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm" /v "DisablePreemption" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm" /v "DisableCudaContextPreemption" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm" /v "EnableCEPreemption" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm" /v "DisablePreemptionOnS3S4" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm" /v "ComputePreemption" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL

echo %w% - SVC split host%b%
for /f "skip=1" %%i in ('wmic os get TotalVisibleMemorySize') do if not defined TOTAL_MEMORY set "TOTAL_MEMORY=%%i" & set /a SVCHOST=%%i+1024000
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control" /v "SvcHostSplitThresholdInKB" /t REG_DWORD /d "!SVCHOST!" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Prefetch and superfetch%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v "EnablePrefetcher" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v "EnableSuperfetch" /t REG_DWORD /d "0" /f
timeout /t 1 /nobreak > NUL


echo %w% - More Memory Managment Tweaks%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "ClearPageFileAtShutdown" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "LargeSystemCache" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "NonPagedPoolQuota" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "NonPagedPoolSize" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "PagedPoolQuota" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "PagedPoolSize" /t REG_DWORD /d "192" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "SecondLevelDataCache" /t REG_DWORD /d "1024" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "SessionPoolSize" /t REG_DWORD /d "192" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "SessionViewSize" /t REG_DWORD /d "192" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "SystemPages" /t REG_DWORD /d "4294967295" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "PhysicalAddressExtension" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettings" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverride" /t REG_DWORD /d "3" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverrideMask" /t REG_DWORD /d "3" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "IoPageLockLimit" /t REG_DWORD /d "16710656" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "PoolUsageMaximum" /t REG_DWORD /d "96" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "Start" /t REG_DWORD /d "4" /f

echo %w%- Disable Idle Power Managment %b%
for /f "tokens=*" %%i in ('reg query "HKLM\SYSTEM\CurrentControlSet\Enum" /s /f "StorPort"^| findstr "StorPort"') do Reg.exe add "%%i" /v "EnableIdlePowerManagement" /t REG_DWORD /d "0" /f
    for %%i in (EnableHIPM EnableDIPM EnableHDDParking) do for /f %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Services" /s /f "%%i" ^| findstr "HKEY"') do Reg.exe add "%%a" /v "%%i" /t REG_DWORD /d "0" /f 
    )

echo %w%- Disable Link State Power Managment %b%
FOR /F "eol=E" %%a in ('REG QUERY "HKLM\System\CurrentControlSet\Services" /s "EnableHIPM"^| FINDSTR /V "EnableHIPM"') DO (
Reg.exe add "%%a" /v "EnableHIPM" /t REG_DWORD /d "0" /f  > nul 
Reg.exe add "%%a" /v "EnableDIPM" /t REG_DWORD /d "0" /f > nul 
FOR /F "tokens=*" %%z IN ("%%a") DO (
SET STR=%%z
SET STR=!STR:HKLM\System\CurrentControlSet\Services\=!
) > nul 
)
	
	
echo %w% - Disabling GPU Energy Driver%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\GpuEnergyDrv" /v "Start" /t REG_DWORD /d "4" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\GpuEnergyDr" /v "Start" /t REG_DWORD /d "4" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Energy Logging%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power\EnergyEstimation\TaggedEnergy" /v "DisableTaggedEnergyLogging" /t REG_DWORD /d "1" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power\EnergyEstimation\TaggedEnergy" /v "TelemetryMaxApplication" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power\EnergyEstimation\TaggedEnergy" /v "TelemetryMaxTagPerApplication" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling CoalescingTimerInterval%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager" /v "CoalescingTimerInterval" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Power" /v "CoalescingTimerInterval" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "CoalescingTimerInterval" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "CoalescingTimerInterval" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" /v "CoalescingTimerInterval" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power\ModernSleep" /v "CoalescingTimerInterval" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "CoalescingTimerInterval" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "PlatformAoAcOverride" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "EnergyEstimationEnabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "EventProcessorEnabled" /t REG_DWORD /d "0" /f 
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v "CsEnabled" /t REG_DWORD /d "0" /f 
timeout /t 1 /nobreak > NUL

echo %w% - Disabling Power Throttling%b%
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling" /v "PowerThrottlingOff" /t REG_DWORD /d "1" /f 
timeout /t 1 /nobreak > NUL

:: GPU Optimizations
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "GraphicsPriority" /t REG_DWORD /d 2 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Priority" /t REG_DWORD /d 8 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Scheduling Category" /t REG_SZ /d "High" /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "SFIO Priority" /t REG_SZ /d "High" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "HwSchMode" /t REG_DWORD /d 2 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "EnableHwsch" /t REG_DWORD /d 2 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power" /v "HwSchMode" /t REG_DWORD /d 2 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "DxMaxMinRes" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "GpuPriority" /t REG_DWORD /d 8 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "MaxGPULoadThreads" /t REG_DWORD /d 10 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "TdrLevel" /t REG_DWORD /d 0 /f
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v NetworkPerformance /t REG_DWORD /d 6 /f
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v GPU Priority /t REG_DWORD /d 8 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v SFIO Priority /t REG_SZ /d High /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v GPU Priority /t REG_DWORD /d 4 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v Priority /t REG_DWORD /d 4 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v EnablePreemption /t REG_DWORD /d 0 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "DpiMapIommuContiguous" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "HwSchedMode" /t REG_DWORD /d "2" /f
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v SystemPerformance /t REG_DWORD /d 8 /f
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v Afinity /t REG_DWORD /d 8 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v Scheduling Category /t REG_SZ /d High /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v Scheduling Category /t REG_SZ /d Medium /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "FrameBufferLimit" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "HwSchMode" /t REG_DWORD /d 2 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Scheduling Category" /t REG_SZ /d "High" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "GPUDelayExecution" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "TdrDelay" /t REG_DWORD /d 60 /f

:: CPU Optimizations
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "IoPageLockLimit" /t REG_DWORD /d 0x800000 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" /v "AdditionalCriticalWorkerThreads" /t REG_DWORD /d 10 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "AutoBoostDefault" /t REG_DWORD /d 0 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Control\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 26 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\PriorityControl" /v IRQ8Priority /t REG_DWORD /d 1 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\PriorityControl" /v IRQ16Priority /t REG_DWORD /d 2 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 26 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 26 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d 16 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" /v AdditionalCriticalWorkerThreads /t REG_DWORD /d 8 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" /v AdditionalDelayedWorkerThreads /t REG_DWORD /d 8 /f

:: Mouse Optimizations
reg add "HKCU\Control Panel\Mouse" /v "MouseAcceleration" /t REG_DWORD /d 0 /f
reg add "HKCU\Control Panel\Mouse" /v "MouseThreshold1" /t REG_DWORD /d 0 /f
reg add "HKCU\Control Panel\Mouse" /v "MouseThreshold2" /t REG_DWORD /d 0 /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "MouseSensitivity" /t REG_SZ /d "10" /f
REG ADD "HKEY_CURRENT_USER\Control Panel\Mouse" /v MouseHoverTime /t REG_DWORD /d 10 /f
REM Atualiza flags para MouseKeys, StickyKeys, Keyboard Response, ToggleKeys
REG ADD "HKEY_CURRENT_USER\Control Panel\Accessibility\MouseKeys" /v Flags /t REG_DWORD /d 0 /f
SCEWIN_64.exe /i /ms "PS2 Keyboard and Mouse" /qv 0x0 /lang en-US 
Reg.exe add "HKU\.DEFAULT\Control Panel\Mouse" /v "Beep" /t REG_SZ /d "No" /f
Reg.exe add "HKU\.DEFAULT\Control Panel\Mouse" /v "ExtendedSounds" /t REG_SZ /d "No" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "ActiveWindowTracking" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "Beep" /t REG_SZ /d "No" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "DoubleClickHeight" /t REG_SZ /d "4" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "DoubleClickSpeed" /t REG_SZ /d "500" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "DoubleClickWidth" /t REG_SZ /d "4" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "ExtendedSounds" /t REG_SZ /d "No" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseHoverHeight" /t REG_SZ /d "4" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseHoverWidth" /t REG_SZ /d "4" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseSensitivity" /t REG_SZ /d "10" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseSpeed" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseThreshold1" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseThreshold2" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseTrails" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "SmoothMouseXCurve" /t REG_BINARY /d "0000000000000000c0cc0c0000000000809919000000000040662600000000000033330000000000" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "SmoothMouseYCurve" /t REG_BINARY /d "0000000000000000000038000000000000007000000000000000a800000000000000e00000000000" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "SnapToDefaultButton" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "SwapMouseButtons" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseHoverTime" /t REG_SZ /d "8" /f
reg add "HKCU\Control Panel\Mouse" /v MouseSensitivity /t REG_SZ /d 10 /f
reg add "HKCU\Control Panel\Mouse" /v MouseSpeed /t REG_SZ /d 1 /f
reg add "HKCU\Control Panel\Mouse" /v MouseThreshold1 /t REG_SZ /d 0 /f
reg add "HKCU\Control Panel\Mouse" /v MouseThreshold2 /t REG_SZ /d 0 /f
reg add "HKCU\Control Panel\Mouse" /v "MouseTrails" /t REG_SZ /d "" /f

:: Disk Optimizations
reg add "HKLM\SOFTWARE\Microsoft\Dfrg\BootOptimizeFunction" /v "Enable" /t REG_SZ /d "N" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v "NtfsMemoryUsage" /t REG_DWORD /d 2 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v "IRPStackSize" /t REG_DWORD /d 15 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v IRPStackSize /t REG_DWORD /d 20 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v SizReqBuf /t REG_DWORD /d 17424 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem" /v "NtfsDisableCompression" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Dfrg\BootOptimizeFunction" /v Enable /t REG_SZ /d N /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem" /v NtfsMemoryUsage /t REG_DWORD /d 2 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v "EnableSecuritySignature" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v "EnablePlainTextPassword" /t REG_DWORD /d 1 /f



:: Definir prioridade alta para jogos
reg add "HKLM\SYSTEM\CurrentControlSet\Services\lanmanserver\parameters" /v "Size" /t REG_DWORD /d 3 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Diagnostics\Performance" /v "ScenarioExecutionEnabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\DeliveryOptimization\Config" /v "DODownloadMode" /t REG_DWORD /d 0 /f
bcdedit /set useplatformtick yes
bcdedit /set tscsyncpolicy Enhanced
:: Desativar o Dynamic Tick, otimizando o temporizador do sistema para jogos
bcdedit /set disabledynamictick yes
:: Melhorar o desempenho do processador ajustando o balanceamento de cargas para múltiplos núcleos
bcdedit /set maxprocessors 100
:: Desativar o Throttle de Energia da CPU (Power Throttling)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling" /v "PowerThrottlingOff" /t REG_DWORD /d 1 /f
:: Desativar o Prefetcher (evita cache desnecessário de arquivos durante o jogo)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v "EnablePrefetcher" /t REG_DWORD /d 0 /f
:: ----- AJUSTES DE REDE -----
:: Desativar o algoritmo de congestionamento padrão e priorizar baixa latência
netsh int tcp set global autotuninglevel=highlyrestricted
netsh int tcp set global chimney=enabled
netsh int tcp set global dca=enabled
:: Ajustar parâmetros de DNS para respostas mais rápidas e priorização de tráfego
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" /v "MaxCacheTTL" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" /v "MaxNegativeCacheTTL" /t REG_DWORD /d 0 /f
:: Melhorar performance de downloads e uploads (usando redes Wi-Fi ou Ethernet)
netsh interface tcp set global rss=enabled
netsh int tcp set global autotuninglevel=normal
netsh int tcp set global ctcp=enabled
:: ----- OTIMIZAÇÃO DA MEMÓRIA -----
:: Aumentar o tamanho do cache de páginas de memória, otimizando o acesso e evitando carregamentos desnecessários
:: Otimizar o uso de memória virtual, evitando swaps desnecessários para o disco
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "PagingFiles" /t REG_SZ /d "C:\pagefile.sys 2048 2048" /f
:: Melhorar o gerenciamento de memória ao priorizar processos ativos
fsutil behavior set disabledeletenotify 0
:: Melhorar a velocidade de escrita do SSD ao desativar o buffer de gravação
reg add "HKLM\SYSTEM\CurrentControlSet\Services\iaStorV\Parameters\Port0" /v "EnableCommandQueue" /t REG_DWORD /d 0 /f
:: ----- OTIMIZAÇÃO DA GPU -----
:: Aumentar a prioridade de resposta da GPU em jogos (via regedit)
:: Desativar throttling dinâmico da GPU para desempenho constante
:: Desativar a VSync em jogos para garantir que a taxa de FPS não seja limitada
reg add "HKCU\Software\Microsoft\Direct3D" /v "DisableVSync" /t REG_DWORD /d 1 /f
:: ----- AJUSTES GERAIS DE OTIMIZAÇÃO -----
:: Desativar notificações de fundo que interferem na performance
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\PushNotifications" /v "ToastEnabled" /t REG_DWORD /d 0 /f
:: Desativar atualizações automáticas de drivers durante o jogo
reg add "HKLM\Software\Policies\Microsoft\Windows\DeviceInstall\Restrictions" /v "DenyDeviceIDs" /t REG_MULTI_SZ /d 1 /f
:: Desativar a Tarefa Programada de Atualização do Windows (para evitar interferência)
schtasks /Change /TN "Microsoft\Windows\UpdateOrchestrator\ScheduleScan" /Disable
:: ----- AJUSTES DE SOM (LATÊNCIA REDUZIDA PARA GAMING) -----
:: Aumentar a prioridade do processamento de áudio para reduzir latência em jogos com comunicação por voz
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render" /v "PerformanceMode" /t REG_DWORD /d 1 /f
:: ----- SERVIÇOS DESATIVADOS PARA OTIMIZAÇÃO -----
:: Desativar o Windows Error Reporting para evitar perda de performance em casos de falhas
sc config WerSvc start= disabled
:: Desativar o serviço de Telemetria do Windows
sc config DiagTrack start= disabled
:: Desativar o Windows Defender (caso esteja impactando o desempenho, principalmente em notebooks)
sc config "WinDefend" start= disabled
:: ----- OTIMIZAÇÃO DE PRIORIDADE E TEMPO REAL -----
:: Priorizar aplicativos de jogos (foreground) para garantir mais tempo de CPU para eles
reg add "HKCU\Control Panel\Desktop" /v "ForegroundLockTimeout" /t REG_DWORD /d 0 /f
reg add "HKCU\Control Panel\Desktop" /v "ForegroundFlashCount" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "MaxGPUThreads" /t REG_DWORD /d 10 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer" /v "EnablePerformanceMode" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Psched" /v "NonBestEffortLimit" /t REG_DWORD /d 0 /f
netsh int tcp set global rsc=enabled
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render" /v "AudioThreadPriority" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Capture" /v "CaptureThreadPriority" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows Search" /v "SetupCompletedSuccessfully" /t REG_DWORD /d 0 /f
sc config WSearch start= disabled
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Personalization" /v "NoLockScreen" /t REG_DWORD /d 1 /f
:: Desativar a tela de boas-vindas e as dicas do Windows
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SubscribedContent-338393Enabled" /t REG_DWORD /d 0 /f
sc config Themes start= disabled
:: ----- AJUSTES DE DESEMPENHO VISUAL (SEM AFETAR GRÁFICOS DO JOGO) -----
:: Ajustar o Windows para desempenho máximo, desativando animações desnecessárias
reg add "HKCU\Control Panel\Desktop" /v "MinAnimate" /t REG_SZ /d "0" /f
:: Ativar modo de alto desempenho da CPU, impedindo quedas de frequência
powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 100
powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 100
powercfg /setacvalueindex SCHEME_CURRENT SUB_VIDEO VIDEODYNREC 0
netsh int tcp set global netdma=enabled
netsh int tcp set global rss=enabled
netsh int tcp set global autotuninglevel=experimental
schtasks /Change /TN "Microsoft\Windows\TaskScheduler\Maintenance Configurator" /Disable
schtasks /Change /TN "Microsoft\Windows\TaskScheduler\Regular Maintenance" /Disable
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\{GUID_DA_SUA_INTERFACE_WIFI}" /v TcpAckFrequency /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\{GUID_DA_SUA_INTERFACE_WIFI}" /v TCPNoDelay /t REG_DWORD /d 1 /f
:: Aumentar o tamanho da fila de recebimento TCP na interface Wi-Fi
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v TcpWindowSize /t REG_DWORD /d 524288 /f
:: Melhorar o tempo de resposta para pacotes via Wi-Fi
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v DefaultTTL /t REG_DWORD /d 64 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v Tcp1323Opts /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v EnableWsd /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v SackOpts /t REG_DWORD /d 1 /f
:: Melhorar performance com TCP Optimizer via Wi-Fi
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v TcpTimedWaitDelay /t REG_DWORD /d 30 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v MaxUserPort /t REG_DWORD /d 65534 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v TcpMaxDataRetransmissions /t REG_DWORD /d 2 /f
netsh wlan set autoconfig enabled=yes interface="Wi-Fi"
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\A2D805F1-E904-460C-A7E3-CD5E8C0B058A" /v TcpAckFrequency /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\A2D805F1-E904-460C-A7E3-CD5E8C0B058A" /v TCPNoDelay /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\DNS\Parameters" /v "MaximumUdpPacketSize" /t REG_DWORD /d "1221" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNS\Parameters" /v "MaximumUdpPacketSize" /t REG_DWORD /d "1298" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNS\Parameters" /v "MaximumUdpPacketSize" /t REG_DWORD /d "1398" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "CacheHashTableBucketSize" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "CacheHashTableSize" /t REG_DWORD /d "384" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "CacheHashTableSize" /t REG_DWORD /d "900" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "MaxCacheEntryTtlLimit" /t REG_DWORD /d "64000" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "MaxCacheEntryTtlLimit" /t REG_DWORD /d "409600" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "MaxCacheTtl" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "MaximumUdpPacketSize" /t REG_DWORD /d "4864" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "MaxNegativeCacheTtl" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "MaxSOACacheEntryTtlLimit" /t REG_DWORD /d "301" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "MaxSOACacheEntryTtlLimit" /t REG_DWORD /d "769" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "NegativeCacheTime" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "NegativeSOACacheTime" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "NetFailureCacheTime" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "ServerPriorityTimeLimit" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\DNScache\Parameters" /v "ServiceDllUnloadOnStop" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters\Probe\{25aa16d5-73d9-4cd8-91ff-0683b3bcd05a}" /v "NetworkPerformsHijacking" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters\Probe\{e97ca175-e5e7-4580-895e-91be966166ba}" /v "NetworkPerformsHijacking" /t REG_DWORD /d "0" /f
REM Adiciona chaves NetworkThrottling e SystemResponsiveness
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 0xffffffff /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\Windows NT\DNSClient" /v "DisableSmartNameResolution" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\Windows NT\DNSClient" /v "DisableSmartProtocolReordering" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\Windows NT\DNSClient" /v "EnableIdnMapping" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\Windows NT\DNSClient" /v "EnableMulticast" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\Windows NT\DNSClient" /v "PreferLocalOverLowerBindingDNS" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\Windows NT\DNSClient" /v "RegistrationEnabled" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\Windows NT\DNSClient" /v "UpdateSecurityLevel" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v TcpNumConnections /t REG_DWORD /d 0x00fffffe /f
wmic nicconfig where (IPEnabled=TRUE) call SetTcpipNetbios 2
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\{%index%}" /v TcpAckFrequency /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\{%index%}" /v TCPNoDelay /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d ffffffff /f
:: Configurar o DNS preferencial e alternativo
echo Configurando o DNS preferencial e alternativo...
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v DisableTaskOffload /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v TcpInitialRto /t REG_DWORD /d 3000 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v TcpMaxSynRetransmissions /t REG_DWORD /d 2 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v TcpFinTimeout /t REG_DWORD /d 30 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v TcpWindowSize /t REG_DWORD /d 64240 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v EnableFragmentation /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v NetworkPerformanceThrottlingIndex /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v "TcpTimedWaitDelay" /t REG_DWORD /d 30 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v "MaxUserPort" /t REG_DWORD /d 65534 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v TcpNoDelay /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v TcpAckFrequency /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\{GUID}" /v "TcpAckFrequency" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\{GUID}" /v "TCPNoDelay" /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\VxD\BIOS" /v "CPUPriority" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "ProccesorThrottlingEnabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "CpuIdleThreshold" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "CpuIdle" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "CpuLatencyTimer" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "CpuSlowdown" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "DedicatedSegmentSize" /t REG_DWORD /d "1298" /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "Threshold" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "CpuDebuggingEnabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\ControlSet001\Control\Processor" /v "ProccesorLatencyThrottlingEnabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\HardCap0" /v "SchedulingType" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\Paused" /v "CapPercentage" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\Paused" /v "SchedulingType" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapFull" /v "CapPercentage" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapFull" /v "SchedulingType" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapFullAboveNormal" /v "CapPercentage" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapFullAboveNormal" /v "PriorityClass" /t REG_DWORD /d "32" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapFullAboveNormal" /v "SchedulingType" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapLow" /v "CapPercentage" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapLow" /v "SchedulingType" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapLowBackgroundBegin" /v "CapPercentage" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapLowBackgroundBegin" /v "PriorityClass" /t REG_DWORD /d "32" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\SoftCapLowBackgroundBegin" /v "SchedulingType" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\UnmanagedAboveNormal" /v "CapPercentage" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\UnmanagedAboveNormal" /v "PriorityClass" /t REG_DWORD /d "32" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\CPU\UnmanagedAboveNormal" /v "SchedulingType" /t REG_DWORD /d "0" /f
SCEWIN_64.exe /i /ms "PEP CPU" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "CPU Wakeup Timer" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "CPU Attached Storage" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "CPU PkgC10 Long Sleep" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "CPU Run Control" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "CPU Run Control Lock" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Processor trace memory allocation" /qv 0xFF /lang en-US 
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\games" /v GPU Priority /t REG_DWORD /d 12 /f
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\Default\GPUCache\ 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\GrShaderCache\GPUCache\ 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\ShaderCache\GPUCache\ 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 1"\GPUCache\ 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 2"\GPUCache\ 
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Flags\ThrottleGPUInterference" /v "IsLowPriority" /t REG_DWORD /d "0" /f
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\Default\"Service Worker"\CacheStorage\ 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\Default\"Service Worker"\ScriptCache\ 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 1"\"Service Worker"\CacheStorage\ 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 1"\"Service Worker"\ScriptCache\ 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 2"\"Service Worker"\CacheStorage\ 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 2"\"Service Worker"\ScriptCache\ 
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "PriorityBoost" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "MaxCacheEntryTtlLimit" /t REG_DWORD /d "10800" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "MaxCacheTtl" /t REG_DWORD /d "10800" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "MaxCacheTtl" /t REG_DWORD /d "14400" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Flags\BackgroundDefault" /v "IsLowPriority" /t REG_DWORD /d "0" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v SecondLevelDataCache /t REG_DWORD /d 1264 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v ThirdLevelDataCache /t REG_DWORD /d 8192 /f
del "%HOMEPATH%\AppData\Roaming\discord\Cache" /F /Q 
del C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\Default\Cache\data*. 
del C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\Default\Cache\f*. 
del C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\Default\Cache\index. 
del C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 1"\Cache\data*. 
del C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 1"\Cache\f*. 
del C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 1"\Cache\index. 
del C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 2"\Cache\data*. 
del C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 2"\Cache\f*. 
del C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 2"\Cache\index. 
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Flags\Frozen" /v "IsLowPriority" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Flags\FrozenDNCS" /v "IsLowPriority" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Flags\FrozenDNK" /v "IsLowPriority" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Flags\FrozenPPLE" /v "IsLowPriority" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Flags\Paused" /v "IsLowPriority" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Flags\PausedDNK" /v "IsLowPriority" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Flags\Pausing" /v "IsLowPriority" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Flags\PrelaunchForeground" /v "IsLowPriority" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Critical" /v "BasePriority" /t REG_DWORD /d "82" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Critical" /v "BasePriority" /t REG_DWORD /d "130" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Critical" /v "OverTargetPriority" /t REG_DWORD /d "50" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Critical" /v "OverTargetPriority" /t REG_DWORD /d "80" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\CriticalNoUi" /v "BasePriority" /t REG_DWORD /d "82" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\CriticalNoUi" /v "BasePriority" /t REG_DWORD /d "130" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\CriticalNoUi" /v "OverTargetPriority" /t REG_DWORD /d "50" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\CriticalNoUi" /v "OverTargetPriority" /t REG_DWORD /d "80" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\EmptyHostPPLE" /v "BasePriority" /t REG_DWORD /d "82" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\EmptyHostPPLE" /v "BasePriority" /t REG_DWORD /d "130" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\EmptyHostPPLE" /v "OverTargetPriority" /t REG_DWORD /d "50" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\EmptyHostPPLE" /v "OverTargetPriority" /t REG_DWORD /d "80" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\High" /v "BasePriority" /t REG_DWORD /d "82" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\High" /v "BasePriority" /t REG_DWORD /d "130" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\High" /v "OverTargetPriority" /t REG_DWORD /d "50" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\High" /v "OverTargetPriority" /t REG_DWORD /d "80" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Low" /v "BasePriority" /t REG_DWORD /d "82" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Low" /v "BasePriority" /t REG_DWORD /d "130" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Low" /v "OverTargetPriority" /t REG_DWORD /d "50" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Low" /v "OverTargetPriority" /t REG_DWORD /d "80" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Lowest" /v "BasePriority" /t REG_DWORD /d "82" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Lowest" /v "BasePriority" /t REG_DWORD /d "130" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Lowest" /v "OverTargetPriority" /t REG_DWORD /d "50" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Lowest" /v "OverTargetPriority" /t REG_DWORD /d "80" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Medium" /v "BasePriority" /t REG_DWORD /d "82" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Medium" /v "BasePriority" /t REG_DWORD /d "130" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Medium" /v "OverTargetPriority" /t REG_DWORD /d "50" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\Medium" /v "OverTargetPriority" /t REG_DWORD /d "80" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\MediumHigh" /v "BasePriority" /t REG_DWORD /d "82" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\MediumHigh" /v "BasePriority" /t REG_DWORD /d "130" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\MediumHigh" /v "OverTargetPriority" /t REG_DWORD /d "50" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\MediumHigh" /v "OverTargetPriority" /t REG_DWORD /d "80" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\StartHost" /v "BasePriority" /t REG_DWORD /d "82" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\StartHost" /v "BasePriority" /t REG_DWORD /d "130" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\StartHost" /v "OverTargetPriority" /t REG_DWORD /d "50" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\StartHost" /v "OverTargetPriority" /t REG_DWORD /d "80" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\VeryHigh" /v "BasePriority" /t REG_DWORD /d "82" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\VeryHigh" /v "BasePriority" /t REG_DWORD /d "130" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\VeryHigh" /v "OverTargetPriority" /t REG_DWORD /d "50" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\VeryHigh" /v "OverTargetPriority" /t REG_DWORD /d "80" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\VeryLow" /v "BasePriority" /t REG_DWORD /d "82" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\VeryLow" /v "BasePriority" /t REG_DWORD /d "130" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\VeryLow" /v "OverTargetPriority" /t REG_DWORD /d "50" /f
    Reg.exe add "HKLM\System\ResourcePolicyStore\ResourceSets\Policies\Importance\VeryLow" /v "OverTargetPriority" /t REG_DWORD /d "80" /f
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "ThumbnailCache" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\MSMQ\Parameters" /v TCPNoDelay /t REG_DWORD /d 1 /f
nbtstat -R
nbtstat -RR
netsh interface ip delete arpcache
netsh int tcp set global congestionprovider=ctcp
netsh int tcp set global ecncapability=enabled
netsh interface tcp set global autotuninglevel=highlyrestricted
netsh interface tcp set global rsc=enabled
netsh int tcp set global timestamps=disabled
netsh advfirewall set allprofiles state on
netsh advfirewall firewall add rule name="CS2" dir=in action=allow protocol=UDP localport=27015
netsh advfirewall firewall add rule name="CS2" dir=out action=allow protocol=UDP localport=27015

netsh int tcp set heuristics disabled
:: Desativar o Windows Auto-Tuning avançado para melhorar a estabilidade da rede
netsh int tcp set global autotuninglevel=disabled
:: Melhorar a latência geral do sistema ao ajustar o TCP Chimney Offload
netsh int tcp set global chimney=automatic
netsh interface tcp set global ecncapability=disabled
netsh interface tcp set global dca=disabled
:: Habilitar modo de jogo para priorizar desempenho
reg add "HKEY_CURRENT_USER\Software\Microsoft\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 1 /f

route /f
netsh wlan disconnect
netsh wlan connect name="LAIDES_5G"
:: Desativar IPv6 (se não estiver em uso) para evitar pacotes indesejados e melhorar a latência
netsh interface ipv6 set disabled

reg add "HKCU\Software\Microsoft\Windows\Shell\Bags\1\Desktop" /v "IconSize" /t REG_DWORD /d 32 /f
REM Define também para pastas gerais (garantia de efeito em algumas versões do Windows)
reg add "HKCU\Software\Microsoft\Windows\Shell\Bags\AllFolders\Shell" /v "IconSize" /t REG_DWORD /d 32 /f
REM Desativa o ícone de som na barra de tarefas
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v "HideSCAVolume" /t REG_DWORD /d 1 /f
echo Ícone de som na barra de tarefas desativado com sucesso!
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\WindowsRuntime\ActivatableClassId\Windows.Gaming.GameBar.PresenceServer.Internal.PresenceWriter" /v ActivationType /t REG_DWORD /d 0 /f
SCEWIN_64.exe /i /ms "Cpu CrashLog (Device 10)" /qv 0x0 /lang en-US 
REG ADD "HKCU\System\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 0 /f
REG ADD "HKCU\System\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f
REG ADD "HKCU\System\GameConfigStore" /v GameDVR_HonorFSEBehaviorMode /t REG_DWORD /d 0 /f
REM Atualiza as chaves no GameConfigStore
REG ADD "HKEY_CURRENT_USER\System\GameConfigStore" /v windowsCompatible /t REG_DWORD /d 1 /f
REG ADD "HKEY_CURRENT_USER\System\GameConfigStore" /v behaviorMode /t REG_DWORD /d 0 /f
REG DELETE "HKEY_CURRENT_USER\System\GameConfigStore\children" /f
REG DELETE "HKEY_CURRENT_USER\System\GameConfigStore\parents" /f
REM Configura o PrefetchParameters para desativar o Prefetch e Superfetch
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v EnablePrefetch /t REG_DWORD /d 0 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v EnableSuperfetch /t REG_DWORD /d 0 /f
REM Adiciona chave RMHdcpKeyglobZero (você deve substituir "0000" com o número da pasta correta da sua placa)
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000" /v RMHdcpKeyglobZero /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "DpcWatchdogProfileOffset" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "DpcWatchdogPeriod" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "DynamicBacklogGrowthDelta" /t REG_DWORD /d "256" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DynamicBacklogGrowthDelta" /t REG_DWORD /d "10" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DynamicBacklogGrowthDelta" /t REG_DWORD /d "16" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DynamicBacklogGrowthDelta" /t REG_DWORD /d "32" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DynamicBacklogGrowthDelta" /t REG_DWORD /d "100" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DynamicBacklogGrowthDelta" /t REG_DWORD /d "256" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DynamicBacklogGrowthDelta" /t REG_SZ /d "" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "DynamicBacklogGrowthDelta" /t REG_DWORD /d "256" /f
SCEWIN_64.exe /i /ms "HDC Control" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "WatchDog" /qv 0x0 /lang en-US 
:: Bateria e Energia
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\943c8cb6-6f93-4227-ad87-e9a3feec08d1" /v Attributes /t REG_DWORD /d 2 /f
REM Adiciona PowerThrottling no Power
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 0x1 /f
SCEWIN_64.exe /i /ms "EC Low Power Mode" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Energy Performance Gain" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Energy Efficient P-state" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Energy Efficient Turbo" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "JTAG C10 Power Gate" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "Clock Power Management" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "SLP_LAN# Low on DC Power" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "DeepSx Power Policies" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "USB2 PHY Sus Well Power Gating" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Disable Gen2 Pll Shutdown and L1 Controller Power gating" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "USB Standby Power at S4/S5" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PCI Express Power Gating" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Power Gating" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Power Loss Notification Feature" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enable DCI ModPHY Power Gate" /qv 0x0 /lang en-US 

REG ADD "HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Serialize" /v StartupDelayInMSec /t REG_DWORD /d 0 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\Ndu" /v Start /t REG_DWORD /d 4 /f
REM Adiciona chaves para Tasks - games
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\games" /v Afinity /t REG_DWORD /d 0 /f
taskkill /f /im spotify.exe >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\SpotifyStartupTask.exe" >NUL 2>&1 
taskkill /F /IM "msedge.exe" 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\Default\"Service Worker"\Database\ 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 1"\"Service Worker"\Database\ 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 2"\"Service Worker"\Database\ 
Reg.exe add "HKLM\System\CurrentControlSet\Services\VxD\BIOS" /v "FastDRAM" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\VxD\BIOS" /v "AGPConcur" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\System\CurrentControlSet\Services\VxD\BIOS" /v "PCIConcur" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\DXGKrnl" /v "MonitorLatencyTolerance" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\DXGKrnl" /v "MonitorRefreshLatencyTolerance" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "DefaultReceiveWindow" /t REG_DWORD /d "16384" /f
    Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "DefaultSendWindow" /t REG_DWORD /d "16384" /f
    Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "FastCopyReceiveThreshold" /t REG_DWORD /d "16384" /f
    Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "FastSendDatagramThreshold" /t REG_DWORD /d "16384" /f
    Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "DynamicSendBufferDisable" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "IgnorePushBitOnReceives" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "NonBlockingSendSpecialBuffering" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v "DisableRawSecurity" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "DefaultReceiveWindow" /t REG_DWORD /d "8192" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "DefaultSendWindow" /t REG_DWORD /d "4096" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "DisableAddressSharing" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "FastSendDatagramThreshold" /t REG_DWORD /d "1024" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "IgnorePushBitOnReceives" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "InitialLargeBufferCount" /t REG_DWORD /d "20" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "InitialMediumBufferCount" /t REG_DWORD /d "48" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "InitialSmallBufferCount" /t REG_DWORD /d "64" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "LargeBufferSize" /t REG_DWORD /d "40960" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "MaxFastTransmit" /t REG_DWORD /d "6400" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "MediumBufferSize" /t REG_DWORD /d "15040" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "SmallBufferSize" /t REG_DWORD /d "1280" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "TransmitWorker" /t REG_DWORD /d "32" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "DisableStrictNameChecking" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "EnableDynamicBacklog" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "IRPStackSize" /t REG_DWORD /d "32" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "MaximumDynamicBacklog" /t REG_DWORD /d "131072" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "MaxMpxCt" /t REG_DWORD /d "2048" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "MaxWorkItems" /t REG_DWORD /d "8192" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "MinimumDynamicBacklog" /t REG_DWORD /d "512" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "Size" /t REG_DWORD /d "3" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "SizReqBuf" /t REG_DWORD /d "17424" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\ADF\Parameters" /v "SystemPages" /t REG_DWORD /d "4294967295" /f
    Reg.exe add "HKLM\System\CurrentControlSet\services\AeLookupSvc" /v "Start" /t REG_DWORD /d "4" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DefaultReceiveWindow" /t REG_DWORD /d "1048576" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DefaultReceiveWindow" /t REG_DWORD /d "1662720" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DefaultReceiveWindow" /t REG_DWORD /d "3539039" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DefaultReceiveWindow" /t REG_DWORD /d "4294967295" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DefaultSendWindow" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DefaultSendWindow" /t REG_DWORD /d "4736" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DefaultSendWindow" /t REG_DWORD /d "108800" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DefaultSendWindow" /t REG_DWORD /d "768000" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DefaultSendWindow" /t REG_DWORD /d "845568" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DefaultSendWindow" /t REG_DWORD /d "1048576" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DefaultSendWindow" /t REG_DWORD /d "4294967295" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DisableAddressSharing" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "DoNotHoldNicBuffers" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "EnableDynamicBacklog" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "EnableDynamicBacklog" /t REG_SZ /d "" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "EnablePMTUDiscovery" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "EnableWsd" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "FastCopyReceiveThreshold" /t REG_DWORD /d "1500" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "FastCopyReceiveThreshold" /t REG_DWORD /d "4294967295" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "FastSendDatagramThreshold" /t REG_DWORD /d "1500" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "FastSendDatagramThreshold" /t REG_DWORD /d "4294967295" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "GlobalMaxTcpWindowSize" /t REG_DWORD /d "3539039" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "KeepAliveInterval" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "KeepAliveInterval" /t REG_SZ /d "" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "MaxHashTableSize" /t REG_DWORD /d "4096" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "MaximumDynamicBacklog" /t REG_DWORD /d "1000" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "MaximumDynamicBacklog" /t REG_DWORD /d "4096" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "MaximumDynamicBacklog" /t REG_DWORD /d "20000" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "MaximumDynamicBacklog" /t REG_DWORD /d "131072" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "MaximumDynamicBacklog" /t REG_SZ /d "" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "MinimumDynamicBacklog" /t REG_DWORD /d "20" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "MinimumDynamicBacklog" /t REG_DWORD /d "32" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "MinimumDynamicBacklog" /t REG_DWORD /d "200" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "MinimumDynamicBacklog" /t REG_DWORD /d "512" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "MinimumDynamicBacklog" /t REG_SZ /d "" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "TcpMaxDupAcks" /t REG_DWORD /d "3" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\AFD\Parameters" /v "TcpTimedWaitDelay" /t REG_DWORD /d "30" /f
    Reg.exe add "HKLM\System\ControlSet001\Services\AFD\Parameters" /v "BufferMultiplier" /t REG_DWORD /d "1024" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "DefaultTTL" /t REG_DWORD /d "64" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "EnableAutoDoh" /t REG_DWORD /d "2" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "EnableDynamicBacklog" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "extension" /t REG_EXPAND_SZ /d "%%SystemRoot%%\System32\dnsext.dll" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "GlobalMaxTcpWindowSize" /t REG_SZ /d "Ԁ䲮" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "MaximumDynamicBacklog" /t REG_DWORD /d "131072" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "MinimumDynamicBacklog" /t REG_DWORD /d "512" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "ServiceDll" /t REG_EXPAND_SZ /d "%%SystemRoot%%\System32\dnsrslvr.dll" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters" /v "TcpNoDelay" /t REG_DWORD /d "151807" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters\Probe\{25aa16d5-73d9-4cd8-91ff-0683b3bcd05a}" /v "LastProbeTime" /t REG_DWORD /d "1500872657" /f
    Reg.exe add "HKLM\System\CurrentControlSet\Services\Dnscache\Parameters\Probe\{e97ca175-e5e7-4580-895e-91be966166ba}" /v "LastProbeTime" /t REG_DWORD /d "1500872066" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\Services\FileAndPrint" /v "Enabled" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\Services\RemoteDesktop" /v "Enabled" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\Services\FileAndPrint" /v "Enabled" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\Services\RemoteDesktop" /v "Enabled" /t REG_DWORD /d "0" /f

REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\MSMQ" /v TCPNoDelay /t REG_DWORD /d 1 /f
REM Ajusta SizReqBuf para melhorar a rede
echo Registro atualizado com sucesso.
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control" /v SvcHostSplitThresHoldlnKB /t REG_DWORD /d 0x02000000 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v SvcHostSplitThresHoldlnKB /t REG_DWORD /d 0x02000000 /f
REM Desativa a atualização de drivers
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\DriverSearching" /v SearchOrderConfig /t REG_DWORD /d 0 /f
REM Adiciona valores ao Control
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control" /v svchostsplit /t REG_DWORD /d 0xXXXX /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control" /v RAMValue /t REG_DWORD /d 2000000 /f
REM Adiciona AllowGameDVR em default
REG ADD "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\GameDVR" /v AllowGameDVR /t REG_DWORD /d 1 /f
REM Remove as chaves children e parents se existirem
REG DELETE "HKEY_CURRENT_USER\Software\SomeKey\children" /f 2>nul
REG DELETE "HKEY_CURRENT_USER\Software\SomeKey\parents" /f 2>nul
REG ADD "HKEY_CURRENT_USER\Control Panel\Desktop" /v MenuShowDelay /t REG_DWORD /d 0 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v featureSettings /t REG_DWORD /d 1 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v FeatureSettingsOverride /t REG_DWORD /d 3 /f
REG ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v FeaturesSettingsOverrideMask /t REG_DWORD /d 3 /f
REM Atualiza DriverSearching para não procurar atualizações de drivers
REG ADD "HKEY_CURRENT_USER\Control Panel\Accessibility\StickyKeys" /v Flags /t REG_DWORD /d 0 /f
REG ADD "HKEY_CURRENT_USER\Control Panel\Accessibility\Keyboard Response" /v Flags /t REG_DWORD /d 0 /f
REG ADD "HKEY_CURRENT_USER\Control Panel\Accessibility\ToggleKeys" /v Flags /t REG_DWORD /d 0 /f
REM Desativa o serviço de manutenção
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Schedule\Maintenance" /v MaintenanceDisabled /t REG_DWORD /d 0x1 /f
REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows NT\SystemRestore" /v DisableSR /t REG_DWORD /d 1 /f

del /f/s/q "%appdata%\Spotify\SpotifyMigrator.exe" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\Apps\Buddy-list.spa" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\Apps\Concert.spa" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\Apps\Concerts.spa" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\Apps\Error.spa" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\Apps\Findfriends.spa" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\Apps\Legacy-lyrics.spa" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\Apps\Lyrics.spa" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\Apps\Show.spa" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\am.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ar.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ar.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\bg.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\bn.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ca.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\cs.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\cs.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\da.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\de.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\de.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\el.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\el.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\en-GB.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\es.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\es.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\es-419.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\es-419.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\et.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\fa.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\fi.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\fi.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\fil.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\fr.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\fr.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\fr-CA.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\gu.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\he.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\he.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\hi.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\hr.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\hu.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\hu.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\id.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\id.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\it.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\it.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ja.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ja.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\kn.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ko.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ko.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\lt.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\lv.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ml.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\mr.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ms.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ms.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\nb.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\nl.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\nl.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\pl.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\pl.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\pt-PT.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\pt-BR.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\pt-BR.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ro.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ru.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ru.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\sk.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\sl.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\sr.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\sv.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\sv.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\sw.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\ta.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\te.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\th.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\th.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\tr.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\tr.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\uk.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\vi.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\vi.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\zh-CN.pak" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\zh-Hant.mo" >NUL 2>&1 
del /f/s/q "%appdata%\Spotify\locales\zh-TW.pak" >NUL 2>&1 
Reg.exe del "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "Spotify" /f >NUL 2>&1 
del "%HOMEPATH%\Desktop\Discord.ink" /F /Q 
del "%HOMEPATH%\Desktop\Discord.ink - Shortcut" /F /Q 
del "%HOMEPATH%\Desktop\Update.exe" /F /Q 
del "%HOMEPATH%\Desktop\Update.exe - Shortcut" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\Update.exe" /F /Q 
del "%HOMEPATH%\Desktop\Discord.exe" /F /Q 
del "%HOMEPATH%\Desktop\Discord.exe - Shortcut" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\Squirrel.exe" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\SquirrelSetup.log" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\SquirrelSetup.log" /F /Q 
del "%HOMEPATH%\appdata\Local\Discord\Discord_updater_r00000.log" /F /Q 
del "%HOMEPATH%\appdata\Local\Discord\Discord_updater_r00001.log" /F /Q 
del "%HOMEPATH%\appdata\Local\Discord\Discord_updater_rCURRENT.log" /F /Q 
rmdir /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_cloudsync" 
rmdir /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_dispatch" 
rd /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_erlpack" 
rd /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_game_utils" 
rd /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_media" 
rd /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_spellcheck" 
rd /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_krisp" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_cloudsync" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_dispatch" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_erlpack" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_game_utils" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_media" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_spellcheck" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_krisp" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_cloudsync-1" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_dispatch-1" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_erlpack-1" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_game_utils-1" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_media-1" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_spellcheck-1" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_krisp-1" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_spellcheck-2" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_hook-1" 
rmdir /s /q "%HOMEPATH%\AppData\Local\Discord\app-1.0.9006\swiftshader" 
del "%HOMEPATH%\AppData\Local\Discord\app-1.0.9006\swiftshader" /F /Q 
rd /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_rpc" 
rd /s /q "%HOMEPATH%\appdata\Roaming\discord\1.0.9006\modules\discord_overlay2" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_rpc" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_overlay2" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_rpc-1" 
rmdir /s /q "%HOMEPATH%\appdata\Local\Discord\app-1.0.9006\modules\discord_overlay2-1" 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\am.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\ar.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\bg.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\bn.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\ca.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\cs.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\da.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\de.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\el.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\en-GB.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\es.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\es-419.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\et.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\fa.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\fi.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\fil.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\fr.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\gu.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\he.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\hi.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\hr.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\hu.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\id.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\it.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\ja.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\kn.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\ko.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\lt.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\lv.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\ml.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\mr.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\ms.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\nb.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\nl.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\pl.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\pt-br.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\pt-pt.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\ro.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\ru.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\sk.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\sl.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\sr.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\sv.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\sw.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\ta.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\te.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\th.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\tr.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\uk.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\vi.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\zh-cn.pak" /F /Q 
del "%HOMEPATH%\appdata\Local\discord\app-1.0.9006\locales\zh-tw.pak" /F /Q 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\Default\Storage\ext\ 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 1"\Storage\ext\ 
rmdir /q /s C:\Users\%USERNAME%\AppData\Local\Microsoft\Edge\"User Data"\"Profile 2"\Storage\ext\ 
title Otimizando seu PC! 
bcdedit /set tscsyncpolicy legacy
bcdedit /set hypervisorlaunchtype off
bcdedit /set linearaddress57 OptOut
bcdedit /set increaseuserva 268435328
bcdedit /set isolatedcontext No
bcdedit /set allowedinmemorysettings 0x0
bcdedit /set vsmlaunchtype Off
bcdedit /set vm No
Reg.exe add "HKLM\Software\Policies\Microsoft\FVE" /v "DisableExternalDMAUnderLock" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows\DeviceGuard" /v "EnableVirtualizationBasedSecurity" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows\DeviceGuard" /v "HVCIMATRequired" /t REG_DWORD /d "0" /f
bcdedit /set x2apicpolicy Enable
bcdedit /set uselegacyapicmode No
bcdedit /set configaccesspolicy Default
bcdedit /set MSI Default
bcdedit /set usephysicaldestination No
bcdedit /set usefirmwarepcisettings No
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\MTCUVC" /v EnableMtcUvc /t REG_DWORD /d 0 /f
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v AltTabSettings /t REG_DWORD /d 1 /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\DirectDraw" /v "DisableAGPSupport" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\DirectDraw" /v "DisableAGPSupport" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\DirectDraw" /v "UseNonLocalVidMem" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\DirectDraw" /v "UseNonLocalVidMem" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "UseNonLocalVidMem" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Direct3D" /v "UseNonLocalVidMem" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\DirectDraw" /v "DisableDDSCAPSInDDSD" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\DirectDraw" /v "DisableDDSCAPSInDDSD" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\DirectDraw" /v "EmulationOnly" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\DirectDraw" /v "EmulationOnly" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\DirectDraw" /v "EmulatePointSprites" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\DirectDraw" /v "EmulatePointSprites" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D\Drivers" /v "ForceRgbRasterizer" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Direct3D\Drivers" /v "ForceRgbRasterizer" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\DirectDraw" /v "EmulateStateBlocks" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\DirectDraw" /v "EmulateStateBlocks" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "EnableDebugging" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "FullDebug" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "DisableDM" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "EnableMultimonDebugging" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "LoadDebugRuntime" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D\Drivers" /v "EnumReference" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Direct3D\Drivers" /v "EnumReference" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D\Drivers" /v "EnumSeparateMMX" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Direct3D\Drivers" /v "EnumSeparateMMX" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D\Drivers" /v "EnumRamp" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Direct3D\Drivers" /v "EnumRamp" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D\Drivers" /v "EnumNullDevice" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Direct3D\Drivers" /v "EnumNullDevice" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "FewVertices" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Direct3D" /v "FewVertices" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\DirectDraw" /v "DisableMMX" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\DirectDraw" /v "DisableMMX" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "DisableMMX" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Direct3D" /v "DisableMMX" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "MMX Fast Path" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Direct3D" /v "MMX Fast Path" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "MMXFastPath" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Direct3D" /v "MMXFastPath" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "UseMMXForRGB" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Direct3D" /v "UseMMXForRGB" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D\Drivers" /v "UseMMXForRGB" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Direct3D\Drivers" /v "UseMMXForRGB" /t Reg_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\DirectDraw" /v "ForceNoSysLock" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Wow6432Node\Microsoft\DirectDraw" /v "ForceNoSysLock" /t Reg_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "DisableVidMemVBs" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D" /v "FlipNoVsync" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Direct3D\Drivers" /v "SoftwareOnly" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "DisableExceptionChainValidation" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "KernelSEHOPEnabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "DisableAutoBoost" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "DpcTimeout" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "ThreadDpcEnable" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v "InterruptSteeringDisabled" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\Software\Policies\Microsoft\Windows\WcmSvc\GroupPolicy" /v "fMinimizeConnections" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\Windows\WcmSvc\GroupPolicy" /v "fSoftDisconnectConnections" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\Windows\WCN\UI" /v "DisableWcnUi" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile" /v "DisableNotifications" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile" /v "DisableUnicastResponsesToMulticastBroadcast" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile" /v "DoNotAllowExceptions" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\IcmpSettings" /v "AllowInboundEchoRequest" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\IcmpSettings" /v "AllowInboundMaskRequest" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\IcmpSettings" /v "AllowInboundRouterRequest" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\IcmpSettings" /v "AllowInboundTimestampRequest" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\IcmpSettings" /v "AllowOutboundDestinationUnreachable" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\IcmpSettings" /v "AllowOutboundPacketTooBig" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\IcmpSettings" /v "AllowOutboundParameterProblem" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\IcmpSettings" /v "AllowOutboundSourceQuench" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\IcmpSettings" /v "AllowOutboundTimeExceeded" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\IcmpSettings" /v "AllowRedirect" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\Logging" /v "LogDroppedPackets" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\Logging" /v "LogSuccessfulConnections" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile\RemoteAdminSettings" /v "Enabled" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile" /v "DisableNotifications" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile" /v "DisableUnicastResponsesToMulticastBroadcast" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile" /v "DoNotAllowExceptions" /t REG_DWORD /d "1" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\IcmpSettings" /v "AllowInboundEchoRequest" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\IcmpSettings" /v "AllowInboundMaskRequest" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\IcmpSettings" /v "AllowInboundRouterRequest" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\IcmpSettings" /v "AllowInboundTimestampRequest" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\IcmpSettings" /v "AllowOutboundDestinationUnreachable" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\IcmpSettings" /v "AllowOutboundPacketTooBig" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\IcmpSettings" /v "AllowOutboundParameterProblem" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\IcmpSettings" /v "AllowOutboundSourceQuench" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\IcmpSettings" /v "AllowOutboundTimeExceeded" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\IcmpSettings" /v "AllowRedirect" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\Logging" /v "LogDroppedPackets" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\Logging" /v "LogSuccessfulConnections" /t REG_DWORD /d "0" /f
    Reg.exe add "HKLM\Software\Policies\Microsoft\WindowsFirewall\StandardProfile\RemoteAdminSettings" /v "Enabled" /t REG_DWORD /d "0" /f
bcdedit /set useplatformtick yes&&bcdedit /set disabledynamictick yes&&bcdedit /set disabledynamictick yes&&bcdedit /set nx optout&&bcdedit /set nx optout&&bcdedit /set bootux disabled&&bcdedit /set bootmenupolicy standard&&bcdedit /set hypervisorlaunchtype off&&bcdedit /set tpmbootentropy ForceDisable&&bcdedit /set quietboot yes&&bcdedit /set linearaddress57 OptOut&&bcdedit /set increaseuserva 268435328&&bcdedit /set firstmegabytepolicy UseAll&&bcdedit /set avoidlowmemory 0x8000000&&bcdedit /set nolowmem Yes&&bcdedit /set allowedinmemorysettings 0x0&&bcdedit /set isolatedcontext No
cd /d "%~dp0lib"
SCEWIN_64.exe /i /ms "PUIS Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel Ready Mode Technology" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel RMT State" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP IPU" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP GNA" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PEG0" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP SATA" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP enumerated SATA ports" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PCIe LAN" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PCIe WLAN" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PCIe GFX" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PCIe Other" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PCIe Storage" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP PCIe DG1" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP UART" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C0" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C1" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C2" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C3" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C4" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C5" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C6" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP I2C7" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP SPI" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP XHCI" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP Audio" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP SDXC" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP CSME" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP HECI3" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP LAN(GBE)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP THC0" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP THC1" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP TCSS" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP VMD" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP EMMC" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEP TBT RP" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "C6DRAM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "AP threads Idle Manner" /qv 0x3 /lang en-US 
SCEWIN_64.exe /i /ms "PECI" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel Trusted Execution Technology" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Race To Halt (RTH)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "CFG Lock" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Tcc Offset Time Window" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Bi-directional PROCHOT#" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "ACPI T-States" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enable xdpclock" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "WDT Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "BCLK Aware Adaptive Voltage" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Ring Down Bin" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PET Progress" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Thunderbolt Boot Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Wake From Thunderbolt(TM) Devices" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Thunderbolt Usb Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Windows 10 Thunderbolt support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "IGD VTD Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "IPU VTD Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "IOP VTD Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "USB3 Type-C UFP2DFP Kernel/Platform Debug Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Three Strike Counter" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "CrashLog Feature" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "RAM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Legacy UART" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "USB3" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Serial IO UART" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Trace Hub" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "MRC Serial Debug Messages" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Serial Debug Messages" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enable Hibernation" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "ACPI Standby State" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "SR-IOV Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "BME DMA Mitigation" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Extended Tag" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "Maximum Payload" /qv 0x5 /lang en-US 
SCEWIN_64.exe /i /ms "Maximum Read Request" /qv 0x5 /lang en-US 
SCEWIN_64.exe /i /ms "ASPM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "ARI Forwarding" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LTR Mechanism Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Port 60/64 Emulation" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "USB S5 Wakeup Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Ipv4 PXE Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Ipv6 PXE Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Option ROM Messages" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Launch PXE OpROM policy" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Type C Support" /qv 0x2 /lang en-US 
SCEWIN_64.exe /i /ms "Enable RH Prevention" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enable/Disable IED (Intel Enhanced Debug)" /qv 0x0 /lang en-US  
SCEWIN_64.exe /i /ms "CHAP Device (B0:D7:F0)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Thermal Device (B0:D4:F0)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "GNA Device (B0:D8:F0)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "ALS Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "VDD Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PAVP Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enable Display Audio Link in Pre-OS" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "DMI Gen3 ASPM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "DMI ASPM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "RC6(Render Standby)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEG0 Hotplug" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEG1 Hotplug" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEG2 Hotplug" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PCIe Spread Spectrum Clocking" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "LAN Wake From DeepSx" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Wake on LAN Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "DeepSx Wake on WLAN and BT Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Foxville I225 Wake on LAN Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Wake on WLAN and BT Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Disable DSX ACPRESENT PullDown" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "PS_ON Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enhance Port 80h LPC Decoding" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Legacy IO Low Latency" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "PCH Cross Throttling" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "IOAPIC 24-119 Entries" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enable 8254 Clock Gate" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel Rapid Recovery Technology" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Smart Response Technology" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel(R) Optane(TM) Memory" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "System Acceleration with Intel(R) Optane(TM) Memory" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "RGB Light" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Modern StandBy" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LAN Option ROM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEG0 - ASPM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEG1 - ASPM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PEG2 - ASPM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PCIE Spread Spectrum" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PCI Delay Optimization" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "PCI Express Clock Gating" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Vmax Stress" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "IOTG Spread Spectrum" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i3.4" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i3.3" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i3.2" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i3.1" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i3.0" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i2.2" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i2.1" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPM S0i2.0" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel(R) Turbo Boost Max Technology 3.0" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "Tcc Offset Lock Enable" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "USB DbC Enable Mode" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "USB Overcurrent Override for DbC" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Hardware Autonomous Width" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "Hardware Autonomous Speed" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "BIOS Hot-Plug Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "DMI Link ASPM Control" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "OS IDLE Mode" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "S0ix Auto Demotion" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Hybrid Storage Detection and Configuration Mode" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "FIVR Dynamic PM" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "ECC Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Row Hammer Mode" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "In-Band ECC Support" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "LPMode" /qv 0x2 /lang en-US 
SCEWIN_64.exe /i /ms "KT Device" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "IPU Device (B0:D5:F0)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Intel(R) Speed Shift Technology Interrupt Control" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "HwP Autonomous Per Core P State" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "HwP Autonomous EPP Grouping" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enhanced Thermal Velocity Boost" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "TVB Voltage Optimizations" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Thermal Velocity Boost" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Interrupt Redirection Mode Selection" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "Disable Fast PKG C State Ramp for IA Domain" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "INT3400 Device" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Enable Remote Platform Erase Feature" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "ITBT RTD3" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PCI Buses Padding" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "I/O Resources Padding" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "MMIO 32 bit Resources Padding" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "PFMMIO 32 bit Resources Padding" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Pcie Pll SSC" /qv 0xFE /lang en-US 
SCEWIN_64.exe /i /ms "WoV (Wake on Voice)" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Bluetooth Sideband" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "BT Intel HFP" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "BT Intel A2DP" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "DMI Gen3 L1 Exit Latency" /qv 0x1 /lang en-US 
SCEWIN_64.exe /i /ms "FIVR Spread Spectrum" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "RFI Spread Spectrum" /qv 0x0 /lang en-US 
SCEWIN_64.exe /i /ms "Per Core P State OS control mode" /qv 0x0 /lang en-US 
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{01578F96-C270-4602-ADE0-578D9C29FC0C}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{0BD3506A-9030-4F76-9B88-3E8FE1F7CFB6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{12d25187-6c0d-4783-ad3a-84caa135acfd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{15A7A4F8-0072-4EAB-ABAD-F98A4D666AED}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{1C95126E-7EEA-49A9-A3FE-A378B03DDB4D}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{1E39B4CE-D1E6-46CE-B65B-5AB05D6CC266}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{2F07E2EE-15DB-40F1-90EF-9D7BA282188A}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{314DE49F-CE63-4779-BA2B-D616F6963A88}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{315a8872-923e-4ea2-9889-33cd4754bf64}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{3CB40AAA-1145-4FB8-B27B-7E30F0454316}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{3EB875EB-8F4A-4800-A00B-E484C97D7551}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{43D1A55C-76D6-4F7E-995C-64C711E5CAFE}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{63B530F8-29C9-4880-A5B4-B8179096E7B8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{67D07935-283A-4791-8F8D-FA9117F3E6F2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{6A1F2B00-6A90-4C38-95A5-5CAB3B056778}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{7868B0D4-1423-4681-AFDF-27913575441E}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{88CD9180-4491-4640-B571-E3BEE2527943}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{9580D7DD-0379-4658-9870-D5BE7D52D6DE}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{A6BF0DEB-3659-40AD-9F81-E25AF62CE3C7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{AB0D8EF9-866D-4D39-B83F-453F3B8F6325}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{CDEAD503-17F5-4A3E-B7AE-DF8CC2902EB9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{DF271536-4298-45E1-B0F2-E88F78619C5D}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{e6835967-e0d2-41fb-bcec-58387404e25a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\LwtNetLog\{FBCFAC3F-8459-419F-8E48-1F0B49CDB85E}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{0063715b-eeda-4007-9429-ad526f62696e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{11CD958A-C507-4EF3-B3F2-5FD9DFBD2C78}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{30336ed4-e327-447c-9de0-51b652c86108}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{331c3b3a-2005-44c2-ac5e-77220c37d6b4}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{530FB9B9-C515-4472-9313-FB346F9255E3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{75EBC33E-0CC6-49da-8CD9-8903A5222AA0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{75EBC33E-77B8-4ba8-9474-4F4A9DB2F5C6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{75EBC33E-8670-4eb6-B535-3B9D6BB222FD}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{75EBC33E-997F-49cf-B49F-ECC50184B75D}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{75EBC33E-C8AE-4f93-9CA1-683A53E20CB6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{75EBC33E-D017-4D0F-93AB-0B4F86579164}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{B9DA9FE6-AE5F-4f3e-B2FA-8E623C11DC75}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{C553CED4-9BA3-478F-98EA-906CE99C2E4F}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{f0be35f8-237b-4814-86b5-ade51192e503}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatform\{f5dbaa02-15d6-4644-a784-7032d508bf64}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{19E464A4-7408-49BD-B960-53446AE47820}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{19E93940-A1BD-497F-BC58-CA333880BAB4}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{3048407B-56AA-4D41-82B2-7d5F4b1CDD39}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{402E812D-04E6-4E66-ABDB-32E5F79D36A2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{49868e3d-77fb-5083-9e09-61e3f37e0309}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{62A0EB6C-3E3E-471d-960C-7C574A72534C}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{6d5ca4bb-df8e-41bc-b554-8aeab241f206}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{6fb61ac3-3455-4da4-8313-c1a855ee64c5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{836767A6-AF31-4938-B4C0-EF86749A9AEF}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{9558985e-3bc8-45ef-a2fd-2e6ff06fb886}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{99F5F45C-FD1E-439F-A910-20D0DC759D28}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{acf1e4a7-9241-4fbf-9555-c27638434f8d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{B795C7DF-07BC-4362-938E-E8ABD81A9A01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{C9BF4A01-D547-4d11-8242-E03A18B5BE01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{C9BF4A02-D547-4d11-8242-E03A18B5BE01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{C9BF4A03-D547-4d11-8242-E03A18B5BE01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{C9BF4A05-D547-4d11-8242-E03A18B5BE01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{C9BF4A9E-D547-4d11-8242-E03A18B5BE01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SpoolerLogger\{C9BF4A9F-D547-4d11-8242-E03A18B5BE01}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{047FB417-39E6-4B79-A52C-C436B60011AD}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{0BD3506A-9030-4f76-9B88-3E8FE1F7CFB6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{111ffc99-3987-4bf8-8398-61853120cb3d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{1193FF07-26A3-4ECA-9384-12CCF39CAE03}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{21ba7b61-05f8-41f1-9048-c09493dcfe38}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{2D0CC56C-874F-422C-B25F-246F286A24BA}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{314DE49F-CE63-4779-BA2B-D616F6963A88}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{3496b396-5c43-45e7-b38e-d509b79ae721}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{3D42A67D-9CE8-4284-B755-2550672B0CE0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{4D946A46-275B-4C9D-B835-0B2160559256}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{58980F4B-BD39-4a3e-B344-492ED2254A4E}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{5CA18737-22AC-4050-85BC-B8DBB9F7D986}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{681E3481-7510-4053-8C87-A6305EAFC4FA}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{6BE684E4-194C-43B0-B9B8-8269646DE989}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{6eb8db94-fe96-443f-a366-5fe0cee7fb1c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{7D7180B3-A452-4FFF-8D1F-7B32B248AB70}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{802ec45b-1e99-4b83-9920-87c98277ba9d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{814182FF-58F7-11E1-853C-78E7D1CA7337}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{90BBBABB-255B-4FE3-A06F-685A15E93A4C}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{914598a6-28f0-42ac-bf3d-a29c6047a739}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{949D7457-6151-4FA0-9E46-D82A6F9927CF}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{9580d7dd-0379-4658-9870-d5be7d52d6de}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{999AC137-42DC-41D3-BA9D-A325A9E1A986}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{9B322459-4AD9-4F81-8EEA-DC77CDD18CA6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{9B694F87-000E-4BE6-91AC-FE2E50D61A6F}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{9CC0413E-5717-4af5-82EB-6103D8707B45}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{9CC9BEB7-9D24-47C7-8F9D-CCC9DCAC29EB}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{AB0D8EF9-866D-4d39-B83F-453F3B8F6325}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{abe47285-c002-46d1-95e4-c4aec3c78f50}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{B8794785-F7E3-4C2D-A33D-7B0BA0D30E18}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{c02edc8d-d627-46c9-abd9-c8b78f88c223}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{C100BECE-D33A-4A4B-BF23-BBEF4663D017}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{c7491fe4-66f4-4421-9954-b55f03db3186}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{D28262A1-8066-492D-BCE8-635DA75368B7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{E5C16D49-2464-4382-BB20-97A4B5465DB9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession\{e6dec100-4e0f-4927-92be-e69d7c15c821}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{01979c6a-42fa-414c-b8aa-eee2c8202018}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{04268430-d489-424d-b914-0cff741d6684}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{059f0f37-910e-4ff0-a7ee-ae8d49dd319b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{05f02597-fe85-4e67-8542-69567ab8fd4f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{06edcfeb-0fd0-4e53-acca-a6f8bbf81bcb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0b886108-1899-4d3a-9c0d-42d8fc4b9108}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0b9fdccc-451c-449c-9bd8-6756fcc6091a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0bf2fb94-7b60-4b4d-9766-e82f658df540}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0c478c5b-0351-41b1-8c58-4a6737da32e3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0d4fdc09-8c27-494a-bda0-505e4fd8adae}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0f67e49f-fe51-4e9f-b490-6f2948cc6027}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{0fa2ee03-1feb-5057-3bb3-eb25521b8482}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{11c5d8ad-756a-42c2-8087-eb1b4a72a846}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{11cd958a-c507-4ef3-b3f2-5fd9dfbd2c78}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{125f2cf1-2768-4d33-976e-527137d080f8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{15a7a4f8-0072-4eab-abad-f98a4d666aed}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{15ca44ff-4d7a-4baa-bba5-0998955e531e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{199fe037-2b82-40a9-82ac-e1d46c792b99}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{1b562e86-b7aa-4131-badc-b6f3a001407e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{1b6b0772-251b-4d42-917d-faca166bc059}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{1c95126e-7eea-49a9-a3fe-a378b03ddb4d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{1db28f2e-8f80-4027-8c5a-a11f7f10f62d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{1e9a4978-78c2-441e-8858-75b5d1326bc5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{1f678132-5938-4686-9fdc-c8ff68f15c85}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{206f6dea-d3c5-4d10-bc72-989f03c8b84b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{21b7c16e-c5af-4a69-a74a-7245481c1b97}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{2a274310-42d5-4019-b816-e4b8c7abe95c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{2e35aaeb-857f-4beb-a418-2e6c0e54d988}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{2e6cb42e-161d-413b-a6c1-84ca4c1e5890}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{2f07e2ee-15db-40f1-90ef-9d7ba282188a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{2ff3e6b7-cb90-4700-9621-443f389734ed}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{306c4e0b-e148-543d-315b-c618eb93157c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{30e1d284-5d88-459c-83fd-6345b39b19ec}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{331c3b3a-2005-44c2-ac5e-77220c37d6b4}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{355c44fe-0c8e-4bf8-be28-8bc7b5a42720}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{3629dd4d-d6f1-4302-a623-0768b51501c7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{36c23e18-0e66-11d9-bbeb-505054503030}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{3903d5b9-988d-4c31-9ccd-4022f96703f0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{3cb2a168-fe19-4a4e-bdad-dcf422f13473}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{3e59a529-b0b3-4a11-8129-9ffe6bb46eb9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{3f471139-acb7-4a01-b7a7-ff5da4ba2d43}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{3ff37a1c-a68d-4d6e-8c9b-f79e8b16c482}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{40783728-8921-45d0-b231-919037b4b4fd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{412bdff2-a8c4-470d-8f33-63fe0d8c20e2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{43e63da5-41d1-4fbf-aded-1bbed98fdd1d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{45eec9e5-4a1b-5446-7ad8-a4ab1313c437}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{46c78e5c-a213-46a8-8a6b-622f6916201d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{47bc9477-a8ba-452e-b951-4f2ed3593cf9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{47bfa2b7-bd54-4fac-b70b-29021084ca8f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{494e7a3d-8db9-4ec4-b43e-2844af6e38d6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{4af188ac-e9c4-4c11-b07b-1fabc07dfeb2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{4cb314df-c11f-47d7-9c04-65fb0051561b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{4cec9c95-a65f-4591-b5c4-30100e51d870}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{4ee76bd8-3cf4-44a0-a0ac-3937643e37a3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{52fc89f8-995e-434c-a91e-199986449890}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{530fb9b9-c515-4472-9313-fb346f9255e3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{538cbbad-4877-4eb2-b26e-7caee8f0f8cb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{54cb22ff-26b4-4393-a8c2-6b0715912c5f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{555908d1-a6d7-4695-8e1e-26931d2012f4}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{55ab77f6-fa04-43ef-af45-688fbf500482}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{595f7f52-c90a-4026-a125-8eb5e083f15e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{5d674230-ca9f-11da-a94d-0800200c9a66}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{5d896912-022d-40aa-a3a8-4fa5515c76d7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{5f92bc59-248f-4111-86a9-e393e12c6139}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{62de9e48-90c6-4755-8813-6a7d655b0802}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{632f767e-0ec3-47b9-ba1c-a0e62a74728a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{63d1e632-95cc-4443-9312-af927761d52a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{64ef2b1c-4ae1-4e64-8599-1636e441ec88}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{651df93b-5053-4d1e-94c5-f6e6d25908d0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{66a5c15c-4f8e-4044-bf6e-71d896038977}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{67fe2216-727a-40cb-94b2-c02211edb34a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{6a1f2b00-6a90-4c38-95a5-5cab3b056778}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{6b93bf66-a922-4c11-a617-cf60d95c133d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{6bba3851-2c7e-4dea-8f54-31e5afd029e3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{7237fff9-a08a-4804-9c79-4a8704b70b87}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{72cd9ff7-4af8-4b89-aede-5f26fda13567}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{73a33ab2-1966-4999-8add-868c41415269}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{73e9c9de-a148-41f7-b1db-4da051fdc327}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{74c2135f-cc76-45c3-879a-ef3bb1eeaf86}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{75ebc33e-997f-49cf-b49f-ecc50184b75d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{7725b5f9-1f2e-4e21-baeb-b2af4690bc87}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{7b563579-53c8-44e7-8236-0f87b9fe6594}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{7b6bc78c-898b-4170-bbf8-1a469ea43fc5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{7d5387b0-cbe0-11da-a94d-0800200c9a66}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{7da4fe0e-fd42-4708-9aa5-89b77a224885}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{85a62a0d-7e17-485f-9d4f-749a287193a6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{89203471-d554-47d4-bde4-7552ec219999}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{89592015-d996-4636-8f61-066b5d4dd739}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{89fe8f40-cdce-464e-8217-15ef97d4c7c3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{8c416c79-d49b-4f01-a467-e56d3aa8234c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{8e6a5303-a4ce-498f-afdb-e03a8a82b077}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{945a8954-c147-4acd-923f-40c45405a658}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{951b41ea-c830-44dc-a671-e2c9958809b8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{95353826-4fbe-41d4-9c42-f521c6e86360}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{9580d7dd-0379-4658-9870-d5be7d52d6de}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{96f4a050-7e31-453c-88be-9634f4e02139}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{9741fd4e-3757-479f-a3c6-fc49f6d5edd0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{988c59c5-0a1c-45b6-a555-0c62276e327d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{991f8fe6-249d-44d6-b93d-5a3060c1dedb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{9988748e-c2e8-4054-85f6-0c3e1cad2470}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{9c205a39-1250-487d-abd7-e831c6290539}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{9f650c63-9409-453c-a652-83d7185a2e83}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{9f7b5df4-b902-48bc-bc94-95068c6c7d26}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a0e3d8ea-c34f-4419-a1db-90435b8b21d0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a4445c76-ed85-c8a3-02c1-532a38614a9e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a67075c2-3e39-4109-b6cd-6d750058a731}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a68ca8b7-004f-d7b6-a698-07e2de0f1f5d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a6ad76e3-867a-4635-91b3-4904ba6374d7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a7f2235f-be51-51ed-decf-f4498812a9a2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{a8a1f2f6-a13a-45e9-b1fe-3419569e5ef2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{aa3aa23b-bb6d-425a-b58c-1d7e37f5d02a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{abf1f586-2e50-4ba8-928d-49044e6f0db7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ac43300d-5fcc-4800-8e99-1bd3f85f0320}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ac52ad17-cc01-4f85-8df5-4dce4333c99b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ad5162d8-daf0-4a25-88a7-01cbeb33902e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ae4bd3be-f36f-45b6-8d21-bdd6fb832853}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{aea1b4fa-97d1-45f2-a64c-4d69fffd92c9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{aec5c129-7c10-407d-be97-91a042c61aaa}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{b0aa8734-56f7-41cc-b2f4-de228e98b946}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{b2fcd41f-9a40-4150-8c92-b224b7d8c8aa}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{b675ec37-bdb6-4648-bc92-f3fdc74d3ca2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{b977cf02-76f6-df84-cc1a-6a4b232322b6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{b99317e5-89b7-4c0d-abd1-6e705f7912dc}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ba093605-3909-4345-990b-26b746adee0a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ba2ffb5c-e20a-4fb9-91b4-45f61b4b66a0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{babda89a-4d5e-48eb-af3d-e0e8410207c0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{bc0669e1-a10d-4a78-834e-1ca3c806c93b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c02afc2b-e24e-4449-ad76-bcc2c2575ead}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c03715ce-ea6f-5b67-4449-da1d1e1afeb8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c18672d1-dc18-4dfd-91e4-170cf37160cf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c26c4f3c-3f66-4e99-8f8a-39405cfed220}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c4636a1e-7986-4646-bf10-7bc3b4a76e8e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c76baa63-ae81-421c-b425-340b4b24157f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{c914f0df-835a-4a22-8c70-732c9a80c634}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{cb017cd2-1f37-4e65-82bc-3e91f6a37559}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{cbda4dbf-8d5d-4f69-9578-be14aa540d22}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{cd9c6198-bf73-4106-803b-c17d26559018}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{cdc05e28-c449-49c6-b9d2-88cf761644df}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{cdead503-17f5-4a3e-b7ae-df8cc2902eb9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ce8dee0b-d539-4000-b0f8-77bed049c590}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{cfc18ec0-96b1-4eba-961b-622caee05b0a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{d0e22efc-ac66-4b25-a72d-382736b5e940}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{d1bc9aff-2abf-4d71-9146-ecb2a986eb85}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{d48ce617-33a2-4bc3-a5c7-11aa4f29619e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{d5c25f9a-4d47-493e-9184-40dd397a004d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{d6f68875-cdf5-43a5-a3e3-53ffd683311c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{dbe9b383-7cf3-4331-91cc-a3cb16a3b538}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{dd70bc80-ef44-421b-8ac3-cd31da613a4e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{de29cf61-5ee6-43ff-9aac-959c4e13cc6c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{de7b24ea-73c8-4a09-985d-5bdadcfa9017}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{dea07764-0790-44de-b9c4-49677b17174f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e104fb41-6b04-4f3a-b47d-f0df2f02b954}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e2816346-87f4-4f85-95c3-0c79409aa89d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e3bac9f8-27be-4823-8d7f-1cc320c05fa7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e4480490-85b6-11dd-ad8b-0800200c9a66}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e4f68870-5ae8-4e5b-9ce7-ca9ed75b0245}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e595f735-b42a-494b-afcd-b68666945cd3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e5ba83f6-07d0-46b1-8bc7-7e669a1d31dc}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e670a5a2-ce74-4ab4-9347-61b815319f4c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{e8f9af91-afbe-5a03-dfec-5d591686326c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ea216962-877b-5b73-f7c5-8aef5375959e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{eee173ef-7ed2-45de-9877-01c70a852fbd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{ef1cc15b-46c1-414e-bb95-e76b077bd51e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f029ac39-38f0-4a40-b7de-404d244004cb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f2e2ce31-0e8a-4e46-a03b-2e0fe97e93c2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f3c5e28e-63f6-49c7-a204-e48a1bc4b09d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f5d05b38-80a6-4653-825d-c414e4ab3c68}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f708c483-4880-11e6-9121-5cf37068b67b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f717d024-f5b4-4f03-9ab9-331b2dc38ffb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{f9fe3908-44b8-48d9-9a32-5a763ff5ed79}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{fae10392-f0af-4ac0-b8ff-9f4d920c3cdf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{fc4e8f51-7a04-4bab-8b91-6321416f72ab}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{fc65ddd8-d6ef-4962-83d5-6e5cfe9ce148}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-System\{fcbb06bb-6a2a-46e3-abaa-246cb4e508b2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{01090065-b467-4503-9b28-533766761087}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{06edcfeb-0fd0-4e53-acca-a6f8bbf81bcb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{08466062-aed4-4834-8b04-cddb414504e5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{0888e5ef-9b98-4695-979d-e92ce4247224}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{09608c12-c1da-4104-a6fe-b959cf57560a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{09ac07b9-6ac9-43bc-a50f-58419a797c69}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{09ec9687-d7ad-40ca-9c5e-78a04a5ae993}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{0dd4d48e-2bbf-452f-a7ec-ba3dba8407ae}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{0ff1c24b-7f05-45c0-abdc-3c8521be4f62}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{10a208dd-a372-421c-9d99-4fad6db68b62}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1139c61b-b549-4251-8ed3-27250a1edec8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{11a75546-3234-465e-bec8-2d301cb501ac}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{126cdb97-d346-4894-8a34-658da5eea1b6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{134ea407-755d-4a93-b8a6-f290cd155023}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{13bc4371-4e21-4e46-a84f-8c0ffb548ced}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1418ef04-b0b4-4623-bf7e-d74ab47bbdaa}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{15a7a4f8-0072-4eab-abad-f98a4d666aed}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1b8b402d-78dc-46fb-bf71-46e64aedf165}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1bda2ab1-bbc1-4acb-a849-c0ef2b249672}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1db28f2e-8f80-4027-8c5a-a11f7f10f62d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1ed6976a-4171-4764-b415-7ea08bc46c51}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{1edeee53-0afe-4609-b846-d8c0b2075b1f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{21d79db0-8e03-41cd-9589-f3ef7001a92a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{23b8d46b-67dd-40a3-b636-d43e50552c6d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{27a8c1e2-eb19-463e-8424-b399df27a216}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{287d59b6-79ba-4741-a08b-2fedeede6435}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{28aa95bb-d444-4719-a36f-40462168127e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{28e25b07-c47f-473d-8b24-2e171cca808a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{2a45d52e-bbf3-4843-8e18-b356ed5f6a65}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{2a576b87-09a7-520e-c21a-4942f0271d67}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{2cd58181-0bb6-463e-828a-056ff837f966}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{2d318b91-e6e7-4c46-bd04-bfe6db412cf9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{2ed299d2-2f6b-411d-8d15-f4cc6fde0c70}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{2f94e1cc-a8c5-4fe7-a1c3-53d7bda8e73e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{30336ed4-e327-447c-9de0-51b652c86108}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{314de49f-ce63-4779-ba2b-d616f6963a88}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{315a8872-923e-4ea2-9889-33cd4754bf64}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{319122a9-1485-4e48-af35-7db2d93b8ad2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{32254f6c-aa33-46f0-a5e3-1cbcc74bf683}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3527cb55-1298-49d4-ab94-1243db0fcaff}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3663a992-84be-40ea-bba9-90c7ed544222}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{36c23e18-0e66-11d9-bbeb-505054503030}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3a5bef13-d0f7-4e7f-9ec8-5e707df711d0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3a718a68-6974-4075-abd3-e8243caef398}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3aa52b8b-6357-4c18-a92e-b53fb177853b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3ae1ea61-c002-47fb-b06c-4022a8c98929}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3c088e51-65be-40d1-9b90-62bfec076737}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3cb40aaa-1145-4fb8-b27b-7e30f0454316}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3cc2d4af-da5e-4ed4-bcbe-3cf995940483}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3d42a67d-9ce8-4284-b755-2550672b0ce0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3da494e4-0fe2-415c-b895-fb5265c5c83b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{3f471139-acb7-4a01-b7a7-ff5da4ba2d43}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{40ab57c2-1c53-4df9-9324-ff7cf898a02c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{41862974-da3b-4f0b-97d5-bb29fbb9b71e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{442c11c5-304b-45a4-ae73-dc2194c4e876}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{46098845-8a94-442d-9095-366a6bcfefa9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{4a104570-ec6d-4560-a40f-858fa955e84f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{4a933674-fb3d-4e8d-b01d-17ee14e91a3e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{4cb314df-c11f-47d7-9c04-65fb0051561b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{4de9bc9c-b27a-43c9-8994-0915f1a5e24f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{4eacb4d0-263b-4b93-8cd6-778a278e5642}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{50df9e12-a8c4-4939-b281-47e1325ba63e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{50f99b2d-96d2-421f-be4c-222c4140da9f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{530fb9b9-c515-4472-9313-fb346f9255e3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5402e5ea-1bdd-4390-82be-e108f1e634f5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{54164045-7c50-4905-963f-e5bc1eef0cca}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{57003e21-269b-4bdc-8434-b3bf8d57d2d5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{579402a2-883c-45d8-b70a-9bc856407751}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{58980f4b-bd39-4a3e-b344-492ed2254a4e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{595f33ea-d4af-4f4d-b4dd-9dacdd17fc6e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5b0a651a-8807-45cc-9656-7579815b6af0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5b5ab841-7d2e-4a95-bb4f-095cdf66d8f0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5bbca4a8-b209-48dc-a8c7-b23d3e5216fb}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5d674230-ca9f-11da-a94d-0800200c9a66}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5d896912-022d-40aa-a3a8-4fa5515c76d7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5ec13d8e-4b3f-422e-a7e7-3121a1d90c7a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{5f0e257f-c224-43e5-9555-2adcb8540a58}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{63b530f8-29c9-4880-a5b4-b8179096e7b8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{63d2bb1d-e39a-41b8-9a3d-52dd06677588}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6489b27f-7c43-5886-1d00-0a61bb2a375b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{64a98c25-9e00-404e-84ad-6700dfe02529}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{64ef2b1c-4ae1-4e64-8599-1636e441ec88}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{66a5c15c-4f8e-4044-bf6e-71d896038977}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{67d07935-283a-4791-8f8d-fa9117f3e6f2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{699e309c-e782-4400-98c8-e21d162d7b7b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{69c8ca7e-1adf-472b-ba4c-a0485986b9f6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6a1f2b00-6a90-4c38-95a5-5cab3b056778}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6b1ffe48-5b1e-4793-9f7f-ae926454499d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6d7662a9-034e-4b1f-a167-67819c401632}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6d8a3a60-40af-445a-98ca-99359e500146}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6df57621-e7e4-410f-a7e9-e43eeb61b11f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6e400999-5b82-475f-b800-cef6fe361539}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{6eb8db94-fe96-443f-a366-5fe0cee7fb1c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{712abb2d-d806-4b42-9682-26da01d8b307}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{72561cf0-c85c-4f78-9e8d-cba9093df62d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{728b02d9-bf21-49f6-be3f-91bc06f7467e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{72d211e1-4c54-4a93-9520-4901681b2271}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{73370bd6-85e5-430b-b60a-fea1285808a7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{741bb90c-a7a3-49d6-bd82-1e6b858403f7}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{741fc222-44ed-4ba7-98e3-f405b2d2c4b4}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{747ef6fd-e535-4d16-b510-42c90f6873a1}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-0870-49e5-bdce-9d7028279489}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-0936-4a55-9d26-5f298f3180bf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-0cc6-49da-8cd9-8903a5222aa0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-77b8-4ba8-9474-4f4a9db2f5c6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-8670-4eb6-b535-3b9d6bb222fd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-997f-49cf-b49f-ecc50184b75d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{75ebc33e-c8ae-4f93-9ca1-683a53e20cb6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{76ab12d5-c986-4e60-9d7c-2a092b284cdd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{770ca594-b467-4811-b355-28f5e5706987}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{777ba8fe-2498-4875-933a-3067de883070}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{7d29d58a-931a-40ac-8743-48c733045548}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{7d7b0c39-93f6-4100-bd96-4dda859652c5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{7e58e69a-e361-4f06-b880-ad2f4b64c944}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{7e87506f-bace-4bf1-bc09-3a1f37045c71}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{7eafcf79-06a7-460b-8a55-bd0a0c9248aa}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{8127f6d4-59f9-4abf-8952-3e3a02073d5f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{83d6e83b-900b-48a3-9835-57656b6f6474}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{8530db6e-51c0-43d6-9d02-a8c2088526cd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{85a62a0d-7e17-485f-9d4f-749a287193a6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{85be49ea-38f1-4547-a604-80060202fb27}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{85fe7609-ff4a-48e9-9d50-12918e43e1da}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{88c09888-118d-48fc-8863-e1c6d39ca4df}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{88cd9180-4491-4640-b571-e3bee2527943}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{8939299f-2315-4c5c-9b91-abb86aa0627d}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{89592015-d996-4636-8f61-066b5d4dd739}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{89a2278b-c662-4aff-a06c-46ad3f220bca}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{89b1e9f0-5aff-44a6-9b44-0a07a7ce5845}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{8bcdf442-3070-4118-8c94-e8843be363b3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{8ce93926-bdae-4409-9155-2fe4799ef4d3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{906b8a99-63ce-58d7-86ab-10989bbd5567}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{91f5fb12-fdea-4095-85d5-614b495cd9de}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9213c3e1-0d6c-52dd-78ea-f3b082111406}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9363ccd9-d429-4452-9adb-2501e704b810}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{93a19ab3-fb2c-46eb-91ef-56b0a318b983}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{952773bf-c2b7-49bc-88f4-920744b82c43}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{95353826-4fbe-41d4-9c42-f521c6e86360}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9580d7dd-0379-4658-9870-d5be7d52d6de}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{968f313b-097f-4e09-9cdd-bc62692d138b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{96f4a050-7e31-453c-88be-9634f4e02139}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{973143dd-f3c7-4ef5-b156-544ac38c39b6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{97ca8142-10b1-4baa-9fbb-70a7d11231c3}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9803daa0-81ba-483a-986c-f0e395b9f8d1}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{98bf1cd3-583e-4926-95ee-a61bf3f46470}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{98e0765d-8c42-44a3-a57b-760d7f93225a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9c2a37f3-e5fd-5cae-bcd1-43dafeee1ff0}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9cc0413e-5717-4af5-82eb-6103d8707b45}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9d55b53d-449b-4824-a637-24f9d69aa02f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9f973c1d-d056-4e38-84a5-7be81cdd6ab6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{9fc66dd7-98c7-4b83-8293-46a18439b03b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{a0c1853b-5c40-4b15-8766-3cf1c58f985a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{a615acb9-d5a4-4738-b561-1df301d207f8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{a7975c8f-ac13-49f1-87da-5a984a4ab417}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{a83fa99f-c356-4ded-9fd6-5a5eb8546d68}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{a9c11050-9e93-4fa4-8fe0-7c4750a345b2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{aa4c798d-d91b-4b07-a013-787f5803d6fc}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{aabf8b86-7936-4fa2-acb0-63127f879dbf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{aaeac398-3028-487c-9586-44eacad03637}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{aaf67066-0bf8-469f-ab76-275590c434ee}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{add0de40-32b0-4b58-9d5e-938b2f5c1d1f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ae4bd3be-f36f-45b6-8d21-bdd6fb832853}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{af0a5a6d-e009-46d4-8867-42f2240f8a72}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b059b83f-d946-4b13-87ca-4292839dc2f2}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b2fcd41f-9a40-4150-8c92-b224b7d8c8aa}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b447b4db-7780-11e0-ada3-18a90531a85a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b447b4de-7780-11e0-ada3-18a90531a85a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b447b4df-7780-11e0-ada3-18a90531a85a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b447b4e1-7780-11e0-ada3-18a90531a85a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b6cc0d55-9ecc-49a8-b929-2b9022426f2a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b6d775ef-1436-4fe6-bad3-9e436319e218}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b92cf7fd-dc10-4c6b-a72d-1613bf25e597}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b977cf02-76f6-df84-cc1a-6a4b232322b6}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{b9da9fe6-ae5f-4f3e-b2fa-8e623c11dc75}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ba093605-3909-4345-990b-26b746adee0a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ba723d81-0d0c-4f1e-80c8-54740f508ddf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{bd12f3b8-fc40-4a61-a307-b7a013a069c1}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{bea18b89-126f-4155-9ee4-d36038b02680}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{bf406804-6afa-46e7-8a48-6c357e1d6d61}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{bff15e13-81bf-45ee-8b16-7cfead00da86}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{c2f36562-a1e4-4bc3-a6f6-01a7adb643e8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{c4efc9bb-2570-4821-8923-1bad317d2d4b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{c651f5f6-1c0d-492e-8ae1-b4efd7c9d503}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{c6bf6832-f7bd-4151-ac21-753ce4707453}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{c76baa63-ae81-421c-b425-340b4b24157f}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{c9bdb4eb-9287-4c8e-8378-6896f0d1c5ef}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{cab2b8a5-49b9-4eec-b1b0-fac21da05a3b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{cb070027-1534-4cf3-98ea-b9751f508376}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{cbda4dbf-8d5d-4f69-9578-be14aa540d22}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{cd7cf0d0-02cc-4872-9b65-0dba0a90efe8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{cf3f502e-b40d-4071-996f-00981edf938e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d0e22efc-ac66-4b25-a72d-382736b5e940}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d1bc9aff-2abf-4d71-9146-ecb2a986eb85}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d2e990da-8504-4702-a5e5-367fc2f823bf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d39b6336-cfcb-483b-8c76-7c3e7d02bcb8}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d3f29eda-805d-428a-9902-b259b937f84b}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d710d46c-235d-4798-ac20-9f83e1dcd557}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{d8965fcf-7397-4e0e-b750-21a4580bd880}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{dab3b18c-3c0f-43e8-80b1-e44bc0dad901}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{db00dfb6-29f9-4a9c-9b3b-1f4f9e7d9770}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{dbe9b383-7cf3-4331-91cc-a3cb16a3b538}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{dcbe5aaa-16e2-457c-9337-366950045f0a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{de095dbe-8667-4168-94c2-48ca61665aca}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{de513a55-c345-438b-9a74-e18cac5c5cc5}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{de7b24ea-73c8-4a09-985d-5bdadcfa9017}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e0c6f6de-258a-50e0-ac1a-103482d118bc}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e1dd7e52-621d-44e3-a1ad-0370c2b25946}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e4d53f84-7de3-11d8-9435-505054503030}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e4f68870-5ae8-4e5b-9ce7-ca9ed75b0245}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e53df8ba-367a-4406-98d5-709ffb169681}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e5c16d49-2464-4382-bb20-97a4b5465db9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e6307a09-292c-497e-aad6-498f68e2b619}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e6835967-e0d2-41fb-bcec-58387404e25a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{e7558269-3fa5-46ed-9f4d-3c6e282dde55}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ea8cd8a5-78ff-4418-b292-aadc6a7181df}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ec23f986-ae2d-4269-b52f-4e20765c1a94}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ed8b9bd3-f66e-4ff2-b86b-75c7925f72a9}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{eef54e71-0661-422d-9a98-82fd4940b820}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f0be35f8-237b-4814-86b5-ade51192e503}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f0db7ef8-b6f3-4005-9937-feb77b9e1b43}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f1201b5a-e170-42b6-8d20-b57ac57e6416}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f1394de0-32c7-4a76-a6de-b245e48f4615}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f1ef270a-0d32-4352-ba52-dbab41e1d859}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f2311b48-32be-4902-a22a-7240371dbb2c}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f3f53c76-b06d-4f15-b412-61164a0d2b73}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f43c3c35-22e2-53eb-f169-07594054779e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f4aed7c7-a898-4627-b053-44a7caa12fcd}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f5dbaa02-15d6-4644-a784-7032d508bf64}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f82fb576-e941-4956-a2c7-a0cf83f6450a}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f8ad09ba-419c-5134-1750-270f4d0fb889}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{f9fe3908-44b8-48d9-9a32-5a763ff5ed79}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{fa773482-f6ed-4895-8a7d-4f5850678e59}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{fae10392-f0af-4ac0-b8ff-9f4d920c3cdf}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{fae96d09-ade1-5223-0098-af7b67348531}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{fb829150-cd7d-44c3-af5b-711a3c31cedc}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{fbcfac3f-8459-419f-8e48-1f0b49cdb85e}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{fc65ddd8-d6ef-4962-83d5-6e5cfe9ce148}" /v "Enabled" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\EventLog-Application\{ff79a477-c45f-4a52-8ae0-2b324346d4e4}" /v "Enabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Flags" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\Control Panel\Keyboard" /v "KeyboardDelay" /t REG_SZ /d "0" /f 
Reg.exe add "HKCU\Control Panel\Keyboard" /v "InitialKeyboardIndicators" /t REG_SZ /d "0" /f 
Reg.exe add "HKCU\Control Panel\Keyboard" /v "KeyboardSpeed" /t REG_SZ /d "31" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "DelayBeforeAcceptance" /t REG_SZ /d "0" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last BounceKey Setting" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last Valid Delay" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last Valid Repeat" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last Valid Wait" /t REG_DWORD /d "0" /f 
echo Todas as otimizações foram aplicadas com sucesso.
del /f /s /q %systemdrive%\*.etl
del /f /s /q %systemdrive%\*.log
del /f /s /q %systemdrive%\*.tmp
del /f /s /q %systemdrive%\*.old
del /f /s /q %systemdrive%\*.bak
del /f /s /q %systemdrive%\*.bac
del /f /s /q %systemdrive%\*.bup
del /f /s /q %systemdrive%\*.chk
del /f /s /q %systemdrive%\*.dmp
del /f /s /q %systemdrive%\*.temp
RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 8
RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 16384
RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 2
REM Aumenta a quantidade de threads do Explorer
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "TaskbarSi" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Msahci" /v "Start" /t REG_DWORD /d 0 /f
REM Desabilita a Indexação de Arquivos
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Search" /v "SetupCompletedSuccessfully" /t REG_DWORD /d 0 /f
REM Aumenta o tempo de resposta do Explorer
reg add "HKEY_CURRENT_USER\Control Panel\Desktop" /v "MenuShowDelay" /t REG_SZ /d "0" /f
REM Desabilita o agrupamento de tarefas na barra de tarefas
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "TaskbarGlomming" /t REG_DWORD /d 0 /f
REM Desabilita a pré-visualização de arquivos
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v "NoPreviewHandler" /t REG_DWORD /d 1 /f
REM Desabilita a compactação de arquivos no Explorer
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\Dwm" /v "OverlayTestMode" /t REG_DWORD /d 5 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\PolicyManager\default\ApplicationManagement\AllowGameDVR" /v "value" /t REG_DWORD /d 0 /f
reg add "HKEY_CURRENT_USER\System\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d 0 /f
:: Desativar o Controlador de Energia
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power" /v "CsEnabled" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power" /v "PowerThrottlingOff" /t REG_DWORD /d 1 /f
:: Configurar o Valor Máximo e Mínimo para ResponsivenessBoost
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\0c7bcd88-64b0-4b40-8b8f-53f0b1642ce8" /v "ValueMax" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\0c7bcd88-64b0-4b40-8b8f-53f0b1642ce8" /v "ValueMin" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\4d36e96c-e325-11ce-bfc1-08002be10318\D502DB14-18E7-4C8A-BFE1-11B45988709A" /v "ValueMax" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\4d36e96c-e325-11ce-bfc1-08002be10318\D502DB14-18E7-4C8A-BFE1-11B45988709A" /v "ValueMin" /t REG_DWORD /d 0 /f
echo Melhorando a velocidade da internet e desempenho do sistema...
:: Desativar a limitação de largura de banda reservada
echo Desativando a limitação de largura de banda reservada...
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Psched" /v NonBestEffortLimit /t REG_DWORD /d 0 /f
:: Desativar a indexação de rede
echo Desativando a indexação de rede...
sc config wsearch start= disabled
net stop wsearch
:: Aumentar o limite de conexões simultâneas
echo Aumentando o limite de conexões simultâneas...
:: Desativar o NetBIOS sobre TCP/IP
echo Desativando o NetBIOS sobre TCP/IP...
:: Ajustar o MTU (Maximum Transmission Unit)
echo Ajustando o MTU...
netsh interface ipv4 set subinterface "Ethernet" mtu=1500 store=persistent
:: Ativar o QoS (Quality of Service)
echo Ativando o QoS...
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Psched" /v NonBestEffortLimit /t REG_DWORD /d 1 /f
:: Desativar o Algoritmo de Nagle
echo Desativando o Algoritmo de Nagle...
for /F "tokens=*" %%i in ('netsh interface ipv4 show interfaces ^| findstr "Index"') do set "index=%%i"
set "index=%index:~-1%"
:: Aumentar o tamanho do buffer de recepção
echo Aumentando o tamanho do buffer de recepção...
reg add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v DefaultReceiveWindow /t REG_DWORD /d 65535 /f
:: Ajustar a largura de banda do sistema
echo Ajustando a largura de banda do sistema...
:: Ajustar a priorização de pacotes
echo Ajustando a priorização de pacotes...
:: Habilitar ajustes de TCP para alta performance
echo Habilitando ajustes de TCP para alta performance...
:: Desativar a detecção de janela limitada
echo Desativando a detecção de janela limitada...
netsh interface ip set dns name="Ethernet" source=static addr=8.8.8.8 register=PRIMARY
netsh interface ip add dns name="Ethernet" addr=8.8.4.4 index=2
:: Configurações adicionais de TCP
echo Aplicando configurações adicionais de TCP...
:: Ajustar a prioridade de redes sem fio
echo Ajustando a prioridade de redes sem fio...
:: Desativar o Large Send Offload (LSO)
echo Desativando o Large Send Offload (LSO)...
:: Ajustar o TCP Initial RTO
echo Ajustando o TCP Initial RTO...
:: Ajustar o TCP Max SYN Retransmissions
echo Ajustando o TCP Max SYN Retransmissions...
:: Ajustar o TCP FIN Timeout
echo Ajustando o TCP FIN Timeout...
:: Ajustar o TCP Window Size
echo Ajustando o TCP Window Size...
:: Desativar a fragmentação de IP
echo Desativando a fragmentação de IP...
:: Ajustar a prioridade de execução de tarefas de rede
echo Ajustando a prioridade de execução de tarefas de rede...
:: Melhorar o desempenho de DPC (Deferred Procedure Call)
echo Melhorando o desempenho de DPC...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v IoPageLockLimit /t REG_DWORD /d 4000 /f
echo Otimizando o registro para jogos e desempenho ultra...
:: Desativar a Indexação de Arquivos para melhorar a performance
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Search" /v "DisableBackoff" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Search" /v "EnableAutoUpdate" /t REG_DWORD /d 0 /f
:: Ajustar a prioridade do sistema para jogos
:: Aumentar o tempo limite do processo do Windows
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "PagedPoolSize" /t REG_DWORD /d 0xFFFFFFFF /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "NonPagedPoolSize" /t REG_DWORD /d 0xFFFFFFFF /f
:: Desativar o armazenamento de energia
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power" /v "PowerSettings" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\lmhosts" /v "Start" /t REG_DWORD /d 4 /f
:: Melhorar o desempenho da rede
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Intel\GFX\GFXSettings" /v "Gaming" /t REG_DWORD /d 1 /f
:: Desativar Relatórios e Erros do Windows
sc config "WerSvc" start= disabled
sc stop "WerSvc"
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\Windows Error Reporting" /v "Disabled" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps" /v "DumpType" /t REG_DWORD /d 0 /f
:: Desativar Serviços de Diagnóstico
sc config "DiagTrack" start= disabled
sc stop "DiagTrack"
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Servicing" /v "NoAutoStart" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Microsoft\Windows\CloudContent" /v "DisableWindowsConsumerFeatures" /t REG_DWORD /d 1 /f
:: Desativar Serviço de Compatibilidade

reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" /v "AUOptions" /t REG_DWORD /d 1 /f
:: Desativar Serviços de Restauração do Sistema
sc config "srservice" start= disabled
sc stop "srservice"
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SPP\Clients" /v "ClientDisable" /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v NoNetCrawling /t REG_DWORD /d 1 /f
:: Define o caminho da chave do registro
set "regPath=HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\WindowsRuntime\ActivatableClassId\Windows.Gaming.GameBar.PresenceServer.Internal.PresenceWriter"
:: Tenta definir o valor ActivationType para 0
echo Alterando o valor de ActivationType para 0...
reg add "%regPath%" /v ActivationType /t REG_DWORD /d 0 /f
:: Verifica se o comando teve sucesso
if %errorLevel% == 0 (
    echo O valor de ActivationType foi definido para 0 com sucesso.
) else (
    echo Falha ao alterar o valor de ActivationType. Verifique se você tem permissões de administrador.
)
:: Pausa para visualizar a mensagem
Fsutil behavior query memoryusage
Fsutil behavior set memoryusage 2
:: Script para otimização de desempenho no Windows para jogos
:: Desativar tarefas desnecessárias e ajustar prioridades de sistema
:: Definir alta prioridade para processos em primeiro plano
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f
:: Desativar algoritmo de congestionamento TCP para reduzir latência de rede (se ainda não estiver ajustado)
netsh int tcp set global congestionprovider=none
:: Ajustar prioridades de energia para alto desempenho
:: Aumentar taxa de atualização de timer de núcleo do sistema
:: Desativar mitigação de Spectre e Meltdown para desempenho adicional
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v FeatureSettingsOverride /t REG_DWORD /d 3 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v FeatureSettingsOverrideMask /t REG_DWORD /d 3 /f
:: Ajustar configuração de latência para priorizar resposta de rede
:: Ajustar a prioridade de rede para jogos
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\MSMQ\Parameters" /v DisableTOSBit /t REG_DWORD /d 1 /f
:: Aumentar buffer de entrada/saída para otimizar leitura/escrita
:: Desativar Prefetcher e Superfetch (SysMain) – se não estiver desativado
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v EnablePrefetcher /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v EnableSuperfetch /t REG_DWORD /d 0 /f
:: Definir a execução do timer de núcleo em tempo real
bcdedit /set useplatformclock true
:: Ajustar taxa de intermitência do cursor para melhorar responsividade
reg add "HKEY_CURRENT_USER\Control Panel\Desktop" /v CursorBlinkRate /t REG_SZ /d 200 /f
:: Otimizar opções de energia para reduzir throttling
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power" /v CsEnabled /t REG_DWORD /d 0 /f
:: Desativar a desfragmentação do layout de boot para reduzir uso de disco
:: ========================
:: Título e descrição
title Otimização de Gargalos - CS2, Mu Online, YouTube e Desempenho Geral
echo ========================
echo Otimizando sistema para reduzir gargalos e travadas...
bcdedit /deletevalue useplatformclock
:: Aumentar a prioridade de tempo real para o driver de áudio (reduz travadas no som)
wmic process where name="audiodg.exe" CALL setpriority 13
:: ===========================================
:: Sessão: Ajustes de Rede e Internet
echo Ajustando configurações de rede para otimização de latência e desempenho...
:: Configurar MTU para otimizar a largura de banda
netsh interface ipv4 set subinterface "Ethernet" mtu=1452 store=persistent
netsh interface tcp set global timestamps=disabled
:: Desabilitar o algoritmo de Nagle (Reduzir latência)
:: Otimizar tempo de resposta de rede
netsh int tcp set global ecncapability=disabled
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters" /v "EnableSecuritySignature" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters" /v "EnablePlainTextPassword" /t REG_DWORD /d 1 /f
:: Reiniciar o serviço de rede
net stop "LanmanWorkstation" & net start "LanmanWorkstation"
REM Limpar histórico de navegação no Explorer para reduzir delays
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\RunMRU" /f
REM Definir permissões para a pasta do cache de miniaturas
icacls "%LocalAppData%\Microsoft\Windows\Explorer" /grant %username%:F /t /c
:: Desativar o gerenciamento de energia para performance máxima
powercfg -setactive SCHEME_MAX

reg add "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting" /v "Disable" /t REG_DWORD /d 1 /f
:: Aumentar o desempenho do armazenamento
reg add "HKLM\SYSTEM\CurrentControlSet\Services\storahci\Parameters\Device" /v "TreatAsInternalDevice" /t REG_DWORD /d 1 /f
:: Desativar a verificação automática do driver
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Device Manager" /v "DisableDriverUpdates" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "LatencySensitivity" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\MSMQ\Parameters" /v "TCPNoDelay" /t REG_DWORD /d 1 /f

:: Otimização para placas NVIDIA

:: Ativar o modo de desempenho máximo na placa NVIDIA
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler" /v "GpuPowerManagement" /t REG_DWORD /d 0 /f

:: Desativar throttling da GPU para máximo desempenho
reg add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm\FTS" /v "EnableTurboMode" /t REG_DWORD /d 1 /f

:: Aumentar a prioridade de renderização da GPU NVIDIA
reg add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm" /v "RenderQueueSize" /t REG_DWORD /d 10 /f

:: Reduzir latência da GPU NVIDIA para jogos
reg add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm" /v "EnableLowLatencyMode" /t REG_DWORD /d 1 /f

:: Otimização para Intel HD Graphics

:: Aumentar a performance do buffer da GPU Intel
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "MaximumFrameLatency" /t REG_DWORD /d 1 /f

:: Ajustar o gerenciamento de energia para desempenho máximo
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "PowerManagementMode" /t REG_DWORD /d 1 /f

:: Melhorar latência de frames e resposta da GPU Intel
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "FrameRateControl" /t REG_DWORD /d 0 /f

:: Aumentar o uso de VRAM da GPU Intel
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "MaxVideoMemoryReservation" /t REG_DWORD /d 0x1000000 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "AmdPowerManagementMode" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "AmdThreadsPerBlock" /t REG_DWORD /d 8 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "AmdPowerPlayTable" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "MaxQueuedBuffers" /t REG_DWORD /d 10 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "GpuPriority" /t REG_DWORD /d 8 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "RenderAheadLimit" /t REG_DWORD /d 3 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "GraphicsPriority" /t REG_DWORD /d 4 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "LowLatencyMode" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "SharedSection" /t REG_SZ /d "1024,20480,8192" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "MaxVRAMUsage" /t REG_DWORD /d 100 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "VRAMPriority" /t REG_DWORD /d 2 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "VideoMemoryManagement" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "DxPriority" /t REG_DWORD /d 4 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "DxPerformanceTuning" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "DxThreadCount" /t REG_DWORD /d 16 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer" /v "DisableDWM" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "BackgroundGPUAcceleration" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "VideoBackgroundProcessing" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "TdrDelay" /t REG_DWORD /d 5 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "TdrLimitTime" /t REG_DWORD /d 60 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "TdrDdiDelay" /t REG_DWORD /d 5 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "LatencyMode" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "LowInputLatency" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "ShadowQuality" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "TextureFilteringQuality" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Background Only" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\csrss.exe\PerfOptions" /v "CpuPriorityClass" /t REG_DWORD /d 3 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "TdrDelay" /t REG_DWORD /d 10 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "IoPageLockLimit" /t REG_DWORD /d 100000000 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Bandwidth" /t REG_DWORD /d 4294967295 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "GPUTimerDelay" /t REG_DWORD /d 1 /f


ie4uinit.exe -ClearIconCache
REM Excluir cache de miniaturas com permissões ajustadas
del /s /q /f "%LocalAppData%\Microsoft\Windows\Explorer\thumbcache_*.db"

dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase >nul
dism.exe /online /Cleanup-Image /SPSuperseded >nul
DISM /Online /Disable-Feature /FeatureName:Recall

RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 1
RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 32
RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 16
RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 255


:: Executando Cleanmgr para liberar mais espaço...
:: echo Executando Cleanmgr para liberar mais espaço...
:: cleanmgr /sagerun:1
:: echo Limpeza Completa usando o Cleanmgr finalizada!
:: Removendo Pontos de Restauração (opcional, cuidado ao usar)
:: echo Removendo Pontos de Restauração (cuidado, operação irreversível)...
:: vssadmin delete shadows /all /quiet

echo %w%- CPU Cooling Tweaks %b%
powercfg /setACvalueindex scheme_current SUB_PROCESSOR SYSCOOLPOL 1
powercfg /setDCvalueindex scheme_current SUB_PROCESSOR SYSCOOLPOL 1
powercfg /setactive SCHEME_CURRENT

echo %w%- Enable All Logical Processors %b%
bcdedit /set {current} numproc %NUMBER_OF_PROCESSORS% 

echo %w% - Disable C-States%b%
powercfg -setacvalueindex scheme_current SUB_SLEEP AWAYMODE 0
powercfg /setactive SCHEME_CURRENT
powercfg -setacvalueindex scheme_current SUB_SLEEP ALLOWSTANDBY 0
powercfg /setactive SCHEME_CURRENT
powercfg -setacvalueindex scheme_current SUB_SLEEP HYBRIDSLEEP 0
powercfg /setactive SCHEME_CURRENT
powercfg /setactive SCHEME_CURRENT


echo %w%- Use Higher P-States on Lower C-States And Viseversa %b%
powercfg -setacvalueindex scheme_current sub_processor IDLESCALING 1
powercfg /setactive SCHEME_CURRENT

echo %w% - Disable Core Parking%b%
powercfg /setactive SCHEME_CURRENT


echo %w% - Disable Throttle States%b%
powercfg -setacvalueindex scheme_current sub_processor THROTTLING 0
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583" /v "ValueMin" /t REG_DWORD /d "0" /f


echo Aplicando configuracoes globais de desempenho...
reg add "HKEY_CURRENT_USER\Control Panel\Performance" /v "PerformanceOptions" /t REG_DWORD /d 2 /f
echo Feito! As configuracoes foram ajustadas para priorizar o desempenho.

reg add "HKLM\SYSTEM\CurrentControlSet\Services\intelppm" /v "Start" /t REG_DWORD /d 4 /f
bcdedit /set hypervisorlaunchtype off
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583" /v "ValueMin" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583" /v "ValueMax" /t REG_DWORD /d 0 /f
powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 100
powercfg -setactive SCHEME_CURRENT
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Enum\IDE" /v EnableWriteCache /t REG_DWORD /d 1 /f]

powercfg /change disk-timeout-ac 0
powercfg /change disk-timeout-dc 0

fsutil behavior set disableLastAccess 2
fsutil behavior set disable8dot3 0

echo Limpando cache de todos os navegadores...
del /q /f /s "%localappdata%\Google\Chrome\User Data\Default\Cache\*"
del /q /f /s "%localappdata%\Microsoft\Edge\User Data\Default\Cache\*"
del /q /f /s "%appdata%\Mozilla\Firefox\Profiles\*.default-release\cache2\entries\*"
del /q /f /s "%appdata%\Opera Software\Opera Stable\Cache\*"
del /q /f /s "%localappdata%\BraveSoftware\Brave-Browser\User Data\Default\Cache\*"
echo Limpeza de todos os navegadores concluida!

echo Limpando cache do Brave...
del /q /f /s "%localappdata%\BraveSoftware\Brave-Browser\User Data\Default\Cache\*"
echo Limpeza concluida!

echo Limpando cache do Opera...
del /q /f /s "%appdata%\Opera Software\Opera Stable\Cache\*"
echo Limpeza concluida!

echo Limpando cache do Mozilla Firefox...
del /q /f /s "%appdata%\Mozilla\Firefox\Profiles\*.default-release\cache2\entries\*"
echo Limpeza concluida!

echo Limpando cache do Microsoft Edge...
del /q /f /s "%localappdata%\Microsoft\Edge\User Data\Default\Cache\*"
echo Limpeza concluida!

echo Limpando cache do Google Chrome...
del /q /f /s "%localappdata%\Google\Chrome\User Data\Default\Cache\*"
echo Limpeza concluida!

echo. > %temp%\empty
del %temp%\empty /q
echo 1 > %temp%\clean
echo 2 > %temp%\clean
del %temp%\clean /q
for /f "skip=4 tokens=*" %%a in ('tasklist /FI "STATUS eq NOT RESPONDING"') do taskkill /f /fi "IMAGENAME eq %%a"

del /f /s /q %systemroot%\Prefetch\*.*
del /f /s /q %systemroot%\Temp\*.*

set "windows=%windir%"
set "systemdrive=%systemdrive%"
set "userprofile=%userprofile%"
set "temp=%temp%"
set "history=%userprofile%\Local Settings\History"
set "cookies=%userprofile%\Cookies"
set "recent=%userprofile%\Recent"
set "printers=%systemroot%\system32\spool\printers"

del /s /f /q "%windows%\temp\*.*" 2>nul
del /s /f /q "%windows%\Prefetch\*.exe" 2>nul
del /s /f /q "%windows%\Prefetch\*.dll" 2>nul
del /s /f /q "%windows%\Prefetch\*.pf" 2>nul
del /s /f /q "%windows%\system32\dllcache\*.*" 2>nul
del /s /f /q "%systemdrive%\Temp\*.*" 2>nul
del /s /f /q "%temp%\*.*" 2>nul
del /s /f /q "%history%\*.*" 2>nul
del /s /f /q "%userprofile%\Local Settings\Temporary Internet Files\*.*" 2>nul
del /s /f /q "%userprofile%\Local Settings\Temp\*.*" 2>nul
del /s /f /q "%recent%\*.*" 2>nul
del /s /f /q "%cookies%\*.*" 2>nul

del /q /f /s "%windir%\System32\spool\PRINTERS\*" >nul 2>&1

del /q /f "%localappdata%\Microsoft\Windows\Explorer\thumbcache_*.db" >nul 2>&1
del /q /f "%appdata%\Microsoft\Windows\Recent\*" >nul 2>&1

cd %ProgramData%\Microsoft\Windows Defender\Scans\History
del /q /f /s *.*

echo Limpando logs de atualizacoes do Windows...
del /q /f /s "%windir%\SoftwareDistribution\DataStore\Logs\*" >nul 2>&1
del /q /f /s "%windir%\Logs\CBS\*" >nul 2>&1
echo Limpeza concluida!

echo Limpando o cache de memoria RAM...
"%emptyStandbyList%" workingsets
"%emptyStandbyList%" modifiedpagelist
"%emptyStandbyList%" standbylist
echo Memoria RAM otimizada com sucesso!

wmic computersystem where name="%computername%" set AutomaticManagedPagefile=True



powercfg -change -disk-timeout-ac 0
powercfg -change -disk-timeout-dc 0
echo Configuracao de energia ajustada para SSDs!

echo Configurando o cache de gravacao no SSD...
wmic diskdrive where "MediaType='Fixed hard disk media'" set CacheEnabled=true
echo Cache de gravacao habilitado!

echo Configurando logs para minimizar escritas no SSD...
wevtutil set-log Security /rt:false
wevtutil set-log System /rt:false
wevtutil set-log Application /rt:false
echo Logs ajustados para SSDs!

echo Desativando sugestões de pesquisa na barra de tarefas...
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Search" /v SearchHistoryEnabled /t REG_DWORD /d 0 /f
echo Sugestões desativadas!


reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "LaunchTo" /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "SeparateProcess" /t REG_DWORD /d 1 /f

sc stop "wisvc"
sc config "wisvc" start= disabled

sc stop "DPS"
sc config "DPS" start= disabled

sc stop "TermService"
sc config "TermService" start= disabled

sc stop "WbioSrvc"
sc config "WbioSrvc" start= disabled

sc stop "WSearch"
sc config "WSearch" start= disabled

sc stop "TabletInputService"
sc config "TabletInputService" start= disabled

sc stop "wuauserv"
sc config "wuauserv" start= disabled

sc stop "WinDefend"
sc config "WinDefend" start= disabled

sc stop "DiagTrack"
sc config "DiagTrack" start= disabled

sc stop "W32Time"
sc config "W32Time" start= disabled

sc stop "WaaSMedicSvc"
sc config "WaaSMedicSvc" start= disabled

sc stop "RetailDemo"
sc config "RetailDemo" start= disabled

sc stop "igts"
sc config "igts" start= disabled

sc stop "bthserv"
sc config "bthserv" start= disabled

sc stop "DoSvc"
sc config "DoSvc" start= disabled

sc stop "Spooler"
sc config "Spooler" start= disabled

sc stop "RemoteRegistry"
sc config "RemoteRegistry" start= disabled

sc stop "SessionEnv"
sc config "SessionEnv" start= disabled

sc stop "PcaSvc"
sc config "PcaSvc" start= disabled

sc stop "Fax"
sc config "Fax" start= disabled

echo Desabilitando os serviços de sombra...
vssadmin stop shadowstorage /for=C: /on=C: /maxsize=1GB
echo Serviços de sombra desabilitados.


Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\DXGKrnl" /v "MonitorLatencyTolerance" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\DXGKrnl" /v "MonitorRefreshLatencyTolerance" /t REG_DWORD /d "0" /f

Reg.exe add "HKU\.DEFAULT\Control Panel\Mouse" /v "Beep" /t REG_SZ /d "No" /f
Reg.exe add "HKU\.DEFAULT\Control Panel\Mouse" /v "ExtendedSounds" /t REG_SZ /d "No" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "ActiveWindowTracking" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "Beep" /t REG_SZ /d "No" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "DoubleClickHeight" /t REG_SZ /d "4" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "DoubleClickSpeed" /t REG_SZ /d "500" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "DoubleClickWidth" /t REG_SZ /d "4" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "ExtendedSounds" /t REG_SZ /d "No" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseHoverHeight" /t REG_SZ /d "4" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseHoverWidth" /t REG_SZ /d "4" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseSensitivity" /t REG_SZ /d "10" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseSpeed" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseThreshold1" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseThreshold2" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseTrails" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "SmoothMouseXCurve" /t REG_BINARY /d "0000000000000000c0cc0c0000000000809919000000000040662600000000000033330000000000" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "SmoothMouseYCurve" /t REG_BINARY /d "0000000000000000000038000000000000007000000000000000a800000000000000e00000000000" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "SnapToDefaultButton" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "SwapMouseButtons" /t REG_SZ /d "0" /f
Reg.exe add "HKCU\Control Panel\Mouse" /v "MouseHoverTime" /t REG_SZ /d "8" /f

Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Flags" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\Control Panel\Keyboard" /v "KeyboardDelay" /t REG_SZ /d "0" /f 
Reg.exe add "HKCU\Control Panel\Keyboard" /v "InitialKeyboardIndicators" /t REG_SZ /d "0" /f 
Reg.exe add "HKCU\Control Panel\Keyboard" /v "KeyboardSpeed" /t REG_SZ /d "31" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "DelayBeforeAcceptance" /t REG_SZ /d "0" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last BounceKey Setting" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last Valid Delay" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last Valid Repeat" /t REG_DWORD /d "0" /f 
Reg.exe add "HKCU\Control Panel\Accessibility\Keyboard Response" /v "Last Valid Wait" /t REG_DWORD /d "0" /f 







reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\TapiSrv" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\FontCache3.0.0.0" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\WpcMonSvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\SEMgrSvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\PNRPsvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\LanmanWorkstation" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\WEPHOSTSVC" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\p2psvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\p2pimsvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\PhoneSvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\wuauserv" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\Wecsvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\SensorDataService" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\SensrSvc" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\perceptionsimulation" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\StiSvc" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\OneSyncSvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\ConsentUxUserSvc" /v Start /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\DevicePickerUserSvc" /v Start /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\UnistoreSvc" /v Start /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\DevicesFlowUserSvc" /v Start /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\WMPNetworkSvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\icssvc" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\DusmSvc" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\MapsBroker" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\edgeupdate" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\SensorService" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\shpamsvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\svsvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\SysMain" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\MSiSCSI" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\Netlogon" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\CscService" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\ssh-agent" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\AppReadiness" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\tzautoupdate" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\NfsClnt" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\wisvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\defragsvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\autotimesvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\MessagingService" /v Start /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\CDPUserSvc" /v Start /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\PimIndexMaintenanceSvc" /v Start /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\BcastDVRUserService" /v Start /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\UserDataSvc" /v Start /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\DeviceAssociationBrokerSvc" /v Start /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\cbdhsvc" /v Start /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\edgeupdatem" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\MicrosoftEdgeElevationService" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\ALG" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\QWAVE" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\IpxlatCfgSvc" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\SharedRealitySvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\RetailDemo" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\lltdsvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\TrkWks" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\CryptSvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\LanmanServer" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\seclogon" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\Fax" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\SCardSvr" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\DPS" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\WerSvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\Spooler" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKCU\SOFTWARE\Microsoft\InputPersonalization" /v "RestrictImplicitInkCollection" /t REG_DWORD /d 1 /f
reg add "HKCU\SOFTWARE\Microsoft\InputPersonalization" /v "RestrictImplicitTextCollection" /t REG_DWORD /d 1 /f
reg add "HKCU\SOFTWARE\Microsoft\InputPersonalization\TrainedDataStore" /v "HarvestContacts" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\TabletPC" /v "PreventHandwritingDataSharing" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\TabletPC" /v "DoSvc" /t REG_DWORD /d 3 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\HandwritingErrorReports" /v "PreventHandwritingErrorReports" /t REG_DWORD /d 1 /f
reg add "HKCU\Control Panel\International\User Profile" /v "HttpAcceptLanguageOptOut" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableLocation" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableLocationScripting" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableSensors" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableWindowsLocationProvider" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\lfsvc" /v "Start" /t REG_DWORD /d 4 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\lfsvc\Service\Configuration" /v "Status" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Sensor\Permissions\{BFA794E4-F964-4FDB-90F6-51056BFE4B44}" /v "SensorPermissionState" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Sensor\Overrides\{BFA794E4-F964-4FDB-90F6-51056BFE4B44}" /v "SensorPermissionState" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\DiagTrack" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\diagsvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\WdiServiceHost" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\WdiSystemHost" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 00000000 /f
reg add "HKEY_LOCAL_MACHINE\Software\Policies\Microsoft\Windows\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 00000000 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\dmwappushsvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\diagnosticshub.standardcollector.service" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\TroubleshootingSvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\DsSvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppCompat" /v "AITEnable" /t REG_DWORD /d "0" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\dmwappushservice" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\AdvertisingInfo" /v "Enabled" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\AdvertisingInfo" /v "Enabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo" /v "DisabledByGroupPolicy" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppCompat" /v "DisableInventory" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppCompat" /v "AITEnable" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\SQMClient\Windows" /v "CEIPEnable" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\SQMClient" /v "CorporateSQMURL" /t REG_SZ /d "0.0.0.0" /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\CloudContent" /v "DisableSoftLanding" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Assistance\Client\1.0" /v "NoActiveHelp" /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\ControlSet001\Control\WMI\AutoLogger\AutoLogger-Diagtrack-Listener" /v "Start" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\AutoLogger\AutoLogger-Diagtrack-Listener" /v "Start" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\AutoLogger\SQMLogger" /v "Start" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\FileHistory" /v "Disabled" /t REG_DWORD /d 1 /f
reg add "HKCU\SOFTWARE\Microsoft\Siuf\Rules" /v "NumberOfSIUFInPeriod" /t REG_DWORD /d 0 /f
reg add "HKCU\SOFTWARE\Microsoft\Siuf\Rules" /v "PeriodInNanoSeconds" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "DoNotShowFeedbackNotifications" /t REG_DWORD /d 1 /f
reg add "HKCU\SOFTWARE\Policies\Microsoft\Assistance\Client\1.0" /v "NoExplicitFeedback" /t REG_DWORD /d 1 /f
reg add "HKCU\SOFTWARE\Microsoft\MediaPlayer\Preferences" /v "UsageTracking" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Explorer" /v "NoUseStoreOpenWith" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\FrameServer" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\FontCache" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\InstallService" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\OSRSS" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\sedsvc" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\SENS" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\TabletInputService" /v "Start" /t REG_DWORD /d "3" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Themes" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\EpicOnlineServices" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\GoogleChromeElevationService" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\gupdate" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Origin Client Service" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Origin Web Helper Service" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\gupdatem" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Steam Client Service" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Device Metadata" /v PreventDeviceMetadataFromNetwork /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\MRT" /v DontOfferThroughWUAU /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppCompat" /v "DisableUAR" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\dmwappushservice" /v "Start" /t REG_DWORD /d "00000004" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\diagsvc" /v "Start" /t REG_DWORD /d "00000004" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\DPS" /v "Start" /t REG_DWORD /d "00000004" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\diagnosticshub.standardcollector.service" /v "Start" /t REG_DWORD /d "00000004" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WdiServiceHost" /v "Start" /t REG_DWORD /d "00000004" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WdiSystemHost" /v "Start" /t REG_DWORD /d "00000004" /f
Reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\EpicOnlineServices" /v "Start" /t REG_DWORD /d "4" /f
Reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\GoogleChromeElevationService" /v "Start" /t REG_DWORD /d "4" /f
Reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\gupdate" /v "Start" /t REG_DWORD /d "4" /f
Reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Origin Client Service" /v "Start" /t REG_DWORD /d "4" /f
Reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Origin Web Helper Service" /v "Start" /t REG_DWORD /d "4" /f
Reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\gupdatem" /v "Start" /t REG_DWORD /d "4" /f
Reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Steam Client Service" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Device Metadata" /v PreventDeviceMetadataFromNetwork /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\MRT" /v DontOfferThroughWUAU /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\SQMClient\Windows" /v "CEIPEnable" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AppCompat" /v "AITEnable" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AppCompat" /v "DisableUAR" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\AutoLogger\AutoLogger-Diagtrack-Listener" /v "Start" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\AutoLogger\SQMLogger" /v "Start" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\TabletPC" /v "PreventHandwritingDataSharing" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\TabletPC" /v "DoSvc" /t REG_DWORD /d 3 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\HandwritingErrorReports" /v "PreventHandwritingErrorReports" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableLocation" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableLocationScripting" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableSensors" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableWindowsLocationProvider" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\lfsvc" /v "Start" /t REG_DWORD /d 4 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\lfsvc\Service\Configuration" /v "Status" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Sensor\Overrides\{BFA794E4-F964-4FDB-90F6-51056BFE4B44}" /v "SensorPermissionState" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AppCompat" /v "AITEnable" /t REG_DWORD /d "0" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\dmwappushservice" /v "Start" /t REG_DWORD /d "4" /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\AdvertisingInfo" /v "Enabled" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo" /v "DisabledByGroupPolicy" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AppCompat" /v "DisableInventory" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\SQMClient" /v "CorporateSQMURL" /t REG_SZ /d "0.0.0.0" /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\CloudContent" /v "DisableSoftLanding" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Assistance\Client\1.0" /v "NoActiveHelp" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Control\WMI\AutoLogger\AutoLogger-Diagtrack-Listener" /v "Start" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\FileHistory" /v "Disabled" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "DoNotShowFeedbackNotifications" /t REG_DWORD /d 1 /f
reg add "HKEY_CURRENT_USER\SOFTWARE\Policies\Microsoft\Assistance\Client\1.0" /v "NoExplicitFeedback" /t REG_DWORD /d 1 /f
reg add "HKEY_CURRENT_USER\SOFTWARE\Microsoft\MediaPlayer\Preferences" /v "UsageTracking" /t REG_DWORD /d 0 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Explorer" /v "NoUseStoreOpenWith" /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\GraphicsPerfSvc" /v "Start" /t REG_DWORD /d 4 /f >nul
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\stisvc" /v "Start" /t REG_DWORD /d 4 /f >nul
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WerSvc" /v "Start" /t REG_DWORD /d 4 /f >nul
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\PcaSvc" /v "Start" /t REG_DWORD /d 4 /f >nul
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Wecsvc" /v "Start" /t REG_DWORD /d 4 /f >nul
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\MapsBroker" /v "Start" /t REG_DWORD /d 4 /f >nul
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Spooler" /v "Start" /t REG_DWORD /d 4 /f >nul
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\PrintNotify" /v "Start" /t REG_DWORD /d 4 /f >nul
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\XblGameSave" /v "Start" /t REG_DWORD /d 4 /f >nul
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\XboxNetApiSvc" /v "Start" /t REG_DWORD /d 4 /f >nul
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\XboxGipSvc" /v "Start" /t REG_DWORD /d 4 /f >nul
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\XblAuthManager" /v "Start" /t REG_DWORD /d 4 /f >nul

echo.
echo %w% - Desativando Telemetria %b%
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Device Metadata" /v "PreventDeviceMetadataFromNetwork" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\SOFTWARE\Microsoft\InputPersonalization" /v "RestrictImplicitInkCollection" /t REG_DWORD /d "1" /f
Reg.exe add "HKCU\SOFTWARE\Microsoft\InputPersonalization" /v "RestrictImplicitTextCollection" /t REG_DWORD /d "1" /f
Reg.exe add "HKCU\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Sensor\Permissions\{BFA794E4-F964-4FDB-90F6-51056BFE4B44}" /v "SensorPermissionState" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Sensor\Overrides\{BFA794E4-F964-4FDB-90F6-51056BFE4B44}" /v "SensorPermissionState" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\WUDF" /v "LogEnable" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\WUDF" /v "LogLevel" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "DoNotShowFeedbackNotifications" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowCommercialDataPipeline" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowDeviceNameInTelemetry" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "LimitEnhancedDiagnosticDataWindowsAnalytics" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "MicrosoftEdgeDataOptIn" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\SOFTWARE\Microsoft\Siuf\Rules" /v "NumberOfSIUFInPeriod" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\SOFTWARE\Microsoft\Siuf\Rules" /v "PeriodInNanoSeconds" /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\SOFTWARE\Policies\Microsoft\Assistance\Client\1.0" /v "NoExplicitFeedback" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Assistance\Client\1.0" /v "NoActiveHelp" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppCompat" /v "DisableInventory" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppCompat" /v "AITEnable" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppCompat" /v "DisableUAR" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\TabletPC" /v "PreventHandwritingDataSharing" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\TabletPC" /v "DoSvc" /t REG_DWORD /d "3" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableLocation" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableLocationScripting" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableSensors" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableWindowsLocationProvider" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "PublishUserActivities" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "EnableActivityFeed" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "UploadUserActivities" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\SQMClient\Windows" /v "CEIPEnable" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\SQMClient\Reliability" /v "CEIPEnable" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\SQMClient\Reliability" /v "SqmLoggerRunning" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\SQMClient\Windows" /v "CEIPEnable" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\SQMClient\Windows" /v "DisableOptinExperience" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\SQMClient\Windows" /v "SqmLoggerRunning" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\SQMClient\IE" /v "SqmLoggerRunning" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\HandwritingErrorReports" /v "PreventHandwritingErrorReports" /t REG_DWORD /d "1" /f
Reg.exe add "HKCU\SOFTWARE\Microsoft\MediaPlayer\Preferences" /v "UsageTracking" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\CloudContent" /v "DisableSoftLanding" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Peernet" /v "Disabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\DeliveryOptimization\Config" /v DODownloadMode /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\PolicyManager\default\WiFi\AllowWiFiHotSpotReporting" /v value /t REG_DWORD /d "0" /f
Reg.exe add "HKCU\SOFTWARE\Microsoft\InputPersonalization\TrainedDataStore" /v "HarvestContacts" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\AdvertisingInfo" /v "Enabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo" /v "DisabledByGroupPolicy" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\MRT" /v "DontOfferThroughWUAU" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Biometrics" /v "Enabled" /t REG_DWORD /d "0" /f
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\dmwappushservice" /v "Start" /t REG_DWORD /d "4" /f
Reg.exe add "HKCU\Control Panel\International\User Profile" /v "HttpAcceptLanguageOptOut" /t REG_DWORD /d "1" /f
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\Consolidator" 
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\Consolidator" /Disable   
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\KernelCeipTask" 
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\KernelCeipTask" /Disable 
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip" 
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip" /Disable 
schtasks /end /tn "\Microsoft\Windows\Customer Experience Improvement Program\Uploader" 
schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\Uploader" /Disable 
schtasks /end /tn "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser" 
schtasks /change /tn "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser" /Disable 
schtasks /end /tn "\Microsoft\Windows\Application Experience\ProgramDataUpdater" 
schtasks /change /tn "\Microsoft\Windows\Application Experience\ProgramDataUpdater" /Disable 
schtasks /end /tn "\Microsoft\Windows\Application Experience\StartupAppTask" 
schtasks /change /tn "\Microsoft\Windows\Application Experience\StartupAppTask" /Disable 
schtasks /end /tn "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector" 
schtasks /change /tn "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector" /Disable 
schtasks /end /tn "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticResolver" 
schtasks /change /tn "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticResolver" /Disable 
schtasks /end /tn "\Microsoft\Windows\Power Efficiency Diagnostics\AnalyzeSystem" 
schtasks /change /tn "\Microsoft\Windows\Power Efficiency Diagnostics\AnalyzeSystem" /Disable 
schtasks /end /tn "\Microsoft\Windows\Shell\FamilySafetyMonitor" 
schtasks /change /tn "\Microsoft\Windows\Shell\FamilySafetyMonitor" /Disable 
schtasks /end /tn "\Microsoft\Windows\Shell\FamilySafetyRefresh" 
schtasks /change /tn "\Microsoft\Windows\Shell\FamilySafetyRefresh" /Disable 
schtasks /end /tn "\Microsoft\Windows\Shell\FamilySafetyUpload" 
schtasks /change /tn "\Microsoft\Windows\Shell\FamilySafetyUpload" /Disable 
schtasks /end /tn "\Microsoft\Windows\Autochk\Proxy" 
schtasks /change /tn "\Microsoft\Windows\Autochk\Proxy" /Disable 
schtasks /end /tn "\Microsoft\Windows\Maintenance\WinSAT" 
schtasks /change /tn "\Microsoft\Windows\Maintenance\WinSAT" /Disable 
schtasks /end /tn "\Microsoft\Windows\Application Experience\AitAgent" 
schtasks /change /tn "\Microsoft\Windows\Application Experience\AitAgent" /Disable 
schtasks /end /tn "\Microsoft\Windows\Windows Error Reporting\QueueReporting" 
schtasks /change /tn "\Microsoft\Windows\Windows Error Reporting\QueueReporting" /Disable 
schtasks /end /tn "\Microsoft\Windows\CloudExperienceHost\CreateObjectTask" 
schtasks /change /tn "\Microsoft\Windows\CloudExperienceHost\CreateObjectTask" /Disable 
schtasks /end /tn "\Microsoft\Windows\DiskFootprint\Diagnostics" 
schtasks /change /tn "\Microsoft\Windows\DiskFootprint\Diagnostics" /Disable 
schtasks /end /tn "\Microsoft\Windows\PI\Sqm-Tasks" 
schtasks /change /tn "\Microsoft\Windows\PI\Sqm-Tasks" /Disable 
schtasks /end /tn "\Microsoft\Windows\NetTrace\GatherNetworkInfo" 
schtasks /change /tn "\Microsoft\Windows\NetTrace\GatherNetworkInfo" /Disable 
schtasks /end /tn "\Microsoft\Windows\AppID\SmartScreenSpecific" 
schtasks /change /tn "\Microsoft\Windows\AppID\SmartScreenSpecific" /Disable 
schtasks /end /tn "\Microsoft\Office\OfficeTelemetryAgentFallBack2016" 
schtasks /change /tn "\Microsoft\Office\OfficeTelemetryAgentFallBack2016" /Disable 
schtasks /end /tn "\Microsoft\Office\OfficeTelemetryAgentLogOn2016" 
schtasks /change /tn "\Microsoft\Office\OfficeTelemetryAgentLogOn2016" /Disable 
schtasks /end /tn "\Microsoft\Office\OfficeTelemetryAgentLogOn" 
schtasks /change /TN "\Microsoft\Office\OfficeTelemetryAgentLogOn" /Disable 
schtasks /end /tn "\Microsoftd\Office\OfficeTelemetryAgentFallBack" 
schtasks /change /TN "\Microsoftd\Office\OfficeTelemetryAgentFallBack" /Disable 
schtasks /end /tn "\Microsoft\Office\Office 15 Subscription Heartbeat" 
schtasks /change /TN "\Microsoft\Office\Office 15 Subscription Heartbeat" /Disable 
schtasks /end /tn "\Microsoft\Windows\Time Synchronization\ForceSynchronizeTime" 
schtasks /change /TN "\Microsoft\Windows\Time Synchronization\ForceSynchronizeTime" /Disable 
schtasks /end /tn "\Microsoft\Windows\Time Synchronization\SynchronizeTime" 
schtasks /change /TN "\Microsoft\Windows\Time Synchronization\SynchronizeTime" /Disable   
schtasks /end /tn "\Microsoft\Windows\Device Information\Device" 
schtasks /change /TN "\Microsoft\Windows\Device Information\Device" /Disable

winget update
winget upgrade --all

shutdown -r -t 0
