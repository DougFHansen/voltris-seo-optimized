using System;
using System.IO;
using System.Text;
using System.Threading;

namespace VoltrisOptimizer.Services
{
    public class LoggingService : ILoggingService
    {
        private readonly string _logDirectory;
        private readonly string _logFilePath;
        private readonly ReaderWriterLockSlim _lock = new ReaderWriterLockSlim();
        private bool _isDisposed;
        public event EventHandler<string>? LogEntryAdded;

        public LoggingService(string logDirectory)
        {
            _logDirectory = logDirectory;
            Directory.CreateDirectory(_logDirectory);
            _logFilePath = Path.Combine(_logDirectory, "voltris.log.txt");
            if (!File.Exists(_logFilePath)) File.WriteAllText(_logFilePath, string.Empty);
        }

        public void LogInfo(string message) => Log(LogLevel.Info, LogCategory.General, message);
        public void LogSuccess(string message) => Log(LogLevel.Success, LogCategory.General, message);
        public void LogWarning(string message) => Log(LogLevel.Warning, LogCategory.General, message);
        public void LogError(string message, Exception? exception = null) => Log(LogLevel.Error, LogCategory.General, message, exception);
        
        public void LogDebug(string message, string? source = null) => Log(LogLevel.Debug, LogCategory.General, message, source: source);
        public void LogTrace(string message, string? source = null) => Log(LogLevel.Trace, LogCategory.General, message, source: source);
        public void LogCritical(string message, Exception? exception = null, string? source = null) => Log(LogLevel.Critical, LogCategory.General, message, exception, source);


        public void Log(LogLevel level, LogCategory category, string message, Exception? exception = null, string? source = null)
        {
            var levelStr = level.ToString().ToUpper();
            var categoryStr = category.ToString();
            var sourceStr = source != null ? $" [{source}]" : "";
            var fullMessage = $"[{categoryStr}]{sourceStr} {message}";
            Write($"[{levelStr}]", fullMessage);
            
            if (exception != null)
            {
                Write($"[{levelStr}_EX]", exception.ToString());
            }
        }

        private void Write(string level, string message)
        {
            if (_isDisposed) return;
            
            var line = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] {level} {message}";
            try
            {
                _lock.EnterWriteLock();
                
                // Verificar rotação de logs (10MB = 10 * 1024 * 1024 bytes)
                const long MAX_LOG_SIZE = 10 * 1024 * 1024;
                if (File.Exists(_logFilePath))
                {
                    var fileInfo = new FileInfo(_logFilePath);
                    if (fileInfo.Length > MAX_LOG_SIZE)
                    {
                        RotateLogs();
                    }
                }
                
                File.AppendAllText(_logFilePath, line + Environment.NewLine, Encoding.UTF8);
            }
            catch (IOException)
            {
                // Arquivo em uso - tentar novamente depois (logging não deve bloquear)
            }
            catch (UnauthorizedAccessException)
            {
                // Sem permissão para escrever - ignorar silenciosamente
            }
            finally 
            { 
                if (_lock.IsWriteLockHeld) 
                    _lock.ExitWriteLock(); 
            }
            
            // Notificar listeners de forma segura
            try 
            { 
                LogEntryAdded?.Invoke(this, line); 
            }
            catch (Exception)
            {
                // Listener falhou - não propagar exceção do handler
            }
        }
        
        /// <summary>
        /// Rotaciona os arquivos de log mantendo os últimos 5
        /// voltris.log.txt -> voltris.log.1.txt -> voltris.log.2.txt -> ... -> voltris.log.5.txt (deletado)
        /// </summary>
        private void RotateLogs()
        {
            try
            {
                const int MAX_BACKUPS = 5;
                
                // Deletar o arquivo mais antigo se existir
                var oldestFile = Path.Combine(_logDirectory, $"voltris.log.{MAX_BACKUPS}.txt");
                if (File.Exists(oldestFile))
                {
                    File.Delete(oldestFile);
                }
                
                // Renomear arquivos existentes (4 -> 5, 3 -> 4, 2 -> 3, 1 -> 2)
                for (int i = MAX_BACKUPS - 1; i >= 1; i--)
                {
                    var sourceFile = Path.Combine(_logDirectory, $"voltris.log.{i}.txt");
                    var destFile = Path.Combine(_logDirectory, $"voltris.log.{i + 1}.txt");
                    
                    if (File.Exists(sourceFile))
                    {
                        if (File.Exists(destFile))
                            File.Delete(destFile);
                        File.Move(sourceFile, destFile);
                    }
                }
                
                // Renomear o arquivo atual para .1
                var backupFile = Path.Combine(_logDirectory, "voltris.log.1.txt");
                if (File.Exists(backupFile))
                    File.Delete(backupFile);
                File.Move(_logFilePath, backupFile);
                
                // Criar novo arquivo vazio
                File.WriteAllText(_logFilePath, string.Empty, Encoding.UTF8);
                
                // Registrar a rotação
                File.AppendAllText(_logFilePath, 
                    $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] [INFO] [LoggingService] Log rotacionado - arquivo anterior salvo como voltris.log.1.txt{Environment.NewLine}", 
                    Encoding.UTF8);
            }
            catch (Exception ex)
            {
                // Falha na rotação não deve parar o logging
                // Tentar registrar o erro no próprio log se possível
                try
                {
                    File.AppendAllText(_logFilePath, 
                        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] [ERROR] [LoggingService] Falha ao rotacionar logs: {ex.Message}{Environment.NewLine}", 
                        Encoding.UTF8);
                }
                catch { }
            }
        }

        public void ClearLogs()
        {
            try
            {
                _lock.EnterWriteLock();
                File.WriteAllText(_logFilePath, string.Empty, Encoding.UTF8);
            }
            catch (IOException)
            {
                // Arquivo em uso - ignorar
            }
            catch (UnauthorizedAccessException)
            {
                // Sem permissão - ignorar
            }
            finally 
            { 
                if (_lock.IsWriteLockHeld) 
                    _lock.ExitWriteLock(); 
            }
        }

        public void ExportLogs(string filePath)
        {
            try
            {
                _lock.EnterReadLock();
                File.Copy(_logFilePath, filePath, true);
            }
            catch (IOException)
            {
                // Arquivo em uso - ignorar
            }
            catch (UnauthorizedAccessException)
            {
                // Sem permissão - ignorar
            }
            finally 
            { 
                if (_lock.IsReadLockHeld) 
                    _lock.ExitReadLock(); 
            }
        }

        public string[] GetLogs()
        {
            try
            {
                _lock.EnterReadLock();
                return File.ReadAllLines(_logFilePath, Encoding.UTF8);
            }
            catch (IOException)
            {
                return Array.Empty<string>();
            }
            catch (UnauthorizedAccessException)
            {
                return Array.Empty<string>();
            }
            finally 
            { 
                if (_lock.IsReadLockHeld) 
                    _lock.ExitReadLock(); 
            }
        }

        public string GetLogDirectory() => _logDirectory;

        public void Dispose()
        {
            if (_isDisposed) return;
            _isDisposed = true;
            
            try 
            { 
                _lock.Dispose(); 
            }
            catch (ObjectDisposedException)
            {
                // Já foi disposed - OK
            }
        }
    }
}

