/** URL-safe slug from a pool name: "Déjà Vu, Inc." → "deja-vu-inc".
 *  Letters and digits of any script survive; everything else collapses
 *  to single hyphens. */
export const slugify = (name: string): string =>
  name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

/** Taken by the complete-log routes /pool/json and /pool/csv. */
export const RESERVED_SLUGS = ['json', 'csv'];

/** pool id → unique slug, derived from names in pool order. A name with no
 *  usable characters becomes "pool"; repeats (and reserved words) get "-2",
 *  "-3", … */
export const poolSlugs = (pools: Pool[]): Map<string, string> => {
  const taken = new Set<string>(RESERVED_SLUGS);
  const slugs = new Map<string, string>();
  for (const pool of pools) {
    const base = slugify(pool.name) || 'pool';
    let slug = base;
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
    taken.add(slug);
    slugs.set(pool.id, slug);
  }
  return slugs;
};
