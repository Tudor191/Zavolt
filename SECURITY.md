# Security

## Current status

Zavolt is in early development. It is not a working password manager yet.

- There is no authentication. Every page is served to every visitor, including the application
  dashboard at `/app`. The split between the public site and the application area is about
  presentation, not access.
- There is no encryption, no vault and no backend. Nothing is stored anywhere.
- Nothing in this repository has been reviewed by an independent security auditor.
- The planned cryptographic design is reviewed internally, with AI assistance, by ChatGPT and
  Claude. That is not an independent review (see
  [Cryptographic design review](#cryptographic-design-review)).

Do not use Zavolt for real credentials. No claim that Zavolt is secure or production-ready should be
made until the planned design in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) has been built,
tested and independently audited.

## Reporting a vulnerability

Please report privately, not in a public issue or pull request.

Use GitHub's private vulnerability reporting: open the repository's **Security** tab and choose
**Report a vulnerability**. If that button is not there, the repository owner has not enabled the
feature yet; contact the owner directly and share details only in private.

Include what you found, how to reproduce it, and what an attacker could do with it.

## What protects the application today

These measures are implemented and covered by automated tests.

| Measure                        | What it does                                                                                                                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content-Security-Policy        | Shipped in `index.html`. Scripts, styles, fonts and images load only from the application's own origin. Nothing inline runs, `eval` is blocked, and `<base>` cannot be injected.             |
| Trusted Types                  | The policy requires Trusted Types and allows no policy to be created, so assigning a string to `innerHTML` and similar sinks throws instead of rendering.                                    |
| No third-party code at runtime | Icons and fonts are bundled. The application makes no request to any other origin.                                                                                                           |
| Frame refusal                  | The application does not start inside a frame, which limits clickjacking. See the header requirement below; this check is a second line of defence, not the first.                           |
| No referrer                    | Pages ask the browser not to send a referrer, so addresses do not leak to other sites.                                                                                                       |
| Output encoding                | All content is rendered through React, which escapes text by default. `dangerouslySetInnerHTML` is banned by the linter.                                                                     |
| Lint rules                     | The linter rejects HTML-string sinks, `eval` and `new Function`, `localStorage` and `sessionStorage`, `document.cookie`, `console` calls, `any`, and unhandled promises.                     |
| Supply chain                   | Exact versions and a lockfile; dependency install scripts never run; updates wait seven days after release; CI runs `npm audit` and verifies registry signatures; actions are pinned by SHA. |

The development server does not apply the Content-Security-Policy, because hot reloading cannot run
under it. The end-to-end tests run against the production build, so a change that violates the
policy fails in CI even though it works during development.

## Response headers a host must send

A policy inside the page cannot express everything. Whatever serves the production build must send
these headers. None of this is configured yet, because no hosting has been chosen.

| Header                                                                         | Why                                                                                          |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `Strict-Transport-Security: max-age=63072000; includeSubDomains`               | Browsers must never reach the application over plain HTTP.                                   |
| `Content-Security-Policy` with the page's policy plus `frame-ancestors 'none'` | `frame-ancestors` only works as a header. It is the real protection against clickjacking.    |
| `X-Content-Type-Options: nosniff`                                              | Stops browsers from guessing content types.                                                  |
| `Referrer-Policy: no-referrer`                                                 | Same intent as the page's meta tag, enforced for every response.                             |
| `Permissions-Policy` denying camera, microphone, geolocation and payment       | The application uses none of these, so nothing running in it should be able to request them. |
| `Cross-Origin-Opener-Policy: same-origin`                                      | Isolates the application's window from pages that open it or that it opens.                  |
| `Cross-Origin-Resource-Policy: same-origin`                                    | Stops other sites from embedding the application's resources.                                |

Serve the application from the root of an origin that hosts nothing else. Pages on the same origin
share everything the browser stores for it.

## What does not exist yet

Each of these is planned and described in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md). None is
implemented.

- Sign-up, sign-in, sessions, multi-factor authentication
- Key derivation, vault encryption, key rotation
- A backend, and with it rate limiting, CSRF protection, input validation at an API boundary, and
  protection against credential stuffing
- Account recovery and device management

## Rules for code in this repository

1. **Nothing shipped to the browser is secret.** Never put API keys, tokens or credentials in client
   code, in configuration that is bundled, or in the repository.
2. **Never log sensitive values.** No passwords, keys, tokens, vault contents or personal data in
   logs, error messages or analytics. The linter bans `console` in application code for this reason.
3. **Never build HTML from strings.** Render through React.
4. **Never write secrets, keys or decrypted vault data to browser storage.** That includes
   `localStorage`, `sessionStorage`, cookies readable by script, and IndexedDB. Unlocked key material
   lives in memory only.
5. **Never load code, fonts, styles or analytics from another origin at runtime.**
6. **Never invent cryptography.** Use reviewed, standard constructions from vetted libraries, cover
   them with published test vectors, and put any change that touches them through the
   cryptographic design review below. Production cryptographic code must also pass the evidence
   gate below first. Never implement a construction without documented justification.
7. **Treat every dependency as code you are responsible for.** Add one only when the alternative is
   clearly worse, and keep to the seven-day waiting period for new releases.
8. **Do not loosen a security control to make something pass.** If the Content-Security-Policy, a
   lint rule or a test blocks a change, the change needs rethinking or the exception needs a written
   reason and a review.
9. **Say only what is true about the product.** The public site, documentation and pull requests
   must not claim, or imply, that anything planned already exists: no "secure", "encrypted",
   "audited" or "certified" as a present-tense claim, no invented users, testimonials, prices,
   screenshots, downloads, certifications or legal text. Every feature on the homepage carries a
   status label for this reason.
10. **Code reaches `main` only through a pull request.** Write code only on a dedicated feature
    branch, start an implementation stage only with the owner's explicit approval, and merge only
    with the owner's explicit approval. Only documentation-only changes, made at the owner's
    request, are committed directly to `main`. Text shown on the website is code, not
    documentation.

## Cryptographic design review

Zavolt has no cryptography specialist. On 17 November 2026 the owner replaced the earlier
requirement, a cryptographer's review of the design before implementation, with this process
(`docs/DECISIONS.md`):

1. ChatGPT and Claude carry out a documented internal architecture and security review.
2. Each review identifies its assumptions, unresolved questions, protocol risks, implementation
   risks and the standards it relies on.
3. Security-sensitive decisions are recorded in `docs/DECISIONS.md`. Only the owner decides.
4. No cryptographic construction is invented, and none is implemented without documented
   justification: the standard or published design it follows, and why it applies.
5. Implementation proceeds through stages that the owner explicitly approves, one at a time.
   Production cryptographic implementation must first pass the evidence gate below. Code is written
   on a dedicated feature branch and reaches `main` only through a pull request the owner approves
   (rule 10).
6. An independent external security audit takes place before any public release.

**The internal review is not independent.** ChatGPT and Claude are AI assistants. They are not
independent security auditors or qualified cryptography specialists, and their review is not an
independent security review, an audit or a certification. Nothing written about Zavolt may describe
it as one. Only the audit in point 6 is independent, and the internal review neither replaces it
nor reduces what it must cover.

## Evidence gate for cryptographic implementation

The owner made this gate mandatory on 21 November 2026 (`docs/DECISIONS.md`). It adds to the review
process above and replaces none of it.

**What it covers.** The gate applies to production cryptographic implementation: code meant to ship
in a Zavolt client or service that derives, stores, wraps or uses keys, encrypts or decrypts,
authenticates accounts or devices, or otherwise relies on cryptography for security. It does not
block documentation work, including writing the deliverables below, or preparation that involves no
cryptography. Any other cryptographic code still needs the owner's explicit approval first, under
the rules above and in the handoff.

**What must exist first.** Before any production cryptographic implementation begins, all four
deliverables below exist in the repository under `docs/`, and each has been through the documented
internal review.

**Where things stand.** First drafts of all four (version 0.1, 22 November 2026) are in
[docs/security/](./docs/security/README.md). None has been through the internal review or been
approved, so **the gate is not met**.

1. **Threat model.** It covers:
   - assets and security objectives;
   - trust boundaries;
   - the relevant attackers and their capabilities;
   - attack surfaces across the web application, the backend, the browser extension and the desktop
     application;
   - explicit assumptions;
   - threats in scope and out of scope;
   - residual risks.
2. **Protocol specification.** It is versioned, and covers:
   - authentication and key derivation;
   - the key hierarchy and envelope encryption;
   - encryption and authenticated data formats;
   - nonce generation and key usage limits;
   - vault synchronisation and integrity;
   - recovery and device revocation;
   - the session lifecycle and locking;
   - rollback protection;
   - error handling and security-sensitive state transitions.

   Every cryptographic construction in it has a documented rationale and references to the relevant
   standards. Writing a provisional recommendation into the specification does not approve it; only
   the owner's approval of the design does (step 3 of the approval sequence).

3. **Test-vector plan.** It names authoritative test vectors for every selected cryptographic
   primitive and protocol component, from sources such as RFC test vectors, NIST test vectors,
   Project Wycheproof, the Unicode normalisation test data and official protocol implementation
   vectors. For each set it records:
   - the source and its version;
   - the inputs and expected outputs, exactly as the source publishes them;
   - how the vectors are executed;
   - which client runtimes must pass them.

   Expected values come from the source. They are never invented, and never produced by the
   implementation under test.

4. **Reproducible security-test plan.** It covers:
   - valid and invalid inputs;
   - authentication failures;
   - ciphertext tampering;
   - wrong keys and incorrect context;
   - nonce and key usage limits;
   - serialisation and parser edge cases;
   - compatibility across runtimes;
   - recovery and revocation;
   - malicious-server scenarios;
   - rollback and synchronisation failures.

   For every test it gives the command, the expected result, the test environment and the evidence
   to keep. It separates the tests that can be prepared before implementation from those that need
   a working implementation. A planned test is never reported as passed; only a test that has run
   and passed is.

**Approval sequence.** In this order:

1. ChatGPT and Claude carry out the internal architecture and security review of the deliverables.
2. Unresolved findings are recorded with the deliverables. Any that need the owner's decision are
   added to the open table in `docs/DECISIONS.md`.
3. The owner reviews the design and explicitly approves it.
4. The owner explicitly authorises the relevant implementation stage.
5. Implementation happens on a dedicated feature branch.
6. The required security tests and continuous-integration checks pass before anything is merged.
7. An independent external security audit takes place before any public release.

**What the gate is not.** Passing it does not make the review independent: ChatGPT and Claude are
not independent auditors or qualified cryptography specialists. The gate does not replace the
independent external audit in step 7, or reduce what that audit covers. Approving the deliverables
authorises no implementation by itself; each stage still needs the owner's explicit authorisation
(step 4).
