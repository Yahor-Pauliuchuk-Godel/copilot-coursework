# Full-Stack Starter Template

A minimal full-stack starter with a **React 18 + Vite + TypeScript** frontend and a **.NET 8 ASP.NET Core Web API** backend backed by **SQL Server via EF Core**.

---

## Repository structure

```
copilot-coursework/
├── backend/
│   ├── Backend.csproj
│   ├── Program.cs
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── Controllers/
│   │   └── ItemsController.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   └── Models/
│       └── Item.cs
└── frontend/
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx            ← Bootstrap CSS imported here
        ├── App.tsx             ← React Router routes
        ├── components/
        │   └── NavBar.tsx
        ├── context/
        │   └── AppContext.tsx  ← Global state via useState + useContext
        └── pages/
            ├── HomePage.tsx
            └── ItemsPage.tsx   ← Fetches /api/items and renders a table
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
  "DefaultConnection": "Server=localhost;Database=StarterDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Common alternatives:

| Scenario | Connection string |
|---|---|
| LocalDB | `Server=(localdb)\\mssqllocaldb;Database=StarterDb;Trusted_Connection=True;` |
| SQL Server Express | `Server=.\\SQLEXPRESS;Database=StarterDb;Trusted_Connection=True;TrustServerCertificate=True;` |
| SQL Server with login | `Server=localhost;Database=StarterDb;User Id=sa;Password=YourPassword;TrustServerCertificate=True;` |

### 1.3 Create and apply EF Core migrations

```powershell
# Still inside the backend folder
dotnet ef migrations add InitialCreate
dotnet ef database update
```

This creates the `StarterDb` database and the `Items` table.

### 1.4 Run the backend

```powershell
dotnet run
```

The API listens on:
- **https://localhost:5001** (HTTPS)
- **http://localhost:5000** (HTTP)

#### Available endpoints

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/items` | List all items |
| `GET` | `/api/items/{id}` | Get a single item |
| `POST` | `/api/items` | Create an item |
| `PUT` | `/api/items/{id}` | Update an item |
| `DELETE` | `/api/items/{id}` | Delete an item |

#### Quick test (PowerShell)

```powershell
# Create an item
Invoke-RestMethod -Method Post -Uri https://localhost:5001/api/items `
  -ContentType "application/json" `
  -Body '{"name":"Widget","description":"A sample widget","price":9.99}'

# List all items
Invoke-RestMethod https://localhost:5001/api/items
```

---

## 2 — Frontend setup

### 2.1 Install dependencies

```powershell
cd frontend
npm install
```

### 2.2 Run the dev server

```powershell
npm run dev
```

The app is available at **http://localhost:5173**.

### 2.3 Build for production

```powershell
npm run build   # outputs to frontend/dist/
```

---

## 3 — Running both together

Open two terminals:

```powershell
# Terminal 1 — backend
cd backend
dotnet run

# Terminal 2 — frontend
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser. The **Items** page calls `https://localhost:5001/api/items` via the Fetch API and renders the results in a Bootstrap table.

---

## Key design decisions

- **No Swagger / no auth** — kept deliberately minimal.
- **Bootstrap** is imported as an npm package in `src/main.tsx` (no CDN).
- **State management** uses `useState` + `useContext` only — no Redux or Zustand.
- **HTTP calls** use the native `fetch` API only — no axios.
- **CORS** is locked to `http://localhost:5173` in `Program.cs`.
- **EF Core Code-First** — edit `Models/Item.cs`, then run `dotnet ef migrations add <Name>` + `dotnet ef database update` to evolve the schema.

