using System;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Threading;
using System.Windows.Media;

namespace VoltrisOptimizerInstaller
{
    public partial class App : Application
    {
        public App()
        {
            // Criar recursos fallback IMEDIATAMENTE no construtor, antes de qualquer coisa
            InitializeResourcesFallbackFirst();
        }
        
        protected override void OnStartup(StartupEventArgs e)
        {
            // Garantir que recursos estejam disponíveis ANTES de base.OnStartup
            if (Resources == null)
            {
                Resources = new ResourceDictionary();
            }
            
            // Se não tem recursos ainda, criar fallback
            if (Resources.Count == 0)
            {
                InitializeResourcesFallbackFirst();
            }
            
            // Tentar carregar recursos XAML compilados (se disponíveis, adicionam aos fallback)
            TryLoadXamlResources();
            
            // CRÍTICO: Garantir que Application.Current.Resources esteja definido
            if (Current != null && Current.Resources != Resources)
            {
                Current.Resources = Resources;
            }
            
            base.OnStartup(e);
            
            // Tratamento global de exceções
            this.DispatcherUnhandledException += App_DispatcherUnhandledException;
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

            try
            {
                var log = ResolveLogPath();
                File.AppendAllText(log, $"{DateTime.UtcNow:O} App.Startup args=[{string.Join(",", e.Args)}]{Environment.NewLine}");
            }
            catch { }
            
            // Criar e exibir a MainWindow
            try
            {
                var mainWindow = new MainWindow();
                mainWindow.Show();
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    $"Erro ao iniciar o instalador:\n{ex.Message}\n\n{ex.StackTrace}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );
                Shutdown();
            }
        }
        
        private void InitializeResourcesFallbackFirst()
        {
            if (Resources == null)
            {
                Resources = new ResourceDictionary();
            }
            
            // SEMPRE criar recursos fallback primeiro para garantir que estejam disponíveis
            CreateFallbackResources();
        }
        
        private void TryLoadXamlResources()
        {
            // Tentar carregar recursos XAML compilados (se disponíveis, adicionam aos fallback)
            try
            {
                var colorsUri = new System.Uri("/VoltrisOptimizerInstaller;component/Themes/Colors.xaml", System.UriKind.Relative);
                var stylesUri = new System.Uri("/VoltrisOptimizerInstaller;component/Themes/Styles.xaml", System.UriKind.Relative);
                
                var colorsDict = (ResourceDictionary)LoadComponent(colorsUri);
                var stylesDict = (ResourceDictionary)LoadComponent(stylesUri);
                
                // Adicionar aos recursos existentes (fallback já está lá)
                Resources.MergedDictionaries.Add(colorsDict);
                Resources.MergedDictionaries.Add(stylesDict);
            }
            catch
            {
                // Tentativa 2: Pack URI absoluto
                try
                {
                    var colorsUri = new System.Uri("pack://application:,,,/Themes/Colors.xaml", System.UriKind.Absolute);
                    var stylesUri = new System.Uri("pack://application:,,,/Themes/Styles.xaml", System.UriKind.Absolute);
                    
                    var colorsDict = (ResourceDictionary)LoadComponent(colorsUri);
                    var stylesDict = (ResourceDictionary)LoadComponent(stylesUri);
                    
                    Resources.MergedDictionaries.Add(colorsDict);
                    Resources.MergedDictionaries.Add(stylesDict);
                }
                catch
                {
                    // Se falhar, os recursos fallback já estão disponíveis
                }
            }
        }
        
        private void CreateFallbackResources()
        {
            // Cores base
            var darkColor = Color.FromRgb(23, 19, 19);
            var darkPanelColor = Color.FromRgb(28, 28, 30);
            var darkPanelAltColor = Color.FromRgb(42, 42, 46);
            var darkBorderColor = Color.FromRgb(58, 58, 62);
            var accentColor = Color.FromRgb(255, 75, 107);
            var secondaryColor = Color.FromRgb(139, 49, 255);
            var primaryColor = Color.FromRgb(49, 168, 255);
            var textPrimaryColor = Color.FromRgb(255, 255, 255);
            var textSecondaryColor = Color.FromRgb(224, 224, 224);
            
            // Brushes básicos
            Resources.Add("DarkBrush", new SolidColorBrush(darkColor));
            Resources.Add("DarkPanelBrush", new SolidColorBrush(darkPanelColor));
            Resources.Add("DarkPanelAltBrush", new SolidColorBrush(darkPanelAltColor));
            Resources.Add("DarkBorderBrush", new SolidColorBrush(darkBorderColor));
            Resources.Add("AccentBrush", new SolidColorBrush(accentColor));
            Resources.Add("SecondaryBrush", new SolidColorBrush(secondaryColor));
            Resources.Add("PrimaryBrush", new SolidColorBrush(primaryColor));
            Resources.Add("TextPrimaryBrush", new SolidColorBrush(textPrimaryColor));
            Resources.Add("TextSecondaryBrush", new SolidColorBrush(textSecondaryColor));
            
            // Brushes com blur (opacidade reduzida)
            var accentBlur = accentColor;
            accentBlur.A = 38; // ~15% opacidade
            Resources.Add("AccentBlurBrush", new SolidColorBrush(accentBlur));
            
            var secondaryBlur = secondaryColor;
            secondaryBlur.A = 38;
            Resources.Add("SecondaryBlurBrush", new SolidColorBrush(secondaryBlur));
            
            var primaryBlur = primaryColor;
            primaryBlur.A = 38;
            Resources.Add("PrimaryBlurBrush", new SolidColorBrush(primaryBlur));
            
            // Gradiente Voltris
            var voltrisGradient = new LinearGradientBrush
            {
                StartPoint = new System.Windows.Point(0, 0),
                EndPoint = new System.Windows.Point(1, 1)
            };
            voltrisGradient.GradientStops.Add(new GradientStop(accentColor, 0));
            voltrisGradient.GradientStops.Add(new GradientStop(secondaryColor, 0.5));
            voltrisGradient.GradientStops.Add(new GradientStop(primaryColor, 1));
            Resources.Add("VoltrisGradientBrush", voltrisGradient);
            
            var voltrisGradientHorizontal = new LinearGradientBrush
            {
                StartPoint = new System.Windows.Point(0, 0),
                EndPoint = new System.Windows.Point(1, 0)
            };
            voltrisGradientHorizontal.GradientStops.Add(new GradientStop(accentColor, 0));
            voltrisGradientHorizontal.GradientStops.Add(new GradientStop(secondaryColor, 0.5));
            voltrisGradientHorizontal.GradientStops.Add(new GradientStop(primaryColor, 1));
            Resources.Add("VoltrisGradientHorizontalBrush", voltrisGradientHorizontal);
            
            // Estilos básicos (simplificados)
            CreateBasicStyles();
        }
        
        private void CreateBasicStyles()
        {
            // Estilo de botão moderno com cantos arredondados e hover com gradiente Voltris
            var buttonStyle = new System.Windows.Style(typeof(Button));
            buttonStyle.Setters.Add(new Setter(Button.BackgroundProperty, Resources["VoltrisGradientBrush"]));
            buttonStyle.Setters.Add(new Setter(Button.ForegroundProperty, Brushes.White));
            buttonStyle.Setters.Add(new Setter(Button.BorderThicknessProperty, new Thickness(0)));
            buttonStyle.Setters.Add(new Setter(Button.PaddingProperty, new Thickness(24, 12, 24, 12)));
            buttonStyle.Setters.Add(new Setter(Button.FontFamilyProperty, new FontFamily("Segoe UI")));
            buttonStyle.Setters.Add(new Setter(Button.FontSizeProperty, 14.0));
            buttonStyle.Setters.Add(new Setter(Button.FontWeightProperty, FontWeights.SemiBold));
            buttonStyle.Setters.Add(new Setter(Button.MinHeightProperty, 44.0));
            buttonStyle.Setters.Add(new Setter(Button.MinWidthProperty, 120.0));
            buttonStyle.Setters.Add(new Setter(Button.CursorProperty, System.Windows.Input.Cursors.Hand));
            
            // Template com cantos arredondados
            var buttonTemplate = new ControlTemplate(typeof(Button));
            var borderFactory = new FrameworkElementFactory(typeof(Border));
            borderFactory.Name = "border";
            borderFactory.SetBinding(Border.BackgroundProperty, new Binding("Background") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            borderFactory.SetValue(Border.CornerRadiusProperty, new CornerRadius(8));
            borderFactory.SetBinding(Border.PaddingProperty, new Binding("Padding") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            
            var contentFactory = new FrameworkElementFactory(typeof(ContentPresenter));
            contentFactory.SetValue(ContentPresenter.HorizontalAlignmentProperty, HorizontalAlignment.Center);
            contentFactory.SetValue(ContentPresenter.VerticalAlignmentProperty, VerticalAlignment.Center);
            
            borderFactory.AppendChild(contentFactory);
            buttonTemplate.VisualTree = borderFactory;
            
            // Trigger para hover - manter gradiente Voltris (não azul)
            var hoverTrigger = new Trigger { Property = UIElement.IsMouseOverProperty, Value = true };
            hoverTrigger.Setters.Add(new Setter(Button.BackgroundProperty, Resources["VoltrisGradientBrush"]));
            buttonTemplate.Triggers.Add(hoverTrigger);
            
            buttonStyle.Setters.Add(new Setter(Button.TemplateProperty, buttonTemplate));
            Resources.Add("ModernButtonStyle", buttonStyle);
            
            // Estilo de botão secundário com cantos arredondados e hover com gradiente Voltris
            var secondaryButtonStyle = new System.Windows.Style(typeof(Button));
            secondaryButtonStyle.Setters.Add(new Setter(Button.BackgroundProperty, Resources["DarkPanelAltBrush"]));
            secondaryButtonStyle.Setters.Add(new Setter(Button.ForegroundProperty, Resources["TextPrimaryBrush"]));
            secondaryButtonStyle.Setters.Add(new Setter(Button.BorderBrushProperty, Resources["DarkBorderBrush"]));
            secondaryButtonStyle.Setters.Add(new Setter(Button.BorderThicknessProperty, new Thickness(1)));
            secondaryButtonStyle.Setters.Add(new Setter(Button.PaddingProperty, new Thickness(24, 12, 24, 12)));
            secondaryButtonStyle.Setters.Add(new Setter(Button.FontFamilyProperty, new FontFamily("Segoe UI")));
            secondaryButtonStyle.Setters.Add(new Setter(Button.FontSizeProperty, 14.0));
            secondaryButtonStyle.Setters.Add(new Setter(Button.FontWeightProperty, FontWeights.SemiBold));
            secondaryButtonStyle.Setters.Add(new Setter(Button.MinHeightProperty, 44.0));
            secondaryButtonStyle.Setters.Add(new Setter(Button.MinWidthProperty, 100.0));
            secondaryButtonStyle.Setters.Add(new Setter(Button.CursorProperty, System.Windows.Input.Cursors.Hand));
            
            // Template para botão secundário com cantos arredondados
            var secondaryTemplate = new ControlTemplate(typeof(Button));
            var secondaryBorderFactory = new FrameworkElementFactory(typeof(Border));
            secondaryBorderFactory.Name = "border";
            secondaryBorderFactory.SetBinding(Border.BackgroundProperty, new Binding("Background") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            secondaryBorderFactory.SetValue(Border.CornerRadiusProperty, new CornerRadius(8));
            secondaryBorderFactory.SetBinding(Border.BorderBrushProperty, new Binding("BorderBrush") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            secondaryBorderFactory.SetBinding(Border.BorderThicknessProperty, new Binding("BorderThickness") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            secondaryBorderFactory.SetBinding(Border.PaddingProperty, new Binding("Padding") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            
            var secondaryContentFactory = new FrameworkElementFactory(typeof(ContentPresenter));
            secondaryContentFactory.SetValue(ContentPresenter.HorizontalAlignmentProperty, HorizontalAlignment.Center);
            secondaryContentFactory.SetValue(ContentPresenter.VerticalAlignmentProperty, VerticalAlignment.Center);
            
            secondaryBorderFactory.AppendChild(secondaryContentFactory);
            secondaryTemplate.VisualTree = secondaryBorderFactory;
            
            // Hover para botão secundário - usar gradiente Voltris (não azul)
            var secondaryHoverTrigger = new Trigger { Property = UIElement.IsMouseOverProperty, Value = true };
            secondaryHoverTrigger.Setters.Add(new Setter(Button.BackgroundProperty, Resources["VoltrisGradientBrush"]));
            secondaryHoverTrigger.Setters.Add(new Setter(Button.ForegroundProperty, Brushes.White));
            secondaryHoverTrigger.Setters.Add(new Setter(Button.BorderBrushProperty, Brushes.Transparent));
            secondaryTemplate.Triggers.Add(secondaryHoverTrigger);
            
            secondaryButtonStyle.Setters.Add(new Setter(Button.TemplateProperty, secondaryTemplate));
            Resources.Add("SecondaryButtonStyle", secondaryButtonStyle);
        }

        private void App_DispatcherUnhandledException(object sender, DispatcherUnhandledExceptionEventArgs e)
        {
            try { File.AppendAllText(ResolveLogPath(), $"{DateTime.UtcNow:O} DispatcherUnhandledException: {e.Exception.Message}{Environment.NewLine}{e.Exception.StackTrace}{Environment.NewLine}"); } catch { }
            MessageBox.Show(
                $"Erro no instalador:\n{e.Exception.Message}\n\n{e.Exception.StackTrace}",
                "Erro",
                MessageBoxButton.OK,
                MessageBoxImage.Error
            );
            e.Handled = true;
        }

        private void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            var ex = e.ExceptionObject as Exception;
            try { File.AppendAllText(ResolveLogPath(), $"{DateTime.UtcNow:O} UnhandledException: {ex?.Message}{Environment.NewLine}{ex?.StackTrace}{Environment.NewLine}"); } catch { }
            MessageBox.Show(
                $"Erro crítico no instalador:\n{ex?.Message ?? "Erro desconhecido"}",
                "Erro Crítico",
                MessageBoxButton.OK,
                MessageBoxImage.Error
            );
        }

        private static string ResolveLogPath()
        {
            var candidates = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Voltris", "Uninstall", "uninstall.log"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Voltris", "Uninstall", "uninstall.log"),
                Path.Combine(Path.GetTempPath(), "Voltris", "Uninstall", "uninstall.log"),
                Path.Combine(Path.GetTempPath(), "uninstall.log")
            };
            foreach (var c in candidates)
            {
                try
                {
                    var dir = Path.GetDirectoryName(c);
                    if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir)) Directory.CreateDirectory(dir);
                    return c;
                }
                catch { }
            }
            return Path.Combine(Path.GetTempPath(), "uninstall.log");
        }
    }
}
