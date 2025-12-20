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
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

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
            CreatedAt = DateTime.Now
        };
    }

    public void UpdateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title)) throw new ArgumentException("Title cannot be empty.", nameof(title));

        if (title.Length > 100) throw new ArgumentException("Title cannot exceed 100 characters.", nameof(title));

        Title = title;
        UpdatedAt = DateTime.Now
;
    }

    public void MarkComplete()
    {
        IsCompleted = true;
        UpdatedAt = DateTime.Now
;
    }

    public void MarkIncomplete()
    {
        IsCompleted = false;
        UpdatedAt = DateTime.Now
;
    }

    public void Archive()
    {
        IsArchived = true;
        UpdatedAt = DateTime.Now
;
    }

    public void Unarchive()
    {
        IsArchived = false;
        UpdatedAt = DateTime.Now
;
    }
}