# Architecture

This document describes two different things and keeps them apart:

- **Part 1** is what the repository contains today. It is implemented and tested.
- **Part 2** is the intended design of the full product. **None of it is implemented.** It records
  direction and constraints so that later work starts from the same assumptions. Every section in
  Part 2 is a plan, and a plan that touches cryptography must be reviewed by a qualified
  cryptographer before any of it is built.

| Component                                    | Status                                 |
| -------------------------------------------- | -------------------------------------- |
| Web application shell, dashboard, navigation | Implemented                            |
| Section pages (contact, vault, account)      | Placeholder: a message and a link back |
| Browser hardening                            | Partial: page-level only, see 1.5      |
| Authentication                               | Planned                                |
| Zero-knowledge encryption and key management | Planned                                |
| Backend API                                  | Planned                                |
| Vault synchronisation                        | Planned                                |
| Device management                            | Planned                                |
| Account recovery                             | Planned                                |
| Desktop application                          | Planned                                |
| Browser extension                            | Planned                                |

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

| Path                          | Role                                                                                           |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| `index.html`                  | The shell. Declares the Content-Security-Policy and loads the entry module.                    |
| `src/main.tsx`                | Entry point. Loads fonts and global styles, refuses to run in a frame, mounts React.           |
| `src/App.tsx`                 | Wraps the route table in the router and the loading screen.                                    |
| `src/AppRoutes.tsx`           | The route table. Moves focus to the page heading after each navigation.                        |
| `src/sections.ts`             | The single list of sections, their routes, icons and accent colours, and the legacy addresses. |
| `src/components/SplashGate`   | Shows the loader for three seconds once per page load, then reveals the application.           |
| `src/components/SplashLoader` | The animated loader.                                                                           |
| `src/components/Icon`         | The three icons, bundled as inline SVG.                                                        |
| `src/components/MessagePage`  | A page that states one thing and links back to the dashboard.                                  |
| `src/pages/`                  | Dashboard, section placeholder and not-found pages.                                            |
| `src/styles/global.css`       | Reset, design tokens and accent colours.                                                       |

### 1.3 Routing

Routing is client-side (React Router, declarative mode).

| Address                                                    | Page                                      |
| ---------------------------------------------------------- | ----------------------------------------- |
| `/`                                                        | Dashboard                                 |
| `/contact`, `/vault`, `/account`                           | Placeholder for each dashboard section    |
| `/cart`, `/shop`                                           | Placeholders kept from the original site  |
| `/index.html`, `/account.html`, `/cart.html`, `/shop.html` | Redirect to the routes that replaced them |
| anything else                                              | Not found                                 |

Client-side routing is a deliberate choice for a password manager. An unlocked vault key must exist
only in memory. If moving between pages reloaded the document, the key would be lost each time, and
the tempting fix, writing it to browser storage, is exactly what must never happen.

### 1.4 State and styling

There is no global state and no state library. The only state is whether the loading screen has
finished. Add shared state when a feature needs it, not before.

Styles are CSS Modules next to their components, plus one global stylesheet. The values were carried
over from the original stylesheets. Accent colours are selected with a `data-accent` attribute
instead of inline styles, because the Content-Security-Policy forbids inline styles.

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

| Layer      | Tool                           | Covers                                                                                          |
| ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------- |
| Types      | TypeScript, strict             | Application, configuration and tests.                                                           |
| Lint       | oxlint with type-aware rules   | Correctness, accessibility, and the security rules in SECURITY.md.                              |
| Unit       | Vitest, Testing Library, jsdom | Loading screen timing, routes, redirects, focus handling, keyboard use.                         |
| End to end | Playwright with axe-core       | The production build in Chromium at desktop and phone sizes: navigation, policy, accessibility. |

### 1.7 Known limits of the current code

- **The dashboard is not protected.** It is described as the page a signed-in user sees, but nothing
  checks who the visitor is. No code may assume otherwise until authentication exists.
- **The loading screen waits on a timer, not on work.** Nothing is loading during those three
  seconds. When start-up does real work, the gate should wait for that instead.
- **The loader artwork is a shopping cart and the favicon is a "TDR" monogram.** Both come from the
  original site and were kept unchanged. Replacing them is a branding decision.
- **End-to-end tests run in Chromium only.**

---

## Part 2: The planned product

Everything from here on is planned. Nothing in this part has been built.

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
anything equivalent to the password, even at registration. Which to use is an open decision.

### 2.6 Vault synchronisation

- The server is the source of truth for ciphertext. Each item has a server-assigned revision.
- Clients keep an encrypted local copy and fetch changes since the last revision they saw.
- A write names the revision it was based on. If the item has changed since, the server refuses and
  the client resolves the conflict. It never silently discards either version.
- Deletions are recorded, so that a device that was offline does not bring an item back.
- The local copy holds ciphertext only. Locking the vault discards the keys from memory.

Open question: how a client detects a server that withholds or rolls back items.

### 2.7 Key management and rotation

| Event                               | What happens                                                                                 |
| ----------------------------------- | -------------------------------------------------------------------------------------------- |
| Master password change              | New salt, new master key. The vault key is re-wrapped and the verifier replaced, atomically. |
| Stronger derivation parameters      | Applied at the next sign-in, the same way as a password change.                              |
| Suspected exposure of the vault key | A new vault key is generated and every item key is re-wrapped.                               |
| Item edited                         | The item gets a fresh item key.                                                              |
| Algorithm retired                   | Items are re-encrypted in the new format on next access. Old formats are then refused.       |

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
| Derived authentication key, or OPAQUE                                      | See 2.5.                                                                   |
| A second, device-held secret mixed into key derivation                     | Protects weak master passwords if the database leaks. Adds setup friction. |
| One client core in a compiled language, or separate libraries per platform | One implementation is easier to audit.                                     |
| AES-256-GCM, XChaCha20-Poly1305, or both                                   | Depends on the client core decision.                                       |
| Desktop shell                                                              | Smaller attack surface against maturity of tooling.                        |
| Backend technology and hosting                                             | Hosting also decides how the headers in SECURITY.md are sent.              |
| Detecting withheld or rolled-back data                                     | See 2.6.                                                                   |
| Sharing between users                                                      | Needs public keys. The hierarchy in 2.4 leaves room for it.                |
| The `/cart` and `/shop` routes, the loader artwork, the favicon            | Inherited from the original template.                                      |
| Licence                                                                    | None chosen.                                                               |

### 2.14 Suggested order of work

1. Write the threat model and the protocol in full, and have a cryptographer review them.
2. Build the client core as a package with no user interface, tested against published vectors.
3. Build the backend: accounts, authentication, encrypted storage, rate limiting.
4. Add sign-up, sign-in, unlock and the vault to the web application.
5. Add synchronisation, device management and recovery.
6. Build the browser extension, then the desktop application.
7. Commission an independent security audit before any public release.

### References

- RFC 9106: Argon2 Memory-Hard Function for Password Hashing and Proof-of-Work Applications
- RFC 5869: HMAC-based Extract-and-Expand Key Derivation Function (HKDF)
- RFC 9807: The OPAQUE Augmented Password-Authenticated Key Exchange (aPAKE) Protocol
- RFC 8439: ChaCha20 and Poly1305 for IETF Protocols. XChaCha20-Poly1305 extends it with a 192-bit
  nonce and is specified in an IRTF draft, not in an RFC.
- NIST SP 800-38D: Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM)
- OWASP Application Security Verification Standard and Password Storage Cheat Sheet
