using System;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;

namespace VoltrisOptimizer.UI.Windows
{
    public partial class SplashWindow : Window
    {
        private const double ProgressBarMaxWidth = 400;

        public SplashWindow()
        {
            InitializeComponent();
            
            // Carregar imagem de forma assíncrona para evitar travamento
            Loaded += async (s, e) => await InitializeAsync();
        }

        private async Task InitializeAsync()
        {
            try
            {
                // Pequeno delay para garantir que a UI renderizou
                await Task.Delay(50);
                
                // Carregar logo em background
                await Task.Run(() =>
                {
                    Dispatcher.Invoke(() =>
                    {
                        LoadLogo();
                        AdjustWindowSize();
                    });
                });
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[SPLASH] Erro ao inicializar: {ex.Message}", ex);
            }
        }

        public void SetProgress(double value)
        {
            try
            {
                if (!Dispatcher.CheckAccess())
                {
                    Dispatcher.BeginInvoke(() => SetProgressInternal(value));
                }
                else
                {
                    SetProgressInternal(value);
                }
            }
            catch { }
        }

        private void SetProgressInternal(double value)
        {
            var percentage = Math.Max(0, Math.Min(100, value));
            var targetWidth = (ProgressBarMaxWidth / 100.0) * percentage;
            
            // Animar a barra de progresso
            var animation = new DoubleAnimation
            {
                To = targetWidth,
                Duration = TimeSpan.FromMilliseconds(200),
                EasingFunction = new QuadraticEase { EasingMode = EasingMode.EaseOut }
            };
            ProgressFill.BeginAnimation(WidthProperty, animation);
        }

        public void SetStatus(string text)
        {
            try
            {
                if (!Dispatcher.CheckAccess())
                {
                    Dispatcher.BeginInvoke(() => StatusText.Text = text);
                }
                else
                {
                    StatusText.Text = text;
                }
            }
            catch { }
        }

        public async Task ShowForAsync(int milliseconds)
        {
            Show();
            await Task.Delay(milliseconds);
            Close();
        }

        private void LoadLogo()
        {
            try 
            {
                // Carregar diretamente do Recurso Embutido (Garantido pela build)
                var logoUri = new Uri("pack://application:,,,/Images/logo.png", UriKind.Absolute);
                
                var img = new BitmapImage();
                img.BeginInit();
                img.UriSource = logoUri;
                img.CreateOptions = BitmapCreateOptions.PreservePixelFormat;
                img.CacheOption = BitmapCacheOption.OnLoad;
                img.EndInit();
                img.Freeze();
                
                LogoImage.Source = img;
                App.LoggingService?.LogInfo($"[SPLASH] Imagem carregada: {logoUri}");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"[SPLASH] Erro ao carregar logo: {ex.Message}");
            }
        }

        private bool TryLoadImage(string path)
        {
            try
            {
                var img = new BitmapImage();
                img.BeginInit();
                img.UriSource = new Uri(path, UriKind.Absolute);
                img.CreateOptions = BitmapCreateOptions.PreservePixelFormat;
                img.CacheOption = BitmapCacheOption.OnLoad;
                img.EndInit();
                img.Freeze();
                LogoImage.Source = img;
                return true;
            }
            catch
            {
                return false;
            }
        }

        private bool TryLoadImageFromUri(Uri uri)
        {
            try
            {
                var img = new BitmapImage();
                img.BeginInit();
                img.UriSource = uri;
                img.CreateOptions = BitmapCreateOptions.PreservePixelFormat;
                img.CacheOption = BitmapCacheOption.OnLoad;
                img.EndInit();
                img.Freeze();
                LogoImage.Source = img;
                return true;
            }
            catch
            {
                return false;
            }
        }

        private static int GetImageResolutionScoreSafe(string path)
        {
            try
            {
                using var stream = System.IO.File.OpenRead(path);
                var frame = BitmapFrame.Create(stream, BitmapCreateOptions.DelayCreation, BitmapCacheOption.OnLoad);
                return frame.PixelWidth * frame.PixelHeight;
            }
            catch { return 0; }
        }

        private static int GetNameBias(string path)
        {
            var name = System.IO.Path.GetFileName(path).ToLowerInvariant();
            int bias = 0;
            if (name.Contains("splash")) bias += 3;
            if (name.Contains("logo")) bias += 2;
            if (name.Contains("voltris")) bias += 1;
            if (name.Contains("@2x") || name.Contains("_2x") || name.Contains("hd")) bias += 2;
            if (name.Contains("@3x") || name.Contains("_3x") || name.Contains("4k")) bias += 3;
            return bias;
        }

        private void AdjustWindowSize()
        {
            var workArea = SystemParameters.WorkArea;
            var shorterDimension = Math.Min(workArea.Width, workArea.Height);
            var targetHeight = Math.Max(340, Math.Min(450, shorterDimension * 0.35));

            Width = targetHeight * 1.55;
            Height = targetHeight;

            Left = workArea.Left + (workArea.Width - Width) / 2;
            Top = workArea.Top + (workArea.Height - Height) / 2;
        }
    }
}
