import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { useRouter } from '../contexts/RouterContext';
import {
  buildExportDocument,
  buildPoolDocument,
  buildPoolNotFound,
  downloadLogCsv,
  downloadPoolCsv,
  toJson,
} from '../lib/export';
import type { DataRoute } from '../lib/routes';
import './DataView.css';

interface DataViewProps {
  route: DataRoute;
}

/** The data routes. JSON renders the document as the whole page — the
 *  browser-side "endpoint"; CSV downloads the file and then shows the
 *  matching view. Data comes from this browser's localStorage, so it
 *  reflects this device only.
 *    /pool/json, /pool/csv               complete log
 *    /pool/{slug}/json, /pool/{slug}/csv one pool */
export const DataView: React.FC<DataViewProps> = ({ route }) => {
  const { pools, slugs, entries, running } = useAppState();
  const { navigate } = useRouter();
  const slug = route.kind === 'pool-json' || route.kind === 'pool-csv' ? route.slug : null;
  const pool = slug === null ? undefined : pools.find(p => slugs.get(p.id) === slug);
  const isCsv = route.kind === 'pool-csv' || route.kind === 'log-csv';
  const downloaded = React.useRef(false);

  React.useEffect(() => {
    if (isCsv) return;
    document.title = `${slug === null ? 'pool' : `pool/${slug}`}/json · Time Accumulator`;
  }, [isCsv, slug]);

  React.useEffect(() => {
    if (!isCsv || downloaded.current) return;
    downloaded.current = true; // StrictMode re-runs effects; download once
    if (route.kind === 'log-csv') {
      downloadLogCsv(pools, slugs, entries, running);
      navigate({ kind: 'pools' }, { replace: true });
    } else if (pool && slug !== null) {
      downloadPoolCsv(pool, slug, entries, running);
      navigate({ kind: 'pool', slug }, { replace: true });
    } else {
      navigate({ kind: 'pools' }, { replace: true });
    }
  }, [isCsv, route.kind, pool, slug, pools, slugs, entries, running, navigate]);

  if (isCsv) return null;

  let doc: unknown;
  if (route.kind === 'log-json') {
    doc = buildExportDocument(pools, slugs, entries, running);
  } else {
    doc = pool
      ? buildPoolDocument(pool, slug!, entries, running)
      : buildPoolNotFound(slug!, pools, slugs);
  }

  return <pre className="data-view">{toJson(doc)}</pre>;
};
