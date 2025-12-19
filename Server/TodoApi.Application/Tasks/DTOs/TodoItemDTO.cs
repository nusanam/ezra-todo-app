using TodoApi.Domain.Entities;

namespace TodoApi.Application.Tasks.DTOs;

public record TodoItemDTO(
    Guid Id,
    string Title,
    bool IsCompleted,
    bool IsArchived,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt)
{
    public static TodoItemDTO FromEntity(TodoItem entity)
    {
        return new TodoItemDTO(
            entity.Id,
            entity.Title,
            entity.IsCompleted,
            entity.IsArchived,
            entity.CreatedAt,
            entity.UpdatedAt
        );
    }
}