import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { ActionController } from './ActionController';
import { PoolChips } from './PoolChips';
import './HomeView.css';

export const HomeView: React.FC = () => {
  const { pools, running } = useAppState();
  const [pendingPoolId, setPendingPoolId] = React.useState<string | null>(null);

  return (
    <div className="home-view">
      <ActionController pendingPoolId={pendingPoolId} />
      <PoolChips
        pools={pools}
        selectedPoolId={pendingPoolId}
        onSelect={setPendingPoolId}
        disabled={Boolean(running)}
      />
      <p className="home-view__hint">
        Quick-start is untagged by default — tag it now, while it runs, or
        after you stop, in Activity.
      </p>
    </div>
  );
};
