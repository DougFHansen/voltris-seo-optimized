namespace VoltrisUninstaller.Core
{
    /// <summary>
    /// OpÃ§Ãµes de desinstalaÃ§Ã£o
    /// </summary>
    public class UninstallOptions
    {
        public bool Silent { get; set; }
        public bool KeepUserData { get; set; }
        public bool DryRun { get; set; }
        public bool Force { get; set; }
        public string? LogPath { get; set; }
    }
}

