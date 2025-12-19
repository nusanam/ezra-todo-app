namespace TodoApi.Application.Tasks.DTOs;

public record PaginationDTO<T>(
    IEnumerable<T> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages
);