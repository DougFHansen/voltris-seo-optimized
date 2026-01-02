using System.Reflection;
using System.Windows;

[assembly: AssemblyCompany("Voltris Corporation")]
[assembly: AssemblyProduct("Voltris Optimizer")]
[assembly: AssemblyTitle("Voltris Optimizer")]
[assembly: AssemblyVersion("1.0.0.3")]
[assembly: AssemblyFileVersion("1.0.0.3")]

// DPI Awareness Configuration
// This ensures the application renders sharply on high-DPI displays
// and prevents Windows DPI virtualization (bitmap scaling)
[assembly: DisableDpiAwareness] // .NET 8.0 WPF manages DPI internally
