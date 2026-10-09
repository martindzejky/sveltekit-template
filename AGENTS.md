# Agent instructions

Read `README.md` first for local setup, services, integrations, and reference docs.
If docs and code disagree, trust the code and update the docs in the same change.
If anything is unclear or two instructions conflict, stop and ask.

## Code and verification

When you finish, run `pnpm fix` and `pnpm check`. Also run `pnpm build` when the change can affect the production build.
Write simple, minimal code.
Prefer patterns already in the repo.
Use `cva` from `class-variance-authority` for named Tailwind variants.
Use `cn()` from `$lib/cn` for conditionals, and pass a parent `class` prop through it last so the parent wins.
The prop is `class`. Events are `onclick`.
See the `tailwind-cva` skill and `src/lib/components/atoms/button.svelte`.
Keep the UI accessible.
Do not add features or APIs nobody asked for.
Put temporary files in `tmp/`, not the repo root.

If `pnpm check` misses `$env/static/*` exports, run `pnpm sync`.

## Design and brand

If `BRAND.md` and `DESIGN.md` exist, read `BRAND.md` first for the why, then `DESIGN.md` for the how, before any UI or visual work.
Ship visual changes together with the matching `DESIGN.md` update.

Use the `brand-md` and `design-md` skills when you create or edit these files.

## Git hooks

`lefthook` runs `pnpm check`, `pnpm lint`, and `pnpm format` on `git push`.
`pnpm install` installs the hooks. The `prepare` script runs `lefthook install`.

## Languages

Use this section only when user-facing copy is not English.

`<SITE_LOCALE>` is a placeholder. Replace it with the project's locale and grammar rules, for example Slovak, feminine form, with diacritics.

- `<SITE_LOCALE>` is for user-facing website copy in `src/`, including strings you add or edit.
- English is for source code, docs, AI chat, commits, PRs, and issues.

## Cloud workflow

Use this section in any cloud environment, for any agent, when nobody is there to answer a prompt. Setup and which services exist still come from `README.md`.

### Environment

Variables and secrets come from the process environment. The platform running the agent injects them. Do not create a `.env` file.
Every key in `.env.example` needs a value there. Use a placeholder for a key this task does not need. Do not set a key to an empty string.
If a required variable is missing, name the key, tell the user, and stop.

### Services

Skip this when the project has no local services.

Start Docker if it is not already running, then run `docker compose up -d`. The README names the services.
If Docker is not available, say so and stop.
Wait until Postgres is `healthy` in `docker compose ps` before a migration or a worker.
If migrate fails on a fresh Postgres volume, run `docker compose down -v`, start the services again, and retry.
When the project has a background worker, run it in its own process. The README says how.
The first Vite SSR request on a cold machine can take 15 to 18 seconds. Later requests are fast.

### Database migrations

Skip this when the project does not use Prisma.

`pnpm db:migrate:dev` asks for a migration name and hangs when nobody can type one. In a cloud session or in CI, write the SQL first, then apply it:

```sh
# Write migration SQL from pending schema changes. This does not apply it.
pnpm exec prisma migrate dev --name <descriptive_snake_case_name> --create-only

# Apply pending migrations
pnpm db:migrate:deploy
```

Use a short snake_case name that says what changed, such as `add_contact_source` or `drop_legacy_column`.
