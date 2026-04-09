using Microsoft.AspNetCore.Http;

namespace Backend.Services;

public class LocalFileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _env;

    public LocalFileStorageService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> SaveAsync(int employeeId, IFormFile file)
    {
        var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "employees", employeeId.ToString());
        Directory.CreateDirectory(uploadsFolder);

        var storedFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var fullPath = Path.Combine(uploadsFolder, storedFileName);

        await using var stream = File.Create(fullPath);
        await file.CopyToAsync(stream);

        return $"uploads/employees/{employeeId}/{storedFileName}";
    }

    public string GetFullPath(string storagePath) =>
        Path.Combine(_env.WebRootPath, storagePath);

    public bool Exists(string storagePath) =>
        File.Exists(GetFullPath(storagePath));

    public void Delete(string storagePath)
    {
        var fullPath = GetFullPath(storagePath);
        if (File.Exists(fullPath))
            File.Delete(fullPath);
    }
}
