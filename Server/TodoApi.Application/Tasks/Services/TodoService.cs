using TodoApi.Application.Tasks.Commands;
using TodoApi.Application.Tasks.DTOs;
using TodoApi.Application.Tasks.Interfaces;
using TodoApi.Domain.Entities;
using TodoApi.Domain.Exceptions;

namespace TodoApi.Application.Tasks.Services;

/// <summary>
///     Handles todo CRUD operations, api pagination, and business logic.
/// </summary>
public class TodoService : ITodoService
{
    private readonly ITodoRepository _repository;

    public TodoService(ITodoRepository repository)
    {
        _repository = repository;
    }

    // Queries
    public async Task<TodoItemDTO> GetByIdAsync(Guid id)
    {
        var todo = await _repository.GetByIdAsync(id);
        if (todo is null) throw new NotFoundException(nameof(TodoItem), id);

        return TodoItemDTO.FromEntity(todo);
    }

    public async Task<IEnumerable<TodoItemDTO>> GetAllAsync()
    {
        var todos = await _repository.GetAllAsync();
        return todos.Select(TodoItemDTO.FromEntity);
    }
    
    public async Task<PaginationDTO<TodoItemDTO>> GetPaginationAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetPaginationAsync(page, pageSize);
    
        var dtos = items.Select(TodoItemDTO.FromEntity);
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PaginationDTO<TodoItemDTO>(dtos, page, pageSize, totalCount, totalPages);
    }

    // Commands
    public async Task<TodoItemDTO> CreateAsync(CreateTodo command)
    {
        var todo = TodoItem.Create(command.Title);

        await _repository.AddAsync(todo);
        await _repository.SaveChangesAsync();

        return TodoItemDTO.FromEntity(todo);
    }

    public async Task<TodoItemDTO> UpdateAsync(Guid id, UpdateTodo command)
    {
        var todo = await _repository.GetByIdAsync(id);
        if (todo is null) throw new NotFoundException(nameof(TodoItem), id);

        var hasChanges = false;

        if (command.Title is not null)
        {
            todo.UpdateTitle(command.Title);
            hasChanges = true;
        }

        if (command.IsCompleted is not null)
        {
            if (command.IsCompleted.Value)
                todo.MarkComplete();
            else
                todo.MarkIncomplete();
            hasChanges = true;
        }

        if (command.IsArchived is not null)
        {
            if (command.IsArchived.Value)
                todo.Archive();
            else
                todo.Unarchive();
            hasChanges = true;
        }

        if (hasChanges)
            await _repository.SaveChangesAsync();

        return TodoItemDTO.FromEntity(todo);
    }

    public async Task DeleteAsync(Guid id)
    {
        var todo = await _repository.GetByIdAsync(id);
        if (todo is null) throw new NotFoundException(nameof(TodoItem), id);

        await _repository.DeleteAsync(id);
        await _repository.SaveChangesAsync();
    }
}