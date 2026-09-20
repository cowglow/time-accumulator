import React from 'react';
import './BulkBar.css';

export interface BulkAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

interface BulkBarProps {
  count: number;
  actions: BulkAction[];
}

export const BulkBar: React.FC<BulkBarProps> = ({ count, actions }) => (
  <div className="bulk-bar">
    <span className="bulk-bar__count">{count} selected</span>
    <span className="bulk-bar__actions">
      {actions.map(action => (
        <button
          key={action.label}
          type="button"
          className={`bulk-bar__button${action.primary ? ' bulk-bar__button--primary' : ''}`}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}
    </span>
  </div>
);
