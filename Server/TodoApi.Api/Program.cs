using Microsoft.EntityFrameworkCore;
using TodoApi.Api.Middleware;
using TodoApi.Application.Tasks.Interfaces;
using TodoApi.Application.Tasks.Services;
using TodoApi.Infrastructure.Data;
using TodoApi.Infrastructure.Repositories;

// API configuration and middleware pipeline.
//
// Future security considerations for production:
// - Antiforgery tokens for state-changing operations
// - Rate limiting to prevent abuse
// - Input sanitization (EF Core uses parameterized queries to prevent SQL injection)
// - HTTPS enforcement
// - CORS policy refinement (currently allows localhost only)

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=tasks.db"));

// Repository (data access)
builder.Services.AddScoped<ITodoRepository, TodoRepository>();
// Service (business logic)
builder.Services.AddScoped<ITodoService, TodoService>();

builder.Services.AddControllers();

builder.Services.AddSwaggerGen();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.MapControllers();

// startup message
if (app.Environment.IsDevelopment())
    app.Lifetime.ApplicationStarted.Register(() =>
    {
        var logger = app.Services.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("==============================================");
        logger.LogInformation("TODO API is running!");
        logger.LogInformation("Swagger UI: http://localhost:5209/swagger");
        logger.LogInformation("Base API: http://localhost:5209/api/todos");
        logger.LogInformation("==============================================");
    });

app.Run();

// required for integration testing with WebAppFactory
public partial class Program
{
}