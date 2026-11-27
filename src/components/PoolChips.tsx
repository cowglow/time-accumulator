import React from 'react';
import './PoolChips.css';

interface PoolChipsProps {
  pools: Pool[];
  /** null only for a legacy untagged running timer — then nothing is picked. */
  selectedPoolId: string | null;
  onSelect: (poolId: string) => void;
  disabled?: boolean;
}

/** Pick the pool a timer accumulates into. Every timer belongs to a pool,
 *  so there is no "none" choice. */
export const PoolChips: React.FC<PoolChipsProps> = ({
  pools,
  selectedPoolId,
  onSelect,
  disabled,
}) => (
  <div className="pool-chips">
    {pools.map(pool => (
      <button
        key={pool.id}
        type="button"
        className={`pool-chip${
          selectedPoolId === pool.id ? ' pool-chip--picked' : ''
        }`}
        onClick={() => onSelect(pool.id)}
        disabled={disabled}
        aria-pressed={selectedPoolId === pool.id}
      >
        {pool.name}
      </button>
    ))}
  </div>
);
