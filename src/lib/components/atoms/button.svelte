<script lang="ts" module>
  import { cva, type VariantProps } from 'class-variance-authority';

  export const buttonVariants = cva(
    [
      'inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 font-medium transition',
      'motion-safe:hover:scale-105 motion-safe:active:scale-95',
    ],
    {
      variants: {
        intent: {
          primary:
            'bg-accent text-background hover:bg-accent-dark focus-visible:bg-accent-dark focus-visible:outline-accent-dark',
          secondary:
            'border border-border bg-background hover:bg-surface focus-visible:bg-surface',
        },
      },
      defaultVariants: {
        intent: 'primary',
      },
    },
  );

  export type ButtonVariants = VariantProps<typeof buttonVariants>;
</script>

<script lang="ts">
  import { cn } from '$lib/cn';
  import type { Snippet } from 'svelte';
  import type {
    ClassValue,
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from 'svelte/elements';

  type Props = ButtonVariants & {
    href?: string;
    class?: ClassValue;
    children: Snippet;
    type?: HTMLButtonAttributes['type'];
  } & Omit<HTMLAnchorAttributes, 'class' | 'href'> &
    Omit<HTMLButtonAttributes, 'class' | 'href' | 'type'>;

  let {
    intent,
    href,
    class: className,
    children,
    type = 'button',
    ...rest
  }: Props = $props();
</script>

{#if href}
  <a {href} class={cn(buttonVariants({ intent }), className)} {...rest}>
    {@render children()}
  </a>
{:else}
  <button {type} class={cn(buttonVariants({ intent }), className)} {...rest}>
    {@render children()}
  </button>
{/if}
