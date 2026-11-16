/**
 * Draws the Open Graph image (the picture shown when a link is shared).
 * Runs only at build time. It uses sharp, the same image library Astro
 * uses for photos, so no extra dependency is needed.
 */
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 96;

// Colors match the light theme in src/styles/tokens.css.
const BG = '#fbfaf8';
const TEXT = '#1c1b19';
const MUTED = '#5f5c56';
const ACCENT = '#9a4a1e';

// Font files live in the repo so the image looks the same on any build machine.
// The build always runs from the project root, so process.cwd() is that root.
const FONT_DIR = path.join(process.cwd(), 'src/assets/fonts');
const SERIF = path.join(FONT_DIR, 'SourceSerif4-Medium.ttf');
const SANS = path.join(FONT_DIR, 'Inter-Medium.ttf');

/** Escape characters that have a special meaning in Pango markup. */
function escapeMarkup(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Render one block of text to a transparent PNG, wrapped to `width` pixels. */
async function renderText(
  text: string,
  font: string,
  fontfile: string,
  color: string,
  width: number,
) {
  return sharp({
    text: {
      text: `<span foreground="${color}">${escapeMarkup(text)}</span>`,
      font,
      fontfile,
      width,
      rgba: true, // needed for colored text
      dpi: 72, // at 72 dpi, font sizes are in pixels
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
}

/**
 * Build a 1200×630 PNG with a small label (e.g. "Lawrence Zhang · Work")
 * above a large serif title.
 */
export async function renderOgImage(title: string, label: string): Promise<Buffer> {
  const textWidth = WIDTH - MARGIN * 2;
  // Long titles get a smaller size so they never run off the image.
  const titleSize = title.length > 60 ? 56 : 72;

  const labelImage = await renderText(label, 'Inter Medium 30', SANS, MUTED, textWidth);
  const titleImage = await renderText(
    title,
    `Source Serif 4 Medium ${titleSize}`,
    SERIF,
    TEXT,
    textWidth,
  );

  // Center the label + title block vertically.
  const gap = 28;
  const blockHeight = labelImage.info.height + gap + titleImage.info.height;
  const top = Math.max(MARGIN / 2, Math.round((HEIGHT - blockHeight) / 2));

  // A thin accent strip along the bottom edge.
  const strip = await sharp({
    create: { width: WIDTH, height: 12, channels: 4, background: ACCENT },
  })
    .png()
    .toBuffer();

  return sharp({ create: { width: WIDTH, height: HEIGHT, channels: 4, background: BG } })
    .composite([
      { input: labelImage.data, left: MARGIN, top },
      { input: titleImage.data, left: MARGIN, top: top + labelImage.info.height + gap },
      { input: strip, left: 0, top: HEIGHT - 12 },
    ])
    .png()
    .toBuffer();
}
