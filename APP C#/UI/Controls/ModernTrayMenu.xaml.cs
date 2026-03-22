using System;
using System.Windows;
using System.Windows.Input;
using VoltrisOptimizer.UI.Controls;
using VoltrisOptimizer.Helpers;
using VoltrisOptimizer.UI.Helpers;

namespace VoltrisOptimizer.UI.Controls
{
    public partial class ModernTrayMenu : Window
    {
        public event EventHandler? ShowRequested;
        public event EventHandler? NavigateRequested;
        public event EventHandler? QuickCleanupRequested;
        public event EventHandler? QuickOptimizeRequested;
        public event EventHandler? ExitRequested;

        public ModernTrayMenu()
        {
            InitializeComponent();
            RoundedWindowHelper.Apply(this, 12);
            Loaded += ModernTrayMenu_Loaded;
            Deactivated += (s, e) => ModernTrayMenu_Deactivated(s, e);
            
            // Atualizar versão
            UpdateVersion();
        }

        private void ModernTrayMenu_Loaded(object sender, RoutedEventArgs e)
        {
            // Aguardar renderização para obter dimensões corretas
            Dispatcher.BeginInvoke(new Action(() =>
            {
                PositionMenu();
            }), System.Windows.Threading.DispatcherPriority.Loaded);
        }

        private void PositionMenu()
        {
            try
            {
                // Obter posição atual do cursor (onde o usuário clicou)
                var mousePos = System.Windows.Forms.Control.MousePosition;
                
                // Obter informações da tela onde o cursor está
                var screen = System.Windows.Forms.Screen.FromPoint(mousePos);
                var screenBounds = screen.WorkingArea;
                
                // Obter dimensões do menu (após renderização)
                UpdateLayout();
                var menuWidth = ActualWidth > 0 ? ActualWidth : Width;
                var menuHeight = ActualHeight > 0 ? ActualHeight : Height;
                
                // Calcular altura da taskbar
                var taskbarHeight = SystemParameters.PrimaryScreenHeight - screenBounds.Height;
                if (taskbarHeight <= 0) taskbarHeight = 40; // Fallback padrão
                
                // Posicionar à esquerda do cursor (comportamento padrão de menus de contexto)
                // Adicionar margem maior para garantir que não saia da tela
                // Mover 240px para a esquerda para teste (40px + 100px + 100px)
                var leftPosition = mousePos.X - menuWidth - 8 - 240; // 8px de margem + 240px de teste
                
                // Posicionar sempre ACIMA da taskbar (sem sobrepor)
                // screenBounds.Bottom já é a linha onde a taskbar começa (WorkingArea não inclui taskbar)
                // Calcular posição Y para que o menu fique completamente acima da taskbar
                // Mover mais 250px para cima
                var topPosition = screenBounds.Bottom - menuHeight - 10 - 250; // 10px de margem + 250px acima da taskbar
                
                // Se o menu for muito alto e não couber acima da taskbar, ajustar para cima
                if (topPosition < screenBounds.Top + 10)
                {
                    // Se não couber, posicionar o mais alto possível, mas sempre acima da taskbar
                    topPosition = screenBounds.Top + 10;
                }
                
                // Verificar se cabe à esquerda do cursor
                if (leftPosition < screenBounds.Left + 5)
                {
                    // Se não couber à esquerda, posicionar à direita do cursor
                    leftPosition = mousePos.X + 8; // 8px à direita do cursor
                }
                
                // Verificação rigorosa: garantir que não saia pela direita
                if (leftPosition + menuWidth > screenBounds.Right - 5)
                {
                    // Ajustar para dentro da tela, mantendo margem de segurança
                    leftPosition = screenBounds.Right - menuWidth - 10;
                }
                
                // GARANTIR que NUNCA sobreponha a taskbar
                // Se o menu ultrapassar a base da área de trabalho (onde a taskbar começa), ajustar para cima
                if (topPosition + menuHeight > screenBounds.Bottom - 5)
                {
                    // Ajustar para garantir que fique completamente acima da taskbar
                    topPosition = screenBounds.Bottom - menuHeight - 10;
                }
                
                // Garantir que não fique muito acima (margem mínima do topo)
                if (topPosition < screenBounds.Top + 10)
                {
                    topPosition = screenBounds.Top + 10;
                }
                
                // Verificação final: garantir que nunca ultrapasse a linha da taskbar
                if (topPosition + menuHeight >= screenBounds.Bottom)
                {
                    topPosition = screenBounds.Bottom - menuHeight - 10;
                }
                
                // Verificações finais de segurança
                // Garantir que não saia pela esquerda
                if (leftPosition < screenBounds.Left)
                {
                    leftPosition = screenBounds.Left + 5;
                }
                
                // Garantir que não saia pela direita
                if (leftPosition + menuWidth > screenBounds.Right)
                {
                    leftPosition = screenBounds.Right - menuWidth - 5;
                }
                
                // Garantir que não saia pelo topo
                if (topPosition < screenBounds.Top)
                {
                    topPosition = screenBounds.Top + 5;
                }
                
                // Garantir que não saia pela base
                if (topPosition + menuHeight > screenBounds.Bottom)
                {
                    topPosition = (int)(screenBounds.Bottom - menuHeight - 5);
                }
                
                // Aplicar posição
                Left = leftPosition;
                Top = topPosition;
            }
            catch
            {
                // Fallback: posicionar próximo ao cursor
                try
                {
                    var mousePos = System.Windows.Forms.Control.MousePosition;
                    Left = mousePos.X - Width - 10;
                    Top = mousePos.Y - 10;
                }
                catch
                {
                    // Último fallback: canto superior esquerdo
                    var screen = System.Windows.Forms.Screen.PrimaryScreen;
                    if (screen != null)
                    {
                        Left = screen.WorkingArea.Left + 10;
                        Top = screen.WorkingArea.Top + 10;
                    }
                }
            }
        }

        private void ModernTrayMenu_Deactivated(object? sender, EventArgs e)
        {
            Close();
        }

        private void UpdateVersion()
        {
            try
            {
                var version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version;
                string versionString;
                if (version != null)
                {
                    if (version.Revision != -1 && version.Revision != 0)
                    {
                        versionString = $"v{version.Major}.{version.Minor}.{version.Build}.{version.Revision}";
                    }
                    else
                    {
                        versionString = $"v{version.Major}.{version.Minor}.{version.Build}";
                    }
                }
                else
                {
                    versionString = "v1.0.0.9";
                }
                TrayVersionText.Text = versionString;
            }
            catch
            {
                TrayVersionText.Text = "v1.0.0.9";
            }
        }

        private void ShowButton_Click(object sender, RoutedEventArgs e)
        {
            ShowRequested?.Invoke(this, EventArgs.Empty);
            Close();
        }

        private void DashboardButton_Click(object sender, RoutedEventArgs e)
        {
            NavigateRequested?.Invoke(this, new NavigateEventArgs("Dashboard"));
            Close();
        }

        private void CleanupButton_Click(object sender, RoutedEventArgs e)
        {
            QuickCleanupRequested?.Invoke(this, EventArgs.Empty);
            Close();
        }

        private void PerformanceButton_Click(object sender, RoutedEventArgs e)
        {
            QuickOptimizeRequested?.Invoke(this, EventArgs.Empty);
            Close();
        }

        private void HistoryButton_Click(object sender, RoutedEventArgs e)
        {
            NavigateRequested?.Invoke(this, new NavigateEventArgs("History"));
            Close();
        }

        private void SchedulerButton_Click(object sender, RoutedEventArgs e)
        {
            NavigateRequested?.Invoke(this, new NavigateEventArgs("Scheduler"));
            Close();
        }

        private void SettingsButton_Click(object sender, RoutedEventArgs e)
        {
            NavigateRequested?.Invoke(this, new NavigateEventArgs("Settings"));
            Close();
        }

        private void AboutButton_Click(object sender, RoutedEventArgs e)
        {
            var aboutMessage = "Voltris Optimizer\n\n" +
                              "Sistema Profissional de Otimização\n" +
                              "para Windows 10/11\n\n" +
                              $"Versão: {TrayVersionText.Text}\n" +
                              "© 2025 VOLTRIS";
            
            ModernMessageBox.Show(
                aboutMessage,
                "Sobre",
                MessageBoxButton.OK,
                MessageBoxImage.Information
            );
            Close();
        }

        private void ExitButton_Click(object sender, RoutedEventArgs e)
        {
            var result = ModernMessageBox.Show(
                "Tem certeza que deseja sair do Voltris Optimizer?",
                "Confirmar Saída",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question
            );
            
            if (result == MessageBoxResult.Yes)
            {
                ExitRequested?.Invoke(this, EventArgs.Empty);
            }
            Close();
        }

        protected override void OnMouseLeave(MouseEventArgs e)
        {
            // Não fechar automaticamente ao sair do mouse
            base.OnMouseLeave(e);
        }
    }

    public class NavigateEventArgs : EventArgs
    {
        public string Page { get; }
        public NavigateEventArgs(string page)
        {
            Page = page;
        }
    }
}

