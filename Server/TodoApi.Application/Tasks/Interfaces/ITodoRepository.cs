using TodoApi.Domain.Entities;

namespace TodoApi.Application.Tasks.Interfaces;

public interface ITodoRepository
{
    Task<(IEnumerable<TodoItem> Items, int TotalCount)> GetPaginationAsync(int page, int pageSize);
    Task<IEnumerable<TodoItem>> GetAllAsync();
    Task<TodoItem?> GetByIdAsync(Guid id);
    Task AddAsync(TodoItem todoItem);
    Task DeleteAsync(Guid id);
    Task SaveChangesAsync();
}