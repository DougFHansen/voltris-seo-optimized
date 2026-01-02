using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.UI.Views
{
    public partial class OnboardingView : UserControl
    {
        private int _currentStep = 0;
        private readonly OnboardingService _onboardingService;

        public event EventHandler? OnboardingCompleted;

        public OnboardingView()
        {
            InitializeComponent();
            _onboardingService = new OnboardingService();
            Loaded += OnboardingView_Loaded;
        }

        private void OnboardingView_Loaded(object sender, RoutedEventArgs e)
        {
            ShowStep(0);
        }

        private void ShowStep(int step)
        {
            _currentStep = step;

            // Atualizar indicadores de progresso
            UpdateProgressIndicators(step);

            // Atualizar botões
            BackButton.Visibility = step > 0 ? Visibility.Visible : Visibility.Collapsed;
            NextButton.Content = step == 3 ? "Concluir ✓" : "Próximo →";

            // Limpar conteúdo anterior
            StepContentControl.Content = null;

            // Mostrar conteúdo do passo atual
            switch (step)
            {
                case 0:
                    ShowWelcomeStep();
                    break;
                case 1:
                    ShowFeaturesStep();
                    break;
                case 2:
                    ShowQuickStartStep();
                    break;
                case 3:
                    ShowFinalStep();
                    break;
            }
        }

        private Brush GetBrush(string key)
        {
            return (Brush)FindResource(key);
        }

        private void ShowWelcomeStep()
        {
            StepTitleText.Text = "Bem-vindo ao Voltris Optimizer!";
            StepDescriptionText.Text = "O sistema profissional de otimização para Windows 10/11";

            var content = new StackPanel { Margin = new Thickness(0, 8, 0, 0) };
            
            // Ícone central com gradiente
            var iconBorder = new Border
            {
                Width = 80,
                Height = 80,
                CornerRadius = new CornerRadius(20),
                HorizontalAlignment = HorizontalAlignment.Center,
                Margin = new Thickness(0, 0, 0, 24)
            };
            iconBorder.Background = CreateGradientBrush("#FF4B6B", "#8B31FF");
            iconBorder.Effect = new System.Windows.Media.Effects.DropShadowEffect
            {
                BlurRadius = 25,
                ShadowDepth = 0,
                Color = (Color)ColorConverter.ConvertFromString("#8B31FF"),
                Opacity = 0.5
            };
            var iconText = new TextBlock
            {
                Text = "⚡",
                FontSize = 40,
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center
            };
            iconBorder.Child = iconText;
            content.Children.Add(iconBorder);

            var featuresPanel = new StackPanel { Margin = new Thickness(0, 8, 0, 0) };
            
            var features = new[]
            {
                ("🧹", "Limpeza automática de arquivos temporários", "#10B981"),
                ("⚡", "Otimização de desempenho do sistema", "#F59E0B"),
                ("🌐", "Melhoria de conexão de rede", "#3B82F6"),
                ("📊", "Histórico completo de otimizações", "#8B5CF6"),
                ("⏰", "Agendamento automático de tarefas", "#EC4899")
            };

            foreach (var (emoji, text, color) in features)
            {
                var featurePanel = new StackPanel 
                { 
                    Orientation = Orientation.Horizontal,
                    Margin = new Thickness(0, 0, 0, 12)
                };
                
                // Ícone com fundo colorido
                var emojiBorder = new Border
                {
                    Width = 36,
                    Height = 36,
                    CornerRadius = new CornerRadius(10),
                    Margin = new Thickness(0, 0, 14, 0),
                    Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString(color)) { Opacity = 0.2 }
                };
                var emojiBlock = new TextBlock
                {
                    Text = emoji,
                    FontSize = 18,
                    HorizontalAlignment = HorizontalAlignment.Center,
                    VerticalAlignment = VerticalAlignment.Center
                };
                emojiBorder.Child = emojiBlock;
                featurePanel.Children.Add(emojiBorder);
                
                var featureText = new TextBlock
                {
                    Text = text,
                    FontSize = 14,
                    Foreground = GetBrush("TextPrimaryBrush"),
                    VerticalAlignment = VerticalAlignment.Center
                };
                featurePanel.Children.Add(featureText);
                
                featuresPanel.Children.Add(featurePanel);
            }

            content.Children.Add(featuresPanel);
            StepContentControl.Content = content;
        }
        
        private LinearGradientBrush CreateGradientBrush(string color1, string color2)
        {
            return new LinearGradientBrush
            {
                StartPoint = new Point(0, 0),
                EndPoint = new Point(1, 1),
                GradientStops = new GradientStopCollection
                {
                    new GradientStop((Color)ColorConverter.ConvertFromString(color1), 0),
                    new GradientStop((Color)ColorConverter.ConvertFromString(color2), 1)
                }
            };
        }

        private void ShowFeaturesStep()
        {
            StepTitleText.Text = "Principais Funcionalidades";
            StepDescriptionText.Text = "Conheça as ferramentas poderosas à sua disposição";

            var content = new StackPanel { Margin = new Thickness(0, 8, 0, 0) };

            var features = new[]
            {
                ("📊", "Dashboard", "Visão geral completa do sistema", "#3B82F6", "#1D4ED8"),
                ("🧹", "Limpeza", "Remova arquivos e libere espaço", "#10B981", "#059669"),
                ("⚡", "Desempenho", "Otimize velocidade e responsividade", "#F59E0B", "#D97706"),
                ("🌐", "Rede", "Melhore sua conexão de internet", "#06B6D4", "#0891B2"),
                ("⚙️", "Sistema", "Ferramentas avançadas de manutenção", "#6366F1", "#4F46E5"),
                ("🎮", "Modo Gamer", "Otimizações específicas para jogos", "#EC4899", "#DB2777")
            };

            foreach (var (icon, title, desc, color1, color2) in features)
            {
                var featureCard = new Border
                {
                    Background = GetBrush("DarkPanelAltBrush"),
                    CornerRadius = new CornerRadius(12),
                    Padding = new Thickness(14, 12, 14, 12),
                    Margin = new Thickness(0, 0, 0, 10),
                    BorderBrush = GetBrush("DarkBorderBrush"),
                    BorderThickness = new Thickness(1)
                };

                var grid = new Grid();
                grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(48) });
                grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });

                // Ícone com gradiente
                var iconBorder = new Border
                {
                    Width = 40,
                    Height = 40,
                    CornerRadius = new CornerRadius(10),
                    Background = CreateGradientBrush(color1, color2),
                    VerticalAlignment = VerticalAlignment.Center
                };
                iconBorder.Effect = new System.Windows.Media.Effects.DropShadowEffect
                {
                    BlurRadius = 10,
                    ShadowDepth = 0,
                    Color = (Color)ColorConverter.ConvertFromString(color1),
                    Opacity = 0.3
                };
                var iconText = new TextBlock
                {
                    Text = icon,
                    FontSize = 20,
                    HorizontalAlignment = HorizontalAlignment.Center,
                    VerticalAlignment = VerticalAlignment.Center
                };
                iconBorder.Child = iconText;
                Grid.SetColumn(iconBorder, 0);
                grid.Children.Add(iconBorder);

                var textPanel = new StackPanel { VerticalAlignment = VerticalAlignment.Center, Margin = new Thickness(8, 0, 0, 0) };
                textPanel.Children.Add(new TextBlock
                {
                    Text = title,
                    FontSize = 15,
                    FontWeight = FontWeights.SemiBold,
                    Foreground = GetBrush("TextPrimaryBrush")
                });
                textPanel.Children.Add(new TextBlock
                {
                    Text = desc,
                    FontSize = 12,
                    Foreground = GetBrush("TextSecondaryBrush"),
                    Margin = new Thickness(0, 2, 0, 0)
                });
                Grid.SetColumn(textPanel, 1);
                grid.Children.Add(textPanel);

                featureCard.Child = grid;
                content.Children.Add(featureCard);
            }

            StepContentControl.Content = content;
        }

        private void ShowQuickStartStep()
        {
            StepTitleText.Text = "Início Rápido";
            StepDescriptionText.Text = "Dicas essenciais para começar a usar";

            var content = new StackPanel { Margin = new Thickness(0, 8, 0, 0) };

            var tips = new[]
            {
                ("1", "Execute uma limpeza completa", "Vá em Limpeza e clique em 'Executar Limpeza'", "#10B981", "#059669"),
                ("2", "Otimize o desempenho", "Acesse Desempenho e aplique otimizações", "#3B82F6", "#1D4ED8"),
                ("3", "Configure agendamentos", "Crie tarefas automáticas em Agendamento", "#8B5CF6", "#6D28D9"),
                ("4", "Acompanhe o histórico", "Visualize otimizações em Histórico", "#EC4899", "#DB2777")
            };

            foreach (var (num, title, description, color1, color2) in tips)
            {
                var tipCard = new Border
                {
                    Background = GetBrush("DarkPanelAltBrush"),
                    CornerRadius = new CornerRadius(12),
                    Padding = new Thickness(16, 14, 16, 14),
                    Margin = new Thickness(0, 0, 0, 12),
                    BorderBrush = GetBrush("DarkBorderBrush"),
                    BorderThickness = new Thickness(1)
                };

                var grid = new Grid();
                grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(48) });
                grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });

                // Número em círculo com gradiente
                var numBorder = new Border
                {
                    Width = 36,
                    Height = 36,
                    Background = CreateGradientBrush(color1, color2),
                    CornerRadius = new CornerRadius(18),
                    VerticalAlignment = VerticalAlignment.Top
                };
                numBorder.Effect = new System.Windows.Media.Effects.DropShadowEffect
                {
                    BlurRadius = 10,
                    ShadowDepth = 0,
                    Color = (Color)ColorConverter.ConvertFromString(color1),
                    Opacity = 0.3
                };
                var numText = new TextBlock
                {
                    Text = num,
                    FontSize = 15,
                    FontWeight = FontWeights.Bold,
                    Foreground = Brushes.White,
                    HorizontalAlignment = HorizontalAlignment.Center,
                    VerticalAlignment = VerticalAlignment.Center
                };
                numBorder.Child = numText;
                Grid.SetColumn(numBorder, 0);
                grid.Children.Add(numBorder);

                // Conteúdo
                var textStack = new StackPanel { VerticalAlignment = VerticalAlignment.Center, Margin = new Thickness(4, 0, 0, 0) };
                textStack.Children.Add(new TextBlock
                {
                    Text = title,
                    FontSize = 14,
                    FontWeight = FontWeights.SemiBold,
                    Foreground = GetBrush("TextPrimaryBrush"),
                    TextWrapping = TextWrapping.Wrap
                });
                textStack.Children.Add(new TextBlock
                {
                    Text = description,
                    FontSize = 12,
                    Foreground = GetBrush("TextSecondaryBrush"),
                    TextWrapping = TextWrapping.Wrap,
                    Margin = new Thickness(0, 4, 0, 0)
                });
                Grid.SetColumn(textStack, 1);
                grid.Children.Add(textStack);

                tipCard.Child = grid;
                content.Children.Add(tipCard);
            }

            StepContentControl.Content = content;
        }

        private void ShowFinalStep()
        {
            StepTitleText.Text = "Tudo Pronto!";
            StepDescriptionText.Text = "Clique em Concluir para ir ao Questionário de Perfil";

            var content = new StackPanel 
            { 
                Margin = new Thickness(0, 16, 0, 0),
                HorizontalAlignment = HorizontalAlignment.Center
            };

            // Ícone com gradiente
            var iconBorder = new Border
            {
                Width = 100,
                Height = 100,
                CornerRadius = new CornerRadius(25),
                HorizontalAlignment = HorizontalAlignment.Center,
                Margin = new Thickness(0, 0, 0, 24)
            };
            iconBorder.Background = CreateGradientBrush("#10B981", "#059669");
            iconBorder.Effect = new System.Windows.Media.Effects.DropShadowEffect
            {
                BlurRadius = 30,
                ShadowDepth = 0,
                Color = (Color)ColorConverter.ConvertFromString("#10B981"),
                Opacity = 0.5
            };
            var iconText = new TextBlock
            {
                Text = "✓",
                FontSize = 52,
                FontWeight = FontWeights.Bold,
                Foreground = Brushes.White,
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center
            };
            iconBorder.Child = iconText;
            content.Children.Add(iconBorder);

            var message = new TextBlock
            {
                Text = "Excelente! O tutorial foi concluído.\n\nAgora vamos configurar seu perfil de uso\npara personalizar as otimizações.",
                FontSize = 15,
                Foreground = GetBrush("TextPrimaryBrush"),
                TextAlignment = TextAlignment.Center,
                TextWrapping = TextWrapping.Wrap,
                Margin = new Thickness(0, 0, 0, 24),
                LineHeight = 22
            };
            content.Children.Add(message);

            // Card de próximos passos
            var nextStepsCard = new Border
            {
                Background = GetBrush("DarkPanelAltBrush"),
                CornerRadius = new CornerRadius(14),
                Padding = new Thickness(20, 16, 20, 16),
                HorizontalAlignment = HorizontalAlignment.Center,
                MinWidth = 350,
                Margin = new Thickness(0, 0, 0, 20)
            };
            var nextStepsPanel = new StackPanel();
            nextStepsPanel.Children.Add(new TextBlock
            {
                Text = "📋 Próximos Passos:",
                FontSize = 14,
                FontWeight = FontWeights.SemiBold,
                Foreground = GetBrush("TextPrimaryBrush"),
                Margin = new Thickness(0, 0, 0, 12)
            });
            
            var steps = new[]
            {
                ("1️⃣", "Responder questionário de perfil"),
                ("2️⃣", "Revisar recomendações inteligentes"),
                ("3️⃣", "Aplicar otimizações personalizadas")
            };
            foreach (var (num, step) in steps)
            {
                var stepPanel = new StackPanel { Orientation = Orientation.Horizontal, Margin = new Thickness(0, 0, 0, 6) };
                stepPanel.Children.Add(new TextBlock { Text = num, FontSize = 13, Margin = new Thickness(0, 0, 10, 0) });
                stepPanel.Children.Add(new TextBlock { Text = step, FontSize = 13, Foreground = GetBrush("TextSecondaryBrush") });
                nextStepsPanel.Children.Add(stepPanel);
            }
            nextStepsCard.Child = nextStepsPanel;
            content.Children.Add(nextStepsCard);

            // Dica de atalho
            var tipBorder = new Border
            {
                Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#8B31FF")) { Opacity = 0.1 },
                CornerRadius = new CornerRadius(10),
                Padding = new Thickness(16, 10, 16, 10),
                HorizontalAlignment = HorizontalAlignment.Center
            };
            var tipText = new TextBlock
            {
                Text = "💡 Dica: Use Ctrl + 1-9 para navegação rápida",
                FontSize = 12,
                Foreground = GetBrush("TextMutedBrush"),
                HorizontalAlignment = HorizontalAlignment.Center
            };
            tipBorder.Child = tipText;
            content.Children.Add(tipBorder);

            StepContentControl.Content = content;
        }
        
        private void GoToDashboardButton_Click(object sender, RoutedEventArgs e)
        {
            // Marcar onboarding como completo e disparar evento
            _onboardingService.MarkOnboardingComplete();
            OnboardingCompleted?.Invoke(this, EventArgs.Empty);
        }

        private void UpdateProgressIndicators(int currentStep)
        {
            var activeBrush = GetBrush("PrimaryBrush");
            var inactiveBrush = GetBrush("DarkBorderBrush");

            Step1Indicator.Fill = currentStep >= 0 ? activeBrush : inactiveBrush;
            Step2Indicator.Fill = currentStep >= 1 ? activeBrush : inactiveBrush;
            Step3Indicator.Fill = currentStep >= 2 ? activeBrush : inactiveBrush;
            Step4Indicator.Fill = currentStep >= 3 ? activeBrush : inactiveBrush;
        }

        private void NextButton_Click(object sender, RoutedEventArgs e)
        {
            if (_currentStep < 3)
            {
                ShowStep(_currentStep + 1);
            }
            else
            {
                CompleteOnboarding();
            }
        }

        private void BackButton_Click(object sender, RoutedEventArgs e)
        {
            if (_currentStep > 0)
            {
                ShowStep(_currentStep - 1);
            }
        }

        private void SkipButton_Click(object sender, RoutedEventArgs e)
        {
            CompleteOnboarding();
        }

        private void CompleteOnboarding()
        {
            // Não marcar como completo ainda - só depois do Resumo Inteligente
            // Navegar para o Questionário de Perfil
            try
            {
                if (Application.Current.MainWindow is MainWindow mainWindow)
                {
                    var contentFrame = mainWindow.FindName("ContentFrame") as ContentControl;
                    if (contentFrame != null)
                    {
                        var questionnaireView = new Core.SystemIntelligenceProfiler.UI.Views.ProfilerQuestionnaireView();
                        contentFrame.Content = questionnaireView;
                        App.LoggingService?.LogInfo("[ONBOARDING] Navegando para Questionário de Perfil");
                    }
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[ONBOARDING] Erro ao navegar: {ex.Message}");
                // Fallback: marcar como completo e ir para Dashboard
                _onboardingService.MarkOnboardingComplete();
                OnboardingCompleted?.Invoke(this, EventArgs.Empty);
            }
        }
    }
}
