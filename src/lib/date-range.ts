export type RangeKey = 'today' | 'week' | 'month' | 'all';

export const RANGE_KEYS: RangeKey[] = ['today', 'week', 'month', 'all'];

export const RANGE_LABELS: Record<RangeKey, string> = {
  today: 'Today',
  week: 'This week',
  month: 'Current month',
  all: 'Complete log',
};

/** Caption under a range total, e.g. "counted this week". */
export const RANGE_SUMMARIES: Record<RangeKey, string> = {
  today: 'counted today',
  week: 'counted this week',
  month: 'counted this month',
  all: 'counted all time',
};

/** Start of the given range, as unix seconds, anchored to now. Weeks start
 *  Monday. The complete log starts at the epoch, i.e. includes everything. */
export const rangeStartSeconds = (key: RangeKey): number => {
  if (key === 'all') return 0;
  const now = new Date();
  if (key === 'today') {
    now.setHours(0, 0, 0, 0);
    return Math.floor(now.getTime() / 1000);
  }
  if (key === 'week') {
    const dayIndex = (now.getDay() + 6) % 7; // Monday = 0
    now.setDate(now.getDate() - dayIndex);
    now.setHours(0, 0, 0, 0);
    return Math.floor(now.getTime() / 1000);
  }
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  return Math.floor(now.getTime() / 1000);
};
