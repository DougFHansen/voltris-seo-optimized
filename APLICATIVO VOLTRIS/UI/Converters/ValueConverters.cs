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
    /// Converte Boolean para Boolean (inverso)
    /// </summary>
    public class InverseBooleanConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is bool boolValue)
                return !boolValue;
            return true;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is bool boolValue)
                return !boolValue;
            return false;
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
}

