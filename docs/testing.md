# Testing (pre-modernization snapshot)

Snapshot of the test suite as it exists today, before the Vitest/tooling
migration. There are exactly **two** test files in the repo. Both run
through `react-scripts test` (CRA's wrapped Jest + `@testing-library/react`
+ `@testing-library/jest-dom`, configured via `src/setupTests.ts` and the
`eslintConfig.extends: ["react-app", "react-app/jest"]` block in
`package.json`). There is no separate Jest config file — CRA supplies it
internally.

## Test files

### 1. `src/lib/format-timestamp/format-timestap.spec.js`
(filename typo — "timestap" — is in the repo as-is)

Tests `src/lib/format-timestamp/format-timestamp.ts`, specifically:

- `formatTimestamp(timestamp)`: asserts a fixed unix timestamp
  (`352799100`) converts to the expected ISO string
  (`'1981-03-07T07:45:00.000Z'`). This is really just asserting
  `new Date(s * 1000).toISOString()` behaves as native `Date` guarantees —
  low-value test, but not broken.
- `formatLog(start, end)`: asserts `formatLog(352799100, 1615114800)`
  equals `'03:15:00'`.
  - **This test is broken and fails as written.** Running the actual
    implementation of `formatLog` (`src/lib/format-timestamp/format-timestamp.ts`)
    against these exact inputs produces `"Sun 7 03:15:00 11:11"` (day
    name + date + `HH:MM:SS` + duplicated UTC-hour suffix), not
    `"03:15:00"`. Verified directly by executing the function's logic
    outside the test runner (not by running the Jest suite itself, since
    `node_modules` isn't installed in this snapshot). `toEqual` does not
    do partial/substring matching, so this assertion cannot pass — this
    test is currently broken, not just low-value.

Neither test touches React rendering — both are plain function tests, no
`@testing-library` usage despite the file living under a CRA/RTL setup.

### 2. `src/lib/storage-reducer/storage-reducer.spec.js`

Tests `src/lib/storage-reducer/storage-reducer.ts`, a Redux-style reducer
with action types `START_RECORDING`, `ADD_TASK`, `UPDATE_TASK`,
`CLEAR_COMPLETED`.

- Only one test: dispatching `START_RECORDING` with payload `"working on
  it"` against initial state `[]` produces
  `[{ comment: "working on it", start: formatTimestamp(new Date().getTime()) }]`.
  - **This test is broken, and not just flaky.** `storageReducer`'s
    `START_RECORDING` branch calls `formatTimestamp(currentDate.getTime())`
    — but `getTime()` already returns **milliseconds**, and
    `formatTimestamp` does `new Date(s * 1e3)`, i.e. it expects **unix
    seconds** and re-multiplies by 1000. So the reducer feeds it
    milliseconds-treated-as-seconds, producing a bogus far-future date
    (verified directly: this produces timestamps like
    `"+058468-12-06T01:27:54.000Z"`, i.e. year 58468). The test's
    *expected* value independently calls the same buggy
    `formatTimestamp(new Date().getTime())`, so in principle both sides
    could match if the two `getTime()` calls (reducer's and test's)
    return the identical millisecond value — but because that value gets
    multiplied by 1000 before formatting, even a 1-2ms difference between
    the two calls (normal in practice) is amplified into a visibly
    different date/time in the resulting ISO string. Verified directly by
    re-running the reducer/test logic outside Jest: a 3ms real-world gap
    between the two calls produced two different ISO strings
    (`...:27:54.000Z` vs `...:27:57.000Z`), i.e. **mismatch** — so this
    test should be expected to fail non-trivially often, not just at rare
    boundaries. Not mocked, not frozen (`Date.now` / fake timers).
  - **`storageReducer` itself is dead code** — see `docs/architecture.md`
    "Dead / unused code": it's not imported by any context, component, or
    hook in `src/`. This test provides zero coverage of anything the app
    actually does at runtime.

## What is NOT tested at all

- **`useTimer`** (`src/hooks/useTimer.ts`) — the core timer/duration
  logic described in `docs/architecture.md` has **no tests whatsoever**.
  No coverage of: start/stop transitions, elapsed-time computation,
  the reset-to-zero path, or the reload/resume-from-persisted-timestamp
  behavior.
- **`AppStateContext`** (`src/contexts/AppStateContext.tsx`) — the
  toggle/log/localStorage logic that actually drives the app has no
  tests. No coverage of `actionToggle`'s start-vs-stop branching, log
  accumulation, or `resetLog`.
- **`AppStageContext`** — untested, but also unused by the app (see
  architecture doc), so this is lower priority.
- **`useLocalStorage`** (`src/hooks/useLocalStorage.ts`) — no tests. No
  coverage of the lazy-init-from-`localStorage` path or the
  write-on-every-render behavior.
- **Any component** — `App`, `ActionController`, `ClockDisplay`,
  `Drawer`, `LogDisplay` have zero rendering/interaction tests, despite
  `@testing-library/react` and `@testing-library/user-event` being
  installed as dependencies. They are present in `package.json` but
  currently unused by any spec file in the repo.

## Summary: coverage gap vs. what matters

The two existing tests cover a low-value pure-formatting function and a
reducer that isn't even wired into the app. The actual stateful,
user-facing logic — the timer hook's elapsed-time computation, the
start/stop/localStorage flow in `AppStateContext`, and the reload/resume
edge case — has **no automated test coverage today**. This is the gap
Phase 1's Vitest rewrite is meant to close, prioritizing direct
unit tests of `useTimer` and `AppStateContext` over rendering-based
smoke tests.