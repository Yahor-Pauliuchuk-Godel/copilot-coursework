namespace Backend.Models;

public record EmployeeDocumentDto(int Id, string FileName, string ContentType, long FileSizeBytes, DateTime UploadedAt);
