import { describe, expect, it } from 'vitest';
import { formatLog, formatTimestamp } from './format-timestamp';

describe('format-timestamp', () => {
  const timestamp = 352799100;

  it('takes a unix timestamp and returns formatted string', () => {
    const foo = formatTimestamp(timestamp);
    expect(foo).toEqual('1981-03-07T07:45:00.000Z');
  });
});

describe('format-log', () => {
  const start = 352799100;
  const end = 1615114800;

  it('takes a unix timestamp and returns formatted log string', () => {
    const foo = formatLog(start, end);
    expect(foo).toEqual('Sun 7 03:15:00 11:00');
  });
});
