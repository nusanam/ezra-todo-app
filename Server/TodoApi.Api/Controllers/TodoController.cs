using Microsoft.AspNetCore.Mvc;
using TodoApi.Application.Tasks.Commands;
using TodoApi.Application.Tasks.DTOs;
using TodoApi.Application.Tasks.Interfaces;

namespace TodoApi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodosController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TodoItemDTO>> GetById(Guid id)
    {
        var todo = await _todoService.GetByIdAsync(id);
        return Ok(todo);
    }
    
    /// <summary>
    /// Gets all todos, optionally paginated.
    /// </summary>
    /// <param name="page">Page number (1-based). If provided, returns paginated response.</param>
    /// <param name="pageSize">Items per page. Default 10, max 100.</param>
    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] int? page, [FromQuery] int pageSize = 10)
    {
        // No pagination requested - return all (backward compatible)
        if (page is null)
        {
            var todos = await _todoService.GetAllAsync();
            return Ok(todos);
        }

        // Validate pagination params
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100;

        var pagedResult = await _todoService.GetPaginationAsync(page.Value, pageSize);
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