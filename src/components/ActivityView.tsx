import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { RangeChips } from './RangeChips';
import { EntryList } from './EntryList';
import { BulkBar, type BulkAction } from './BulkBar';
import { rangeStartSeconds, type RangeKey } from '../lib/date-range';
import './ActivityView.css';

export const ActivityView: React.FC = () => {
  const { entries, pools, deleteEntry, assignPool } = useAppState();
  const [range, setRange] = React.useState<RangeKey>('week');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const since = rangeStartSeconds(range);
  const list = entries
    .filter(entry => parseInt(entry.timeOut, 10) >= since)
    .sort((a, b) => parseInt(b.timeIn, 10) - parseInt(a.timeIn, 10));

  const poolName = (id: string | null) =>
    id ? pools.find(p => p.id === id)?.name ?? id : 'No pool';

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());

  const hasPools = pools.length > 0;

  const actions: BulkAction[] = [
    ...pools.map(pool => ({
      label: `→ ${pool.name}`,
      primary: true,
      onClick: () => {
        assignPool([...selected], pool.id);
        clearSelection();
      },
    })),
    // Untagging is only meaningful once pools exist — with none defined,
    // every entry is already untagged, so the action has nothing to do.
    ...(hasPools
      ? [
          {
            label: 'Untag',
            onClick: () => {
              assignPool([...selected], null);
              clearSelection();
            },
          },
        ]
      : []),
  ];

  return (
    <div className="activity-view">
      <h1>Activity</h1>
      <RangeChips value={range} onChange={setRange} />
      <div className="section-label">Every timer you've run, tagged or not</div>
      <EntryList
        entries={list}
        selectedIds={selected}
        onToggle={toggle}
        onDelete={deleteEntry}
        poolName={poolName}
        selectable={hasPools}
      />
      {hasPools && selected.size > 0 && <BulkBar count={selected.size} actions={actions} />}
    </div>
  );
};
