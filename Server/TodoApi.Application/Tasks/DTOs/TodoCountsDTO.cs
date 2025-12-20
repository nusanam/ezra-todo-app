namespace TodoApi.Application.Tasks.DTOs;

public record TodoCountsDTO(int All, int Active, int Completed, int Archived);