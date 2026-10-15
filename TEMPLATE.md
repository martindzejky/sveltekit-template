# Web project bootstrap template

Use this file to bootstrap a new website from `sveltekit-template`. It records
my preferred stack, setup choices, and conventions. Choose the application's
architecture and integration details for the project being built.

Keep `TEMPLATE.md` in this repository. New projects document their own setup in
`README.md`. The installed stack, commands, and code references are in
[README.md](./README.md).

## 1. Stack and documentation

Start with the installed packages and configuration in this repository. Read the
libraries' official documentation before configuring or extending them, using
documentation that matches the selected versions. Review versions and API
compatibility at bootstrap time.

For the base stack, see the [SvelteKit documentation](https://svelte.dev/docs/kit),
[Tailwind CSS documentation](https://tailwindcss.com/docs), and
[class-variance-authority documentation](https://cva.style/docs). Follow this
repo's configuration and component references for its local conventions.

These optional integrations are preferred choices, not installed dependencies.
Add only what the requested features need.

| Layer           | Preferred packages / services             | When                                         | Documentation                                                                             |
| --------------- | ----------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Database        | PostgreSQL, Kysely, `pg`, `@types/pg`     | Persistent data                              | [Kysely](https://kysely.dev/docs/intro), [migrations](https://kysely.dev/docs/migrations) |
| Email           | Resend                                    | Forms, transactional email, newsletters      | [Resend Node SDK](https://resend.com/docs/send-with-nodejs)                               |
| Payments        | Stripe + `@stripe/stripe-js`              | Checkout                                     | [Stripe](https://docs.stripe.com/)                                                        |
| Invoicing       | Doklado + `@martindzejky/doklado-library` | Post-purchase invoicing                      | [Library README](https://github.com/martindzejky/doklado-library)                         |
| Analytics       | Umami                                     | Privacy-friendly analytics                   | [Umami](https://umami.is/docs)                                                            |
| Background jobs | pg-boss                                   | Async processing, retries, scheduling        | [pg-boss](https://pgboss.io/)                                                             |
| SEO types       | schema-dts                                | Typed JSON-LD structured data                | [schema-dts](https://github.com/google/schema-dts)                                        |
| Validation      | Zod                                       | Runtime validation                           | [Zod](https://zod.dev/)                                                                   |
| Utilities       | date-fns, lodash-es                       | As needed                                    | [date-fns](https://date-fns.org/docs/Getting-Started), [Lodash](https://lodash.com/docs/) |
| Local API mocks | WireMock in Docker                        | Developing and testing external integrations | [WireMock](https://wiremock.org/docs/)                                                    |

## 2. Preferred conventions

- Keep SvelteKit configuration in [vite.config.ts](./vite.config.ts).
- Use `#lib/*` imports with file extensions, including `#lib/cn.ts`.
- Use [button.svelte](./src/lib/components/atoms/button.svelte) as the component
  reference. The global `tailwind-cva` skill covers class merging and variants.
- Keep reusable components in `src/lib/components/`. Follow the existing
  `atoms/` and `organisms/` folders; add structure when the project needs it.
- Keep theme values in [src/app.css](./src/app.css). Use system fonts by default;
  add `@fontsource` packages when the project's design calls for webfonts.
- Keep database access and service credentials in server-only code. If a worker
  shares backend code with the web app, keep that shared code free of SvelteKit
  imports and pass configuration from each process.
- For PostgreSQL, prefer lowercase snake_case names and plural table names.
  Keep Kysely table types aligned with migrations and actual driver values.
- Keep global workflow rules and skills in
  [agentfiles](https://github.com/martindzejky/agentfiles). Put project-specific
  commands and constraints in the new project's `AGENTS.md`.

## 3. Bootstrap setup

### Scaffold and project documentation

Copy this repository's app and configuration into the new project. Replace the
example content, package name, domain, metadata, and template comments. Keep the
existing build system, formatter, lint configuration, and CI as the starting point.

Write the project's README with its purpose, production URL, prerequisites,
setup commands, local services, integrations, and deployment instructions.
Point to `.env.example` for environment keys.

Create `BRAND.md` and `DESIGN.md` using the global `brand-md` and `design-md`
skills. They describe audience, positioning, voice, and visual rules. Read them
in that order before visual work, and keep visual changes and the matching
`DESIGN.md` update together.

Set `lang` in `src/app.html` to the site's locale. Follow the
[language guidance](./README.md#languages) and record the site's locale and
grammar rules in its `AGENTS.md`. Keep code, docs, and tooling in English.

### Environment variables

Declare new keys in `src/env.ts` and use SvelteKit's `$app/env/private` and
`$app/env/public` imports. Follow the
[SvelteKit environment documentation](https://svelte.dev/docs/kit/environment-variables)
for declarations and runtime versus build-time values. Expose only values safe
for the browser.

Document keys with comments and non-empty placeholders in
[.env.example](./.env.example). Point to that file from the README instead of
maintaining a second key list. Run `pnpm sync` after env changes. Standalone
workers and scripts load and validate their own environment values.

### Optional integrations and local services

Use the documentation in section 1 for installation, configuration, and APIs.
Choose folder layout, scripts, and process boundaries to suit the project's
features. Add pnpm workspaces when sharing packages between apps is useful.

When adding Kysely, provide one `db:migrate` command for local and deployment
use, following its migration guide. When adding a worker, document how to start,
check, build, and stop it.

Add a Compose file only for services the project uses, such as PostgreSQL,
WireMock, or a self-hosted Umami instance. Document ports and startup commands.
Use local mocks for external APIs and keep their configuration out of production.

### Railway deployment

Railway is the preferred deployment target with the existing Node adapter.
Start with `pnpm install --frozen-lockfile` and `pnpm build`, then `pnpm start`.
Follow the [Railway documentation](https://docs.railway.com) and
[SvelteKit Node adapter documentation](https://svelte.dev/docs/kit/adapter-node)
for service configuration, origin handling, and shutdown behavior.

Provision PostgreSQL and configure environment values when needed. Use
`pnpm db:migrate` as a pre-deploy command when the project has migrations.
Deploy a standalone worker as a separate service when required.

Set `CANONICAL_ORIGIN` to the production HTTPS origin (see `.env.example`) to
enable redirects in [src/hooks.server.ts](./src/hooks.server.ts). The configured
hostname and its `www`/non-`www` counterpart redirect to that origin in one step,
preserving the path and query. Development and unrelated preview hosts are left
alone. Leave it unset to disable redirects.

Adapt the [robots endpoint](./src/routes/robots.txt/+server.ts)
and [sitemap endpoint](./src/routes/sitemap.xml/+server.ts) to the project's
public routes.

## 4. Lessons learned

Use these as checks when the relevant feature is needed. Implementation details
belong in the new project's documentation and the libraries' current guides.

- Keep applied migrations unchanged and independent of current application
  models. If multiple services can migrate, check how concurrent runs are handled.
- Jobs and webhooks can run more than once. Make side effects safe to retry, and
  use transactional enqueueing when a database write and its job must commit together.
- Check SDK error results as well as thrown exceptions. Define recovery for
  external calls whose outcome is uncertain before blindly retrying them.
- Check queue schema setup and how changes to queue defaults affect existing jobs.
  Choose retry and retention policies for the actual workload.
- Verify webhook signatures before processing events. Local mocks should cover
  the endpoints and behavior the project uses.
- Define ownership of contact details and preferences before adding newsletter
  synchronization.

## 5. Verification

Keep the checks described in [README.md](./README.md#commands). Supply placeholders
matching `.env.example` in CI when environment values are needed for checks or
builds. Extend validation and CI to cover any added packages or services.

Test integrations against local services and mocked external APIs. Cover failure,
retry, and duplicate-delivery behavior where relevant. Choose tests for the
project's behavior rather than imposing a database or worker test suite up front.

Before handing off the new project:

- Replace template names, domains, metadata, and locale placeholders.
- Document environment keys, local services, and deployment commands.
- Verify migrations and worker startup when those features are included.
- Exercise pages and features in the browser.
- Run `pnpm fix`, `pnpm check`, and `pnpm build`.

## 6. Prompt for a new project

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

Use the preferred stack and conventions in TEMPLATE.md. Read official library
documentation matching the selected versions before setting up integrations.
Install only dependencies needed for the requested features, and choose the
application architecture for this project's requirements.

Keep TEMPLATE.md in sveltekit-template. Replace all template placeholders and
descriptions with the new project's values.
```
