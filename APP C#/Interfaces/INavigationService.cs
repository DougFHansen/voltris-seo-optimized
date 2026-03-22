namespace VoltrisOptimizer.Interfaces
{
    public interface INavigationService
    {
        void NavigateTo(string viewKey);
        void ShowModal(string viewKey);
        void CloseModal();
        bool GoBack();
    }
}
