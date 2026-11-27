import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { useEntrySelection } from '../hooks/useEntrySelection';
import { RangeChips } from './RangeChips';
import { EntryList } from './EntryList';
import { BulkBar } from './BulkBar';
import { EntrySortControl } from './EntrySortControl';
import { DEFAULT_SORT, sortEntries, type SortDirection } from '../lib/sort-entries';
import { rangeStartSeconds, type RangeKey } from '../lib/date-range';
import './ActivityView.css';

export const ActivityView: React.FC = () => {
  const { entries, pools, deleteEntry } = useAppState();
  const [range, setRange] = React.useState<RangeKey>('week');
  const [sort, setSort] = React.useState<SortDirection>(DEFAULT_SORT);

  const since = rangeStartSeconds(range);
  const list = sortEntries(
    entries.filter(entry => parseInt(entry.timeOut, 10) >= since),
    sort
  );
  const selection = useEntrySelection(list);

  const poolName = (id: string | null) =>
    id ? pools.find(p => p.id === id)?.name ?? id : 'Untagged';

  return (
    <div className="activity-view">
      <h1>Activity</h1>
      <RangeChips value={range} onChange={setRange} />
      <div className="entry-list-head">
        <div className="section-label">Every timer you've run</div>
        <EntrySortControl value={sort} onChange={setSort} />
      </div>
      <EntryList
        entries={list}
        selectedIds={selection.selectedIds}
        onToggle={selection.toggle}
        onDelete={deleteEntry}
        poolName={poolName}
      />
      {selection.count > 0 && (
        <BulkBar
          count={selection.count}
          pools={pools}
          onTag={selection.tag}
          toggle={selection.stateToggle}
        />
      )}
    </div>
  );
};
