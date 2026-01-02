using System;
using System.Security.Principal;

namespace VoltrisOptimizer.Utils
{
    /// <summary>
    /// Helper para verificação de privilégios de administrador
    /// </summary>
    public static class AdminHelper
    {
        /// <summary>
        /// Verifica se o aplicativo está sendo executado como administrador
        /// </summary>
        public static bool IsRunningAsAdministrator()
        {
            try
            {
                WindowsIdentity identity = WindowsIdentity.GetCurrent();
                WindowsPrincipal principal = new WindowsPrincipal(identity);
                return principal.IsInRole(WindowsBuiltInRole.Administrator);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Solicita elevação de privilégios (reinicia o aplicativo como admin)
        /// </summary>
        public static bool RequestElevation()
        {
            try
            {
                // Usar ProcessPath para single-file apps
                var exePath = System.Environment.ProcessPath ?? 
                             (System.Windows.Application.ResourceAssembly != null 
                                 ? System.Windows.Application.ResourceAssembly.Location 
                                 : null);
                if (string.IsNullOrEmpty(exePath))
                {
                    exePath = System.IO.Path.Combine(System.AppContext.BaseDirectory, "VoltrisOptimizer.exe");
                }
                
                System.Diagnostics.ProcessStartInfo processInfo = new System.Diagnostics.ProcessStartInfo
                {
                    UseShellExecute = true,
                    WorkingDirectory = Environment.CurrentDirectory,
                    FileName = exePath,
                    Verb = "runas" // Solicita elevação
                };

                System.Diagnostics.Process.Start(processInfo);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}

