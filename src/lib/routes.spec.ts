import { describe, expect, it } from 'vitest';
import { parseRoute, routePath, type Route } from './routes';

const BASE = '/time-accumulator/';

describe('parseRoute', () => {
  it.each<[string, Route]>([
    ['/time-accumulator/', { kind: 'home' }],
    ['/time-accumulator', { kind: 'home' }],
    ['/time-accumulator/activity', { kind: 'activity' }],
    ['/time-accumulator/activity/', { kind: 'activity' }],
    ['/time-accumulator/pool', { kind: 'pools' }],
    ['/time-accumulator/pool/', { kind: 'pools' }],
    ['/time-accumulator/pool/deep-work', { kind: 'pool', slug: 'deep-work' }],
    ['/time-accumulator/pool/deep-work/json', { kind: 'pool-json', slug: 'deep-work' }],
    ['/time-accumulator/pool/deep-work/csv/', { kind: 'pool-csv', slug: 'deep-work' }],
    ['/time-accumulator/pool/%E6%97%A5%E6%9C%AC', { kind: 'pool', slug: '日本' }],
    ['/time-accumulator/pool/json', { kind: 'log-json' }],
    ['/time-accumulator/pool/csv/', { kind: 'log-csv' }],
    ['/time-accumulator/pool/json-2', { kind: 'pool', slug: 'json-2' }],
  ])('%s', (path, route) => {
    expect(parseRoute(path, BASE)).toEqual(route);
  });

  it.each([
    '/time-accumulator/pools',
    '/time-accumulator/activity/x',
    '/time-accumulator/pool/a/xml',
    '/time-accumulator/pool/a/json/extra',
    '/time-accumulator/pool/%E0%A4%A',
    '/time-accumulatorx/',
    '/pool/gym',
  ])('rejects %s', path => {
    expect(parseRoute(path, BASE)).toBeNull();
  });
});

describe('routePath', () => {
  it('round-trips every route kind', () => {
    const routes: Route[] = [
      { kind: 'home' },
      { kind: 'activity' },
      { kind: 'pools' },
      { kind: 'log-json' },
      { kind: 'log-csv' },
      { kind: 'pool', slug: '日本' },
      { kind: 'pool-json', slug: 'deep-work' },
      { kind: 'pool-csv', slug: 'deep-work' },
    ];
    for (const route of routes) {
      expect(parseRoute(routePath(route, BASE), BASE)).toEqual(route);
    }
    expect(routePath({ kind: 'pool-json', slug: 'deep-work' }, BASE)).toBe(
      '/time-accumulator/pool/deep-work/json'
    );
  });
});
