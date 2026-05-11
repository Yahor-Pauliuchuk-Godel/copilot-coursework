# Employee Document Manager

A full-stack application for managing employee profiles and their associated documents — upload, download, and delete files per employee. Built with a **React 18 + Vite + TypeScript** frontend and a **.NET 8 ASP.NET Core Web API** backend backed by **SQL Server via EF Core**.

---

## Repository structure

```
copilot-coursework/
├── backend/
│   ├── Program.cs           ← App entry point, DI registration, middleware
│   ├── appsettings.json     ← Connection string and app configuration
│   ├── Controllers/         ← CRUD and document API endpoints
│   ├── Data/
│   │   └── AppDbContext.cs  ← EF Core DbContext with Employees and EmployeeDocuments
│   ├── Migrations/          ← EF Core migration files
│   ├── Models/              ← Entity and DTO definitions
│   ├── Services/            ← Document and file storage services
│   └── wwwroot/
│       └── uploads/         ← Uploaded files organised by employee ID
└── frontend/
    ├── vite.config.ts       ← Vite config with API proxy
    └── src/
        ├── main.tsx         ← Bootstrap CSS imported here
        ├── App.tsx          ← React Router routes
        ├── config.ts        ← API base URL config
        ├── assets/
        │   └── icons/       ← SVG icons used in the sidebar and breadcrumb
        ├── components/
        │   └── header/      ← Header and breadcrumb navigation
        ├── context/
        │   └── ThemeContext.tsx  ← Light / dark theme state via useContext
        ├── hooks/           ← Custom React hooks and React Query data fetchers
        ├── pages/
        │   ├── employees/   ← Employee list and detail pages
        │   └── SettingsPage.tsx  ← Theme toggle
        └── styles/          ← Component-scoped CSS files
```

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| [.NET SDK](https://dotnet.microsoft.com/download) | 8.0 |
| [Node.js](https://nodejs.org/) | 18 LTS |
| SQL Server | 2019 / LocalDB / Express |
| EF Core CLI | `dotnet tool install -g dotnet-ef` |

---

## 1 — Backend setup

### 1.1 Restore & build

```powershell
cd backend
dotnet restore
dotnet build
```

### 1.2 Configure the connection string

Open `backend/appsettings.json` and update the `DefaultConnection` value to match your SQL Server instance:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=DocManage;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Common alternatives:

| Scenario | Connection string |
|---|---|
| LocalDB | `Server=(localdb)\\mssqllocaldb;Database=DocManage;Trusted_Connection=True;` |
| SQL Server Express | `Server=.\\SQLEXPRESS;Database=DocManage;Trusted_Connection=True;TrustServerCertificate=True;` |
| SQL Server with login | `Server=localhost;Database=DocManage;User Id=sa;Password=YourPassword;TrustServerCertificate=True;` |

### 1.3 Apply EF Core migrations

```powershell
dotnet ef database update
```

This creates the database and applies all migrations.

#### Available endpoints

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/employees` | List all employees |
| `GET` | `/api/employees/{id}` | Get a single employee |
| `POST` | `/api/employees` | Create an employee |
| `PUT` | `/api/employees/{id}` | Update an employee |
| `DELETE` | `/api/employees/{id}` | Delete an employee (also deletes all their documents) |
| `GET` | `/api/employees/{id}/documents` | List documents for an employee |
| `GET` | `/api/employees/{id}/documents/{docId}` | Download a document |
| `POST` | `/api/employees/{id}/documents` | Upload a document |
| `DELETE` | `/api/employees/{id}/documents/{docId}` | Delete a document |

---

## 2 — Frontend setup

### 2.1 Install dependencies

```powershell
cd frontend
npm install
```

### 2.2 Build for production

```powershell
npm run build   # outputs to frontend/dist/
```

---

## 3 — Running the app

The easiest way is to use the provided script from the repo root, which opens both processes in separate terminal windows:

```powershell
.\run-app.ps1
```

Alternatively, open two terminals manually:

```powershell
# Terminal 1 — backend
cd backend
dotnet run

# Terminal 2 — frontend
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## To Do

- **Server-side pagination** — the Employees page currently fetches all rows at once and paginates client-side. Move pagination to the backend by accepting `page` and `pageSize` query parameters on `GET /api/employees` and returning only the requested slice.

