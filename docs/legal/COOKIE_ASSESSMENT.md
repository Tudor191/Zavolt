# Cookie and browser-storage assessment

> **Draft 0.1, 22 November 2026. Not legal advice. Not reviewed by a lawyer.** **Finding:** the
> website built from this repository sets no cookies and uses no other browser storage. For that
> reason no cookie policy and no consent mechanism have been drafted. This document records the
> evidence, the rules it was checked against, and what would require a fresh assessment.

Labels: **Requirement** (a legal rule, with its source), **Practice**, **Decision** (for the owner),
**Question** (for a lawyer).

## 1. Conclusion

- **Finding.** On 21 November 2026, the production build stored nothing in the browser and read
  nothing stored there: no cookie, no Web Storage, no IndexedDB, no Cache Storage, no service
  worker. Every request went to the site's own origin (section 3).
- **Requirement.** Article 5(3) of the ePrivacy Directive requires consent for storing information,
  or gaining access to information already stored, in a user's terminal equipment, except for what
  is needed only to transmit a communication or what is strictly necessary to provide a service the
  user explicitly asked for (section 2). The website's own code does neither, so on these facts it
  needs no consent mechanism.
- **Question.** Browsers keep ordinary caches of the files they download. Storing the site's own
  files to show the page the visitor asked for appears to fall within the exemption for what is
  strictly necessary for the requested service; a lawyer should confirm.
- **Decision recorded here, for the owner to confirm:** no cookie policy is drafted now. When a
  privacy policy is published, it should say that the site uses no cookies or similar technologies,
  for as long as that remains true.
- **Not covered:** no hosting has been chosen. A host or content delivery network can add cookies of
  its own (section 6). The assessment must be repeated when one is chosen.

## 2. Rules checked

- **Requirement. ePrivacy Directive 2002/58/EC, Article 5(3)** (as amended by Directive
  2009/136/EC): "Member States shall ensure that the storing of information, or the gaining of
  access to information already stored, in the terminal equipment of a subscriber or user is only
  allowed on condition that the subscriber or user concerned has given his or her consent, having
  been provided with clear and comprehensive information […]. This shall not prevent any technical
  storage or access for the sole purpose of carrying out the transmission of a communication over an
  electronic communications network, or as strictly necessary in order for the provider of an
  information society service explicitly requested by the subscriber or user to provide the
  service."
- **Requirement. Romania: Law no. 506/2004, Article 4(5), (5¹) and (6).** Storing or accessing
  information in a subscriber's or user's terminal equipment is allowed only if, cumulatively, the
  person has consented and was first given clear and complete information, in easily understood
  language, including the purpose (paragraph 5). Paragraph 5¹ says consent may also be given through
  browser settings or similar technologies. Paragraph 6 exempts storage or access used solely to
  transmit a communication, and storage or access strictly necessary to provide an information
  society service the subscriber or user explicitly requested. Text read from the copy published by
  ANSPDCP; the official legislation portal could not be reached from this environment. **Question:**
  how paragraph 5¹ (consent through browser settings) relates to the consent standard of the GDPR.
- **Guidance.** Article 29 Working Party Opinion 04/2012 on the cookie consent exemption (WP194)
  sets out the two exemptions as "criterion A" (sole purpose of transmission) and "criterion B"
  (strictly necessary for a service explicitly requested by the user), and reads criterion B as two
  tests: the user asked for the service, and it would not work without the cookie.
- **Guidance.** EDPB Guidelines 2/2023 on the technical scope of Article 5(3), version 2.0, adopted
  on 7 October 2024, explain that Article 5(3) is not limited to cookies. They note (paragraph 44)
  that using information held inside the device, such as cookies or local storage, is not "gaining
  of access" as long as the information does not leave the device, but that Article 5(3) applies
  when the information, or anything derived from it, is accessed.
- **Requirement.** Where personal data is processed, for example IP addresses in a server's logs,
  the GDPR applies in addition. Recital 30 names "internet protocol addresses" and "cookie
  identifiers" as online identifiers.

## 3. Method and findings

**Method.** `npm run build`; the build was served with `vite preview`; Chromium, driven by
Playwright, opened all sixteen addresses listed in `README.md` (including the old `.html` addresses
and an unknown one), waited out the three-second loader on application pages, and followed the
footer's Privacy policy, Terms of service and Contact links. The script recorded every request and
every `Set-Cookie` header, then read the cookies, `localStorage`, `sessionStorage`,
`indexedDB.databases()`, `caches.keys()` and service-worker registrations. The script ran outside
the repository; turning it into a repeatable test is ST-NOW-01 and ST-NOW-02 in
[SECURITY_TEST_PLAN.md](../security/SECURITY_TEST_PLAN.md).

| Technology                        | Found                                            |
| --------------------------------- | ------------------------------------------------ |
| Cookies (any, including HttpOnly) | None; no `Set-Cookie` header in any response     |
| `localStorage`, `sessionStorage`  | No keys                                          |
| IndexedDB                         | No databases                                     |
| Cache Storage                     | No caches                                        |
| Service workers                   | None registered                                  |
| Requests to other origins         | None: all 118 requests went to the site's origin |

**Code and configuration.** The application source uses none of `document.cookie`, `localStorage`,
`sessionStorage`, `indexedDB`, `caches`, service workers, `fetch`, `XMLHttpRequest`, `WebSocket`,
`EventSource` or `navigator.sendBeacon`. The linter bans Web Storage and `document.cookie`. The
Content-Security-Policy in `index.html` allows scripts, styles, images, fonts and connections from
the site's own origin only. The four packages that ship to users are React, React DOM, React Router
and a self-hosted font; there is no analytics or advertising code.

**Limits.** One browser (Chromium); a local preview server rather than a production host; a one-off
run, not a test in CI.

## 4. Cookies and other storage

| Technology               | What it is                                                         | Used today |
| ------------------------ | ------------------------------------------------------------------ | ---------- |
| Cookies                  | Small values set by the server or by script, sent back on requests | No         |
| Web Storage              | `localStorage` and `sessionStorage`, readable by the page's script | No         |
| IndexedDB, Cache Storage | Databases and caches a page's script can create                    | No         |
| Service workers          | Scripts a site registers to run in the background                  | No         |
| Pixels, fingerprinting   | Ways to recognise a browser without storing anything obvious       | No         |

All of them can fall within Article 5(3), as the EDPB's guidelines explain. The distinction matters
mostly for engineering; the legal test is whether information is stored on, or read from, the user's
device, and why.

## 5. What the planned product would add

Nothing here exists. Each item needs its own assessment when it is designed.

| Planned item                                                                              | Source                 | Likely position                                                                                                                              |
| ----------------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| A session cookie for signed-in users (`__Host-`, `Secure`, `HttpOnly`, `SameSite=Strict`) | `ARCHITECTURE.md` 2.5  | **Question:** a candidate for the "strictly necessary" exemption. It must still be described to users.                                       |
| An encrypted local copy of the vault                                                      | `ARCHITECTURE.md` 2.6  | **Question:** whether it is strictly necessary for the service the user requested, or needs consent. Ciphertext only (`SECURITY.md` rule 4). |
| Keys sealed in the extension's `storage.session`                                          | `ARCHITECTURE.md` 2.16 | Inside the extension, not the website. **Question:** how Article 5(3) applies to extensions.                                                 |
| Files of the desktop application                                                          | `ARCHITECTURE.md` 2.10 | An installed application. **Question:** as above.                                                                                            |
| Analytics, advertising, tracking                                                          | —                      | **Excluded** by the owner's commitment of 16 November 2026 (`DECISIONS.md`).                                                                 |

## 6. What would require a new assessment

- Choosing a host, content delivery network or protection service that sets cookies or injects
  scripts.
- Adding sign-in, a local vault copy, or any use of browser storage.
- Adding error reporting, telemetry, A/B testing, embedded third-party content (videos, maps, fonts
  or scripts from other origins), payment or support widgets.
- Any change to the Content-Security-Policy that allows another origin.
- A change in the law or in EDPB guidance.

**Requirement.** If anything that is not strictly necessary were ever added, consent and clear
information would be needed before it runs (Directive 2002/58/EC, Art. 5(3); Law no. 506/2004, Art.
4(5)), and a cookie policy and consent mechanism would have to be drafted first.

## 7. Sources

Read from the publisher on 21 November 2026.

- Directive 2002/58/EC, consolidated text of 19 December 2009, Article 5(3).
  <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02002L0058-20091219>
- Law no. 506/2004, Article 4, as published by ANSPDCP.
  <https://www.dataprotection.ro/servlet/ViewDocument?id=859>
- Article 29 Working Party, Opinion 04/2012 on Cookie Consent Exemption (WP194).
  <https://ec.europa.eu/justice/article-29/documentation/opinion-recommendation/files/2012/wp194_en.pdf>
- EDPB, Guidelines 2/2023 on Technical Scope of Art. 5(3) of ePrivacy Directive, version 2.0.
  <https://www.edpb.europa.eu/documents/guideline/guidelines-22023-on-technical-scope-of-art-53-of-eprivacy-directive_en>
- Regulation (EU) 2016/679 (GDPR), Recital 30. <https://eur-lex.europa.eu/eli/reg/2016/679/oj>
