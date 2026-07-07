# Next.js Boilerplate

A production-ready Next.js starter with App Router, i18n, authentication, and a batteries-included tooling setup — so you can start building features instead of wiring infrastructure.

## ✨ Features

- **Next.js 16** with App Router, React 19 and Turbopack
- **TypeScript** with strict, path-aliased imports (`@/*`)
- **Tailwind CSS v4** + [shadcn/ui](https://ui.shadcn.com) (New York style, Lucide icons)
- **Internationalization** via [next-intl](https://next-intl-docs.vercel.app) — locale-prefixed routes (`vi`, `en`)
- **Data fetching** with TanStack Query + a typed Axios HTTP client
- **Auth flow** with access/refresh tokens, request queueing and auto-retry built in
- **Forms & validation** with React Hook Form + Zod
- **State management** with Zustand
- **Theming** (light/dark) with next-themes
- **Error handling** — error boundaries, custom error and `not-found` pages
- **DX tooling** — ESLint, Prettier, Husky, lint-staged, Commitlint (Conventional Commits)
- **Docker** image + GitHub Actions CI

## 🧰 Tech Stack

| Area      | Choice                                          |
| --------- | ----------------------------------------------- |
| Framework | Next.js 16, React 19                            |
| Language  | TypeScript 5                                    |
| Styling   | Tailwind CSS v4, shadcn/ui, tailwind-merge, CVA |
| i18n      | next-intl                                       |
| Data      | TanStack Query, Axios                           |
| State     | Zustand                                         |
| Forms     | React Hook Form, Zod                            |
| Animation | Framer Motion                                   |
| Utilities | Lodash, Day.js, React Toastify                  |

## 🚀 Getting Started

**Requirements:** Node.js 20+ and [pnpm](https://pnpm.io) 11+.

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
# create .env.local and set the variables listed below

# 3. Start the dev server
pnpm dev
```

Open [http://localhost:4040](http://localhost:4040) — the app redirects to the default locale (`/vi`).

### Environment Variables

| Variable              | Description                       |
| --------------------- | --------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend REST API. |

## 📜 Scripts

| Command      | Description                                |
| ------------ | ------------------------------------------ |
| `pnpm dev`   | Start the dev server on port `4040`.       |
| `pnpm build` | Build the production bundle.               |
| `pnpm start` | Serve the production build on port `4040`. |
| `pnpm lint`  | Run ESLint.                                |

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/           # Localized routes
│   │   ├── (client)/       # Public-facing pages + landing sections
│   │   └── (admin)/        # Dashboard, analytics, user management
│   ├── i18n/               # next-intl config, dictionaries (vi/en), loaders
│   ├── layout.tsx          # Root layout & providers
│   └── globals.css
├── components/
│   ├── ui/                 # shadcn/ui primitives + error UI
│   ├── layout/             # Admin shell (sidebar, header)
│   └── providers/          # Query, theme & error-boundary providers
├── core/
│   ├── service/            # HTTP client & API services
│   ├── store/              # Zustand stores
│   ├── constant/           # Routes, HTTP status codes
│   ├── helpers/            # Formatters, validators, utilities
│   └── utils/              # Local storage helpers
├── hooks/                  # Reusable React hooks
├── model/                  # Shared types & interfaces
├── lib/                    # Shared low-level utils (cn, etc.)
└── proxy.ts                # Locale detection & routing (Next.js proxy)
```

## 🌐 Internationalization

Locales live in `src/app/i18n/dictionaries/{locale}/*.json` and are namespaced (`common`, `auth`, `dashboard`, `landing`, …). Every route is prefixed with its locale (`localePrefix: "always"`), and `src/proxy.ts` handles detection and redirects.

To add a language, extend `locales` in [`src/app/i18n/config/settings.ts`](src/app/i18n/config/settings.ts) and add the matching dictionary folder.

## 🌍 HTTP & Auth

`src/core/service/http-client.ts` wraps Axios with:

- Automatic `Authorization` header injection
- Transparent access-token refresh with request queueing on `401`
- Exponential-backoff retries on network timeouts
- Normalized error types (`HttpError`, `UnprocessableEntityError`)

Use the shared `httpClient` (`get` / `post` / `put` / `patch` / `delete`) for all API calls.

## 🐳 Docker

```bash
docker build -t next-boilerplate .
docker run -p 4040:4040 next-boilerplate
```

Pushes to `develop` are built and published to Docker Hub via [GitHub Actions](.github/workflows/ci.yml).

## 🤝 Contributing

Commits follow the [Conventional Commits](https://www.conventionalcommits.org) spec (enforced by Commitlint). Husky runs lint-staged on every commit to format and lint changed files.

Use the provided [issue templates](.github/ISSUE_TEMPLATE) and [pull request template](.github/pull_request_template.md) when opening issues or PRs.
