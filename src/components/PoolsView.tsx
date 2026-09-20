import React from 'react';
import { PoolsList } from './PoolsList';
import { PoolDetail } from './PoolDetail';

export const PoolsView: React.FC = () => {
  const [selectedPoolId, setSelectedPoolId] = React.useState<string | null>(null);

  if (selectedPoolId) {
    return (
      <PoolDetail poolId={selectedPoolId} onBack={() => setSelectedPoolId(null)} />
    );
  }

  return <PoolsList onOpenPool={setSelectedPoolId} />;
};
