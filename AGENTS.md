# Agent instructions

**Read `README.md` first** for local setup, services, integrations, and reference docs.
If docs and code disagree, trust code and update docs in the same change.
If anything is unclear or instructions conflict, STOP and ask.

## Code and verification

After you finish, run `pnpm fix` and `pnpm check` (and `pnpm build` when relevant).
Write simple, minimal code.
Prefer existing patterns.
Use `cva` (`class-variance-authority`) for named Tailwind variants.
Use `cn()` from `$lib/cn` for conditionals and to merge a parent `class` prop last.
The prop is `class`, not `className`. Events are `onclick`, not `onClick`.
See the `tailwind-cva` skill and `src/lib/components/atoms/button.svelte`.
Good accessibility is required.
Do not add unrequested features or APIs.
Store temporary artifacts in `tmp/`, not the repo root.

If `pnpm check` misses `$env/static/*` exports, run `pnpm sync`.

## Design and brand

If `BRAND.md` and `DESIGN.md` exist, read `BRAND.md` first for
the why, then `DESIGN.md` for the how on any UI or visual work. Ship visual changes
together with the matching `DESIGN.md` update.

Use the `brand-md` and `design-md` skills when creating or maintaining these files.

## Git hooks

`lefthook` runs `pnpm check`, `pnpm lint`, and `pnpm format` on `git push`.
Install hooks via `pnpm install` (the `prepare` script runs `lefthook install`).

## Languages

This only applies if the project is not English-only and uses a different language
for the user-facing copy.

- **<SITE_LOCALE>:** only user-facing website copy in `src/` (and strings you
  add or edit there). Replace `<SITE_LOCALE>` with the project's locale and grammar
  rules (for example: Slovak, feminine form, with diacritics).
- **English:** source code, doc files, AI chat, commits, PRs, and issues.

## Cloud workflow (cloud environments only)

**Setup and services:** follow **`README.md`**. Below is only what differs in the cloud environment.

### Environment

- Use the hosting platform's environment variable and secret injection.
- If env vars fail, notify the user and stop.
- **Do not** create `.env` files in the cloud.
- Configure all vars from `.env.example` in the hosting platform (use placeholders where needed).

### Cloud-only runtime (only if the project uses local services)

- Ensure Docker is running before `docker compose up -d` (see README for services).
- Wait for Postgres `healthy` in `docker compose ps` before migrations or any worker.
- On a fresh Postgres volume, `docker compose down -v` may be needed before first migrate.
- Run a background worker in a separate process if the project has one (see README).
- First Vite SSR request can take ~15–18s; later requests are fast.

### Database migrations (non-interactive, only if the project uses Prisma)

`pnpm db:migrate:dev` prompts for a migration name. In cloud agents and CI, use:

```sh
# Create migration SQL from pending schema changes (no apply)
pnpm exec prisma migrate dev --name <descriptive_snake_case_name> --create-only

# Apply pending migrations
pnpm db:migrate:deploy
```

Use a short, descriptive migration name (e.g. `add_contact_source`, `drop_legacy_column`).
