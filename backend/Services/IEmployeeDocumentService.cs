using Backend.Models;
using Microsoft.AspNetCore.Http;

namespace Backend.Services;

public interface IEmployeeDocumentService
{
    Task<bool> EmployeeExistsAsync(int employeeId);
    Task<IEnumerable<EmployeeDocumentDto>> GetAllAsync(int employeeId);
    Task<EmployeeDocument?> GetByIdAsync(int employeeId, int id);
    Task<EmployeeDocumentDto> UploadAsync(int employeeId, IFormFile file);
    Task<bool> DeleteAsync(int employeeId, int id);
}
