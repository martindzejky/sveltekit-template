<script lang="ts">
  const year = new Date().getFullYear();
</script>

<div
  class="mx-auto flex max-w-main flex-col items-center gap-1 px-4 py-8 text-center text-sm text-muted"
>
  <p>&copy; {year} SvelteKit Template</p>
  <p>
    Built with
    <a
      href="https://kit.svelte.dev"
      class="rounded-sm text-accent underline underline-offset-4"
    >
      SvelteKit
    </a>
  </p>
</div>
