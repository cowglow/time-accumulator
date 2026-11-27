/**
 * Export: the stable, documented shapes of the accumulator's data for use
 * outside the app — the complete log as a CSV download, and per-pool JSON
 * and CSV rendered in the browser at {base}pool/{slug}/json and /csv.
 * Every entry is serialised the same way everywhere.
 */

import { rangeStartSeconds, RANGE_KEYS, type RangeKey } from './date-range';
import { routePath } from './routes';

export const EXPORT_SCHEMA = 'time-accumulator/export';
export const EXPORT_VERSION = 1;

export interface ExportEntry {
  id: string;
  /** null only for legacy time from before pools existed */
  poolId: string | null;
  poolName: string | null;
  state: PoolEntryState;
  /** ISO 8601, UTC */
  start: string;
  end: string;
  startUnix: number;
  endUnix: number;
  durationSeconds: number;
}

export interface ExportDocument {
  schema: typeof EXPORT_SCHEMA;
  version: typeof EXPORT_VERSION;
  exportedAt: string;
  pools: { id: string; name: string; slug: string; path: string }[];
  /** the in-progress timer, if any — not yet an entry */
  running: { poolId: string | null; poolName: string | null; start: string; startUnix: number } | null;
  entries: ExportEntry[];
}

const iso = (unixSeconds: number) => new Date(unixSeconds * 1000).toISOString();

const toExportEntry = (
  entry: TimeEntry,
  nameOf: (id: string | null) => string | null
): ExportEntry => {
  const startUnix = parseInt(entry.timeIn, 10);
  const endUnix = parseInt(entry.timeOut, 10);
  return {
    id: entry.id,
    poolId: entry.poolId,
    poolName: nameOf(entry.poolId),
    state: entry.state,
    start: iso(startUnix),
    end: iso(endUnix),
    startUnix,
    endUnix,
    durationSeconds: endUnix - startUnix,
  };
};

const byStart = (a: ExportEntry, b: ExportEntry) => a.startUnix - b.startUnix;

export const buildExportDocument = (
  pools: Pool[],
  slugs: Map<string, string>,
  entries: TimeEntry[],
  running: RunningTimer | false,
  now: Date = new Date(),
  base?: string
): ExportDocument => {
  const names = new Map(pools.map(pool => [pool.id, pool.name]));
  const nameOf = (id: string | null) => (id === null ? null : names.get(id) ?? null);

  return {
    schema: EXPORT_SCHEMA,
    version: EXPORT_VERSION,
    exportedAt: now.toISOString(),
    pools: pools.map(({ id, name }) => {
      const slug = slugs.get(id)!;
      return { id, name, slug, path: routePath({ kind: 'pool', slug }, base) };
    }),
    running: running
      ? {
          poolId: running.poolId,
          poolName: nameOf(running.poolId),
          start: iso(parseInt(running.timestamp, 10)),
          startUnix: parseInt(running.timestamp, 10),
        }
      : null,
    entries: entries.map(entry => toExportEntry(entry, nameOf)).sort(byStart),
  };
};

export const toJson = (doc: unknown): string => `${JSON.stringify(doc, null, 2)}\n`;

/* ---------------------------------------------------------------------- */
/* Per-pool JSON documents                                                 */

export const POOL_SCHEMA = 'time-accumulator/pool';
export const POOL_INDEX_SCHEMA = 'time-accumulator/pools';

export interface PoolDocument {
  schema: typeof POOL_SCHEMA;
  version: 1;
  generatedAt: string;
  pool: { id: string; name: string; slug: string };
  /** this pool's in-progress timer, if it has the running one */
  running: { start: string; startUnix: number; elapsedSeconds: number } | null;
  /** counted (not omitted) completed time per range, in seconds */
  totals: Record<RangeKey, number>;
  entries: ExportEntry[];
}

export const buildPoolDocument = (
  pool: Pool,
  slug: string,
  entries: TimeEntry[],
  running: RunningTimer | false,
  now: Date = new Date()
): PoolDocument => {
  const own = entries
    .filter(entry => entry.poolId === pool.id)
    .map(entry => toExportEntry(entry, () => pool.name))
    .sort(byStart);
  const nowUnix = Math.floor(now.getTime() / 1000);

  const totals = Object.fromEntries(
    RANGE_KEYS.map(key => {
      const since = rangeStartSeconds(key);
      const seconds = own
        .filter(e => e.state === 'counted' && e.endUnix >= since)
        .reduce((sum, e) => sum + e.durationSeconds, 0);
      return [key, seconds];
    })
  ) as Record<RangeKey, number>;

  const startUnix = running && running.poolId === pool.id ? parseInt(running.timestamp, 10) : null;

  return {
    schema: POOL_SCHEMA,
    version: 1,
    generatedAt: now.toISOString(),
    pool: { id: pool.id, name: pool.name, slug },
    running:
      startUnix === null
        ? null
        : { start: iso(startUnix), startUnix, elapsedSeconds: Math.max(0, nowUnix - startUnix) },
    totals,
    entries: own,
  };
};

/** Body for an unknown slug — names the valid ones so it's self-correcting. */
export const buildPoolNotFound = (
  slug: string,
  pools: Pool[],
  slugs: Map<string, string>,
  base?: string
) => ({
  error: 'pool-not-found',
  slug,
  pools: pools.map(pool => {
    const known = slugs.get(pool.id)!;
    return { name: pool.name, slug: known, path: routePath({ kind: 'pool-json', slug: known }, base) };
  }),
});

const CSV_COLUMNS: (keyof ExportEntry)[] = [
  'id',
  'poolId',
  'poolName',
  'state',
  'start',
  'end',
  'startUnix',
  'endUnix',
  'durationSeconds',
];

/** RFC 4180 field: quoted when it holds a comma, quote or line break. Text
 *  that a spreadsheet would run as a formula (=, +, -, @, tab, CR) gets a
 *  leading apostrophe, so a pool named "=HYPERLINK(...)" stays inert. */
const csvField = (value: string | number | null): string => {
  if (value === null) return '';
  if (typeof value === 'number') return String(value);
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

/** One row per entry, CRLF line endings. Downloads get a UTF-8 BOM so Excel
 *  reads non-ASCII pool names correctly; text shown in the browser doesn't. */
export const toCsv = (entries: ExportEntry[], { bom = true }: { bom?: boolean } = {}): string => {
  const rows = [
    CSV_COLUMNS.join(','),
    ...entries.map(entry => CSV_COLUMNS.map(col => csvField(entry[col])).join(',')),
  ];
  return `${bom ? '\uFEFF' : ''}${rows.join('\r\n')}\r\n`;
};

/** "time-accumulator-2026-11-28.csv", or with a pool slug
 *  "time-accumulator-deep-work-2026-11-28.csv". Dated by local day. */
export const exportFileName = (
  extension: 'csv',
  now: Date = new Date(),
  slug?: string
) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const day = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return `time-accumulator-${slug ? `${slug}-` : ''}${day}.${extension}`;
};

/** Hands the browser a file to save. */
export const downloadFile = (fileName: string, content: string, mimeType: string) => {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

/** Downloads one pool's complete log as CSV. */
export const downloadPoolCsv = (
  pool: Pool,
  slug: string,
  entries: TimeEntry[],
  running: RunningTimer | false
) => {
  const doc = buildPoolDocument(pool, slug, entries, running);
  downloadFile(
    exportFileName('csv', new Date(), slug),
    toCsv(doc.entries),
    'text/csv;charset=utf-8'
  );
};

/** Downloads the complete log (every pool) as CSV. */
export const downloadLogCsv = (
  pools: Pool[],
  slugs: Map<string, string>,
  entries: TimeEntry[],
  running: RunningTimer | false
) => {
  const doc = buildExportDocument(pools, slugs, entries, running);
  downloadFile(exportFileName('csv'), toCsv(doc.entries), 'text/csv;charset=utf-8');
};
