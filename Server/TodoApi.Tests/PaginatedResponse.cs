namespace TodoApi.Tests;
using Application.Tasks.DTOs;

public record PaginatedResponse
{
    public List<TodoItemDTO> Items { get; init; } = new();
    public int TotalCount { get; init; }
    public int TotalPages { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
}