# Agent instructions

Read `README.md` first. Use `TEMPLATE.md` when bootstrapping a new project.
Global rules and skills come from [agentfiles](https://github.com/martindzejky/agentfiles).
Keep this file limited to project-specific instructions.

## Code and verification

Run `pnpm fix` and `pnpm check` before finishing. Run `pnpm build` when the change
can affect the production build.

- SvelteKit configuration lives in `vite.config.ts`.
- Use `#lib/*` imports with file extensions, including `#lib/cn.ts`.
- Use `src/lib/components/atoms/button.svelte` as the component reference.
- Put temporary files in `tmp/`.

When adding environment variables, declare them in `src/env.ts` and document them
in `.env.example`. Run `pnpm sync` after changes to regenerate `$app/env/*` exports.

## New projects

Keep `TEMPLATE.md` in this repository. Replace template content and document the
new project's setup in its own `README.md`.

New projects use `BRAND.md` for audience, positioning, and voice, and `DESIGN.md`
for visual rules. Read them in that order before visual work. Keep visual changes
and the matching `DESIGN.md` update together.

If site copy is not English, record the actual locale and grammar rules in the
new project's `AGENTS.md`. Keep code, docs, and tooling in English.
