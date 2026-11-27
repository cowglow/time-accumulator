/** URL routes, all under the deploy base (BASE_URL, "/time-accumulator/"):
 *
 *    /                    Home (timer)
 *    /activity            Activity log
 *    /pool                Pools list
 *    /pool/json           The complete log as JSON, rendered as the page
 *    /pool/csv            Downloads the complete log as CSV, then shows Pools
 *    /pool/{slug}         One pool
 *    /pool/{slug}/json    That pool's JSON document, rendered as the page
 *    /pool/{slug}/csv     Downloads that pool's entries as CSV, then shows
 *                         the pool
 *
 *  GitHub Pages has no server routing, so the build copies index.html to
 *  404.html and the app routes from location.pathname. */

export const BASE_PATH = import.meta.env.BASE_URL;

export type Route =
  | { kind: 'home' }
  | { kind: 'activity' }
  | { kind: 'pools' }
  | { kind: 'log-json' }
  | { kind: 'log-csv' }
  | { kind: 'pool'; slug: string }
  | { kind: 'pool-json'; slug: string }
  | { kind: 'pool-csv'; slug: string };

/** Routes that render a raw document instead of the app UI. */
export type DataRoute = Extract<
  Route,
  { kind: 'pool-json' | 'pool-csv' | 'log-json' | 'log-csv' }
>;

const DATA_KINDS = new Set<Route['kind']>(['pool-json', 'pool-csv', 'log-json', 'log-csv']);

export const isDataRoute = (route: Route): route is DataRoute => DATA_KINDS.has(route.kind);

/** Parses a pathname; null for anything that isn't a known route. */
export const parseRoute = (pathname: string, base: string = BASE_PATH): Route | null => {
  const root = base.replace(/\/+$/, '');
  if (pathname !== root && !pathname.startsWith(`${root}/`)) return null;
  const parts = pathname
    .slice(root.length)
    .split('/')
    .filter(Boolean);

  let decoded: string[];
  try {
    decoded = parts.map(decodeURIComponent);
  } catch {
    return null;
  }
  const [first, slug, format, ...extra] = decoded;

  if (decoded.length === 0) return { kind: 'home' };
  if (first === 'activity' && decoded.length === 1) return { kind: 'activity' };
  if (first !== 'pool' || extra.length > 0) return null;
  if (slug === undefined) return { kind: 'pools' };
  // "json"/"csv" are reserved slugs (see slug.ts), so these never shadow a pool
  if (format === undefined && slug === 'json') return { kind: 'log-json' };
  if (format === undefined && slug === 'csv') return { kind: 'log-csv' };
  if (format === undefined) return { kind: 'pool', slug };
  if (format === 'json') return { kind: 'pool-json', slug };
  if (format === 'csv') return { kind: 'pool-csv', slug };
  return null;
};

export const routePath = (route: Route, base: string = BASE_PATH): string => {
  switch (route.kind) {
    case 'home':
      return base;
    case 'activity':
      return `${base}activity`;
    case 'pools':
      return `${base}pool`;
    case 'log-json':
      return `${base}pool/json`;
    case 'log-csv':
      return `${base}pool/csv`;
    case 'pool':
      return `${base}pool/${encodeURIComponent(route.slug)}`;
    case 'pool-json':
      return `${base}pool/${encodeURIComponent(route.slug)}/json`;
    case 'pool-csv':
      return `${base}pool/${encodeURIComponent(route.slug)}/csv`;
  }
};

export const sameRoute = (a: Route, b: Route) => routePath(a, '/') === routePath(b, '/');
