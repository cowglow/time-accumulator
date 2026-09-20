import { describe, expect, it } from 'vitest';
import { formatTimestamp } from './format-timestamp';

describe('format-timestamp', () => {
  const timestamp = 352799100;

  it('takes a unix timestamp and returns formatted string', () => {
    const foo = formatTimestamp(timestamp);
    expect(foo).toEqual('1981-03-07T07:45:00.000Z');
  });
});
