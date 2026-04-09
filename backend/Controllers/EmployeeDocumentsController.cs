using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/employees/{employeeId:int}/documents")]
public class EmployeeDocumentsController : ControllerBase
{
    private readonly IEmployeeDocumentService _service;
    private readonly IFileStorageService _storage;

    public EmployeeDocumentsController(IEmployeeDocumentService service, IFileStorageService storage)
    {
        _service = service;
        _storage = storage;
    }

    // GET api/employees/5/documents
    [HttpGet]
    public async Task<IActionResult> GetAll(int employeeId)
    {
        if (!await _service.EmployeeExistsAsync(employeeId)) return NotFound();
        return Ok(await _service.GetAllAsync(employeeId));
    }

    // GET api/employees/5/documents/3
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Download(int employeeId, int id)
    {
        var document = await _service.GetByIdAsync(employeeId, id);
        if (document is null) return NotFound();
        if (!_storage.Exists(document.StoragePath)) return NotFound();
        return PhysicalFile(_storage.GetFullPath(document.StoragePath), document.ContentType, document.FileName);
    }

    // POST api/employees/5/documents
    [HttpPost]
    public async Task<IActionResult> Upload(int employeeId, [FromForm] IFormFile file)
    {
        if (!await _service.EmployeeExistsAsync(employeeId)) return NotFound();
        if (file is null || file.Length == 0) return BadRequest("No file provided.");

        var dto = await _service.UploadAsync(employeeId, file);
        return CreatedAtAction(nameof(Download), new { employeeId, id = dto.Id }, dto);
    }

    // DELETE api/employees/5/documents/3
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int employeeId, int id)
    {
        if (!await _service.DeleteAsync(employeeId, id)) return NotFound();
        return NoContent();
    }
}
