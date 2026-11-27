import React from 'react';
import { createPortal } from 'react-dom';
import './BulkBar.css';

interface BulkBarProps {
  count: number;
  /** pools offered in the tag dropdown; the dropdown hides when empty */
  pools: Pool[];
  onTag: (poolId: string) => void;
  /** the state toggle — "Omit", or "Restore" when everything picked is omitted */
  toggle: { label: string; onClick: () => void };
}

/** Selection footer: "{n} selected | Tag pool ▾ | Omit". A native select
 *  keeps tagging usable however many pools there are. Rendered into <body>
 *  so no animated (transformed) ancestor can capture its fixed position. */
export const BulkBar: React.FC<BulkBarProps> = ({
  count,
  pools,
  onTag,
  toggle,
}) =>
  createPortal(
    <div className="bulk-bar" role="region" aria-label="Selected entries">
      <span className="bulk-bar__count">{count} selected</span>
      {pools.length > 0 && (
        <span className="bulk-bar__tag">
          <select
            className="bulk-bar__select"
            value=""
            onChange={event => event.target.value && onTag(event.target.value)}
            aria-label={`Tag ${count} selected ${count === 1 ? 'entry' : 'entries'} with a pool`}
          >
            <option value="" disabled>
              Tag pool…
            </option>
            {pools.map(pool => (
              <option key={pool.id} value={pool.id}>
                {pool.name}
              </option>
            ))}
          </select>
        </span>
      )}
      <button
        type="button"
        className="bulk-bar__button"
        onClick={toggle.onClick}
      >
        {toggle.label}
      </button>
    </div>,
    document.body
  );
