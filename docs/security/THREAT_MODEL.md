# Zavolt threat model

> **Status: draft 0.1, 22 November 2026. Not reviewed, not approved.** This is the first of the four
> deliverables of the evidence gate in
> [SECURITY.md](../../SECURITY.md#evidence-gate-for-cryptographic-implementation). It has not yet
> been through the internal review by ChatGPT and Claude, and the owner has not approved it. It
> authorises no implementation. Zavolt is not a working password manager: almost everything below
> describes a product that does not exist yet.

## 1. How to read this document

This model covers the product planned in [ARCHITECTURE.md](../ARCHITECTURE.md), Part 2, and the
public website that exists today. Part 2 is itself provisional, so this model is provisional too.

Every protection named here carries one of these labels:

| Label           | Meaning                                                                                               |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| **Exists**      | Implemented and tested in this repository today. Only the public website has any such protections.    |
| **Planned**     | Described in `ARCHITECTURE.md` Part 2. Not built.                                                     |
| **Provisional** | A recommendation of the internal review (`ARCHITECTURE.md` section 2.16). Not built and not approved. |
| **Open**        | No design exists. Listed in `DECISIONS.md` (Open) or in section 12 below.                             |

Identifiers: assets `AS`, security objectives `SO`, trust boundaries `TB`, attackers `AT`, threat
scenarios `T`, assumptions `AN`, risks proposed for acceptance `AR`, out-of-scope threats `OS`,
residual risks `RR`. Test identifiers (`ST-…`) refer to
[SECURITY_TEST_PLAN.md](./SECURITY_TEST_PLAN.md). The cryptographic design referred to is in
[PROTOCOL.md](./PROTOCOL.md).

## 2. The system

### 2.1 What exists today

Zavolt today is a static single-page website: a public homepage, placeholder pages, and a dashboard
that every visitor can open. There are no accounts, no backend, no database, no cryptography and no
stored user data. No hosting has been chosen, so nothing is deployed by the project. The source code
is in a public GitHub repository.

On 21 November 2026 the production build was opened in Chromium across all sixteen routes: every
request went to the site's own origin, and no cookie, Web Storage entry, IndexedDB database, Cache
Storage entry or service worker was created (see `../legal/COOKIE_ASSESSMENT.md`). That was a
one-off observation, not a repeatable test (ST-NOW-01 and ST-NOW-02 would make it one).

Protections that exist today, all on the website only (`SECURITY.md`):

| Control                                                                         | Status | Enforced by                                     |
| ------------------------------------------------------------------------------- | ------ | ----------------------------------------------- |
| Content-Security-Policy with Trusted Types and no inline code                   | Exists | `index.html`; `e2e/app.spec.ts` pins and probes |
| No third-party code or requests at runtime                                      | Exists | The policy above; self-hosted fonts and icons   |
| Refusal to run inside a frame                                                   | Exists | `src/main.tsx`                                  |
| No referrer sent                                                                | Exists | `index.html`                                    |
| Lint bans on HTML sinks, `eval`, Web Storage, `document.cookie`, `console`      | Exists | `.oxlintrc.json`, run in CI                     |
| Exact dependency versions, lockfile, no install scripts, seven-day update delay | Exists | `package.json`, `.npmrc`, Dependabot            |
| Dependency audit and registry signature checks                                  | Exists | CI `audit` job                                  |

### 2.2 What is planned

```text
  User ── master password ──▶ Client (web app │ browser extension │ desktop app)
                                   │  shared client core: key derivation, encryption,
                                   │  decryption, sync; keys in memory only
                                   ▼  TLS
                              Backend API ──▶ Database and backups
                                   │          (ciphertext, wrapped keys, verifiers or
                                   │           OPAQUE records, metadata, logs)
                                   ▼
                              Service providers: hosting, email, payments (none chosen)
```

Main flows: registration, sign-in, unlocking, vault synchronisation, device enrolment and
revocation, recovery, password change and key rotation, extension autofill, and software updates.
`PROTOCOL.md` describes each one.

## 3. Assets

| ID    | Asset                                                                                                   | Where it lives (planned)                               | Main property                            |
| ----- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------- |
| AS-01 | Master password                                                                                         | The user's memory; typed into a client; never stored   | Confidentiality                          |
| AS-02 | Root key material derived from it (the master key, or OPAQUE's export key)                              | Client memory only                                     | Confidentiality                          |
| AS-03 | Key-encryption keys and the account key                                                                 | Client memory; wrapped copies on the server            | Confidentiality, integrity               |
| AS-04 | Vault keys and item keys                                                                                | Client memory; wrapped copies on the server            | Confidentiality, integrity               |
| AS-05 | Recovery key                                                                                            | The user's offline copy; a wrapped key on the server   | Confidentiality                          |
| AS-06 | Vault contents: every field a user enters, which can include data about other people and sensitive data | Plaintext only in client memory                        | Confidentiality, integrity, availability |
| AS-07 | Vault ciphertext and wrapped keys                                                                       | Database, backups, client caches                       | Integrity, availability                  |
| AS-08 | Metadata the server sees: account existence, item counts and sizes, timestamps, revisions, devices      | Database, logs                                         | Confidentiality (privacy), integrity     |
| AS-09 | Authentication material: OPAQUE registration records or derived-key verifiers; multi-factor credentials | Database                                               | Confidentiality, integrity               |
| AS-10 | Session cookies or tokens and device identifiers                                                        | Client, server                                         | Confidentiality, integrity               |
| AS-11 | Account identity and contact data, and billing data if any                                              | Database; service providers                            | Confidentiality                          |
| AS-12 | IP addresses, request logs and security events                                                          | Hosting provider, backend logs                         | Confidentiality (privacy), integrity     |
| AS-13 | Server secrets: OPAQUE server keys, TLS keys, database and provider credentials                         | Server, secrets manager                                | Confidentiality                          |
| AS-14 | Integrity of delivered software: web application code, extension and desktop releases, update channels  | Hosting, extension stores, update server, signing keys | Integrity                                |
| AS-15 | Source repository, CI and dependencies                                                                  | GitHub, npm                                            | Integrity                                |
| AS-16 | Backups of the above                                                                                    | Hosting provider or backup service (not chosen)        | Confidentiality, integrity, availability |
| AS-17 | Truthfulness of the public website and documentation                                                    | Repository                                             | Integrity (users rely on it)             |

## 4. Security objectives

| ID    | Objective                                                                                                                                                    | Basis                                          |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| SO-01 | Vault contents stay confidential against anyone without the master password or the recovery key: the server, its operator, a database thief and the network. | `ARCHITECTURE.md` 2.2, principles 1 to 3, 5, 6 |
| SO-02 | Authentication and decryption stay separate: signing in, or stealing a session, never yields a decryption key.                                               | 2.2 principle 4; handoff section 8             |
| SO-03 | Tampering, substitution or relocation of any ciphertext or wrapped key is detected before plaintext is used.                                                 | 2.4 (Binding)                                  |
| SO-04 | Where possible, a client detects a server that rolls data back or withholds it.                                                                              | 2.6; Open                                      |
| SO-05 | Guessing a master password is slow offline and limited online.                                                                                               | 2.3, 2.4, 2.5                                  |
| SO-06 | Accounts resist takeover: multi-factor authentication, safe sessions, safe recovery.                                                                         | 2.5, 2.8                                       |
| SO-07 | Users can see and revoke devices, and a compromise can be contained.                                                                                         | 2.9                                            |
| SO-08 | The legitimate user can reach, export and delete their data, with honestly stated limits.                                                                    | 2.8; legal drafts                              |
| SO-09 | Zavolt collects and keeps the least data needed.                                                                                                             | GDPR Art. 5(1)(c), Art. 25                     |
| SO-10 | Delivered software is the software that was reviewed, built and signed.                                                                                      | 2.3, 2.10; `SECURITY.md` rule 7                |
| SO-11 | Security events are detected and logged without secrets, and incidents can be handled and notified on time.                                                  | 2.11; GDPR Arts 33, 34                         |
| SO-12 | Nothing claims a protection that does not exist.                                                                                                             | `SECURITY.md` rule 9                           |

## 5. Trust boundaries

| ID    | Boundary                                                                                     | What crosses it                                 |
| ----- | -------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| TB-01 | The user and their device                                                                    | The master password, the recovery key           |
| TB-02 | The web client and the origin that delivers its code                                         | Every byte of the web application's code        |
| TB-03 | The device and the network                                                                   | All traffic, protected by TLS                   |
| TB-04 | The network and the hosting edge (TLS termination, proxies, any content delivery network)    | Requests, IP addresses, headers                 |
| TB-05 | The API and its storage (database, backups, logs)                                            | Ciphertext, metadata, authentication material   |
| TB-06 | Administrators and production systems                                                        | Everything the server holds                     |
| TB-07 | In the extension: web page, content script, and the extension's own pages and service worker | Page data, fill requests, the credential filled |
| TB-08 | In the desktop application: renderer, privileged process, operating-system credential store  | Keys, files, clipboard                          |
| TB-09 | Developer machines, the repository, CI, package registries and distribution channels         | Source, dependencies, builds, signing           |
| TB-10 | Zavolt and its service providers (hosting, email, payments, support), none chosen yet        | Personal data the providers process             |
| TB-11 | A user's own devices, which only meet through the server                                     | Ciphertext, device records, manifests           |

## 6. Attackers

| ID    | Attacker                                                              | Capabilities assumed                                                                                                                              | In scope                               |
| ----- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| AT-01 | Passive network observer                                              | Reads traffic                                                                                                                                     | Yes                                    |
| AT-02 | Active network attacker                                               | Intercepts, alters, replays, redirects traffic; controls a network the user joins                                                                 | Yes                                    |
| AT-03 | Database or backup thief                                              | A full copy of the database and backups; unlimited offline computation; no live control of the server                                             | Yes                                    |
| AT-04 | Honest-but-curious server or operator                                 | Reads everything it stores or receives; follows the protocol                                                                                      | Yes                                    |
| AT-05 | Malicious or compromised server, including one under legal compulsion | AT-04, plus: alters responses, serves modified web code, rolls back, withholds or forks data, downgrades parameters, forges protocol messages     | Yes, with limits (AR-02, AR-08, AR-09) |
| AT-06 | Malicious insider at Zavolt                                           | Administrative access to production and logs                                                                                                      | Yes, as AT-04 and AT-05                |
| AT-07 | Remote attacker against accounts                                      | Credential stuffing, online guessing, phishing of passwords, recovery keys and codes, social engineering, enumeration                             | Yes                                    |
| AT-08 | Malicious website or content                                          | Injected content on Zavolt pages; hostile pages against the extension: fake or invisible forms, cross-origin frames, overlays, look-alike domains | Yes                                    |
| AT-09 | Other browser extensions or applications without system privileges    | Read or change page content where the browser allows; read files of the same user where the operating system allows                               | Partly: see 8.4, 8.5 and AR-01         |
| AT-10 | Malware with user or system privileges                                | Keylogging, screen capture, memory reading                                                                                                        | No, for confidentiality (AR-01)        |
| AT-11 | Device thief                                                          | The device powered off, locked, or unlocked with Zavolt open; can copy the disk                                                                   | Yes                                    |
| AT-12 | Supply-chain attacker                                                 | Compromises a dependency, build tool, CI action, registry, extension store, update server or developer account                                    | Yes                                    |
| AT-13 | Recovery attacker                                                     | Steals or phishes a recovery key; abuses the recovery flow                                                                                        | Yes                                    |
| AT-14 | Service-provider insider                                              | AT-04 or AT-05 for what the provider runs, such as hosting or email (including verification emails)                                               | Yes                                    |

## 7. Attack surfaces

### 7.1 Web application

- How its code reaches the browser (TB-02). Whoever controls the origin, the hosting or the build
  can deliver code that reads the master password (AR-02).
- Injected content on Zavolt's own pages. Today the Content-Security-Policy and Trusted Types block
  it (Exists).
- Dependencies bundled into the page (Exists: small tree, pinned, audited).
- The Web Crypto API and a WebAssembly module for Argon2id. WebAssembly needs `'wasm-unsafe-eval'`
  in `script-src`, which CSP Level 3 uses to gate WebAssembly compilation (Planned; an owner
  decision).
- Session cookies and state-changing requests: cross-site request forgery (Planned: `__Host-`
  cookie, `SameSite=Strict`, `Origin` checks).
- Framing and clickjacking (Exists: script check; Planned: `frame-ancestors` header from the host).
- Other extensions installed in the user's browser, which can read page content (AT-09).

### 7.2 Backend and storage

Registration, authentication, recovery and device endpoints; the sync API and its object-level
authorisation; input parsing; rate limiting; email sending; administrative access; the database,
backups and logs; secrets management; TLS and response headers. None of it exists. No technology or
hosting has been chosen.

### 7.3 Browser extension

Content scripts in hostile pages; messages between content scripts and the extension; origin
matching; the autofill interface; host permissions; extension storage; the Manifest V3 service
worker, which the browser stops when idle, so keys cannot simply live in its memory (the reason for
the provisional `storage.session` design, which needs an exception to `SECURITY.md` rule 4); and the
store and update channel. Not built.

### 7.4 Desktop application

The shell (provisionally Electron, after a written comparison); renderer isolation and inter-process
messages; no remote code; signing and updates; the operating-system credential store; the local
encrypted cache; clipboard, screen capture, crash dumps, swap and hibernation files. Not built; no
shell chosen.

### 7.5 Shared client core

Key derivation, encryption, key handling, the randomness source, and the parsing of everything the
server sends, which a malicious server controls (AT-05). Not built.

### 7.6 Repository, CI and releases

The GitHub account and repository, Actions (pinned by commit), Dependabot, npm, and future release
signing for the extension and desktop application (Open).

## 8. Threat scenarios

Mitigation labels are those of section 1. A mitigation marked Planned, Provisional or Open does not
exist.

### 8.1 Server compromise

| ID     | Scenario                                                                          | Mitigation (status)                                                                                                                                | What remains                                                                       | Tests                     |
| ------ | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------- |
| T-S-01 | Read access to the live server: it sees everything sent to it                     | Only ciphertext, wrapped keys and authentication records are stored (Planned). With OPAQUE, nothing password-equivalent is ever sent (Provisional) | Metadata (AR-03). With a derived key, a password-equivalent value at every sign-in | ST-LEAK-01                |
| T-S-02 | The server serves modified web application code that captures the master password | Strict policy and small dependency tree (Exists for the site). Signed extension and desktop clients as the stronger option (Planned)               | Not preventable for the web client (AR-02)                                         | ST-HDR-01                 |
| T-S-03 | The server swaps, moves or re-labels ciphertext between items, fields or accounts | Associated data binds each ciphertext to its context (Planned, `PROTOCOL.md` section 10.2)                                                         | None expected if implemented correctly                                             | ST-CTX-01 to 03           |
| T-S-04 | The server offers weaker key-derivation parameters or algorithms                  | Clients enforce minimums and reject unknown algorithms, with no fallback (Planned)                                                                 | None expected                                                                      | ST-MAL-01, ST-MAL-02      |
| T-S-05 | The server rolls data back, withholds items, or shows devices different states    | Revisions and tombstones (Planned); a hash-chained manifest (Provisional, needs formal analysis)                                                   | Fork attacks only partly detectable (AR-09)                                        | ST-RB-01 to 03, ST-MAL-06 |
| T-S-06 | The server injects items or keys of its own                                       | Item keys must unwrap under the user's keys; manifest checks (Provisional)                                                                         | Depends on the open manifest design                                                | ST-MAL-04                 |
| T-S-07 | The server forges authentication responses to learn about a password              | OPAQUE resists this by design (RFC 9807); with a derived key, the server receives the key itself                                                   | Depends on the authentication decision                                             | ST-MAL-03                 |

### 8.2 Database theft

| ID     | Scenario                                                         | Mitigation (status)                                                                                                                 | What remains                                                           | Tests      |
| ------ | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------- |
| T-D-01 | Offline guessing of master passwords from authentication records | Argon2id with versioned, client-enforced parameters (Planned). With OPAQUE, guessing also needs the server's OPRF key (Provisional) | Weak passwords fall (AR-04), especially if server keys are also stolen | ST-BF-02   |
| T-D-02 | Reading vault contents from ciphertext                           | 256-bit keys; nothing stored decrypts without the password or recovery key (Planned)                                                | None expected                                                          | ST-KEY-01  |
| T-D-03 | Learning about users from metadata                               | Keep metadata minimal; padding deferred (2.17)                                                                                      | AR-03                                                                  | (review)   |
| T-D-04 | Theft of backups or logs                                         | Same protections as the database; logs never hold secrets (Planned); retention limits (Open)                                        | IP addresses and timing in logs                                        | ST-LEAK-01 |

### 8.3 Malicious or compromised client

| ID     | Scenario                                                                         | Mitigation (status)                                                                                        | What remains                                | Tests                 |
| ------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------- | --------------------- |
| T-C-01 | A modified client (or a script) calls the API for another user's data            | Authorisation of every request against the object it touches (Planned)                                     | None expected                               | ST-SES-02             |
| T-C-02 | A client sends malformed or oversized data to attack the server or other devices | Schema validation at the API; strict parsing in the client core (Planned)                                  | Parser bugs                                 | ST-TAMP-03, ST-MAL-05 |
| T-C-03 | A compromised dependency inside the client core                                  | Small pinned tree, audits, signature checks, review of updates (Exists for the site; Planned for the core) | AR-02 for the web client                    | ST-NOW-05             |
| T-C-04 | A user's own compromised device writes corrupted data that other devices accept  | Authenticated encryption; manifest (Provisional)                                                           | A device with the keys can write valid data | ST-DEV-02             |

### 8.4 Browser extension

| ID     | Scenario                                                                 | Mitigation (status)                                                                                                                                                                                  | What remains                                    | Tests         |
| ------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------- |
| T-E-01 | A page tricks the extension into filling credentials for another site    | Exact origin match by default; no fill into cross-origin frames; fill only after the user asks (Planned)                                                                                             | User error on look-alike domains                | ST-EXT-02, 03 |
| T-E-02 | Invisible fields, overlays or DOM changes capture a filled credential    | Fill only on user action, in visible fields; interface drawn in extension-owned surfaces (Planned)                                                                                                   | Pages control their own DOM                     | ST-EXT-03     |
| T-E-03 | A content script, or a page talking to it, obtains keys or the vault     | A content script receives only the one credential being filled (Planned)                                                                                                                             | None expected                                   | ST-EXT-01     |
| T-E-04 | Keys kept between service-worker restarts leak from extension storage    | Keys sealed in `storage.session` under a non-extractable key (Provisional; needs an exception to rule 4). Chrome documents this area as held in memory and not exposed to content scripts by default | Needs analysis; no standard defines this design | ST-EXT-04     |
| T-E-05 | A malicious update or a hijacked store account ships a hostile extension | Release signing and store account protection (Open)                                                                                                                                                  | AR-02-like trust in the channel                 | ST-SC-01      |

### 8.5 Desktop application

| ID     | Scenario                                                               | Mitigation (status)                                                                              | What remains               | Tests               |
| ------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------- | ------------------- |
| T-P-01 | Injected content in the renderer reaches privileged functions          | No remote code, isolated renderer, narrow messaging (Planned; shell not chosen)                  | Depends on the shell       | ST-EXT-01 (adapted) |
| T-P-02 | A malicious update                                                     | Signed builds and verified updates (Planned)                                                     | Signing-key compromise     | ST-SC-01            |
| T-P-03 | Secrets reach the clipboard, crash dumps, swap or hibernation files    | Clipboard cleared after a delay (Planned); no secrets in logs; dumps and swap are limits (AR-06) | Operating-system behaviour | ST-MEM-04           |
| T-P-04 | Other programs of the same user read the local cache or device secrets | Local cache holds ciphertext only; device secrets in the operating-system store (Planned)        | Same-user malware (AR-01)  | ST-LEAK-01          |

### 8.6 Account takeover and brute force

| ID     | Scenario                                | Mitigation (status)                                                                                                         | What remains                                           | Tests              |
| ------ | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------ |
| T-A-01 | Online guessing and credential stuffing | Limits per account and per address with growing delays; identical errors; breached-password checks (Planned)                | Distributed attacks                                    | ST-BF-01           |
| T-A-02 | Learning which accounts exist           | Stable fake answers for unknown accounts (Planned); OPAQUE fake responses (RFC 9807 section 10.9); registration rate limits | Registration remains an oracle (RFC 9807 section 10.9) | ST-BF-04, ST-PW-02 |
| T-A-03 | Phishing of the master password         | Extension origin matching; user education (Planned)                                                                         | Phishing remains possible                              | (review)           |
| T-A-04 | Session theft                           | `__Host-` cookie, `HttpOnly`, `Secure`, `SameSite=Strict`; short, revocable sessions (Planned); a session never decrypts    | Access to ciphertext and metadata                      | ST-SES-01 to 03    |
| T-A-05 | Bypassing multi-factor authentication   | TOTP and WebAuthn for sign-in (Planned); recovery never bypasses decryption                                                 | Depends on the factors chosen                          | ST-REC-01          |

### 8.7 Device theft and malware

| ID     | Scenario                                | Mitigation (status)                                                                                          | What remains                                                     | Tests                |
| ------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | -------------------- |
| T-M-01 | A stolen locked device or a copied disk | Nothing on disk decrypts without the master password (Planned); online-only unlocking at first (Provisional) | Offline unlocking, if added, allows offline guessing like T-D-01 | ST-LEAK-01           |
| T-M-02 | A stolen device with Zavolt unlocked    | Automatic locking after inactivity and on device events (Planned); device revocation (Planned)               | Data shown before revocation (AR-07)                             | ST-MEM-03, ST-DEV-01 |
| T-M-03 | Malware on the device                   | None for confidentiality (AR-01)                                                                             | Everything the user unlocks                                      | —                    |

### 8.8 Recovery and revocation

| ID     | Scenario                                                | Mitigation (status)                                                                                             | What remains                           | Tests         |
| ------ | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------- |
| T-R-01 | Theft or phishing of the recovery key                   | Shown once; announced to other devices; cooling-off period; email verification (Provisional)                    | The key is as powerful as the password | ST-REC-01, 02 |
| T-R-02 | Abuse of recovery to lock the owner out or replace keys | Proof of the account key before any key is replaced (Provisional); notifications and delay                      | Needs design and analysis              | ST-REC-03     |
| T-R-03 | Recovery turned into a way for Zavolt to decrypt        | Forbidden by owner commitment (`DECISIONS.md`, 2026-11-16) and principle 6                                      | None if kept                           | (review)      |
| T-R-04 | A revoked device keeps working or keeps old data        | Sessions ended at once; keys rotated when the device may have been unlocked (Planned, three levels Provisional) | Data already seen (AR-07)              | ST-DEV-01, 02 |

### 8.9 Supply chain

| ID      | Scenario                                              | Mitigation (status)                                                                                       | What remains                              | Tests     |
| ------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------- | --------- |
| T-SC-01 | A malicious npm package or update                     | Exact versions, lockfile, no install scripts, seven-day delay, audit and signature checks (Exists)        | A malicious release older than seven days | ST-NOW-05 |
| T-SC-02 | A compromised GitHub Action or CI configuration       | Actions pinned by commit (Exists); least-privilege tokens (to review)                                     | Pinned code can still be malicious        | (review)  |
| T-SC-03 | A compromised developer or GitHub account pushes code | Pull requests and owner approval for code (Exists as policy); account protection (outside the repository) | Social engineering                        | (review)  |
| T-SC-04 | Secrets committed to the repository                   | Lint and review; no secrets in client code (Exists as rule)                                               | History scanning not run                  | ST-NOW-06 |
| T-SC-05 | Compromised distribution channel or signing key       | Signed releases, verified updates (Planned)                                                               | Key custody (Open)                        | ST-SC-01  |

### 8.10 The current website

| ID     | Scenario                                          | Mitigation (status)                                                 | What remains                                      | Tests         |
| ------ | ------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------- | ------------- |
| T-W-01 | Injected script on the site                       | Content-Security-Policy, Trusted Types, React escaping (Exists)     | Browsers that ignore the policy                   | ST-NOW-03     |
| T-W-02 | Tracking or third-party requests added by mistake | The policy blocks other origins (Exists); no dedicated request test | A future policy change                            | ST-NOW-01, 02 |
| T-W-03 | Missing response headers once hosted              | Listed in `SECURITY.md` (Planned with hosting)                      | No hosting chosen                                 | ST-HDR-01     |
| T-W-04 | Misleading statements about what the product does | Status labels and `SECURITY.md` rule 9 (Exists as policy)           | See `../legal/LEGAL_OPEN_QUESTIONS.md`, section 4 | (review)      |

## 9. Risks proposed for acceptance, and threats out of scope

**None of these has been accepted by the owner.** Accepting a risk is the owner's decision, to be
recorded in `DECISIONS.md`. Until then they are proposals, mostly taken from `ARCHITECTURE.md` 2.3.

| ID    | Risk proposed for acceptance                                                                                                                     |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| AR-01 | A compromised device or operating system (AT-10) defeats every password manager. Confidentiality is not claimed against it.                      |
| AR-02 | A web application trusts the server that delivers it. A malicious or compelled server can deliver code that captures the master password.        |
| AR-03 | The server learns that an account exists, how many items it holds, their approximate sizes, when they change, and the addresses it is used from. |
| AR-04 | A weak master password can be guessed offline by someone holding the stored records (and, with OPAQUE, the server's keys).                       |
| AR-05 | Losing both the master password and the recovery key loses the vault. Nobody can recover it; the product must say so before sign-up.             |
| AR-06 | JavaScript and other managed runtimes cannot guarantee that key material is erased from memory.                                                  |
| AR-07 | A revoked or stolen device keeps whatever it had already decrypted or cached.                                                                    |
| AR-08 | A malicious server can refuse service or delete data. Clients can at best detect it.                                                             |
| AR-09 | A server can show different devices different states. Without comparison between devices this is only partly detectable.                         |

| ID    | Out of scope                                                                                                                     |
| ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| OS-01 | Coercion of the user.                                                                                                            |
| OS-02 | Vulnerabilities in browsers and operating systems themselves, beyond keeping them updated.                                       |
| OS-03 | Attacks on the services whose credentials users store.                                                                           |
| OS-04 | Quantum attacks on public-key cryptography. No public-key encryption of vault data is planned before sharing, which is deferred. |
| OS-05 | Denial-of-service attacks on infrastructure, which belong to operational planning rather than this model.                        |

## 10. Residual risks

| ID    | Residual risk after the planned mitigations                                                            | What would reduce it further                                               |
| ----- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| RR-01 | Malicious web code delivered by the server (AR-02)                                                     | Encourage the signed desktop and extension clients for high-risk users     |
| RR-02 | Offline guessing of weak passwords (AR-04)                                                             | Stronger parameters, a device-held secret (deferred), password guidance    |
| RR-03 | Fork and rollback attacks (AR-09)                                                                      | A formally analysed manifest protocol; comparison between devices          |
| RR-04 | Recovery as a phishing target                                                                          | Delays, notifications, and clear user education                            |
| RR-05 | Custom compositions without published analysis: key commitment, the manifest, sealed extension storage | Formal or expert analysis; the independent audit                           |
| RR-06 | Implementation errors in a first-version client core                                                   | Test vectors, the security-test plan, the independent audit before release |
| RR-07 | Metadata exposure (AR-03)                                                                              | Padding and further minimisation (deferred)                                |

## 11. Assumptions

| ID    | Assumption                                                                                                                                   |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| AN-01 | The platform's cryptographic random source is sound.                                                                                         |
| AN-02 | The primitives in `PROTOCOL.md` are secure as published, and the libraries that implement them are correct (checked with published vectors). |
| AN-03 | TLS with HSTS protects traffic against AT-01 and AT-02.                                                                                      |
| AN-04 | The user's device is not compromised while Zavolt is unlocked.                                                                               |
| AN-05 | Browsers enforce the same-origin policy, the Content-Security-Policy, Trusted Types and extension isolation as specified.                    |
| AN-06 | Master passwords have enough strength for the chosen key-derivation cost; blocklists and guidance help.                                      |
| AN-07 | With OPAQUE, the server's keys are stored and backed up separately from the database.                                                        |
| AN-08 | Clocks are roughly correct, for sessions and recovery delays.                                                                                |
| AN-09 | The user's email account is reasonably secure, if email takes part in recovery. This is a weak assumption.                                   |
| AN-10 | Code signing and the extension stores work as intended.                                                                                      |

## 12. Open questions

These come in addition to the open decisions in `DECISIONS.md` and the unresolved questions in
`PROTOCOL.md` section 22.

1. Which of the risks in section 9 does the owner accept, in writing?
2. Is offline unlocking ever offered? It changes T-M-01 into a database-theft scenario on the
   device.
3. Which browsers and platforms are supported? The extension and desktop scenarios depend on it.
4. How are signing keys for the extension and the desktop application held, and by whom?
5. What does Zavolt log, where, and for how long? (Also a privacy question: see `../legal/`.)
6. Is a separate threat model needed for sharing between users before it is designed?

## 13. References

All were read from the official publisher on 21 November 2026.

- Zavolt: `ARCHITECTURE.md` Part 2, `SECURITY.md`, `DECISIONS.md`, the handoff (sections 7 to 10).
- RFC 9807, _The OPAQUE Augmented PAKE Protocol_ (IRTF, Informational, July 2025), section 10.9
  (client enumeration) and section 10.4 (export key usage). <https://www.rfc-editor.org/rfc/rfc9807>
- RFC 9106, _Argon2 Memory-Hard Function_ (IRTF, Informational, September 2021), section 4.
  <https://www.rfc-editor.org/rfc/rfc9106>
- NIST SP 800-63B-4, _Authentication and Authenticator Management_ (August 2025): password length,
  blocklists, Unicode normalisation. <https://pages.nist.gov/800-63-4/sp800-63b.html>
- W3C, _Content Security Policy Level 3_: `'wasm-unsafe-eval'` gates WebAssembly compilation.
  <https://www.w3.org/TR/CSP3/>
- Chrome for Developers, `chrome.storage` API: the session area is held in memory, cleared when the
  extension reloads or the browser restarts, and not exposed to content scripts by default.
  <https://developer.chrome.com/docs/extensions/reference/api/storage>
- Regulation (EU) 2016/679 (GDPR), Articles 5, 25, 32, 33 and 34.
  <https://eur-lex.europa.eu/eli/reg/2016/679/oj>

## 14. Change log

| Version | Date             | Change                   |
| ------- | ---------------- | ------------------------ |
| 0.1     | 22 November 2026 | First draft, for review. |
