using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;

namespace VoltrisOptimizer.UI.Controls
{
    public partial class ModernMessageBox : Window
    {
        public string Message { get; set; } = "";
        public MessageBoxButton ButtonType { get; set; } = MessageBoxButton.OK;
        public MessageBoxImage IconType { get; set; } = MessageBoxImage.None;
        
        public MessageBoxResult Result { get; private set; } = MessageBoxResult.None;

        public ModernMessageBox()
        {
            InitializeComponent();
            DataContext = this;
        }

        public static MessageBoxResult Show(string messageBoxText, string caption, MessageBoxButton button, MessageBoxImage icon, Window? owner = null)
        {
            var dialog = new ModernMessageBox
            {
                Message = messageBoxText,
                ButtonType = button,
                IconType = icon,
                Owner = owner ?? Application.Current.MainWindow
            };
            
            // Definir título usando a propriedade herdada da Window
            dialog.Title = caption;
            dialog.TitleText.Text = caption;
            
            dialog.SetupIcon();
            dialog.SetupButtons();
            dialog.ShowDialog();
            
            return dialog.Result;
        }

        private void SetupIcon()
        {
            IconText.Text = IconType switch
            {
                MessageBoxImage.Question => "?",
                MessageBoxImage.Warning => "⚠",
                MessageBoxImage.Error => "✕",
                MessageBoxImage.Information => "ℹ",
                _ => ""
            };

            IconText.Foreground = IconType switch
            {
                MessageBoxImage.Question => new SolidColorBrush((Color)ColorConverter.ConvertFromString("#31A8FF")),
                MessageBoxImage.Warning => new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFB84D")),
                MessageBoxImage.Error => new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF3B3B")),
                MessageBoxImage.Information => new SolidColorBrush((Color)ColorConverter.ConvertFromString("#31A8FF")),
                _ => new SolidColorBrush(Colors.White)
            };
        }

        private void SetupButtons()
        {
            ButtonsPanel.Children.Clear();
            
            var localization = Services.LocalizationService.Instance;

            switch (ButtonType)
            {
                case MessageBoxButton.OK:
                    AddButton(localization.GetString("OK") ?? "OK", MessageBoxResult.OK, isPrimary: true);
                    break;
                case MessageBoxButton.OKCancel:
                    AddButton(localization.GetString("Cancel") ?? "Cancelar", MessageBoxResult.Cancel);
                    AddButton(localization.GetString("OK") ?? "OK", MessageBoxResult.OK, isPrimary: true);
                    break;
                case MessageBoxButton.YesNo:
                    AddButton(localization.GetString("No") ?? "Não", MessageBoxResult.No);
                    AddButton(localization.GetString("Yes") ?? "Sim", MessageBoxResult.Yes, isPrimary: true);
                    break;
                case MessageBoxButton.YesNoCancel:
                    AddButton(localization.GetString("Cancel") ?? "Cancelar", MessageBoxResult.Cancel);
                    AddButton(localization.GetString("No") ?? "Não", MessageBoxResult.No);
                    AddButton(localization.GetString("Yes") ?? "Sim", MessageBoxResult.Yes, isPrimary: true);
                    break;
            }
        }

        private void AddButton(string content, MessageBoxResult result, bool isPrimary = false)
        {
            var button = new Button
            {
                Content = content,
                MinWidth = 100,
                Height = 36,
                Margin = new Thickness(6, 0, 0, 0),
                Cursor = System.Windows.Input.Cursors.Hand,
                FontFamily = new FontFamily("Segoe UI"),
                FontSize = 13,
                FontWeight = FontWeights.SemiBold
            };

            if (isPrimary)
            {
                button.Background = (LinearGradientBrush)Application.Current.Resources["VoltrisGradientBrush"];
                button.Foreground = new SolidColorBrush(Colors.White);
            }
            else
            {
                button.Background = (SolidColorBrush)Application.Current.Resources["DarkPanelBrush"];
                button.Foreground = (SolidColorBrush)Application.Current.Resources["TextPrimaryBrush"];
                button.BorderBrush = (SolidColorBrush)Application.Current.Resources["DarkBorderBrush"];
                button.BorderThickness = new Thickness(1);
            }

            var style = new Style(typeof(Button));
            style.Setters.Add(new Setter(Control.TemplateProperty, CreateButtonTemplate(isPrimary)));
            
            var hoverTrigger = new Trigger { Property = UIElement.IsMouseOverProperty, Value = true };
            if (isPrimary)
            {
                // Manter gradiente no hover
                hoverTrigger.Setters.Add(new Setter(Control.OpacityProperty, 0.9));
            }
            else
            {
                hoverTrigger.Setters.Add(new Setter(Control.BackgroundProperty, Application.Current.Resources["DarkPanelAltBrush"]));
            }
            style.Triggers.Add(hoverTrigger);
            
            button.Style = style;
            
            button.Click += (s, e) =>
            {
                Result = result;
                DialogResult = result == MessageBoxResult.OK || result == MessageBoxResult.Yes;
                Close();
            };

            ButtonsPanel.Children.Add(button);
        }

        private ControlTemplate CreateButtonTemplate(bool isPrimary)
        {
            var template = new ControlTemplate(typeof(Button));
            
            var border = new FrameworkElementFactory(typeof(Border));
            border.Name = "border";
            border.SetValue(Border.CornerRadiusProperty, new CornerRadius(8));
            border.SetBinding(Border.BackgroundProperty, new System.Windows.Data.Binding("Background") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            border.SetBinding(Border.BorderBrushProperty, new System.Windows.Data.Binding("BorderBrush") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            border.SetBinding(Border.BorderThicknessProperty, new System.Windows.Data.Binding("BorderThickness") { RelativeSource = new RelativeSource(RelativeSourceMode.TemplatedParent) });
            
            var contentPresenter = new FrameworkElementFactory(typeof(ContentPresenter));
            contentPresenter.SetValue(ContentPresenter.HorizontalAlignmentProperty, HorizontalAlignment.Center);
            contentPresenter.SetValue(ContentPresenter.VerticalAlignmentProperty, VerticalAlignment.Center);
            contentPresenter.SetValue(ContentPresenter.MarginProperty, new Thickness(12, 8, 12, 8));
            
            border.AppendChild(contentPresenter);
            template.VisualTree = border;
            
            return template;
        }

        private void CloseButton_Click(object sender, RoutedEventArgs e)
        {
            Result = MessageBoxResult.Cancel;
            DialogResult = false;
            Close();
        }
    }
}
