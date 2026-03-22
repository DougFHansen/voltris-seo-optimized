using System;
using System.Globalization;
using System.Windows.Data;

namespace VoltrisOptimizer.UI.Converters
{
    /// <summary>
    /// Converte um valor booleano para texto de status (Ativo/Inativo).
    /// </summary>
    public class BooleanToStatusTextConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is bool b)
            {
                return b ? "Ativo" : "Inativo";
            }
            return "Desconhecido";
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
