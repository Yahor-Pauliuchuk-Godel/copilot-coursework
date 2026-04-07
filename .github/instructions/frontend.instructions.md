---
description: "Use when working on frontend code, React components, hooks, or TypeScript files."
applyTo: "frontend/**"
---
# Frontend Instructions

## Functions — CRITICAL RULE

**Always use `const` arrow functions** instead of `function` declarations for components and helpers.

## Styling — CRITICAL RULE

**Never use inline CSS** (`style={{ ... }}`). Always prefer a Bootstrap utility class. If no Bootstrap equivalent exists, add the rule to a dedicated `.css` file and import it into the component.

## Custom Hooks — Best Practices

Extract logic into a custom hook when stateful or side-effect logic is reused across multiple components or becomes complex enough to obscure a component's rendering intent.

**Naming and location:**
- Always prefix with `use` (e.g., `useEmployees`, `useTheme`) — this is required for React's rules-of-hooks linter.
- Place all custom hooks in `src/hooks/`, one hook per file, named after the hook (e.g., `src/hooks/useEmployees.ts`).

**When to extract a custom hook:**
- The same `useState` + `useEffect` pattern appears in more than one component.
- A component has grown complex because of intermixed data-fetching, event listeners, or derived state — move that logic out.
- You need to unit-test the logic independently of a component's render output.

**What a custom hook should do:**
- Accept configuration as parameters; return only the values and callbacks the caller needs.
- Handle its own cleanup (unsubscribe, abort fetch, clear timers) inside `useEffect`'s return function.
- Never return JSX — a hook is not a component.

**Dependency arrays:**
- Always declare every reactive value used inside `useEffect`/`useMemo`/`useCallback` in the dependency array.
- Use the `exhaustive-deps` ESLint rule to catch omissions automatically.

## Environment Variables — CRITICAL RULE

**Never hardcode API URLs or other environment-specific values** as string literals in source files. Always expose them through the central configuration file.

### Vite `.env` files

- Vite only exposes variables prefixed with `VITE_` to the client bundle. Variables without this prefix are **not** available at runtime.
- Store values in `frontend/.env` for local development (this file is gitignored).
- Commit a `frontend/.env.example` with placeholder or default values so other developers know which variables are required.

**File conventions:**
- `frontend/.env` — local overrides, **gitignored**, never committed
- `frontend/.env.example` — committed template listing all required `VITE_*` variables

## Data Fetching — TanStack Query

**Always use `@tanstack/react-query` for server data fetching** — never use raw `useEffect` + `useState` to fetch data from an API.

- Place all query logic in custom hooks inside `src/hooks/`, using `useQuery` from `@tanstack/react-query`.
- Use a stable query key array that uniquely identifies the resource (e.g., `['employees']`).
- After a mutation (create / update / delete), call `useQueryClient().invalidateQueries({ queryKey: [...] })` to trigger a refetch and keep the UI consistent with the server.
