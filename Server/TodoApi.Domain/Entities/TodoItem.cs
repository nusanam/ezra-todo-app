namespace TodoApi.Domain.Entities;

public class TodoItem
{
    private TodoItem() // enforce factory method
    {
    }

    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public bool IsCompleted { get; private set; }
    public bool IsArchived { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset? UpdatedAt { get; private set; }

    public static TodoItem Create(string title)
    {
        if (string.IsNullOrWhiteSpace(title)) throw new ArgumentException("Title cannot be empty.", nameof(title));
        if (title.Length > 100) throw new ArgumentException("Title cannot exceed 100 characters.", nameof(title));

        return new TodoItem
        {
            Id = Guid.NewGuid(),
            Title = title,
            IsCompleted = false,
            IsArchived = false,
            CreatedAt = DateTimeOffset.UtcNow
        };
    }

    public void UpdateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title)) throw new ArgumentException("Title cannot be empty.", nameof(title));

        if (title.Length > 100) throw new ArgumentException("Title cannot exceed 100 characters.", nameof(title));

        Title = title;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void MarkComplete()
    {
        IsCompleted = true;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void MarkIncomplete()
    {
        IsCompleted = false;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Archive()
    {
        IsArchived = true;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Unarchive()
    {
        IsArchived = false;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}