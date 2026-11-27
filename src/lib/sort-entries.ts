export type SortDirection = 'desc' | 'asc';

/** Newest first. */
export const DEFAULT_SORT: SortDirection = 'desc';

/** Returns a copy sorted by start time. */
export const sortEntries = (entries: TimeEntry[], direction: SortDirection): TimeEntry[] => {
  const sign = direction === 'desc' ? -1 : 1;
  return [...entries].sort(
    (a, b) => sign * (parseInt(a.timeIn, 10) - parseInt(b.timeIn, 10))
  );
};
