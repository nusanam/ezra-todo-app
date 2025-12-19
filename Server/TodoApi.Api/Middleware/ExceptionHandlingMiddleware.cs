using System.ComponentModel.DataAnnotations;
using TodoApi.Domain.Exceptions;

namespace TodoApi.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, message) = exception switch
        {
            NotFoundException notFoundEx => (StatusCodes.Status404NotFound, notFoundEx.Message),
            ArgumentException argEx => (StatusCodes.Status400BadRequest, argEx.Message),
            ValidationException valEx => (StatusCodes.Status400BadRequest, valEx.Message),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
        };

        context.Response.StatusCode = statusCode;

        var response = new
        {
            status = statusCode,
            error = GetErrorTitle(statusCode),
            message,
            path = context.Request.Path.ToString()
        };

        await context.Response.WriteAsJsonAsync(response);
    }

    private static string GetErrorTitle(int statusCode)
    {
        return statusCode switch
        {
            400 => "Bad Request",
            404 => "Not Found",
            500 => "Internal Server Error",
            _ => "Error"
        };
    }
}