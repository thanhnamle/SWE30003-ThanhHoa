# 🚚 Smart Fleet Management (SmartFM) System

> **SWE30003 - Software Architecture and Design | Assignment 3**
> *Swinburne University of Technology*

SmartFM is an enterprise-grade, centralized fleet management platform designed to streamline logistics operations, vehicle assignment, driver routing, freight order fulfillment, and automated financial billing.

---

## 👥 1. Team Work Plan & Role-Based Allocation

The project implementation follows a **Role-Based Allocation** model as defined in `docs/01-team-work-plan.md`. Each team member owns a specific architectural layer and set of core deliverables while collaborating on end-to-end integration:

| Role                                                              | Assigned Member                      | Main Ownership & Key Responsibilities                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Role 1: Domain and Application Logic & Web API Services** | **Lê Thành Nam**             | • Core domain business rules & use cases (Payload/Volume bounds, License qualification rules)• ASP.NET Core Web API Controllers, DTO contracts, & Application Services (`OrderService`, `PaymentService`, etc.)• Full-Stack API integration, state management, & financial billing engine |
| **Role 2: API, Persistence, and Integration**               | **Nguyễn Bá Chánh**        | • Database architecture & schema design, EF Core`SmartFmDbContext` & entity configurations• Domain Entities (`Order`, `Vehicle`, `Driver`, `Shipment`, `Invoice`, `Payment`) & supporting Enums• EF Core migrations, bootstrap reference seed data, & backend integration setup |
| **Role 3: Frontend and User Experience**                    | **Huỳnh Bá Thành**         | • Pages, forms, client-side validation (Zod & React Hook Form), & API integration calls• React 18 + TypeScript SPA UI components (Vite + TailwindCSS), navigation, & user feedback                                                                                                             |
| **Role 4: Testing, Evidence, and Documentation**            | **Huỳnh Đoàn Hoàng Minh** | • Unit & integration test coordination, execution evidence, design-change documentation (`docs/`)• Quality assurance, final report assembly, & project documentation                                                                                                                         |

> **Shared Deliverables:** All roles participate in code reviews, design-change logging, and end-to-end operational verification across the four business areas.

---

## 🏗️ 2. Monorepo Architecture & Project Structure

The platform adopts a **Modular Monolith** approach using **Clean Architecture (Layered Architecture)** to ensure clear separation of concerns, high maintainability, and testability.

```text
Assignment 3/
├── 📁 backend/                        # .NET 9 Web API Monolith
│   └── src/
│       ├── 🏛️ SmartFM.API             # Presentation Layer (Controllers, Middleware, Swagger)
│       ├── 💼 SmartFM.Application     # Business Logic (Services, DTOs, Mapping Profiles)
│       ├── 🎯 SmartFM.Domain          # Core Layer (Entities, Enums, Value Objects, Domain Rules)
│       ├── 🗄️ SmartFM.Infrastructure  # Persistence Layer (EF Core, DbContext, Repositories)
│       └── 🧰 SmartFM.Shared          # Shared Utilities (Models, Exceptions, Helpers)
│   └── tests/
│       ├── 🧪 SmartFM.UnitTests       # Domain & Service Unit Tests (xUnit)
│       └── 🧪 SmartFM.IntegrationTests# WebAPI Integration Tests (CustomWebApplicationFactory)
├── 📁 frontend/                       # React 18 + TypeScript SPA
│   ├── src/
│   │   ├── 🧩 components/             # Reusable UI Components (Modal, Table, Header, Sidebar)
│   │   ├── ⚡ features/               # Feature-Based Modules (Vehicles, Drivers, Orders, Payments, Tracking)
│   │   ├── 🌐 lib/                    # API Client & Axios Instance
│   │   └── 🧪 __tests__/              # React Component Tests (Vitest + Testing Library)
│   └── public/                        # Static Assets & Team Avatars
└── 📁 docs/                           # Architecture Documentation & Work Plan
```

---

## 🎯 3. Implemented Business Areas

The system fully realizes **4 Core Business Modules** end-to-end:

### 1. 📦 Customer & Order Handling

- Customer account management and active session handling.
- Freight transport ordering with automatic price calculation based on category base fee, weight, volume, and distance.

### 2. 🚛 Shipment & Resource Assignment

- Dispatch management matching eligible drivers and vehicles to shipments.
- **Driver License Verification:** Validates driver license classes (e.g., B2, C, FC) against vehicle type requirements.
- **Vehicle Domain Capacity Validation:** Enforces realistic logistics payload ($kg$) & volume ($m^3$) bounds (Van: 0.5T - 2T, Container: 15T - 40T).

### 3. 💳 Invoice, Payment & Receipt

- **Automated Invoicing:** Auto-generates an unpaid `Invoice` immediately upon order creation.
- **Payment Processing:** Interactive glassmorphism Payment Modal supporting Credit Card, Bank Transfer, and Cash options.
- **Receipt Ledger:** Automatically generates and archives settlement `Receipts` upon payment completion.

### 4. 🗺️ Tracking, Exception Handling & Operational Reporting

- **Live GPS Tracking:** Displays origin/destination addresses, real-time status progression, and estimated delivery timeline.
- **Exception Logging:** Delivery exception recording and resolution tracking.
- **Operational Metrics:** Analytics dashboard for fleet utilization and financial revenue.

---

## 🛠️ 4. Tech Stack & Libraries

- **Backend Framework:** C# / .NET 9.0 SDK
- **Database & ORM:** Entity Framework Core 9 (MySQL / In-Memory Db)
- **Validation & Mapping:** FluentValidation, AutoMapper
- **Logging & API Specs:** Serilog, Swagger / OpenAPI 3.0
- **Frontend Framework:** React 18, TypeScript, Vite
- **Styling & UI:** TailwindCSS, Lucide Icons, Custom Animations
- **State & Forms:** `@tanstack/react-query`, `react-hook-form`, `zod`
- **Testing Frameworks:** xUnit, FluentAssertions, Vitest, `@testing-library/react`

---

## 🚀 5. Getting Started & Setup Guide

### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js (v18+) &amp; npm](https://nodejs.org/)

---

### 1. Database & Persistence Setup (MySQL in Docker)

As documented in `docs/09-pr-description-persistence.md`, the database is run using a MySQL 8 container in Docker and EF Core migrations:

**Step 1: Start MySQL 8 Docker Container**

```bash
docker run --name smartfm-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=smartfm -p 3306:3306 -d mysql:8
```

**Step 2: Apply EF Core Migrations (Database Schema & Bootstrap Seed Data)**

```bash
cd backend
dotnet ef database update --project src/SmartFM.Infrastructure --startup-project src/SmartFM.API
```

---

### 2. Backend Server Setup

```bash
cd backend/src/SmartFM.API
dotnet build
dotnet run
```

- **Backend API Base URL:** `http://localhost:5000` / `https://localhost:5001`
- **Swagger Documentation:** `http://localhost:5000/swagger`

---

### 3. Frontend Client Setup

```bash
cd frontend
npm install
npm run dev
```

- **Application Portal:** `http://localhost:5173`

---

### Running Automated Test Suites

```bash
# Run Backend Unit & Integration Tests
cd backend
dotnet test

# Run Frontend Vitest Component Tests
cd frontend
npm run test
```

---

## 📄 Documentation Index (`docs/`)

- [00. Project Structure Review](docs/00-project-structure-review.md)
- [01. Shared Team Work Plan](docs/01-team-work-plan.md)
- [02. Role 1: Domain &amp; Application Logic](docs/02-role-domain-application.md)
- [03. Role 2: API, Persistence &amp; Integration](docs/03-role-api-persistence-integration.md)
- [04. Role 3: Frontend &amp; User Experience](docs/04-role-frontend-ux.md)
- [05. Role 4: Testing, Evidence &amp; Documentation](docs/05-role-testing-evidence-documentation.md)
- [06. Git Workflow &amp; Shared Contracts](docs/06-git-workflow-and-contracts.md)
- [07. Assignment 3 Evidence Checklist](docs/07-assignment-3-evidence-checklist.md)

---

## 📄 License & Academic Integrity

This project is developed for academic assessment purposes under **SWE30003 - Software Architecture and Design** at **Swinburne University of Technology**. All rights reserved.
