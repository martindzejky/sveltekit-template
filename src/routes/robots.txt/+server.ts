import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
  const origin = event.url.origin;

  const body = [
    //
    'User-agent: *',
    'Disallow:',
    `Sitemap: ${origin}/sitemap.xml`,
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
