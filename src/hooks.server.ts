import { dev } from '$app/env';
import { CANONICAL_ORIGIN } from '$app/env/private';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';

const canonical = CANONICAL_ORIGIN ? new URL(CANONICAL_ORIGIN) : undefined;

export const handle: Handle = async ({ event, resolve }) => {
  if (dev || !canonical) return resolve(event);

  const hostname = canonical.hostname;
  const alternateHostname = hostname.startsWith('www.')
    ? hostname.slice(4)
    : `www.${hostname}`;

  if (
    (event.url.hostname === hostname ||
      event.url.hostname === alternateHostname) &&
    event.url.origin !== canonical.origin
  ) {
    const target = new URL(event.url);
    target.protocol = canonical.protocol;
    target.host = canonical.host;
    return redirect(308, target, { external: [canonical.origin] });
  }

  return resolve(event);
};
