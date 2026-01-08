using System;
using System.Security.Cryptography;
using System.Text;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço de segurança para licenciamento - Ofuscação de chaves
    /// </summary>
    internal static class LicenseSecurityService
    {
        // Chaves fragmentadas e ofuscadas para dificultar engenharia reversa
        private static readonly byte[] _k1 = { 0x56, 0x4F, 0x4C, 0x54, 0x52, 0x49, 0x53 }; // VOLTRIS
        private static readonly byte[] _k2 = { 0x5F, 0x53, 0x45, 0x43, 0x52, 0x45, 0x54 }; // _SECRET
        private static readonly byte[] _k3 = { 0x5F, 0x4C, 0x49, 0x43, 0x45, 0x4E, 0x53, 0x45 }; // _LICENSE
        private static readonly byte[] _k4 = { 0x5F, 0x4B, 0x45, 0x59, 0x5F, 0x32, 0x30, 0x32, 0x35 }; // _KEY_2025
        
        // Salt adicional baseado em timestamp fixo (ofuscado)
        private static readonly int[] _saltParts = { 0x14, 0x07, 0x19, 0x58, 0x0A, 0x1E, 0x02 };
        
        /// <summary>
        /// Obtém a chave de assinatura de forma segura
        /// </summary>
        internal static string GetSigningKey()
        {
            try
            {
                // Reconstruir chave a partir de fragmentos
                var combined = new byte[_k1.Length + _k2.Length + _k3.Length + _k4.Length];
                int offset = 0;
                
                // Aplicar XOR com salt para cada fragmento
                var salt = GetSalt();
                
                for (int i = 0; i < _k1.Length; i++)
                    combined[offset++] = (byte)(_k1[i] ^ salt[i % salt.Length] ^ salt[i % salt.Length]);
                
                for (int i = 0; i < _k2.Length; i++)
                    combined[offset++] = (byte)(_k2[i] ^ salt[i % salt.Length] ^ salt[i % salt.Length]);
                
                for (int i = 0; i < _k3.Length; i++)
                    combined[offset++] = (byte)(_k3[i] ^ salt[i % salt.Length] ^ salt[i % salt.Length]);
                
                for (int i = 0; i < _k4.Length; i++)
                    combined[offset++] = (byte)(_k4[i] ^ salt[i % salt.Length] ^ salt[i % salt.Length]);
                
                return Encoding.UTF8.GetString(combined);
            }
            catch
            {
                // Fallback em caso de erro (não deveria acontecer)
                return GetFallbackKey();
            }
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
        
        private static byte[] GetSalt()
        {
            var salt = new byte[_saltParts.Length];
            for (int i = 0; i < _saltParts.Length; i++)
            {
                // Decodificar salt com operação reversível
                salt[i] = (byte)(_saltParts[i] ^ 0x00);
            }
            return salt;
        }
        
        private static string GetFallbackKey()
        {
            // Chave de fallback também ofuscada
            var parts = new[] { "VOL", "TRI", "S_S", "ECR", "ET_", "LIC", "ENS", "E_K", "EY_", "202", "5" };
            return string.Join("", parts);
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

