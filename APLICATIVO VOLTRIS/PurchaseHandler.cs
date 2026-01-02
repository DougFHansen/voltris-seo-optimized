using System;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;

public partial class PurchaseHandler
{
    /// <summary>
    /// Manipula o clique no botão de compra
    /// </summary>
    /// <param name="planType">Tipo do plano (trial, pro, premium, enterprise)</param>
    private async void OnPurchaseButtonClick(object sender, RoutedEventArgs e, string planType = "pro")
    {
        try
        {
            using (HttpClient client = new HttpClient())
            {
                // URL da API com parâmetros de plano
                // IMPORTANTE: planType deve ser: trial, pro, premium ou enterprise
                var apiUrlBuilder = new StringBuilder("https://voltris.com.br/api/pagamento");
                apiUrlBuilder.Append($"?plan={planType}");
                string apiUrl = apiUrlBuilder.ToString();
                
                HttpResponseMessage response = await client.GetAsync(apiUrl);
                
                if (response.IsSuccessStatusCode)
                {
                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    var jsonDocument = JsonDocument.Parse(jsonResponse);
                    
                    if (jsonDocument.RootElement.TryGetProperty("init_point", out var urlElement))
                    {
                        string paymentUrl = urlElement.GetString();
                        
                        if (!string.IsNullOrEmpty(paymentUrl))
                        {
                            // Open URL in default browser
                            ProcessStartInfo psi = new ProcessStartInfo
                            {
                                FileName = paymentUrl,
                                UseShellExecute = true
                            };
                            Process.Start(psi);
                        }
                        else
                        {
                            MessageBox.Show("URL de pagamento inválida recebida da API.", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
                        }
                    }
                    else if (jsonDocument.RootElement.TryGetProperty("error", out var errorElement))
                    {
                        string errorMsg = errorElement.GetString() ?? "Erro desconhecido";
                        MessageBox.Show($"Erro na API: {errorMsg}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
                    }
                    else
                    {
                        MessageBox.Show("Resposta da API em formato inesperado.", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
                    }
                }
                else
                {
                    string errorContent = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Falha na requisição: {response.StatusCode}\n{errorContent}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Erro ao processar pagamento: {ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }
    
    // Métodos helper para cada plano
    private async void OnPurchaseTrialClick(object sender, RoutedEventArgs e) => 
        await Task.Run(() => OnPurchaseButtonClick(sender, e, "trial"));
    
    private async void OnPurchaseProClick(object sender, RoutedEventArgs e) => 
        await Task.Run(() => OnPurchaseButtonClick(sender, e, "pro"));
    
    private async void OnPurchasePremiumClick(object sender, RoutedEventArgs e) => 
        await Task.Run(() => OnPurchaseButtonClick(sender, e, "premium"));
    
    private async void OnPurchaseEnterpriseClick(object sender, RoutedEventArgs e) => 
        await Task.Run(() => OnPurchaseButtonClick(sender, e, "enterprise"));
}