# Task: Integrate Hono Backend with Cloudflare SQLite Database

## Commit 1: feat: configure cloudflare d1 database and wrangler setup ✅ e82df5f
**Description:**
Set up Cloudflare D1 SQLite database named "workshop-2025-05-22" and configure Wrangler for local development. Create `wrangler.toml` configuration file in `packages/backend/` directory with database binding. Install required dependencies including `@cloudflare/workers-types`, `wrangler`, and `@cloudflare/d1` packages. Configure database schema with initial migration file `packages/backend/migrations/0001_initial_schema.sql` containing tasks table structure matching the OpenAPI schema (id, title, content, dueDate, tags, isPublic, isOverdue, createdAt, updatedAt, userId). Set up local development environment variables and database binding configuration.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `cd packages/backend && pnpm wrangler d1 execute workshop-2025-05-22 --local --command "SELECT name FROM sqlite_master WHERE type='table';"`
    *   **Expected Outcome:** `Returns table list including 'tasks' table, confirming database schema creation`
2.  **Logging Check:**
    *   **Action:** `cd packages/backend && pnpm wrangler d1 execute workshop-2025-05-22 --local --command "PRAGMA table_info(tasks);"`
    *   **Expected Log:** `Table schema output showing columns: id, title, content, dueDate, tags, isPublic, isOverdue, createdAt, updatedAt, userId with correct types`
    *   **Toggle Mechanism:** `Wrangler CLI output with --verbose flag for detailed logging`

---

## Commit 2: feat: implement database connection and task model ✅ c1372dc
**Description:**
Create database connection utilities and Task model in `packages/backend/src/db/` directory. Implement `packages/backend/src/db/connection.ts` with D1 database binding and connection helper functions. Create `packages/backend/src/db/models/task.ts` with TypeScript interfaces matching OpenAPI Task schema and database operations (create, read, update, delete). Add `packages/backend/src/db/migrations.ts` for running database migrations programmatically. Implement proper error handling and logging for database operations using structured logging with `console.log` statements that include operation type, timestamp, and relevant data. Configure environment-based logging levels through `LOG_LEVEL` environment variable.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `cd packages/backend && pnpm test src/db/models/task.test.ts`
    *   **Expected Outcome:** `Unit tests pass for Task model CRUD operations, including createTask, getTaskById, updateTask, deleteTask functions`
2.  **Logging Check:**
    *   **Action:** `cd packages/backend && LOG_LEVEL=debug pnpm dev` and trigger database connection
    *   **Expected Log:** `DEBUG: Database connection established to workshop-2025-05-22 at timestamp with connection details`
    *   **Toggle Mechanism:** `LOG_LEVEL environment variable (debug, info, warn, error)`

---

## Commit 3: feat: implement task crud api endpoints with d1 integration ✅ b65950b
**Description:**
Update `packages/backend/src/index.ts` to integrate with Cloudflare D1 database and implement REST API endpoints matching OpenAPI specification. Create route handlers in `packages/backend/src/routes/tasks.ts` for GET /api/v1/tasks, POST /api/v1/tasks, GET /api/v1/tasks/:id, PUT /api/v1/tasks/:id, DELETE /api/v1/tasks/:id endpoints. Implement proper request validation, error handling, and response formatting. Add middleware for database binding injection and request logging in `packages/backend/src/middleware/database.ts` and `packages/backend/src/middleware/logging.ts`. Configure CORS headers for frontend integration. Add comprehensive logging for all API operations including request method, endpoint, response status, and execution time.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `cd packages/backend && pnpm test src/routes/tasks.test.ts`
    *   **Expected Outcome:** `Integration tests pass for all CRUD endpoints, testing request/response flow with mock D1 database`
2.  **Logging Check:**
    *   **Action:** `curl -X POST http://localhost:3001/api/v1/tasks -H "Content-Type: application/json" -d '{"title":"Test Task","content":"Test content"}'`
    *   **Expected Log:** `INFO: POST /api/v1/tasks - Status: 201 - Duration: 45ms - TaskId: uuid-string`
    *   **Toggle Mechanism:** `LOG_LEVEL=info enables API request/response logging`

---

## Commit 4: feat: implement task sharing and overdue detection features
**Description:**
Extend task API with sharing functionality and overdue detection as specified in OpenAPI schema. Implement POST /api/v1/tasks/:id/share endpoint in `packages/backend/src/routes/sharing.ts` for making tasks public and generating share URLs. Create GET /api/v1/shared/:shareId endpoint for accessing public tasks. Add overdue detection logic in `packages/backend/src/services/overdueService.ts` with scheduled job functionality. Implement GET /api/v1/notifications/overdue endpoint for retrieving overdue tasks. Add database indexes for performance optimization on dueDate and isPublic columns. Configure proper error responses matching OpenAPI ErrorResponse schema. Add comprehensive logging for sharing operations and overdue task detection with structured JSON output.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `cd packages/backend && pnpm test src/routes/sharing.test.ts src/services/overdueService.test.ts`
    *   **Expected Outcome:** `Tests pass for task sharing workflow, public task access, and overdue detection logic with proper share URL generation`
2.  **Logging Check:**
    *   **Action:** `curl -X POST http://localhost:3001/api/v1/tasks/test-uuid/share` and check overdue detection
    *   **Expected Log:** `INFO: Task shared successfully - TaskId: test-uuid - ShareId: abc123 - ShareUrl: generated-url`
    *   **Toggle Mechanism:** `LOG_LEVEL=info enables sharing and overdue detection logging`

---

## Commit 5: test: add comprehensive integration tests and deployment configuration
**Description:**
Create comprehensive test suite in `packages/backend/src/__tests__/` directory covering all API endpoints, database operations, and business logic. Implement `packages/backend/src/__tests__/integration/api.test.ts` for full API workflow testing including task creation, sharing, and overdue detection. Add `packages/backend/src/__tests__/unit/database.test.ts` for database connection and model testing. Configure test database setup with `packages/backend/src/__tests__/setup.ts` using in-memory SQLite for fast test execution. Update `packages/backend/package.json` with test scripts and Jest configuration. Add deployment configuration for Cloudflare Workers in `packages/backend/wrangler.toml` with production database binding. Create `packages/backend/src/config/environment.ts` for environment-specific configuration management.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `cd packages/backend && pnpm test --coverage --bail`
    *   **Expected Outcome:** `All tests pass with >80% code coverage, including integration tests for complete API workflows and unit tests for individual components`
2.  **Logging Check:**
    *   **Action:** `cd packages/backend && pnpm test --verbose`
    *   **Expected Log:** `Test execution summary showing passed/failed tests with detailed output for debugging any failures`
    *   **Toggle Mechanism:** `--verbose flag enables detailed test execution logging` 