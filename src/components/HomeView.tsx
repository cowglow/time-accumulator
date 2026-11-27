import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { useRouter } from '../contexts/RouterContext';
import { ActionController } from './ActionController';
import { PoolChips } from './PoolChips';
import './HomeView.css';

/** Default pool for the next timer: the one used most recently, if it still
 *  exists, else the first pool. Onboarding guarantees at least one. */
const lastUsedPoolId = (pools: Pool[], entries: TimeEntry[]): string => {
  const ids = new Set(pools.map(pool => pool.id));
  let latest: TimeEntry | undefined;
  for (const entry of entries) {
    if (entry.poolId !== null && ids.has(entry.poolId)) {
      if (!latest || parseInt(entry.timeIn, 10) > parseInt(latest.timeIn, 10)) {
        latest = entry;
      }
    }
  }
  return latest?.poolId ?? pools[0].id;
};

export const HomeView: React.FC = () => {
  const { pools, running, entries } = useAppState();
  const { navigate } = useRouter();
  const [picked, setPicked] = React.useState<string>(() =>
    lastUsedPoolId(pools, entries)
  );
  // fall back if the picked pool was deleted
  const pendingPoolId = pools.some(pool => pool.id === picked)
    ? picked
    : lastUsedPoolId(pools, entries);

  return (
    <div className="home-view">
      <div className="home-view__stage">
        <ActionController pendingPoolId={pendingPoolId} />
        <PoolChips
          pools={pools}
          selectedPoolId={running ? running.poolId : pendingPoolId}
          onSelect={setPicked}
          disabled={Boolean(running)}
        />
        <p className="home-view__hint">
          Time accumulates into the selected pool. Switch pools while it runs
          from the running view.
        </p>
      </div>
      <button
        type="button"
        className="home-view__log"
        onClick={() => navigate({ kind: 'activity' })}
      >
        <span>Log</span>
        <span>{entries.length.toString().padStart(2, '0')} entries →</span>
      </button>
    </div>
  );
};
