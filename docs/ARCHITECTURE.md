# Architecture

This document describes two different things and keeps them apart:

- **Part 1** is what the repository contains today. It is implemented and tested.
- **Part 2** is the intended design of the full product. **None of it is implemented.** It records
  direction and constraints so that later work starts from the same assumptions. Every section in
  Part 2 is a plan. Its status section says what is approved and what is only proposed. A plan that
  touches cryptography goes through the internal review in [SECURITY.md](../SECURITY.md), and none
  of it is built as production code before that document's evidence gate is met.

| Component                                    | Status                                          |
| -------------------------------------------- | ----------------------------------------------- |
| Public website: homepage, header, footer     | Implemented                                     |
| Application shell, dashboard, navigation     | Implemented, not authenticated                  |
| Sign-in, registration, legal pages           | Placeholder: a statement of what does not exist |
| Section pages (contact, vault, account)      | Placeholder: a message and a link back          |
| Browser hardening                            | Partial: page-level only, see 1.5               |
| Authentication                               | Planned                                         |
| Zero-knowledge encryption and key management | Planned                                         |
| Backend API                                  | Planned                                         |
| Vault synchronisation                        | Planned                                         |
| Device management                            | Planned                                         |
| Account recovery                             | Planned                                         |
| Desktop application                          | Planned                                         |
| Browser extension                            | Planned                                         |

---

## Part 1: What exists today

### 1.1 Shape

A single-page application: React 19 and TypeScript 7, built by Vite 8 into static files. There is no
server-side code and the application makes no network requests after its own files have loaded.

It replaced four static HTML documents that repeated the same inline script. The reasons for the
change are recorded in [AUDIT.md](./AUDIT.md). The short version: inline scripts rule out a strict
Content-Security-Policy, a script loaded from a CDN is code nobody here controls, and separate
documents lose everything held in memory on each navigation.

### 1.2 Structure

| Path                          | Role                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `index.html`                  | The shell. Declares the Content-Security-Policy, the favicons and the description.                     |
| `src/main.tsx`                | Entry point. Loads fonts and global styles, refuses to run in a frame, mounts React.                   |
| `src/App.tsx`                 | Wraps the route table in the router.                                                                   |
| `src/AppRoutes.tsx`           | The route table, the loading screen's placement, and focus and scrolling after navigation.             |
| `src/sections.ts`             | Every route and the area it belongs to, the placeholder texts, and the original site's addresses.      |
| `src/components/SplashGate`   | Shows the loader before the first application page of a page load, then never again.                   |
| `src/components/SplashLoader` | The loader's padlock and key: SVG, animated by CSS in its module. Decorative only.                     |
| `src/components/Icon`         | Twenty Ionicons icons, bundled as inline SVG.                                                          |
| `src/components/MessagePage`  | A page that states one thing and offers one way back.                                                  |
| `src/pages/`                  | Homepage, dashboard, section placeholder and not-found pages.                                          |
| `src/site/`                   | The public website: `SiteLayout`, header, footer, brand mark, buttons, status badges, section headers. |
| `src/site/home/`              | The homepage sections: hero, product, security, platforms, about, closing call to action.              |
| `src/styles/global.css`       | Reset, design tokens and accent colours.                                                               |

### 1.3 Routing

Routing is client-side (React Router, declarative mode). Every page belongs to one of two areas,
recorded in `src/sections.ts`:

- **Public site.** Rendered inside `SiteLayout`: a skip link, the site header, the page and the
  footer.
- **Application.** Full-screen pages with the original look and no site header. The loading screen
  plays before the first one opened in a page load.

| Address                                     | Page                                     | Area        |
| ------------------------------------------- | ---------------------------------------- | ----------- |
| `/`                                         | Homepage                                 | Public site |
| `/login`, `/register`                       | Placeholders: sign-in and registration   | Public site |
| `/contact`, `/privacy`, `/terms`            | Placeholders: contact, privacy, terms    | Public site |
| anything else                               | Not found                                | Public site |
| `/app`                                      | Dashboard                                | Application |
| `/vault`, `/account`                        | Placeholders for dashboard sections      | Application |
| `/cart`, `/shop`                            | Placeholders kept from the original site | Application |
| `/index.html`                               | Redirects to `/app`                      |             |
| `/account.html`, `/cart.html`, `/shop.html` | Redirect to `/account`, `/cart`, `/shop` |             |

Contact is public because anyone may need to reach Zavolt; the dashboard still links to it.

**Neither area is protected.** The split is about presentation, not access: until authentication
and a backend exist, every address is open to every visitor. When authentication is built, the
application area becomes the natural place for a "signed in" and "unlocked" check, but that check in
the browser will only ever be a convenience. Protection comes from a server that releases
ciphertext to authenticated sessions only.

After a navigation, `AppRoutes` does what a full page load would have done:

- a link to `#section` scrolls the section into view and focuses its heading;
- a link to another page starts it at the top and focuses its `<h1>`;
- back and forward keep the browser's scroll position;
- the first page shown keeps the browser's default focus.

Client-side routing is a deliberate choice for a password manager. An unlocked vault key must exist
only in memory. If moving between pages reloaded the document, the key would be lost each time, and
the tempting fix, writing it to browser storage, is exactly what must never happen.

### 1.4 State and styling

There is no global state and no state library. The only state is whether the loading screen has
played and whether the mobile menu is open. Add shared state when a feature needs it, not before.

Styles are CSS Modules next to their components, plus one global stylesheet. The dashboard's values
were carried over from the original stylesheets. Accent colours are selected with a `data-accent`
attribute instead of inline styles, because the Content-Security-Policy forbids inline styles.

The public site's design tokens live in `src/styles/global.css`: surfaces, text colours (each with at
least 6.3:1 contrast on every surface), the brand violet (the dashboard's vault colour) and status
colours. Text sizes are in `rem`, so they follow the visitor's default text size. The original
site's viewport-based root font size now applies to the loader only, which keeps its exact
proportions.

### 1.5 Browser hardening

The production page carries this policy in a `<meta>` tag:

```text
default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self';
connect-src 'self'; base-uri 'none'; form-action 'self';
require-trusted-types-for 'script'; trusted-types 'none'
```

- The policy lives in `index.html`, so the strict version is the source of truth. A small Vite
  plugin removes it from the development server only, because hot reloading needs inline scripts
  and a WebSocket. If the tag is ever deleted, the development server refuses to serve the page and
  the end-to-end tests fail the production build.
- The end-to-end tests run against the production build. They assert the exact policy text and that
  the browser blocks HTML-string injection, inline event handlers and `eval`.
- Assets are never inlined as `data:` URIs, so the policy does not need to allow them.
- The application refuses to start inside a frame.

This is partial. `frame-ancestors`, HSTS and the other response headers can only be set by whatever
serves the files, and no hosting has been chosen. The list is in [SECURITY.md](../SECURITY.md).

### 1.6 Testing

| Layer      | Tool                           | Covers                                                                                                                |
| ---------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Types      | TypeScript, strict             | Application, configuration and tests.                                                                                 |
| Lint       | oxlint with type-aware rules   | Correctness, accessibility, and the security rules in SECURITY.md.                                                    |
| Unit       | Vitest, Testing Library, jsdom | Routes and areas, redirects, the loading screen, focus and scrolling, the mobile menu, honesty.                       |
| End to end | Playwright with axe-core       | The production build in Chromium, desktop and phone: navigation, menu, layout, policy, accessibility, motion, loader. |

### 1.7 Known limits of the current code

- **Nothing is protected.** The dashboard is described as the page a signed-in user sees, but nothing
  checks who the visitor is, and `/app` is open to everyone. No code may assume otherwise until
  authentication exists.
- **The loading screen waits on a timer, not on work.** Nothing is loading during those three
  seconds. When start-up does real work, the gate should wait for that instead.
- **The loader's padlock opening is a picture, not an operation.** Nothing is unlocked, checked or
  decrypted while it plays, and assistive technology is told only that the application is loading.
  When a real unlock exists, it must report its own progress, not borrow this animation.
- **Pages are rendered in the browser.** Search engines and link previews see the bare shell and the
  description in `index.html`. Pre-rendering the public pages would fix that.
- **End-to-end tests run in Chromium only.**

---

## Part 2: The planned product

Everything from here on is planned. Nothing in this part has been built.

### Status of this part

Part 2 mixes statements with different standing. Unless a statement is listed below as approved or
as a mandatory prerequisite, it is a provisional recommendation.

| Standing                               | What it covers                                                                                                                                                                                                                                                                                                                                                                                                                   | Recorded in                          |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Approved decisions                     | Zero-knowledge encryption as the long-term architecture. The cryptographic direction (Argon2id, AES-256-GCM or XChaCha20-Poly1305, HKDF, envelope encryption, versioned keys), as a direction rather than a protocol. Recovery that never lets Zavolt decrypt. No advertising or tracking code. How design is reviewed, the evidence gate before production cryptographic code, and the independent audit before public release. | [DECISIONS.md](./DECISIONS.md)       |
| Mandatory implementation prerequisites | The principles in 2.2. The rules in [SECURITY.md](../SECURITY.md), including its cryptographic design review and, before any production cryptographic code, its evidence gate. The approval and branch rules in 2.15.                                                                                                                                                                                                            | 2.2, 2.15, `SECURITY.md`             |
| Provisional recommendations            | Everything else here: components, threat model, key hierarchy, parameters, authentication, synchronisation, rotation, recovery, devices and clients (2.1, 2.3 to 2.12), and the internal review's recommendations (2.16). None of it is approved.                                                                                                                                                                                | This part                            |
| Unresolved questions                   | The open decisions.                                                                                                                                                                                                                                                                                                                                                                                                              | 2.13, [DECISIONS.md](./DECISIONS.md) |
| Deferred work                          | Work kept out of the first stages.                                                                                                                                                                                                                                                                                                                                                                                               | 2.17                                 |

### 2.1 Components

```text
  Web application ─────┐
  Desktop application ─┼──▶ Backend API ──▶ Database
  Browser extension ───┘        (TLS)        ciphertext, verifiers, metadata

  Every client contains the same client core: key derivation, encryption,
  decryption and sync logic. The backend never does any of these.
```

| Component           | Purpose                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Web application     | Account management, vault management, security settings. This repository today.                |
| Desktop application | A vault for credentials used outside the browser, such as game launchers and desktop software. |
| Browser extension   | Recognises sign-in pages, offers saved credentials, fills them, and offers to save new ones.   |
| Backend API         | Stores encrypted data, authenticates clients, synchronises devices. Never sees plaintext.      |
| Client core         | One implementation of the cryptography and sync logic, shared by all three clients.            |

### 2.2 Zero-knowledge principles

These are requirements. A design that breaks one of them is wrong.

1. The master password never leaves the device, in any form the server could use to recover it.
2. Vault contents are encrypted on the device before they are sent anywhere.
3. The server stores ciphertext and never receives a key that can decrypt it.
4. Signing in and decrypting use separate keys. Knowing what the server knows must not help decrypt.
5. Every field a user enters is encrypted, including names, usernames, notes and web addresses.
6. Recovery never works by giving the server, or the company, a way to decrypt.
7. Only standard, reviewed cryptographic constructions are used. No custom algorithms.

What the server will still learn should be stated honestly: that an account exists, how many items
it holds, roughly how large they are, and when they change.

### 2.3 Threat model in brief

| Adversary                                  | What the design must ensure                                                                  |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Someone on the network                     | TLS everywhere. Nothing useful is visible or changeable in transit.                          |
| Someone who steals the database            | They hold ciphertext and verifiers. Guessing a master password must be slow and per-account. |
| A compromised or dishonest server          | It cannot read vaults. It should also be unable to swap, replay or weaken data unnoticed.    |
| Malicious content in the page (XSS)        | The policies in Part 1 block it. Unlocked keys are held so script cannot export them.        |
| A malicious website, against the extension | Credentials are only filled into the site they belong to, after the user acts.               |
| Someone with a locked device               | Nothing on disk decrypts the vault without the master password.                              |
| A malicious dependency or build step       | Small dependency tree, pinned versions, waiting period, signature checks, reviewed updates.  |

Two limits should be stated rather than hidden:

- **A web application trusts the server that delivers it.** Whoever controls that server could send
  altered JavaScript that captures the master password. A strict Content-Security-Policy and a small
  dependency tree reduce the ways this can happen but cannot remove it. The desktop application and
  the extension are installed, signed and updated deliberately, so they are the stronger option for
  users who need that assurance.
- **A compromised device is out of scope.** Malware that can read the screen or the keyboard defeats
  any password manager.

### 2.4 Key hierarchy

```text
  master password            typed by the user, never stored, never sent
        │
        │  Argon2id with a per-account random salt and versioned parameters
        ▼
  master key                 256 bits, in memory only
        │
        │  HKDF, one distinct label per purpose
        ├──▶ authentication key    proves identity to the server
        └──▶ key-encryption key    never leaves the device
                  │
                  │  authenticated encryption (wrap)
                  ▼
             vault key             256 random bits, generated on the device
                  │
                  │  authenticated encryption (wrap), one per item
                  ▼
             item keys             256 random bits each
                  │
                  │  authenticated encryption
                  ▼
             vault items           ciphertext, the only form the server stores
```

- **Key derivation.** Argon2id (RFC 9106). Parameters are chosen by measuring on real devices and
  are never weaker than the RFC's memory-constrained recommendation (64 MiB, 3 passes, 4 lanes)
  without a written reason. They are stored with the account and versioned, so they can be raised.
  The client enforces a minimum, so that a server cannot talk it into weak parameters.
- **Separation.** HKDF (RFC 5869) derives the authentication key and the key-encryption key from the
  master key with different labels. Neither can be computed from the other.
- **Envelope encryption.** The key-encryption key wraps the vault key, and the vault key wraps a
  separate key for each item. Changing the master password then re-wraps one key instead of
  re-encrypting the vault, and sharing an item later means wrapping one item key for someone else.
- **Encryption.** AES-256-GCM or XChaCha20-Poly1305. A key and nonce pair is never used twice.
  Random 96-bit nonces are acceptable for AES-GCM only because each key encrypts very few messages.
- **Binding.** Each ciphertext is authenticated together with its context: format version, account,
  item identifier, purpose and key version. A server cannot then move a ciphertext to another item
  or field without decryption failing.
- **Format.** Every encrypted value carries a version and algorithm identifier. Clients reject
  anything they do not recognise and never fall back to something weaker.
- **Randomness.** Keys, salts and nonces come from the platform's cryptographic random source only.

In the browser, Argon2id is not part of the Web Crypto API, so it will run as WebAssembly. That
requires adding `'wasm-unsafe-eval'` to the Content-Security-Policy, which permits WebAssembly but
not JavaScript `eval`. That change should be made deliberately, together with its test.

### 2.5 Authentication

Authentication answers "may this client fetch this account's ciphertext?". It is separate from
decryption, and a successful sign-in must not be enough to read a vault.

- The client first asks for the account's salt and parameters. For an unknown account the server
  returns a stable fake answer, so the request does not reveal which accounts exist.
- The client derives the authentication key and presents it over TLS. The server stores only a
  salted, slow hash of it, never the key itself, and compares in constant time.
- Sessions are short-lived and revocable. For the web application the plan is a cookie with the
  `__Host-` prefix, `Secure`, `HttpOnly` and `SameSite=Strict`, with the API on the same origin.
  State-changing requests are additionally checked against the `Origin` header.
- Multi-factor authentication (TOTP and WebAuthn) protects sign-in. It does not replace the master
  password for decryption.
- Sign-in attempts are limited per account and per address, with increasing delays. Errors do not
  say whether the account or the password was wrong.
- New passwords are checked against known breached passwords in a way that does not reveal them:
  only a short prefix of a hash leaves the device.

An alternative to presenting a derived key is OPAQUE (RFC 9807), where the server never receives
anything equivalent to the password, even at registration. Which to use is an open decision. The
internal review provisionally recommends OPAQUE (2.16); the owner has not decided.

### 2.6 Vault synchronisation

- The server is the source of truth for ciphertext. Each item has a server-assigned revision.
- Clients keep an encrypted local copy and fetch changes since the last revision they saw.
- A write names the revision it was based on. If the item has changed since, the server refuses and
  the client resolves the conflict. It never silently discards either version.
- Deletions are recorded, so that a device that was offline does not bring an item back.
- The local copy holds ciphertext only. Locking the vault discards the keys from memory.

Open question: how a client detects a server that withholds or rolls back items. The internal
review's provisional answer is in 2.16.

### 2.7 Key management and rotation

| Event                               | What happens                                                                                 |
| ----------------------------------- | -------------------------------------------------------------------------------------------- |
| Master password change              | New salt, new master key. The vault key is re-wrapped and the verifier replaced, atomically. |
| Stronger derivation parameters      | Applied at the next sign-in, the same way as a password change.                              |
| Suspected exposure of the vault key | A new vault key is generated and every item key is re-wrapped.                               |
| Item edited                         | The item gets a fresh item key.                                                              |
| Algorithm retired                   | Items are re-encrypted in the new format on next access. Old formats are then refused.       |

The internal review found that after a suspected exposure, re-wrapping is not enough: someone who
held the old vault key may already have the item keys and the ciphertext. Its provisional
recommendation (2.16) adds new item keys, re-encryption of every item, and advising the user to
change the stored passwords.

Keys in memory are held for as short a time as possible, and the vault locks after inactivity.
JavaScript cannot guarantee that memory is wiped. Where the platform allows it, keys are kept as
non-extractable objects, so that script can use them but not read them.

### 2.8 Account recovery

Forgetting the master password must not be solved by giving anyone else a way to decrypt.

- At sign-up the device generates a random recovery key and shows it once, for the user to keep
  offline. The vault key is wrapped a second time under a key derived from it, and that second copy
  is stored on the server. The server cannot open it.
- To recover, the user proves control of the account and enters the recovery key. The device unwraps
  the vault key and sets a new master password.
- Without the master password, the recovery key or another unlocked device, the vault cannot be
  recovered by anyone. The only remaining option is to delete it and start again, and the product
  must say so before sign-up, not after.

A recovery key is as powerful as the master password. Recovery is rate-limited, announced to the
account's other devices, and treated as a prime phishing target.

### 2.9 Device management

- Each device registers with an identifier, a name the user can recognise, and its platform.
- Sessions belong to devices. A user can see every device and revoke any of them.
- A sign-in from a new device is reported to the existing ones and may need confirmation.
- Removing a lost device ends its sessions. If it may have been unlocked, the vault key is rotated.

### 2.10 Clients

**Web application.** Grows from this repository: sign-up, sign-in, unlock, vault, account and
security settings. Routes will fall into three groups: public, signed in but locked, and unlocked. A
route guard in the browser only improves the experience. The protection is that the server releases
ciphertext to authenticated sessions only, and that ciphertext is useless without the master
password.

**Browser extension.** Manifest V3, with the fewest permissions that work.

- Fill only after the user asks, at least at first. Never submit a form automatically.
- Match on the exact origin by default. Never fill into a frame from another origin.
- Page scripts are untrusted. A content script receives the single credential being filled and
  never a key or the vault.
- Extension interface is drawn in surfaces the extension owns, so that a page cannot restyle or
  cover it.

**Desktop application.** The same interface and client core in a desktop shell that loads no remote
code. It uses the operating system's credential store for device secrets, can offer the system's
biometric unlock, and clears the clipboard a short time after a copy. Builds are signed and updates
are verified.

### 2.11 Backend API

Not designed in detail and no technology has been chosen. Requirements:

- TLS only, with HSTS. A versioned API.
- Every input is validated against a schema at the boundary. Queries are parameterised.
- Every request is authorised against the object it touches, not only authenticated.
- Rate limiting on every authentication and recovery endpoint.
- Logs record events, never secrets, keys, verifiers or ciphertext.
- Secrets come from a secrets manager, never from the repository.
- Stored data is ciphertext, encrypted again at rest by the database as a second layer.

### 2.12 Repository layout as the product grows

Today the repository is one package. When a second deliverable starts, convert it to workspaces
instead of starting a second repository, so that the client core has exactly one implementation:

```text
apps/web          this application
apps/desktop      desktop shell
apps/extension    browser extension
packages/core     key derivation, encryption, sync (no user interface)
packages/ui       shared components
services/api      backend
```

### 2.13 Open decisions

| Decision                                                                   | Notes                                                                      |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Derived authentication key, or OPAQUE                                      | See 2.5 and 2.16.                                                          |
| A second, device-held secret mixed into key derivation                     | Protects weak master passwords if the database leaks. Adds setup friction. |
| One client core in a compiled language, or separate libraries per platform | One implementation is easier to audit.                                     |
| AES-256-GCM, XChaCha20-Poly1305, or both                                   | Depends on the client core decision.                                       |
| Desktop shell                                                              | Smaller attack surface against maturity of tooling.                        |
| Backend technology and hosting                                             | Hosting also decides how the headers in SECURITY.md are sent.              |
| Detecting withheld or rolled-back data                                     | See 2.6 and 2.16.                                                          |
| Online-only or offline vault unlocking                                     | See 2.16 and the handoff, section 8.                                       |
| Browser extension key storage under Manifest V3                            | Needs an exception to `SECURITY.md` rule 4. See 2.16.                      |
| Supported browsers and platforms; sign-in time budget                      | Sets the Argon2id parameters. Needs benchmarks on real devices.            |
| Sharing between users                                                      | Needs public keys. The hierarchy in 2.4 leaves room for it.                |
| Licence                                                                    | None chosen. Options: `docs/legal/LICENSING_ASSESSMENT.md`.                |

### 2.14 Suggested order of work

1. Write the evidence gate's four deliverables (2.15): the threat model, the protocol specification,
   the test-vector plan and the security-test plan. Each goes through the internal review.
2. Build the client core as a package with no user interface, tested against published vectors.
3. Build the backend: accounts, authentication, encrypted storage, rate limiting.
4. Add sign-up, sign-in, unlock and the vault to the web application.
5. Add synchronisation, device management and recovery.
6. Build the browser extension, then the desktop application.
7. Commission an independent security audit before any public release.

Step 1 is documentation. Steps 2 to 6 are implementation stages: each starts only when the owner
explicitly approves it, and is built on a feature branch that reaches `main` through a pull request
the owner approves. Production cryptographic code, from step 2 on, also waits until the evidence
gate is met. Neither the internal review nor the gate replaces step 7.

### 2.15 How this design is reviewed and approved

Zavolt has no cryptography specialist. On 17 November 2026 the owner replaced the earlier
requirement, that a cryptographer review this design before any of it is built, with an internal
review by ChatGPT and Claude. The process is defined in
[SECURITY.md](../SECURITY.md#cryptographic-design-review):

- Every review is written down. It identifies its assumptions, unresolved questions, protocol risks,
  implementation risks and the standards it relies on.
- Security-sensitive decisions are recorded in [DECISIONS.md](./DECISIONS.md). Only the owner
  decides.
- No cryptographic construction is invented, and none is implemented without documented
  justification.
- Implementation proceeds in stages. Each stage starts only when the owner explicitly approves it,
  is written on a dedicated feature branch, and reaches `main` through a pull request the owner
  approves. Approving this document, or any part of it, is not approval to implement it.
- An independent external security audit takes place before any public release.

**Evidence gate.** Since 21 November 2026, production cryptographic code also has a mandatory gate,
defined in [SECURITY.md](../SECURITY.md#evidence-gate-for-cryptographic-implementation). Before any
of it is written, four documents must exist under `docs/` and have been through the internal
review: a threat model, a versioned protocol specification, a test-vector plan built on
authoritative published vectors, and a reproducible security-test plan. After that, the owner
approves the design and authorises the implementation stage; the work happens on a feature branch;
and the required security tests and CI checks pass before anything is merged. The gate does not
apply to documentation or to preparation that involves no cryptography. First drafts of the four
documents (version 0.1, 22 November 2026) are in [docs/security/](./security/README.md). None has
been through the internal review or been approved, so the gate is not met.

**The internal review is AI-assisted and is not independent.** ChatGPT and Claude are not
independent security auditors or qualified cryptography specialists. Their review is not an audit or
a certification. Neither it nor the evidence gate replaces the external audit.

### 2.16 Provisional recommendations from the internal review

In November 2026 ChatGPT and Claude carried out the first internal review of this part. These are
its recommendations. **None of them is approved.** They are not decisions, and where they differ
from sections 2.1 to 2.12, both remain proposals until the owner decides.

| Topic                      | Provisional recommendation                                                                                                                                                         | Compared with the sections above           |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Authentication             | OPAQUE (RFC 9807) with Argon2id as its key-stretching function, if a library evaluation succeeds. Otherwise the derived authentication key of 2.5.                                 | Differs from 2.4 and 2.5                   |
| Key-encryption key         | Derived with HKDF from OPAQUE's export key.                                                                                                                                        | Differs from 2.4                           |
| Argon2id parameters        | A floor of 64 MiB, 3 passes and 4 lanes (RFC 9106's option for memory-constrained environments), raised only after benchmarks on real devices. Versioned, and enforced by clients. | Consistent with 2.4                        |
| Password preparation       | RFC 8265 OpaqueString rules: non-ASCII spaces become U+0020, then Unicode NFC. Versioned.                                                                                          | Not covered above                          |
| Key hierarchy              | Key-encryption keys wrap an account key, which wraps the vault keys, which wrap a new item key for each item version.                                                              | Adds an account key to 2.4                 |
| Encryption                 | AES-256-GCM from Web Crypto, with random 96-bit IVs within NIST SP 800-38D's limits and a cap on uses per key.                                                                     | Picks AES-256-GCM from 2.4                 |
| Key commitment             | A commitment value derived from each key and checked before decrypting. No standard defines this; it needs a written argument.                                                     | Not covered above                          |
| Associated data and format | Every ciphertext bound to its type, account, vault, item, version and key. COSE_Encrypt0 framing, after an experiment.                                                             | Consistent with 2.4                        |
| Recovery                   | A random recovery key wraps the account key. Email verification, notifications, a cooling-off period, and a proof of the account key before any key is replaced.                   | Extends 2.8                                |
| Devices                    | Enrolment by signing in. Revocation at three levels: remove; remove and secure; full compromise response.                                                                          | Changes 2.7 and 2.9                        |
| Rollback detection         | A hash-chained vault manifest, authenticated with HMAC and checked by every device. Needs formal analysis.                                                                         | Answers the question in 2.6                |
| Unlocking                  | Online only at first. Offline unlocking deferred (2.17).                                                                                                                           | Differs from the handoff, section 8        |
| Browser extension          | Keys sealed in `storage.session` under a non-extractable wrapping key.                                                                                                             | Needs an exception to `SECURITY.md` rule 4 |
| Local storage              | Ciphertext and non-secret metadata only.                                                                                                                                           | Consistent with 2.6                        |
| Client core and desktop    | One TypeScript core with Web Crypto and one WebAssembly module. Electron favoured for the desktop, after a written comparison.                                                     | Open in 2.13                               |

Three of these have no established standard behind them and need further analysis before any of
them is relied on: the key commitment value, the manifest protocol, and the extension's sealed
session storage. These recommendations feed the evidence gate's deliverables (2.15) but do not
replace them. The owner asked for the deliverables on 21 November 2026; their first drafts carry
these recommendations forward as provisional, unchanged in standing.

### 2.17 Deferred work

These are deliberately left for later. None of them is planned for the first implementation stages.

- **Waiting for the owner to ask:** converting the repository to workspaces (2.12). No
  implementation stage of any kind starts without the owner's explicit approval (2.15).
- **Later in the suggested order (2.14):** the browser extension and the desktop application, after
  the web application.
- **Deferred by the internal review's provisional recommendations (2.16), which the owner has not
  confirmed:** offline unlocking, biometric and passkey unlocking, approving a new device from an
  existing one, a device-held secret, binding session tokens to devices (DPoP), padding ciphertext
  sizes, and sharing between users with the public keys and post-quantum questions it brings.

### References

- RFC 9106: Argon2 Memory-Hard Function for Password Hashing and Proof-of-Work Applications
- RFC 5869: HMAC-based Extract-and-Expand Key Derivation Function (HKDF)
- RFC 9807: The OPAQUE Augmented Password-Authenticated Key Exchange (aPAKE) Protocol
- RFC 8439: ChaCha20 and Poly1305 for IETF Protocols. XChaCha20-Poly1305 extends it with a 192-bit
  nonce and is specified in an IRTF draft, not in an RFC.
- NIST SP 800-38D: Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM)
- RFC 8265: Preparation, Enforcement, and Comparison of Internationalized Strings Representing
  Usernames and Passwords
- RFC 9052: CBOR Object Signing and Encryption (COSE): Structures and Process
- OWASP Application Security Verification Standard and Password Storage Cheat Sheet
