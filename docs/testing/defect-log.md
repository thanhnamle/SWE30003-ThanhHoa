# Defect Log & Resolutions - SmartFM

This log tracks all identified defects (bugs) during the testing phases of the Smart Fleet Management System, along with their resolution details, root cause analysis, and verification status.

| Defect ID | Date Found | Component | Description | Steps to Reproduce | Expected Result | Actual Result | Severity | Found In Test | Assigned To | Status | Resolution / Fix Details |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **D-001** | 2026-07-28 | Backend / EF Core | `ArgumentException` on Order tracking EF navigation | 1. Create Order via API.<br>2. Fetch Tracking for Order.<br>3. Inspect EF Core query plan. | Navigation properties should load cleanly without cyclical exceptions. | Query crashes with `ArgumentException` due to infinite recursion in JSON serialization. | High | `TC-ORD-01` | Backend Team | ✅ Fixed | Ignored cyclical references in JSON serializer options (`ReferenceHandler.IgnoreCycles`). |
| **D-002** | 2026-07-28 | Backend / Auth API | Register endpoint returns `201` instead of `200` causing integration test failure | 1. POST `/api/auth/register` with valid credentials.<br>2. Check HTTP Response Code. | Return HTTP 200 OK as defined in swagger spec. | Returns HTTP 201 Created, which integration test asserts against 200. | Medium | `TC-AUTH-02` | Tester | ✅ Fixed | Updated backend controller to return `Ok()` (200) instead of `CreatedAtAction()` to match spec. |
| **D-003** | 2026-07-28 | Frontend / Maps | MapView leaflet map crashes JSDOM due to SVG measurement | 1. Run Vitest suite on `MapView.test.tsx`.<br>2. Component renders Leaflet. | Test passes and DOM is asserted correctly. | JSDOM throws exception: `SVGElement.getBBox is not a function`. | Medium | `TC-SHP-01` | Frontend Team | ✅ Fixed | Created a Vitest mock for `leaflet` (`vi.mock('leaflet')`) in `MapView.test.tsx` to bypass real DOM rendering. |
| **D-004** | 2026-07-29 | Frontend / Orders | OrderForm React-Hook-Form fails on implicit submit DOM | 1. Fill out form.<br>2. Press Enter inside input field.<br>3. Check submit handler. | Form submits correctly without validation bypass. | Page reloads instead of invoking RHF `handleSubmit`. | Low | `TC-ORD-02` | Frontend Team | ✅ Fixed | Changed submit button type to `type="submit"` and bound form `onSubmit={handleSubmit(onSubmit)}`. |
| **D-005** | 2026-07-29 | Frontend / Dashboard | Dashboard charts fail under Test | 1. Render `<Dashboard />` in Vitest.<br>2. Recharts attempts to measure container. | Component renders fallback or SVG gracefully. | Error: `<linearGradient /> is using incorrect casing.` in stdout. | Low | `TC-RPT-01` | Frontend Team | ✅ Fixed | Mocked `recharts` module in test setup to render simple `div`s instead of complex SVG trees. |
| **D-006** | 2026-07-29 | Frontend / Interfaces | Missing `code` and optional fields in `Customer` interface | 1. Mock Customer data in Vitest.<br>2. Run TypeScript compiler. | `tsc` compiles successfully. | TS Error: `Object literal may only specify known properties`. | Medium | `TC-ORD-01` | Tester | ✅ Fixed | Updated `Customer` interface in `orderApi.ts` to make non-essential fields (like `name`, `email`) optional. |

## Defect Metrics
- **Total Defects Found:** 6
- **High Severity:** 1
- **Medium Severity:** 3
- **Low Severity:** 2
- **Resolution Rate:** 100% (6/6 Fixed)

*Note: All fixes have been verified by re-running the CI/CD pipeline and the respective Vitest / xUnit test suites.*
