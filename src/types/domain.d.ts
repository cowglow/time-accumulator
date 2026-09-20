type PoolEntryState = 'counted' | 'omitted';

interface Pool {
  id: string;
  name: string;
}

/** A single completed timer run. timeIn/timeOut are unix seconds, as strings
 *  (matching the rest of the app's timestamp convention). poolId is null
 *  for untagged time — a valid, permanent state, not "pending". */
interface TimeEntry {
  id: string;
  poolId: string | null;
  timeIn: string;
  timeOut: string;
  state: PoolEntryState;
}

/** The one timer that can be running at a time, app-wide. */
interface RunningTimer {
  poolId: string | null;
  timestamp: string;
}
