using System;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

namespace LicenseGenerator
{
    class Program
    {
        // Chave secreta para assinatura de licenças (deve ser a mesma usada no aplicativo principal)
        private const string LicenseSecretKey = "VOLTRIS_SECRET_LICENSE_KEY_2025";

        static void Main(string[] args)
        {
            if (args != null && args.Length > 0 && Array.Exists(args, a => a.Equals("--generate-favicon", StringComparison.OrdinalIgnoreCase)))
            {
                try
                {
                    GenerateFavicon();
                    return;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    Environment.Exit(1);
                }
            }

            Console.WriteLine("=== Gerador de Licenças Voltris Optimizer ===");
            Console.WriteLine();

            try
            {
                // Solicitar informações do cliente
                Console.Write("ID do Cliente: ");
                var clientId = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(clientId))
                {
                    Console.WriteLine("ID do cliente é obrigatório.");
                    Console.ReadKey();
                    return;
                }

                Console.Write("Data de Validade (yyyy-MM-dd): ");
                var validityDateStr = Console.ReadLine();

                if (!DateTime.TryParse(validityDateStr, out var validityDate))
                {
                    Console.WriteLine("Data de validade inválida.");
                    Console.ReadKey();
                    return;
                }

                // Gerar a licença
                var license = GenerateLicense(clientId, validityDate);

                Console.WriteLine();
                Console.WriteLine("=== LICENÇA GERADA ===");
                Console.WriteLine(license);
                Console.WriteLine("=====================");
                Console.WriteLine();
                Console.WriteLine("Pressione qualquer tecla para sair...");
                Console.ReadKey();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao gerar licença: {ex.Message}");
                Console.ReadKey();
            }
        }

        private static void GenerateFavicon()
        {
            var baseDir = AppDomain.CurrentDomain.BaseDirectory;
            var searchDirs = new List<string>();
            var dir = new DirectoryInfo(baseDir);
            for (int i = 0; i < 5 && dir != null; i++)
            {
                searchDirs.Add(dir.FullName);
                dir = dir.Parent;
            }
            string? repoRoot = null;
            foreach (var d in searchDirs)
            {
                var candidate = Path.Combine(d, "Images", "voltris.png");
                if (File.Exists(candidate))
                {
                    repoRoot = d;
                    break;
                }
            }
            if (repoRoot == null)
                throw new InvalidOperationException("Não foi possível localizar a pasta Images.");

            var inputPng = Path.Combine(repoRoot, "Images", "voltris.png");
            var outputIco = Path.Combine(repoRoot, "Images", "favicon.ico");
            var sizes = new[] { 16, 24, 32, 48, 64, 128, 256 };

            using var src = new Bitmap(inputPng);
            var rect = GetContentBounds(src);
            using var cropped = CropBitmap(src, rect);
            using var squared = MakeSquare(cropped);

            var entries = new List<(byte[] png, int size)>();
            foreach (var s in sizes)
            {
                using var resized = ResizeBitmap(squared, s, s);
                using var ms = new MemoryStream();
                resized.Save(ms, ImageFormat.Png);
                entries.Add((ms.ToArray(), s));
            }

            using var outStream = new FileStream(outputIco, FileMode.Create, FileAccess.Write);
            WriteIcoWithPng(outStream, entries);
        }

        private static Rectangle GetContentBounds(Bitmap bmp)
        {
            int minX = bmp.Width, minY = bmp.Height, maxX = -1, maxY = -1;
            for (int y = 0; y < bmp.Height; y++)
            {
                for (int x = 0; x < bmp.Width; x++)
                {
                    var c = bmp.GetPixel(x, y);
                    if (c.A > 10)
                    {
                        if (x < minX) minX = x;
                        if (y < minY) minY = y;
                        if (x > maxX) maxX = x;
                        if (y > maxY) maxY = y;
                    }
                }
            }
            if (maxX < minX || maxY < minY)
                return new Rectangle(0, 0, bmp.Width, bmp.Height);
            return Rectangle.FromLTRB(minX, minY, maxX + 1, maxY + 1);
        }

        private static Bitmap CropBitmap(Bitmap bmp, Rectangle rect)
        {
            var dst = new Bitmap(rect.Width, rect.Height);
            using var g = Graphics.FromImage(dst);
            g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
            g.DrawImage(bmp, new Rectangle(0, 0, rect.Width, rect.Height), rect, GraphicsUnit.Pixel);
            return dst;
        }

        private static Bitmap MakeSquare(Bitmap bmp)
        {
            int size = Math.Max(bmp.Width, bmp.Height);
            var dst = new Bitmap(size, size);
            using var g = Graphics.FromImage(dst);
            g.Clear(Color.Transparent);
            g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
            int x = (size - bmp.Width) / 2;
            int y = (size - bmp.Height) / 2;
            g.DrawImage(bmp, new Rectangle(x, y, bmp.Width, bmp.Height), new Rectangle(0, 0, bmp.Width, bmp.Height), GraphicsUnit.Pixel);
            return dst;
        }

        private static Bitmap ResizeBitmap(Bitmap bmp, int w, int h)
        {
            var dst = new Bitmap(w, h);
            using var g = Graphics.FromImage(dst);
            g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
            g.DrawImage(bmp, new Rectangle(0, 0, w, h), new Rectangle(0, 0, bmp.Width, bmp.Height), GraphicsUnit.Pixel);
            return dst;
        }

        private static void WriteIcoWithPng(Stream output, List<(byte[] png, int size)> entries)
        {
            using var bw = new BinaryWriter(output);
            bw.Write((short)0);
            bw.Write((short)1);
            bw.Write((short)entries.Count);

            int offset = 6 + entries.Count * 16;
            var entryData = new List<(int size, int offset, byte width, byte height, byte[] data)>();
            foreach (var e in entries)
            {
                var w = e.size;
                var h = e.size;
                var width = (byte)(w >= 256 ? 0 : w);
                var height = (byte)(h >= 256 ? 0 : h);
                entryData.Add((e.png.Length, offset, width, height, e.png));
                offset += e.png.Length;
            }

            foreach (var ed in entryData)
            {
                bw.Write(ed.width);
                bw.Write(ed.height);
                bw.Write((byte)0);
                bw.Write((byte)0);
                bw.Write((short)0);
                bw.Write((short)32);
                bw.Write(ed.size);
                bw.Write(ed.offset);
            }

            foreach (var ed in entryData)
            {
                bw.Write(ed.data);
            }
        }

        /// <summary>
        /// Gera uma licença para um cliente
        /// </summary>
        private static string GenerateLicense(string clientId, DateTime validUntil)
        {
            try
            {
                // Criar o conteúdo da licença em formato JSON
                var licenseContent = $"{{\"id\":\"{clientId}\",\"validUntil\":\"{validUntil:yyyy-MM-dd}\",\"plan\":\"Mensal\"}}";
                
                // Gerar a assinatura
                var signature = GenerateLicenseSignature(licenseContent);
                
                // Formatar a chave de licença final
                var formattedDate = validUntil.ToString("yyyyMMdd");
                return $"VOLTRIS-LIC-{clientId}-{formattedDate}-{signature}";
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao gerar licença: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Gera a assinatura para uma licença
        /// </summary>
        private static string GenerateLicenseSignature(string content)
        {
            using (var sha256 = SHA256.Create())
            {
                var contentBytes = Encoding.UTF8.GetBytes(content);
                var secretBytes = Encoding.UTF8.GetBytes(LicenseSecretKey);
                
                // Combinar conteúdo e chave secreta
                var combinedBytes = new byte[contentBytes.Length + secretBytes.Length];
                Buffer.BlockCopy(contentBytes, 0, combinedBytes, 0, contentBytes.Length);
                Buffer.BlockCopy(secretBytes, 0, combinedBytes, contentBytes.Length, secretBytes.Length);
                
                var hash = sha256.ComputeHash(combinedBytes);
                return BitConverter.ToString(hash).Replace("-", "").Substring(0, 16);
            }
        }
    }
}
