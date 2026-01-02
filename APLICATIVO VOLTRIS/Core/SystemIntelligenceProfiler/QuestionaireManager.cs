using System.Threading.Tasks;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler
{
    public class QuestionaireManager
    {
        private readonly ProfileStore _store;
        public QuestionaireManager(ProfileStore store)
        {
            _store = store;
        }

        public bool IsCompleted()
        {
            var s = _store.Load();
            return s.QuestionnaireCompleted;
        }

        public Task SaveAnswersAsync(UserAnswers answers)
        {
            var s = _store.Load();
            s.Answers = answers;
            s.QuestionnaireCompleted = true;
            _store.Save(s);
            return Task.CompletedTask;
        }
    }
}

