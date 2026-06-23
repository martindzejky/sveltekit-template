import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // https://svelte.dev/docs/kit/integrations
  preprocess: vitePreprocess(),

  kit: {
    // https://svelte.dev/docs/kit/adapters
    adapter: adapter(),
  },
};

export default config;
