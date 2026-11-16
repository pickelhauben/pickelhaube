# lawrence-zhang-site

Lawrence Zhang's personal site: who he is, what he builds, what he thinks, and how to reach him.

Built with [Astro](https://astro.build), plain CSS, and Markdown content. No client-side framework, no analytics, no tracking.

## Run it locally

You need Node.js 22 (see `.nvmrc`; `nvm use` picks it up) and npm.

```bash
npm install
npm run dev
```

Then open <http://localhost:4321>. Draft essays are visible in `dev` and hidden in `build`.

## Scripts

| Command           | What it does                                      |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the dev server with live reload             |
| `npm run build`   | Build the static site into `dist/`                |
| `npm run preview` | Serve the built site locally to check it          |
| `npm run check`   | Type-check `.astro` files and content frontmatter |
| `npm run format`  | Format every file with Prettier                   |

Before every commit: `npm run check && npm run build`. Both should finish with zero errors and warnings.

## Where things live

```
astro.config.mjs       Site URL, sitemap integration
vercel.json            Hosting setting: no trailing slashes
src/
  site.ts              Name, tagline, email, social links (edit these first)
  content.config.ts    The shape (schema) of every content file
  content/
    projects/          One Markdown file per project, shown on /work
    writing/           One Markdown file per essay, shown on /writing
    photography/       One folder per series: index.md plus the photos
    pages/             about.md, now.md, resume.md (hand-edited pages)
  layouts/Base.astro   Wraps every page: <head>, header, footer
  components/          Header, Footer, ProjectCard, Lightbox, ThemeToggle ...
  pages/               One file per route (index.astro is the home page)
  lib/content.ts       Helpers: sorted lists, date formatting, reading time
  lib/og.ts            Draws the link-preview (Open Graph) images
  styles/              tokens.css (colors, type, spacing) and global.css
public/                Files served as-is: favicon.svg, resume.pdf
```

## Everyday edits

**Publish an essay.** Add `src/content/writing/my-title.md`:

```md
---
title: 'My title'
date: 2026-12-01
summary: 'One sentence shown in lists and link previews.'
topics: ['institutions']
draft: false
linkedinUrl: 'https://www.linkedin.com/posts/...' # optional
---

The essay, in Markdown.
```

`draft: true` keeps it out of the built site, the RSS feed and the sitemap.

**Add a project.** Copy any file in `src/content/projects/`, change the frontmatter, and set `order` (lower numbers come first). `featured: true` puts it on the home page (the first three are shown).

**Add a photo series.** Create `src/content/photography/my-series/`, put the photos in it, and add an `index.md` like the one in `series-01/`. Every photo needs `alt` text describing it. Export photos around 3000 px on the long edge; the build makes the smaller AVIF and WebP sizes.

**Update /now.** Edit `src/content/pages/now.md` and change `updated`. The home page "Currently" section reads the same file.

**Change colors or type.** Everything is a custom property in `src/styles/tokens.css`.

## Placeholders to fill

Anything shown on the site as `[[TODO: ...]]`, or marked `TODO(Lawrence)` in the code, is waiting for real content. Find them all with:

```bash
grep -rn "\[\[TODO\|TODO(Lawrence)" src astro.config.mjs
```

| What                                                          | Where                                       |
| ------------------------------------------------------------- | ------------------------------------------- |
| Personal email, LinkedIn URL, GitHub URL, Chinese name (v1.1) | `src/site.ts`                               |
| Identity line and short story: approve or rewrite             | `src/pages/index.astro`                     |
| Full story, values, what he is looking for                    | `src/content/pages/about.md`                |
| Outcomes and write-ups for each project                       | `src/content/projects/*.md`                 |
| First essay text and summary (then set `draft: false`)        | `src/content/writing/`                      |
| Real photos, alt text and a statement                         | `src/content/photography/series-01/`        |
| Resume text                                                   | `src/content/pages/resume.md`               |
| Resume PDF, with no phone number                              | `public/resume.pdf` (the link then appears) |
| Confirm the /now list                                         | `src/content/pages/now.md`                  |
| Production domain                                             | `site` in `astro.config.mjs`                |

Never put on the site: phone number, home address, GPA, student ID.

## Deployment (Vercel)

The site is fully static. Vercel builds it on every push.

### One-time setup

1. **Push the repo to GitHub.** Create an empty public repository (for example `lawrence-zhang-site`), then:

   ```bash
   git remote add origin git@github.com:<your-username>/lawrence-zhang-site.git
   ```

   ```bash
   git push -u origin main
   ```

2. **Import it in Vercel.** At <https://vercel.com/new>, choose the GitHub repository. Vercel detects Astro; keep the defaults:

   | Setting          | Value           |
   | ---------------- | --------------- |
   | Framework preset | Astro           |
   | Build command    | `npm run build` |
   | Output directory | `dist`          |
   | Node.js version  | 22.x            |

3. **Production branch.** In Project Settings → Git, the production branch should be `main`. Every push to `main` deploys to production. Every pull request gets its own preview URL, posted as a comment on the pull request.

4. **Set the real URL.** Once you know the address (the `*.vercel.app` one, or your own domain), set `site` in `astro.config.mjs` to it and push. Canonical links, the sitemap, the RSS feed and link-preview images all use this value.

### Custom domain

1. Buy the domain from any registrar.
2. In Vercel: Project Settings → Domains → add the domain.
3. At the registrar, add the DNS records Vercel shows (usually an `A` record for the root and a `CNAME` for `www`).
4. Update `site` in `astro.config.mjs` to `https://<your-domain>` and push.

### After each deploy, check

- The home page and one page from each section load on a phone.
- `/rss.xml`, `/sitemap-index.xml` and `/robots.txt` load.
- A made-up address such as `/nope` shows the styled 404 page.
- Paste a page link into LinkedIn's Post Inspector to confirm the preview image.

## Notes on choices

- **Astro version.** The build order asked for Astro 4.x. Astro 4 is end-of-life and `npm audit` reports critical advisories against it, so the site pins the current major instead (see `package.json`). The main visible difference: the content schema lives in `src/content.config.ts` rather than `src/content/config.ts`.
- **Fonts** come from Google Fonts and load without blocking the first paint; system fonts show until they arrive.
- **Dependencies** beyond Astro: `@astrojs/rss`, `@astrojs/sitemap`, `sharp` (image processing), and dev tools (`@astrojs/check`, `typescript`, `prettier`, `prettier-plugin-astro`).
