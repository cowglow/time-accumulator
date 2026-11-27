import { describe, expect, it } from 'vitest';
import { poolSlugs, slugify } from './slug';

describe('slugify', () => {
  it.each([
    ['Deep work', 'deep-work'],
    ['  Déjà Vu, Inc.  ', 'deja-vu-inc'],
    ['C++ / Rust', 'c-rust'],
    ['日本語 学習', '日本語-学習'],
    ['!!!', ''],
  ])('%j → %j', (name, slug) => {
    expect(slugify(name)).toBe(slug);
  });
});

describe('poolSlugs', () => {
  it('keeps slugs unique and falls back for unusable names', () => {
    const slugs = poolSlugs([
      { id: 'a', name: 'Gym' },
      { id: 'b', name: 'gym!' },
      { id: 'c', name: 'GYM' },
      { id: 'd', name: '???' },
    ]);
    expect([...slugs.values()]).toEqual(['gym', 'gym-2', 'gym-3', 'pool']);
  });

  it('never hands out the reserved complete-log slugs', () => {
    const slugs = poolSlugs([
      { id: 'a', name: 'JSON' },
      { id: 'b', name: 'csv' },
    ]);
    expect([...slugs.values()]).toEqual(['json-2', 'csv-2']);
  });
});
