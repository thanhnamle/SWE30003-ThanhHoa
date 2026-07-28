using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SmartFM.Domain.Interfaces;

namespace SmartFM.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly SmartFmDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(SmartFmDbContext context)
    {
        _context = context;
    }

    public async Task<IDisposable> BeginTransactionAsync()
    {
        // InMemory provider (used in tests) does not support real transactions.
        if (_context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
        {
            return new NoopTransaction();
        }

        _transaction = await _context.Database.BeginTransactionAsync();
        return _transaction;
    }

    public async Task CommitAsync()
    {
        await _context.SaveChangesAsync();
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public Task<int> SaveChangesAsync() => _context.SaveChangesAsync();

    private sealed class NoopTransaction : IDisposable
    {
        public void Dispose() { }
    }
}
