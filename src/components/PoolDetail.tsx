import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { RangeChips } from './RangeChips';
import { EntryList } from './EntryList';
import { BulkBar, type BulkAction } from './BulkBar';
import { RANGE_LABELS, rangeStartSeconds, type RangeKey } from '../lib/date-range';
import { formatDurationShort } from '../lib/format-entry';
import './PoolDetail.css';

interface PoolDetailProps {
  poolId: string;
  onBack: () => void;
}

export const PoolDetail: React.FC<PoolDetailProps> = ({ poolId, onBack }) => {
  const {
    pools,
    entries,
    running,
    poolTotalMs,
    startTimer,
    showOverlay,
    deletePool,
    setEntriesState,
    deleteEntry,
  } = useAppState();
  const [range, setRange] = React.useState<RangeKey>('week');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const pool = pools.find(p => p.id === poolId);

  React.useEffect(() => {
    if (!pool) onBack();
  }, [pool, onBack]);

  if (!pool) return null;

  const since = rangeStartSeconds(range);
  const total = poolTotalMs(poolId, since);
  const list = entries
    .filter(entry => entry.poolId === poolId && parseInt(entry.timeOut, 10) >= since)
    .sort((a, b) => parseInt(b.timeIn, 10) - parseInt(a.timeIn, 10));

  const isRunningHere = running !== false && running.poolId === poolId;
  const selectedEntries = list.filter(entry => selected.has(entry.id));
  const anyCounted = selectedEntries.some(entry => entry.state === 'counted');
  const anyOmitted = selectedEntries.some(entry => entry.state === 'omitted');

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());

  const handleDeletePool = () => {
    const affected = entries.filter(entry => entry.poolId === poolId).length;
    if (
      !window.confirm(
        `Delete "${pool.name}"? Its ${affected} entries will be removed from Activity too. This can't be undone.`
      )
    )
      return;
    deletePool(poolId);
    onBack();
  };

  const handleStartControl = () => {
    if (isRunningHere) {
      showOverlay();
    } else if (running === false) {
      startTimer(poolId);
    }
  };

  const actions: BulkAction[] = [
    ...(anyCounted
      ? [
          {
            label: 'Omit',
            onClick: () => {
              setEntriesState([...selected], 'omitted');
              clearSelection();
            },
          },
        ]
      : []),
    ...(anyOmitted
      ? [
          {
            label: 'Add to pool',
            primary: true,
            onClick: () => {
              setEntriesState([...selected], 'counted');
              clearSelection();
            },
          },
        ]
      : []),
  ];

  return (
    <div className="pool-detail">
      <button type="button" className="pool-detail__back" onClick={onBack}>
        ← Pools
      </button>
      <div className="pool-detail__head">
        <h1>{pool.name}</h1>
        <button type="button" className="pool-detail__delete" onClick={handleDeletePool}>
          Delete pool
        </button>
      </div>
      <RangeChips value={range} onChange={setRange} />
      <div className="pool-detail__total">
        <div className="pool-detail__total-num">{formatDurationShort(total)}</div>
        <div className="pool-detail__total-label">
          counted {RANGE_LABELS[range].toLowerCase()}
        </div>
      </div>
      <button
        type="button"
        className={`pool-detail__start${isRunningHere ? ' pool-detail__start--live' : ''}`}
        onClick={handleStartControl}
        disabled={running !== false && !isRunningHere}
      >
        {isRunningHere ? '● Running here — tap to view' : '▸ Start timer in this pool'}
      </button>
      <div className="section-label">Entries</div>
      <EntryList
        entries={list}
        selectedIds={selected}
        onToggle={toggle}
        onDelete={deleteEntry}
      />
      {selected.size > 0 && <BulkBar count={selected.size} actions={actions} />}
    </div>
  );
};
