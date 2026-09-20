import React from 'react';
import { formatDurationShort, formatEntryDay, formatTimeOfDay } from '../lib/format-entry';
import './EntryList.css';

interface EntryListProps {
  entries: TimeEntry[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  poolName?: (id: string | null) => string;
  /** false when no bulk action could ever apply to a selection here (e.g.
   *  Activity with zero pools defined) — hides the checkbox entirely rather
   *  than let people select entries that can't lead anywhere. */
  selectable?: boolean;
}

export const EntryList: React.FC<EntryListProps> = ({
  entries,
  selectedIds,
  onToggle,
  onDelete,
  poolName,
  selectable = true,
}) => {
  if (entries.length === 0) {
    return <p className="entry-list__empty">Nothing here yet.</p>;
  }

  return (
    <div className="entry-list">
      {entries.map(entry => {
        const start = parseInt(entry.timeIn, 10);
        const end = parseInt(entry.timeOut, 10);
        const omitted = entry.state === 'omitted';
        const checked = selectedIds.has(entry.id);

        return (
          <div
            key={entry.id}
            className={`entry-row${omitted ? ' entry-row--omitted' : ''}${
              selectable ? '' : ' entry-row--plain'
            }`}
          >
            {selectable && (
              <button
                type="button"
                className={`entry-row__checkbox${
                  checked ? ' entry-row__checkbox--checked' : ''
                }`}
                aria-pressed={checked}
                aria-label={checked ? 'Deselect entry' : 'Select entry'}
                onClick={() => onToggle(entry.id)}
              />
            )}
            <div className="entry-row__mid">
              <div className="entry-row__time">
                {formatTimeOfDay(start)} – {formatTimeOfDay(end)}
                {poolName && entry.poolId !== null && (
                  <span className="entry-row__pool"> · {poolName(entry.poolId)}</span>
                )}
              </div>
              <div className="entry-row__day">{formatEntryDay(start)}</div>
            </div>
            <div className="entry-row__right">
              <span className="entry-row__duration">
                {formatDurationShort((end - start) * 1000)}
              </span>
              {omitted && (
                <button
                  type="button"
                  className="entry-row__delete"
                  onClick={() => onDelete(entry.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
