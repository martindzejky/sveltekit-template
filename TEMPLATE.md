# Web project bootstrap template

Use this file to bootstrap a new website from `sveltekit-template`. Keep it in
this repository. New projects document their own setup in `README.md`.

The installed stack and code references are in [README.md](./README.md).
Existing files are the implementation reference. The recipes below describe
optional additions that are not installed here.

## 1. Optional integrations

| Layer           | Packages / services                                    | When                          |
| --------------- | ------------------------------------------------------ | ----------------------------- |
| Database        | PostgreSQL, Prisma, `@prisma/adapter-pg`, `pg`, dotenv | Persistent data               |
| Email           | Nodemailer + Maildev in Docker                         | Forms, transactional email    |
| Payments        | Stripe + `@stripe/stripe-js`                           | Checkout                      |
| Invoicing       | SuperFaktura + my own `superfaktura-library`           | Post-purchase invoicing       |
| Analytics       | Umami                                                  | Privacy-friendly analytics    |
| Background jobs | vite-node and a separate worker process                | Async email/files/webhooks    |
| SEO types       | schema-dts                                             | Typed JSON-LD structured data |
| Validation      | Zod                                                    | As needed                     |
| Utilities       | date-fns, lodash-es                                    | As needed                     |

## 2. Repository layout

See [README.md](./README.md#code-references) for the existing app files. Components
live in `src/lib/components/atoms/` and `src/lib/components/organisms/`.
Add other folders only as the project needs them.

Optional additions include `prisma/` for schema and migrations,
`src/generated/prisma/` for the generated client, `src/lib/db/` for server-only
access, and `src/cli/worker.ts` for background jobs.

## 3. Bootstrap steps

### 3.1 Scaffold

Copy this repository's app and configuration into the new project. Keep
`TEMPLATE.md` here. Replace the example content, package name, domain, metadata,
and comments that describe this template.

Use the existing [package.json](./package.json) and config files as references.
Review dependency versions at bootstrap time. Add optional packages only for the
requested integrations.

### 3.2 Database and worker scripts

For Prisma, extend `prepare` and add migration scripts:

```jsonc
{
  "prepare": "svelte-kit sync; prisma generate; lefthook install || true",
  "db:migrate:dev": "prisma migrate dev",
  "db:migrate:deploy": "prisma migrate deploy",
}
```

For a worker, add:

```jsonc
{ "start-worker": "sh scripts/start-worker.sh" }
```

Add `prisma.config.ts`:

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

Add `prisma/schema.prisma` with the models the project needs:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

### 3.3 Local services

Add a Compose file when the project needs local services.

| Service    | Setup                                            |
| ---------- | ------------------------------------------------ |
| PostgreSQL | Persistent volume and a `pg_isready` healthcheck |
| Maildev    | SMTP capture on port 1025, web UI on port 1080   |
| Umami      | Separate database, created before Umami starts   |

Document ports and startup commands in the new project's README. Include only
services used by that project.

### 3.4 Environment variables

Declare environment variables in `src/env.ts` with `defineEnvVars` from
`@sveltejs/kit/env`. Import private values from `$app/env/private` and public
values from `$app/env/public`. Variables are dynamic by default. Set
`static: true` to inline a value at build time. Set `public: true` only for
values safe to expose to the browser. Document all keys in
[`.env.example`](./.env.example) with non-empty placeholder values.

Do not list env vars in the README. Point to `.env.example`, where keys are
explained by comments.

Run `pnpm sync` after env changes to regenerate SvelteKit types.

### 3.5 Project documentation

Write a README with the project's purpose, production URL, prerequisites, setup
commands, services, and integrations. Point to `.env.example` for environment keys
and to `BRAND.md` and `DESIGN.md` for brand and visual decisions.

Keep agent instructions specific to the project. Global workflow rules and skill
instructions belong in [agentfiles](https://github.com/martindzejky/agentfiles).

### 3.6 Railway deployment

Deploy on Railway:

- Build: `pnpm install --frozen-lockfile; pnpm build`
- Start: `pnpm start`
- Attach Railway Postgres when using a database
- Set all env vars from `.env.example` in the Railway dashboard
- Optional second Railway service for `pnpm start-worker` when using background jobs
- Preview deploys use `*.up.railway.app`, which the [`src/hooks.server.ts`](./src/hooks.server.ts) redirect rules account for
- For a fixed origin, set `paths.origin` in the `sveltekit(...)` config. Adapter-node 6 no longer reads `ORIGIN`.

## 4. Reference patterns

### 4.1 Layout shell

[src/routes/+layout.svelte](./src/routes/+layout.svelte) imports `app.css` and
places the header, main content, and footer in a full-height grid.
Mount client widgets here for analytics or third-party scripts.
Name them `*.client.svelte`.

### 4.2 Styling

[src/app.css](./src/app.css) owns theme values, fluid typography, and global focus
styles. It uses system fonts. Add `@fontsource` imports and update the `--font-*`
tokens when the project needs webfonts.

The global `tailwind-cva` skill covers class merging and variants.
[button.svelte](./src/lib/components/atoms/button.svelte) is this repo's reference.

### 4.3 Components

Replace the example header, footer, and homepage with the project's content.
Keep reusable components in `src/lib/components/`.

### 4.4 Routes and SEO

The [robots endpoint](./src/routes/robots.txt/+server.ts) and
[sitemap endpoint](./src/routes/sitemap.xml/+server.ts) derive their origin from
the request. Add dynamic route values and exclude private routes in the sitemap
when the new project needs them.

### 4.5 Server hooks

[src/hooks.server.ts](./src/hooks.server.ts) skips hosts beginning with
`localhost`, redirects HTTP to HTTPS, then skips `*.up.railway.app` hosts before
adding `www.` to other hosts. Review this policy for the new project's domain.
Railway domains still receive the HTTPS redirect.

### 4.6 Prisma client

Declare `DATABASE_URL` in `src/env.ts`:

```ts
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  DATABASE_URL: {},
});
```

Then add `src/lib/db/prisma.server.ts`:

```ts
import { DATABASE_URL } from '$app/env/private';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.ts';

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
export default new PrismaClient({ adapter });
```

Ignore `src/generated` and add `prisma generate`
to the `prepare` script described in [section 3.2](#32-database-and-worker-scripts).

### 4.7 Background jobs

Web requests enqueue DB rows; a separate `pnpm start-worker` process drains them.
The worker uses `vite-node` to run `src/cli/worker.ts` through
`scripts/start-worker.sh`:

```sh
#!/usr/bin/env sh
set -eu

exec node ./node_modules/vite-node/dist/cli.mjs \
  --options.transformMode.ssr='/.*/' \
  src/cli/worker.ts
```

On Railway, set the worker service start command to `sh scripts/start-worker.sh`
so deploy SIGTERM reaches the Node process.

### 4.8 Integration notes

- Email uses Nodemailer and server-only modules in `src/lib/email/`.
- Stripe uses a server client and webhook route; never process purchases inline in the
  request handler. Instead enqueue for the worker.
- Analytics uses Umami through a client widget and public environment values.
  Confirm the instance URL and website ID for the new site.

## 5. CI and deployment checks

See [README.md](./README.md#commands) for scripts, hooks, and CI checks. When
integrations need environment values during checks or builds, add placeholders
matching `.env.example` to the CI workflow.

## 6. Brand and design

Create these files in the new project using the global `brand-md` and `design-md`
skills:

- `BRAND.md` describes the audience, positioning, and voice.
- `DESIGN.md` describes visual rules and refers to theme tokens in code.

Read `BRAND.md` before `DESIGN.md` for visual work. Keep visual changes and the
matching `DESIGN.md` update together. This template includes neither file.

## 7. Agent setup

Use this repo's [AGENTS.md](./AGENTS.md) as a starting point for project-specific
commands and constraints. Keep global rules and skills in agentfiles.

## 8. Bootstrap checks

- Replace template names, domains, metadata, and locale placeholders.
- Set `lang` in `src/app.html` to the site's locale.
- Document environment keys in `.env.example` and supply CI values where needed.
- If using Prisma, generate the client and run migrations against a healthy database.
- If using a worker, document its startup command and deploy it as a separate service.
- Verify pages in the browser and run `pnpm fix`, `pnpm check`, and `pnpm build`.

## 9. Prompt for a new project

```
Bootstrap a new website using this SvelteKit project template.

Site: [name, domain, one-line purpose]
Audience: [who]
Locale: [language + grammar rules for src/ copy, or just all English]
Brand mood: [description]
Palette: [surface + accent hex values]
Fonts: [body, heading, accent]
Features: [forms, shop, downloads, blog, …]
Integrations: [list only what this site needs]
Pages: [homepage, about, contact, …]

Deliver:
1. Repo scaffold based on this repository
2. BRAND.md and DESIGN.md for this project
3. README.md with setup, env pointer, Railway deploy notes
4. AGENTS.md with project instructions
5. .env.example for integration keys and a Compose file for any local services
6. Minimal working homepage + layout shell
7. CI workflow
8. pnpm fix && pnpm check && pnpm build passing

Review package versions and install dependencies needed for the listed features.
Keep TEMPLATE.md in sveltekit-template. Replace all template placeholders and
descriptions with the new project's values.
```
