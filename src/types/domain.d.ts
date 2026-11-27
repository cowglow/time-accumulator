type PoolEntryState = 'counted' | 'omitted';

interface Pool {
  id: string;
  name: string;
}

/** A single completed timer run. timeIn/timeOut are unix seconds, as strings
 *  (matching the rest of the app's timestamp convention). Every new entry
 *  belongs to a pool; poolId is null only for legacy time migrated from the
 *  pre-pools single log, which Activity flags so it can be assigned. */
interface TimeEntry {
  id: string;
  poolId: string | null;
  timeIn: string;
  timeOut: string;
  state: PoolEntryState;
}

/** The one timer that can be running at a time, app-wide. poolId is null
 *  only for a legacy checkin migrated from the pre-pools version. */
interface RunningTimer {
  poolId: string | null;
  timestamp: string;
}
