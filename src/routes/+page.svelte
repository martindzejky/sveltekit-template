<script lang="ts">
  import { Github, Rocket } from '@lucide/svelte';
</script>

<svelte:head>
  <title>SvelteKit Template</title>
  <meta
    name="description"
    content="An opinionated SvelteKit starter template."
  />
</svelte:head>

<section
  class="mx-auto flex max-w-medium flex-col items-center gap-6 px-4 py-16 text-center"
>
  <span
    class="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted"
  >
    <Rocket size={16} aria-hidden="true" />
    SvelteKit project template
  </span>

  <h1 class="text-4xl font-bold text-balance">
    An opinionated SvelteKit starter
  </h1>

  <p class="max-w-small text-lg text-pretty text-muted">
    This is the dummy app shipped with the template. Replace this content with
    your project. The tooling, configs, and conventions are ready to go.
  </p>

  <div class="flex flex-wrap items-center justify-center gap-3">
    <a
      href="/TEMPLATE.md"
      class="inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 font-medium text-background transition hover:bg-accent-dark focus-visible:bg-accent-dark focus-visible:outline-accent-dark motion-safe:hover:scale-105 motion-safe:active:scale-95"
    >
      Read the template guide
    </a>
    <a
      href="https://github.com/martindzejky/sveltekit-template"
      class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 font-medium transition hover:bg-surface focus-visible:bg-surface motion-safe:hover:scale-105 motion-safe:active:scale-95"
    >
      <Github size={18} aria-hidden="true" />
      View on GitHub
    </a>
  </div>
</section>
