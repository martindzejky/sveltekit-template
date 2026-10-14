# SvelteKit web project template

An opinionated SvelteKit template with my go-to stack, tooling, configs, and
conventions for new websites. Clone it, point an AI agent at it, and bootstrap a
new site with a consistent setup.

I keep this repository up to date with my latest conventions and preferences.
[TEMPLATE.md](./TEMPLATE.md) covers stack choices, setup, and preferred conventions.

## Stack

- SvelteKit 3, Svelte 5, and Vite 8 with the Node adapter for Railway
- Tailwind CSS 4, `class-variance-authority`, and the `cn()` class helper
- `@sveltejs/enhanced-img` for images and `@lucide/svelte` for icons
- TypeScript, ESLint, Prettier, and lefthook
- `super-sitemap` with `robots.txt` and `sitemap.xml` endpoints

[package.json](./package.json) contains the dependencies and scripts. Database,
email, payments, analytics, and background jobs are optional and are not installed.
Preferred choices include PostgreSQL with Kysely, pg-boss for jobs, and Resend
for email. See [TEMPLATE.md](./TEMPLATE.md#1-stack-and-documentation) for the
optional stack and links to library documentation.

## Local setup

Use Node.js 24 or later and the pnpm version pinned in `package.json`.

```sh
pnpm install
pnpm dev
```

The template needs no environment variables or Docker services. Declare keys in
`src/env.ts` when adding integrations and document them in
[.env.example](./.env.example).

## Commands

| Task                       | Command       |
| -------------------------- | ------------- |
| Dev server                 | `pnpm dev`    |
| Production build           | `pnpm build`  |
| Start production server    | `pnpm start`  |
| Type check                 | `pnpm check`  |
| Regenerate framework types | `pnpm sync`   |
| Fix formatting and lint    | `pnpm fix`    |
| Check formatting           | `pnpm format` |
| Lint                       | `pnpm lint`   |

`pnpm install` runs SvelteKit sync and installs the hooks in
[lefthook.yml](./lefthook.yml). The pre-push hook checks types, lint, and formatting.
[CI](./.github/workflows/ci.yml) runs those checks and a production build, then
starts the built server and requests the homepage.

## Code references

SvelteKit configuration lives in [vite.config.ts](./vite.config.ts).
Library imports use `#lib/*` from `package.json` and include file extensions,
for example `#lib/cn.ts`.

| File                                                                               | Purpose                                                                  |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [src/routes/+layout.svelte](./src/routes/+layout.svelte)                           | Header, main content, and footer                                         |
| [src/lib/components/atoms/button.svelte](./src/lib/components/atoms/button.svelte) | Component and variant reference                                          |
| [src/app.css](./src/app.css)                                                       | Theme tokens, fluid typography, and global focus styles                  |
| [src/hooks.server.ts](./src/hooks.server.ts)                                       | HTTPS and `www.` redirects, with localhost and Railway domain exceptions |
| [src/routes/robots.txt/+server.ts](./src/routes/robots.txt/+server.ts)             | Crawler policy                                                           |
| [src/routes/sitemap.xml/+server.ts](./src/routes/sitemap.xml/+server.ts)           | Sitemap generation                                                       |

## Documentation

- [TEMPLATE.md](./TEMPLATE.md) describes how to start a project from this repo.
- [AGENTS.md](./AGENTS.md) contains project-specific agent instructions.
- New projects use `BRAND.md` for audience, positioning, and voice, and
  `DESIGN.md` for visual rules. This template includes neither file.

## Languages

For projects in a language other than English, user-facing copy in `src/` uses
the site's locale and grammar rules. Record those in the project's `AGENTS.md`.
Use English for source code, documentation, tooling, AI conversations, commits,
PRs, and issues.
