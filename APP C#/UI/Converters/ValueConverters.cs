using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;

namespace VoltrisOptimizer.UI.Converters
{
    /// <summary>
    /// Converte Boolean para Visibility (inverso)
    /// true = Collapsed, false = Visible
    /// </summary>
    public class InverseBoolToVisibilityConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is bool boolValue)
                return boolValue ? Visibility.Collapsed : Visibility.Visible;
            return Visibility.Visible;
        }
        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is Visibility visibility)
                return visibility != Visibility.Visible;
            return false;
        }
    }

    /// <summary>
    /// Converte Boolean para Visibility (inverso) — alias legado
    /// true = Collapsed, false = Visible
    /// </summary>
    public class InverseBooleanToVisibilityConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is bool boolValue)
            {
                return boolValue ? Visibility.Collapsed : Visibility.Visible;
            }
            return Visibility.Visible;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is Visibility visibility)
            {
                return visibility != Visibility.Visible;
            }
            return false;
        }
    }

    /// <summary>
    /// Converte null para Visibility
    /// null = Collapsed, não-null = Visible
    /// </summary>
    public class NullToVisibilityConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            bool invert = parameter?.ToString()?.ToLower() == "invert";
            bool isNull = value == null || (value is string s && string.IsNullOrEmpty(s));
            
            if (invert)
            {
                return isNull ? Visibility.Visible : Visibility.Collapsed;
            }
            return isNull ? Visibility.Collapsed : Visibility.Visible;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }

    /// <summary>
    /// Formata valor como porcentagem
    /// </summary>
    public class PercentageConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is double d)
            {
                return $"{d:F0}%";
            }
            if (value is float f)
            {
                return $"{f:F0}%";
            }
            if (value is int i)
            {
                return $"{i}%";
            }
            return "0%";
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is string s && s.EndsWith("%"))
            {
                if (double.TryParse(s.TrimEnd('%'), out double result))
                {
                    return result;
                }
            }
            return 0.0;
        }
    }

    /// <summary>
    /// Formata tamanho de arquivo em formato legível
    /// </summary>
    public class FileSizeConverter : IValueConverter
    {
        private static readonly string[] Sizes = { "B", "KB", "MB", "GB", "TB" };

        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            double bytes = 0;
            
            if (value is long l)
                bytes = l;
            else if (value is int i)
                bytes = i;
            else if (value is double d)
                bytes = d;
            else if (value is float f)
                bytes = f;
            else
                return "0 B";

            if (bytes < 0)
                return "0 B";

            int order = 0;
            while (bytes >= 1024 && order < Sizes.Length - 1)
            {
                order++;
                bytes /= 1024;
            }

            return $"{bytes:0.##} {Sizes[order]}";
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }

    /// <summary>
    /// Converte Boolean para Brush (cor)
    /// </summary>
    public class BooleanToBrushConverter : IValueConverter
    {
        public System.Windows.Media.Brush? TrueBrush { get; set; }
        public System.Windows.Media.Brush? FalseBrush { get; set; }

        public object? Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is bool boolValue)
            {
                return boolValue ? TrueBrush : FalseBrush;
            }
            return FalseBrush;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }

    /// <summary>
    /// Converte status para cor
    /// </summary>
    public class StatusToColorConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            var status = value?.ToString()?.ToLowerInvariant() ?? "";
            
            return status switch
            {
                "success" or "ok" or "good" or "ativo" or "active" => 
                    System.Windows.Application.Current.Resources["SuccessBrush"],
                "warning" or "atenção" or "attention" => 
                    System.Windows.Application.Current.Resources["WarningBrush"],
                "error" or "erro" or "fail" or "failed" => 
                    System.Windows.Application.Current.Resources["ErrorBrush"],
                "info" or "information" => 
                    System.Windows.Application.Current.Resources["InfoBrush"],
                _ => System.Windows.Application.Current.Resources["TextMutedBrush"]
            };
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }

    /// <summary>
    /// Multiplica valor por um fator
    /// </summary>
    public class MultiplyConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is double d && parameter != null)
            {
                if (double.TryParse(parameter.ToString(), out double factor))
                {
                    return d * factor;
                }
            }
            return value;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is double d && parameter != null)
            {
                if (double.TryParse(parameter.ToString(), out double factor) && factor != 0)
                {
                    return d / factor;
                }
            }
            return value;
        }
    }

    /// <summary>
    /// Converte string vazia para visibility
    /// </summary>
    public class StringToVisibilityConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return string.IsNullOrWhiteSpace(value?.ToString()) 
                ? Visibility.Collapsed 
                : Visibility.Visible;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }

    /// <summary>
    /// Converte valor numérico para largura baseada em porcentagem
    /// </summary>
    public class PercentageToWidthConverter : IMultiValueConverter
    {
        public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture)
        {
            if (values.Length >= 2 && 
                values[0] is double percentage && 
                values[1] is double containerWidth)
            {
                return (percentage / 100.0) * containerWidth;
            }
            return 0.0;
        }

        public object[] ConvertBack(object value, Type[] targetTypes, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }



    /// <summary>
    /// Converte Boolean para Cor (Brush)
    /// true = SuccessBrush (verde), false = TextMutedBrush (cinza)
    /// </summary>
    public class BooleanToColorConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is bool boolValue)
            {
                if (boolValue)
                {
                    // Ativo - cor verde/sucesso
                    return System.Windows.Application.Current?.Resources["SuccessBrush"] 
                        ?? new System.Windows.Media.SolidColorBrush(System.Windows.Media.Colors.LimeGreen);
                }
                else
                {
                    // Inativo - cor cinza
                    return System.Windows.Application.Current?.Resources["TextMutedBrush"] 
                        ?? new System.Windows.Media.SolidColorBrush(System.Windows.Media.Colors.Gray);
                }
            }
            return System.Windows.Application.Current?.Resources["TextMutedBrush"] 
                ?? new System.Windows.Media.SolidColorBrush(System.Windows.Media.Colors.Gray);
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }

    /// <summary>
    /// Converte TimeSpan para string legível
    /// </summary>
    public class TimeSpanToStringConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is TimeSpan ts)
            {
                if (ts.TotalDays >= 1)
                    return $"{ts.Days}d {ts.Hours}h";
                if (ts.TotalHours >= 1)
                    return $"{ts.Hours}h {ts.Minutes}m";
                if (ts.TotalMinutes >= 1)
                    return $"{ts.Minutes}m {ts.Seconds}s";
                return $"{ts.Seconds}s";
            }
            return "N/A";
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
    /// <summary>
    /// Converte Boolean de Throttling para Cor
    /// true = ErrorBrush (vermelho), false = SuccessBrush (verde)
    /// </summary>
    public class BooleanToThrottleBrushConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is bool boolValue)
            {
                if (boolValue)
                    return System.Windows.Application.Current?.Resources["ErrorBrush"] ?? System.Windows.Media.Brushes.Red;
                else
                    return System.Windows.Application.Current?.Resources["SuccessBrush"] ?? System.Windows.Media.Brushes.Green;
            }
            return System.Windows.Application.Current?.Resources["SuccessBrush"] ?? System.Windows.Media.Brushes.Green;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture) => throw new NotImplementedException();
    }

    /// <summary>
    /// Converte estado do modo gamer e nome do jogo em texto de status amigável
    /// </summary>
    public class GamerModeStatusConverter : IMultiValueConverter
    {
        public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture)
        {
            if (values.Length >= 2 && values[0] is bool isActive)
            {
                if (!isActive) return "Modo Gamer: Inativo";

                string? gameName = values[1]?.ToString();
                return string.IsNullOrEmpty(gameName)
                    ? "Modo Gamer: Ativo ⚡"
                    : $"Modo Gamer: Ativo ({gameName})";
            }
            return "Modo Gamer: Inativo";
        }

        public object[] ConvertBack(object value, Type[] targetTypes, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
    
    /// <summary>
    /// Converte estado ativo/inativo para cor da sombra
    /// </summary>
    public class InactiveToRedShadowConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is bool isActive && isActive)
            {
                // Ativo - sombra verde
                return System.Windows.Media.Color.FromRgb(16, 185, 129);
            }
            else
            {
                // Inativo - sombra vermelha
                return System.Windows.Media.Color.FromRgb(239, 68, 68);
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }

    /// <summary>
    /// Converte System.Windows.Media.Color para SolidColorBrush
    /// </summary>
    public class ColorToBrushConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is System.Windows.Media.Color color)
            {
                return new System.Windows.Media.SolidColorBrush(color);
            }
            return System.Windows.Media.Brushes.Transparent;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }

    /// <summary>
    /// Converte ActionType para um ícone (Path Geometry)
    /// </summary>
    public class ActionToIconConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            try
            {
                if (value is string s && Enum.TryParse(s, out VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionType parsedType))
                {
                    value = parsedType;
                }

                if (value is VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionType type)
                {
                    string key = type switch
                    {
                        VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionType.SystemCleanup => "CleanupIcon",
                        VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionType.Storage_EnableTrim => "BoltIcon",
                        VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionType.Storage_DisableSuperfetch => "SettingsIcon",
                        VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionType.Network_FlushDns => "NetworkIcon",
                        VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionType.PowerPlan_HighPerformance => "BoltIcon",
                        VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionType.Memory_Optimize => "SystemIcon",
                        VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionType.Process_Optimize => "PerformanceIcon",
                        _ => "DiagnosticsIcon"
                    };
                    
                    return Application.Current.Resources[key] ?? Application.Current.Resources["DiagnosticsIcon"];
                }
            }
            catch { }
            return Application.Current.Resources["DiagnosticsIcon"];
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture) => throw new NotImplementedException();
    }

    /// <summary>
    /// Converte progresso (0-100) em StrokeDashArray para efeito circular
    /// </summary>
    public class CircularProgressConverter : IMultiValueConverter
    {
        public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture)
        {
            if (values != null && values.Length > 0 && values[0] is double progress)
            {
                // Para um círculo de 200px de diâmetro com stroke de 18px:
                // Raio efetivo = (200 - 18) / 2 = 91
                // Circunferência = 2 * π * 91 ≈ 571.77
                double circumference = 571.77;
                double dash = (progress / 100.0) * circumference;
                return new System.Windows.Media.DoubleCollection(new double[] { dash, circumference });
            }
            return new System.Windows.Media.DoubleCollection(new double[] { 0, 571.77 });
        }

        public object[] ConvertBack(object value, Type[] targetTypes, object parameter, CultureInfo culture) 
            => throw new NotImplementedException();
    }

    /// <summary>
    /// Converte temperatura (0-100°C) para largura de barra (0-50px)
    /// </summary>
    public class TemperatureToWidthConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is double temperature)
            {
                // Mapear 0-100°C para 0-50px
                double width = Math.Max(0, Math.Min(50, temperature * 0.5));
                return width;
            }
            return 0.0;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }

    /// <summary>
    /// Converte string hex (#RRGGBB / #AARRGGBB) para SolidColorBrush
    /// </summary>
    public class HexStringToBrushConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is string hex && !string.IsNullOrWhiteSpace(hex))
            {
                try
                {
                    var color = (System.Windows.Media.Color)System.Windows.Media.ColorConverter.ConvertFromString(hex);
                    return new System.Windows.Media.SolidColorBrush(color);
                }
                catch { }
            }
            return System.Windows.Media.Brushes.Transparent;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
            => throw new NotImplementedException();
    }

    /// <summary>
    /// Converte Boolean para Opacity: true = 1.0, false = 0.4
    /// Usado para indicar visualmente que um controle está desabilitado.
    /// </summary>
    public class BoolToOpacityConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
            => value is bool b && b ? 1.0 : 0.4;

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
            => throw new NotImplementedException();
    }

    /// <summary>
    /// Converte int para bool (true se value == ConverterParameter).
    /// ConvertBack: retorna o int do ConverterParameter quando bool=true.
    /// Usado para vincular RadioButtons a uma propriedade int no ViewModel.
    /// </summary>
    public class EqualToIntConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is int intVal && parameter is string paramStr && int.TryParse(paramStr, out int paramInt))
                return intVal == paramInt;
            return false;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is bool b && b && parameter is string paramStr && int.TryParse(paramStr, out int paramInt))
                return paramInt;
            return System.Windows.Data.Binding.DoNothing;
        }
    }

    /// <summary>
    /// Retorna true se os dois valores fornecidos são iguais (por referência ou Equals).
    /// Usado para marcar o card de cursor selecionado via DataTrigger + MultiBinding.
    /// </summary>
    public class ObjectEqualsConverter : IMultiValueConverter
    {
        public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture)
        {
            if (values == null || values.Length < 2) return false;
            if (values[0] == null && values[1] == null) return true;
            return values[0]?.Equals(values[1]) ?? false;
        }

        public object[] ConvertBack(object value, Type[] targetTypes, object parameter, CultureInfo culture)
            => throw new NotImplementedException();
    }
}
