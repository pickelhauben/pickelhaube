/**
 * /robots.txt: allow all crawlers and point them at the sitemap.
 * Generated (rather than a static file) so the sitemap URL always matches
 * the `site` setting in astro.config.mjs.
 */
import type { APIContext } from 'astro';

export function GET({ site }: APIContext) {
  const sitemap = new URL('/sitemap-index.xml', site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
