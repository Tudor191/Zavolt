# Security

## Current status

Zavolt is in early development. It is not a working password manager yet.

- There is no authentication. Every page, including the dashboard, is served to every visitor.
- There is no encryption, no vault and no backend. Nothing is stored anywhere.
- Nothing in this repository has been reviewed by an independent security auditor.

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
   them with published test vectors, and have a qualified reviewer look at any change that touches
   them.
7. **Treat every dependency as code you are responsible for.** Add one only when the alternative is
   clearly worse, and keep to the seven-day waiting period for new releases.
8. **Do not loosen a security control to make something pass.** If the Content-Security-Policy, a
   lint rule or a test blocks a change, the change needs rethinking or the exception needs a written
   reason and a review.
