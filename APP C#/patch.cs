using System;
using System.IO;
using System.Text.RegularExpressions;

class Program
{
    static void Main()
    {
        string path = @"d:\Desktop\APLICATIVO VOLTRIS\Services\Optimization\DynamicLoadStabilizer.cs";
        string content = File.ReadAllText(path);
        
        // 4. Validate DLS Adaptive Polling
        content = content.Replace("await Task.Delay(Interval, ct);", 
            "var orch = VoltrisOptimizer.Core.ServiceLocator.GetService<VoltrisOptimizer.Services.Optimization.Unification.OptimizationOrchestrator>();\n" +
            "                    if (orch != null)\n" +
            "                    {\n" +
            "                        Interval = orch.StateMachine.CurrentState switch {\n" +
            "                            VoltrisOptimizer.Services.Optimization.Unification.SystemState.Idle => TimeSpan.FromMilliseconds(1500),\n" +
            "                            VoltrisOptimizer.Services.Optimization.Unification.SystemState.Interactive => TimeSpan.FromMilliseconds(1000),\n" +
            "                            VoltrisOptimizer.Services.Optimization.Unification.SystemState.Gaming => TimeSpan.FromMilliseconds(500),\n" +
            "                            VoltrisOptimizer.Services.Optimization.Unification.SystemState.ThermalProtection => TimeSpan.FromMilliseconds(2000),\n" +
            "                            VoltrisOptimizer.Services.Optimization.Unification.SystemState.BatteryMode => TimeSpan.FromMilliseconds(2000),\n" +
            "                            _ => TimeSpan.FromMilliseconds(1000)\n" +
            "                        };\n" +
            "                    }\n" +
            "                    await Task.Delay(Interval, ct);");

        // 4. Validate DLS: Route to Orchestrator event calls instead of direct P/Invoke (already done mostly, but fix EcoQoS application)
        content = content.Replace("SetPowerThrottling(p, true);", 
            "VoltrisOptimizer.Core.ServiceLocator.GetService<VoltrisOptimizer.Services.Optimization.Unification.OptimizationOrchestrator>()?.ProcessDlsRecommendation(p.Id, \"THROTTLE\", true);");
        
        content = content.Replace("SetPowerThrottling(p, false);", 
            "VoltrisOptimizer.Core.ServiceLocator.GetService<VoltrisOptimizer.Services.Optimization.Unification.OptimizationOrchestrator>()?.ProcessDlsRecommendation(p.Id, \"RELEASE\", false);");

        File.WriteAllText(path, content);
    }
}
