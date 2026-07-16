# Smart Fleet Management (SmartFM) - Backend Setup

This is the backend for the Smart Fleet Management System, a centralized platform for logistics companies.

## Architecture

The project follows a **Clean Architecture** (Layered Architecture) pattern:
- **SmartFM.API**: The presentation layer containing Controllers, Middleware, and API Configurations.
- **SmartFM.Application**: The business logic layer containing DTOs, Services, Interfaces, AutoMapper Profiles, and FluentValidation rules.
- **SmartFM.Domain**: The core layer containing Domain Entities, Enums, and Value Objects. No database dependencies.
- **SmartFM.Infrastructure**: The persistence layer implementing Entity Framework Core, Repositories, and DbContext.
- **SmartFM.Shared**: Contains shared models, constants, extensions, and custom exceptions.

## Technologies

- .NET 9 (C#)
- Entity Framework Core with MySQL (Pomelo)
- Serilog (Console Logging)
- AutoMapper
- FluentValidation
- JWT Authentication (Configuration ready)
- Swagger / OpenAPI

## Prerequisites

- .NET 9 SDK
- MySQL Database

## How to Run

1. **Clone the repository** and navigate to `backend/src/SmartFM.API`.
2. **Update Database Connection**: Open `appsettings.json` in the API project and modify the `SmartFM` ConnectionString to match your MySQL database credentials.
3. **Build the Solution**:
   ```bash
   dotnet build
   ```
4. **Run the API**:
   ```bash
   cd backend/src/SmartFM.API
   dotnet run
   ```
5. **Access Swagger UI**: Open your browser and navigate to `https://localhost:<port>/swagger` (or `http://localhost:<port>/swagger`).

## Health Check
The API includes a basic health check endpoint to verify it is running:
- **GET** `/api/health` -> Returns `{"status": "Healthy"}`
