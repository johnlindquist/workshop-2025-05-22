# Task: Migrate to Biome for Linting and Formatting

## Commit 1: feat: Remove existing linting/formatting packages and configurations ✅ 1b3931daea80f98e046ce99cfb1d27625bf0e1bc
**Description:**
This commit will remove all existing linting and formatting related devDependencies from the root `package.json` and any workspace `package.json` files (e.g., `apps/frontend/package.json`, `packages/backend/package.json`). It will also delete any configuration files associated with these tools (e.g., `.eslintrc.js`, `.prettierrc.json`, `eslint.config.mjs`, `postcss.config.mjs` if it's only for linting/formatting and not essential for Tailwind CSS build).

Specific files and packages to target for removal (verify existence before deleting):
- Packages: `eslint`, `prettier`, `eslint-config-next`, `eslint-plugin-*`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `tailwindcss-related-linters-if-any-not-core-tailwind`, etc.
- Config files: `.eslintrc.*`, `.eslintignore`, `.prettierrc.*`, `.prettierignore`, `eslint.config.mjs`, potentially parts of `postcss.config.mjs` if only lint-related.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `pnpm i` (to ensure no errors after removing packages) followed by `pnpm --filter frontend build` and `pnpm --filter backend build` (or equivalent build commands for each workspace) to ensure the applications still build without the removed tools.
    *   **Expected Outcome:** `pnpm install` completes successfully. Build commands for frontend and backend complete successfully. No linting/formatting errors are thrown by old tools (as they are removed).
2.  **Logging Check:**
    *   **Action:** Check the output of the `pnpm i` and build commands.
    *   **Expected Log:** No errors related to missing peer dependencies of the removed packages or build failures.
    *   **Toggle Mechanism:** N/A (command output is direct).

---

## Commit 2: feat: Install and configure Biome
**Description:**
This commit will add `@biomejs/biome` as a devDependency to the root `package.json` using `pnpm add --save-dev --save-exact @biomejs/biome -w`. It will then initialize Biome by running `pnpm biome init` (or `pnpm dlx @biomejs/biome init` if biome is not yet in path) in the project root, which will create a `biome.json` configuration file.

The `biome.json` will be configured as follows:
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json", // Ensure this is the latest schema
  "organizeImports": {
    "enabled": true
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space", // Or "tab" - choose one consistently
    "indentWidth": 2      // If using space
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single", // Or "double"
      "jsxQuoteStyle": "double", // Or "single"
      "semicolons": "asNeeded" // Or "always"
    }
  },
  "files": {
    "ignore": [
      ".next/",
      "node_modules/",
      "dist/", // Common build output directory for backend
      "tmp/" // From project structure
    ]
  },
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true // If a .gitignore file is used and should be respected by Biome
  }
}
```
(Adjust `indentStyle`, `indentWidth`, `quoteStyle`, `jsxQuoteStyle`, `semicolons` based on project preference, aiming for consistency with previous setup or a new standard).

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `pnpm biome check --write .` (run from project root)
    *   **Expected Outcome:** Biome runs successfully, formats files, and reports any linting issues. The command should exit with code 0 if all auto-fixable issues are resolved. Check that `biome.json` is created and populated.
2.  **Logging Check:**
    *   **Action:** Observe the output of `pnpm biome check --write .`.
    *   **Expected Log:** Biome output indicating files processed, formatted, and any lint errors found/fixed.
    *   **Toggle Mechanism:** Biome CLI verbosity can be controlled with flags if needed, but default output should suffice.

---

## Commit 3: chore: Update package.json scripts and apply Biome fixes
**Description:**
This commit will update the `scripts` section in the root `package.json` and any relevant workspace `package.json` files to use Biome.
Replace old linting/formatting scripts (e.g., `lint`, `format`) with new Biome commands.

Example changes in root `package.json`:
```json
"scripts": {
  // ... other scripts
  "lint": "pnpm biome lint .",
  "format": "pnpm biome format --write .",
  "check": "pnpm biome check --write .", // Combined lint and format
  // Update dev scripts to not run old linters if they did
}
```
Any CI configuration files (e.g., GitHub Actions workflows) will also be updated to use the new Biome commands instead of ESLint/Prettier.
After updating scripts, run `pnpm check` (or `pnpm biome check --write .`) to apply all formatting and safe lint fixes across the entire codebase.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `pnpm format`, `pnpm lint`, `pnpm check` (after script updates). Then, `git status` to see changed files.
    *   **Expected Outcome:** The new scripts run Biome correctly. `git status` shows files modified by Biome's formatting and linting. No errors from the script execution.
2.  **Logging Check:**
    *   **Action:** Inspect a few key files (e.g., a ` .ts` file in `apps/frontend/src/app` and a `.ts` file in `packages/backend/src`) to ensure Biome's formatting has been applied according to the `biome.json` configuration.
    *   **Expected Log:** Files reflect the new formatting (indentation, quote style, etc.).
    *   **Toggle Mechanism:** N/A (direct file inspection).

---

## Commit 4: test: Verify application functionality after Biome migration
**Description:**
This commit focuses on ensuring that the Biome migration and subsequent code modifications (formatting, auto-fixes) have not introduced any regressions.

Run all existing tests (if any were previously configured, though project rules indicate none are set up globally).
Manually test core application flows for both frontend and backend if automated tests are sparse.
- Frontend: Navigate key pages, interact with UI elements.
- Backend: Test API endpoints using a tool like `curl` or Postman.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `pnpm --filter frontend build`, `pnpm --filter backend build`, `pnpm --filter frontend dev` (for manual testing), `pnpm --filter backend dev` (for manual testing). If any test commands exist (e.g., `pnpm test`), run them.
    *   **Expected Outcome:** Applications build and run without errors. Existing tests pass. Manual checks confirm core functionality is intact.
2.  **Logging Check:**
    *   **Action:** Monitor browser console for frontend errors during manual testing. Monitor backend application logs for any new errors or unexpected behavior when hitting API endpoints.
    *   **Expected Log:** No new runtime errors in browser console or backend logs compared to pre-migration state.
    *   **Toggle Mechanism:** Standard browser developer tools for frontend. Backend application logging (ensure `LOG_LEVEL` is appropriate for catching errors).

---
<!-- TODO: The project rules state "test" script in root package.json is a placeholder. Confirm if there are actual test suites in frontend or backend workspaces that need to be run in Commit 4. -->
<!-- TODO: Confirm if postcss.config.mjs is solely for linting/formatting or if it's essential for Tailwind CSS build process, to decide on its removal in Commit 1. --> 