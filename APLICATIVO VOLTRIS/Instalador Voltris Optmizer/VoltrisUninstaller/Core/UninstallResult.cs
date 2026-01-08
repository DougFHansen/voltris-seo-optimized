namespace VoltrisUninstaller.Core
{
    /// <summary>
    /// Resultado da desinstalação
    /// </summary>
    public class UninstallResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
    }

    /// <summary>
    /// Progresso da desinstalação
    /// </summary>
    public class UninstallProgress
    {
        public string Step { get; set; } = "";
        public int Percent { get; set; }
    }
}

