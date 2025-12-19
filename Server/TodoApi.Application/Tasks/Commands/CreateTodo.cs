using System.ComponentModel.DataAnnotations;
using TodoApi.Application.Tasks.Validation;

namespace TodoApi.Application.Tasks.Commands;

public record CreateTodo(
    [Required(ErrorMessage = "Title is required.")]
    [NotWhitespace]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 400 characters.")]
    string Title);