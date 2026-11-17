// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// `site` is the production URL. It is used to build absolute links for
// Open Graph tags, the sitemap and the RSS feed.
// TODO(Lawrence): replace with the real domain once it is chosen.
export default defineConfig({
  site: 'https://lawrence-zhang-site.vercel.app',
  // Every page has exactly one canonical URL, without a trailing slash.
  // (vercel.json sets `trailingSlash: false` so the host agrees.)
  trailingSlash: 'never',
  // Writes sitemap-index.xml at build time so search engines can find every page.
  integrations: [sitemap()],
});
