# Design — visual language

> **Template skeleton.** Fill the sections below as the project's visual system
> grows. This is the source of truth for the **how**: tokens, typography, layout,
> component contracts, and accessibility. Keep it in sync with `src/app.css`.
>
> **Rules:**
>
> - Visual changes ship in the same PR as the matching `DESIGN.md` update.
> - If code and `DESIGN.md` disagree, **trust the code** and fix the doc in the
>   same change.
> - Agents doing UI work read `BRAND.md` first, then this file.

## Tokens → `src/app.css`

All design tokens are declared in the `@theme { }` block of `src/app.css` and are
exposed as Tailwind utilities. The base template ships a **neutral** set; replace
the values per project (and check them against `BRAND.md`).

> Note: `src/app.css` resets Tailwind's default palette and fonts
> (`--color-*: initial; --font-*: initial;`) so the project owns every token.
> Only the tokens listed below exist as utilities — add more as needed.

### Colors

| Token                   | Default   | Utility examples                             |
| ----------------------- | --------- | -------------------------------------------- |
| `--color-background`    | `#ffffff` | `bg-background`                              |
| `--color-surface`       | `#f8fafc` | `bg-surface`                                 |
| `--color-border`        | `#e2e8f0` | `border-border`                              |
| `--color-foreground`    | `#0f172a` | `text-foreground`                            |
| `--color-muted`         | `#64748b` | `text-muted`                                 |
| `--color-accent`        | `#2563eb` | `bg-accent`, `text-accent`, `outline-accent` |
| `--color-accent-dark`   | derived   | `hover:bg-accent-dark`                       |
| `--color-accent-darker` | derived   | `active:bg-accent-darker`                    |
| `--color-error`         | `#dc2626` | `bg-error`, `text-error`                     |
| `--color-success`       | `#16a34a` | `bg-success`, `text-success`                 |

`*-dark` / `*-darker` accents are derived with `color-mix(in oklch, …, black N%)`
so hover/active shades track the base accent automatically.

### Layout sizes

| Token                | Default  | Utility        | Use                        |
| -------------------- | -------- | -------------- | -------------------------- |
| `--container-main`   | `1280px` | `max-w-main`   | normal page width          |
| `--container-medium` | `960px`  | `max-w-medium` | medium content             |
| `--container-small`  | `640px`  | `max-w-small`  | narrow strips, prose, CTAs |

The root layout (`src/routes/+layout.svelte`) is a `min-h-dvh grid-rows-[auto_1fr_auto]`
with `header / main / footer`.

## Typography

- `--font-main`: system font stack by default. Swap to a webfont via `@fontsource`
  imports in `src/app.css` and repoint this token (see `TEMPLATE.md` §4.2).
- `--font-heading`: defaults to `--font-main`; headings use `font-heading`.
- Fluid base size via `clamp()` in `@layer base` (16px → 20px between 640px and
  1280px viewports).
- _Add the project's text-role catalog (display, heading levels, body, captions)._

## Layout & composition

_Describe page composition patterns: block rhythm, spacing scale, column behavior,
and any reusable section layouts the project standardizes on._

## Component contracts

Reusable components live in `src/lib/components/` (group as `atoms/`, `molecules/`,
`layout/`, `organisms/` as complexity grows). Document each component's visual
contract here; props and class arrays stay in the source.

_The base template ships only a minimal `organisms/header.svelte` and
`organisms/footer.svelte` for the layout shell. List real components here as you
add them._

## Focus, motion & accessibility

The base template establishes globally useful defaults in `src/app.css`; keep them.

- **Focus (keyboard-first):** a transparent baseline outline on all focusable
  elements lets the color transition smoothly; `:focus-visible` shows the accent
  outline; non-keyboard focus is suppressed via `:focus:not(:focus-visible)`.
  Components that pair hover + focus colors should override `focus-visible:*` to
  mirror the hover state.
- **Motion:** wrap transforms with `motion-safe:` and pair with
  `motion-reduce:transition-none`. Honor `prefers-reduced-motion` everywhere.
- **Accessibility:** decorative icons/images use `aria-hidden="true"` / `alt=""`;
  interactive controls expose proper ARIA; every input labels itself.

## Imagery

- Use SvelteKit's `enhanced:img` for raster assets (source as `webp`).
- Meaningful `alt`; decorative images use `alt=""`.
- _Document framing conventions (radii, borders) per project._
