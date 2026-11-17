# Zavolt: instructions for the next coding agent

Read this whole document before you run a command or change a file.

You do not have access to the conversations in which this project was built. Assume you know nothing
about it except what is written here and what you can verify in the repository yourself.

**If this document and the repository disagree, the repository is right.** Stop, find out why they
differ, and correct this document as part of your work.

- Repository: <https://github.com/Tudor191/Zavolt>
- This file: `docs/agent-handoff/NEXT_AGENT_PROMPT.md`
- Written: 16 November 2026, at the start of Phase 2. Section 2 is the state snapshot and says when
  it was last refreshed.

## 0. Ten rules you must not break

These come from the project owner. They apply to every task, including small ones.

1. **Read the existing documentation before you propose or make any change.** The list is in
   section 11. Architecture and security proposals start from `docs/ARCHITECTURE.md`, `SECURITY.md`
   and `docs/DECISIONS.md`.
2. **Never invent project history, and never claim that something works unless you ran it and saw it
   work.** If you did not run a check, say "not run" and say why.
3. **Never implement a custom cryptographic algorithm or protocol.** Do not write cryptographic code
   until the design has been through the internal review in `SECURITY.md` (Cryptographic design
   review) and the owner has explicitly approved that implementation stage. Never invent a
   construction, and never implement one without documented justification.
4. **Never weaken a security control to make a test, a build or a feature pass.** That includes the
   Content-Security-Policy, Trusted Types, lint rules, tests and CI jobs.
5. **Never put secrets, keys or decrypted vault contents in browser storage.** That means
   `localStorage`, `sessionStorage`, IndexedDB and cookies that script can read.
6. **Never begin implementation without the owner's explicit approval, and never do it on
   `main`.** Each implementation stage needs that approval before it starts; approving
   documentation or a plan is not approval to implement it. Code is written only on a dedicated
   feature branch and reaches `main` only through a pull request. Only documentation-only changes
   the owner asked for are committed directly to `main` (section 5.1).
7. **Never force-push**, to any branch.
8. **Never merge a pull request unless the owner has explicitly told you to merge that specific pull
   request.** Green checks are not permission.
9. **Run the complete verification suite (section 12) before you open a pull request.**
10. **Put every cryptographic decision through the documented internal review, and keep the
    external audit.** ChatGPT and Claude carry out that review (`SECURITY.md`); only the owner
    decides, and you never settle one yourself, however confident you are. The review is not
    independent: never describe it as an audit or as a specialist's review. The independent
    external security audit before any public release stays mandatory.

If a task seems to require breaking one of these, stop and ask the owner (section 17).

## 1. What Zavolt is

Zavolt is a password manager in early development. The owner intends it to become a commercial
product in the same category as LastPass, Bitwarden and 1Password. Its public address is meant to be
`https://zavolt.com/`.

The long-term product has three clients and a backend:

| Part                | Purpose                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| Web application     | Account management, vault management, security settings. This repository.                                      |
| Desktop application | A vault for credentials used outside the browser: desktop software and game launchers.                         |
| Browser extension   | Recognise sign-in pages, suggest saved credentials, fill them in, and offer to save new ones.                  |
| Backend API         | Store encrypted data, authenticate clients, synchronise devices. It must never be able to read vault contents. |

Examples of what users should be able to keep in it: Steam, Riot Games, Epic Games, Discord, Ubisoft
Connect, EA App, Battle.net, Google, Microsoft, and any other website or application.

Security is the highest priority of the project. The intended model is zero-knowledge encryption:
the server stores only data it cannot decrypt (sections 7 and 8).

**Zavolt is not a working password manager.** It cannot store, encrypt or synchronise anything, and
nobody can sign in. Never write, in code, documentation, a pull request or page copy, that it can.

## 2. State snapshot

_Last refreshed: 17 November 2026, after the owner's decisions on how work is done were recorded
directly on `main` (section 2.1). Whoever finishes a phase, or changes how work is done, must
refresh this section._

Verify every line below yourself (section 11) before relying on it.

### 2.1 Phases

| Phase | What it was                                                                                         | State when this was last refreshed                                                                 |
| ----- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1     | Audit of the original static site, migration to React and TypeScript, tooling, tests, CI, documents | Merged into `main` as commit `742b205` (squash merge of pull request 1), with the owner's approval |
| 2     | Homepage, dashboard moved to `/app`, placeholders, brand mark, padlock-and-key loader, this file    | Merged into `main` as commit `7ab28f3` (squash merge of pull request 2), with the owner's approval |

Pull request 2 is <https://github.com/Tudor191/Zavolt/pull/2>. The owner approved it, and it was
squash-merged on 16 November 2026 from `feature/public-landing-page` at `e190de5`. The commit on
`main`, `7ab28f3`, has exactly that commit's content. The branch's own commits are not part of
`main`'s history.

Phase 2 is complete. No later phase has been started: the owner decides what comes next
(section 18).

Pull request 3 (<https://github.com/Tudor191/Zavolt/pull/3>), which refreshed this file after
Phase 2, was squash-merged as `dbadf4e`.

On 17 November 2026 the owner approved new rules for how work is done (`docs/DECISIONS.md`):
documentation-only changes go directly to `main`; code goes through feature branches and pull
requests; every implementation stage and every merge needs the owner's explicit approval; and the
cryptographic design is reviewed internally by ChatGPT and Claude instead of by a cryptography
specialist, while the independent audit before any public release stays mandatory. The
documentation was updated in one commit directly on `main`. That was not the start of Phase 3.

### 2.2 Branches

| Branch                                           | What it is                                                         | Rule                         |
| ------------------------------------------------ | ------------------------------------------------------------------ | ---------------------------- |
| `main`                                           | The integration branch. Every pull request targets it.             | Code only via pull requests. |
| `conversie-html-to-typescript`                   | The original branch, holding the original static site (9 commits). | Never change or delete it.   |
| `claude/zavolt-html-typescript-migration-w69ttq` | Phase 1, then pull request 3 (the Phase 2 handoff). Both merged.   | Leave it. Do not delete it.  |
| `feature/public-landing-page`                    | The Phase 2 implementation branch (pull request 2, merged).        | Leave it. Do not delete it.  |

Documentation-only changes that the owner asks for are committed directly to `main` (section 5.1).
Code never is.

When this was last refreshed, `main` was at `dbadf4e` and the documentation commit carrying this
text was added directly on top of it. `conversie-html-to-typescript` was untouched at `cbc08b4`, and
**the repository's default branch was `main`**. The owner switched it by hand after Phase 1: the
agent session of that phase could not, because its GitHub tools had no repository-settings
operation (section 5.3). Check the current default with `git ls-remote --symref origin HEAD` before
you rely on it.

`main` contains everything described below.

### 2.3 What is implemented

- A public homepage at `/`: hero, product, security, platforms, about and roadmap, and a closing
  call to action. Every feature and platform carries a status label.
- A site header with a mobile menu, and a site footer, shared by every public page.
- The Zavolt brand mark and favicons (`src/site/Brand.tsx`, `public/favicon.*`).
- Placeholder pages that say plainly what does not exist: sign-in, registration, contact, privacy
  policy and terms of service.
- The dashboard at `/app`: three animated rings that link to Contact us, Vault and Account,
  unchanged from the original site.
- A loading screen that shows for three seconds, once per page load, the first time an application
  page opens. Public pages never show it. Its artwork is a padlock and a key, drawn in SVG and
  animated once in CSS: the key goes in, turns, the padlock opens and the key comes out. It is
  decorative. Nothing is unlocked, checked or decrypted while it plays.
- Application placeholder pages that state "This section is not available yet." and link back.
- Redirects from the original site's `.html` addresses.
- Browser hardening that ships inside the page (section 6.2).
- Type-checking, linting, unit tests, end-to-end tests and continuous integration.
- Documentation of the current state, the decisions so far, and the planned design.

### 2.4 What does not exist

None of the following has been started. Do not describe any of it as existing.

- Accounts, registration, sign-in, sessions, multi-factor authentication.
- Any cryptography: key derivation, encryption, key management.
- The vault: storing, editing, organising or synchronising credentials.
- A backend, a database or an API. The application makes no network requests of its own.
- Account recovery and device management.
- The desktop application and the browser extension.
- Hosting, and therefore the security response headers a host must send (`SECURITY.md`).
- Privacy policy and terms of service. No legal text has been written.
- A contact channel.
- A licence. None has been chosen.

### 2.5 Known limitations

- **Nothing is authenticated.** `/app` and every other route are served to every visitor. No code
  may assume a visitor has been identified.
- The loading screen waits on a timer. No work happens during it.
- The padlock opening in the loader is a picture, not an operation. Never describe it as unlocking
  anything, and never reuse it to suggest progress a real unlock is not making.
- `/cart` and `/shop` are inherited from the template the project began as. The owner has decided
  to keep them as application placeholders, with their old `.html` addresses redirecting.
- The homepage states four security commitments: a specialist review of the encryption design
  before it is built, an independent audit before any public release, no advertising or tracking
  code, and no recovery design that lets Zavolt decrypt a vault. The owner confirmed them on
  16 November 2026 (`docs/DECISIONS.md`). On 17 November 2026 the owner replaced the first with the
  internal review in `SECURITY.md`, **but the homepage still states it**, in
  `src/site/home/AboutSection.tsx` and `src/site/home/SecuritySection.tsx`. Changing that text is
  a code change: it needs the owner's approval, a feature branch and a pull request. The other
  three commitments stand. They are commitments about the future. None of them is a feature, and
  nothing may describe them as done.
- Browser checks run in Chromium only. Firefox and Safari have not been tested.
- The development server does not apply the Content-Security-Policy (section 6.2).
- Pages are rendered in the browser. Nothing is pre-rendered, so search engines and link previews
  see only the shell and its description.

## 3. Technology and repository map

### 3.1 Stack

| Layer             | Choice                                             | Notes                                                       |
| ----------------- | -------------------------------------------------- | ----------------------------------------------------------- |
| Runtime for tools | Node.js 24 (`.nvmrc`). 22.22.2+ is also supported. | Package manager is npm.                                     |
| Language          | TypeScript 7, strict                               | `tsc -b` type-checks. `any` is banned by the linter.        |
| User interface    | React 19                                           | Function components only.                                   |
| Routing           | React Router 8, declarative mode                   | `BrowserRouter`, `Routes`, `Route`, `Link`, `Navigate`.     |
| Build             | Vite 8                                             | Output is static files in `dist/`.                          |
| Styling           | CSS Modules plus one global stylesheet             | No inline styles. The Content-Security-Policy forbids them. |
| Linting           | **oxlint** with type-aware rules. Not ESLint.      | Configuration: `.oxlintrc.json`.                            |
| Formatting        | Prettier                                           | `npm run format`.                                           |
| Unit tests        | Vitest, Testing Library, jsdom                     | Files named `*.test.tsx` next to the code.                  |
| End-to-end tests  | Playwright (Chromium) with axe-core                | In `e2e/`. They run against the production build.           |
| Font              | Poppins, self-hosted through `@fontsource/poppins` | Never load a font from another origin.                      |
| State management  | None                                               | Add shared state only when a feature needs it.              |

Four packages ship to users: `react`, `react-dom`, `react-router`, `@fontsource/poppins`. Everything
else is tooling.

### 3.2 Files that exist after Phase 1

| Path                                      | What it is                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `index.html`                              | Application shell. **Contains the Content-Security-Policy.**                                      |
| `src/main.tsx`                            | Entry point: fonts, global styles, refusal to run in a frame, React root.                         |
| `src/App.tsx`                             | Router and top-level composition.                                                                 |
| `src/AppRoutes.tsx`                       | The route table, and focus handling after navigation.                                             |
| `src/sections.ts`                         | The list of application sections, their routes, and the original site's addresses.                |
| `src/components/SplashGate.tsx`           | Shows the loader for three seconds, then reveals its children.                                    |
| `src/components/SplashLoader.tsx`         | The loader's padlock and key: SVG, animated by CSS in its module. Decorative.                     |
| `src/components/Icon.tsx`                 | Icons bundled as inline SVG (from Ionicons, MIT licence).                                         |
| `src/components/MessagePage.tsx`          | A page that states one thing and links back. Used by every placeholder.                           |
| `src/pages/DashboardPage.tsx`             | The dashboard.                                                                                    |
| `src/pages/SectionPlaceholderPage.tsx`    | Placeholder for a section that has no functionality.                                              |
| `src/pages/NotFoundPage.tsx`              | Unknown addresses.                                                                                |
| `src/styles/global.css`                   | Reset, design tokens, accent colours.                                                             |
| `src/test/setup.ts`, `matchMedia.ts`      | Unit-test setup.                                                                                  |
| `e2e/app.spec.ts`, `e2e/fixtures.ts`      | End-to-end tests and their shared fixture.                                                        |
| `public/`                                 | Files served as they are.                                                                         |
| `vite.config.ts`                          | Build configuration, the development-only removal of the policy, and the unit-test configuration. |
| `playwright.config.ts`                    | End-to-end configuration: a `desktop` and a `phone` project, production preview on port 4173.     |
| `.oxlintrc.json`                          | Lint rules, including the security rules in section 6.3.                                          |
| `.npmrc`                                  | `ignore-scripts=true` and `save-exact=true`. Do not remove either.                                |
| `.github/workflows/ci.yml`                | Continuous integration (section 5.2).                                                             |
| `.github/dependabot.yml`                  | Weekly dependency update proposals with a seven-day waiting period.                               |
| `README.md`                               | What exists, how to run it, how to deploy it.                                                     |
| `SECURITY.md`                             | Security status, required response headers, and the security rules for code.                      |
| `docs/ARCHITECTURE.md`                    | Part 1: the application as built. Part 2: the planned product.                                    |
| `docs/AUDIT.md`                           | The audit of the original static site and the outcome of every finding.                           |
| `docs/agent-handoff/NEXT_AGENT_PROMPT.md` | This file.                                                                                        |

### 3.3 Files added in Phase 2

| Path                                                 | What it is                                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `src/pages/HomePage.tsx`                             | The homepage: composes the sections below.                                                 |
| `src/site/SiteLayout.tsx`                            | Frame of every public page: skip link, header, the page, footer.                           |
| `src/site/SiteHeader.tsx`                            | Header and mobile menu (a disclosure button).                                              |
| `src/site/SiteFooter.tsx`                            | Footer with the development status and links.                                              |
| `src/site/Brand.tsx`                                 | The brand mark and wordmark. `public/favicon.svg` is the same drawing.                     |
| `src/site/ButtonLink.tsx`                            | A link styled as a button. The public site has no real buttons apart from the menu toggle. |
| `src/site/StatusBadge.tsx`                           | The Done / In development / Planned label.                                                 |
| `src/site/SectionHeader.tsx`                         | Eyebrow, focusable `<h2>` and introduction for a homepage section.                         |
| `src/site/ui.module.css`                             | Shared styles: container, sections, buttons, cards.                                        |
| `src/site/home/*`                                    | The homepage sections and the CSS-only orbit illustration.                                 |
| `src/motion.ts`, `src/classNames.ts`                 | Reduced-motion check; joining CSS Module class names.                                      |
| `e2e/site.spec.ts`                                   | End-to-end tests for the public site.                                                      |
| `src/components/SplashLoader.test.tsx`               | Unit tests for the loader's drawing. Its animation is tested end to end, in `app.spec.ts`. |
| `docs/DECISIONS.md`                                  | The decision log (section 15).                                                             |
| `public/favicon.svg`, `.ico`, `apple-touch-icon.png` | Favicons. `public/images/logo.png` (the old "TDR" image) is kept so its address works.     |

How to add a page:

- **A public page:** add a `<Route>` inside the `SiteLayout` route in `src/AppRoutes.tsx`. The page
  renders one `<main id="main-content" tabIndex={-1}>`, one `<h1 tabIndex={-1}>` and a `<title>`.
  `MessagePage` already does all of that.
- **An application page:** add it to `SECTIONS` in `src/sections.ts` with `area: 'application'`.
  `isApplicationPath` then plays the loading screen for it, and `AppRoutes` renders it.
- Either way, add it to the unit tests in `src/AppRoutes.test.tsx` and to the accessibility and
  honesty lists in the end-to-end tests.

## 4. Routes

Before Phase 2 the dashboard was at `/`. Phase 2 moved it to `/app` and made `/` the homepage.

| Address                                     | What it shows                                     | Area        | Status                         |
| ------------------------------------------- | ------------------------------------------------- | ----------- | ------------------------------ |
| `/`                                         | The public homepage                               | Public site | Implemented                    |
| `/login`                                    | States that signing in is not available yet       | Public site | Placeholder                    |
| `/register`                                 | States that registration is not open yet          | Public site | Placeholder                    |
| `/contact`                                  | States that the section is not available yet      | Public site | Placeholder                    |
| `/privacy`, `/terms`                        | State that no policy or terms have been published | Public site | Placeholder                    |
| `/app`                                      | The application dashboard                         | Application | Implemented, not authenticated |
| `/vault`, `/account`                        | State that the section is not available yet       | Application | Placeholder                    |
| `/cart`, `/shop`                            | Same; kept by the owner's decision                | Application | Placeholder                    |
| `/index.html`                               | Redirects to `/app`                               |             | Redirect                       |
| `/account.html`, `/cart.html`, `/shop.html` | Redirect to `/account`, `/cart`, `/shop`          |             | Redirect                       |
| anything else                               | Not found                                         | Public site | Implemented                    |

The source of truth is `src/sections.ts` (paths, areas, placeholder texts, redirects) and
`src/AppRoutes.tsx` (the route table).

Rules for routes:

- The homepage is public marketing. The dashboard is the application. Keep them apart.
- `/login` and `/register` must stay honest placeholders until real authentication exists. No forms,
  no inputs, no buttons that look like they do something.
- Do not remove or rename a route without the owner's approval. Old addresses must keep working.
- The two areas are about presentation, not access. A route guard in the browser is not security.
  Real protection comes from a server that releases data only to authenticated sessions. Until that
  server exists, nothing is protected.

## 5. Branches and GitHub workflow

### 5.1 The workflow

Work follows one of two paths. The owner set these rules on 17 November 2026
(`docs/DECISIONS.md`).

**Documentation-only changes** touch nothing but Markdown documentation: `README.md`, `SECURITY.md`
and files under `docs/`. Text shown on the website lives in source files, so changing it is a code
change.

1. Make them only when the owner has asked for them.
2. Work directly on an up-to-date `main`. No feature branch is needed.
3. Preserve the project's history and decisions. Add rows to `docs/DECISIONS.md`; never rewrite or
   delete old ones.
4. Run `npm run format:check`: continuous integration checks the formatting of Markdown too.
5. Keep the diff clear. Before committing, show the owner the changed files and a summary of the
   diff. Then make one descriptive commit and push it to `main`.
6. If pushing to `main` is refused, report the exact refusal. Do not open a branch or a pull request
   as a workaround unless the owner says so.

Approving documentation is never approval to implement what it describes.

**Code and implementation work** is everything else: source code, tests, configuration, continuous
integration, dependencies and website text.

1. Start only when the owner has explicitly approved this implementation stage.
2. Start from an up-to-date `main` and create a dedicated feature branch for the task. Never reuse
   someone else's branch unless told to. Never write code directly on `main`.
3. Make small commits that each do one thing, with messages that say what and why.
4. Run the complete verification suite (section 12).
5. Push your branch and open a pull request that targets `main`.
6. Wait for continuous integration. Fix every failure by fixing its cause.
7. Leave the pull request open for the owner. Never merge it without the owner's explicit approval
   for that pull request.

Section 13 gives the exact commands for both paths.

### 5.2 Continuous integration

`.github/workflows/ci.yml` runs on every pull request, on every push to `main`, and weekly. It has
three jobs, and all three must pass:

| Job name on GitHub               | What it runs                                                                             |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| Type-check, lint, test and build | `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`, `npm run build` |
| End-to-end tests                 | Installs Chromium, then `npm run test:e2e`                                               |
| Dependency audit                 | `npm audit --omit=dev`, `npm audit --audit-level=high`, `npm audit signatures`           |

Actions are pinned to full commit hashes on purpose. Do not replace a hash with a tag.

### 5.3 Things an agent session may not be allowed to do

Some operations need repository administration rights: changing the default branch, branch
protection, enabling private vulnerability reporting or Dependabot alerts. If such an operation is
refused, do not look for a workaround. Report the exact refusal and give the owner the manual steps.

To switch the default branch by hand: repository **Settings**, **General**, **Default branch**,
switch icon, choose `main`, confirm.

## 6. Security requirements in force today

Read `SECURITY.md` in full. This section summarises it and adds what an agent needs to know.

### 6.1 Rules for code

1. Nothing shipped to the browser is secret. Never put API keys, tokens or credentials in client
   code, in bundled configuration, or in the repository.
2. Never log sensitive values: no passwords, keys, tokens, vault contents or personal data in logs,
   errors or analytics.
3. Never build HTML from strings. Render through React.
4. Never write secrets, keys or decrypted vault data to browser storage.
5. Never load code, fonts, styles, images or analytics from another origin at runtime.
6. Never invent cryptography.
7. Treat every dependency as code you are responsible for.
8. Do not loosen a security control to make something pass.

### 6.2 The Content-Security-Policy

The production page carries this policy in a `<meta>` tag in `index.html`:

```text
default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self';
connect-src 'self'; base-uri 'none'; form-action 'self';
require-trusted-types-for 'script'; trusted-types 'none'
```

What that means for your code:

- No inline `<script>`, no inline event handlers, no `eval`, no `new Function`.
- No inline styles. Do not use the `style` attribute or React's `style` prop. Put values in CSS
  Modules. Where a value depends on data, switch a class or a `data-` attribute.
- No `data:` URIs. The build never inlines assets (`assetsInlineLimit: 0` in `vite.config.ts`).
- No resource from another origin, of any kind.
- No assignment of strings to `innerHTML`, `outerHTML` or similar. Trusted Types makes it throw.

How it is enforced:

- `e2e/app.spec.ts` asserts the exact text of the policy and that the browser blocks injected HTML,
  inline handlers and `eval`.
- The development server removes the policy, because hot reloading cannot run under it
  (`vite.config.ts`). **So a violation works in `npm run dev` and fails in production.** Always run
  `npm run test:e2e`, which uses the production build.

Changing the policy is a security decision. Do not change it, or the test that pins it, without the
owner's explicit approval. One change is already foreseen: running Argon2 as WebAssembly will need
`'wasm-unsafe-eval'` in `script-src`. That still needs approval when the time comes.

### 6.3 Lint rules that exist for security

`.oxlintrc.json` makes these errors. Do not disable them, globally or with a comment:

- `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `dangerouslySetInnerHTML`
- `eval`, `new Function`, `javascript:` URLs
- `localStorage`, `sessionStorage`, `document.cookie`
- `console` calls, `alert`
- `any`, non-null assertions, `@ts-ignore`, unhandled promises

There are three `oxlint-disable-next-line` comments in the repository, each with a written reason.
Two are in the end-to-end test that deliberately attacks the page. Do not add more without a reason
a reviewer would accept.

### 6.4 Dependencies

- Add a dependency only when the alternative is clearly worse. Do not add a library for a visual
  effect.
- Versions in `package.json` are exact. `package-lock.json` pins the rest. Never edit the lockfile by
  hand.
- Dependency install scripts never run (`.npmrc`).
- Do not install a release that is less than seven days old:

```bash
npm install --before="$(date -u -d '7 days ago' +%F)" <package>
```

- Use `npm ci` to install what the lockfile says. Use `npm install` only when you are changing
  dependencies.

### 6.5 Other protections that exist

- The application refuses to start inside a frame (`src/main.tsx`).
- The page asks browsers to send no referrer.
- All content is rendered through React, which escapes text.

## 7. Proposed zero-knowledge architecture

> **This is a proposal. It is not approved, it is not final, and none of it is implemented.**
> Do not implement any part of it. It must first be written out in full, go through the internal
> review in `SECURITY.md`, and be approved by the owner, one implementation stage at a time. Until
> then, treat every detail below as open to change. The internal review's own provisional
> recommendations are in `docs/ARCHITECTURE.md`, section 2.16. They are not approved either.

The full text is in `docs/ARCHITECTURE.md`, Part 2. In brief:

Principles the owner requires:

1. The master password never leaves the device in any form the server could use to recover it.
2. Vault contents are encrypted on the device before they are sent anywhere.
3. The server stores ciphertext and never receives a key that can decrypt it.
4. Signing in and decrypting use separate keys.
5. Every field a user enters is encrypted, including names and web addresses.
6. Recovery never gives the server, or the company, a way to decrypt.
7. Only standard, reviewed cryptographic constructions are used.

The proposed key hierarchy:

```text
master password          typed by the user, never stored, never sent
      |  Argon2id, per-account random salt, versioned parameters
      v
master key               in memory only
      |  HKDF, a different label per purpose
      +--> authentication key    proves identity to the server
      +--> key-encryption key    never leaves the device
                |  authenticated encryption (wrap)
                v
           vault key             random, generated on the device
                |  authenticated encryption (wrap), one per item
                v
           item keys             random
                |  authenticated encryption
                v
           vault items           ciphertext, the only form the server stores
```

The direction the owner has named: Argon2id for deriving the master key, AES-256-GCM or
XChaCha20-Poly1305 for authenticated encryption, HKDF for deriving sub-keys, envelope encryption for
the vault key, random values only from the platform's cryptographic source, and versioned keys so
that they can be rotated.

Every one of those is a direction, not a decision. Section 10 lists what is still open.

## 8. Authentication, encryption and vault unlocking are three different things

Mixing these up is the most likely way to build something insecure. Keep them apart in code, in
names and in documentation.

| Concept             | The question it answers                                | Where it happens          | What it must not do                                      |
| ------------------- | ------------------------------------------------------ | ------------------------- | -------------------------------------------------------- |
| **Authentication**  | "May this client fetch this account's encrypted data?" | Between client and server | It must not give the server anything that helps decrypt. |
| **Encryption**      | "Who can read the vault's contents?"                   | On the device only        | It must never depend on the server being honest.         |
| **Vault unlocking** | "Is the decryption key in this device's memory now?"   | On the device only        | It must not be confused with being signed in.            |

Consequences you must respect:

- **Signed in does not mean unlocked.** A device can hold a valid session and still have a locked
  vault. Locking discards the keys from memory and leaves the session alone.
- **Unlocked does not need the server** in the design above: unlocking derives keys from the master
  password and unwraps the vault key, and with a local encrypted copy that can work offline. The
  internal review's provisional recommendation differs (online-only unlocking at first,
  `docs/ARCHITECTURE.md` section 2.16). The owner has not decided.
- **A session token never decrypts anything.** Stealing one must yield ciphertext at most.
- **Multi-factor authentication protects authentication.** It does not replace the master password
  for decryption.
- **Keys live in memory only.** Reloading the page loses them, which is why the application uses
  client-side routing: navigation must not reload the document.
- **Route guards are for user experience.** They do not protect data.

In the user interface these will be three states: signed out, signed in but locked, and unlocked.
None of them exists yet. Today there is one state: an anonymous visitor.

## 9. Intended clients and backend

All of this is planned. None of it has been started. The fuller description is in
`docs/ARCHITECTURE.md`, Part 2.

```text
  Web application -----+
  Desktop application -+--> Backend API --> Database (ciphertext, verifiers, metadata)
  Browser extension ---+       (TLS)

  Every client contains the same client core: key derivation, encryption, decryption and
  synchronisation logic. The backend does none of these.
```

- **Web application.** Grows from this repository. Routes will fall into three groups: public,
  signed in but locked, and unlocked. A web application trusts the server that delivers its code.
  That limit must be stated honestly, not hidden.
- **Browser extension.** Manifest V3 with the fewest permissions that work. Fill only after the user
  asks. Match the exact origin. Never fill into a frame from another origin. A content script
  receives the single credential being filled and never a key or the vault.
- **Desktop application.** The same interface and client core in a desktop shell that loads no
  remote code. Uses the operating system's credential store. Signed builds and verified updates.
- **Backend API.** TLS only. Validates every input. Parameterised queries. Authorises every request
  against the object it touches. Rate limits authentication and recovery. Logs events, never
  secrets. Stores ciphertext only.
- **Client core.** One implementation of the cryptography and synchronisation logic, shared by all
  three clients, with no user interface, tested against published test vectors.

When a second deliverable starts, the plan is to convert this repository to workspaces
(`apps/web`, `apps/desktop`, `apps/extension`, `packages/core`, `packages/ui`, `services/api`)
instead of creating a second repository. Do not do this conversion until the owner asks for it.

## 10. Decisions that are still open

**None of these is settled.** Do not pick one and build on it. If your task depends on one, stop and
ask the owner. The cryptographic ones go through the internal review in `SECURITY.md`.
`docs/ARCHITECTURE.md` section 2.16 has that review's provisional recommendations; none is approved.

| Decision                                        | The options and what is known                                                                                                                                                                                                                                                                                                                           | What is needed to decide                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **OPAQUE or a derived authentication key**      | A derived key is simple: the client derives it and presents it over TLS, and the server stores a slow salted hash. But the server sees a password-equivalent at every sign-in. OPAQUE (RFC 9807) never shows the server anything password-equivalent and resists pre-computation, but is more complex and depends on a vetted library for every client. | Internal review. A survey of maintained libraries for each platform. |
| **Key derivation parameters**                   | Argon2id is the named direction. The proposed starting floor is RFC 9106's memory-constrained recommendation: 64 MiB, 3 passes, 4 lanes. Real values must come from measurements on the slowest supported devices and in browsers. Also open: whether a second, device-held secret is mixed in.                                                         | Benchmarks on real devices. Internal review.                         |
| **Encryption algorithm and nonce strategy**     | AES-256-GCM is built into browsers but has a 96-bit nonce, so random nonces are only safe when each key encrypts very few messages. XChaCha20-Poly1305 has a 192-bit nonce but needs a library. Open: which one or both, random or counter nonces, what associated data binds each ciphertext to its context, and whether key commitment is needed.     | Internal review. Depends on the client core decision.                |
| **Recovery design**                             | The proposal is a random recovery key shown once, under which the vault key is wrapped a second time. Open: whether to offer recovery at all, the key's format, what happens after it is used, how recovery is rate-limited and announced, and how phishing is resisted. Recovery must never give anyone else a way to decrypt.                         | Owner's product decision, then internal review.                      |
| **Server rollback and withheld-data detection** | Not designed. A dishonest server could serve old data or omit items. Candidate ideas include a client-authenticated record of vault state and cross-checking between a user's devices. Nothing has been chosen or analysed.                                                                                                                             | Design work and internal review.                                     |
| **Desktop application technology**              | Not chosen. The trade-off is a smaller attack surface against maturity of tooling, plus signed updates and access to the operating system's credential store.                                                                                                                                                                                           | Owner's decision after a short written comparison.                   |
| **Backend technology and hosting**              | Not chosen. Hosting also decides how the response headers in `SECURITY.md` are sent, whether the API shares the application's origin, and where rate limiting lives.                                                                                                                                                                                    | Owner's decision.                                                    |

Other open decisions: one shared client core in a compiled language or separate libraries per
platform; sharing between users; the licence; the privacy policy and terms; a contact channel. The
internal review added more: online-only or offline unlocking, the browser extension's key storage,
the supported browsers and platforms, and how many old versions of an item are kept
(`docs/DECISIONS.md`).

Decided on 16 November 2026, and no longer open: `/cart` and `/shop` stay, and the loader is a
padlock and key (`docs/DECISIONS.md`).

## 11. Before you change anything

Do these in order, every time you start work.

For a documentation-only change (section 5.1), the full verification suite in step 6 is not
needed. Run `npm run format:check` before you commit instead; it needs the dependencies from steps 4
and 5.

1. See where you are and what exists on GitHub:

```bash
git status
git fetch origin
git branch -a
git ls-remote --symref origin HEAD
git log --oneline -15 origin/main
```

`git status` must show a clean working tree before you start. The `ls-remote` line shows the default
branch. Compare what you see with section 2.

2. Check for open pull requests, with whatever GitHub tool your environment provides. Read their
   descriptions and their check results. Do not merge, close or push to a pull request you did not
   open, unless the owner told you to.

3. Read, in this order: `README.md`, `SECURITY.md`, `docs/ARCHITECTURE.md`, `docs/AUDIT.md`,
   `docs/DECISIONS.md`, and this file.

4. Check your Node.js version. It must be 24.15 or later, or 22.22.2 or later in the 22 line:

```bash
node --version
```

5. Install exactly what the lockfile says:

```bash
npm ci
```

6. Run the complete verification suite (section 12) **before you change anything**. If something
   fails before you have touched the code, you need to know that now. Report it; do not hide it.

7. Read the code you are about to change, and the tests that cover it.

## 12. Checks and tests

Run all of these before opening a pull request, and again after your last change.

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npm run test:e2e
npm audit --omit=dev
npm audit --audit-level=high
npm audit signatures
```

`npm run check` runs the first five in one go.

The end-to-end tests need a browser the first time:

```bash
npx playwright install chromium
```

What to know:

- **Read the output. An exit code alone is not enough.** Say how many tests ran and passed.
- `npm run test:e2e` builds the application itself and serves it on port 4173. That port must be
  free.
- Some end-to-end tests are skipped on purpose: tests that need a mouse or the wide-screen
  navigation are skipped on the `phone` project, and tests that need touch or the narrow-screen menu
  are skipped on `desktop`. No other test may be skipped.
- Every end-to-end test fails if the browser logs an error or a warning (`e2e/fixtures.ts`). That is
  how a Content-Security-Policy violation shows up.
- If `npm audit signatures` cannot reach its servers from your environment, say so. It also runs in
  continuous integration, so check the result there.
- If formatting fails, run `npm run format` and review what changed.

When a test fails, find the cause and fix it. **Never** delete the test, skip it, loosen what it
checks, or disable a lint rule to get to green. The only reason to change a test is that the
requirement it encodes has changed, with the owner's approval.

## 13. Branches and pull requests, step by step

This is the path for code and implementation work. Start it only when the owner has explicitly
approved the implementation stage (section 5.1). Documentation-only changes take the shorter path
at the end of this section.

```bash
git fetch origin
git switch -c <type>/<short-description> origin/main
```

Use a type such as `feature`, `fix` or `chore`, for example `feature/vault-list`.

Work, then for each logical step:

```bash
git add <the files for this step>
git commit
```

Write commit messages with a short first line that says what changed, a blank line, then why. Do not
use `git add -A` without looking at `git status` first: never commit `dist/`, `node_modules/`, test
output, or any file containing a secret.

Before you push, run section 12. Then:

```bash
git push -u origin <your-branch>
```

Open a pull request with `main` as its base. With the GitHub CLI that is:

```bash
gh pr create --base main --head <your-branch> --title "<title>" --body-file <file>
```

The description must contain:

- what changed and why;
- anything a visitor or a developer will notice behaving differently;
- security considerations, including "none" with the reason if there are none;
- every check you ran and its result, and every check you did not run and why;
- known limitations and what remains to be done;
- decisions that need the owner.

Then:

- Wait for all three continuous-integration jobs. Read the logs of any that fail and fix the cause.
- If `main` has moved and conflicts with your branch, merge `main` into your branch. Do not rebase a
  branch you have already pushed, because that needs a force-push.
- **Do not merge.** Leave the pull request open and tell the owner it is ready. Merge only when the
  owner explicitly approves that pull request.

For a documentation-only change there is no branch and no pull request. Start from an up-to-date
`main`:

```bash
git fetch origin
git switch main
git merge --ff-only origin/main
```

Make the change, run `npm run format:check`, and look at `git status` and `git diff --stat`. Show
the owner the changed files and the diff summary, then:

```bash
git add <the documentation files>
git commit
git push origin main
```

If the push is refused, report the exact refusal and stop. Do not switch to a branch or a pull
request unless the owner says so.

Never delete a branch, yours or anyone else's, unless the owner asks.

## 14. How to avoid breaking what exists

These behaviours are deliberate and are covered by tests. If your change alters one, you have either
found a requirement change that needs the owner's approval, or you have broken something.

**The dashboard**

- Three items in this order: Contact us, Vault, Account. Each is a link.
- With a mouse, a label appears only while the pointer is over the ring itself, not the square
  around it. That is how the original behaved.
- On devices without hover, labels are always visible and a tap on a label follows the link.
- Items are reachable with the keyboard and show a focus ring.
- The layout, colours and transforms were matched to the original site. Do not restyle it without
  being asked.

**The loading screen**

- It lasts three seconds and shows once per page load, the first time an application page opens.
  Public pages never wait for it. The owner decided this; do not change it without the owner.
- It is skipped when the visitor asks for reduced motion.
- It announces itself to assistive technology and has a main landmark and a heading. The status says
  only "Loading...". The drawing is hidden from assistive technology and must never announce that
  anything is being unlocked.
- Its drawing is a padlock and a key, animated by one CSS sequence of 2.7 seconds that plays once:
  the key comes in and lines up, goes into the keyhole, turns, the shackle opens, and the key comes
  out and fades. It ends before the three seconds are up, so the open padlock is still showing when
  the application appears. No JavaScript drives it.
- The drawing's resting state, its CSS without animation, is that open padlock. Each animation
  starts at the beginning of the sequence and has no `to` keyframe, so it ends on the resting
  state.
- Its end-to-end tests pause the animations and seek them with `getAnimations()`. They do not wait
  for frames. Keep them that way.

**Navigation**

- Every route in section 4 works when opened directly, not only when reached by a link.
- The original `.html` addresses redirect.
- After each navigation, focus moves to the new page's `<h1>`.
- No page scrolls sideways at any width from 320px up.

**Security**

- The policy text in `index.html` is exactly the one in section 6.2.
- The application makes no request to any other origin.
- The application does not start inside a frame.

**Honesty**

- Placeholder pages contain no forms, inputs or buttons.
- Nothing in the interface or the copy claims a feature that does not exist.

Working habits that prevent breakage:

- Change one thing at a time and run the unit tests after each change (`npm run test:watch`).
- Look at your change in a browser at phone width and at desktop width, not only in tests.
- The policy is absent in `npm run dev`. Check anything involving styles, scripts or assets with
  `npm run build` and `npm run preview`.
- When you add a page, give it one `<main>`, one `<h1>` and a `<title>`, and add it to the tests.
- When you add behaviour, add a test that fails without it.
- Do not move, rename or "tidy" files that your task does not need you to touch.

## 15. How to record decisions, blockers and remaining work

**Decisions.** Add a row to `docs/DECISIONS.md`: the date, what was decided, who decided it, and why.
Only the owner decides product and security questions. If you chose a default yourself because
nobody had decided, say that it is your default and that it is open to change. Security-sensitive
decisions, including any that come out of the internal review in `SECURITY.md`, are recorded the
same way once the owner has made them. A provisional recommendation is not a decision: never add one
to the Decided table.

**State of the product.** When something becomes implemented, update the status table in
`README.md`, Part 1 of `docs/ARCHITECTURE.md`, and `SECURITY.md` if it touches security. Move text
from Part 2 (planned) to Part 1 (implemented) only when it is built and tested. Use the same four
words everywhere: Implemented, Partial, Placeholder, Planned.

**Blockers.** If you cannot do something, write down exactly what you tried, the exact error or
refusal, and what the owner needs to do. Put it in the pull request description and in your final
report. Do not work around a blocker by weakening something.

**Remaining work.** List it in the pull request description under its own heading.

**This file.** At the end of your work, refresh section 2, and correct anything else here that your
work made untrue. Then the next agent starts from the truth.

**Your final report to the owner** must say what you did, what you verified and how, what you did
not verify, what is still open, and what you recommend next. Say plainly when something failed.

## 16. What you must never do

- Never commit code to `main`, force-push, rewrite published history, or delete a branch. Only
  documentation-only changes the owner asked for go directly to `main` (section 5.1).
- Never merge a pull request without the owner's explicit instruction for that pull request.
- Never change repository settings that you were not asked to change.
- Never implement cryptography before the internal review in `SECURITY.md` and the owner's explicit
  approval of that implementation stage. Never invent an algorithm.
- Never treat the owner's approval of documentation or a plan as approval to implement it.
- Never describe the internal, AI-assisted review as independent, as an audit or as a specialist's
  review, and never treat it as a substitute for the independent external audit before any public
  release.
- Never treat section 7 or `docs/ARCHITECTURE.md` Part 2 as an approved specification.
- Never fake authentication, registration, a vault, or any other feature. No pretend sign-in form, no
  "demo" account, no data kept in memory or storage that imitates a vault.
- Never store secrets, keys or decrypted data in browser storage. Never log them.
- Never weaken or remove the Content-Security-Policy, Trusted Types, the frame check, a lint rule, a
  test or a CI job. Never add `'unsafe-inline'`, `'unsafe-eval'` or another origin to the policy.
- Never load anything from another origin at runtime: no CDN scripts, hosted fonts, analytics,
  embedded widgets or remote images.
- Never add a dependency that is not needed, never install a release less than seven days old, never
  edit `package-lock.json` by hand, and never remove `ignore-scripts` from `.npmrc`.
- Never commit a secret, an `.env` file, build output or `node_modules/`.
- Never claim that Zavolt is secure, audited, certified, encrypted, production-ready or a working
  password manager. Never invent users, testimonials, prices, screenshots, download links,
  certifications or legal text.
- Never invent project history. If you do not know why something is the way it is, say so.
- Never report a check as passed unless you ran it and read its output.
- Never start backend, authentication, encryption, vault, desktop or extension work unless the owner
  has asked for that specific work.

## 17. When to stop and ask the owner

Stop and ask before you:

- make any decision listed in section 10;
- change the Content-Security-Policy or any other security control;
- write or change anything cryptographic;
- start any implementation stage, even one that a document already describes;
- remove or rename a route, or remove a page;
- delete or overwrite anything you did not create in this task;
- add a dependency that ships to users, or a large development dependency;
- write legal text, prices, or claims about security;
- need a service, an account or a secret that you do not have;
- find that this document and the repository disagree in a way you cannot explain.

For ordinary implementation choices inside an approved task, decide, write down what you decided,
and carry on.

## 18. Roadmap and what to work on next

The order below is the recommended one. It is not a commitment and it has no dates. Only do the step
the owner asks for.

| Step | Work                                                                                        | Why it comes here                                                  |
| ---- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1    | Foundation: typed application, tests, CI, documents (Phase 1)                               | Done. See section 2.                                               |
| 2    | Public homepage and route separation (Phase 2)                                              | Done. See section 2.                                               |
| 3    | Choose hosting; send the response headers in `SECURITY.md`                                  | Several protections cannot exist until something serves the files. |
| 4    | Write the threat model and the full protocol; complete the internal review                  | Nothing cryptographic may be built before this.                    |
| 5    | Build the client core as a package with no user interface, tested against published vectors | One audited implementation, shared by every client.                |
| 6    | Build the backend: accounts, authentication, encrypted storage, rate limiting               | Needs the decisions in section 10.                                 |
| 7    | Add registration, sign-in, unlocking and the vault to the web application                   | Needs steps 4 to 6.                                                |
| 8    | Add synchronisation, device management and recovery                                         |                                                                    |
| 9    | Build the browser extension, then the desktop application                                   |                                                                    |
| 10   | Commission an independent security audit before any public release                          | No security claim may be made before this.                         |

Step 10 is an owner commitment (`docs/DECISIONS.md`): an independent external security audit takes
place before any public release. Step 4 was also a commitment, to a review by specialists; on
17 November 2026 the owner replaced that with the internal review in `SECURITY.md`, which does not
replace step 10. Step 4's documents are documentation-only work. Every step that changes code or
configuration is an implementation stage: it starts only when the owner explicitly approves it, on
a feature branch.

Smaller things that are safe to do when asked, and need no open decision: accessibility
improvements, testing in Firefox and Safari, pre-rendering the public pages, and content changes to
the homepage. Each of them changes code, so each takes the code path in section 5.1: the owner's
approval, a feature branch and a pull request.

## Appendix: things that will surprise you

- **A decorative element can swallow taps.** On narrow screens the hero's orbit is pulled up with a
  negative margin and overlaps the buttons above it. It has `pointer-events: none` for that reason.
  The end-to-end layout test checks that every hero link is the topmost element under its own centre
  at every width. Keep both.
- **The mobile menu closes itself on navigation without any effect.** It records the location key it
  was opened at and is open only while that key is current (`src/site/SiteHeader.tsx`). Links in it
  need no `onClick`.
- **Following a section link is handled in `src/AppRoutes.tsx`,** not by the browser: client-side
  navigation does not scroll to a fragment. Section headings have `tabIndex={-1}` so they can take
  focus. jsdom has no scrolling, so the unit-test setup stubs `scrollIntoView` and `scrollTo`.
- **The linter is oxlint, not ESLint.** There is no ESLint configuration. Suppression comments start
  with `oxlint-disable`.
- **TypeScript 7 is the native compiler.** Use `npm run typecheck`. Do not downgrade TypeScript.
- **`npm run dev` has no Content-Security-Policy.** See section 6.2.
- **Do not take full-page screenshots in the `phone` Playwright project.** In the pinned Playwright
  version a full-page capture switches off the emulation of a touch device, and tests that depend on
  `(hover: none)` then fail for no visible reason. Take viewport screenshots.
- **Code that Playwright evaluates in the page is exempt from the policy's `eval` restriction.** A
  test that proves `eval` is blocked must run the attempt from a page timer, as the existing test
  does.
- **The accessibility scanner needs timers.** It hangs if the page clock is paused, so the
  loading-screen test asserts on the accessibility tree instead.
- **Playwright's `page.clock` moves timers, not CSS animations.** The loader's animation runs on the
  document's own timeline. Its tests pause it and set `currentTime` through `getAnimations()`.
- **`userEvent` hangs under Vitest's fake timers.** Testing Library's asynchronous wrapper waits on
  a `setTimeout(0)` that only Jest's fake timers advance. Tests with fake timers use `fireEvent`.
- **A test that waits for a page can hide a loading screen that played again.** It closes by itself
  after three seconds. The test for once per page load keeps the page clock stopped, so a replay
  would never close.
- **Text inside `<noscript>` is invisible to Playwright's text locators.** Locate it by element.
- **`playwright-core` is pinned through `overrides` in `package.json`** so that only one copy is
  installed. Keep it equal to `@playwright/test`.
- **The global `* { border: 0 }` reset** means an element shows a border only where a class sets one.
