using System.Windows;

namespace VoltrisOptimizer.UI.Views
{
    public partial class BenchmarkTutorialPage : Window
    {
        public BenchmarkTutorialPage()
        {
            InitializeComponent();
        }

        private void BtnClose_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}
