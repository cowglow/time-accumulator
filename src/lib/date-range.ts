export type RangeKey = 'today' | 'week' | 'month';

export const RANGE_KEYS: RangeKey[] = ['today', 'week', 'month'];

export const RANGE_LABELS: Record<RangeKey, string> = {
  today: 'Today',
  week: 'This week',
  month: 'This month',
};

/** Start of the given range, as unix seconds, anchored to now. Weeks start
 *  Monday. */
export const rangeStartSeconds = (key: RangeKey): number => {
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
