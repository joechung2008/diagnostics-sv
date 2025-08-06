# Copilot Instructions for diagnostics-sv

This project is a SvelteKit app (see `svelte.config.js`, `vite.config.ts`, and `src/`). It uses TypeScript, Vite, and Svelte 5. The main UI logic is in `src/lib/components/` and routes are in `src/routes/`.

## Architecture & Patterns

- **Component Structure:**
  - UI is built from Svelte components in `src/lib/components/` (e.g., `BuildInfo.svelte`, `Extension.svelte`).
  - Types for component props and data are in `src/lib/App.types.d.ts` and related files.
  - Route-level logic and layouts are in `src/routes/` (e.g., `+layout.svelte`, `+page.svelte`).
- **Data Flow:**
  - Data is passed via props between components. There is no global state management by default.
  - For new data types, define types in `src/lib/*.types.d.ts` and use them in components.
- **Styling:**
  - Use local `<style>` blocks in Svelte components. Global styles are in `src/app.css`.
- **Assets:**
  - Place static assets in `static/` (served at root) and component-specific assets in `src/lib/assets/`.

## Developer Workflows

- **Install dependencies:**
  - `npm install`
- **Start dev server:**
  - `npm run dev` (see `README.md` for more)
- **Build for production:**
  - `npm run build`
- **Preview production build:**
  - `npm run preview`
- **Type checking:**
  - `npm run check` (runs `svelte-check`)
- **Linting & formatting:**
  - `npm run lint` (ESLint + Prettier)
  - `npm run format` (Prettier)
- **Sync SvelteKit config:**
  - `npm run prepare` (runs `svelte-kit sync`)

## Conventions & Tips

- **TypeScript:**
  - All Svelte components use `lang="ts"` in `<script>` blocks.
  - Types are colocated in `src/lib/*.types.d.ts`.
- **Component Imports:**
  - Import sibling components with relative paths (e.g., `import X from './X.svelte'`).
- **No custom state management:**
  - Use Svelte's built-in reactivity and props. If you need stores, prefer Svelte's built-in stores.
- **Adapters:**
  - The default adapter is `@sveltejs/adapter-auto`. For deployment, see SvelteKit docs.

## Key Files

- `src/lib/components/` — Main UI components
- `src/lib/*.types.d.ts` — Shared TypeScript types
- `src/routes/` — Route and layout Svelte files
- `vite.config.ts`, `svelte.config.js` — Build and SvelteKit config
- `package.json` — Scripts and dependencies

## Example: Adding a New Component

1. Create `src/lib/components/MyComponent.svelte` with `<script lang="ts">`.
2. Define prop types in `src/lib/MyComponent.types.d.ts` if needed.
3. Import and use in a parent component or route.

---

For more, see the [README.md](../README.md) or SvelteKit documentation.
