/**
 * /og/<route>.png: one Open Graph image per page, drawn at build time.
 * The Base layout points each page's og:image at the file matching its URL,
 * e.g. /work/esa uses /og/work/esa.png and the home page uses /og/index.png.
 */
import type { APIContext } from 'astro';
import { site } from '../../site';
import { getProjects, getPublishedWriting } from '../../lib/content';
import { renderOgImage } from '../../lib/og';

export async function getStaticPaths() {
  // Fixed pages: route, title on the image, and the small label above it.
  const pages: { route: string; title: string; label: string }[] = [
    { route: 'index', title: site.name, label: 'Economics · Photography · Institutions' },
    { route: 'about', title: 'About', label: site.name },
    { route: 'work', title: 'Work', label: site.name },
    { route: 'writing', title: 'Writing', label: site.name },
    { route: 'photography', title: 'Photography', label: site.name },
    { route: 'now', title: 'Now', label: site.name },
    { route: 'contact', title: 'Contact', label: site.name },
    { route: 'resume', title: 'Resume', label: site.name },
  ];

  // One image per project and per published essay.
  for (const project of await getProjects()) {
    pages.push({
      route: `work/${project.id}`,
      title: project.data.title,
      label: `${site.name} · Work`,
    });
  }
  for (const essay of await getPublishedWriting()) {
    pages.push({
      route: `writing/${essay.id}`,
      title: essay.data.title,
      label: `${site.name} · Writing`,
    });
  }

  return pages.map(({ route, title, label }) => ({ params: { route }, props: { title, label } }));
}

export async function GET({ props }: APIContext<{ title: string; label: string }>) {
  const png = await renderOgImage(props.title, props.label);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
