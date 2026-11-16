/**
 * Small helpers for reading content collections.
 * Pages import these instead of repeating the same sorting and filtering.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

/** Published essays, newest first. Drafts are hidden in production builds. */
export async function getPublishedWriting(): Promise<CollectionEntry<'writing'>[]> {
  const all = await getCollection('writing', ({ data }) => {
    // In development, drafts are shown so they can be previewed.
    return import.meta.env.PROD ? !data.draft : true;
  });
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** All projects sorted by their `order` field, lowest first. */
export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** All photo series sorted by their `order` field, lowest first. */
export async function getPhotoSeries(): Promise<CollectionEntry<'photography'>[]> {
  const all = await getCollection('photography');
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** "Nov 15, 2026" style date for lists and bylines. */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC', // dates in frontmatter have no time, so avoid off-by-one shifts
  });
}

/** Estimated reading time from a Markdown body, at ~220 words per minute. */
export function readingTime(markdown: string | undefined): string {
  const words = (markdown ?? '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

/** "2024–" or "Fall 2025" style date range for a project. */
export function dateRange(start: string, end?: string): string {
  if (!end) return `${start}–`;
  if (end === start) return start;
  return `${start}–${end}`;
}
