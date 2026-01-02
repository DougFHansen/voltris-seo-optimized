using System;
using System.Security.Cryptography;
using System.Text;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço de segurança para licenciamento
    /// IMPORTANTE: Deve usar a MESMA chave que:
    /// - LicenseGenerator/Program.cs
    /// - Supabase function generate_license_key
    /// Chave: VOLTRIS_SECRET_LICENSE_KEY_2025
    /// </summary>
    internal static class LicenseSecurityService
    {
        // Chave secreta para assinatura de licenças
        // CRÍTICO: Deve ser idêntica ao LicenseGenerator e backend
        private const string LicenseSecretKey = "VOLTRIS_SECRET_LICENSE_KEY_2025";
        
        /// <summary>
        /// Obtém a chave de assinatura
        /// IMPORTANTE: Retorna a chave alinhada com backend e LicenseGenerator
        /// </summary>
        internal static string GetSigningKey()
        {
            return LicenseSecretKey;
        }
        
        /// <summary>
        /// Gera assinatura para conteúdo de licença
        /// </summary>
        internal static string GenerateSignature(string content)
        {
            var key = GetSigningKey();
            
            using (var sha256 = SHA256.Create())
            {
                var contentBytes = Encoding.UTF8.GetBytes(content);
                var keyBytes = Encoding.UTF8.GetBytes(key);
                
                // HMAC-like approach
                var combinedBytes = new byte[contentBytes.Length + keyBytes.Length];
                Buffer.BlockCopy(contentBytes, 0, combinedBytes, 0, contentBytes.Length);
                Buffer.BlockCopy(keyBytes, 0, combinedBytes, contentBytes.Length, keyBytes.Length);
                
                var hash = sha256.ComputeHash(combinedBytes);
                return BitConverter.ToString(hash).Replace("-", "").Substring(0, 16);
            }
        }
        
        /// <summary>
        /// Valida assinatura de licença
        /// </summary>
        internal static bool ValidateSignature(string content, string signature)
        {
            var expectedSignature = GenerateSignature(content);
            return string.Equals(signature, expectedSignature, StringComparison.Ordinal);
        }
        

        
        /// <summary>
        /// Verifica integridade do sistema de licenciamento
        /// </summary>
        internal static bool VerifyIntegrity()
        {
            try
            {
                // Verificar se a chave pode ser reconstruída corretamente
                var key = GetSigningKey();
                if (string.IsNullOrEmpty(key) || key.Length < 20)
                    return false;
                
                // Verificar se a assinatura funciona
                var testContent = "test_integrity_check";
                var signature = GenerateSignature(testContent);
                return ValidateSignature(testContent, signature);
            }
            catch
            {
                return false;
            }
        }
    }
}

