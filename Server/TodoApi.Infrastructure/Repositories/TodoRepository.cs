using Microsoft.EntityFrameworkCore;
using TodoApi.Application.Tasks.Interfaces;
using TodoApi.Domain.Entities;
using TodoApi.Infrastructure.Data;

namespace TodoApi.Infrastructure.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly AppDbContext _context;

    public TodoRepository(AppDbContext context)
    {
        _context = context;
    }
    
    /// <summary>
    /// Gets paginated todos with server-side status filtering.
    /// Filters are applied before pagination for accurate counts.
    /// </summary>
    /// <param name="page">1-indexed page number</param>
    /// <param name="pageSize">Number of items per page</param>
    /// <param name="status">Filter: active, completed, archived, or all (default)</param>
    /// <returns>Tuple of filtered items and total count for pagination</returns>
    public async Task<(IEnumerable<TodoItem> Items, int TotalCount)> GetPaginationAsync(int page, int pageSize, string? status = null)
    {
        var query = _context.Todos.AsNoTracking();

        // apply todo status filter
        query = status?.ToLower() switch
        {
            "active" => query.Where(t => !t.IsCompleted && !t.IsArchived),
            "completed" => query.Where(t => t.IsCompleted && !t.IsArchived),
            "archived" => query.Where(t => t.IsArchived),
            _ => query.Where(t => !t.IsArchived) // "all" or null
        };

        var totalCount = await query.CountAsync();

        var items = await query
            // SQLite doesn't support DateTimeOffset in ORDER BY, so need to use DateTime
            // see: https://docs.microsoft.com/en-us/ef/core/providers/sqlite/limitations
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<IEnumerable<TodoItem>> GetAllAsync()
    {
        return await _context.Todos.AsNoTracking().ToListAsync();
    }

    public async Task<TodoItem?> GetByIdAsync(Guid id)
    {
        return await _context.Todos.FindAsync(id);
    }

    public async Task AddAsync(TodoItem todoItem)
    {
        await _context.Todos.AddAsync(todoItem);
    }

    public async Task DeleteAsync(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo is not null) _context.Todos.Remove(todo);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}