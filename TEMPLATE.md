# Web project bootstrap template

This file is my recipe book for my web projects. It is a reference for
spinning up new websites with the **same project setup**: stack,
tooling, folder conventions, developer experience, deployment, and AI agent
configuration.

This repository (`sveltekit-template`) is the **reference implementation** of the
patterns below. It ships the **core** stack plus a minimal dummy app; the
**optional** features are documented here but not installed. Copy the setup, not
the dummy content.

> `TEMPLATE.md` file belongs in `sveltekit-template` only!
> When scaffolding a sibling project, read this file for context but **do not
> copy** it into the new repo. The new project documents itself in `README.md`,
> `BRAND.md`, and `DESIGN.md` instead.

> **How to read this file.** Where a file already exists in this repo, this
> document **points at the file** (the source of truth) and describes intent only.
> Code is inlined **only for optional features that are not in the repo** (so you
> have a recipe to add them). This is the "book of recipes": add optional pieces
> per project as needed.

Use this document (and [`README.md`](./README.md)) as the primary prompt/context
when asking an AI agent to scaffold a sibling project. See §9 for the prompt
template.

---

## 1. Stack at a glance

### Core (same in every project)

| Layer              | Choice                                                                         | In this repo            |
| ------------------ | ------------------------------------------------------------------------------ | ----------------------- |
| Runtime            | Node.js **24+** (`engines.node`, `.nvmrc`, CI)                                 | ✓                       |
| Package manager    | **pnpm** (`packageManager` field, `engine-strict=true` in `.npmrc`)            | ✓                       |
| Framework          | **Svelte** + **SvelteKit** (SSR, file-based routing)                           | ✓                       |
| Build              | **Vite**                                                                       | ✓                       |
| Deploy             | **Railway** with **`@sveltejs/adapter-node`**                                  | ✓                       |
| CSS                | **Tailwind CSS v4** via `@tailwindcss/vite` + `@theme` tokens in `src/app.css` | ✓                       |
| Images             | **`@sveltejs/enhanced-img`**                                                   | ✓                       |
| Icons              | **`@lucide/svelte`**                                                           | ✓                       |
| Fonts              | **`@fontsource/*`** fonts as needed                                            | system stack by default |
| SEO                | **super-sitemap**, **schema-dts**                                              | super-sitemap only ✓    |
| Git hooks          | **lefthook** (`pnpm check`/`lint`/`format` on pre-push)                        | ✓                       |
| CI                 | GitHub Actions: `check`, `lint`, `format`, `build`                             | ✓                       |
| Cursor agent setup | `.cursor`, AI rule files with instructions + full setup for cloud agents       | ✓                       |

> **Database is treated as optional here.** Many quick projects ship without one
> and add Postgres + Prisma later (see the optional table and §4.6). If a project
> needs a DB from the start, add it during bootstrap.

### Optional (install only when the project needs them)

This is a reference table of features I have already built in some projects,
here are my go-to technologies and setup.

| Layer           | Packages / services                                      | When                          |
| --------------- | -------------------------------------------------------- | ----------------------------- |
| Database        | **PostgreSQL** + **Prisma** (`@prisma/adapter-pg`, `pg`) | Persistent data               |
| Email           | **Nodemailer** + Maildev in Docker                       | Forms, transactional email    |
| Payments        | **Stripe** + `@stripe/stripe-js`                         | Checkout                      |
| Invoicing       | **SuperFaktura** + my own `superfaktura-library`         | Post-purchase invoicing       |
| Analytics       | **Umami** (Docker locally; env in prod)                  | Privacy-friendly analytics    |
| Background jobs | **vite-node** + `worker.ts` always-on worker             | Async email/files/webhooks    |
| SEO types       | **schema-dts**                                           | Typed JSON-LD structured data |
| Validation      | **Zod**                                                  | As needed                     |
| Utilities       | **date-fns**, **lodash-es**                              | As needed                     |

---

## 2. Repository layout

This is a generic skeleton. Add `lib/` subfolders and routes only for features the project
uses. Files marked _(optional)_ are not in this repo; add them with the recipes below.

```
.
├── .cursor/
│   ├── rules/                  # always-applied agent rules (agent/cloud/local)
│   ├── skills/                 # task-specific agent skills (per project)
│   ├── agents/                 # subagent definitions (per project)
│   ├── environment.json        # cloud install + Docker
│   ├── install.sh              # cloud: agentfiles refresh + nvm + pnpm install
│   └── Dockerfile              # cloud VM image
├── .github/workflows/ci.yml    # CI
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
│   │   ├── components/         # atoms / layout / molecules / organisms as needed
│   │   ├── db/                 # (optional) prisma client wrapper (*.server.ts)
│   │   └── …                   # additional feature modules
│   └── routes/                 # SvelteKit file-based routing
├── static/
├── tmp/
├── BRAND.md                    # brand voice, audience, mood
├── DESIGN.md                   # visual system: tokens, components, a11y
├── docker-compose.yml          # (optional) local services
├── .env.example
├── eslint.config.mjs
├── prettier.config.mjs
├── lefthook.yml
├── prisma.config.ts            # (optional) Prisma config
├── svelte.config.js
├── tsconfig.json
├── vite.config.ts
├── README.md                   # describes this repo
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

Do **not** copy `TEMPLATE.md` into the new project. It is the template-repo
recipe book; agents read it from `sveltekit-template` when bootstrapping.

**Replace template placeholders.** After copying or referencing any file from
this repo, adapt template-style placeholders and template-repo wording for the
target project. Do not leave unfilled tokens (e.g. `<SITE_LOCALE>`), generic
"insert here" instructions, or descriptions like "in this template there are no
env vars". Fill `.env.example`, README, rules, and comments with the target
project's actual integrations, locale, brand, and env keys.

**Core installs** (already in this repo's `package.json`):

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
`zod`, `date-fns`, `lodash-es`, `@fontsource/*`, `superfaktura-library` (invoicing).

### 3.2 Root config files

These are present in the repo and are the source of truth. Copy patterns,
adjust values:

| File                  | In repo | Notes                                                         |
| --------------------- | ------- | ------------------------------------------------------------- |
| `.nvmrc`              | ✓       | `24`                                                          |
| `.npmrc`              | ✓       | `engine-strict=true`                                          |
| `.editorconfig`       | ✓       | copy file                                                     |
| `.gitignore`          | ✓       | copy file (add `src/generated` with Prisma)                   |
| `.prettierignore`     | ✓       | `pnpm-lock.yaml`, asset dirs                                  |
| `prettier.config.mjs` | ✓       | copy file                                                     |
| `eslint.config.mjs`   | ✓       | flat config: js + ts + svelte + prettier                      |
| `pnpm-workspace.yaml` | ✓       | `allowBuilds` for dependencies                                |
| `tsconfig.json`       | ✓       | copy file                                                     |
| `svelte.config.js`    | ✓       | `adapter-node` + `vitePreprocess` (see file)                  |
| `vite.config.ts`      | ✓       | `enhancedImages()`, `sveltekit()`, `tailwindcss()` (see file) |

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

**`prisma.config.ts`** _(optional, add with Prisma)_:

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

**`prisma/schema.prisma`** _(optional)_. Generator outputs to `../src/generated/prisma`,
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

Add a `docker-compose.yml` when the project uses local services.
This is useful for quickly starting the whole project stack. Standard trio:

1. **postgres:16**. App DB (healthcheck via `pg_isready`)
2. **maildev**. SMTP capture (if sending email)
3. **umami**. Analytics (if using Umami)

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

Note: Umami needs its own database. Create it via a Postgres init config, e.g. a
`configs:` entry that runs `CREATE DATABASE umami;`.

### 3.4 Environment variables

Pattern: **every** `$env/static/*` import must exist at build time. This is how
SvelteKit works. Document all keys in [`.env.example`](./.env.example)
with placeholders (never empty strings).

Do not list env vars in the README. Point to `.env.example`, where keys are
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
9. Language policy (site copy vs code/docs, if the project uses a different language than English)

### 3.6 Railway deployment

All projects deploy on **Railway**:

- Build: `pnpm install --frozen-lockfile; pnpm build`
- Start: `pnpm start`
- Attach Railway Postgres (if using a DB)
- Set all env vars from `.env.example` in the Railway dashboard
- Optional second Railway service for `pnpm start-worker` when using background jobs
- Preview deploys use `*.up.railway.app`, which the [`src/hooks.server.ts`](./src/hooks.server.ts) redirect rules account for

---

## 4. Reference patterns

### 4.1 Layout shell

[`src/routes/+layout.svelte`](./src/routes/+layout.svelte): imports `app.css`; a
global `header / main / footer` grid (`grid min-h-dvh grid-cols-1 grid-rows-[auto_1fr_auto]`).
Mount client-only widgets (`*.client.svelte`) here for analytics or third-party scripts.

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

If the project is using separate light and dark mode colors, utilize modern CSS (`light-dark()`):

```css
:root {
  color-scheme: light dark;
}

body {
  /* example colors */
  color: light-dark(#333b3c, #efefec);
  background-color: light-dark(#efedea, #223a2c);
}
```

### 4.3 Components

Tiered folders (`atoms/`, `molecules/`, `layout/`, `organisms/`) as complexity
grows. The base template ships only `organisms/header.svelte` and
`organisms/footer.svelte` for the shell. Document component contracts and page
composition concisely in the project's `DESIGN.md`.

### 4.4 Routes

SvelteKit conventions: static pages in `+page.svelte`; forms and data in
`+page.server.ts`; APIs in `routes/api/**/+server.ts`; confirmation pages as
separate routes; dynamic segments via `[param]`. SEO endpoints live at
[`src/routes/robots.txt/+server.ts`](./src/routes/robots.txt/+server.ts) and
[`src/routes/sitemap.xml/+server.ts`](./src/routes/sitemap.xml/+server.ts) (using
`super-sitemap`; see the files for reference and copy them).

### 4.5 Server hooks

[`src/hooks.server.ts`](./src/hooks.server.ts) holds the production URL policy. It
skips `localhost`, forces HTTPS, skips Railway preview domains (`*.up.railway.app`),
and forces the canonical `www.` host.

### 4.6 Prisma client _(optional)_

Add `src/lib/db/prisma.server.ts`:

```ts
import { DATABASE_URL } from '$env/static/private';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
export default new PrismaClient({ adapter });
```

Remember to gitignore `src/generated` and add `prisma generate`
to the `prepare` script (§3.2).

### 4.7 Background jobs _(optional)_

Web requests enqueue DB rows; a separate `pnpm start-worker` process drains them.
The reference implementation uses Postgres `LISTEN/NOTIFY`, `FOR UPDATE SKIP LOCKED`,
retries, and job dependencies. Adopt this pattern or simplify per project.
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

- **Email:** Nodemailer + `lib/email/*.server.ts`. Note: later we plan to migrate to
  [Resend](https://resend.com/emails), so new projects might already start with that.
- **Stripe:** server client + webhook route; never process purchases inline in the
  request handler. Instead enqueue for the worker.
- **Analytics:** Umami via a `*.client.svelte` widget and `PUBLIC_UMAMI_*` env vars.
  Note that I already host a single Umami instance on Railway for all my projects.

### 4.9 Language split

| Context                     | Language    |
| --------------------------- | ----------- |
| User-facing copy in `src/`  | Site locale |
| Code, README, docs, AI chat | English     |

Encode in [`.cursor/rules/agent.mdc`](./.cursor/rules/agent.mdc). This is only relevant
for projects which are not entirely in English and use a different language for user-facing copy.

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

[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) runs four parallel jobs on
push and PR: `check`, `lint`, `format`, `build`. Node 24, `pnpm install --frozen-lockfile`.
When the app imports `$env/static/*` keys, add an `env:` block
injecting a placeholder for **every** key (mirror `.env.example`), for example:

```yaml
env:
  DATABASE_URL: postgresql://postgres:postgres@localhost:5432/ci
  PUBLIC_UMAMI_URL: placeholder
```

### Cursor agent workflow

See [§7.1](#71-rules-always-applied).

---

## 6. Brand & design documentation

Every project bootstrapped from this template has two root-level docs (English):
`BRAND.md` and `DESIGN.md`. They are **created per project** and are intentionally
not part of this template repo. Use the structure below as the skeleton, and use the
`brand-md` and `design-md` agent skills (from agentfiles) to create and maintain
them.

### `BRAND.md`: the why

One-sentence brand mood, audience and positioning, tone of voice and vocabulary,
high-level visual personality (not tokens), and the tiebreaker rule.

### `DESIGN.md`: the how

Color palette and `@theme` token table, typography (families, fluid base size,
text-role catalog), layout primitives and composition, component contracts,
and focus/motion/imagery/a11y rules.

**Rules:**

- Visual changes ship in the same PR as the matching `DESIGN.md` update.
- If code and `DESIGN.md` disagree, trust code and fix the doc in the same change.
- Agents doing UI work read `BRAND.md` first, then `DESIGN.md`.

---

## 7. AI agent setup (`.cursor/`)

### 7.1 Rules (always applied)

Three rules, generalized in this repo:

- [`agent.mdc`](./.cursor/rules/agent.mdc) contains universal rules and instructions, always applied, project-specific
- [`cloud.mdc`](./.cursor/rules/cloud.mdc) is the autonomous cloud workflow (metadata: `environments: cloud`)
- [`local.mdc`](./.cursor/rules/local.mdc) is the collaborative local workflow (metadata: `environments: local`)

General local/cloud behavior is in global user rules at `~/.cursor/rules/`
(the repo files point to the relevant ones).

### 7.2 Skills

Task-specific skills go in **`.cursor/skills/<skill-name>/SKILL.md`** (per project;
none shipped).

### 7.3 Subagents

Subagent definitions go in **`.cursor/agents/<agent-name>.md`** (per project; none
shipped).

### 7.4 Cloud environment

Reused in every project:

- [`.cursor/environment.json`](./.cursor/environment.json) builds via the Dockerfile,
  starts Docker, and installs via `install.sh`
- [`.cursor/install.sh`](./.cursor/install.sh) refreshes agentfiles from `origin/master`,
  runs `~/.agentfiles/install`, then `nvm install`, `corepack prepare --activate`, and
  `pnpm install --frozen-lockfile`
- [`.cursor/Dockerfile`](./.cursor/Dockerfile) provides Ubuntu + Docker + NVM Node 24
  and bakes in a baseline agentfiles copy (refreshed at runtime by `install.sh`)

---

## 8. Per-project customization matrix

| Area                     | Keep same everywhere              | Customize per project                 |
| ------------------------ | --------------------------------- | ------------------------------------- |
| Core stack & tooling     | ✓                                 | —                                     |
| Config file patterns     | ✓                                 | —                                     |
| CI / lefthook / scripts  | ✓                                 | add worker/db scripts if used         |
| `.cursor/` cloud setup   | ✓                                 | skills/agents per project             |
| Railway deployment       | ✓                                 | env vars, services count              |
| `BRAND.md` + `DESIGN.md` | two-file pattern at repo root     | all content and tokens                |
| `src/lib/components/`    | naming conventions                | which components exist                |
| `prisma/schema.prisma`   | generator output path, PostgreSQL | models (optional feature)             |
| `src/routes/`            | SvelteKit conventions             | pages and APIs                        |
| `docker-compose.yml`     | pattern                           | which services (optional)             |
| `.env.example`           | pattern                           | keys for integrations in use          |
| Site copy language       | policy (split from code)          | target locale and grammar, if needed  |
| `TEMPLATE.md`            | template repo only                | do not copy — use project `README.md` |

---

## 9. Agent prompt template (copy for new repo)

```
Bootstrap a new website using the SvelteKit project template (this repo).

Site: [name, domain, one-line purpose]
Audience: [who]
Locale: [language + grammar rules for src/ copy, or just all English]
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
5. docker-compose + .env.example (services matching integrations), only if needed
6. Minimal working homepage + layout shell
7. CI workflow
8. pnpm fix && pnpm check && pnpm build passing

Use latest package versions. Install only dependencies required for listed features.
Do not copy TEMPLATE.md into the new repo (read it from sveltekit-template only).
Do not copy data models, routes, or components from reference repos unless listed.
After copying or referencing any file from this template repo, replace template-style
placeholders and template-repo descriptions (e.g. in .env.example, README.md,
.cursor/rules) with target-project values. Do not leave unfilled <> placeholders
or wording like "in this template…".
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
- Prescribed data models or business logic
- CMS (unless a specific project needs one)
- E2E test suite (add later if needed)
- Edge/serverless deploy (Railway + adapter-node is my go-to)

Add these only when a specific project requires them.
