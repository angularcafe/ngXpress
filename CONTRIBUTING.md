# Contributing to ngXpress

Thanks for helping improve [ngXpress](https://github.com/angularcafe/ngXpress). Please follow these guidelines so reviews stay focused and changes are easy to land.

## Reporting issues

- Search [existing issues](https://github.com/angularcafe/ngXpress/issues) before opening a new one.
- Include Angular/Node versions, OS, and whether you are on `pnpm dev` (port 4200) or `pnpm start` (port 4000).
- Describe steps to reproduce, expected vs. actual behavior, and screenshots or logs when they help.

## Feature requests

- Check [issues](https://github.com/angularcafe/ngXpress/issues) and [discussions](https://github.com/angularcafe/ngXpress/discussions) first.
- Describe the use case, who it helps, and any alternatives you considered. Keep the starter lean: prefer patterns others can copy over extra dependencies.

## Development setup

1. Fork the repository and clone your fork.
2. Create a branch from `main`.
3. Install [pnpm](https://pnpm.io/) 11, Node 20+, and a local PostgreSQL database.
4. Copy `.env.example` to `.env` and set `BETTER_AUTH_SECRET` (`openssl rand -base64 32`).
5. Create the `ngxpress` database, then:

```bash
pnpm install
pnpm db:generate
pnpm db:push
pnpm dev
```

Open [http://localhost:4200](http://localhost:4200).

```bash
pnpm build          # production build
pnpm start          # serve dist (port 4000)
pnpm test           # unit tests (Vitest)
```

Format with Prettier before you push:

```bash
pnpm exec prettier --write .
```

## Pull requests

1. Keep the PR focused: one feature or fix per PR.
2. Describe **why** the change exists, not only what files moved.
3. Follow `AGENTS.md` (standalone components, signals, Signal Forms, native control flow).
4. Use path aliases (`@core/*`, `@pages/*`, `@layouts/*`, `@components/*`, `@shared/*`) instead of deep relative imports.
5. Do not hand-edit copied Spartan Helm sources under `src/app/shared/ui`. Add or update components with the Spartan CLI.
6. Confirm `pnpm build` succeeds. Add tests when the change is logic-heavy (API parsing, guards, auth session).

## Coding standards

- TypeScript on both the Angular app and the Express API.
- Feature-first layout: pages under `src/app/pages`, API under `src/api/features`.
- Reusable UI (non-Helm) lives in `src/app/shared/components`; layouts in `src/app/shared/layouts`.
- Match existing Prettier config (single quotes, 100-character print width).
- Prefer small, accessible components (WCAG AA, native focus, no `ngClass` / `ngStyle`).

## Project structure

- **App:** `src/app/` (pages, core, shared)
- **API:** `src/api/` (Express + Better Auth)
- **Database:** `prisma/` (Prisma 7, PostgreSQL)
- **Helm UI:** `src/app/shared/ui/` (generated; treat as library code)

## Commit messages

Use short, imperative subjects with an optional scope:

- `fix(auth): reject unsafe login returnUrl`
- `feat(tasks): filter by due date`
- `docs: refresh contributing setup`

Reference issues when relevant (`fix: resolve #42`).

## Questions

- [Discussions](https://github.com/angularcafe/ngXpress/discussions) or [issues](https://github.com/angularcafe/ngXpress/issues)
- [@immohammadjaved](https://x.com/immohammadjaved) on X

Please be respectful and inclusive. We assume good intent and review in public.

Thank you for making ngXpress better.
