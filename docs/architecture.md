# Architecture

How Time Accumulator is put together as of v1.0.0. For what changed and
when, see [`CHANGELOG.md`](../CHANGELOG.md) and the git history.

## Stack

- React 19 + TypeScript 5, built with Vite (`vite.config.ts`)
- Plain CSS with custom properties: one `.css` file per component, plus the
  global tokens in `public/styles*.css` and the self-hosted IBM Plex Mono
  in `public/fonts/`
- No runtime dependencies beyond React
- Native `Date`/`Intl` for all time maths and formatting
- Vitest + jsdom for tests (see [`testing.md`](testing.md))
- npm, with Node pinned in `.nvmrc`
- Deployed to GitHub Pages by `.github/workflows/deploy.yml`, and released
  from `v*.*.*` tags by `.github/workflows/release.yml`

## Domain model

All types are global, declared in `src/types/domain.d.ts`.

| Type           | Shape                                       | Meaning                                                                 |
| -------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| `Pool`         | `{ id, name }`                              | A bucket that time accumulates into (e.g. "Deep work")                  |
| `TimeEntry`    | `{ id, poolId, timeIn, timeOut, state }`    | One finished timer run. `timeIn`/`timeOut` are unix seconds as strings  |
| `RunningTimer` | `{ poolId, timestamp }`                     | The single timer that can be running app-wide                           |
| `PoolEntryState` | `'counted' \| 'omitted'`                  | Omitted entries stay in the log but are left out of totals              |

Every new entry belongs to a pool. `poolId` is `null` only for time carried
over from the pre-pools single log (see "Legacy migration"). Activity shows
those entries as **Untagged** so they can be assigned to a pool.

## Component tree

```text
index.tsx
└─ RouterProvider            src/contexts/RouterContext.tsx
   └─ AppStateProvider       src/contexts/AppStateContext.tsx
      └─ App                 src/components/App.tsx
         ├─ DataView         data routes only: raw JSON, or a CSV download
         ├─ Onboarding       shown instead of everything below while no pool exists
         ├─ AppHeader        brand → Home, status, gear toggles Pools
         ├─ view (keyed by route)
         │  ├─ HomeView      ActionController (dial) + PoolChips + "LOG · NN ENTRIES →"
         │  ├─ ActivityView  RangeChips + EntrySortControl + EntryList + BulkBar
         │  ├─ PoolsList     pools, add/delete, complete-log CSV
         │  └─ PoolDetail    totals, entries, start/open, JSON/CSV links, delete
         └─ TimerOverlay     full-screen running view (Stop, Minimize, retag pool)
```

Shared pieces: `BracketFrame` (the square bracket-corner frame used by the
dial and the overlay), `ClockDisplay` (split-flap HH:MM:SS tiles),
`PoolChips`, `RangeChips` (Today, This week, Current month, Complete log), `EntryList`,
`EntrySortControl` (sort by date or duration, descending by default) and
`BulkBar` (the "{n} selected | Tag pool ▾ | Omit/Restore" footer, portaled to
`document.body`).

## State: `AppStateContext`

`src/contexts/AppStateContext.tsx` owns all app data. It persists three
values with `useLocalStorage`:

| Key                         | Value                   |
| --------------------------- | ----------------------- |
| `LOCALSTORAGE_POOLS_KEY`    | `Pool[]`                |
| `LOCALSTORAGE_ENTRIES_KEY`  | `TimeEntry[]`           |
| `LOCALSTORAGE_RUNNING_KEY`  | `RunningTimer \| false` |

`overlayOpen` is in-memory only, and `slugs` (pool id → unique URL slug) is
derived from the pool names with `poolSlugs` in `src/lib/slug.ts`.

Actions:

- `startTimer(poolId)` stores a `RunningTimer` stamped with the current time
  and opens the overlay.
- `stopTimer()` appends a counted `TimeEntry` from the running timer,
  clears it, and closes the overlay.
- `retagRunning(poolId)` moves the running timer to another pool.
- `addPool(name)` and `deletePool(poolId)`. Deleting a pool also deletes its
  entries, and a pool whose timer is running can't be deleted.
- `setEntriesState(ids, state)` omits or restores entries, and
  `assignPool(ids, poolId)` retags them (which also counts them again).
- `deleteEntry(id)`.
- `poolTotalMs(poolId, sinceSeconds)` sums the counted entries that ended
  after `sinceSeconds`.

`useLocalStorage` (`src/hooks/useLocalStorage.ts`) reads once on mount and
writes on every change. If storage is unavailable (private mode, quota) it
keeps working in memory.

### Legacy migration

Before pools, the app stored a single log under `LOCALSTORAGE_LOG_KEY` and a
check-in timestamp under `LOCALSTORAGE_CHECKIN_KEY`. They are read only as the
*default value* for the new keys, so the migration runs once, on the first
load after an upgrade: old log rows become untagged counted entries, and an
in-progress check-in becomes an untagged running timer. The old keys are left
untouched.

## Timer: `useTimer`

`src/hooks/useTimer.ts` doesn't count ticks. Every 100 ms it recomputes the
elapsed time from the running timer's start timestamp with `computeElapsed`.
That's why a reload, a closed tab or a throttled background tab never loses
time: the stored start timestamp is the whole truth. Hours are not wrapped at
24.

## Routing: `RouterContext`

`src/contexts/RouterContext.tsx` is a minimal History-API router: the URL is
the source of truth, `navigate()` pushes or replaces a history entry, and
back/forward work. Routes are parsed and built in `src/lib/routes.ts`, all
under the deploy base `/time-accumulator/`:

| Path                 | View                                                    |
| -------------------- | ------------------------------------------------------- |
| `/`                  | Home (timer)                                            |
| `/activity`          | Activity log                                            |
| `/pool`              | Pools list                                              |
| `/pool/json`         | The complete log as JSON, rendered as the page          |
| `/pool/csv`          | Downloads the complete log as CSV, then shows Pools     |
| `/pool/{slug}`       | One pool                                                |
| `/pool/{slug}/json`  | That pool's JSON document, rendered as the page         |
| `/pool/{slug}/csv`   | Downloads that pool's entries as CSV, then shows it     |

Unknown paths fall back to Home and the URL is corrected. `json` and `csv`
are reserved slugs, so a pool can never shadow a data route.

GitHub Pages has no server-side routing, so the `spa-404-fallback` plugin in
`vite.config.ts` copies `index.html` to `404.html` at build time, and the app
routes from `location.pathname` on any deep link.

## Export

`src/lib/export.ts` defines the stable data shapes for use outside the app:

- `time-accumulator/export` (version 1): the complete log
- `time-accumulator/pool` and `time-accumulator/pools`: one pool, or the
  "pool not found" document that lists the pools that do exist

Every entry is serialized the same way everywhere (ISO 8601 UTC start/end,
unix seconds, duration, pool name, state). CSV output includes a UTF-8 BOM
so spreadsheet apps detect the encoding. All data comes from this browser's
`localStorage`, so it reflects one device only.
