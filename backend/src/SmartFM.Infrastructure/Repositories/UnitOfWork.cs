using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;
using SmartFM.Domain.Interfaces;
using SmartFM.Infrastructure.Persistence;

namespace SmartFM.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly SmartFmDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(SmartFmDbContext context)
    {
        _context = context;
    }

    public async Task BeginTransactionAsync()
    {
        if (_transaction != null)
        {
            throw new InvalidOperationException("A transaction is already in progress.");
        }
        if (_context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
        {
            return;
        }
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitAsync()
    {
        try
        {
            await _context.SaveChangesAsync();
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
            }
        }
        catch
        {
            await RollbackAsync();
            throw;
        }
        finally
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
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

    public void Dispose()
    {
        if (_transaction != null)
        {
            _transaction.Dispose();
            _transaction = null;
        }
        _context.Dispose();
    }
}
