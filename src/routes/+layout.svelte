<script lang="ts">
  import '../app.css';

  import Footer from '$lib/components/organisms/footer.svelte';
  import Header from '$lib/components/organisms/header.svelte';

  const { children } = $props();
</script>

<div class="grid min-h-dvh grid-cols-1 grid-rows-[auto_1fr_auto]">
  <header class="border-b border-border">
    <Header />
  </header>

  <main class="flex flex-col">
    {@render children()}
  </main>

  <footer class="border-t border-border">
    <Footer />
  </footer>
</div>
