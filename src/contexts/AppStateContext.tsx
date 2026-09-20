import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  ERROR_UNINITIALIZED_CONTEXT,
  LOCALSTORAGE_CHECKIN_KEY,
  LOCALSTORAGE_LOG_KEY,
  LOCALSTORAGE_POOLS_KEY,
  LOCALSTORAGE_ENTRIES_KEY,
  LOCALSTORAGE_RUNNING_KEY,
} from '../lib/constants';

const nowSeconds = () => Math.floor(Date.now() / 1000).toString();

const makeId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** One-time migration so upgrading from the single-log version never loses
 *  previously tracked time: pre-pools log entries come in untagged (poolId
 *  null) and counted, and an in-progress checkin becomes an untagged running
 *  timer. Only used as the very first localStorage value ever read for the
 *  new keys — once those keys exist, this is never consulted again. */
const migrateLegacyLog = (): TimeEntry[] => {
  try {
    const raw = window.localStorage.getItem(LOCALSTORAGE_LOG_KEY);
    if (!raw) return [];
    const legacy: { timeIn: string; timeOut: string }[] = JSON.parse(raw);
    return legacy.map(({ timeIn, timeOut }) => ({
      id: makeId(),
      poolId: null,
      timeIn,
      timeOut,
      state: 'counted' as const,
    }));
  } catch {
    return [];
  }
};

const migrateLegacyCheckin = (): RunningTimer | false => {
  try {
    const raw = window.localStorage.getItem(LOCALSTORAGE_CHECKIN_KEY);
    if (!raw) return false;
    const checkin = JSON.parse(raw);
    return checkin ? { poolId: null, timestamp: checkin } : false;
  } catch {
    return false;
  }
};

/** Context */
export interface AppStateContextProps {
  pools: Pool[];
  entries: TimeEntry[];
  running: RunningTimer | false;
  overlayOpen: boolean;
  startTimer: (poolId: string | null) => void;
  stopTimer: () => void;
  retagRunning: (poolId: string | null) => void;
  showOverlay: () => void;
  hideOverlay: () => void;
  addPool: (name: string) => void;
  deletePool: (poolId: string) => void;
  setEntriesState: (ids: string[], state: PoolEntryState) => void;
  assignPool: (ids: string[], poolId: string | null) => void;
  deleteEntry: (id: string) => void;
  poolTotalMs: (poolId: string | null, sinceSeconds: number) => number;
}

const notReady = (): never => {
  throw Error(ERROR_UNINITIALIZED_CONTEXT);
};

const defaultValues: AppStateContextProps = {
  pools: [],
  entries: [],
  running: false,
  overlayOpen: false,
  startTimer: notReady,
  stopTimer: notReady,
  retagRunning: notReady,
  showOverlay: notReady,
  hideOverlay: notReady,
  addPool: notReady,
  deletePool: notReady,
  setEntriesState: notReady,
  assignPool: notReady,
  deleteEntry: notReady,
  poolTotalMs: notReady,
};

export const AppStateContext =
  React.createContext<AppStateContextProps>(defaultValues);

/** Provider */
interface AppStateProviderProps {
  children: React.ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
}) => {
  const [pools, setPools] = useLocalStorage<Pool[]>(LOCALSTORAGE_POOLS_KEY, []);
  const [entries, setEntries] = useLocalStorage<TimeEntry[]>(
    LOCALSTORAGE_ENTRIES_KEY,
    migrateLegacyLog()
  );
  const [running, setRunning] = useLocalStorage<RunningTimer | false>(
    LOCALSTORAGE_RUNNING_KEY,
    migrateLegacyCheckin()
  );
  const [overlayOpen, setOverlayOpen] = React.useState(false);

  const startTimer = (poolId: string | null) => {
    setRunning({ poolId, timestamp: nowSeconds() });
    setOverlayOpen(true);
  };

  const stopTimer = () => {
    if (!running) return;
    setEntries(list => [
      ...list,
      {
        id: makeId(),
        poolId: running.poolId,
        timeIn: running.timestamp,
        timeOut: nowSeconds(),
        state: 'counted',
      },
    ]);
    setRunning(false);
    setOverlayOpen(false);
  };

  const retagRunning = (poolId: string | null) => {
    setRunning(current => (current ? { ...current, poolId } : current));
  };

  const showOverlay = () => setOverlayOpen(true);
  const hideOverlay = () => setOverlayOpen(false);

  const addPool = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPools(list => [...list, { id: makeId(), name: trimmed }]);
  };

  /** Deleting a pool removes its entries from Activity too — entries never
   *  survive as orphans, matching the decision to batch-remove rather than
   *  fall back to untagged. */
  const deletePool = (poolId: string) => {
    setPools(list => list.filter(p => p.id !== poolId));
    setEntries(list => list.filter(e => e.poolId !== poolId));
  };

  const setEntriesState = (ids: string[], state: PoolEntryState) => {
    const idSet = new Set(ids);
    setEntries(list =>
      list.map(e => (idSet.has(e.id) ? { ...e, state } : e))
    );
  };

  const assignPool = (ids: string[], poolId: string | null) => {
    const idSet = new Set(ids);
    setEntries(list =>
      list.map(e => (idSet.has(e.id) ? { ...e, poolId, state: 'counted' } : e))
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(list => list.filter(e => e.id !== id));
  };

  const poolTotalMs = (poolId: string | null, sinceSeconds: number) =>
    entries
      .filter(
        e =>
          e.poolId === poolId &&
          e.state === 'counted' &&
          parseInt(e.timeOut, 10) >= sinceSeconds
      )
      .reduce(
        (sum, e) => sum + (parseInt(e.timeOut, 10) - parseInt(e.timeIn, 10)) * 1000,
        0
      );

  return (
    <AppStateContext.Provider
      value={{
        pools,
        entries,
        running,
        overlayOpen,
        startTimer,
        stopTimer,
        retagRunning,
        showOverlay,
        hideOverlay,
        addPool,
        deletePool,
        setEntriesState,
        assignPool,
        deleteEntry,
        poolTotalMs,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

/** Hook */
export const useAppState = () => {
  return React.useContext(AppStateContext);
};
