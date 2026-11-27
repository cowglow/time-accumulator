import { describe, expect, it } from 'vitest';
import { DEFAULT_SORT, sortEntries } from './sort-entries';

const entry = (id: string, timeIn: number): TimeEntry => ({
  id,
  poolId: 'p1',
  timeIn: String(timeIn),
  timeOut: String(timeIn + 60),
  state: 'counted',
});

const list = [entry('b', 2000), entry('a', 1000), entry('c', 3000)];
const ids = (entries: TimeEntry[]) => entries.map(e => e.id);

describe('sortEntries', () => {
  it('defaults to descending — newest first', () => {
    expect(DEFAULT_SORT).toBe('desc');
    expect(ids(sortEntries(list, DEFAULT_SORT))).toEqual(['c', 'b', 'a']);
  });

  it('sorts ascending — oldest first', () => {
    expect(ids(sortEntries(list, 'asc'))).toEqual(['a', 'b', 'c']);
  });

  it('does not mutate its input', () => {
    const copy = [...list];
    sortEntries(list, 'asc');
    expect(list).toEqual(copy);
  });
});
