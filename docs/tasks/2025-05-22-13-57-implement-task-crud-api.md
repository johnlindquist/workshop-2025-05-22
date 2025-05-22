# Task: Implement Task CRUD API Endpoints in Backend (Hono)

## Commit 1: feat: scaffold Hono routes and controller structure for tasks
**Description:**
- Create `packages/backend/src/routes/tasks.ts` for all task-related endpoints as per OpenAPI spec.
- Create `packages/backend/src/services/taskService.ts` for business logic.
- Define route handlers for:
  - `GET /tasks` (list, with filters)
  - `POST /tasks` (create)
  - `GET /tasks/:taskId` (fetch by ID)
  - `PUT /tasks/:taskId` (update)
  - `DELETE /tasks/:taskId` (delete)
- Add placeholder logging using a logger (e.g., `src/lib/logger.ts`), with log level controlled by `LOG_LEVEL` env var.
- Export router for integration.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `pnpm --filter backend test packages/backend/src/routes/__tests__/tasks.route.test.ts`
    *   **Expected Outcome:** Route handlers respond with 200/201/204 for valid requests, 400/404 for invalid.
2.  **Logging Check:**
    *   **Action:** Trigger each endpoint; observe logs for `route=tasks method=GET|POST|PUT|DELETE` entries.
    *   **Expected Log:** `INFO: route=tasks method=POST action=create status=201`
    *   **Toggle Mechanism:** Set `LOG_LEVEL=info` or `LOG_LEVEL=debug`.

---

## Commit 2: feat: implement SQLite task model and persistence logic
**Description:**
- Create `packages/backend/src/db/models/taskModel.ts` for SQLite schema and queries.
- Implement CRUD operations in `taskService.ts` using SQLite.
- Ensure all task fields from OpenAPI (id, title, content, dueDate, tags, isPublic, isOverdue, shareId, createdAt, updatedAt) are persisted.
- Add debug-level logging for all DB operations (e.g., `db=task op=create|read|update|delete`).

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `pnpm --filter backend test packages/backend/src/services/__tests__/taskService.test.ts`
    *   **Expected Outcome:** CRUD ops persist and retrieve correct data; DB state matches expectations.
2.  **Logging Check:**
    *   **Action:** Run CRUD ops; check logs for `db=task op=create|read|update|delete`.
    *   **Expected Log:** `DEBUG: db=task op=create id=... title=...`
    *   **Toggle Mechanism:** Set `LOG_LEVEL=debug`.

---

## Commit 3: feat: implement public sharing and overdue logic
**Description:**
- Add endpoints for `/tasks/:taskId/share` (POST/DELETE) and `/tasks/public/:shareId` (GET) in `tasks.ts`.
- Implement logic in `taskService.ts` to generate/remove `shareId` and set `isPublic`.
- Add overdue calculation (compare `dueDate` to now, set `isOverdue`).
- Add info-level logs for sharing and overdue status changes.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `pnpm --filter backend test packages/backend/src/services/__tests__/taskSharing.test.ts`
    *   **Expected Outcome:** Sharing endpoints work, overdue status updates as expected.
2.  **Logging Check:**
    *   **Action:** Share/unshare tasks, create overdue tasks; check logs for `action=share|unshare|overdue`.
    *   **Expected Log:** `INFO: action=share id=... shareId=...`, `INFO: action=overdue id=...`
    *   **Toggle Mechanism:** Set `LOG_LEVEL=info`.

---

## Commit 4: test: comprehensive integration tests for all task endpoints
**Description:**
- Create `packages/backend/src/routes/__tests__/tasks.route.test.ts` for endpoint integration tests (using supertest or similar).
- Test all CRUD, sharing, and overdue flows, including error cases (400, 404, 401).
- Assert on both API responses and log output (mock logger if needed).

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `pnpm --filter backend test packages/backend/src/routes/__tests__/tasks.route.test.ts`
    *   **Expected Outcome:** All endpoints pass, including edge/error cases; snapshot or assertion for logs.
2.  **Logging Check:**
    *   **Action:** Run tests with `LOG_LEVEL=debug`; inspect test output for expected log lines.
    *   **Expected Log:** All actions (create, update, delete, share, overdue) are logged as specified.
    *   **Toggle Mechanism:** Set `LOG_LEVEL=debug`.

---

## Commit 5: chore: update OpenAPI spec and docs for implemented endpoints
**Description:**
- Update `docs/openapi.yaml` to match actual implementation (if any changes).
- Add endpoint usage examples and logging configuration notes to `docs/PRD.md` or a new `docs/API_USAGE.md`.
- Document how to enable/disable logging and run tests.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `pnpm --filter backend test`
    *   **Expected Outcome:** All tests pass after doc updates.
2.  **Logging Check:**
    *   **Action:** Follow doc instructions to enable logging; verify logs appear as described.
    *   **Expected Log:** Logging configuration and usage is clear in docs.
    *   **Toggle Mechanism:** As documented in new/updated docs. 