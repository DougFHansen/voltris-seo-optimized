using System;
using System.IO;
using Microsoft.Toolkit.Uwp.Notifications;

namespace VoltrisOptimizer.Services
{
    public class ToastService
    {
        public void Show(string title, string message)
        {
            var logo = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Images", "logo.png");
            new ToastContentBuilder()
                .AddText(title)
                .AddText(message)
                .AddAppLogoOverride(new Uri("file:///" + logo), ToastGenericAppLogoCrop.Circle)
                .Show();
        }
    }
}
