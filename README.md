# Todo App

## Tech Stack

### Backend

- .NET 9.0
- Entity Framework Core with SQLite
- Clean Architecture (Domain, Application, Infrastructure, API layers)
- CQRS pattern with handlers
- Global exception handling

### Frontend

- React 18 with TypeScript
- React Query for server state management
- Zustand for client state (notifications)
- React Hook Form for form validation
- Tailwind CSS for styling
- Vite for build tooling

## Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/)
- npm (comes with Node.js)

## Getting Started

### 1. Clone repository

```bash
git clone https://github.com/nusanam/todo-app
cd TodoApp
```

### 2. Setup

API: http://localhost:5209
Swagger: http://localhost:5209/swagger
Frontend: http://localhost:5173

#### Quick Start

1. Run migrations: `dotnet ef database update`
2. Start API: `dotnet run --project src/TodoApi.Api`
3. Start frontend (in new terminal): `cd src/client && npm install && npm run dev`

#### Backend

Note: The app starts with an empty database intentionally to demonstrate full functionality.

```bash
# Navigate to the Web API
cd src/TodoApi.Api

# To install Entity Framework CLI tools if not already installed
dotnet tool install --global dotnet-ef

# Database migrations
dotnet ef migrations add Initial --project ../TodoApi.Infrastructure --startup-project .
dotnet ef database update --project ../TodoApi.Infrastructure --startup-project .

dotnet run

# API: http://localhost:5209
# Swagger: http://localhost:5209/swagger
```

#### Frontend

In a new terminal window:

```bash
# Navigate to client
cd src/Client

npm install
npm run dev

# Frontend: http://localhost:5173
```

### Building for Production

```bash
# Backend
cd src/TodoApi.Api
dotnet publish -c Release

# Frontend
cd src/Client
npm run build
```

## License

MIT
