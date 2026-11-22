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
| 2026-11-16 | `main` is the default branch.                                                                                       | Owner         | The owner switched it in the repository settings, which the agent session could not do.                                                                                                                |
| 2026-11-16 | Commitment: the encryption design will be reviewed by cryptography specialists before any of it is implemented.     | Owner         | A long-term commitment, not an implemented feature. It confirms what the homepage says.                                                                                                                |
| 2026-11-16 | Commitment: an independent security audit will take place before any public release.                                | Owner         | A commitment about the future: no audit has taken place. No security claim may be made before it.                                                                                                      |
| 2026-11-16 | Commitment: Zavolt will not include advertising or tracking code.                                                   | Owner         | A commitment for the whole product. The website already loads none.                                                                                                                                    |
| 2026-11-16 | Commitment: no account recovery design will ever give Zavolt the ability to decrypt a user's vault.                 | Owner         | A constraint on the recovery design, which is still open, as is whether recovery is offered at all.                                                                                                    |
| 2026-11-16 | `/contact` stays part of the public website.                                                                        | Owner         | Confirms the agent default above.                                                                                                                                                                      |
| 2026-11-16 | `/cart` and `/shop` stay as application placeholders. Every existing route and legacy redirect keeps working.       | Owner         | Confirms the agent default of 15 November.                                                                                                                                                             |
| 2026-11-16 | The loading screen stays as it is: three seconds, once per page load, in the application area only.                 | Owner         | Exactly three seconds, at most once per page load, only when a visitor first enters the application area. Public pages never show it. Confirms the agent defaults above.                               |
| 2026-11-16 | The loader's shopping cart is replaced by an animated padlock and key.                                              | Owner         | The cart came from the template. The animation is a picture: it does not stand for any real unlocking, checking or decryption.                                                                         |
| 2026-11-16 | The padlock and key are original SVG in the brand colours, animated by one CSS sequence of 2.7 seconds.             | Agent default | The owner set the sequence and its length, 2.6 to 2.8 seconds. The key's quarter turn shows as the key narrowing edge-on. The open padlock is the resting state, shown where nothing animates.         |
| 2026-11-16 | Merge pull request 2 with a squash merge.                                                                           | Owner         | The owner approved the merge after the final pre-merge review. It is commit `7ab28f3` on `main`.                                                                                                       |
| 2026-11-17 | Documentation-only changes are made directly on `main`, with no feature branch, and reviewed through a clear diff.  | Owner         | Each change must preserve the project's history and recorded decisions: earlier rows here are never rewritten. Website text lives in source files, so it is code. See the handoff, section 5.1.        |
| 2026-11-17 | Code and implementation work happens only on a dedicated feature branch, never directly on `main`.                  | Owner         | Code reaches `main` only through a pull request, after continuous integration has run. See the handoff, sections 5.1 and 13.                                                                           |
| 2026-11-17 | Each technical implementation stage starts only after the owner's explicit approval.                                | Owner         | Approving documentation, a plan or a proposal is not approval to implement it.                                                                                                                         |
| 2026-11-17 | Pull requests and merges need the owner's explicit approval.                                                        | Owner         | Green checks are not permission. An agent never merges on its own initiative.                                                                                                                          |
| 2026-11-17 | The cryptographic design is reviewed internally by ChatGPT and Claude, through the process in `SECURITY.md`.        | Owner         | No cryptography specialist is available. Replaces the requirement for a cryptographer's or specialists' review before implementation (rows of 2026-11-15 and 2026-11-16, kept as history).             |
| 2026-11-17 | The internal review is AI-assisted. It is not an independent review, a specialist review or a certification.        | Owner         | ChatGPT and Claude are not independent security auditors or qualified cryptography specialists. Nothing may present their review as either.                                                            |
| 2026-11-17 | Commitment kept: an independent external security audit takes place before any public release.                      | Owner         | The internal review does not replace or weaken it. Confirms the commitment of 2026-11-16.                                                                                                              |
| 2026-11-17 | Security-sensitive decisions, including those from the internal review, are recorded here once the owner decides.   | Owner         | Provisional recommendations are not decisions and are not recorded as decided. They are listed in `ARCHITECTURE.md`, section 2.16.                                                                     |
| 2026-11-21 | Production cryptographic code waits for an evidence gate: threat model, specification, test vectors and test plan.  | Owner         | All four exist in `docs/` and have been through the internal review before implementation begins. Production code only: documentation and non-cryptographic work are not blocked. See `SECURITY.md`.   |
| 2026-11-21 | Gate approval order: internal review, findings recorded, owner approves the design, then authorises the stage.      | Owner         | Then implementation on a dedicated feature branch, and the required security tests and CI checks pass before merging. Approving the deliverables authorises no implementation by itself.               |
| 2026-11-21 | The evidence gate does not replace the independent external security audit before any public release.               | Owner         | Passing the gate is not independent review: ChatGPT and Claude are not independent auditors or qualified cryptography specialists.                                                                     |

## Statements on the public homepage that the owner was asked to confirm

**Confirmed by the owner on 16 November 2026.** They are now owner commitments in the table above.
The list is kept as it was put to the owner.

The homepage presents these as part of the plan. They are consistent with the documented roadmap,
but they are public commitments made on the owner's behalf, so the owner should confirm or remove
them:

- The encryption design will be reviewed by specialists before any of it is built.
- An independent security audit will take place before any public release.
- Zavolt is designed without advertising or tracking code.
- If account recovery is offered, it will never give Zavolt a way to decrypt a vault.

**Revised on 17 November 2026.** The owner replaced the first statement's specialist review with the
internal review in `SECURITY.md` (table above). The homepage still says the design will be reviewed
by specialists. Changing that text is a code change that needs the owner's approval (open table
below). The other three statements stand.

## Open

These are not decided. Do not build on any of them until the owner decides. The cryptographic ones
go through the internal review in `SECURITY.md` (Cryptographic design review), and production
cryptographic code also waits for its evidence gate. The handoff
(`agent-handoff/NEXT_AGENT_PROMPT.md`, section 10) describes the options, and `ARCHITECTURE.md`
section 2.16 lists the internal review's provisional recommendations, none of them approved.

| Decision                                                           | Needs                                                    |
| ------------------------------------------------------------------ | -------------------------------------------------------- |
| OPAQUE or a derived authentication key                             | Internal review; a survey of libraries for each platform |
| Key derivation parameters, and whether a device secret is mixed in | Benchmarks on real devices; internal review              |
| Encryption algorithm, nonce strategy and associated data           | Internal review                                          |
| Account recovery design                                            | Owner's product decision, then internal review           |
| Detecting server rollback and withheld data                        | Design work and internal review                          |
| Online-only or offline vault unlocking                             | Owner's product decision, then internal review           |
| Browser extension key storage (`SECURITY.md` rule 4)               | Owner's decision on an exception to rule 4               |
| Supported browsers and platforms; sign-in time budget              | Owner's decision; benchmarks on real devices             |
| How many old versions of an item are kept                          | Owner's product decision                                 |
| Homepage wording that promises a specialist review                 | Owner's approval of a code change on a feature branch    |
| Desktop application technology                                     | Owner, after a written comparison                        |
| Backend technology and hosting                                     | Owner                                                    |
| Licence                                                            | Owner                                                    |
| Privacy policy and terms of service                                | Owner, with legal advice                                 |
| Contact channel                                                    | Owner                                                    |
| Who operates Zavolt: a person or a company; its name and address   | Owner; see `legal/LEGAL_OPEN_QUESTIONS.md`               |
| Hosting, email and payment providers; retention periods            | Owner, with legal advice                                 |
| Whether the Cyber Resilience Act and Digital Services Act apply    | Legal advice                                             |
| Approval of the four evidence-gate drafts in `security/`           | Internal review, then the owner                          |
| Risks proposed for acceptance in the threat model                  | Owner                                                    |

The legal and licensing questions are detailed in `legal/LEGAL_OPEN_QUESTIONS.md`, with the drafts
that depend on them. The protocol's unresolved questions are listed in `security/PROTOCOL.md`,
section 22. None of these drafts records a decision.

## Closed

Questions that were listed as open and have since been decided. The decisions are in the table at
the top.

| Question                                                 | Decided           | Outcome                                                                             |
| -------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------- |
| Whether to keep `/cart` and `/shop`                      | 2026-11-16, Owner | Kept, as application placeholders.                                                  |
| The loading screen: keep, shorten or remove; its artwork | 2026-11-16, Owner | Kept, three seconds, application only. A padlock and key replace the shopping cart. |
