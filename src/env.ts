import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  CANONICAL_ORIGIN: {
    description: 'Optional production origin for HTTPS and www/apex redirects.',
    schema: (value) => {
      if (!value) return undefined;

      const url = new URL(value);
      if (
        url.protocol !== 'https:' ||
        url.pathname !== '/' ||
        url.search ||
        url.hash ||
        url.username ||
        url.password
      ) {
        throw new Error(
          'CANONICAL_ORIGIN must be an HTTPS origin without a path, query, fragment, or credentials',
        );
      }

      return url.origin;
    },
  },
});
