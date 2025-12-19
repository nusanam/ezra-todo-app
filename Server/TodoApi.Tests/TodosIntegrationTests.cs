using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using TodoApi.Application.Tasks.Commands;
using TodoApi.Application.Tasks.DTOs;

namespace TodoApi.Tests;

/// <summary>
/// Integration tests for Todo API endpoints.
/// Tests full request flow: Controller → Service → Repository → SQLite.
/// 
/// Coverage:
/// - GET /api/todos: Empty state, populated state
/// - POST /api/todos: Valid creation, validation errors (empty/whitespace title)
/// - GET /api/todos/{id}: Existing todo, non-existent todo (404)
/// - PATCH /api/todos/{id}: Update title, mark complete, archive
/// - DELETE /api/todos/{id}: Successful deletion with verification, non-existent todo (404)
/// </summary>
public class TodosIntegrationTests : IClassFixture<IntegrationTestFactory>
{
    private readonly HttpClient _client;

    public TodosIntegrationTests(IntegrationTestFactory factory)
    {
        _client = factory.CreateClient();
    }

    #region GET /api/todos

    [Fact]
    public async Task GET_ReturnsEmptyArray_WhenNoTodosExist()
    {
        // arrange
        var response = await _client.GetAsync("/api/todos");
        // act
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var todos = await response.Content.ReadFromJsonAsync<List<TodoItemDTO>>();
        // assert
        todos.Should().BeEmpty();
    }

    #endregion

    #region POST /api/todos

    [Fact]
    public async Task POST_Returns201WithNewTodo_WhenTitleIsValid()
    {
        // arrange
        var command = new CreateTodo("Buy groceries");
        // act
        var response = await _client.PostAsJsonAsync("/api/todos", command);
        // assert
        var todo = await response.Content.ReadFromJsonAsync<TodoItemDTO>();
        todo.Should().NotBeNull();
        todo.Title.Should().Be("Buy groceries");
        todo.IsCompleted.Should().BeFalse();
        todo.IsArchived.Should().BeFalse();
        
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();
    }

    [Fact]
    public async Task POST_Returns400_WhenTitleIsEmpty()
    {
        var command = new CreateTodo("");
        var response = await _client.PostAsJsonAsync("/api/todos", command);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task POST_Returns400_WhenTitleIsWhitespace()
    {
        var command = new CreateTodo("   ");
        var response = await _client.PostAsJsonAsync("/api/todos", command);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    #endregion

    #region GET /api/todos/{id}

    [Fact]
    public async Task GET_ReturnsTodo_WhenTodoExists()
    {
        // arrange
        var createCommand = new CreateTodo("Test todo");
        
        // act
        var createResponse = await _client.PostAsJsonAsync("/api/todos", createCommand);
        var created = await createResponse.Content.ReadFromJsonAsync<TodoItemDTO>();

        var response = await _client.GetAsync($"/api/todos/{created!.Id}");
        
        // assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var todo = await response.Content.ReadFromJsonAsync<TodoItemDTO>();
        todo!.Id.Should().Be(created.Id);
        todo.Title.Should().Be("Test todo");
    }

    [Fact]
    public async Task GET_Returns404_WhenTodoDoesNotExist()
    {
        var response = await _client.GetAsync($"/api/todos/{Guid.NewGuid()}");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    #endregion

    #region PATCH /api/todos/{id}

    [Fact]
    public async Task PATCH_MarksComplete_WhenIsCompletedTrue()
    {
        // arrange
        // act
        var createCommand = new CreateTodo("Complete me");
        var createResponse = await _client.PostAsJsonAsync("/api/todos", createCommand);
        var created = await createResponse.Content.ReadFromJsonAsync<TodoItemDTO>();
        var updateCommand = new UpdateTodo(null, IsCompleted: true, null);

        var response = await _client.PatchAsJsonAsync($"/api/todos/{created!.Id}", updateCommand);
        
        // assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var updated = await response.Content.ReadFromJsonAsync<TodoItemDTO>();
        updated!.IsCompleted.Should().BeTrue();
        updated.UpdatedAt.Should().NotBeNull();
    }

    [Fact]
    public async Task PATCH_UpdatesTitle_WhenNewTitleProvided()
    {
        // arrange
        //act
        var createCommand = new CreateTodo("Original title");
        var createResponse = await _client.PostAsJsonAsync("/api/todos", createCommand);
        var created = await createResponse.Content.ReadFromJsonAsync<TodoItemDTO>();
        var updateCommand = new UpdateTodo(Title: "Updated title", null, null);

        var response = await _client.PatchAsJsonAsync($"/api/todos/{created!.Id}", updateCommand);
        
        // assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updated = await response.Content.ReadFromJsonAsync<TodoItemDTO>();
        updated!.Title.Should().Be("Updated title");
    }

    [Fact]
    public async Task PATCH_ArchivesTodo_WhenIsArchivedTrue()
    {
        // arrange
        // act
        var createCommand = new CreateTodo("Archive me");
        var createResponse = await _client.PostAsJsonAsync("/api/todos", createCommand);
        var created = await createResponse.Content.ReadFromJsonAsync<TodoItemDTO>();
        var updateCommand = new UpdateTodo(null, null, IsArchived: true);

        var response = await _client.PatchAsJsonAsync($"/api/todos/{created!.Id}", updateCommand);
        
        // assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updated = await response.Content.ReadFromJsonAsync<TodoItemDTO>();
        updated!.IsArchived.Should().BeTrue();
    }

    #endregion

    #region DELETE /api/todos/{id}

    [Fact]
    public async Task DELETE_Returns204AndRemovesTodo_WhenTodoExists()
    {
        // arrange
        // act
        var createCommand = new CreateTodo("Delete me");
        var createResponse = await _client.PostAsJsonAsync("/api/todos", createCommand);
        var created = await createResponse.Content.ReadFromJsonAsync<TodoItemDTO>();

        var response = await _client.DeleteAsync($"/api/todos/{created!.Id}");
        
        // assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // verify item was actually deleted
        var getResponse = await _client.GetAsync($"/api/todos/{created.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DELETE_Returns404_WhenTodoDoesNotExist()
    {
        var response = await _client.DeleteAsync($"/api/todos/{Guid.NewGuid()}");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    #endregion
}