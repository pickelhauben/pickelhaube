/**
 * Content collections.
 *
 * Each collection is a folder of Markdown files under src/content/.
 * The schema (written with zod) describes the frontmatter each file must
 * have, so a typo or missing field fails `npm run check` and `npm run build`
 * instead of silently breaking a page.
 */
import { defineCollection } from 'astro:content';
// Astro re-exports zod. The namespace import avoids a deprecated `z` alias.
import * as z from 'astro/zod';
import { glob } from 'astro/loaders';

/** Projects and roles, shown on /work. One file per project. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      role: z.string(),
      org: z.string(),
      start: z.string(), // free text, e.g. "2024" or "Jun 2025"
      end: z.string().optional(), // omit while the role is current
      summary: z.string(), // one sentence
      outcomes: z.array(z.string()), // concrete results
      tags: z.array(z.string()), // e.g. "leadership", "startup", "consulting", "research"
      featured: z.boolean().default(false),
      order: z.number(), // lower numbers appear first
      cover: image().optional(),
    }),
});

/** Essays and notes, shown on /writing and in the RSS feed. */
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    topics: z.array(z.string()),
    draft: z.boolean().default(false), // drafts never appear in production builds
    linkedinUrl: z.url().optional(),
  }),
});

/**
 * Photo series, shown on /photography.
 * Each series is a folder: src/content/photography/<series>/index.md plus
 * the image files next to it. The folder name becomes the URL slug.
 */
const photography = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/photography',
    // Use the folder name ("series-01") as the id instead of "series-01/index".
    generateId: ({ entry }) => entry.split('/')[0]!,
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.string(),
      statement: z.string(),
      photos: z.array(
        z.object({
          src: image(),
          alt: z.string(),
          caption: z.string().optional(),
        }),
      ),
      order: z.number(),
    }),
});

/**
 * Stand-alone Markdown pages that are edited by hand: /now and /resume.
 * They live in src/content/pages/ so the Markdown body can be rendered
 * with the same styling as essays.
 */
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    updated: z.coerce.date(),
  }),
});

export const collections = { projects, writing, photography, pages };
