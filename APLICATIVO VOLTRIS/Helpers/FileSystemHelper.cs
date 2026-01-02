using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace VoltrisOptimizer.Helpers
{
    /// <summary>
    /// Helper compartilhado para operações de sistema de arquivos
    /// Extrai código duplicado de SystemCleaner e GamerOptimizerService
    /// </summary>
    public static class FileSystemHelper
    {
        /// <summary>
        /// Enumera arquivos de forma iterativa (não recursiva via stack) para evitar StackOverflow
        /// em diretórios muito profundos
        /// </summary>
        /// <param name="rootDirectory">Diretório raiz para iniciar a busca</param>
        /// <param name="searchPattern">Padrão de busca (ex: "*.exe", "*.*")</param>
        /// <param name="maxDepth">Profundidade máxima (0 = sem limite)</param>
        /// <returns>Enumerável de caminhos de arquivos</returns>
        public static IEnumerable<string> EnumerateFilesIterative(string rootDirectory, string searchPattern = "*", int maxDepth = 0)
        {
            if (string.IsNullOrEmpty(rootDirectory) || !Directory.Exists(rootDirectory))
                yield break;

            var stack = new Stack<(string path, int depth)>();
            stack.Push((rootDirectory, 0));

            while (stack.Count > 0)
            {
                var (currentDir, depth) = stack.Pop();

                // Obter arquivos no diretório atual
                string[] files;
                try
                {
                    files = Directory.GetFiles(currentDir, searchPattern, SearchOption.TopDirectoryOnly);
                }
                catch (UnauthorizedAccessException)
                {
                    continue;
                }
                catch (PathTooLongException)
                {
                    continue;
                }
                catch (Exception)
                {
                    files = Array.Empty<string>();
                }

                foreach (var file in files)
                {
                    yield return file;
                }

                // Verificar profundidade máxima
                if (maxDepth > 0 && depth >= maxDepth)
                    continue;

                // Adicionar subdiretórios à pilha
                string[] subdirs;
                try
                {
                    subdirs = Directory.GetDirectories(currentDir);
                }
                catch (UnauthorizedAccessException)
                {
                    continue;
                }
                catch (PathTooLongException)
                {
                    continue;
                }
                catch (Exception)
                {
                    subdirs = Array.Empty<string>();
                }

                foreach (var subdir in subdirs)
                {
                    try
                    {
                        // Ignorar pontos de reparse (symlinks, junctions)
                        var di = new DirectoryInfo(subdir);
                        if ((di.Attributes & FileAttributes.ReparsePoint) != 0)
                            continue;

                        stack.Push((subdir, depth + 1));
                    }
                    catch
                    {
                        // Ignorar diretórios que não podem ser acessados
                    }
                }
            }
        }

        /// <summary>
        /// Calcula o tamanho total de um diretório de forma segura
        /// </summary>
        /// <param name="directoryPath">Caminho do diretório</param>
        /// <returns>Tamanho em bytes</returns>
        public static long GetDirectorySize(string directoryPath)
        {
            if (!Directory.Exists(directoryPath))
                return 0;

            long totalSize = 0;

            foreach (var file in EnumerateFilesIterative(directoryPath))
            {
                try
                {
                    var fileInfo = new FileInfo(file);
                    totalSize += fileInfo.Length;
                }
                catch
                {
                    // Ignorar arquivos que não podem ser acessados
                }
            }

            return totalSize;
        }

        /// <summary>
        /// Formata bytes em formato legível (KB, MB, GB)
        /// </summary>
        /// <param name="bytes">Quantidade de bytes</param>
        /// <returns>String formatada</returns>
        public static string FormatBytes(long bytes)
        {
            if (bytes < 0)
                return "0 B";

            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;

            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len /= 1024;
            }

            return $"{len:0.##} {sizes[order]}";
        }

        /// <summary>
        /// Deleta arquivos de um diretório de forma segura
        /// </summary>
        /// <param name="directoryPath">Caminho do diretório</param>
        /// <param name="searchPattern">Padrão de busca</param>
        /// <returns>Tupla com (arquivos deletados, bytes liberados)</returns>
        public static (int filesDeleted, long bytesFreed) CleanDirectory(string directoryPath, string searchPattern = "*")
        {
            int filesDeleted = 0;
            long bytesFreed = 0;

            if (!Directory.Exists(directoryPath))
                return (0, 0);

            foreach (var file in EnumerateFilesIterative(directoryPath, searchPattern))
            {
                try
                {
                    var fileInfo = new FileInfo(file);
                    var fileSize = fileInfo.Length;

                    File.Delete(file);

                    filesDeleted++;
                    bytesFreed += fileSize;
                }
                catch
                {
                    // Ignorar arquivos bloqueados ou protegidos
                }
            }

            return (filesDeleted, bytesFreed);
        }

        /// <summary>
        /// Verifica se um caminho é um diretório de jogos conhecido
        /// </summary>
        /// <param name="path">Caminho para verificar</param>
        /// <returns>True se for um diretório de jogos</returns>
        public static bool IsGameDirectory(string path)
        {
            if (string.IsNullOrEmpty(path))
                return false;

            var lowerPath = path.ToLowerInvariant();

            var gameDirectoryPatterns = new[]
            {
                "steamapps\\common",
                "steamapps/common",
                "\\epic games\\",
                "/epic games/",
                "\\gog galaxy\\games\\",
                "/gog galaxy/games/",
                "\\riot games\\",
                "/riot games/",
                "\\ubisoft\\",
                "/ubisoft/",
                "\\origin games\\",
                "/origin games/",
                "\\ea games\\",
                "/ea games/",
                "\\xbox games\\",
                "/xbox games/",
                "\\battlenet\\",
                "/battlenet/"
            };

            return gameDirectoryPatterns.Any(pattern => lowerPath.Contains(pattern));
        }

        /// <summary>
        /// Verifica se o nome do processo é um não-jogo conhecido
        /// </summary>
        /// <param name="processName">Nome do processo</param>
        /// <returns>True se NÃO for um jogo</returns>
        public static bool IsNonGameProcess(string processName)
        {
            if (string.IsNullOrEmpty(processName))
                return true;

            var lowerName = processName.ToLowerInvariant();

            var nonGameProcesses = new[]
            {
                "trae", "code", "qoder", "voltrisoptimizer", "devenv",
                "winpty-agent", "openconsole", "rg", "fd", "vsce-sign",
                "code-tunnel", "explorer", "svchost", "csrss", "dwm",
                "taskmgr", "cmd", "powershell", "conhost", "mmc",
                "regedit", "notepad", "chrome", "firefox", "edge",
                "msedge", "opera", "brave", "vivaldi"
            };

            return nonGameProcesses.Contains(lowerName);
        }

        /// <summary>
        /// Obtém o caminho base do aplicativo
        /// </summary>
        /// <returns>Caminho do diretório base</returns>
        public static string GetApplicationBasePath()
        {
            return AppDomain.CurrentDomain.BaseDirectory;
        }

        /// <summary>
        /// Combina caminhos de forma segura
        /// </summary>
        /// <param name="paths">Partes do caminho</param>
        /// <returns>Caminho combinado</returns>
        public static string CombinePath(params string[] paths)
        {
            return Path.Combine(paths.Where(p => !string.IsNullOrEmpty(p)).ToArray());
        }

        /// <summary>
        /// Garante que um diretório existe, criando se necessário
        /// </summary>
        /// <param name="directoryPath">Caminho do diretório</param>
        /// <returns>True se o diretório existe ou foi criado</returns>
        public static bool EnsureDirectoryExists(string directoryPath)
        {
            try
            {
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}

