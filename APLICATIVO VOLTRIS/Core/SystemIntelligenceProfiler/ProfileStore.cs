using System;
using System.IO;
using System.Text.Json;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler
{
    public class ProfileStore
    {
        private readonly string _dir;
        private readonly string _stateFile;

        public ProfileStore()
        {
            var appdata = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            _dir = Path.Combine(appdata, "VoltrisOptimizer", "Profiler");
            _stateFile = Path.Combine(_dir, "state.json");
            if (!Directory.Exists(_dir)) Directory.CreateDirectory(_dir);
        }

        public ProfilerState Load()
        {
            try
            {
                if (File.Exists(_stateFile))
                {
                    var json = File.ReadAllText(_stateFile);
                    var state = JsonSerializer.Deserialize<ProfilerState>(json);
                    return state ?? new ProfilerState();
                }
            }
            catch { }
            return new ProfilerState();
        }

        public void Save(ProfilerState state)
        {
            try
            {
                var json = JsonSerializer.Serialize(state, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_stateFile, json);
            }
            catch { }
        }
    }

    public class ProfilerState
    {
        public bool QuestionnaireCompleted { get; set; }
        public bool TutorialCompleted { get; set; }
        public UserAnswers Answers { get; set; } = new UserAnswers();
    }
}

