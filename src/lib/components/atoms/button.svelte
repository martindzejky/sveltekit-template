<script lang="ts" module>
  import { cva, type VariantProps } from 'class-variance-authority';

  export const buttonVariants = cva(
    [
      'inline-flex items-center justify-center gap-2',
      'h-10 rounded-md px-4 font-medium transition',
      'disabled:pointer-events-none disabled:opacity-50',
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
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from 'svelte/elements';

  type Props = ButtonVariants &
    Omit<HTMLButtonAttributes, 'href'> &
    Omit<HTMLAnchorAttributes, 'href'> & {
      href?: string;
    };

  let { intent, href, children, type = 'button', ...rest }: Props = $props();
</script>

{#if href}
  <a {href} {...rest} class={cn(buttonVariants({ intent }), rest.class)}>
    {@render children?.()}
  </a>
{:else}
  <button {type} {...rest} class={cn(buttonVariants({ intent }), rest.class)}>
    {@render children?.()}
  </button>
{/if}
