# Software licensing assessment

> **Draft 0.1, 22 November 2026. Not legal advice. Not reviewed by a lawyer.** The licence is the
> owner's decision and **it is still open**. This document changes nothing about the repository's
> licence. A draft licence notice for the recommended option is in
> [LICENSE_DRAFT.md](./LICENSE_DRAFT.md); it is not in effect.

Statements below are labelled:

- **Requirement**: what a law or a licence text says, with its source.
- **Practice**: a recommended practice, not a legal duty.
- **Decision**: a choice for the owner.
- **Question**: a legal question for a lawyer.

## 1. Summary

- The repository has **no licence**, and **it is public** on GitHub.
- **Recommended, pending the owner's approval:** proprietary, all rights reserved, stated explicitly
  in a `LICENSE` file, and a fresh decision about making source available before any public release.
- Distributed builds (the desktop application and the browser extension) will need end-user licence
  terms.
- Before any licence is granted, three facts must be settled: who holds the rights (a person or a
  company), how much of the code is protected given the AI assistance, and where the original
  template came from.

## 2. Current status

Observed in the repository and on GitHub on 21 November 2026.

| Item                     | Finding                                                                                                                                                                                                                                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Licence file             | None.                                                                                                                                                                                                                                                                                                                                  |
| `README.md`              | "No licence has been chosen for this project, so all rights are reserved by its owner."                                                                                                                                                                                                                                                |
| `package.json`           | `"private": true`, which stops publication to npm and is not a licence. No `license` field.                                                                                                                                                                                                                                            |
| Copyright notices        | The site footer shows "© <current year> Zavolt" (`src/site/SiteFooter.tsx`). No file carries a notice. "Zavolt" is a product name; no legal person of that name is recorded anywhere in the repository.                                                                                                                                |
| Visibility               | Public. GitHub reports no licence, 0 forks and 0 stars. The repository was created on 15 November 2026; whether it has been public since then is not recorded.                                                                                                                                                                         |
| Third-party code shipped | `react`, `react-dom`, `react-router` and `scheduler` (MIT) and `@fontsource/poppins` (SIL Open Font License 1.1), listed with their licence texts in `THIRD-PARTY-LICENSES.md`, which the build writes (`vite.config.ts`). Twenty Ionicons icons (MIT), copied into the source, with their notice in `public/THIRD-PARTY-NOTICES.txt`. |
| Authorship               | On `main`: 12 commits under the author name "tdr" and 2 under "Claude"; 5 commits carry a `Co-Authored-By` line naming Claude, an AI assistant.                                                                                                                                                                                        |
| Origins                  | The original static site "started from a generic shop template" (`docs/AUDIT.md`), whose source and licence are not recorded. The dashboard's layout, colours and transforms were matched to that site (handoff section 14).                                                                                                           |
| Contributions            | No contribution policy and no contributor agreement.                                                                                                                                                                                                                                                                                   |

## 3. What having no licence means

- **Requirement.** A computer program is protected by copyright as a literary work if "it is the
  author's own intellectual creation" (Directive 2009/24/EC, Art. 1(3)). The rightholder controls
  its reproduction, including where loading or running it needs a reproduction, its adaptation, and
  its distribution to the public (Art. 4(1)(a) to (c)).
- **Requirement.** Some acts need no permission: use by the lawful acquirer for the program's
  intended purpose, including error correction, unless a contract says otherwise (Art. 5(1)); a
  back-up copy by a person entitled to use it (Art. 5(2)); observing, studying and testing it during
  permitted use (Art. 5(3)); decompiling it for interoperability (Art. 6). Contract terms contrary
  to Article 6 or to Article 5(2) and (3) are null and void (Art. 8).
- **Requirement (platform terms).** GitHub's Terms of Service, section D.5: by making a repository
  public, its owner grants other GitHub users "a nonexclusive, worldwide license to use, display,
  perform and reproduce (by forking) Your Content through the Service as permitted by GitHub's
  functionality". GitHub's documentation adds that without a licence "the default copyright laws
  apply", and no one may reproduce, distribute or create derivative works from the code.
- **In practice today:** anyone can read the code on GitHub and fork it within GitHub. Nobody has
  been given permission to copy it elsewhere, adapt it, distribute it or build on it.
- **Question.** Romanian law implements the Directive in Law no. 8/1996 on copyright, which this
  draft has not reviewed: the official legislation portal could not be reached from this
  environment. Its rules on employee and commissioned programs, and the exact scope of the
  exceptions, need a lawyer's reading.

## 4. Consequences of having published without a licence

- The code has been publicly readable. **Adding a licence, or an all-rights-reserved notice, does
  not make it private and does not withdraw copies already made.** Making the repository private
  would stop public viewing on GitHub but would not recall forks, clones or copies elsewhere.
- An all-rights-reserved notice changes nothing about what others may do; it states the default and
  removes doubt.
- A permissive grant cannot be taken back for what it covered. Apache-2.0, section 2, grants a
  "perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license".
  Once a version is released under such a licence, it stays available under it.
- **Practice.** For a zero-knowledge product, security must never depend on keeping the code secret.
  Public code is consistent with the design and helps independent review.
- No secret is known to have been exposed. The history scan in
  [SECURITY_TEST_PLAN.md](../security/SECURITY_TEST_PLAN.md) (ST-NOW-06) has not been run.

## 5. Options

| Option                                                                                             | Others may use it commercially                                                                                | Redistribute                          | Modify and fork                                                                   | Patents                                                                                  | Zavolt keeps                                                       |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **A. Proprietary, all rights reserved** (code may stay visible)                                    | No                                                                                                            | No                                    | Only forking on GitHub, under GitHub's terms                                      | Not addressed                                                                            | Full control; can relax later                                      |
| **B. MIT**                                                                                         | Yes                                                                                                           | Yes, with the notice                  | Yes, including closed-source products                                             | Not addressed                                                                            | Copyright, but anyone may compete with the code                    |
| **C. Apache-2.0**                                                                                  | Yes                                                                                                           | Yes, with notices and the NOTICE file | Yes, including closed-source products                                             | Express patent licence from contributors, ending for anyone who sues over patents (s. 3) | As B, plus trademark rights are not licensed (s. 6)                |
| **D. AGPL-3.0**                                                                                    | Yes, on its terms                                                                                             | Yes, with source                      | Yes; network services built on a modified version must offer their source (s. 13) | Express grant in the licence text                                                        | Copyright; competitors must share their changes                    |
| **E. Source-available, converting later** (Business Source License 1.1, Functional Source License) | Limited: BSL allows "non-production use" unless an Additional Use Grant says more; FSL forbids competing uses | As each licence allows                | Yes, within the licence's limits                                                  | Depends on the licence                                                                   | Commercial control for a period, then the code becomes open source |

Details of each, from the licence texts:

- **MIT.** Permission to deal in the software without restriction, on one condition: "The above
  copyright notice and this permission notice shall be included in all copies or substantial
  portions of the Software." Listed by the Open Source Initiative.
- **Apache-2.0.** Copyright and patent licences (sections 2 and 3). The patent licence ends for
  anyone who "institute[s] patent litigation" claiming the work infringes a patent. Derivative works
  must carry the attributions in the NOTICE file (section 4(d)). It "does not grant permission to
  use the trade names, trademarks, service marks, or product names of the Licensor" (section 6).
- **AGPL-3.0, section 13.** A modified version that users interact with "remotely through a computer
  network" must "prominently offer" those users "an opportunity to receive the Corresponding
  Source". Relevant because Zavolt's backend is a network service.
- **Business Source License 1.1.** Grants the right to "copy, modify, create derivative works,
  redistribute, and make non-production use"; the licensor may add an Additional Use Grant. On the
  Change Date, or the fourth anniversary of a version's first public release if earlier, that
  version becomes available under the Change License. The text says it "is not an Open Source
  license".
- **Functional Source License.** Its publishers describe it as "a Fair Source license that converts
  to Apache 2.0 or MIT after two years", aimed at preventing "harmful free-riding".

**What the choice means for:**

- **Commercial use and competitors.** B, C and D let anyone, including competitors, use the code
  commercially. A forbids it; E limits it for a period.
- **Redistribution and forks.** Allowed under B, C and D, and within limits under E; under A, only
  the forking that GitHub's terms allow.
- **Contributions.** GitHub's Terms, section D.6: content added to a repository "containing notice
  of a license" is licensed under the same terms ("inbound=outbound"), unless a separate agreement
  such as a contributor licence agreement says otherwise. Under A there is no licence to inherit, so
  outside contributions need a contributor agreement (section 7).
- **Ownership.** No option transfers ownership; every licence only grants permissions. Who owns the
  code is a separate question (section 7).

## 6. Recommendation (provisional)

**Option A: proprietary, all rights reserved, stated explicitly.** The owner has not decided.

Why, given the owner's stated aim of a commercial product (handoff section 1):

1. It keeps every option open. A proprietary notice can later be relaxed to any licence; a
   permissive licence cannot be withdrawn from the versions it covered.
2. There is no product yet, and the questions of who holds the rights, the AI assistance and the
   template's origin (section 7) should be answered before anyone is granted rights.
3. It needs no contributor process, because outside contributions are not accepted.

What it costs: less outside scrutiny and community trust, which matter for a security product, and
no outside contributions without an agreement.

**Decision to revisit before public release:** whether to make source available, for example under E
or by publishing the client core under an open-source licence, so that users and auditors can check
the zero-knowledge claims against the code.

## 7. Ownership and contributions

- **Question: who holds the rights.** An individual or a company (see
  [LEGAL_OPEN_QUESTIONS.md](./LEGAL_OPEN_QUESTIONS.md)). The copyright notice and every licence must
  name the actual rights holder, not the product name.
- **Question: AI-assisted code.** Protection requires "the author's own intellectual creation"
  (Directive 2009/24/EC, Art. 1(3)). How far that covers code written with an AI assistant, and what
  the AI provider's terms say about outputs, needs a lawyer.
- **Question: the template.** The source and licence of the shop template the site started from, and
  whether the current styles derive from it. **Decision:** confirm a licence that allows commercial
  use, or replace what derives from it.
- **Question: the "TDR" image.** `public/images/logo.png` is kept at its address (`DECISIONS.md`, 16
  November 2026). Its origin should be confirmed.
- **Requirement.** Where an employee writes a program in the course of their duties, the employer
  exercises the economic rights, unless a contract provides otherwise (Directive 2009/24/EC, Art.
  2(3)). **Practice:** contractors should assign their rights in writing.
- **Practice.** Accept no outside contributions until a contributor agreement exists, and say so in
  the repository.
- **Practice.** Clear and consider registering the name "Zavolt" as a trademark. Not a licensing
  matter, and not researched here.

## 8. Licence terms for distributed software

- **Requirement.** Running a program can involve its reproduction, which the rightholder controls
  (Art. 4(1)(a)); the lawful acquirer's exception applies "in the absence of specific contractual
  provisions" (Art. 5(1)).
- **Practice.** Give users of the desktop application and the browser extension explicit licence
  terms: a short end-user licence, or a licence clause in the Terms of Service. The web application
  can rely on the Terms of Service.
- **Requirement.** Those terms cannot remove the rights in Articles 5(2), 5(3) and 6 of the
  Directive (Art. 8), and must respect consumer law (see
  [TERMS_OF_SERVICE_DRAFT.md](./TERMS_OF_SERVICE_DRAFT.md)).
- **Question.** Browser-extension stores and operating-system stores impose their own terms on
  publishers. They have not been reviewed.
- **Requirement.** Every distributed build must carry the third-party notices (section 9).

## 9. Third-party licence obligations

- **Requirement (MIT).** The copyright notice and permission notice of each MIT component must be
  included "in all copies or substantial portions". Today the build writes `THIRD-PARTY-LICENSES.md`
  and copies `public/THIRD-PARTY-NOTICES.txt` into `dist/`. The same must hold for the extension and
  the desktop application.
- **Poppins.** `THIRD-PARTY-LICENSES.md` includes the SIL Open Font License text. **Question:** its
  conditions have not been reviewed in this draft.
- **Test vectors.** If vector files are copied into the repository
  ([TEST_VECTOR_PLAN.md](../security/TEST_VECTOR_PLAN.md)): Wycheproof is Apache-2.0, so its notices
  must be kept; the Argon2 reference implementation is CC0 1.0 or Apache-2.0.

## 10. Decisions needed

See [LEGAL_OPEN_QUESTIONS.md](./LEGAL_OPEN_QUESTIONS.md), items on the rights holder, the licence
model, end-user terms, contributions, the template and the AI-assisted code.

## 11. Sources

Read from the publisher on 21 November 2026.

- Directive 2009/24/EC on the legal protection of computer programs, Articles 1, 2, 4, 5, 6 and 8.
  <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009L0024>
- GitHub Terms of Service, sections D.5 and D.6.
  <https://docs.github.com/en/site-policy/github-terms/github-terms-of-service>
- GitHub Docs, "Licensing a repository".
  <https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository>
- The MIT License (Open Source Initiative). <https://opensource.org/license/mit>
- Apache License 2.0, sections 2, 3, 4(d) and 6. <https://www.apache.org/licenses/LICENSE-2.0>
- GNU Affero General Public License 3.0, section 13 (Open Source Initiative copy).
  <https://opensource.org/license/agpl-v3>
- Business Source License 1.1 (MariaDB). <https://mariadb.com/bsl11/>
- Functional Source License. <https://fsl.software/>
- Not reviewed: Romanian Law no. 8/1996; the SIL Open Font License conditions; extension-store
  terms.

## 12. Change log

| Version | Date             | Change                   |
| ------- | ---------------- | ------------------------ |
| 0.1     | 22 November 2026 | First draft, for review. |
