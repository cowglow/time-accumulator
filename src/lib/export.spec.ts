import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  EXPORT_SCHEMA,
  POOL_SCHEMA,
  buildExportDocument,
  buildPoolDocument,
  buildPoolNotFound,
  exportFileName,
  toCsv,
  toJson,
} from './export';

const pools: Pool[] = [
  { id: 'p1', name: 'Deep work' },
  { id: 'p2', name: 'Says "hi", then\nleaves' },
  { id: 'p3', name: '=HYPERLINK("x")' },
];

const entries: TimeEntry[] = [
  { id: 'e2', poolId: 'p2', timeIn: '1700003600', timeOut: '1700004200', state: 'counted' },
  { id: 'e1', poolId: 'p1', timeIn: '1700000000', timeOut: '1700001800', state: 'omitted' },
  { id: 'e3', poolId: null, timeIn: '1700007200', timeOut: '1700007260', state: 'counted' },
  { id: 'e4', poolId: 'p3', timeIn: '1700010000', timeOut: '1700010001', state: 'counted' },
];

const NOW = new Date('2026-11-27T12:00:00.000Z');
const SLUGS = new Map([
  ['p1', 'deep-work'],
  ['p2', 'says-hi-then-leaves'],
  ['p3', 'hyperlink-x'],
]);

describe('buildExportDocument', () => {
  const doc = buildExportDocument(pools, SLUGS, entries, false, NOW);

  it('lists pools with their slug and UI path', () => {
    expect(buildExportDocument(pools, SLUGS, [], false, NOW, '/b/').pools[0]).toEqual({
      id: 'p1',
      name: 'Deep work',
      slug: 'deep-work',
      path: '/b/pool/deep-work',
    });
  });

  it('stamps schema, version and export time', () => {
    expect(doc.schema).toBe(EXPORT_SCHEMA);
    expect(doc.version).toBe(1);
    expect(doc.exportedAt).toBe('2026-11-27T12:00:00.000Z');
  });

  it('sorts entries chronologically and resolves pool names', () => {
    expect(doc.entries.map(e => e.id)).toEqual(['e1', 'e2', 'e3', 'e4']);
    expect(doc.entries[0]).toEqual({
      id: 'e1',
      poolId: 'p1',
      poolName: 'Deep work',
      state: 'omitted',
      start: '2023-11-14T22:13:20.000Z',
      end: '2023-11-14T22:43:20.000Z',
      startUnix: 1700000000,
      endUnix: 1700001800,
      durationSeconds: 1800,
    });
  });

  it('keeps legacy untagged entries with a null pool', () => {
    expect(doc.entries[2]).toMatchObject({ poolId: null, poolName: null });
  });

  it('includes the running timer separately from entries', () => {
    expect(doc.running).toBeNull();
    const live = buildExportDocument(pools, SLUGS, [], { poolId: 'p1', timestamp: '1700000000' }, NOW);
    expect(live.running).toEqual({
      poolId: 'p1',
      poolName: 'Deep work',
      start: '2023-11-14T22:13:20.000Z',
      startUnix: 1700000000,
    });
    expect(live.entries).toEqual([]);
  });

  it('round-trips through JSON', () => {
    expect(JSON.parse(toJson(doc))).toEqual(doc);
  });
});

describe('toCsv', () => {
  const csv = toCsv(buildExportDocument(pools, SLUGS, entries, false, NOW).entries);
  const lines = csv.replace(/^\uFEFF/, '').split('\r\n');

  it('starts with a UTF-8 BOM and a header row, ending in CRLF', () => {
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(lines[0]).toBe(
      'id,poolId,poolName,state,start,end,startUnix,endUnix,durationSeconds'
    );
    expect(csv.endsWith('\r\n')).toBe(true);
  });

  it('omits the BOM for text shown in the browser', () => {
    const plain = toCsv(buildExportDocument(pools, SLUGS, entries, false, NOW).entries, { bom: false });
    expect(plain.startsWith('id,')).toBe(true);
  });

  it('writes one row per entry', () => {
    expect(lines[1]).toBe(
      'e1,p1,Deep work,omitted,2023-11-14T22:13:20.000Z,2023-11-14T22:43:20.000Z,1700000000,1700001800,1800'
    );
  });

  it('quotes fields with quotes, commas or line breaks', () => {
    expect(csv).toContain('"Says ""hi"", then\nleaves"');
  });

  it('leaves null pool fields empty', () => {
    expect(csv).toContain('\r\ne3,,,counted,');
  });

  it('neutralises spreadsheet formulas in text fields', () => {
    expect(csv).toContain(`"'=HYPERLINK(""x"")"`);
  });
});

describe('exportFileName', () => {
  it('dates the file by local day', () => {
    expect(exportFileName('csv', new Date(2026, 0, 5, 23, 59))).toBe(
      'time-accumulator-2026-01-05.csv'
    );
  });

  it('names the pool when given a slug', () => {
    expect(exportFileName('csv', new Date(2026, 0, 5), 'deep-work')).toBe(
      'time-accumulator-deep-work-2026-01-05.csv'
    );
  });
});

describe('buildPoolDocument', () => {
  // Thursday 2026-11-26 15:30 local
  const now = new Date(2026, 10, 26, 15, 30);
  const at = (d: number, h: number) => Math.floor(new Date(2026, 10, d, h).getTime() / 1000);
  const entry = (id: string, d: number, h: number, mins: number, state: PoolEntryState = 'counted', poolId = 'p1'): TimeEntry => ({
    id, poolId, timeIn: String(at(d, h)), timeOut: String(at(d, h) + mins * 60), state,
  });
  const list = [
    entry('old', 2, 9, 60), // this month, not this week
    entry('mon', 23, 9, 30), // this week
    entry('today', 26, 9, 15), // today
    entry('omit', 26, 11, 45, 'omitted'),
    entry('other', 26, 12, 99, 'counted', 'p2'),
    { id: 'before', poolId: 'p1', timeIn: '1000', timeOut: '1600', state: 'counted' as const },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });
  afterEach(() => vi.useRealTimers());

  it('describes one pool with its own entries and counted totals per range', () => {
    const doc = buildPoolDocument(pools[0], 'deep-work', list, false, now);
    expect(doc.schema).toBe(POOL_SCHEMA);
    expect(doc.pool).toEqual({ id: 'p1', name: 'Deep work', slug: 'deep-work' });
    expect(doc.entries.map(e => e.id)).toEqual(['before', 'old', 'mon', 'today', 'omit']);
    expect(doc.totals).toEqual({
      today: 15 * 60,
      week: (30 + 15) * 60,
      month: (60 + 30 + 15) * 60,
      all: (60 + 30 + 15) * 60 + 600,
    });
    expect(doc.running).toBeNull();
  });

  it('reports the running timer only for its own pool', () => {
    const start = String(Math.floor(now.getTime() / 1000) - 90);
    const mine = buildPoolDocument(pools[0], 'deep-work', [], { poolId: 'p1', timestamp: start }, now);
    expect(mine.running).toMatchObject({ elapsedSeconds: 90, startUnix: Number(start) });
    const theirs = buildPoolDocument(pools[0], 'deep-work', [], { poolId: 'p2', timestamp: start }, now);
    expect(theirs.running).toBeNull();
  });
});

describe('buildPoolNotFound', () => {
  const slugs = new Map([
    ['p1', 'deep-work'],
    ['p2', 'says-hi'],
  ]);
  const two = pools.slice(0, 2);

  it('names the valid slugs when one is unknown', () => {
    expect(buildPoolNotFound('nope', two, slugs, '/b/')).toEqual({
      error: 'pool-not-found',
      slug: 'nope',
      pools: [
        { name: 'Deep work', slug: 'deep-work', path: '/b/pool/deep-work/json' },
        { name: 'Says "hi", then\nleaves', slug: 'says-hi', path: '/b/pool/says-hi/json' },
      ],
    });
  });
});
