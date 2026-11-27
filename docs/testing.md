# Testing

## Running

```sh
npm test            # vitest run, once
npm run test:watch  # vitest in watch mode
```

CI runs `npm test` before every build in `deploy.yml` and `release.yml`, so
a failing test blocks both a deploy and a release.

## Setup

- Vitest, configured in the `test` block of `vite.config.ts`: `jsdom`
  environment, setup file `src/test/setup.ts`.
- `src/test/setup.ts` only sets `IS_REACT_ACT_ENVIRONMENT` so React's
  `act()` works without warnings.
- `src/test/renderHook.tsx` is a small `renderHook` helper built on
  `createRoot` + `act`. There's no Testing Library: app-level tests render
  with `createRoot` and query the DOM directly.
- Node is pinned in `.nvmrc`. Node 26 ships its own flag-gated
  `localStorage` global that shadows jsdom's and breaks the suite.

## Test files

10 files, 108 tests.

| File | What it covers |
| --- | --- |
| `src/components/App.spec.tsx` | Whole-app tests in jsdom: the onboarding gate, Home pool selection (every timer belongs to a pool), routes, data views and the header slug, and the Activity selection footer |
| `src/contexts/AppStateContext.spec.tsx` | Start/stop, retagging, pools, omit/restore, assign, delete, totals and the legacy migration |
| `src/hooks/useTimer.spec.tsx` | `computeElapsed` (including hours past 24), the hook's running/stopped output, and resuming from a persisted start timestamp |
| `src/hooks/useLocalStorage.spec.tsx` | Reading, writing and falling back to the default |
| `src/lib/routes.spec.ts` | `parseRoute` / `routePath` round trips, reserved slugs, unknown paths |
| `src/lib/slug.spec.ts` | `slugify` and unique slugs per pool |
| `src/lib/export.spec.ts` | Export and pool documents, CSV output, file names, the pool-not-found document |
| `src/lib/date-range.spec.ts` | Range start times for Today / Week / Month / All |
| `src/lib/format-entry.spec.ts` | Time-of-day, day labels and short durations |
| `src/lib/sort-entries.spec.ts` | Sorting by date and duration in both directions |

## Gaps

- No visual or real-browser tests. Layout, the split-flap animation and the
  light/dark themes were checked by hand and with ad-hoc Playwright
  screenshots, not in CI.
- `TimerOverlay`'s minimize animation and `downloadFile` (Blob + anchor
  click) are only exercised indirectly.
