import React from 'react';
import './PoolChips.css';

interface PoolChipsProps {
  pools: Pool[];
  selectedPoolId: string | null;
  onSelect: (poolId: string | null) => void;
  disabled?: boolean;
}

export const PoolChips: React.FC<PoolChipsProps> = ({
  pools,
  selectedPoolId,
  onSelect,
  disabled,
}) => (
  <div className="pool-chips">
    <button
      type="button"
      className={`pool-chip pool-chip--none${
        selectedPoolId === null ? ' pool-chip--picked' : ''
      }`}
      onClick={() => onSelect(null)}
      disabled={disabled}
    >
      No pool
    </button>
    {pools.map(pool => (
      <button
        key={pool.id}
        type="button"
        className={`pool-chip${
          selectedPoolId === pool.id ? ' pool-chip--picked' : ''
        }`}
        onClick={() => onSelect(pool.id)}
        disabled={disabled}
      >
        {pool.name}
      </button>
    ))}
  </div>
);
