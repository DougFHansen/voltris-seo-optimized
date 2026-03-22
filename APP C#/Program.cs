using System;
using System.Windows;

namespace VoltrisOptimizer
{
    public static class Program
    {
        [STAThread]
        public static void Main()
        {
            try
            {
                var app = new App();
                app.InitializeComponent();
                app.Run();
            }
            catch (Exception ex)
            {
                // Tenta escrever no console
                Console.WriteLine("CRITICAL STARTUP ERROR:");
                Console.WriteLine(ex.ToString());
                
                // Tenta escrever em arquivo
                try 
                {
                    System.IO.File.WriteAllText("STARTUP_ERROR.log", ex.ToString());
                }
                catch {}

                // Tenta mostrar MessageBox
                MessageBox.Show(ex.ToString(), "Voltris Fatal Error");
            }
        }
    }
}
