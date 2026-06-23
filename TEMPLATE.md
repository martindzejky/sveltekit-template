# Web project bootstrap template

Reference for spinning up new websites with the **same project setup**: stack,
tooling, folder conventions, developer experience, deployment, and AI agent
configuration.

This repository (`sveltekit-template`) is the **reference implementation** of the
patterns below. It ships the **core** stack plus a minimal dummy app; the
**optional** features are documented here but not installed. Copy the setup, not
the dummy content.

> **How to read this file.** Where a file already exists in this repo, this
> document **points at the file** (the source of truth) and describes intent only.
> Code is inlined **only for optional features that are not in the repo** (so you
> have a recipe to add them). This is the "book of recipes": add optional pieces
> per project as needed.

Use this document (and [`README.md`](./README.md)) as the primary prompt/context
when asking an AI agent to scaffold a sibling project — see §9 for the prompt
template.

---

## 1. Stack at a glance

### Core (every project)

| Layer           | Choice                                                                         | In this repo                |
| --------------- | ------------------------------------------------------------------------------ | --------------------------- |
| Runtime         | Node.js **24+** (`engines.node`, `.nvmrc`, CI)                                 | ✓                           |
| Package manager | **pnpm** (`packageManager` field, `engine-strict=true` in `.npmrc`)            | ✓                           |
| Framework       | **Svelte** + **SvelteKit** (SSR, file-based routing)                           | ✓                           |
| Build           | **Vite**                                                                       | ✓                           |
| Deploy          | **Railway** with **`@sveltejs/adapter-node`**                                  | ✓                           |
| CSS             | **Tailwind CSS v4** via `@tailwindcss/vite` + `@theme` tokens in `src/app.css` | ✓                           |
| Images          | **`@sveltejs/enhanced-img`**                                                   | ✓                           |
| Icons           | **`@lucide/svelte`**                                                           | ✓                           |
| Fonts           | **`@fontsource/*`**                                                            | — (system stack by default) |
| SEO             | **super-sitemap**, **schema-dts**                                              | super-sitemap ✓             |
| Git hooks       | **lefthook** (`pnpm check`/`lint`/`format` on pre-push)                        | ✓                           |
| CI              | GitHub Actions: `check`, `lint`, `format`, `build`                             | ✓                           |

> **Database is treated as optional here.** Many quick projects ship without one
> and add Postgres + Prisma later (see the optional table and §4.6). If a project
> needs a DB from the start, add it during bootstrap.

### Optional (install only when the project needs them)

| Layer           | Packages / services                                         | When                          |
| --------------- | ----------------------------------------------------------- | ----------------------------- |
| Database        | **PostgreSQL 16** + **Prisma** (`@prisma/adapter-pg`, `pg`) | Persistent data               |
| Email           | **Nodemailer** + Maildev in Docker                          | Forms, transactional email    |
| Payments        | **Stripe** + `@stripe/stripe-js`                            | Checkout                      |
| Invoicing       | **SuperFaktura** or similar                                 | Post-purchase invoicing       |
| Analytics       | **Umami** (Docker locally; env in prod)                     | Privacy-friendly analytics    |
| Background jobs | **vite-node** + `src/cli/worker.ts`                         | Async email/files/webhooks    |
| SEO types       | **schema-dts**                                              | Typed JSON-LD structured data |
| Validation      | **Zod**                                                     | As needed                     |
| Utilities       | **date-fns**, **lodash-es**                                 | As needed                     |

---

## 2. Repository layout

Generic skeleton — add `lib/` subfolders and routes only for features the project
uses. Files marked _(optional)_ are not in this repo; add them with the recipes below.

```
.
├── .cursor/
│   ├── rules/                  # always-applied agent rules (agent/cloud/local)
│   ├── skills/                 # task-specific agent skills (per project)
│   ├── agents/                 # subagent definitions (per project)
│   ├── environment.json        # cloud install + Docker
│   ├── install.sh              # cloud: nvm + pnpm install
│   └── Dockerfile              # cloud VM image
├── .github/workflows/ci.yml
├── prisma/                     # (optional) schema.prisma + migrations
├── src/
│   ├── app.css                 # Tailwind @theme + base styles
│   ├── app.html
│   ├── app.d.ts
│   ├── hooks.server.ts         # HTTPS / canonical host redirects
│   ├── error.html
│   ├── generated/prisma/       # (optional) gitignored Prisma client output
│   ├── lib/
│   │   ├── assets/
│   │   ├── components/         # atoms / layout / organisms as needed
│   │   ├── db/                 # (optional) prisma client wrapper (*.server.ts)
│   │   └── …                   # feature modules (*.server.ts for server-only)
│   └── routes/                 # SvelteKit file-based routing
├── static/
├── tmp/                        # local data volume (gitignored)
├── BRAND.md                    # brand voice, audience, mood (English)
├── DESIGN.md                   # visual system: tokens, components, a11y (English)
├── docker-compose.yml          # (optional) local services
├── .env.example
├── eslint.config.mjs
├── prettier.config.mjs
├── lefthook.yml
├── prisma.config.ts            # (optional) Prisma config
├── svelte.config.js
├── tsconfig.json
├── vite.config.ts
├── README.md                   # describes this repo (humans)
└── TEMPLATE.md                 # this file (the recipe book)
```

### Naming conventions

- **Svelte components:** lowercase kebab filenames (`button.svelte`, `content-card.svelte`).
- **Server-only modules:** `*.server.ts` suffix (SvelteKit server boundary).
- **Client-only components:** `*.client.svelte` suffix (browser-only code).
- **Route files:** `+page.svelte`, `+page.server.ts`, `+server.ts`, `+error.svelte`.
- **Prisma client (optional):** generated to `src/generated/prisma` (not `node_modules`).

---

## 3. Bootstrap checklist (new project)

### 3.1 Scaffold

Use this repository as the starting point (clone/copy), or scaffold fresh and
copy the config files. Install dependencies using **latest available versions**;
add only what the target project needs.

**Core installs** (already in this repo's `package.json` — see it for exact versions):

- `@sveltejs/adapter-node`, `@sveltejs/kit`, `svelte`, `vite`,
  `@sveltejs/vite-plugin-svelte`, `@sveltejs/enhanced-img`
- `@tailwindcss/vite`, `tailwindcss`
- `@lucide/svelte`, `super-sitemap`
- Dev: `eslint`, `@eslint/js`, `@eslint/compat`, `eslint-plugin-svelte`,
  `eslint-config-prettier`, `typescript-eslint`, `globals`, `prettier`,
  `prettier-plugin-svelte`, `prettier-plugin-tailwindcss`,
  `prettier-plugin-organize-imports`, `lefthook`, `svelte-check`, `typescript`,
  `@types/node`

**Optional installs** (add when scoped for that site): `prisma`, `@prisma/client`,
`@prisma/adapter-pg`, `pg`, `dotenv` (database); `nodemailer` (email); `stripe`,
`@stripe/stripe-js` (payments); `vite-node` (worker); `schema-dts` (JSON-LD types);
`zod`, `date-fns`, `lodash-es`, `@fontsource/*`.

### 3.2 Root config files

These are present in the repo — they are the source of truth. Copy patterns,
adjust values:

| File                  | In repo | Notes                                                                                     |
| --------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `.nvmrc`              | ✓       | `24`                                                                                      |
| `.npmrc`              | ✓       | `engine-strict=true`                                                                      |
| `.editorconfig`       | ✓       | utf-8, LF, 2-space indent, trim trailing WS, final newline, max line 80                   |
| `.gitignore`          | ✓       | `node_modules`, `.svelte-kit`, `build`, `.env*`, `tmp/` (add `src/generated` with Prisma) |
| `.prettierignore`     | ✓       | `pnpm-lock.yaml`, asset dirs                                                              |
| `prettier.config.mjs` | ✓       | see file (single quotes, 80 cols, svelte/tailwind/organize-imports plugins)               |
| `eslint.config.mjs`   | ✓       | flat config: js + ts + svelte + prettier                                                  |
| `pnpm-workspace.yaml` | ✓       | `allowBuilds` for esbuild/sharp/lefthook (add `prisma`/`@prisma/engines` with Prisma)     |
| `tsconfig.json`       | ✓       | extends `.svelte-kit/tsconfig.json`, `strict`, `moduleResolution: bundler`                |
| `svelte.config.js`    | ✓       | see file — `adapter-node` + `vitePreprocess`                                              |
| `vite.config.ts`      | ✓       | see file — `enhancedImages()`, `sveltekit()`, `tailwindcss()`                             |

**`package.json` scripts.** See [`package.json`](./package.json) for the live set.
Core scripts: `prepare` (`svelte-kit sync; lefthook install || true`), `sync`,
`dev`, `build`, `start`, `check`, `format`, `format:fix`, `lint`, `lint:fix`, `fix`.

When you add **Prisma**, extend `prepare` and add DB scripts:

```jsonc
{
  "prepare": "svelte-kit sync; prisma generate; lefthook install || true",
  "db:migrate:dev": "prisma migrate dev",
  "db:migrate:deploy": "prisma migrate deploy",
}
```

When you add a **background worker**, add:

```jsonc
{ "start-worker": "sh scripts/start-worker.sh" }
```

**`prisma.config.ts`** _(optional — add with Prisma)_:

```ts
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL },
});
```

**`prisma/schema.prisma`** _(optional)_ — generator outputs to `../src/generated/prisma`;
datasource is PostgreSQL. Define models for that project's data needs only:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

### 3.3 Docker Compose (local services) _(optional)_

Add a `docker-compose.yml` only when the project uses local services. Standard trio:

1. **postgres:16** — app DB (healthcheck via `pg_isready`)
2. **maildev** — SMTP capture (if sending email)
3. **umami** — analytics (if using Umami)

Wait for Postgres `healthy` before migrations. Omit services the project does not use.

```yaml
services:
  postgres:
    image: postgres:16
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5

  maildev:
    image: maildev/maildev
    ports:
      - '1025:1025'
      - '1080:1080'

  umami:
    image: docker.umami.is/umami-software/umami:postgresql-latest
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/umami
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
```

(Umami needs its own database — create it via a Postgres init config, e.g. a
`configs:` entry that runs `CREATE DATABASE umami;`.)

### 3.4 Environment variables

Pattern: **every** `$env/static/*` import must exist at build time. Document all
keys in [`.env.example`](./.env.example) with placeholders (never empty strings).

Do not list env vars in the README — point to `.env.example`, where keys are
explained by comments.

After env changes: `pnpm sync` regenerates SvelteKit env types.

### 3.5 README.md structure

Single source of truth for humans (agents also read it). See [`README.md`](./README.md).

1. One-line description + production URL
2. Prerequisites (Node 24+, pnpm, Docker if used)
3. First-time setup
4. Day-to-day commands
5. Local services table (if Docker)
6. Script reference table
7. External integrations (only those used)
8. Pointers to `BRAND.md` and `DESIGN.md`
9. Language policy (site copy vs code/docs)

### 3.6 Railway deployment

All projects deploy on **Railway**:

- Build: `pnpm install --frozen-lockfile; pnpm build`
- Start: `pnpm start`
- Attach Railway Postgres (if using a DB)
- Set all env vars from `.env.example` in the Railway dashboard
- Optional second Railway service for `pnpm start-worker` when using background jobs
- Preview deploys use `*.up.railway.app` — accounted for in
  [`src/hooks.server.ts`](./src/hooks.server.ts) redirect rules

---

## 4. Reference patterns

### 4.1 Layout shell

[`src/routes/+layout.svelte`](./src/routes/+layout.svelte): imports `app.css`; a
global `header / main / footer` grid (`grid min-h-dvh grid-cols-1
grid-rows-[auto_1fr_auto]`). Mount client-only widgets (`*.client.svelte`) here for
analytics or third-party scripts.

### 4.2 Styling

[`src/app.css`](./src/app.css): `@import 'tailwindcss'` → `@theme { }` for tokens →
`@layer base` for fluid typography and global focus styles. The base template uses
a **system font stack**; to use webfonts, add `@fontsource` imports above the
Tailwind import and repoint the `--font-*` tokens, e.g.:

```css
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/700.css';
@import 'tailwindcss';

@theme {
  --font-main: 'Inter', sans-serif;
}
```

Keep the project's `DESIGN.md` in sync with `@theme`.

### 4.3 Components

Tiered folders (`atoms/`, `molecules/`, `layout/`, `organisms/`) as complexity
grows. The base template ships only `organisms/header.svelte` and
`organisms/footer.svelte` for the shell. Document component contracts and page
composition in the project's `DESIGN.md`.

### 4.4 Routes

SvelteKit conventions: static pages in `+page.svelte`; forms and data in
`+page.server.ts`; APIs in `routes/api/**/+server.ts`; confirmation pages as
separate routes; dynamic segments via `[param]`. SEO endpoints live at
[`src/routes/robots.txt/+server.ts`](./src/routes/robots.txt/+server.ts) and
[`src/routes/sitemap.xml/+server.ts`](./src/routes/sitemap.xml/+server.ts) (using
`super-sitemap`; add `paramValues`/`excludeRoutePatterns` as routes grow).

### 4.5 Server hooks

[`src/hooks.server.ts`](./src/hooks.server.ts): production URL policy — skip
`localhost`, force HTTPS, skip Railway preview domains (`*.up.railway.app`), enforce
the canonical host. The default forces `www.`; switch to apex per project.

### 4.6 Prisma client _(optional)_

Add `src/lib/db/prisma.server.ts`:

```ts
import { DATABASE_URL } from '$env/static/private';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
export default new PrismaClient({ adapter });
```

Remember to gitignore `src/generated` and add `prisma generate` to the `prepare`
script (§3.2).

### 4.7 Background jobs _(optional)_

Web requests enqueue DB rows; a separate `pnpm start-worker` process drains them.
The reference implementation uses Postgres `LISTEN/NOTIFY`, `FOR UPDATE SKIP
LOCKED`, retries, and job dependencies — adopt this pattern or simplify per project.
The worker is a `vite-node` entry (`src/cli/worker.ts`) launched via
`scripts/start-worker.sh`:

```sh
#!/usr/bin/env sh
set -eu

exec node ./node_modules/vite-node/dist/cli.mjs \
  --options.transformMode.ssr='/.*/' \
  src/cli/worker.ts
```

On Railway, set the worker service start command to `sh scripts/start-worker.sh`
(not `pnpm run start-worker`) so deploy SIGTERM reaches the Node process.

### 4.8 Integrations _(optional)_

- **Email:** Nodemailer + `lib/email/*.server.ts`.
- **Stripe:** server client + webhook route; never process purchases inline in the
  request handler.
- **Analytics:** Umami via a `*.client.svelte` widget and `PUBLIC_UMAMI_*` env vars.

### 4.9 Language split

| Context                     | Language    |
| --------------------------- | ----------- |
| User-facing copy in `src/`  | Site locale |
| Code, README, docs, AI chat | English     |

Encode in [`.cursor/rules/agent.mdc`](./.cursor/rules/agent.mdc).

---

## 5. Developer experience

### Daily workflow

```sh
docker compose up -d    # if using local services
pnpm dev
# pnpm start-worker     # only if project has background jobs
```

### Verification gate (before commit/PR)

```sh
pnpm fix      # prettier + eslint
pnpm check    # svelte-check + TS
pnpm build    # production build
```

### Git hooks

[`lefthook.yml`](./lefthook.yml) runs `pnpm check`, `pnpm lint`, and `pnpm format`
on `pre-push`. Installed via `pnpm install` → `prepare` script.

### CI

[`.github/workflows/ci.yml`](./.github/workflows/ci.yml): four parallel jobs on
push/PR — `check`, `lint`, `format`, `build`. Node 24, `pnpm install
--frozen-lockfile`. When the app imports `$env/static/*` keys, add an `env:` block
injecting a placeholder for **every** key (mirror `.env.example`), for example:

```yaml
env:
  DATABASE_URL: postgresql://postgres:postgres@localhost:5432/ci
  PUBLIC_UMAMI_URL: auto
```

### Cloud agent ([`.cursor/rules/cloud.mdc`](./.cursor/rules/cloud.mdc))

- No `.env` files — secrets from the Cursor dashboard
- Start the Docker daemon before compose (only if the project uses services)
- Non-interactive migrations: `prisma migrate dev --name <snake_case> --create-only`
  then `pnpm db:migrate:deploy` (only if using Prisma)
- Autonomous: feature branches, open PR, run full verification gate, `git-commit-style` skill

### Local agent ([`.cursor/rules/local.mdc`](./.cursor/rules/local.mdc))

- Do not commit unless asked
- Discuss before large changes
- Human in the loop

---

## 6. Brand & design documentation

Every project bootstrapped from this template has two root-level docs (English):
`BRAND.md` and `DESIGN.md`. They are **created per project** and are intentionally
not part of this template repo — use the structure below as the skeleton.

### `BRAND.md` — the "why"

One-sentence brand mood, audience and positioning, tone of voice and vocabulary,
high-level visual personality (not tokens), and the tiebreaker rule.

### `DESIGN.md` — the "how"

Color palette and `@theme` token table, typography (families, fluid base size,
text-role catalog), layout primitives and composition, component contracts, focus/
motion/imagery/a11y rules, and the mapping from tokens → `src/app.css` and Tailwind
classes.

**Rules:**

- Visual changes ship in the same PR as the matching `DESIGN.md` update.
- If code and `DESIGN.md` disagree, trust code and fix the doc in the same change.
- Agents doing UI work read `BRAND.md` first, then `DESIGN.md`.

---

## 7. AI agent setup (`.cursor/`)

### 7.1 Rules (always applied)

Three rules, generalized in this repo:

- [`agent.mdc`](./.cursor/rules/agent.mdc) — universal: read README first,
  verification commands, language policy, minimal diffs, points at `BRAND.md`/`DESIGN.md`
- [`cloud.mdc`](./.cursor/rules/cloud.mdc) — autonomous cloud workflow (metadata: `environments: cloud`)
- [`local.mdc`](./.cursor/rules/local.mdc) — collaborative local workflow (metadata: `environments: local`)

### 7.2 Skills

Task-specific skills go in **`.cursor/skills/<skill-name>/SKILL.md`** (per project;
none shipped — see `.cursor/skills/README.md`).

### 7.3 Subagents

Subagent definitions go in **`.cursor/agents/<agent-name>.md`** (per project; none
shipped — see `.cursor/agents/README.md`).

### 7.4 Cloud environment

Reused in every project:

- [`.cursor/environment.json`](./.cursor/environment.json) — build via Dockerfile,
  start Docker, install via `install.sh`
- [`.cursor/install.sh`](./.cursor/install.sh) — `nvm install`,
  `corepack prepare --activate`, `pnpm install --frozen-lockfile`
- [`.cursor/Dockerfile`](./.cursor/Dockerfile) — Ubuntu + Docker + NVM Node 24 +
  agentfiles install

---

## 8. Per-project customization matrix

| Area                     | Keep same everywhere              | Customize per project         |
| ------------------------ | --------------------------------- | ----------------------------- |
| Core stack & tooling     | ✓                                 | —                             |
| Config file patterns     | ✓                                 | —                             |
| CI / lefthook / scripts  | ✓                                 | add worker/db scripts if used |
| `.cursor/` cloud setup   | ✓                                 | skills/agents per project     |
| Railway deployment       | ✓                                 | env vars, services count      |
| `BRAND.md` + `DESIGN.md` | two-file pattern at repo root     | all content and tokens        |
| `src/lib/components/`    | naming conventions                | which components exist        |
| `prisma/schema.prisma`   | generator output path, PostgreSQL | models (optional feature)     |
| `src/routes/`            | SvelteKit conventions             | pages and APIs                |
| `docker-compose.yml`     | pattern                           | which services (optional)     |
| `.env.example`           | pattern                           | keys for integrations in use  |
| Site copy language       | policy (split from code)          | target locale and grammar     |

---

## 9. Agent prompt template (copy for new repo)

```
Bootstrap a new website using the SvelteKit project template (this repo).

Site: [name, domain, one-line purpose]
Audience: [who]
Locale: [language + grammar rules for src/ copy]
Brand mood: [3–5 adjectives]
Palette: [surface + accent hex values]
Fonts: [body, heading, accent]
Features: [forms, shop, downloads, blog, …]
Integrations: [list only what this site needs]
Pages: [homepage, about, contact, …]

Deliver:
1. Repo scaffold matching §2 layout and §3 config patterns
2. BRAND.md and DESIGN.md for this project
3. README.md with setup, env pointer, Railway deploy notes
4. .cursor/rules (+ skills/agents only if useful for this project)
5. docker-compose + .env.example (services matching integrations) — only if needed
6. Minimal working homepage + layout shell
7. CI workflow
8. pnpm fix && pnpm check && pnpm build passing

Use latest package versions. Install only dependencies required for listed features.
Do not copy data models, routes, or components from reference repos unless listed.
```

---

## 10. Verification checklist

- [ ] `pnpm install` runs `prepare` (sync, lefthook; + prisma generate if using Prisma)
- [ ] `docker compose up -d` → postgres healthy (if using Docker)
- [ ] `pnpm db:migrate:dev` succeeds (if using Prisma)
- [ ] `pnpm dev` serves SSR pages
- [ ] `pnpm fix && pnpm check && pnpm build` pass
- [ ] All `$env/static/*` imports have CI placeholders
- [ ] `DESIGN.md` reflects live tokens in `app.css`
- [ ] README points to `.env.example` for env keys
- [ ] `.cursor/rules/agent.mdc` language policy matches site locale
- [ ] `app.html` has correct `lang` and default meta
- [ ] Railway start command is `pnpm start`

---

## 11. What this template intentionally excludes

- Shared npm package / monorepo across sites
- Published component library (each site owns its components)
- Prescribed data models or business logic from reference repos
- CMS (unless a specific project needs one)
- E2E test suite in the default bootstrap (add later if needed)
- Edge/serverless deploy (Railway + adapter-node is the default)

Add these only when a specific project requires them.
