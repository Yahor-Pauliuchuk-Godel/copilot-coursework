using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class EmployeeDocumentService : IEmployeeDocumentService
{
    private readonly AppDbContext _db;
    private readonly IFileStorageService _storage;

    public EmployeeDocumentService(AppDbContext db, IFileStorageService storage)
    {
        _db = db;
        _storage = storage;
    }

    public Task<bool> EmployeeExistsAsync(int employeeId) =>
        _db.Employees.AnyAsync(e => e.Id == employeeId);

    public async Task<IEnumerable<EmployeeDocumentDto>> GetAllAsync(int employeeId) =>
        await _db.EmployeeDocuments
            .Where(d => d.EmployeeId == employeeId)
            .Select(d => new EmployeeDocumentDto(d.Id, d.FileName, d.ContentType, d.FileSizeBytes, d.UploadedAt))
            .ToListAsync();

    public Task<EmployeeDocument?> GetByIdAsync(int employeeId, int id) =>
        _db.EmployeeDocuments.FirstOrDefaultAsync(d => d.Id == id && d.EmployeeId == employeeId);

    public async Task<EmployeeDocumentDto> UploadAsync(int employeeId, IFormFile file)
    {
        var storagePath = await _storage.SaveAsync(employeeId, file);

        var document = new EmployeeDocument
        {
            EmployeeId = employeeId,
            FileName = file.FileName,
            ContentType = file.ContentType,
            FileSizeBytes = file.Length,
            StoragePath = storagePath,
            UploadedAt = DateTime.UtcNow
        };

        _db.EmployeeDocuments.Add(document);
        await _db.SaveChangesAsync();

        return new EmployeeDocumentDto(document.Id, document.FileName, document.ContentType, document.FileSizeBytes, document.UploadedAt);
    }

    public async Task<bool> DeleteAsync(int employeeId, int id)
    {
        var document = await _db.EmployeeDocuments.FirstOrDefaultAsync(d => d.Id == id && d.EmployeeId == employeeId);
        if (document is null) return false;

        _storage.Delete(document.StoragePath);
        _db.EmployeeDocuments.Remove(document);
        await _db.SaveChangesAsync();

        return true;
    }
}
