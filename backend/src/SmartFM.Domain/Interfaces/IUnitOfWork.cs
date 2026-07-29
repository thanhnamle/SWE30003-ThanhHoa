using System;
using System.Threading.Tasks;

namespace SmartFM.Domain.Interfaces;

public interface IUnitOfWork
{
    Task<IDisposable> BeginTransactionAsync();
    Task CommitAsync();
    Task RollbackAsync();
    Task<int> SaveChangesAsync();
}
