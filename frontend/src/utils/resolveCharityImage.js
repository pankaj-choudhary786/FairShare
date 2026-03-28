const PLACEHOLDER_SVG = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0d0d0d"/>
        <stop offset="0.55" stop-color="#1a1a1a"/>
        <stop offset="1" stop-color="#6b8f71"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#g)"/>
    <g fill="rgba(255,255,255,0.85)" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" text-anchor="middle">
      <text x="600" y="410" font-size="44" font-weight="700">Fairshare Partner</text>
      <text x="600" y="462" font-size="22" fill="rgba(255,255,255,0.65)">Image coming soon</text>
    </g>
  </svg>
`);

export const CHARITY_IMAGE_FALLBACK = `data:image/svg+xml,${PLACEHOLDER_SVG}`;

// Optional per-charity defaults (used when DB image_url is missing/invalid)
const DEFAULTS_BY_NAME = {
  'The Golf Foundation':
    'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1600&q=80',
  'Macmillan Cancer Support':
    'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80',
  Mind:
    'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?auto=format&fit=crop&w=1600&q=80',
};

// Broad category defaults (used when name isn’t mapped)
const DEFAULTS_BY_CATEGORY = {
  Grassroots:
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1600&q=80', // juniors/sport vibe
  Health:
    'https://images.unsplash.com/photo-1576765608866-5b51046452e4?auto=format&fit=crop&w=1600&q=80', // care/support vibe
  Education:
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
  Community:
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
  Environment:
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
};

// Absolute last “real image” fallback (still context-friendly)
const DEFAULT_GENERIC =
  'https://images.unsplash.com/photo-1520975693411-6b4c25d0c4de?auto=format&fit=crop&w=1600&q=80';

export function getCharityImageCandidates(charity) {
  const candidates = [];

  const url = charity?.image_url?.trim?.();
  if (url) candidates.push(url);

  const name = charity?.name?.trim?.();
  if (name && DEFAULTS_BY_NAME[name]) candidates.push(DEFAULTS_BY_NAME[name]);

  const category = charity?.category?.trim?.();
  if (category && DEFAULTS_BY_CATEGORY[category]) candidates.push(DEFAULTS_BY_CATEGORY[category]);

  candidates.push(DEFAULT_GENERIC);

  // De-dupe while preserving order
  return [...new Set(candidates)];
}

export function resolveCharityImage(charity) {
  return getCharityImageCandidates(charity)[0] || DEFAULT_GENERIC;
}

