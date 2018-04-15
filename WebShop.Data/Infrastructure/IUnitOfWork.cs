namespace WebShop.Data.Infrastructure
{
    public interface IUnitOfWork
    {
        void Commit();
    }
}