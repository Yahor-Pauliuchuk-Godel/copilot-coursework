---
description: "Use when working on backend code, EF Core models, migrations, or database schema changes."
applyTo: "backend/**"
---
# Backend Instructions

## EF Core Migrations — CRITICAL RULE

**Never edit an existing migration file.** Existing migrations represent the history of applied schema changes.

When the model changes:
1. Update the model class in `backend/Models/`
2. Update the `DbSet` in `AppDbContext.cs`
3. Generate a new migration:
   ```powershell
   cd backend
   dotnet ef migrations add <DescriptiveMigrationName>
   ```
4. Review the generated migration file in `backend/Migrations/` to confirm it does what is expected
5. Apply it:
   ```powershell
   dotnet ef database update
   ```

> The `AppDbContextModelSnapshot.cs` file is auto-updated by EF when generating a migration — do not edit it manually.

## Controller Conventions

- Controllers must not make direct database calls. Inject and use service interfaces instead.
- Keep controllers thin: validate input, delegate to services, return results.

## Code Style

- Do not leave unused `using` directives in any file.
