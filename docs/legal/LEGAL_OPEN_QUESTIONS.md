# Legal open questions

> **Draft 0.1, 22 November 2026. Not legal advice.** Everything the owner must provide or decide
> before Zavolt's legal documents can become final, and what needs a lawyer. The drafts in this
> folder were prepared with AI assistance; **they are not a substitute for advice from a qualified
> lawyer**, and none of them is final or ready for publication.

## 1. When each answer is needed

| Gate  | Meaning                                                                                                                                                    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1    | Before the website is hosted publicly. From then on, the host processes visitors' IP addresses, so a privacy notice and the operator's details are needed. |
| G2    | Before any account is opened for anyone outside the project, including a beta.                                                                             |
| G3    | Before Zavolt charges money.                                                                                                                               |
| G4    | Before the browser extension or desktop application is distributed.                                                                                        |
| G5    | Before general public release.                                                                                                                             |
| Later | When the feature concerned exists.                                                                                                                         |

Kinds: **Information** (a fact only the owner has), **Decision** (a choice for the owner),
**Lawyer** (needs legal advice).

## 2. Questions

### 2.1 Who operates Zavolt

| ID   | Question                                                                                    | Kind                | Gate | Why it matters                                                                                                                  |
| ---- | ------------------------------------------------------------------------------------------- | ------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------- |
| L-01 | Will Zavolt be operated by an individual or through a registered legal entity?              | Decision, Lawyer    | G1   | It decides the controller (GDPR Art. 4(7)), who holds the copyright and licences it, who is liable, and what must be published. |
| L-02 | Legal name, legal form, registration number and business address                            | Information         | G1   | GDPR Art. 13(1)(a); Directive 2000/31/EC, Art. 5(1); Directive 2011/83/EU, Art. 6(1); the licence's copyright line.             |
| L-03 | Country of establishment                                                                    | Information         | G1   | Which law applies to the operator (GDPR Art. 3(1)), which supervisory authority leads, and the governing law of the terms.      |
| L-04 | Contact email, privacy contact and security contact                                         | Information         | G1   | GDPR Art. 13(1)(a); Directive 2000/31/EC, Art. 5(1)(c); vulnerability reporting.                                                |
| L-05 | Who owns the code written with AI assistance, and what the AI provider's terms say about it | Lawyer              | G1   | Copyright protects "the author's own intellectual creation" (Directive 2009/24/EC, Art. 1(3)); needed before licensing.         |
| L-06 | Where the original shop template came from, and its licence                                 | Information, Lawyer | G1   | The dashboard still follows its layout (`LICENSING_ASSESSMENT.md`, section 7).                                                  |
| L-07 | The origin of the "TDR" image kept at `public/images/logo.png`                              | Information         | G5   | Rights in published assets.                                                                                                     |
| L-08 | Clearing and registering the name "Zavolt", and control of the domain `zavolt.com`          | Decision, Lawyer    | G5   | The handoff names `https://zavolt.com/` as the intended address; nothing in the repository records who holds it.                |

### 2.2 Providers and data

| ID   | Question                                                                                                                               | Kind             | Gate   | Why it matters                                                                                                |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| L-09 | Hosting provider and hosting location                                                                                                  | Decision         | G1, G2 | Recipients and transfers (GDPR Art. 13(1)(e) and (f), Chapter V); an Article 28 contract; cookies may change. |
| L-10 | Email provider for verification and notifications                                                                                      | Decision         | G2     | A processor (Art. 28); carries security-sensitive messages.                                                   |
| L-11 | Payment provider, if the service is paid                                                                                               | Decision         | G3     | Its role (processor or separate controller) and the information users must get.                               |
| L-12 | Analytics and telemetry: confirm none, including crash reports and server-side metrics                                                 | Decision         | G1     | The owner's commitment of 16 November 2026 excludes tracking; telemetry and metrics need their own answer.    |
| L-13 | Retention periods: deleted accounts, backups, security logs, server logs, support, billing                                             | Decision, Lawyer | G1, G2 | GDPR Art. 5(1)(e) and 13(2)(a). No period may be invented.                                                    |
| L-14 | Legal basis for each processing purpose                                                                                                | Lawyer           | G1, G2 | GDPR Art. 6(1) and 13(1)(c); candidates in `PRIVACY_POLICY_DRAFT.md`, B2.                                     |
| L-15 | Whether a data protection officer is needed                                                                                            | Lawyer           | G2     | GDPR Art. 37(1); Law no. 190/2018, Arts 4 and 10.                                                             |
| L-16 | Whether a data protection impact assessment is required, and records of processing                                                     | Lawyer           | G2     | GDPR Arts 30 and 35.                                                                                          |
| L-17 | Whether the ciphertext Zavolt cannot decrypt is personal data in Zavolt's hands, and the consequences for rights requests and breaches | Lawyer           | G2     | `DATA_PROCESSING_ASSESSMENT.md`, section 3.                                                                   |
| L-18 | A breach-response procedure, including notification to ANSPDCP                                                                         | Decision         | G2     | GDPR Arts 33 and 34; ANSPDCP's online form.                                                                   |

### 2.3 The offer

| ID   | Question                                                                                 | Kind             | Gate   | Why it matters                                                                                          |
| ---- | ---------------------------------------------------------------------------------------- | ---------------- | ------ | ------------------------------------------------------------------------------------------------------- |
| L-19 | Target markets: which countries, and in which languages                                  | Decision         | G2     | Consumer law of each country of residence applies (Rome I, Art. 6(2)); translations.                    |
| L-20 | Consumers, businesses or both                                                            | Decision         | G2     | Consumer law; for businesses, Zavolt may act as processor and need Article 28 contracts with customers. |
| L-21 | Minimum age                                                                              | Decision, Lawyer | G2     | GDPR Art. 8(1); Romania appears not to have set a lower age (Law no. 190/2018, Art. 1).                 |
| L-22 | Whether account recovery is offered, and how                                             | Decision         | G2     | Shapes the terms, the privacy policy and the protocol (`docs/DECISIONS.md`, Open).                      |
| L-23 | Prices, billing period, renewal and cancellation; the right of withdrawal                | Decision, Lawyer | G3     | Directive 2011/83/EU, Arts 9 and 16; Directive (EU) 2019/770.                                           |
| L-24 | Which alternative dispute resolution body applies, and the consumer information required | Lawyer           | G2, G3 | The EU online dispute resolution platform no longer exists (Regulation (EU) 2024/3228).                 |
| L-25 | Language versions of the legal documents, and which prevails                             | Decision, Lawyer | G1, G2 |                                                                                                         |

### 2.4 Licensing

| ID   | Question                                                                     | Kind             | Gate | Why it matters                                                                 |
| ---- | ---------------------------------------------------------------------------- | ---------------- | ---- | ------------------------------------------------------------------------------ |
| L-26 | The software licence model (recommended: proprietary, all rights reserved)   | Decision         | G1   | The repository is public with no licence (`LICENSING_ASSESSMENT.md`).          |
| L-27 | Separate licence terms for the desktop application and the browser extension | Decision, Lawyer | G4   | Distributed builds need explicit terms (`LICENSING_ASSESSMENT.md`, section 8). |
| L-28 | Whether to accept outside contributions, and under what agreement            | Decision         | G1   | GitHub's Terms, section D.6.                                                   |
| L-29 | Whether to make source available before release, and under which licence     | Decision         | G5   | Users' and auditors' ability to check the zero-knowledge claims.               |

### 2.5 Regulations that may apply

| ID   | Question                                                                                                                                                                                            | Kind   | Gate   | Source                                                                                          |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------ | ----------------------------------------------------------------------------------------------- |
| L-30 | The Cyber Resilience Act: "Password managers" are Class I important products (Annex III). Obligations, conformity route, support period, and the reporting duties that apply from 11 September 2026 | Lawyer | G4, G5 | Regulation (EU) 2024/2847, Arts 13, 14, 32, 69, 71; Annex III. **Planning should start early.** |
| L-31 | The Digital Services Act: whether a password vault is a "hosting" service, and which duties follow                                                                                                  | Lawyer | G2     | Regulation (EU) 2022/2065, Arts 3, 11, 12, 14 to 17                                             |
| L-32 | NIS2: applies to entities in its annexes of at least medium size                                                                                                                                    | Lawyer | Later  | Directive (EU) 2022/2555, Art. 2(1); Annex I lists cloud computing service providers            |
| L-33 | The European Accessibility Act: microenterprises providing services are exempt                                                                                                                      | Lawyer | G3     | Directive (EU) 2019/882, Art. 4(5)                                                              |
| L-34 | The Romanian laws not reviewed in these drafts: Law no. 8/1996, Law no. 193/2000, Emergency Ordinances no. 34/2014 and 141/2021, Law no. 365/2002, Ordinance no. 38/2015                            | Lawyer | G2     | The official portal could not be reached from the drafting environment                          |

## 3. Required before publication, and what can wait

- **Before the website is hosted publicly (G1):** L-01 to L-06, L-09, L-12 to L-14, L-25, L-26 and
  L-28. A privacy notice covering the website's server logs, and the operator's details, must be
  ready then.
- **Before accounts open (G2):** everything in G1, plus L-10, L-15 to L-22, L-24, L-31 and L-34. The
  full privacy policy and terms of service must be final and reviewed.
- **Before charging (G3):** L-11, L-23 and L-33.
- **Before distributing the extension or desktop application (G4):** L-27 and L-30.
- **Before public release (G5):** L-07, L-08, L-29, and the independent security audit, which the
  owner has committed to.
- **Can wait:** L-32, unless Zavolt reaches the size thresholds.

## 4. Public statements to review

These statements on the website go further than what is implemented, or than the current decisions.
**None has been changed**: website text is code, and changing it needs the owner's approval, a
feature branch and a pull request.

| Where                                           | Statement                                                                                                                                      | The issue                                                                                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/site/home/AboutSection.tsx`, roadmap       | "reviewed by specialists before any of it is built"                                                                                            | Since 17 November 2026 the review is internal and AI-assisted, not a specialists' review (`DECISIONS.md`). Known and already open.                             |
| `src/site/home/SecuritySection.tsx`, principles | "a design reviewed by specialists before it is built"                                                                                          | As above.                                                                                                                                                      |
| `src/site/home/SecuritySection.tsx`, principles | "No trackers, no third-party code"                                                                                                             | The site bundles third-party libraries (React, React Router) and a font, served from its own origin. Accurate wording: no code or requests from other origins. |
| `src/site/home/SecuritySection.tsx`, steps      | "encrypted with a key that only your master password can produce"; "Without your master password, nobody can turn it back into your passwords" | The proposed recovery key would also open the vault (`PROTOCOL.md`, section 15). The statements are labelled Planned, but are absolute.                        |
| `src/site/home/SecuritySection.tsx`, principles | "a sign-in alone reveals nothing"                                                                                                              | A sign-in reveals metadata to the server; with a derived authentication key, it also sends a value that allows offline guessing (`PROTOCOL.md`, 8.3).          |
| `src/site/home/SecuritySection.tsx`, principles | "Established, peer-reviewed algorithms, never homemade ones"                                                                                   | The primitives are published, but several proposed compositions have no published analysis (`PROTOCOL.md`, section 4).                                         |
| `src/site/SiteFooter.tsx`                       | "© <year> Zavolt"                                                                                                                              | "Zavolt" is a product name, not an identified rights holder (L-01, L-02).                                                                                      |
| `src/site/SiteFooter.tsx` and `/register`       | "no data is stored"                                                                                                                            | True of the application today. Once hosted, the host will log requests (L-09, L-13).                                                                           |

### 4.1 Accurate today

For balance: the website's statements that Zavolt is in development, that nothing can be created or
stored, that the encryption has not been built, that nothing has been independently audited, that
the site loads no trackers or scripts from other sites, and the Done, In development and Planned
labels, were consistent with the repository on 21 November 2026.

## 5. Change log

| Version | Date             | Change                   |
| ------- | ---------------- | ------------------------ |
| 0.1     | 22 November 2026 | First draft, for review. |
