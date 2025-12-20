# Todo App

A fullstack task management application built with .NET 9 and React, demonstrating Clean Architecture principles and modern development practices.

## Table of Contents

- [Quick Start](#quick-start)
- [Application Overview](#application-overview)
- [API Reference](#api-reference)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Testing](#testing)
- [Assumptions](#assumptions)
- [Known Limitations](#known-limitations)
- [Architecture](#architecture)
- [Design Decisions](#design-decisions)
- [Scalability](#scalability-considerations)

---

## Quick Start

### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/)
- npm or nvm if you have multiple node versions

### Backend Setup

Swagger docs: http://localhost:5209/swagger

```bash
cd Server
dotnet restore
dotnet run --project TodoApi.Api
# API runs at http://localhost:5209
```

### Frontend Setup (in new terminal)

App runs at http://localhost:5173

```bash
cd Client
npm install
npm run dev
```

---

## Application Overview

A task management app where users can create, edit, complete, archive, and delete todos. Built as a demonstration of fullstack development with emphasis on clean architecture, type safety, and user experience.

**Backend:** .NET 9, EF Core, SQLite, xUnit
**Frontend:** React 19, TypeScript, React Query, Zustand, Tailwind CSS, Vite

### Core Features

- Create, read, update, delete todos
- Mark tasks complete/incomplete
- Archive tasks (soft delete)
- Search and filter by status (All, Active, Completed, Archived)
- Server-side pagination with status filtering
- Keyboard shortcuts for power users
- Optimistic updates for responsive UI
- Accessible UI (ARIA labels, screen reader announcements, keyboard navigation)

---

## API Reference

| Method | Endpoint          | Description                                              |
| ------ | ----------------- | -------------------------------------------------------- |
| GET    | /api/todos        | Get todos (supports `?page=1&pageSize=10&status=active`) |
| GET    | /api/todos/{id}   | Get single todo                                          |
| GET    | /api/todos/counts | Get counts by status for filter tabs                     |
| POST   | /api/todos        | Create todo                                              |
| PATCH  | /api/todos/{id}   | Update todo                                              |
| DELETE | /api/todos/{id}   | Delete todo                                              |

**Status filter values:** `all`, `active`, `completed`, `archived`

---

## Keyboard Shortcuts

| Key         | Action                                 |
| ----------- | -------------------------------------- |
| `n`         | Focus new todo input                   |
| `/`         | Focus search                           |
| `Esc`       | Cancel edit / Clear search             |
| `Enter`     | Save edit (when editing)               |
| `Spacebar`  | Toggle complete (when focused on task) |
| `Tab`       | Navigate forward                       |
| `Shift+Tab` | Navigate backward                      |

---

## Testing

### Backend Integration Tests

```bash
cd Server
dotnet test
```

Tests cover full HTTP pipeline: Controller → Service → Repository → SQLite (in-memory).

Coverage:

- GET /api/todos: Empty state, populated state
- POST /api/todos: Valid creation, validation errors
- GET /api/todos/{id}: Existing and non-existent todos
- PATCH /api/todos/{id}: Update title, mark complete, archive
- DELETE /api/todos/{id}: Successful deletion, non-existent todos

### Frontend Tests

```bash
cd Client
npm test
```

---

## Assumptions

1. **Single user:** No authentication required for demo
2. **Small dataset:** Hundreds of todos, not millions
3. **Modern browser:** ES6+, no IE11 support
4. **Local SQLite:** Appropriate for demo, not production
5. **No offline support:** Requires network connectivity

---

## Known Limitations

1. **Search filters current page only** — Server-side search endpoint needed for cross-page search
2. **SQLite DateTimeOffset** — Can't sort by DateTimeOffset; using DateTime instead
3. **50ms search debounce** — Tradeoff between responsiveness and render batching

---

## Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│  User Action → Component → Hook → API Call → Update UI          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (.NET 9 API)                       │
│  Request → Controller → Service → Repository → SQLite           │
└─────────────────────────────────────────────────────────────────┘
```

### Example Flow: Creating a Todo

1. **User** types "Push code cleanup changes to azure" and clicks Add
2. **AddTodo.tsx** calls `createMutation.mutate({ title })`
3. **useCreateMutation** sends POST to `/api/todos`
4. **TodosController** receives request, calls `ITodoService.CreateAsync()`
5. **TodoService** validates, creates a `TodoItem` domain entity, calls `ITodoRepository.AddAsync()`
6. **TodoRepository** persists to SQLite via Entity Framework
7. **Response** returns new `TodoItemDTO`
8. **React Query** invalidates cache, refetches, and updates UI

### Backend Architecture (Clean Architecture)

```
TodoApi.Api/             # HTTP layer (Controllers, Exception Handling Middleware)
    ↓ depends on

TodoApi.Application/     # Business logic (Services, DTOs, Interfaces, Validation)
    ↓ depends on

TodoApi.Domain/          # Core entities (TodoItem, Exceptions)

    ↑ implements
TodoApi.Infrastructure/  # Data access (EF Core, SQLite, Repositories)
```

**Goal:** Dependencies flow inward and domain has zero dependencies. Infrastructure implements interfaces defined in Application.

**Why this structure?**

- Easy to test: Mock `ITodoRepository` to test `TodoService` in isolation
- Flexible: Swap SQLite for PostgreSQL by changing only Infrastructure
- Maintainable: Business logic lives in one place (Application/Domain)

### Frontend Architecture

```
src/
├── api/              # API client (fetch wrapper, type-safe calls)
├── components/       # Reusable presentational components
├── features/         # Feature-specific components (TodoItem, TodoList, TodoPage)
├── hooks/            # Custom hooks (mutations, queries, keyboard shortcuts)
├── stores/           # Zustand stores (UI state, not server state)
└── utils/            # Helpers (date formatting, accessibility)
```

**State Management Strategy:**

- **Server state** (todos): React Query - handles caching, refetching, optimistic updates without manual boilerplate
- **UI state** (filters, search, editing): Zustand - simple, no boilerplate

**Why not Redux?** Overkill for this scope with excessive boilerplate. React Query handles server state better. Zustand uses immutability principles with lower overhead (8kb bundle size) and less boilerplate for UI state.

---

## Design Decisions

### SQLite Limitations

SQLite doesn't support `DateTimeOffset` in ORDER BY clauses. Changed to `DateTime` for proper sorting. Production databases (PostgreSQL, SQL Server) support `DateTimeOffset` natively.

### Why Single TodoService Instead of Separate Handlers?

Initially implemented CQRS-style handlers (CreateTodoHandler, DeleteTodoHandler, etc.). Consolidated into single `TodoService` because:

- **Simpler DI:** Needs one registration instead of five
- **Cohesive:** CRUD on same entity belongs together
- **Appropriate for scope:** CQRS separation matters when reads/writes have different scaling needs. A basic todo app doesn't have that requirement.

**When I'd separate:** If queries needed caching layers, read replicas, or separate scaling from commands.

### Why Offset Pagination Over Cursor-Based?

Backend supports pagination via `?page=1&pageSize=10`. Chose offset pagination because:

- **Simpler implementation:** Standard LIMIT/OFFSET SQL
- **Appropriate for dataset size:** Todo lists are typically <1000 items
- **Supports random access:** Users can jump to page 5 directly

**When I'd use cursor pagination:** Social media feeds, infinite scroll, handling millions of records, or frequently changing data where offset would cause duplicates/skips.

### Why Server-Side Status Filtering?

Status filtering (All/Active/Completed/Archived) happens on the backend via query parameter:

```
GET /api/todos?page=1&pageSize=10&status=active
```

**Benefits:**

- Pagination counts are accurate for the filtered set
- Archiving all items on a page correctly shows remaining items
- Scales to large datasets without fetching everything

### Why Client-Side Search?

Search filtering remains client-side (filters current page results) because:

- **Instant feedback:** No network latency while typing
- **Simple implementation:** Just `.filter()` on current page data
- **Acceptable tradeoff:** For personal todo lists, searching within current view is often sufficient

**Limitation:** Search only filters the current page. For cross-page search, a server-side search endpoint would be needed.

### Why Optimistic Updates?

Allows immediate UI updates when toggling between complete/incomplete and archive/unarchive, and delete, without waiting for the server confirms. Benefits:

- **Responsive feel:** No loading spinners for simple actions
- **Automatic rollback:** React Query reverts if server fails

---

## Scalability Considerations

### Current State (Single User, <1000 Todos)

- SQLite file database
- Server-side pagination and status filtering
- Client-side search (filters current page)
- No authentication

### Scaling to 10K+ Todos

- Utilize server-side pagination using different strategies possibly
- Add server-side search endpoint to filter _all_ todos and not just those on the current page
- Add database indexes on `CreatedAt`, `IsCompleted`, `IsArchived`

### Scaling to Multiple Users

- Add User entity and authentication (JWT)
  - Possibly multiple users in one profile to allow switching between todolists in different domains (personal projects vs. work)
- Add `UserId` foreign key to `TodoItem`
- Filter queries by authenticated user
- Add authorization middleware

### Scaling to High Traffic

- Replace SQLite with PostgreSQL
- Add Redis caching for read-heavy endpoints
- Consider read replicas for queries
- Add rate limiting middleware
- Deploy behind load balancer
- Production security: HTTPS enforcement, antiforgery tokens, password hashing (bcrypt/argon2), tightened CORS policy