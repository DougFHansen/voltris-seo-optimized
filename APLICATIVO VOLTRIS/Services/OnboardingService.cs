using System;
using System.IO;
using System.Text.Json;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço de onboarding para primeira execução
    /// </summary>
    public class OnboardingService
    {
        private readonly string _onboardingPath;
        private const string OnboardingFileName = "onboarding.json";

        public OnboardingService()
        {
            _onboardingPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, OnboardingFileName);
        }

        public bool HasCompletedOnboarding()
        {
            try
            {
                if (!File.Exists(_onboardingPath))
                {
                    return false;
                }

                var json = File.ReadAllText(_onboardingPath);
                var data = JsonSerializer.Deserialize<OnboardingData>(json);
                return data?.Completed ?? false;
            }
            catch
            {
                return false;
            }
        }

        public void MarkOnboardingComplete()
        {
            try
            {
                var data = new OnboardingData
                {
                    Completed = true,
                    CompletedDate = DateTime.Now
                };

                var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_onboardingPath, json);
            }
            catch
            {
                // Ignorar erros de salvamento
            }
        }

        public OnboardingData? GetOnboardingData()
        {
            try
            {
                if (File.Exists(_onboardingPath))
                {
                    var json = File.ReadAllText(_onboardingPath);
                    return JsonSerializer.Deserialize<OnboardingData>(json);
                }
            }
            catch { }
            return null;
        }

        public void ResetOnboarding()
        {
            try
            {
                if (File.Exists(_onboardingPath))
                {
                    File.Delete(_onboardingPath);
                }
            }
            catch { }
        }
    }

    public class OnboardingData
    {
        public bool Completed { get; set; }
        public DateTime? CompletedDate { get; set; }
    }
}

