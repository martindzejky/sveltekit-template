# Web project bootstrap template

Use this file to bootstrap a new website from `sveltekit-template`. Keep it in
this repository. New projects document their own setup in `README.md`.

The installed stack and code references are in [README.md](./README.md).
Existing files are the implementation reference. The recipes below describe
optional additions that are not installed here.

## 1. Optional integrations

| Layer           | Packages / services                       | When                                    |
| --------------- | ----------------------------------------- | --------------------------------------- |
| Database        | PostgreSQL, Kysely, `pg`, `@types/pg`     | Persistent data                         |
| Email           | Resend + WireMock in Docker               | Forms, transactional email, newsletters |
| Payments        | Stripe + `@stripe/stripe-js`              | Checkout                                |
| Invoicing       | Doklado + `@martindzejky/doklado-library` | Post-purchase invoicing                 |
| Analytics       | Umami                                     | Privacy-friendly analytics              |
| Background jobs | pg-boss + a separate Node.js worker       | Async email/files/webhooks              |
| SEO types       | schema-dts                                | Typed JSON-LD structured data           |
| Validation      | Zod                                       | As needed                               |
| Utilities       | date-fns, lodash-es                       | As needed                               |

## 2. Repository layout

See [README.md](./README.md#code-references) for the existing app files. Components
live in `src/lib/components/atoms/` and `src/lib/components/organisms/`.
Add other folders only as the project needs them.

For a database-only app, add `src/lib/db/` for server-only access, `migrations/`,
and `scripts/migrate.ts`.

When adding a worker, use pnpm workspaces:

- `apps/web/` contains the SvelteKit app.
- `apps/worker/` contains the standalone Node.js worker.
- `packages/backend/` contains database types, migrations, jobs, and email code.

Keep the shared backend free of SvelteKit imports. Pass configuration from each
app. Compile the backend and worker with TypeScript using NodeNext and export the
backend's compiled modules. Use `workspace:*` dependencies and build the backend
before its consumers. Add domain packages only when the project needs them.

Check package versions and API compatibility when adding integrations. Keep this
template's SvelteKit 3 and Vite 8 setup.

The paths elsewhere in this file describe the base template. After moving the
web app, its `src/` and configuration files live under `apps/web/`.

## 3. Bootstrap steps

### 3.1 Scaffold

Copy this repository's app and configuration into the new project. Keep
`TEMPLATE.md` here. Replace the example content, package name, domain, metadata,
and comments that describe this template.

Use the existing [package.json](./package.json) and config files as references.
Review dependency versions at bootstrap time. Add optional packages only for the
requested integrations.

### 3.2 Database and worker scripts

For a database-only app, add a script that runs the Kysely migration runner with
Node.js 24:

```jsonc
{
  "db:migrate": "node --env-file-if-exists=.env scripts/migrate.ts",
}
```

Use the same command locally and during deployment to apply pending migrations.
Add timestamp-prefixed files with `up(db)` and `down(db)`, then update the database
table types. Kysely has no generated
client or schema file. Keep applied migrations unchanged.

Use `Migrator` and `FileMigrationProvider` from `kysely/migration`. Resolve the
migration folder relative to the runner's `import.meta.url`, fail the command on
migration errors, and close the database pool in `finally`. Report success only
after the batch commits. See the
[Kysely migration guide](https://kysely.dev/docs/migrations). Keep migration files
independent of current application models so later schema changes cannot alter
an older migration.

For workspaces, place the runner in `packages/backend/scripts/migrate.ts` and
migrations in `packages/backend/migrations/`. Its scripts load `../../.env`.
Root scripts delegate to the package. Set up build and startup scripts:

- `prepare` builds the backend, runs SvelteKit sync, and installs lefthook.
- `build:web` and `build:worker` build each app and its workspace dependencies.
- `build` builds all packages; `check` checks them all, including migrations and tests.
- `start-worker` rebuilds the worker for local use, then runs its compiled entrypoint.

Use Node's env-file support for standalone processes. Keep SvelteKit environment
imports in the web app.

### 3.3 Local services

Add a Compose file when the project needs local services.

| Service    | Setup                                            |
| ---------- | ------------------------------------------------ |
| PostgreSQL | Persistent volume and a `pg_isready` healthcheck |
| WireMock   | Resend HTTP mock on port 8080 with a request log |
| Umami      | Separate database, created before Umami starts   |

Document ports and startup commands in the new project's README. Include only
services used by that project. For Resend, use a dummy API key and set
`RESEND_BASE_URL` to the local mock. Inspect requests at
`http://localhost:8080/__admin/requests`. Leave the override unset in production.
Add WireMock mappings for the endpoints the project uses. For email capture,
match `POST /emails` and return a `200` JSON response containing an `id`.
Contact synchronization needs additional mappings. Document whether those mocks
persist preferences or return fixed responses.

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
- Run `pnpm db:migrate` as a pre-deploy command when using a database
- For workspaces, build with `pnpm build:web` and start with `node apps/web/build/index.js`
- Deploy workers as a second service with `pnpm build:worker` and `node apps/worker/dist/worker.js`
- Use direct Node start commands so Railway's SIGTERM reaches each process
- If both services run migrations, serialize schema inspection and migration execution
  with a PostgreSQL advisory lock on the same connection. Use a stable project-specific
  lock name. Release the lock in `finally` before closing the connection.
- Pre-deploy prepares the pg-boss schema and queue defaults. Runtime processes use
  `migrate: false`. Call both `createQueue` and `updateQueue` when provisioning,
  because `createQueue` does not update existing queue defaults.
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

### 4.6 Database

Use Kysely's `PostgresDialect` with a `pg` pool. Define table interfaces in
`models.type.ts` and pass the database URL into a factory:

```ts
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from './models.type.ts';

export function createDatabase(databaseUrl: string) {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString: databaseUrl }),
    }),
  });
}
```

In the web app, declare `DATABASE_URL` in `src/env.ts` and supply it from
`$app/env/private` in a `*.server.ts` module. Workers and migration scripts use
`process.env` and validate required values at startup.

Use lowercase snake_case names and plural tables. PostgreSQL generates UUID
primary keys and initial timestamps. Give application records `created_at` and
`updated_at` columns using `timestamptz` with `now()` defaults. Set `updated_at`
on every update; a default only handles inserts. Keep both timestamps unchanged
for append-only events. Store the original event time separately as `occurred_at`
when it differs from insertion time.

Use `Generated` and `ColumnType` to match PostgreSQL defaults and driver types.
PostgreSQL timestamps read as `Date`; allow `Date | string` for writes and
`undefined` on insert when the column has a default. Maintain the interfaces
alongside migrations.

### 4.7 Background jobs

Use pg-boss for queue storage, retries, scheduling, and crash recovery. The web
app enqueues jobs; a separate compiled Node.js worker processes them. Use native
pg-boss APIs, including `fromKysely(tx)` when a database write and its downstream
jobs must commit together. Do not write to pg-boss tables directly.

Producers use `new PgBoss({ db: fromKysely(db), migrate: false, supervise: false,
schedule: false })` with the existing Kysely pool. They enqueue without calling
`start()`. The worker starts pg-boss with `migrate: false` and registers handlers.
On SIGTERM or SIGINT, stop pg-boss gracefully before closing the database.

Start with three retries and exponential backoff from one minute. Log the queue,
job ID, and error when retries run out. Changes
to queue defaults affect new jobs; existing jobs retain their settings. Document
retention and recovery for the new project's workloads.

Handlers must tolerate retries and duplicate deliveries. Keep business progress
in application tables when it must survive a failed job or an uncertain external
API call. pg-boss does not make external side effects happen exactly once.

### 4.8 Email

Use the Resend Node SDK in server-only code. Supply `RESEND_API_KEY` from the app's
configuration and use a verified sender domain. A transport factory can live in
`packages/backend/src/email/transport.server.ts`:

```ts
import { Resend } from 'resend';

export function createEmailTransport(apiKey: string) {
  return new Resend(apiKey);
}
```

`emails.send()` returns `{ data, error }`. Throw a returned error so a worker can
retry the job. Encode attachment content as base64 strings. See
[Resend's Node guide](https://resend.com/docs/send-with-nodejs).

Use the local WireMock setup from section 3.3 during development. Add newsletter
contacts, topics, and webhook handling only when the project needs them. Define
who owns contact details and preferences before implementing synchronization.
Add consent history and contact sync jobs only for newsletter features.

### 4.9 Other integrations

- Stripe uses a server client and webhook route. Verify signatures against the raw
  request body, validate the payload, enqueue work, then acknowledge the request.
  Let enqueue failures return an error so the provider retries. Workers handle
  provider API calls, purchase persistence, and downstream jobs.
- Invoicing uses Doklado through `@martindzejky/doklado-library`. Use
  `ghcr.io/martindzejky/doklado-mock` locally. Keep invoice progress and manual
  reconciliation in application tables when invoice creation can have an uncertain
  outcome. Add these only to projects that sell products.
- Analytics uses Umami through a client widget and public environment values.
  Confirm the instance URL and website ID for the new site.

## 5. CI and deployment checks

See [README.md](./README.md#commands) for scripts, hooks, and CI checks. When
integrations need environment values during checks or builds, add placeholders
matching `.env.example` to the CI workflow. Use SvelteKit 3's `$app/env/*` imports.

For database and worker features, use Vitest with PostgreSQL integration tests.
Create isolated test databases with an account that can create databases. Mock
external APIs; tests need no live Resend key. Cover fresh migrations, repeated and
concurrent migration runs, transactional enqueueing, retries, and duplicate
webhook deliveries as relevant. Run the suite in CI with a healthy PostgreSQL
service and build both apps.

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
- If using Kysely, run migrations against a healthy database and check table types.
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
