using Backend.Data;
using Backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Ensure wwwroot exists so WebRootPath is never null on a fresh clone
Directory.CreateDirectory(Path.Combine(builder.Environment.ContentRootPath, "wwwroot"));

// ── Services ────────────────────────────────────────────────────────────────

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

builder.Services.AddScoped<IEmployeeDocumentService, EmployeeDocumentService>();
builder.Services.AddSingleton<IFileStorageService, LocalFileStorageService>();

// ── Pipeline ─────────────────────────────────────────────────────────────────

var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseStaticFiles();

app.MapControllers();

app.Run();
