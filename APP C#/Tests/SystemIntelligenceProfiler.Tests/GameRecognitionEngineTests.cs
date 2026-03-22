using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using VoltrisOptimizer.Core.GameRecognition;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services;
using GameDetectedEventArgs = VoltrisOptimizer.Core.GameRecognition.GameDetectedEventArgs;
using GamePhaseChangedEventArgs = VoltrisOptimizer.Core.GameRecognition.GamePhaseChangedEventArgs;
using Xunit;

namespace SystemIntelligenceProfiler.Tests
{
    public class InMemoryGameProfileRepository : IGameProfileRepository
    {
        private readonly HashSet<string> _set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        public bool Exists(string gameName) => _set.Contains(gameName);
        public void Save(string gameName) { if (!string.IsNullOrEmpty(gameName)) _set.Add(gameName); }
        public IEnumerable<string> List() => _set;
    }

    public class GameRecognitionEngineTests
    {
        private static GamerOptimizerService CreateGamer()
        {
            var logger = new LoggingService(System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs"));
            return new GamerOptimizerService(logger);
        }

        [Fact]
        public async Task GameDetected_is_raised_on_handle_start()
        {
            var gamer = CreateGamer();
            var detector = new GameDetectionService(null);
            var repo = new InMemoryGameProfileRepository();
            var engine = new GameRecognitionEngine(gamer, detector, repo) { SuppressApplyProfile = true };

            var tcs = new TaskCompletionSource<GameDetectedEventArgs>();
            engine.GameDetected += (s, e) => { try { tcs.TrySetResult(e); } catch { } };

            engine.HandleGameStarted("TestGame", 1234, "C:\\Path\\Game.exe", null);

            GameDetectedEventArgs? evt = null;
            var completed = await Task.WhenAny(tcs.Task, Task.Delay(TimeSpan.FromSeconds(5)));
            if (completed == tcs.Task)
            {
                evt = await tcs.Task;
            }
            Assert.NotNull(evt);
            Assert.Equal("TestGame", evt!.GameName);
            Assert.Equal(1234, evt.ProcessId);
            Assert.Equal("C:\\Path\\Game.exe", evt.ProcessPath);
        }

        [Fact]
        public async Task GamePhaseChanged_exit_is_raised_on_handle_stop()
        {
            var gamer = CreateGamer();
            var detector = new GameDetectionService(null);
            var repo = new InMemoryGameProfileRepository();
            var engine = new GameRecognitionEngine(gamer, detector, repo) { SuppressApplyProfile = true };

            var tcs = new TaskCompletionSource<GamePhaseChangedEventArgs>();
            engine.GamePhaseChanged += (s, e) => { if (e.Phase == "exit") { try { tcs.TrySetResult(e); } catch { } } };

            engine.HandleGameStopped("TestGame");

            GamePhaseChangedEventArgs? evt = null;
            var completed = await Task.WhenAny(tcs.Task, Task.Delay(TimeSpan.FromSeconds(5)));
            if (completed == tcs.Task)
            {
                evt = await tcs.Task;
            }
            Assert.NotNull(evt);
            Assert.Equal("exit", evt!.Phase);
            Assert.Equal("TestGame", evt.GameName);
        }
    }
}
