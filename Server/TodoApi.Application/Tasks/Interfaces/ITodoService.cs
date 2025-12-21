using TodoApi.Application.Tasks.Commands;
using TodoApi.Application.Tasks.DTOs;

namespace TodoApi.Application.Tasks.Interfaces;

/// <summary>
/// Service contract for todo operations.
/// Consolidates CRUD operations into single interface. For systems
/// requiring independent scaling of reads vs. writes, this can be split
/// into query and command services following CQRS principles.
/// </summary>
public interface ITodoService
{
    // Queries
    Task<TodoCountsDTO> GetCountsAsync();
    Task<TodoItemDTO> GetByIdAsync(Guid id);
    Task<IEnumerable<TodoItemDTO>> GetAllAsync();
    Task<PaginatedResponse<TodoItemDTO>> GetPaginationAsync(
        int page, 
        int pageSize, 
        string? status = null);

    // Commands
    Task<TodoItemDTO> CreateAsync(CreateTodo command);
    Task<TodoItemDTO> UpdateAsync(Guid id, UpdateTodo command);
    Task DeleteAsync(Guid id);
}