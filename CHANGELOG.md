# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Pages deploys no longer fail intermittently with "Fetching artifact
  metadata failed": the deploy workflow now builds and deploys in separate
  jobs, and runs one deployment at a time.

## [1.0.1] - 2026-11-28

### Changed

- Rewrote `docs/architecture.md` and `docs/testing.md` to describe the
  current app instead of the original Create React App version.
- New tagline in the README, page description and web app manifest:
  "Toggle time on and off and accumulate it into pools."

### Removed

- Unused modules left from the original app: `storage-reducer`,
  `format-timestamp`, their types and specs, and `reportWebVitals` along
  with the `web-vitals` dependency.

## [1.0.0] - 2026-11-28

### Added

- App icon (a square bracket frame around three colons), favicons, web app
  manifest and link-preview tags.
- README rewrite with screenshots, badges and a release procedure.
- MIT `LICENSE` file, this changelog, Dependabot configuration and a release
  workflow that publishes a GitHub Release for every pushed `v*.*.*` tag.

### Changed

- CI pins Node 24 through `.nvmrc` and uses current GitHub Actions majors.

### Fixed

- The deploy workflow failed under Node 26, whose built-in `localStorage`
  global shadowed jsdom's in the test suite.

### Removed

- Leftover Create React App icons and `manifest.json`.

## 0.4.0 - 2026-11-28

### Added

- Pools: every timer belongs to a pool, with a blocking first-pool setup.
- Activity log with Today / This week / Current month / Complete log ranges,
  date sorting and bulk tag / omit / restore; omitted entries can be deleted.
- Pool totals per range and a pool detail view.
- Routes with deep links and back/forward support: `/activity`, `/pool`,
  `/pool/{slug}`; GitHub Pages fallback via `404.html`.
- Export: CSV downloads and in-browser JSON for the complete log and for each
  pool.
- Header status showing the running pool's slug.

### Changed

- Replaced the navigation drawer with header navigation (app name returns
  home, the gear toggles Pools).
- Deleting a pool is blocked while its timer is running.

## 0.3.0 - 2026-11-27

### Added

- Monochrome design system with dark and light themes following
  `prefers-color-scheme`, using IBM Plex Mono.
- Split-flap digit tiles and a bracket-corner frame that doubles as the start
  control.
- Easing motion that respects `prefers-reduced-motion`.

### Removed

- Bootstrap and react-bootstrap.

### Fixed

- Elapsed hours no longer wrap at 24.

## 0.2.0 - 2026-07-01

### Changed

- Switched from Yarn to npm.
- Migrated from Create React App to Vite.
- Upgraded React 17 to React 19.
- Replaced Moment.js with native `Date`/`Intl`.
- Replaced Jest and Testing Library with Vitest.

### Added

- GitHub Actions workflow that tests, builds and deploys to GitHub Pages.

## 0.1.0 - 2021-07-18

### Added

- Original Create React App / React 17 version: start/stop timer with a
  `localStorage`-backed log, styled with react-bootstrap.

[Unreleased]: https://github.com/cowglow/time-accumulator/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/cowglow/time-accumulator/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/cowglow/time-accumulator/releases/tag/v1.0.0
