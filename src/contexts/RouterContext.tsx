import React from 'react';
import { parseRoute, routePath, sameRoute, type Route } from '../lib/routes';

interface RouterContextProps {
  route: Route;
  /** Pushes a history entry (or replaces the current one) and re-renders. */
  navigate: (to: Route, options?: { replace?: boolean }) => void;
}

const RouterContext = React.createContext<RouterContextProps | null>(null);

const HOME: Route = { kind: 'home' };

/** Unknown paths fall back to Home, and the URL is corrected to match. */
const readLocation = (): Route => parseRoute(window.location.pathname) ?? HOME;

/** Minimal History-API router: the URL is the source of truth, and the
 *  browser's back/forward buttons move between views. */
export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = React.useState<Route>(readLocation);

  React.useEffect(() => {
    if (parseRoute(window.location.pathname) === null) {
      window.history.replaceState(null, '', routePath(HOME));
    }
    const onPopState = () => setRoute(readLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = React.useCallback((to: Route, options?: { replace?: boolean }) => {
    const path = routePath(to);
    if (options?.replace) {
      window.history.replaceState(null, '', path);
    } else if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
      window.scrollTo?.(0, 0);
    }
    setRoute(current => (sameRoute(current, to) ? current : to));
  }, []);

  const value = React.useMemo(() => ({ route, navigate }), [route, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export const useRouter = (): RouterContextProps => {
  const context = React.useContext(RouterContext);
  if (!context) throw Error('useRouter must be used inside <RouterProvider>');
  return context;
};
