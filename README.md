# ngXpress: Full-Stack Angular 22 SSR Starter Kit with Express 5, Prisma, PostgreSQL, Tailwind CSS 4, Spartan/ui, and Better Auth

[![ngXpress](https://img.shields.io/badge/ngXpress-v1.0.0-0f172a.svg)](./package.json)
[![Angular](https://img.shields.io/badge/Angular-22-red.svg)](https://angular.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1+-green.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-ready-336791.svg)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8.svg)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[![GitHub stars](https://img.shields.io/github/stars/angularcafe/ngxpress)](https://github.com/angularcafe/ngXpress/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/angularcafe/ngxpress)](https://github.com/angularcafe/ngXpress/network/members)
[![GitHub issues](https://img.shields.io/github/issues/angularcafe/ngxpress)](https://github.com/angularcafe/ngXpress/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/angularcafe/ngxpress)](https://github.com/angularcafe/ngXpress/pulls)

Created and maintained by [@immohammadjaved](https://x.com/immohammadjaved)

**ngXpress** is an Angular SaaS starter with the Next.js-style full-stack loop: one process, server-side rendering, a real API, and auth that ships. This is a production-oriented [Angular 22](https://angular.dev/) + [Express 5](https://expressjs.com/) boilerplate with out-of-the-box SSR, zoneless execution, [Prisma 7](https://www.prisma.io/) (**PostgreSQL by default**; any database Prisma supports), [Better Auth](https://www.better-auth.com/), [spartan/ui](https://spartan.ng/) (Helm + Brain — the shadcn-style kit for Angular), Tailwind CSS 4, and Signal Forms. Feature-first on both the UI and the API — clone it, rebrand it, ship it.

> This is the **first tagged baseline** of ngXpress on the current stack. If you used the earlier Angular 20 / SQLite / npm template, see [Upgrading from the Angular 20 template](#upgrading-from-the-angular-20-template) — treat this as a new start, not a drop-in merge.

## Live demo

See ngXpress running as the **Stride** sample app (landing, auth, dashboard, tasks):

[View live demo](http://demo.ngxpress.dev) · [ngxpress.dev](https://ngxpress.dev)

---

## Features and tech stack

- **Angular 22** — standalone components, signals, native control flow (`@if` / `@for`), zoneless by default
- **SSR in one process** — `@angular/ssr` + Express 5; no separate frontend/backend servers
- **Better Auth** — email/password, session cookies, password reset, SSR session via TransferState
- **Prisma 7** — PostgreSQL is the default (`@prisma/adapter-pg`). Swap the datasource, adapter, `DATABASE_URL`, and Better Auth `provider` for any [database Prisma supports](https://www.prisma.io/docs/orm/overview/databases) (MySQL, SQLite, SQL Server, CockroachDB, MongoDB, and others).
- **spartan/ui** — accessible Helm components (Brain primitives + Tailwind) in `src/app/shared/ui`
- **Signal Forms** — `@angular/forms/signals` on login, signup, and task dialogs
- **Tailwind CSS 4** — utility-first styling with the Spartan Vega theme
- **TypeScript everywhere** — app, Express API, and Prisma client
- **Guards and layouts** — guest auth screens, authenticated `/admin` workspace
- **Production-minded API** — rate limits on `/api` and `/api/auth`, 100kb JSON body cap
- **AI-ready repo** — Angular, Spartan, Better Auth, and Prisma MCP configs plus a Spartan agent skill
- **pnpm 11** — `packageManager` pinned; lockfile is the source of truth

---

## Upgrading from the Angular 20 template

The previous public template used Angular 20, SQLite, and npm. **ngXpress** is a new baseline:

| | Previous template | This repo |
|---|---|---|
| Angular | 20 | **22** |
| Database | SQLite | **PostgreSQL (default)** |
| Package manager | npm | **pnpm 11** |
| UI kit | Tailwind only | **spartan/ui (Helm)** |
| Forms | Template / reactive | **Signal Forms** |
| Demo CRUD | Todos | **Tasks** (status, priority, due date) |
| Auth + ORM | Better Auth + Prisma | Better Auth + **Prisma 7** (`@prisma/adapter-pg`) |

---

## Quick start

**Prerequisites:** Node.js 20+, [pnpm 11](https://pnpm.io/), and a database. The default is PostgreSQL (database name `ngxpress`).

1. **Use this template** on [github.com/angularcafe/ngXpress](https://github.com/angularcafe/ngXpress), or clone it:

   ```bash
   git clone https://github.com/angularcafe/ngXpress.git
   cd ngXpress
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment**

   ```bash
   cp .env.example .env
   ```

   Generate `BETTER_AUTH_SECRET` with `openssl rand -base64 32`. Keep `BETTER_AUTH_TRUSTED_ORIGINS` in sync with the URLs you actually use (`http://localhost:4200` for `pnpm dev`, `http://localhost:4000` for production).

4. **Database**

   Create an empty PostgreSQL database (default), then:

   ```bash
   pnpm db:generate
   pnpm db:push
   ```

5. **Dev server** (Angular + Express SSR)

   ```bash
   pnpm dev
   ```

   Open [http://localhost:4200](http://localhost:4200).

**Scripts**

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server (port 4200) |
| `pnpm build` | `prisma generate` + production Angular SSR build |
| `pnpm start` | Serve `dist` (port 4000, or `PORT`) |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm db:studio` | Prisma Studio |
| `pnpm db:push` | Push schema to PostgreSQL |
| `pnpm auth:generate` | Regenerate Better Auth Prisma models |

Rebrand the demo product in `src/app/core/config/app-brand.ts` (`APP_NAME`, tagline, template URL) and the `<title>` in `src/index.html`.

---

## What’s included

- **SaaS landing page** — hero, features, pricing, FAQ, dark/light theme
- **Authentication** — sign in, sign up, forgot/reset password
- **Admin workspace** — sidebar layout, dashboard stats, session-aware nav
- **Tasks CRUD** — list, filter, create, update, delete; API scoped to the signed-in user
- **Error pages** — 403, 404, 500, 503 shells you can wire to real status codes

---

## File structure

Frontend (`src/app`) and backend (`src/api`) stay in one Angular SSR app:

```text
src/
├── app/
│   ├── core/                 # Auth client/service, guards, brand, theme
│   ├── pages/                # Landing, auth, admin (dashboard + tasks), errors
│   ├── shared/
│   │   ├── components/       # App chrome (sidebar, brand)
│   │   ├── layouts/          # Auth + admin shells
│   │   └── ui/               # spartan/ui Helm (CLI-managed)
│   ├── app.ts
│   └── app.routes.ts
├── api/
│   ├── features/tasks/       # Express routes + controller
│   ├── lib/                  # Prisma, Better Auth, session, rate limits
│   └── api.ts
├── generated/prisma/         # Prisma client (gitignored; run db:generate)
├── main.ts
├── main.server.ts
├── server.ts                 # Express + Angular SSR entry
└── styles.css
prisma/
├── schema.prisma
└── models/                   # auth.prisma, task.prisma
```

Add UI features under `src/app/pages`. Add API features under `src/api/features`. Do not hand-edit Helm sources in `src/app/shared/ui` — use the [spartan CLI](https://spartan.ng/).

---

## Import aliases

Configured in `tsconfig.json`:

```typescript
import { AuthService } from '@core/auth/auth.service';
import { authGuard } from '@core/guards/auth.guard';
import { AdminLayout } from '@layouts/admin.layout';
import { BrandLogo } from '@components/brand/brand-logo';
```

| Alias | Path | Use for |
|---|---|---|
| `@core/*` | `src/app/core/*` | Auth, guards, brand, theme |
| `@pages/*` | `src/app/pages/*` | Route pages |
| `@layouts/*` | `src/app/shared/layouts/*` | Auth / admin layouts |
| `@components/*` | `src/app/shared/components/*` | Shared app components |
| `@shared/*` | `src/app/shared/*` | Shared tree (including layouts) |
| `@spartan-ng/helm/*` | `src/app/shared/ui/...` | Helm components (see `components.json`) |

---

## Security and deployment

ngXpress is a **single Node SSR app**. Build once, run `pnpm start` behind TLS. Vercel / Netlify / Docker adapters are not first-class yet; a VPS, VM, or any Node 20+ host works.

### Production checklist

1. Copy `.env.example` → `.env` and set a strong `BETTER_AUTH_SECRET`.
2. Set `BETTER_AUTH_URL` to your public HTTPS origin.
3. Set `BETTER_AUTH_TRUSTED_ORIGINS` to those exact origins (no trailing-slash mismatches).
4. Set `NODE_ENV=production`.
5. Terminate TLS at a reverse proxy; run Node on an internal port (`PORT`, default 4000).
6. Replace the dev email logger (`src/api/lib/email.ts`) before sending real password-reset mail. In production it **throws** until a provider is wired.

```bash
pnpm build
pnpm start
```

```bash
DATABASE_URL="postgresql://USER:PASS@HOST:5432/ngxpress"
BETTER_AUTH_SECRET="your_secret_key"
BETTER_AUTH_URL="https://yourdomain.com"
BETTER_AUTH_TRUSTED_ORIGINS="https://yourdomain.com"
NODE_ENV="production"
PORT=4000
```

The Express layer already applies:

- Stricter rate limits on `/api/auth`
- General rate limits on `/api`
- JSON body size limit (100kb) on non-auth API routes

Rate limiting is in-memory (one Node process). Do not enable naive `trust proxy` unless you understand spoofed `X-Forwarded-For` headers.

### Database

PostgreSQL is the default (`DATABASE_URL`, `prisma/schema.prisma`, `@prisma/adapter-pg`, Better Auth `provider: 'postgresql'`). Prisma can target [any supported database](https://www.prisma.io/docs/orm/overview/databases). To switch:

1. Change `provider` in `prisma/schema.prisma` and `DATABASE_URL` in `.env`.
2. Install the matching Prisma adapter (for example `@prisma/adapter-mariadb` or `@prisma/adapter-better-sqlite3`) and wire it in `src/api/lib/prisma.ts`.
3. Set the same engine on Better Auth in `src/api/lib/auth.ts` (`prismaAdapter(..., { provider: 'mysql' | 'sqlite' | ... })`).
4. Run `pnpm db:generate` and `pnpm db:push` (or migrations).

Prefer `prisma migrate deploy` in production once you add migrations; `db:push` is for local schema sync.

### Hosting

Any host that can run Angular SSR + Node works: DigitalOcean, Linode, Hetzner, AWS EC2, GCP Compute, Azure VMs, and similar. Use a process manager such as PM2 in production.

---

## Documentation

- [Angular](https://angular.dev)
- [Express 5](https://expressjs.com/en/5x/api.html)
- [Prisma](https://www.prisma.io/docs/)
- [Better Auth](https://www.better-auth.com/docs/introduction)
- [spartan/ui](https://www.spartan.ng/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [pnpm](https://pnpm.io/)

Agent conventions for this repo live in [`AGENTS.md`](AGENTS.md).

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Issues and discussions: [github.com/angularcafe/ngXpress](https://github.com/angularcafe/ngXpress).

---

## License

MIT — see [LICENSE](LICENSE).

---

## Keywords

angular, angular-22, angular-starter, angular-saas-starter, angular-saas, saas-starter, saas-boilerplate, angular-boilerplate, angular-template, angular-fullstack, fullstack-angular, angular-ssr, angular-universal, angular-express, angular-express-ssr, angular-node-starter, angular-prisma, angular-postgres, angular-postgresql, angular-tailwind, angular-auth, angular-better-auth, angular-admin-dashboard, angular-dashboard, angular-landing-page, spartan-ui, spartan-ng, angular-shadcn, shadcn-angular, signal-forms, fullstack-starter, open-source-angular-starter, ssr, express, expressjs, prisma, postgresql, tailwindcss, better-auth, typescript, nodejs, pnpm, production-ready, nextjs-alternative, nextjs-for-angular, nextjs-angular, zoneless, angular-zoneless, ngxpress

---

## Creator

Made with ❤️ by [@immohammadjaved](https://x.com/immohammadjaved)

Follow for updates, tips, and more Angular / Node content.
