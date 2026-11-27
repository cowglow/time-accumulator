import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { AppStateProvider } from '../contexts/AppStateContext';
import { RouterProvider } from '../contexts/RouterContext';
import { LOCALSTORAGE_ENTRIES_KEY, LOCALSTORAGE_POOLS_KEY } from '../lib/constants';
import { BASE_PATH } from '../lib/routes';

let container: HTMLDivElement;
let root: Root;

const renderApp = () => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root.render(
      <RouterProvider>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </RouterProvider>
    );
  });
};

/** Sets an input's value the way a user would, so React's onChange fires. */
const typeInto = (input: HTMLInputElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
  act(() => {
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};

const q = <T extends Element>(selector: string) => container.querySelector<T>(selector);

describe('App onboarding gate', () => {
  beforeEach(() => window.localStorage.clear());

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('blocks the app behind first-pool setup when no pool exists', () => {
    renderApp();
    expect(q('.onboarding')).not.toBeNull();
    expect(q('.dial')).toBeNull();
    expect(q('.app-header__pools')).toBeNull();
  });

  it('keeps Create disabled until a non-blank name is entered', () => {
    renderApp();
    const submit = q<HTMLButtonElement>('.onboarding__submit')!;
    expect(submit.disabled).toBe(true);
    typeInto(q<HTMLInputElement>('.onboarding__input')!, '   ');
    expect(submit.disabled).toBe(true);
  });

  it('creates the first pool, persists it and unlocks the home view', () => {
    renderApp();
    typeInto(q<HTMLInputElement>('.onboarding__input')!, '  Deep work ');
    act(() => {
      q<HTMLButtonElement>('.onboarding__submit')!.click();
    });

    expect(q('.onboarding')).toBeNull();
    expect(q('.dial')).not.toBeNull();
    const stored = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_POOLS_KEY)!);
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('Deep work');
  });

  it('skips onboarding when a pool already exists', () => {
    window.localStorage.setItem(
      LOCALSTORAGE_POOLS_KEY,
      JSON.stringify([{ id: 'p1', name: 'Gym' }])
    );
    renderApp();
    expect(q('.onboarding')).toBeNull();
    expect(q('.dial')).not.toBeNull();
  });

  it('header: the gear toggles Pools open and closed, back to where you were', () => {
    window.localStorage.setItem(
      LOCALSTORAGE_POOLS_KEY,
      JSON.stringify([{ id: 'p1', name: 'Gym' }])
    );
    renderApp();
    const gear = () => q<HTMLButtonElement>('.app-header__pools')!;

    act(() => gear().click());
    expect(q('.pools-list')).not.toBeNull();
    expect(gear().getAttribute('aria-pressed')).toBe('true');
    act(() => gear().click());
    expect(q('.dial')).not.toBeNull();

    // from Activity, closing Pools returns to Activity rather than Home
    act(() => q<HTMLButtonElement>('.home-view__log')!.click());
    expect(q('.activity-view')).not.toBeNull();
    act(() => gear().click());
    expect(q('.pools-list')).not.toBeNull();
    act(() => gear().click());
    expect(q('.activity-view')).not.toBeNull();
  });

  it('header: the app name returns Home', () => {
    window.localStorage.setItem(
      LOCALSTORAGE_POOLS_KEY,
      JSON.stringify([{ id: 'p1', name: 'Gym' }])
    );
    renderApp();
    act(() => q<HTMLButtonElement>('.app-header__pools')!.click());
    expect(q('.pools-list')).not.toBeNull();
    act(() => q<HTMLButtonElement>('.app-header__brand')!.click());
    expect(q('.dial')).not.toBeNull();
  });
});

describe('Home pool selection (every timer belongs to a pool)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(
      LOCALSTORAGE_POOLS_KEY,
      JSON.stringify([
        { id: 'p1', name: 'Gym' },
        { id: 'p2', name: 'Reading' },
      ])
    );
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  const pickedChip = () => q('.home-view .pool-chip--picked')?.textContent;

  it('offers no "No pool" choice', () => {
    renderApp();
    const labels = [...container.querySelectorAll('.home-view .pool-chip')].map(
      chip => chip.textContent
    );
    expect(labels).toEqual(['Gym', 'Reading']);
  });

  it('defaults to the first pool when nothing has been tracked yet', () => {
    renderApp();
    expect(pickedChip()).toBe('Gym');
  });

  it('defaults to the most recently used pool', () => {
    window.localStorage.setItem(
      LOCALSTORAGE_ENTRIES_KEY,
      JSON.stringify([
        { id: 'e1', poolId: 'p1', timeIn: '100', timeOut: '200', state: 'counted' },
        { id: 'e2', poolId: 'p2', timeIn: '300', timeOut: '400', state: 'counted' },
        { id: 'e3', poolId: null, timeIn: '500', timeOut: '600', state: 'counted' },
      ])
    );
    renderApp();
    expect(pickedChip()).toBe('Reading');
  });
});

describe('routes, data views and header slug', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(
      LOCALSTORAGE_POOLS_KEY,
      JSON.stringify([
        { id: 'p1', name: 'Deep Work' },
        { id: 'p2', name: 'Gym' },
      ])
    );
    window.localStorage.setItem(
      LOCALSTORAGE_ENTRIES_KEY,
      JSON.stringify([
        { id: 'e1', poolId: 'p1', timeIn: '1700000000', timeOut: '1700000600', state: 'counted' },
      ])
    );
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    window.history.replaceState(null, '', '/');
  });

  const visit = (path: string) => window.history.replaceState(null, '', `${BASE_PATH}${path}`);
  const data = () => q('.data-view')!.textContent!;
  const path = () => window.location.pathname;

  it('renders a pool JSON document at pool/{slug}/json instead of the app', () => {
    visit('pool/deep-work/json');
    renderApp();
    expect(q('.app-header')).toBeNull();
    expect(JSON.parse(data())).toMatchObject({
      schema: 'time-accumulator/pool',
      pool: { id: 'p1', name: 'Deep Work', slug: 'deep-work' },
    });
  });

  /** Captures what downloadFile hands the browser (jsdom has no blob URLs). */
  const captureDownloads = () => {
    const files: { name: string; blob: Blob }[] = [];
    let pending: Blob | undefined;
    vi.spyOn(URL, 'createObjectURL').mockImplementation(blob => {
      pending = blob as Blob;
      return 'blob:test';
    });
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      if (pending) files.push({ name: this.download, blob: pending });
    });
    return files;
  };

  afterEach(() => vi.restoreAllMocks());

  it('downloads the pool CSV at pool/{slug}/csv, then shows the pool', async () => {
    const files = captureDownloads();
    visit('pool/deep-work/csv');
    renderApp();
    expect(files).toHaveLength(1);
    expect(files[0].name).toMatch(/^time-accumulator-deep-work-\d{4}-\d{2}-\d{2}\.csv$/);
    const lines = (await files[0].blob.text()).replace(/^\uFEFF/, '').split('\r\n');
    expect(lines[1]).toMatch(/^e1,p1,Deep Work,counted,/);
    expect(path()).toBe(`${BASE_PATH}pool/deep-work`);
    expect(q('.pool-detail h1')!.textContent).toBe('Deep Work');
  });

  it('renders the complete log as JSON at pool/json', () => {
    visit('pool/json');
    renderApp();
    const doc = JSON.parse(data());
    expect(doc.schema).toBe('time-accumulator/export');
    expect(doc.pools.map((p: { slug: string }) => p.slug)).toEqual(['deep-work', 'gym']);
    expect(doc.entries.map((e: { id: string }) => e.id)).toEqual(['e1']);
  });

  it('downloads the complete log CSV at pool/csv, then shows Pools', () => {
    const files = captureDownloads();
    visit('pool/csv');
    renderApp();
    expect(files.map(f => f.name)).toEqual([
      expect.stringMatching(/^time-accumulator-\d{4}-\d{2}-\d{2}\.csv$/),
    ]);
    expect(path()).toBe(`${BASE_PATH}pool`);
    expect(q('.pools-list')).not.toBeNull();
  });

  it('offers complete-log JSON and CSV on the Pools page', () => {
    const files = captureDownloads();
    visit('pool');
    renderApp();
    const [json, csv] = [...container.querySelectorAll<HTMLElement>('.pools-export__button')];
    expect(json.textContent).toBe('JSON ↗');
    expect(json.getAttribute('href')).toBe(`${BASE_PATH}pool/json`);
    act(() => csv.click());
    expect(files).toHaveLength(1);
  });

  it('answers an unknown slug with a not-found document', () => {
    visit('pool/nope/json');
    renderApp();
    expect(JSON.parse(data())).toMatchObject({ error: 'pool-not-found', slug: 'nope' });
  });

  it('deep-links straight into Activity and a pool', () => {
    visit('activity');
    renderApp();
    expect(q('.activity-view')).not.toBeNull();
    act(() => root.unmount());
    container.remove();

    visit('pool/gym');
    renderApp();
    expect(q('.pool-detail h1')!.textContent).toBe('Gym');
  });

  it('falls back to Home for an unknown path, fixing the URL', () => {
    visit('nowhere/at/all');
    renderApp();
    expect(q('.dial')).not.toBeNull();
    expect(path()).toBe(BASE_PATH);
  });

  it('tracks navigation in the URL and follows the back button', () => {
    renderApp();
    act(() => q<HTMLButtonElement>('.home-view__log')!.click());
    expect(path()).toBe(`${BASE_PATH}activity`);

    act(() => q<HTMLButtonElement>('.app-header__pools')!.click());
    expect(path()).toBe(`${BASE_PATH}pool`);
    act(() => q<HTMLButtonElement>('.pool-card')!.click());
    expect(path()).toBe(`${BASE_PATH}pool/deep-work`);

    // the browser's back button: history moves, then popstate fires
    act(() => {
      window.history.replaceState(null, '', `${BASE_PATH}pool`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(q('.pools-list')).not.toBeNull();
  });

  it('puts JSON and CSV beside Delete pool; CSV downloads directly', () => {
    const files = captureDownloads();
    visit('pool/deep-work');
    renderApp();
    const actions = [...container.querySelectorAll<HTMLElement>('.pool-detail__action')];
    expect(actions.map(a => a.textContent)).toEqual(['JSON ↗', 'CSV ↓', 'Delete pool']);
    expect(actions[0].getAttribute('href')).toBe(`${BASE_PATH}pool/deep-work/json`);
    act(() => actions[1].click());
    expect(files.map(f => f.name)).toEqual([expect.stringMatching(/deep-work/)]);
    expect(path()).toBe(`${BASE_PATH}pool/deep-work`);
  });

  it('hides the Start control while another pool has the running timer', () => {
    visit('pool/gym');
    renderApp();
    expect(q('.pool-detail__start')!.textContent).toContain('Start timer');

    act(() => q<HTMLButtonElement>('.pool-detail__start')!.click()); // starts Gym
    expect(q('.pool-detail__start')!.textContent).toContain('Running here');

    act(() => q<HTMLButtonElement>('.timer-overlay__minimize')!.click());
    act(() => {
      q('.timer-overlay')!.dispatchEvent(new Event('animationend', { bubbles: true }));
    });
    // open Deep Work while Gym runs: nothing to start there
    act(() => q<HTMLButtonElement>('.pool-detail__back')!.click());
    act(() => q<HTMLButtonElement>('.pool-card')!.click());
    expect(q('.pool-detail h1')!.textContent).toBe('Deep Work');
    expect(q('.pool-detail__start')).toBeNull();
  });

  it('sorts entries by date, newest first, with a direction toggle', () => {
    window.localStorage.setItem(
      LOCALSTORAGE_ENTRIES_KEY,
      JSON.stringify([
        { id: 'old', poolId: 'p1', timeIn: '1700000000', timeOut: '1700000060', state: 'counted' },
        { id: 'new', poolId: 'p1', timeIn: '1700090000', timeOut: '1700093600', state: 'counted' },
      ])
    );
    visit('pool/deep-work');
    renderApp();
    act(() => q<HTMLButtonElement>('.range-chip:last-child')!.click()); // complete log
    const durations = () =>
      [...container.querySelectorAll('.entry-row__duration')].map(d => d.textContent);
    expect(q('.entry-sort')!.textContent).toBe('Date ↓');
    expect(durations()).toEqual(['1:00', '1m']);
    act(() => q<HTMLButtonElement>('.entry-sort')!.click());
    expect(q('.entry-sort')!.textContent).toBe('Date ↑');
    expect(durations()).toEqual(['1m', '1:00']);
  });

  it('shows IDLE, then RUNNING plus the running pool slug, in the header', () => {
    renderApp();
    const status = () => q('.app-header__status')!.textContent;
    expect(status()).toBe('Idle');
    act(() => q<HTMLButtonElement>('.dial')!.click());
    expect(q('.app-header__slug')!.textContent).toBe('· deep-work');
  });
});

describe('selection footer in Activity', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(
      LOCALSTORAGE_POOLS_KEY,
      JSON.stringify([
        { id: 'p1', name: 'Deep Work' },
        { id: 'p2', name: 'Gym' },
      ])
    );
    const now = Math.floor(Date.now() / 1000);
    window.localStorage.setItem(
      LOCALSTORAGE_ENTRIES_KEY,
      JSON.stringify([
        { id: 'e1', poolId: 'p1', timeIn: String(now - 600), timeOut: String(now - 300), state: 'counted' },
      ])
    );
    window.history.replaceState(null, '', `${BASE_PATH}activity`);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    window.history.replaceState(null, '', '/');
  });

  const stored = () => JSON.parse(window.localStorage.getItem(LOCALSTORAGE_ENTRIES_KEY)!)[0];
  const select = () => act(() => q<HTMLButtonElement>('.entry-row__checkbox')!.click());

  it('shows "{n} selected | Tag pool | Omit" for a selection', () => {
    renderApp();
    select();
    expect(document.querySelector('.bulk-bar__count')!.textContent).toBe('1 selected');
    const options = [...document.querySelectorAll('.bulk-bar__select option')].map(o => o.textContent);
    expect(options).toEqual(['Tag pool…', 'Deep Work', 'Gym']);
    expect(document.querySelector('.bulk-bar__button')!.textContent).toBe('Omit');
  });

  it('tags the selection with the pool picked from the dropdown', () => {
    renderApp();
    select();
    const dropdown = document.querySelector<HTMLSelectElement>('.bulk-bar__select')!;
    act(() => {
      dropdown.value = 'p2';
      dropdown.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(stored().poolId).toBe('p2');
    expect(document.querySelector('.bulk-bar')).toBeNull();
  });

  it('omits, then offers Delete on the row and Restore in the footer', () => {
    renderApp();
    select();
    act(() => document.querySelector<HTMLButtonElement>('.bulk-bar__button')!.click());
    expect(stored().state).toBe('omitted');

    select();
    expect(document.querySelector('.bulk-bar__button')!.textContent).toBe('Restore');
    act(() => document.querySelector<HTMLButtonElement>('.bulk-bar__button')!.click());
    expect(stored().state).toBe('counted');

    select();
    act(() => document.querySelector<HTMLButtonElement>('.bulk-bar__button')!.click());
    act(() => q<HTMLButtonElement>('.entry-row__delete')!.click());
    expect(JSON.parse(window.localStorage.getItem(LOCALSTORAGE_ENTRIES_KEY)!)).toEqual([]);
  });
});
