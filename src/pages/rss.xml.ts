/**
 * /rss.xml: a feed of published essays, so readers can subscribe.
 */
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../site';
import { getPublishedWriting } from '../lib/content';

export async function GET(context: APIContext) {
  const essays = await getPublishedWriting();
  return rss({
    title: `${site.name} · Writing`,
    description: 'Essays and notes by Lawrence Zhang.',
    site: context.site!,
    items: essays.map((essay) => ({
      title: essay.data.title,
      pubDate: essay.data.date,
      description: essay.data.summary,
      link: `/writing/${essay.id}`,
    })),
    // Match astro.config's trailingSlash: 'never' so feed links are canonical.
    trailingSlash: false,
    customData: '<language>en-us</language>',
  });
}
