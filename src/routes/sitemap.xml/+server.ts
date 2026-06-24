import type { RequestHandler } from '@sveltejs/kit';
import * as sitemap from 'super-sitemap';

export const GET: RequestHandler = async (event) => {
  const origin = event.url.origin;

  // Add `paramValues` for dynamic routes and `excludeRoutePatterns` for routes
  // that should not be indexed. See https://github.com/jasongitmail/super-sitemap
  return await sitemap.response({
    origin,
  });
};
