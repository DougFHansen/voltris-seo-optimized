using System;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Media;
using System.Windows.Media.Effects;

namespace VoltrisUninstaller
{
    public partial class App : Application
    {
        public App()
        {
            // CRÍTICO: Criar recursos ANTES de qualquer XAML ser processado
            InitializeResources();
        }
        
        protected override void OnStartup(StartupEventArgs e)
        {
            // Garantir que recursos estejam disponíveis
            if (Resources == null)
            {
                Resources = new ResourceDictionary();
                InitializeResources();
            }
            
            // NÃO carregar recursos XAML - tudo é criado programaticamente para evitar erros de StaticResource
            
            base.OnStartup(e);
            
            // Tratamento global de exceções
            this.DispatcherUnhandledException += App_DispatcherUnhandledException;
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;
        }
        
        private void InitializeResources()
        {
            if (Resources == null)
            {
                Resources = new ResourceDictionary();
            }
            
            // Criar recursos fallback IMEDIATAMENTE
            CreateFallbackResources();
            
            // Garantir que Application.Current.Resources também esteja definido
            if (Current != null && Current.Resources != Resources)
            {
                Current.Resources = Resources;
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
            
            // Brushes com blur
            var accentBlur = accentColor;
            accentBlur.A = 38;
            Resources.Add("AccentBlurBrush", new SolidColorBrush(accentBlur));
            
            var secondaryBlur = secondaryColor;
            secondaryBlur.A = 38;
            Resources.Add("SecondaryBlurBrush", new SolidColorBrush(secondaryBlur));
            
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
            
            // Estilos básicos
            CreateBasicStyles();
        }
        
        private void CreateBasicStyles()
        {
            // Estilo de botão moderno COM BORDAS ARREDONDADAS
            var buttonStyle = new System.Windows.Style(typeof(System.Windows.Controls.Button));
            buttonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.BackgroundProperty, Resources["VoltrisGradientBrush"]));
            buttonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.ForegroundProperty, Brushes.White));
            buttonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.BorderThicknessProperty, new Thickness(0)));
            buttonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.PaddingProperty, new Thickness(24, 12, 24, 12)));
            buttonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.FontFamilyProperty, new FontFamily("Segoe UI")));
            buttonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.FontSizeProperty, 14.0));
            buttonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.FontWeightProperty, FontWeights.SemiBold));
            buttonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.MinHeightProperty, 44.0));
            buttonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.MinWidthProperty, 120.0));
            buttonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.CursorProperty, System.Windows.Input.Cursors.Hand));
            
            // Template com bordas arredondadas (CornerRadius="8")
            var buttonTemplate = new System.Windows.Controls.ControlTemplate(typeof(System.Windows.Controls.Button));
            var buttonBorderFactory = new System.Windows.FrameworkElementFactory(typeof(Border));
            buttonBorderFactory.Name = "border";
            buttonBorderFactory.SetBinding(Border.BackgroundProperty, new Binding("Background") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            buttonBorderFactory.SetValue(Border.CornerRadiusProperty, new CornerRadius(8)); // BORDAS ARREDONDADAS
            buttonBorderFactory.SetBinding(Border.PaddingProperty, new Binding("Padding") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            
            // Efeito de sombra
            var dropShadow = new DropShadowEffect
            {
                BlurRadius = 10,
                ShadowDepth = 0,
                Opacity = 0.5,
                Color = Color.FromRgb(49, 168, 255) // #31A8FF
            };
            buttonBorderFactory.SetValue(Border.EffectProperty, dropShadow);
            
            var contentPresenterFactory = new System.Windows.FrameworkElementFactory(typeof(ContentPresenter));
            contentPresenterFactory.SetValue(ContentPresenter.HorizontalAlignmentProperty, HorizontalAlignment.Center);
            contentPresenterFactory.SetValue(ContentPresenter.VerticalAlignmentProperty, VerticalAlignment.Center);
            
            buttonBorderFactory.AppendChild(contentPresenterFactory);
            buttonTemplate.VisualTree = buttonBorderFactory;
            
            // RenderTransform para animação
            buttonStyle.Setters.Add(new Setter(System.Windows.Controls.Button.RenderTransformProperty, new TranslateTransform()));
            
            buttonStyle.Setters.Add(new Setter(System.Windows.Controls.Button.TemplateProperty, buttonTemplate));
            Resources.Add("ModernButtonStyle", buttonStyle);
            
            // Estilo de botão secundário COM BORDAS ARREDONDADAS
            var secondaryButtonStyle = new System.Windows.Style(typeof(System.Windows.Controls.Button));
            secondaryButtonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.BackgroundProperty, Resources["DarkPanelAltBrush"]));
            secondaryButtonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.ForegroundProperty, Resources["TextPrimaryBrush"]));
            secondaryButtonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.BorderBrushProperty, Resources["DarkBorderBrush"]));
            secondaryButtonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.BorderThicknessProperty, new Thickness(1)));
            secondaryButtonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.PaddingProperty, new Thickness(24, 12, 24, 12)));
            secondaryButtonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.FontFamilyProperty, new FontFamily("Segoe UI")));
            secondaryButtonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.FontSizeProperty, 14.0));
            secondaryButtonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.FontWeightProperty, FontWeights.SemiBold));
            secondaryButtonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.MinHeightProperty, 44.0));
            secondaryButtonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.MinWidthProperty, 100.0));
            secondaryButtonStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.Button.CursorProperty, System.Windows.Input.Cursors.Hand));
            
            // Template com bordas arredondadas
            var secondaryButtonTemplate = new System.Windows.Controls.ControlTemplate(typeof(System.Windows.Controls.Button));
            var secondaryBorderFactory = new System.Windows.FrameworkElementFactory(typeof(Border));
            secondaryBorderFactory.Name = "border";
            secondaryBorderFactory.SetBinding(Border.BackgroundProperty, new Binding("Background") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            secondaryBorderFactory.SetValue(Border.CornerRadiusProperty, new CornerRadius(8)); // BORDAS ARREDONDADAS
            secondaryBorderFactory.SetBinding(Border.BorderBrushProperty, new Binding("BorderBrush") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            secondaryBorderFactory.SetBinding(Border.BorderThicknessProperty, new Binding("BorderThickness") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            secondaryBorderFactory.SetBinding(Border.PaddingProperty, new Binding("Padding") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            
            var secondaryContentFactory = new System.Windows.FrameworkElementFactory(typeof(ContentPresenter));
            secondaryContentFactory.SetValue(ContentPresenter.HorizontalAlignmentProperty, HorizontalAlignment.Center);
            secondaryContentFactory.SetValue(ContentPresenter.VerticalAlignmentProperty, VerticalAlignment.Center);
            
            secondaryBorderFactory.AppendChild(secondaryContentFactory);
            secondaryButtonTemplate.VisualTree = secondaryBorderFactory;
            
            // Hover com gradiente Voltris
            var secondaryHoverTrigger = new Trigger { Property = UIElement.IsMouseOverProperty, Value = true };
            secondaryHoverTrigger.Setters.Add(new Setter(System.Windows.Controls.Button.BackgroundProperty, Resources["VoltrisGradientBrush"]));
            secondaryHoverTrigger.Setters.Add(new Setter(System.Windows.Controls.Button.ForegroundProperty, Brushes.White));
            secondaryHoverTrigger.Setters.Add(new Setter(System.Windows.Controls.Button.BorderBrushProperty, Brushes.Transparent));
            secondaryButtonTemplate.Triggers.Add(secondaryHoverTrigger);
            
            secondaryButtonStyle.Setters.Add(new Setter(System.Windows.Controls.Button.TemplateProperty, secondaryButtonTemplate));
            secondaryButtonStyle.Setters.Add(new Setter(System.Windows.Controls.Button.RenderTransformProperty, new TranslateTransform()));
            Resources.Add("SecondaryButtonStyle", secondaryButtonStyle);
            
            // Estilos de texto e checkbox (CRÍTICOS para o MainWindow.xaml)
            var titleStyle = new System.Windows.Style(typeof(System.Windows.Controls.TextBlock));
            titleStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.TextBlock.ForegroundProperty, Resources["TextPrimaryBrush"]));
            titleStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.TextBlock.FontFamilyProperty, new FontFamily("Segoe UI")));
            titleStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.TextBlock.FontSizeProperty, 28.0));
            titleStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.TextBlock.FontWeightProperty, FontWeights.Bold));
            titleStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.TextBlock.MarginProperty, new Thickness(0, 0, 0, 8)));
            Resources.Add("TitleTextStyle", titleStyle);
            
            var descStyle = new System.Windows.Style(typeof(System.Windows.Controls.TextBlock));
            descStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.TextBlock.ForegroundProperty, Resources["TextSecondaryBrush"]));
            descStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.TextBlock.FontFamilyProperty, new FontFamily("Segoe UI")));
            descStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.TextBlock.FontSizeProperty, 14.0));
            descStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.TextBlock.TextWrappingProperty, TextWrapping.Wrap));
            descStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.TextBlock.MarginProperty, new Thickness(0, 0, 0, 24)));
            Resources.Add("DescriptionTextStyle", descStyle);
            
            var checkboxStyle = new System.Windows.Style(typeof(System.Windows.Controls.CheckBox));
            checkboxStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.CheckBox.ForegroundProperty, Resources["TextPrimaryBrush"]));
            checkboxStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.CheckBox.FontFamilyProperty, new FontFamily("Segoe UI")));
            checkboxStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.CheckBox.FontSizeProperty, 13.0));
            checkboxStyle.Setters.Add(new System.Windows.Setter(System.Windows.Controls.CheckBox.MarginProperty, new Thickness(0, 8, 0, 8)));
            Resources.Add("ModernCheckBoxStyle", checkboxStyle);
            
            // Criar estilos de ScrollBar programaticamente (SEM usar XAML)
            CreateScrollBarStylesProgrammatically();
        }
        
        private void CreateScrollBarStylesProgrammatically()
        {
            // SOLUÇÃO SIMPLIFICADA: Criar apenas o estilo do Thumb e aplicar globalmente
            // O ScrollBar padrão do WPF vai usar esse Thumb automaticamente
            
            // 1. Thumb do ScrollBar com gradiente roxo/rosa
            var thumbStyle = new System.Windows.Style(typeof(System.Windows.Controls.Primitives.Thumb));
            var thumbTemplate = new System.Windows.Controls.ControlTemplate(typeof(System.Windows.Controls.Primitives.Thumb));
            
            var thumbBorderFactory = new System.Windows.FrameworkElementFactory(typeof(Border));
            thumbBorderFactory.Name = "ThumbBorder";
            thumbBorderFactory.SetValue(Border.CornerRadiusProperty, new CornerRadius(4));
            thumbBorderFactory.SetValue(Border.OpacityProperty, 0.85);
            
            // Gradiente roxo/rosa (igual ao instalador)
            var thumbGradient = new LinearGradientBrush
            {
                StartPoint = new System.Windows.Point(0, 0),
                EndPoint = new System.Windows.Point(0, 1)
            };
            thumbGradient.GradientStops.Add(new GradientStop(Color.FromRgb(139, 49, 255), 0)); // #8B31FF
            thumbGradient.GradientStops.Add(new GradientStop(Color.FromRgb(255, 75, 107), 1)); // #FF4B6B
            thumbBorderFactory.SetValue(Border.BackgroundProperty, thumbGradient);
            
            thumbTemplate.VisualTree = thumbBorderFactory;
            
            // Trigger para hover
            var thumbHoverTrigger = new Trigger { Property = UIElement.IsMouseOverProperty, Value = true };
            var opacitySetter = new Setter(Border.OpacityProperty, 1.0);
            opacitySetter.TargetName = "ThumbBorder";
            thumbHoverTrigger.Setters.Add(opacitySetter);
            thumbTemplate.Triggers.Add(thumbHoverTrigger);
            
            thumbStyle.Setters.Add(new Setter(System.Windows.Controls.Control.TemplateProperty, thumbTemplate));
            
            // APLICAR GLOBALMENTE para TODOS os Thumbs (isso fará o scrollbar aparecer com o estilo)
            Resources.Add(typeof(System.Windows.Controls.Primitives.Thumb), thumbStyle);
            Resources.Add("ModernScrollBarThumbStyle", thumbStyle);
            
            // 2. ScrollBar - estilo simples que apenas define largura
            var scrollBarStyle = new System.Windows.Style(typeof(System.Windows.Controls.Primitives.ScrollBar));
            scrollBarStyle.Setters.Add(new Setter(System.Windows.Controls.Control.BackgroundProperty, Brushes.Transparent));
            scrollBarStyle.Setters.Add(new Setter(System.Windows.FrameworkElement.WidthProperty, 8.0));
            scrollBarStyle.Setters.Add(new Setter(System.Windows.FrameworkElement.MinWidthProperty, 8.0));
            
            // Template do ScrollBar com Track e background
            var scrollBarTemplate = new System.Windows.Controls.ControlTemplate(typeof(System.Windows.Controls.Primitives.ScrollBar));
            var scrollBarGridFactory = new System.Windows.FrameworkElementFactory(typeof(Grid));
            
            // Background escuro semi-transparente (track background)
            var trackBackgroundFactory = new System.Windows.FrameworkElementFactory(typeof(Border));
            trackBackgroundFactory.SetValue(Border.BackgroundProperty, new SolidColorBrush(Color.FromRgb(28, 28, 30)));
            trackBackgroundFactory.SetValue(Border.CornerRadiusProperty, new CornerRadius(4));
            trackBackgroundFactory.SetValue(Border.OpacityProperty, 0.15);
            scrollBarGridFactory.AppendChild(trackBackgroundFactory);
            
            // Track - o Thumb será criado automaticamente e usará o estilo global
            var trackFactory = new System.Windows.FrameworkElementFactory(typeof(Track));
            trackFactory.Name = "PART_Track";
            trackFactory.SetValue(Track.IsDirectionReversedProperty, true);
            scrollBarGridFactory.AppendChild(trackFactory);
            
            scrollBarTemplate.VisualTree = scrollBarGridFactory;
            scrollBarStyle.Setters.Add(new Setter(System.Windows.Controls.Control.TemplateProperty, scrollBarTemplate));
            
            Resources.Add("ModernScrollBarStyle", scrollBarStyle);
            
            // Aplicar estilo padrão para TODOS os ScrollBars
            var defaultScrollBarStyle = new System.Windows.Style(typeof(System.Windows.Controls.Primitives.ScrollBar));
            defaultScrollBarStyle.BasedOn = scrollBarStyle;
            Resources.Add(typeof(System.Windows.Controls.Primitives.ScrollBar), defaultScrollBarStyle);
            
            // 3. ScrollBar Vertical
            var verticalScrollBarStyle = new System.Windows.Style(typeof(System.Windows.Controls.Primitives.ScrollBar));
            verticalScrollBarStyle.BasedOn = scrollBarStyle;
            verticalScrollBarStyle.Setters.Add(new Setter(System.Windows.Controls.Primitives.ScrollBar.OrientationProperty, Orientation.Vertical));
            verticalScrollBarStyle.Setters.Add(new Setter(System.Windows.FrameworkElement.WidthProperty, 8.0));
            Resources.Add("ModernVerticalScrollBarStyle", verticalScrollBarStyle);
            
            // 4. ScrollViewer - estilo simples (usa ScrollBar padrão que já tem o Thumb customizado)
            var scrollViewerStyle = new System.Windows.Style(typeof(System.Windows.Controls.ScrollViewer));
            scrollViewerStyle.Setters.Add(new Setter(System.Windows.Controls.ScrollViewer.VerticalScrollBarVisibilityProperty, ScrollBarVisibility.Auto));
            scrollViewerStyle.Setters.Add(new Setter(System.Windows.Controls.ScrollViewer.HorizontalScrollBarVisibilityProperty, ScrollBarVisibility.Auto));
            Resources.Add("ModernScrollViewerStyle", scrollViewerStyle);
            
            // Aplicar estilo padrão para TODOS os ScrollViewers
            var defaultScrollViewerStyle = new System.Windows.Style(typeof(System.Windows.Controls.ScrollViewer));
            defaultScrollViewerStyle.BasedOn = scrollViewerStyle;
            Resources.Add(typeof(System.Windows.Controls.ScrollViewer), defaultScrollViewerStyle);
        }

        private void App_DispatcherUnhandledException(object sender, System.Windows.Threading.DispatcherUnhandledExceptionEventArgs e)
        {
            try 
            { 
                var logPath = Path.Combine(Path.GetTempPath(), "VoltrisUninstaller", "error.log");
                Directory.CreateDirectory(Path.GetDirectoryName(logPath)!);
                File.AppendAllText(logPath, $"{DateTime.UtcNow:O} DispatcherUnhandledException: {e.Exception.Message}{Environment.NewLine}{e.Exception.StackTrace}{Environment.NewLine}"); 
            } 
            catch { }
            
            MessageBox.Show(
                $"Erro no desinstalador:\n{e.Exception.Message}\n\n{e.Exception.StackTrace}",
                "Erro",
                MessageBoxButton.OK,
                MessageBoxImage.Error
            );
            e.Handled = true;
        }

        private void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            var ex = e.ExceptionObject as Exception;
            try 
            { 
                var logPath = Path.Combine(Path.GetTempPath(), "VoltrisUninstaller", "error.log");
                Directory.CreateDirectory(Path.GetDirectoryName(logPath)!);
                File.AppendAllText(logPath, $"{DateTime.UtcNow:O} UnhandledException: {ex?.Message}{Environment.NewLine}{ex?.StackTrace}{Environment.NewLine}"); 
            } 
            catch { }
            
            MessageBox.Show(
                $"Erro crítico no desinstalador:\n{ex?.Message ?? "Erro desconhecido"}",
                "Erro Crítico",
                MessageBoxButton.OK,
                MessageBoxImage.Error
            );
        }
    }
}



