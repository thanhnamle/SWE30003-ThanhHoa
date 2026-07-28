using System;
using System.Threading.Tasks;

namespace SmartFM.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    Task BeginTransactionAsync();
    Task CommitAsync();
    Task RollbackAsync();
}
