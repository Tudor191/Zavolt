# Zavolt

Zavolt is a password manager in early development. This repository holds its web application.

> **Status: foundation only.** Zavolt cannot store, encrypt or sync anything yet, and it has no
> sign-in. Do not put real credentials anywhere near it. Nothing here has been security-audited.

## What exists today

| Area                                                          | Status      | Notes                                                                                                      |
| ------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| Dashboard with links to Contact us, Vault and Account         | Implemented | The page a signed-in user will land on. Today it is shown to every visitor.                                |
| Loading screen                                                | Implemented | Shown for three seconds on each page load, as in the original site. Skipped when reduced motion is on.     |
| Client-side routing, including the original `.html` addresses | Implemented | `/`, `/contact`, `/vault`, `/account`, `/cart`, `/shop`, and a not-found page.                             |
| Contact us, Vault, Account, Cart and Shop pages               | Placeholder | Each says "This section is not available yet." and links back. No functionality.                           |
| Browser hardening (CSP, Trusted Types, no third-party code)   | Partial     | Shipped in the page. The HTTP response headers a host must add are listed in [SECURITY.md](./SECURITY.md). |
| Sign-up, sign-in, sessions                                    | Planned     | No authentication of any kind exists.                                                                      |
| Vault: storing, encrypting, syncing credentials               | Planned     | No cryptography has been written. See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).                      |
| Backend API, desktop application, browser extension           | Planned     | Not started.                                                                                               |
| Account recovery, device management, key rotation             | Planned     | Design direction only.                                                                                     |

`/cart` and `/shop` come from the site template this project started from. They are not linked from
the dashboard and exist only so old addresses keep working. Whether to remove or repurpose them is an
open product decision.

## Getting started

You need Node.js 24.15 or later (see `.nvmrc`). The Node.js 22 line is also supported from 22.22.2.

```bash
npm ci
```

```bash
npm run dev
```

The development server prints its address, normally <http://localhost:5173>.

No environment variables, API keys or external services are needed.

## Commands

| Command             | What it does                                                                         |
| ------------------- | ------------------------------------------------------------------------------------ |
| `npm run dev`       | Start the development server with hot reloading.                                     |
| `npm run build`     | Type-check, then build the production bundle into `dist/`.                           |
| `npm run preview`   | Serve the production build locally on port 4173.                                     |
| `npm run typecheck` | Type-check the application, the configuration files and the tests.                   |
| `npm run lint`      | Lint with oxlint, including type-aware, accessibility and security rules.            |
| `npm run format`    | Format every file with Prettier. `npm run format:check` only reports.                |
| `npm test`          | Run the unit and component tests once. `npm run test:watch` re-runs them on change.  |
| `npm run test:e2e`  | Build, then run the end-to-end tests in Chromium against the production build.       |
| `npm run check`     | Type-check, lint, check formatting, run unit tests and build. Run it before pushing. |

The end-to-end tests need a browser the first time:

```bash
npx playwright install chromium
```

## Project layout

```text
index.html              Application shell, including the Content-Security-Policy
public/                 Files served as they are (the logo, third-party notices)
src/
  main.tsx              Entry point: fonts, global styles, frame check, React root
  App.tsx               Router and loading screen
  AppRoutes.tsx         Route table and focus handling after navigation
  sections.ts           Sections, their routes, and the original site's addresses
  components/           Loader, icon set and the shared message page
  pages/                Dashboard, section placeholder and not-found pages
  styles/global.css     Reset, design tokens and accent colours
  test/                 Test setup
e2e/                    End-to-end tests (Playwright)
docs/                   Architecture and the audit of the original site
.github/                CI workflow and Dependabot configuration
```

Tests sit next to the code they cover, as `*.test.tsx`.

## Quality gates

Continuous integration runs three jobs on every pull request, on pushes to `main`, and weekly:

- **verify**: type-check, lint, formatting, unit tests, production build.
- **e2e**: the end-to-end suite against the production build, at desktop and phone sizes. It covers
  navigation by mouse, keyboard and touch, the Content-Security-Policy and that the browser enforces
  it, accessibility scans, and layout at seven screen widths.
- **audit**: `npm audit` and `npm audit signatures`.

## Dependencies

The dependency tree is kept small on purpose, because every package is code that could one day run
next to someone's passwords.

- Four packages ship to users: `react`, `react-dom`, `react-router` and the self-hosted
  `@fontsource/poppins` font.
- Versions in `package.json` are exact, and `package-lock.json` pins everything else.
- Dependency install scripts never run (`.npmrc`).
- Updates wait until a release has been public for seven days (`.github/dependabot.yml`).

When you add or upgrade a dependency by hand, keep to the same waiting period, for example:

```bash
npm install --before="$(date -u -d '7 days ago' +%F)" <package>
```

## Deploying

No hosting has been chosen. `npm run build` produces static files in `dist/`. Whatever serves them
must:

- serve the application from the root of an origin used for nothing else, over HTTPS only;
- answer unknown paths with `index.html`, so that client-side routes and the original `.html`
  addresses work when opened directly;
- send the security response headers listed in [SECURITY.md](./SECURITY.md).

`npm run preview` is a local convenience and is not a production server.

## Security

Read [SECURITY.md](./SECURITY.md) for the current security posture, how to report a vulnerability,
and the rules that code in this repository must follow.

## Further reading

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md): how the application is built today and the planned
  design of the full product, including zero-knowledge encryption.
- [docs/AUDIT.md](./docs/AUDIT.md): the audit of the original static site and what was done about
  each finding.

## Licence

No licence has been chosen for this project, so all rights are reserved by its owner. Licences of
bundled third-party code are listed in `public/THIRD-PARTY-NOTICES.txt` and in
`THIRD-PARTY-LICENSES.md`, which the build writes into `dist/`.
