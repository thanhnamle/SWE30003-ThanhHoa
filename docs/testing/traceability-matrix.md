# Traceability Matrix - Smart Fleet Management System (SmartFM)

This document provides a comprehensive mapping between the project's Functional Requirements, Design Modules, and the corresponding Test Cases across both Frontend (React) and Backend (.NET Core).

## 1. Authentication & Authorization

| Req ID | Requirement Description | Component / Module | Test Case ID | Test Description | Frontend Coverage | Backend Coverage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-AUTH-01** | User Registration (Customer/Driver) | Auth Module | `TC-AUTH-01` | Verify successful registration flow and password validation | `Register.test.tsx` | `AuthApiTests.cs` | ✅ Passed |
| **REQ-AUTH-02** | User Login & Token Generation | Auth Module | `TC-AUTH-02` | Verify login with valid credentials returns JWT token | `Login.test.tsx`, `AuthContext.test.tsx` | `AuthApiExtendedTests.cs` | ✅ Passed |
| **REQ-AUTH-03** | Role-based Access Control (RBAC) | Security | `TC-AUTH-03` | Verify unauthorized users cannot access admin endpoints | `AuthContext.test.tsx` | `AuthApiTests.cs` | ✅ Passed |

## 2. Order Management

| Req ID | Requirement Description | Component / Module | Test Case ID | Test Description | Frontend Coverage | Backend Coverage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-ORD-01** | Create Transport Order | Order Service | `TC-ORD-01` | Verify order creation with valid capacity and customer | `OrderForm.test.tsx` | `OrderServiceTests.cs`, `OrderTests.cs` | ✅ Passed |
| **REQ-ORD-02** | Calculate Order Estimates | Order Service | `TC-ORD-02` | Verify cost estimation based on distance and vehicle type | `OrderForm.test.tsx` | `OrderServiceTests.cs` | ✅ Passed |
| **REQ-ORD-03** | Validate Cargo Constraints | Domain Logic | `TC-ORD-03` | Verify system rejects orders exceeding max payload | `OrderForm.test.tsx` | `EntityInvariantBoundaryTests.cs` | ✅ Passed |

## 3. Shipment & Fleet Assignment

| Req ID | Requirement Description | Component / Module | Test Case ID | Test Description | Frontend Coverage | Backend Coverage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-SHP-01** | Assign Driver and Vehicle | Assignment Module | `TC-SHP-01` | Verify shipment is correctly linked to driver/vehicle | `Dashboard.test.tsx` | `ShipmentServiceTests.cs`, `ShipmentApiTests.cs` | ✅ Passed |
| **REQ-SHP-02** | Prevent Double Booking | Validation | `TC-SHP-02` | Verify same driver/vehicle cannot be assigned to overlapping trips | N/A (Backend Logic) | `AssignmentEntityTests.cs` | ✅ Passed |
| **REQ-SHP-03** | Manage Vehicle Lifecycle | Fleet Service | `TC-SHP-03` | Verify CRUD operations on Vehicle domain entity | `Dashboard.test.tsx` | `VehicleTests.cs` | ✅ Passed |

## 4. GPS Tracking & Proof of Delivery

| Req ID | Requirement Description | Component / Module | Test Case ID | Test Description | Frontend Coverage | Backend Coverage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-TRK-01** | Real-time Location Updates | Tracking Module | `TC-TRK-01` | Verify map updates with correct GPS coordinates | `MapView.test.tsx` | `TrackingServiceTests.cs`, `TrackingApiTests.cs` | ✅ Passed |
| **REQ-TRK-02** | Upload Proof of Delivery (PoD) | Tracking / Storage | `TC-TRK-02` | Verify driver can upload image upon delivery completion | `MapView.test.tsx` | `TrackingApiTests.cs` | ✅ Passed |
| **REQ-TRK-03** | Update Shipment Status | Domain Logic | `TC-TRK-03` | Verify shipment transitions (Pending -> InTransit -> Delivered) | `MapView.test.tsx` | `ShipmentTests.cs`, `EnumCoverageTests.cs` | ✅ Passed |

## 5. Payments & Contracts

| Req ID | Requirement Description | Component / Module | Test Case ID | Test Description | Frontend Coverage | Backend Coverage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-PAY-01** | Process Invoice Payment | Billing Module | `TC-PAY-01` | Verify payment changes invoice status to Paid | `PaymentContract.test.tsx` | `PaymentApiTests.cs`, `PaymentTests.cs` | ✅ Passed |
| **REQ-PAY-02** | Handle Payment Exceptions | Billing Module | `TC-PAY-02` | Verify system handles payment gateway timeouts gracefully | `Modal.test.tsx` | `PaymentApiTests.cs` | ✅ Passed |

## 6. Analytics & Operational Reports

| Req ID | Requirement Description | Component / Module | Test Case ID | Test Description | Frontend Coverage | Backend Coverage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-RPT-01** | Generate Revenue Report | Reporting | `TC-RPT-01` | Verify accurate aggregation of completed orders' revenue | `Reports.test.tsx` | `ReportServiceTests.cs` | ✅ Passed |
| **REQ-RPT-02** | Dashboard Statistics | Dashboard | `TC-RPT-02` | Verify dashboard renders summary statistics accurately | `Dashboard.test.tsx` | `ReportsApiTests.cs` | ✅ Passed |

---
**Summary:** All core scenarios mapped to requirements have active test automation coverage in both Frontend (Vitest + React Testing Library) and Backend (xUnit + Moq + WebApplicationFactory).
