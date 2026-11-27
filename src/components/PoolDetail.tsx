import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { useRouter } from '../contexts/RouterContext';
import { useEntrySelection } from '../hooks/useEntrySelection';
import { RangeChips } from './RangeChips';
import { EntryList } from './EntryList';
import { BulkBar } from './BulkBar';
import { EntrySortControl } from './EntrySortControl';
import { DEFAULT_SORT, sortEntries, type SortDirection } from '../lib/sort-entries';
import { routePath } from '../lib/routes';
import { downloadPoolCsv } from '../lib/export';
import { RANGE_SUMMARIES, rangeStartSeconds, type RangeKey } from '../lib/date-range';
import { formatDurationShort } from '../lib/format-entry';
import './PoolDetail.css';

interface PoolDetailProps {
  slug: string;
}

export const PoolDetail: React.FC<PoolDetailProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const {
    pools,
    slugs,
    entries,
    running,
    poolTotalMs,
    startTimer,
    showOverlay,
    deletePool,
    deleteEntry,
  } = useAppState();
  const [range, setRange] = React.useState<RangeKey>('week');
  const [sort, setSort] = React.useState<SortDirection>(DEFAULT_SORT);

  const pool = pools.find(p => slugs.get(p.id) === slug);
  const poolId = pool?.id ?? '';
  const backToPools = () => navigate({ kind: 'pools' });

  const since = rangeStartSeconds(range);
  const list = sortEntries(
    entries.filter(entry => entry.poolId === poolId && parseInt(entry.timeOut, 10) >= since),
    sort
  );
  const selection = useEntrySelection(list);

  // unknown (or just-deleted) slug: fall back to the pools list
  React.useEffect(() => {
    if (!pool) navigate({ kind: 'pools' }, { replace: true });
  }, [pool, navigate]);

  if (!pool) return null;

  const total = poolTotalMs(poolId, since);
  const isRunningHere = running !== false && running.poolId === poolId;
  // Only one timer runs at a time: while another pool's runs, there is
  // nothing to start here, so the control is hidden rather than disabled.
  const showStartControl = running === false || isRunningHere;

  const handleDeletePool = () => {
    if (isRunningHere) return;
    const affected = entries.filter(entry => entry.poolId === poolId).length;
    if (
      !window.confirm(
        `Delete "${pool.name}"? Its ${affected} entries will be removed from Activity too. This can't be undone.` +
          (pools.length === 1 ? '\n\nIt is your only pool, so you will be asked to create a new one.' : '')
      )
    )
      return;
    deletePool(poolId);
    navigate({ kind: 'pools' }, { replace: true });
  };

  const handleStartControl = () => {
    if (isRunningHere) {
      showOverlay();
    } else {
      startTimer(poolId);
    }
  };

  return (
    <div className="pool-detail">
      <button type="button" className="pool-detail__back" onClick={backToPools}>
        ← Pools
      </button>
      <div className="pool-detail__head">
        <h1>{pool.name}</h1>
        <div className="pool-detail__actions">
          <a
            className="pool-detail__action"
            href={routePath({ kind: 'pool-json', slug })}
            target="_blank"
            rel="noreferrer"
            aria-label={`${pool.name} as JSON (opens in a new tab)`}
          >
            JSON ↗
          </a>
          <button
            type="button"
            className="pool-detail__action"
            onClick={() => downloadPoolCsv(pool, slug, entries, running)}
            aria-label={`Download ${pool.name} as CSV`}
          >
            CSV ↓
          </button>
          <button
            type="button"
            className="pool-detail__action pool-detail__delete"
            onClick={handleDeletePool}
            disabled={isRunningHere}
            aria-describedby={isRunningHere ? 'pool-delete-blocked' : undefined}
          >
            Delete pool
          </button>
        </div>
      </div>
      {isRunningHere && (
        <p className="pool-detail__blocked" id="pool-delete-blocked">
          Timer running in this pool — stop it to delete the pool.
        </p>
      )}
      <RangeChips value={range} onChange={setRange} />
      <div className="pool-detail__total">
        <div className="pool-detail__total-num">{formatDurationShort(total)}</div>
        <div className="pool-detail__total-label">
          {RANGE_SUMMARIES[range]}
        </div>
      </div>
      {showStartControl && (
        <button
          type="button"
          className={`pool-detail__start${isRunningHere ? ' pool-detail__start--live' : ''}`}
          onClick={handleStartControl}
        >
          {isRunningHere ? '■ Running here — tap to view' : '▸ Start timer in this pool'}
        </button>
      )}
      <div className="entry-list-head">
        <div className="section-label">Entries</div>
        <EntrySortControl value={sort} onChange={setSort} />
      </div>
      <EntryList
        entries={list}
        selectedIds={selection.selectedIds}
        onToggle={selection.toggle}
        onDelete={deleteEntry}
      />
      {selection.count > 0 && (
        <BulkBar
          count={selection.count}
          // tagging here moves entries out to another pool
          pools={pools.filter(p => p.id !== poolId)}
          onTag={selection.tag}
          toggle={selection.stateToggle}
        />
      )}
    </div>
  );
};
