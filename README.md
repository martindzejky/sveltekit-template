# sveltekit-template

An opinionated **SvelteKit project template** with my go-to stack, tooling,
configs, and conventions for spinning up new websites. Clone it, point an AI agent
at it, and bootstrap a new site with a consistent setup every time.

This repository ships the **core stack only** plus a small dummy app. Optional
features (database, email, payments, analytics, background jobs) are **not**
installed. They live in [`TEMPLATE.md`](./TEMPLATE.md) so you can add them per
project when needed.

## What's inside

- **SvelteKit** + **Svelte 5** + **Vite**, deployed on **Railway** via
  `@sveltejs/adapter-node`
- **Tailwind CSS v4** (`@tailwindcss/vite` + `@theme` tokens), `@sveltejs/enhanced-img`,
  `@lucide/svelte`
- **TypeScript**, **ESLint** (flat config) + **Prettier**, **lefthook** git hooks
- **super-sitemap** + `robots.txt` / `sitemap.xml` routes
- **GitHub Actions** CI: `check`, `lint`, `format`, `build`
- **Cursor** agent setup (`.cursor/rules`, cloud environment, Dockerfile)
- A minimal dummy app: layout shell, homepage, error page, server hooks

See [`TEMPLATE.md`](./TEMPLATE.md) for the full recipe, conventions, and the list
of optional features.

## Using this as a template

When starting a new project, give an AI agent the link to this repository and the
prompt template in [`TEMPLATE.md` §9](./TEMPLATE.md). Fill in the project specifics
(name, locale, brand, features, integrations) and let it scaffold a sibling project
following the same conventions.

## Running the dummy app

### Prerequisites

- Node.js 24+
- pnpm

### First-time setup

```sh
pnpm install
pnpm dev
```

The dev server serves the dummy homepage. Replace `src/routes` and
`src/lib/components` with the new project's content.

### Scripts

| Task                    | Command       |
| ----------------------- | ------------- |
| Dev server              | `pnpm dev`    |
| Production build        | `pnpm build`  |
| Start production server | `pnpm start`  |
| Type check              | `pnpm check`  |
| SvelteKit sync          | `pnpm sync`   |
| Format + lint (fix)     | `pnpm fix`    |
| Format check            | `pnpm format` |
| Lint                    | `pnpm lint`   |

`pnpm sync` regenerates `$env/static/*` types after env or SvelteKit config changes.

There is no `.env` requirement in the base template. Copy `.env.example` to `.env`
once a feature introduces environment variables; keys are documented inline there.

## Reference docs

| File                           | Contents                                                 |
| ------------------------------ | -------------------------------------------------------- |
| [`TEMPLATE.md`](./TEMPLATE.md) | Full project setup recipe and optional features          |
| `.cursor/`                     | AI agent rules, skills, subagents, and cloud environment |

## Languages

User-facing copy in `src/` uses the project's site locale (set per project).
**English** is used for source code, documentation, tooling, AI conversations,
commits, PRs, and issues.
