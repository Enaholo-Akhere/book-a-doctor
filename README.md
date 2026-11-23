# CareConnect Frontend

Next.js (App Router) + React 19 + TypeScript + Tailwind v4.

## Scripts

- `npm run dev`: dev server on http://localhost:5173 (the port the backend's CORS allows)
- `npm run build` / `npm start`: production build and server
- `npm run lint`, `npm run type-check`

## Layout

- `src/app/`: routes only. Each `page.tsx` renders a view from `src/views/`.
  Route groups add the guards: `(guest)` for login/signup, `(patient)` for
  `/users/*`, `(doctor)` for `/dashboard/*`.
- `src/views/`: page components (formerly `src/pages`; renamed because Next
  treats `src/pages` as the Pages Router).
- `src/App.tsx`: client providers (React Query, socket, calls, chat widgets).

## Environment

Public env vars use the `NEXT_PUBLIC_` prefix (see `.env.local`). In production
the API is called on the same origin at `/api/v1`, which `next.config.ts`
rewrites to the Render backend.
