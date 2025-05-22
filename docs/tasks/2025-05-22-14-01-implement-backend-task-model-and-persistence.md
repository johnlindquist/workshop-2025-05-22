# Task: Implement Backend Task Model and Persistence Logic (SQLite)

## Commit 1: feat: define Task TypeScript interfaces and SQLite schema
**Description:**
- Create `packages/backend/src/db/models/taskModel.ts`.
- Define TypeScript interfaces for `Task`, `CreateTaskRequest`, and `UpdateTaskRequest` matching OpenAPI schema (id, title, content, dueDate, tags, isPublic, isOverdue, shareId, createdAt, updatedAt).
- Add SQLite schema definition for `tasks` table (id TEXT PRIMARY KEY, title TEXT, content TEXT, dueDate TEXT, tags TEXT, isPublic INTEGER, isOverdue INTEGER, shareId TEXT, createdAt TEXT, updatedAt TEXT).
- Add migration SQL to `packages/backend/migrations/0002_task_model.sql`.
- Add debug-level logging for schema creation and migration (e.g., `db=task op=schema-migrate`).

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `cd packages/backend && pnpm wrangler d1 execute workshop-2025-05-22 --local --command "PRAGMA table_info(tasks);"`
    *   **Expected Outcome:** Table schema output matches all required columns and types.
2.  **Logging Check:**
    *   **Action:** Run migration; observe logs for `db=task op=schema-migrate`.
    *   **Expected Log:** `DEBUG: db=task op=schema-migrate status=success`
    *   **Toggle Mechanism:** Set `LOG_LEVEL=debug`.

---

## Commit 2: feat: implement CRUD operations for Task in taskModel.ts
**Description:**
- Implement functions: `createTask`, `getTaskById`, `updateTask`, `deleteTask`, `listTasks` in `taskModel.ts`.
- Use parameterized SQL queries for all operations.
- Serialize/deserialize tags as JSON array.
- Add debug-level logging for each DB operation (e.g., `db=task op=create|read|update|delete`).
- Handle errors with structured error logging.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `cd packages/backend && pnpm test src/db/models/taskModel.test.ts`
    *   **Expected Outcome:** Unit tests pass for all CRUD functions, including edge cases (missing fields, invalid IDs).
2.  **Logging Check:**
    *   **Action:** Run CRUD ops in tests; check logs for `db=task op=create|read|update|delete`.
    *   **Expected Log:** `DEBUG: db=task op=create id=... title=...`
    *   **Toggle Mechanism:** Set `LOG_LEVEL=debug`.

---

## Commit 3: test: add comprehensive unit tests for taskModel CRUD
**Description:**
- Create `packages/backend/src/db/models/__tests__/taskModel.test.ts`.
- Write tests for all CRUD functions, including:
  - Creating a task with all fields
  - Reading by ID
  - Updating fields (title, content, dueDate, tags, isPublic, isOverdue, shareId)
  - Deleting a task
  - Handling invalid input and error cases
- Mock or use in-memory SQLite for test isolation.
- Assert on both function output and log output (mock logger if needed).

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `cd packages/backend && pnpm test src/db/models/taskModel.test.ts`
    *   **Expected Outcome:** All tests pass, including edge/error cases; snapshot or assertion for logs.
2.  **Logging Check:**
    *   **Action:** Run tests with `LOG_LEVEL=debug`; inspect test output for expected log lines.
    *   **Expected Log:** All actions (create, update, delete) are logged as specified.
    *   **Toggle Mechanism:** Set `LOG_LEVEL=debug`.

---

## Commit 4: chore: document task model, logging, and test strategy
**Description:**
- Update `docs/PRD.md` and/or create `docs/API_USAGE.md` with details on the task model, DB schema, and CRUD API usage.
- Document logging configuration and how to enable/disable debug logs for DB operations.
- Add section on how to run and interpret unit tests for the task model.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `cd packages/backend && pnpm test src/db/models/taskModel.test.ts`
    *   **Expected Outcome:** All tests pass after doc updates.
2.  **Logging Check:**
    *   **Action:** Follow doc instructions to enable logging; verify logs appear as described.
    *   **Expected Log:** Logging configuration and usage is clear in docs.
    *   **Toggle Mechanism:** As documented in new/updated docs. 