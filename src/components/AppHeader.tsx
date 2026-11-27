import React from 'react';
import Gear from '../assets/gear.svg?react';
import { useRouter } from '../contexts/RouterContext';
import type { Route } from '../lib/routes';
import { useAppState } from '../contexts/AppStateContext';
import './AppHeader.css';

interface AppHeaderProps {
  /** Onboarding: no navigation, status reads SETUP. */
  setup?: boolean;
}

/** Top bar. The app name returns Home; the gear toggles Pools (the only
 *  settings there are) open, and closed again back to wherever you were.
 *  Activity is reached from Home's LOG footer. */
export const AppHeader: React.FC<AppHeaderProps> = ({ setup = false }) => {
  const { route, navigate } = useRouter();
  const { running, slugs } = useAppState();
  const runningSlug = running && running.poolId ? slugs.get(running.poolId) : undefined;
  const onHome = route.kind === 'home';
  const onPools = route.kind === 'pools' || route.kind === 'pool';

  // Where closing Pools returns to: the last view visited before opening it.
  const returnRoute = React.useRef<Route>({ kind: 'home' });
  React.useEffect(() => {
    if (!onPools) returnRoute.current = route;
  }, [route, onPools]);

  const togglePools = () => navigate(onPools ? returnRoute.current : { kind: 'pools' });

  // Narrow screens swap the name for "TA" while running, so the status and
  // pool slug fit beside the gear.
  const brand = (
    <>
      <span className="app-header__brand-full">Time Accumulator</span>
      <span className="app-header__brand-short" aria-hidden="true">
        TA
      </span>
    </>
  );

  return (
    <header className={`app-header${running && !setup ? ' app-header--running' : ''}`}>
      {setup ? (
        <span className="app-header__brand">{brand}</span>
      ) : (
        <button
          type="button"
          className="app-header__brand"
          onClick={() => navigate({ kind: 'home' })}
          aria-label="Time Accumulator — home"
          aria-current={onHome ? 'page' : undefined}
        >
          {brand}
        </button>
      )}
      <span className="app-header__end">
        <span
          className={`app-header__status${running ? ' app-header__status--running' : ''}`}
        >
          <span className="app-header__mark" aria-hidden="true" />
          {setup ? 'Setup' : running ? 'Running' : 'Idle'}
          {runningSlug && <span className="app-header__slug">· {runningSlug}</span>}
        </span>
        {!setup && (
          <button
            type="button"
            className={`app-header__pools${onPools ? ' app-header__pools--active' : ''}`}
            onClick={togglePools}
            aria-label={onPools ? 'Close pools' : 'Open pools'}
            aria-pressed={onPools}
          >
            <Gear />
          </button>
        )}
      </span>
    </header>
  );
};
