import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { RangeChips } from './RangeChips';
import { rangeStartSeconds, type RangeKey } from '../lib/date-range';
import { formatDurationShort } from '../lib/format-entry';
import './PoolsList.css';

interface PoolsListProps {
  onOpenPool: (poolId: string) => void;
}

export const PoolsList: React.FC<PoolsListProps> = ({ onOpenPool }) => {
  const { pools, entries, poolTotalMs, addPool } = useAppState();
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
      {totals.length === 0 ? (
        <p className="pools-list__empty">No pools yet — start one above.</p>
      ) : (
        <div className="pools-list__cards">
          {totals.map(({ pool, totalMs }) => (
            <button
              key={pool.id}
              type="button"
              className="pool-card"
              onClick={() => onOpenPool(pool.id)}
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
      )}
      {untaggedCount > 0 && (
        <p className="pools-list__unsorted">
          {untaggedCount} untagged {untaggedCount === 1 ? 'entry isn’t' : 'entries aren’t'}{' '}
          counted in any pool — see Activity.
        </p>
      )}
    </div>
  );
};
