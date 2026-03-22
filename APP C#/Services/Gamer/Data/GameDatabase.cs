using System;
using System.Collections.Generic;

namespace VoltrisOptimizer.Services.Gamer.Data
{
    public static class GameDatabase
    {
        /// <summary>
        /// Nomes de processos conhecidos como jogos (sem .exe)
        /// </summary>
        public static readonly HashSet<string> KnownGames = new(StringComparer.OrdinalIgnoreCase)
        {
            "csgo", "cs2", "dota2", "lol", "leagueclient", "valorant", "valorant-win64-shipping",
            "fortnite", "fortniteclient-win64-shipping", "minecraft", "javaw", "minecraftlauncher",
            "gta5", "gtav", "rdr2", "witcher3", "cyberpunk2077", "fivem",
            "apexlegends", "r5apex", "overwatchlauncher", "overwatch",
            "pubg", "tslgame", "eFootball", "fifa", "nba2k", "fc24", "fc25",
            "fallguys_client", "rocketleague", "destiny2", "plutonium",
            "warzone", "cod", "modernwarfare", "blackops", "coldwar", "vanguard",
            "genshinimpact", "starrail", "deadbydaylight-win64-shipping", "dbd",
            "rainbowsix", "rainbowsix_be", "r6s", "tarkov", "escapefromtarkov",
            "rust", "rustclient", "ark", "shootergame", "terraria", "stardew valley",
            "robloxplayerbeta", "roblox", "league of legends", "helldivers2", "starfield",
            "palworld-win64-shipping", "enshrouded", "lethal company", "counterstrike"
        };

        /// <summary>
        /// Nomes de processos que NÃO são jogos
        /// </summary>
        public static readonly HashSet<string> SystemProcesses = new(StringComparer.OrdinalIgnoreCase)
        {
            "voltrisoptimizer", "code", "devenv", "explorer", "svchost",
            "csrss", "dwm", "taskmgr", "cmd", "powershell", "conhost",
            "chrome", "firefox", "edge", "msedge", "opera", "brave",
            "discord", "spotify", "epicgameslauncher", "origin",
            "eadesktop", "ubisoftconnect", "galaxyclient", "battlenet",
            "winpty-agent", "openconsole", "rg", "fd", "vsce-sign", "code-tunnel",
            "trae", "qoder", "mmc", "regedit", "notepad",
            "steam", "steamwebhelper", "steamservice", "gameoverlayui", "steamsysinfo", 
            "epicwebhelper", "epicgamesupdater", 
            "dxsetup", "vcredist", "vcredist_x64", "vcredist_x86",
            "trustedinstaller", "msiexec", "setup", "installer", "wusa", "dism", "sfc",
            "backgroundtransferhost", "runtimebroker", "compattelrunner", "wuauclt",
            "audiodg", "fontdrvhost", "sihost", "ctfmon", "searchindexer",
            "ngentask", "ngen", "mrt", "musnotificationux", "werfault",
            "dllhost", "taskhostw", "taskhost", "w32time", "wudfhost",
            "outlook", "onenote", "excel", "winword", "powerpnt", "teams", "slack",
            "zoom", "anydesk", "teamviewer", "skype", "obs64", "obs",
            "git", "git-remote-https", "git-lfs", "wsl", "wslhost", "wslservice", "sh", "bash", "antigravity",
            // Utilitários do sistema (detectados nos logs como ruído)
            "netsh", "powercfg", "bcdedit", "reg", "defrag", "fsutil",
            "ipconfig", "ping", "tracert", "nslookup", "arp", "route",
            "sc", "net", "net1", "whoami", "hostname", "systeminfo",
            "wmic", "cscript", "wscript", "mshta", "rundll32",
            "robocopy", "xcopy", "attrib", "icacls", "takeown",
            "chkdsk", "diskpart", "mountvol", "cleanmgr",
            "gpupdate", "gpresult", "secedit", "auditpol",
            "certutil", "cipher", "compact", "expand",
            "logman", "perfmon", "typeperf", "resmon",
            "shutdown", "logoff", "msg", "query", "qwinsta",
            "findstr", "sort", "more", "tree", "where",
            "timeout", "choice", "waitfor", "at", "schtasks",
            "msconfig", "msinfo32", "winver", "control", "appwiz",
            "consent",
            // Edge / WebView2 — nunca são jogos, independente do caminho
            "msedgewebview2", "msedge", "msedgecp", "msedgecrashhpad",
            "edgewebview", "edgewebview2", "edgeupdate", "microsoftedge",
            "microsoftedgecp", "microsoftedgeupdate",
            // Runtimes e frameworks embarcados em launchers
            "dotnet", "node", "node64", "electron", "electronapp",
            "nwjs", "cef", "cefsharp", "cefsharp.browsersubprocess",
            "javaw", "java", "python", "python3", "pythonw",
            // Launchers e helpers que NÃO são o jogo em si
            "rebornlauncher", "launcher", "gamelaunch", "gamelauncher",
            "updater", "patcher", "crashpad_handler", "crashreporter",
            "uninstall", "uninstaller", "repair",
            // Processos de sistema adicionais observados nos logs
            "samsungsystemsupportosd", "softlandingtask",
            "wmiapsrv", "mousocoreworker", "backgroundtaskhost", "sppsvc",
            "kiro"
        };
    }
}
