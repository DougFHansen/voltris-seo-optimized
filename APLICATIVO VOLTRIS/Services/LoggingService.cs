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

        public void LogInfo(string message) => Write("[INFO]", message);
        public void LogSuccess(string message) => Write("[SUCCESS]", message);
        public void LogWarning(string message) => Write("[WARNING]", message);
        public void LogError(string message, Exception? exception = null) => Write("[ERROR]", exception == null ? message : message + "\n" + exception);

        private void Write(string level, string message)
        {
            if (_isDisposed) return;
            
            var line = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] {level} {message}";
            try
            {
                _lock.EnterWriteLock();
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

