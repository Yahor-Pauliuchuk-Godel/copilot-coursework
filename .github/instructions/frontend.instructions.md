---
description: "Use when working on frontend code, React components, hooks, or TypeScript files."
applyTo: "frontend/**"
---
# Frontend Instructions

## Functions — CRITICAL RULE

**Always use `const` arrow functions** instead of `function` declarations for components and helpers.

```tsx
// ✓ Correct
const MyComponent = () => { ... };
const handleClick = () => { ... };

// ✗ Incorrect
function MyComponent() { ... }
function handleClick() { ... }
```

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

```tsx
// ✓ Correct
const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/employees', { signal: controller.signal })
      .then(res => res.json())
      .then(setEmployees);
    return () => controller.abort();
  }, []);

  return employees;
};

// ✗ Incorrect — logic mixed directly into the component, not reusable
const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => {
    fetch('/api/employees').then(res => res.json()).then(setEmployees);
  }, []);
  // ...
};
```

**Dependency arrays:**
- Always declare every reactive value used inside `useEffect`/`useMemo`/`useCallback` in the dependency array.
- Use the `exhaustive-deps` ESLint rule to catch omissions automatically.
