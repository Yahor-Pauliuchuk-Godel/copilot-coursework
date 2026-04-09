using Microsoft.AspNetCore.Http;

namespace Backend.Services;

public interface IFileStorageService
{
    Task<string> SaveAsync(int employeeId, IFormFile file);
    string GetFullPath(string storagePath);
    bool Exists(string storagePath);
    void Delete(string storagePath);
}
