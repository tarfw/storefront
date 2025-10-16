# AGENTS.md

## 1. Build/Lint/Test Commands
- Build: `npm run build` (React Router build)
- Dev: `npm run dev` (starts dev server at localhost:5173)
- Deploy: `npm run deploy` (builds and deploys to Cloudflare)
- Preview: `npm run preview` (preview production build)
- Typecheck: `npm run typecheck` (runs TypeScript checks)
- No lint or test commands defined; add ESLint/Prettier if needed.

## 2. Architecture and Structure
- Full-stack React app with React Router v7 for SSR.
- Frontend: `app/` (routes/, root.tsx for layout/error boundary).
- Backend: `workers/app.ts` (Cloudflare Worker handling requests).
- Data: Cloudflare KV (`STOREFRONT` binding) for tenant-specific data.
- Multi-tenant: Subdomains (e.g., shop.tarai.space) derive tenants; loaders fetch from KV.

## 3. Code Style Guidelines
- TypeScript: Strict types; use Route.LoaderArgs/ComponentProps for types.
- Imports: From `react-router`; prefer named imports.
- Naming: PascalCase for components/functions; camelCase for variables.
- Error Handling: Use React Router error boundaries; console.warn/info for logs.
- Formatting: Tailwind CSS for styling; consistent spacing/indents.
