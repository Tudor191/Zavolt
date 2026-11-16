# Decisions

A record of the decisions that shape this repository: what was decided, when, by whom, and why.

- **Owner** means the project owner decided it.
- **Agent default** means a coding agent chose it because nobody had decided, and recorded why. Every
  agent default is open to change: the owner can overrule any of them.

Add a row whenever a decision is taken. If a decision is reversed, keep the old row and add a new
one that says so.

## Decided

| Date       | Decision                                                                                                            | By            | Why                                                                                                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-11-15 | Zavolt's long-term architecture is zero-knowledge encryption. Security is the highest priority.                     | Owner         | The product will hold people's credentials.                                                                                                                                                            |
| 2026-11-15 | Cryptographic direction: Argon2id, AES-256-GCM or XChaCha20-Poly1305, HKDF, envelope encryption, versioned keys.    | Owner         | A direction, not a protocol. It needs a full written design and a cryptographer's review before anything is built. See `ARCHITECTURE.md`, Part 2.                                                      |
| 2026-11-15 | No cryptography is implemented until the design has been reviewed.                                                  | Owner         | Incomplete or improvised cryptography is worse than none.                                                                                                                                              |
| 2026-11-15 | Migrate the static HTML site to TypeScript.                                                                         | Owner         | A maintainable foundation for the product.                                                                                                                                                             |
| 2026-11-15 | A React 19 single-page application built by Vite 8, in strict TypeScript 7, with React Router in declarative mode.  | Agent default | Client-side routing keeps future in-memory keys alive across navigation, a bundle removes the CDN script, React escapes output, and a strict Content-Security-Policy becomes possible. See `AUDIT.md`. |
| 2026-11-15 | Lint with oxlint rather than ESLint.                                                                                | Agent default | ESLint's TypeScript plugin did not support TypeScript 7 at the time. oxlint has type-aware, accessibility and the needed security rules, and the official Vite template uses it.                       |
| 2026-11-15 | Keep the three-second loading screen, and skip it for visitors who ask for reduced motion.                          | Agent default | It is part of the original design. Removing it is a design decision for the owner.                                                                                                                     |
| 2026-11-15 | Keep `/cart` and `/shop` as placeholders.                                                                           | Agent default | They are existing addresses. Removing routes is a product decision.                                                                                                                                    |
| 2026-11-16 | Merge pull request 1 with a squash merge.                                                                           | Owner         | The owner authorised the merge and preferred one clean commit on `main`.                                                                                                                               |
| 2026-11-16 | `main` is to be the default branch.                                                                                 | Owner         | The change needs repository administration rights. See the handoff, section 5.3.                                                                                                                       |
| 2026-11-16 | `/` is the public homepage. The dashboard moves to `/app`. `/login` and `/register` are honest placeholders.        | Owner         | Visitors to the site's address should see the product, not the application.                                                                                                                            |
| 2026-11-16 | `/index.html`, the original dashboard address, redirects to `/app`.                                                 | Owner         | It pointed at the dashboard before the move.                                                                                                                                                           |
| 2026-11-16 | `/app` stays open to every visitor until real authentication and backend authorisation exist.                       | Owner         | Nothing can protect it yet, and pretending otherwise would be worse.                                                                                                                                   |
| 2026-11-16 | Shopping-cart artwork and the old "TDR" image are not the brand identity.                                           | Owner         | They come from the template the project started as.                                                                                                                                                    |
| 2026-11-16 | The brand mark is the dashboard's ring, with its gap and dot, around a Z on a violet tile. It replaces the favicon. | Agent default | It carries the existing visual identity into a symbol that stays legible at 16px. `public/images/logo.png` is kept so its address keeps working.                                                       |
| 2026-11-16 | `/contact` belongs to the public site, with the site header and footer, instead of to the application.              | Agent default | The footer must link to it, and a public visitor should not meet the application's loading screen. The dashboard still links to it.                                                                    |
| 2026-11-16 | The loading screen plays only in the application area, at most once per page load.                                  | Agent default | A three-second wait on the public homepage would cost visitors and search engines. In the application it is preserved as it was.                                                                       |
| 2026-11-16 | Add `/privacy` and `/terms` as placeholders that say no document has been published.                                | Agent default | The footer needs the links; publishing invented legal text is not allowed.                                                                                                                             |
| 2026-11-16 | The original site's viewport-based root font size applies to the loader only.                                       | Agent default | The loader keeps its exact proportions, and the rest of the product follows the visitor's default text size.                                                                                           |
| 2026-11-16 | Every feature, platform and roadmap step on the homepage carries a Done, In development or Planned label.           | Agent default | So that nothing planned can be read as available.                                                                                                                                                      |

## Statements on the public homepage that the owner should confirm

The homepage presents these as part of the plan. They are consistent with the documented roadmap,
but they are public commitments made on the owner's behalf, so the owner should confirm or remove
them:

- The encryption design will be reviewed by specialists before any of it is built.
- An independent security audit will take place before any public release.
- Zavolt is designed without advertising or tracking code.
- If account recovery is offered, it will never give Zavolt a way to decrypt a vault.

## Open

These are not decided. Do not build on any of them until the owner decides. For the cryptographic
ones a cryptographer must be involved. The handoff (`agent-handoff/NEXT_AGENT_PROMPT.md`, section 10) describes the options.

| Decision                                                           | Needs                                                    |
| ------------------------------------------------------------------ | -------------------------------------------------------- |
| OPAQUE or a derived authentication key                             | Cryptographic review; a survey of libraries per platform |
| Key derivation parameters, and whether a device secret is mixed in | Benchmarks on real devices; cryptographic review         |
| Encryption algorithm, nonce strategy and associated data           | Cryptographic review                                     |
| Account recovery design                                            | Owner's product decision, then cryptographic review      |
| Detecting server rollback and withheld data                        | Design work and cryptographic review                     |
| Desktop application technology                                     | Owner, after a written comparison                        |
| Backend technology and hosting                                     | Owner                                                    |
| Whether to keep `/cart` and `/shop`                                | Owner                                                    |
| The loading screen: keep, shorten or remove; its artwork           | Owner                                                    |
| Licence                                                            | Owner                                                    |
| Privacy policy and terms of service                                | Owner, with legal advice                                 |
| Contact channel                                                    | Owner                                                    |
