# Task: Setup PNPM Workspace with Next.js Frontend and Hono Backend

## Commit 1: feat: Initialize PNPM Workspace and Basic Project Structure ✅ d63c665fe035541dda60a78d4d90aa33647fe5f1
**Description:**
Initialize a new pnpm workspace. Create a `pnpm-workspace.yaml` file to define the workspace packages. Create `apps/frontend` and `packages/backend` directories. This commit establishes the foundational monorepo structure.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `test -f pnpm-workspace.yaml && test -d apps/frontend && test -d packages/backend`
    *   **Expected Outcome:** `Asserts that pnpm-workspace.yaml exists and the frontend and backend directories are created.`
2.  **Logging Check:**
    *   **Action:** `Run pnpm -r ls`
    *   **Expected Log:** `Output should show the workspace structure, though no packages will be listed yet.`
    *   **Toggle Mechanism:** `N/A for this step.`

---

## Commit 2: feat: Setup Next.js Frontend with Tailwind CSS ✅ 271590ff19c097172fcda3ecab479bb4d3797b9a
**Description:**
Navigate to `apps/frontend`. Initialize a new Next.js application using `pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias="@/*"`. Ensure a basic "Hello World" page is functional at the root. Add `pnpm dev` script to `apps/frontend/package.json`.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `cd apps/frontend && pnpm build`
    *   **Expected Outcome:** `Next.js application builds successfully without errors.`
2.  **Logging Check:**
    *   **Action:** `cd apps/frontend && pnpm dev`, then open browser to `http://localhost:3000`.
    *   **Expected Log:** `Console output from Next.js dev server indicating successful startup. Browser displays "Hello World".`
    *   **Toggle Mechanism:** `Next.js dev server logs by default.`

---

## Commit 3: feat: Setup Hono Backend ✅ 01725402744557e282c8d85ff32d4be76f2b495d
**Description:**
Navigate to `packages/backend`. Initialize a new Node.js project using `pnpm init`. Install `hono` and `typescript`, `@types/node`, `tsx` as dependencies. Create a `src/index.ts` file. Implement a basic "Hello World" Hono application listening on port 3001. Add a `dev` script to `packages/backend/package.json` using `tsx watch src/index.ts`. Create a `tsconfig.json` using `pnpm dlx typescript tsc --init`.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `cd packages/backend && pnpm dev` (in one terminal), then `curl http://localhost:3001` (in another).
    *   **Expected Outcome:** `curl command returns "Hello World" from the Hono backend.`
2.  **Logging Check:**
    *   **Action:** `cd packages/backend && pnpm dev`.
    *   **Expected Log:** `Console output from Hono server indicating it's listening on port 3001. Log a message on each request.`
    *   **Toggle Mechanism:** `Implement basic console.log in Hono request handler.`

---

## Commit 4: chore: Configure Root Scripts and Basic Linting
**Description:**
Add `dev:frontend` and `dev:backend` scripts to the root `package.json` to run the respective dev servers (e.g., `pnpm --filter frontend dev`). Add a `dev` script to run both concurrently (e.g. using `pnpm --parallel --stream -r dev`). Install and configure a root-level ESLint and Prettier setup if desired, or ensure individual package setups are consistent.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `pnpm dev`
    *   **Expected Outcome:** `Both frontend and backend dev servers start successfully.`
2.  **Logging Check:**
    *   **Action:** `Observe terminal output when running pnpm dev.`
    *   **Expected Log:** `Combined output from both Next.js and Hono dev servers.`
    *   **Toggle Mechanism:** `N/A for script execution, relies on individual package logging.` 