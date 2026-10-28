# udata_agora

Frontend of the Portuguese National Open Data Portal ([dados.gov.pt](https://dados.gov.pt)), built with Next.js and the Ágora Design System, the official design system of the Portuguese public administration. It consumes the REST API of the udata backend.

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript (strict mode)
- [@ama-pt/agora-design-system](https://www.npmjs.com/package/@ama-pt/agora-design-system) and Tailwind CSS 4
- Tiptap rich-text editor, react-markdown, date-fns and dayjs
- Playwright for end-to-end tests
- ESLint and Prettier

## Getting started

Requirements: Node.js 20+, npm, and a running udata backend (port 7000 by default).

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Configuration

Copy `.env.example` to `.env.local` and adjust it. The main variables are:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE`, `NEXT_PUBLIC_API_V2_BASE` | Relative API base paths used by the browser (`/api/1` and `/api/2`) |
| `BACKEND_URL` | Absolute backend URL used by the Next.js rewrites (server-side only) |
| `NEXT_PUBLIC_SAML_ENABLED` | Show the Autenticação.gov (SAML) login button |

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Client-side requests go through the Next.js rewrite proxy, so the browser never talks to the backend directly.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run test:e2e` | Run the public frontend end-to-end tests |
| `npm run test:e2e:backoffice` | Run the back office end-to-end tests |
| `npm run test:e2e:all` | Run all end-to-end tests |
| `npm run test:e2e:report` | Open the Playwright report |

## Project structure

| Path | Purpose |
|---|---|
| `src/app/` | Routes (App Router), layouts and global styles |
| `src/components/` | Components, organised by feature (datasets, reuses, organizations and so on) |
| `src/services/` | Backend API calls |
| `src/types/` | TypeScript types for API responses |
| `src/context/`, `src/hooks/`, `src/utils/`, `src/config/` | Shared state, hooks, helpers and configuration |
| `src/middleware.ts` | Request middleware |
| `tests/` | Playwright end-to-end tests |
| `public/` | Static assets |

## Conventions

- Components use PascalCase names, named exports, and the `Client` suffix for components that manage a whole page's state.
- Public pages are async Server Components with ISR caching, passing data to a child `*Client.tsx` component for interactivity.
- Code, comments and commit messages are written in English. See `CLAUDE.md` for the full guidelines.

## Docker

The repository includes a `Dockerfile` and a `docker-compose.yml` for running the frontend in a container.
