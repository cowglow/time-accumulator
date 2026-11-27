import React from 'react';
import type { SortDirection } from '../lib/sort-entries';
import './EntrySortControl.css';

interface EntrySortControlProps {
  value: SortDirection;
  onChange: (direction: SortDirection) => void;
}

/** "Date ↓" — entries are sorted by date; tapping flips the direction. */
export const EntrySortControl: React.FC<EntrySortControlProps> = ({ value, onChange }) => {
  const descending = value === 'desc';
  const label = descending ? 'Newest first' : 'Oldest first';
  return (
    <button
      type="button"
      className="entry-sort"
      onClick={() => onChange(descending ? 'asc' : 'desc')}
      aria-label={`Sorted by date, ${label.toLowerCase()} — switch direction`}
      title={label}
    >
      Date <span aria-hidden="true">{descending ? '↓' : '↑'}</span>
    </button>
  );
};
