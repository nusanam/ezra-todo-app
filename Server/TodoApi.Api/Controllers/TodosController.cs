using Microsoft.AspNetCore.Mvc;
using TodoApi.Application.Tasks.Commands;
using TodoApi.Application.Tasks.DTOs;
using TodoApi.Application.Tasks.Interfaces;

namespace TodoApi.Api.Controllers;

/// <summary>
/// REST API controller for todo operations.
/// Provides CRUD endpoints with pagination and server-side filtering.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodosController(ITodoService todoService)
    {
        _todoService = todoService;
    }
    
    [HttpGet("counts")]
    public async Task<ActionResult<TodoCountsDTO>> GetCounts()
    {
        var counts = await _todoService.GetCountsAsync();
        return Ok(counts);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TodoItemDTO>> GetById(Guid id)
    {
        var todo = await _todoService.GetByIdAsync(id);
        return Ok(todo);
    }
    
    /// <summary>
    /// Gets todos with optional pagination and status filtering.
    /// </summary>
    /// <remarks>
    /// Without page param: returns all non-archived todos.
    /// With page param: returns paginated results filtered by status.
    /// </remarks>
    /// <param name="page">Page number (1-indexed). If null, returns all todos.</param>
    /// <param name="pageSize">Items per page (1-100, default 10).</param>
    /// <param name="status">Filter by status: all, active, completed, archived.</param>
    [HttpGet]
    public async Task<ActionResult> GetAll(
        [FromQuery] int? page, 
        [FromQuery] int pageSize = 10,
        [FromQuery] string? status = null)
    {
        // if no pagination requested - return all (backward compatible)
        if (page is null)
        {
            var todos = await _todoService.GetAllAsync();
            return Ok(todos);
        }

        var pagedResult = await _todoService.GetPaginationAsync(page.Value, pageSize, status);
        return Ok(pagedResult);
    }

    [HttpPost]
    public async Task<ActionResult<TodoItemDTO>> Create(CreateTodo command)
    {
        var todo = await _todoService.CreateAsync(command);
        return CreatedAtAction(nameof(GetById), new { id = todo.Id }, todo);
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<TodoItemDTO>> Update(Guid id, UpdateTodo command)
    {
        var todo = await _todoService.UpdateAsync(id, command);
        return Ok(todo);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _todoService.DeleteAsync(id);
        return NoContent();
    }
}