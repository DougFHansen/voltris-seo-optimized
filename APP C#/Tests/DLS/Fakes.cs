using System;
using System.Collections.Generic;
using System.Diagnostics;
using VoltrisOptimizer.Services.Optimization.Providers;

namespace DLS.Tests.Fakes
{
    public class FakeCpuLoadProvider : ICpuCoreLoadProvider
    {
        private readonly Queue<double[]> _seq = new();
        public void Enqueue(double[] loads) => _seq.Enqueue(loads);
        public double[] GetCoreLoads() => _seq.Count > 0 ? _seq.Dequeue() : Array.Empty<double>();
    }

    public class FakeProcessProvider : IProcessProvider
    {
        private Process[] _procs = Array.Empty<Process>();
        private Process? _fg;
        public void SetProcesses(Process[] ps) => _procs = ps;
        public void SetForeground(Process? p) => _fg = p;
        public Process[] GetProcesses() => _procs;
        public Process? GetForegroundProcess() => _fg;
    }

    public class FakeGpuLoadProvider : IGpuLoadProvider
    {
        public double Value { get; set; }
        public double GetGpuUtilization() => Value;
    }
}

