import React from 'react';
import { HomeView } from './HomeView';
import { PoolsList } from './PoolsList';
import { PoolDetail } from './PoolDetail';
import { ActivityView } from './ActivityView';
import { TimerOverlay } from './TimerOverlay';
import { AppHeader } from './AppHeader';
import { Onboarding } from './Onboarding';
import { DataView } from './DataView';
import { useRouter } from '../contexts/RouterContext';
import { useAppState } from '../contexts/AppStateContext';
import { isDataRoute, routePath } from '../lib/routes';

export const App = () => {
  const { route } = useRouter();
  const { pools } = useAppState();

  // Raw JSON/CSV routes bypass the UI (and onboarding) entirely.
  if (isDataRoute(route)) return <DataView route={route} />;

  if (pools.length === 0) {
    return (
      <div id="app">
        <Onboarding />
      </div>
    );
  }

  return (
    <div id="app">
      <AppHeader />
      <div className="view" key={routePath(route, '/')}>
        {route.kind === 'home' && <HomeView />}
        {route.kind === 'activity' && <ActivityView />}
        {route.kind === 'pools' && <PoolsList />}
        {route.kind === 'pool' && <PoolDetail slug={route.slug} />}
      </div>
      <TimerOverlay />
    </div>
  );
};

export default App;
