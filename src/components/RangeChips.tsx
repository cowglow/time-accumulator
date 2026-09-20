import React from 'react';
import { RANGE_KEYS, RANGE_LABELS, type RangeKey } from '../lib/date-range';
import './RangeChips.css';

interface RangeChipsProps {
  value: RangeKey;
  onChange: (key: RangeKey) => void;
}

export const RangeChips: React.FC<RangeChipsProps> = ({ value, onChange }) => (
  <div className="range-chips">
    {RANGE_KEYS.map(key => (
      <button
        key={key}
        type="button"
        className={`range-chip${value === key ? ' range-chip--picked' : ''}`}
        onClick={() => onChange(key)}
      >
        {RANGE_LABELS[key]}
      </button>
    ))}
  </div>
);
