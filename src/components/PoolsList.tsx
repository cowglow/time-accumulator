import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { useRouter } from '../contexts/RouterContext';
import { RangeChips } from './RangeChips';
import { rangeStartSeconds, type RangeKey } from '../lib/date-range';
import { formatDurationShort } from '../lib/format-entry';
import { downloadLogCsv } from '../lib/export';
import { routePath } from '../lib/routes';
import './PoolsList.css';

export const PoolsList: React.FC = () => {
  const { pools, slugs, entries, running, poolTotalMs, addPool } = useAppState();
  const { navigate } = useRouter();
  const [range, setRange] = React.useState<RangeKey>('week');

  const since = rangeStartSeconds(range);
  const totals = pools.map(pool => ({ pool, totalMs: poolTotalMs(pool.id, since) }));
  const maxTotal = Math.max(1, ...totals.map(t => t.totalMs));
  const untaggedCount = entries.filter(entry => entry.poolId === null).length;


  const handleNewPool = () => {
    const name = window.prompt('Name this pool (e.g. Gym, Deep work, Reading)');
    if (name) addPool(name);
  };

  return (
    <div className="pools-list">
      <div className="pools-list__head">
        <h1>Pools</h1>
        <button type="button" className="pools-list__new" onClick={handleNewPool}>
          + New pool
        </button>
      </div>
      <RangeChips value={range} onChange={setRange} />
      <div className="pools-list__cards">
        {totals.map(({ pool, totalMs }) => (
          <button
            key={pool.id}
            type="button"
            className="pool-card"
            onClick={() => navigate({ kind: 'pool', slug: slugs.get(pool.id)! })}
          >
            <div className="pool-card__top">
              <span className="pool-card__name">{pool.name}</span>
              <span className="pool-card__total">{formatDurationShort(totalMs)}</span>
            </div>
            <div className="pool-card__gauge">
              <i style={{ width: `${Math.round((100 * totalMs) / maxTotal)}%` }} />
            </div>
          </button>
        ))}
      </div>
      {untaggedCount > 0 && (
        <p className="pools-list__unsorted">
          {untaggedCount} untagged {untaggedCount === 1 ? 'entry' : 'entries'} from
          before pools existed — assign {untaggedCount === 1 ? 'it' : 'them'} in Activity.
        </p>
      )}
      <section className="pools-export" aria-labelledby="pools-export-label">
        <div className="section-label" id="pools-export-label">
          Export · complete log · {entries.length.toString().padStart(2, '0')} entries
        </div>
        {/* both always cover the complete log, whatever range is shown above */}
        <div className="pools-export__actions">
          <a
            className="pools-export__button"
            href={routePath({ kind: 'log-json' })}
            target="_blank"
            rel="noreferrer"
            aria-label="Complete log as JSON (opens in a new tab)"
          >
            JSON ↗
          </a>
          <button
            type="button"
            className="pools-export__button"
            onClick={() => downloadLogCsv(pools, slugs, entries, running)}
            aria-label="Download the complete log as CSV"
          >
            CSV ↓
          </button>
        </div>
      </section>
      <a
        className="pools-list__source"
        href="https://github.com/cowglow/time-accumulator"
        target="_blank"
        rel="noreferrer"
      >
        <span>Source</span>
        <span>cowglow/time-accumulator ↗</span>
      </a>
    </div>
  );
};
