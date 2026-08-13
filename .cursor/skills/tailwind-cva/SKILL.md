---
name: tailwind-cva
description: Style Svelte UI with Tailwind, cn(), and CVA. Use when writing or editing component classes, variants, class props, or conditional Tailwind.
---

# Tailwind, cn(), and CVA

Pick the smallest tool that works.

1. **Static `class="..."`** for one-off layout and copy. No helper.
2. **`cn()`** from `$lib/cn` for conditionals, and whenever a `class` prop might
   collide with existing utilities (`p-2` vs `p-4`).
3. **`cva()`** for reusable components with named variants (intent, size). Define
   it in `<script module>`, type props with `VariantProps`, merge last with `cn()`.

Canonical example: `src/lib/components/atoms/button.svelte`.

```svelte
class={cn(buttonVariants({ intent }), isPending && 'opacity-70', className)}
```

Order is always: base → variants → state conditionals → consumer `class`.

## Svelte note

Svelte 5 `class={[...]}` uses clsx. It does **not** run `tailwind-merge`. Use
`cn()` when utilities can conflict. Leave plain arrays for non-conflicting
conditionals if you want.

## Don't

- Concatenate Tailwind names (`bg-${color}-500`). The compiler will drop them.
- Reach for `cva` for a single boolean. `cn('base', open && 'translate-x-0')`
  is enough.
- Pass `class` into `cva()`. Merge with `cn(..., className)` last.
- Duplicate the global focus outline from `src/app.css` on every component.
