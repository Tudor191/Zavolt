# Privacy policy: draft

> **Draft 0.1, 22 November 2026. Not published. Not reviewed by a lawyer. Not approved by the owner.
> Not legal advice.** It must not be published, or linked from the website, until every placeholder
> is filled, a lawyer has reviewed it and the owner has approved it. The website's `/privacy` page
> says that no policy has been published, which remains true. Publishing a policy means changing
> website text, which is a code change (`SECURITY.md` rule 10).

## How to read this draft

**Part A** is the text that would be published. **Part B** is for the owner and the lawyer: the
checklist of what GDPR Article 13 requires, the open questions, and the sources.

Markers in Part A:

- **[PLACEHOLDER: …]**: a fact only the owner can supply. Nothing here is invented to fill it.
- **[DECISION: …]**: a choice the owner has not made.
- **[LEGAL REVIEW: …]**: a question for a lawyer.
- **[ONLY WHEN TRUE: …]**: text that may be published only once the feature exists and has been
  verified. Until then it must be left out.

Part A has two parts on purpose: what exists today (a website), and what is planned (the password
manager). The second may only be published when the service exists.

---

## Part A: policy text

### Privacy policy

Last updated: **[PLACEHOLDER: date of publication]**

#### 1. Who is responsible

Zavolt is a password manager in development. The controller responsible for the processing described
here is **[PLACEHOLDER: the controller's legal name: a person's full name, or a company's registered
name and legal form]**, **[PLACEHOLDER: registration number, if a company]**, **[PLACEHOLDER: postal
address]** ("we").

Contact for anything in this policy: **[PLACEHOLDER: privacy contact address]**.

Data protection officer: **[LEGAL REVIEW: whether one must be designated (Part B, B6). If one is,
their contact details go here.]**

#### 2. The website, as it is today

Today Zavolt is a website that describes a product in development. It has no accounts, no sign-in
and no forms, and the website's own code stores nothing about its visitors.

- **No tracking.** The website loads no analytics, advertising or tracking code and sends no request
  to any other website.
- **No cookies.** The website sets no cookies and uses no other browser storage (section 8).
- **Server logs.** When you open the website, your browser sends the server the technical
  information every web request carries, such as your IP address, the address requested, the time
  and your browser's identification. **[PLACEHOLDER: the hosting provider; whether it keeps these
  logs, where, for what purpose and for how long. No hosting has been chosen.]** **[LEGAL REVIEW:
  legal basis for any such logs (Part B, B2).]**
- **Contact.** **[PLACEHOLDER: the contact channel, if any. None exists today.]**
- **Source code.** Zavolt's source code is published on GitHub. If you visit it there, GitHub's own
  terms and privacy statement apply.

#### 3. The Zavolt service (not available yet)

**[DECISION: publish this section only when accounts open, with every placeholder filled.]**

This section describes what the service will process. Each statement must be checked against the
service as built before it is published.

| Data                             | Examples                                                                                                            | Why                              | Legal basis        | How long                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------------ | ------------------------------------------------ |
| Account data                     | **[DECISION: sign-in identifier, such as an email address]**, account settings, dates                               | To provide your account          | **[LEGAL REVIEW]** | **[PLACEHOLDER]**                                |
| Sign-in data                     | Records that let us check a sign-in; multi-factor settings                                                          | To sign you in securely          | **[LEGAL REVIEW]** | **[PLACEHOLDER]**                                |
| Devices and sessions             | Device identifier, the name you give a device, platform, app version, sign-in times, network address **[DECISION]** | To show and protect your devices | **[LEGAL REVIEW]** | **[PLACEHOLDER]**                                |
| Vault contents                   | **[ONLY WHEN TRUE: see below]**                                                                                     | To store and sync your vault     | **[LEGAL REVIEW]** | Until you delete them **[PLACEHOLDER: backups]** |
| What we can see about your vault | Number of items, their sizes, when they change, revision numbers, which device made a change                        | To sync your devices             | **[LEGAL REVIEW]** | **[PLACEHOLDER]**                                |
| Security records                 | Sign-in attempts and failures, device changes, recovery events, network addresses                                   | To detect and stop abuse         | **[LEGAL REVIEW]** | **[PLACEHOLDER]**                                |
| Messages to support              | What you send us                                                                                                    | To answer you                    | **[LEGAL REVIEW]** | **[PLACEHOLDER]**                                |
| Payment data                     | **[DECISION: whether the service is paid; the payment provider]**                                                   | **[PLACEHOLDER]**                | **[LEGAL REVIEW]** | **[PLACEHOLDER]**                                |

**Vault contents.** **[ONLY WHEN TRUE: this paragraph may be written only after the encryption is
implemented, tested and independently audited. The intended design is that your vault is encrypted
on your device before it reaches us, with keys derived from a master password we never receive, so
that we store only data we cannot decrypt. Until that is true and verified, the policy must not say
it.]**

**Your master password.** **[ONLY WHEN TRUE: that we never receive it, and that if you lose it (and
your recovery key, if recovery exists) we cannot recover your vault.]**

**What we do not do.** We do not use advertising or tracking technologies. **[DECISION: whether to
state further commitments, such as never selling personal data. None is recorded yet.]**

**Who receives data.** **[PLACEHOLDER: each provider that processes data for us (hosting, email,
support, payments), what for, and where. None has been chosen.]** We disclose data to public
authorities only where the law requires it. **[LEGAL REVIEW: wording.]**

**Transfers outside the European Economic Area.** **[PLACEHOLDER: whether any provider processes
data outside the EEA, and the safeguard used (an adequacy decision or standard contractual clauses),
with how to obtain a copy.]**

**Children.** **[DECISION: minimum age. LEGAL REVIEW: see Part B, B7.]**

**Automated decisions.** **[DECISION: confirm that no decision with legal or similarly significant
effects is made solely by automated means. Rate limits on sign-in are automated; LEGAL REVIEW
whether that needs mentioning.]**

#### 4. Deleting your account

**[DECISION: how deletion works.]** When you delete your account, we delete your account data and
your stored vault data from our systems within **[PLACEHOLDER: period]**. Copies in backups are
removed within **[PLACEHOLDER: period]**. Security records are kept for **[PLACEHOLDER: period]**
and then deleted. We cannot restore a deleted vault. **[DECISION: export before deletion, if an
export feature exists.]**

#### 5. Your rights

You have the right to access your personal data, to have it corrected, erased or restricted, to
receive it in a portable format, and to object to processing based on legitimate interests, as set
out in Articles 15 to 22 of the GDPR. Where processing is based on your consent, you can withdraw it
at any time.

To exercise a right, contact **[PLACEHOLDER: privacy contact]**. We answer within one month; for
complex or numerous requests that period can be extended by two further months, and we will tell you
why within the first month. It is free of charge, except where the GDPR allows otherwise. We may
need to confirm your identity first.

**[ONLY WHEN TRUE: if the vault is end-to-end encrypted, explain that we can provide your account
data, records and the encrypted vault, but cannot decrypt it; that you can export its readable
contents from your own device; and that deleting your account deletes the encrypted vault.]**

#### 6. Security and breaches

Today: the website applies a strict Content-Security-Policy, loads nothing from other websites and
refuses to run inside frames. The password manager is not built yet; its design has been reviewed
internally and has **not** been independently audited. An independent security audit is planned
before any public release.

If a personal data breach occurs, we notify the supervisory authority where the GDPR requires it,
and inform you without undue delay where the breach is likely to put your rights and freedoms at
high risk. **[PLACEHOLDER: how we will contact you.]**

#### 7. Complaints

You can complain to a data protection supervisory authority, in particular in the EU Member State
where you live, where you work or where you think the infringement happened. In Romania this is the
Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), B-dul
G-ral. Gheorghe Magheru 28-30, Sector 1, cod poștal 010336, București, România,
<https://www.dataprotection.ro>, which publishes a complaint form on its website. You may contact us
first if you wish, but you do not have to.

#### 8. Cookies and similar technologies

The website uses no cookies and no other technologies that store or read information on your device.
**[ONLY WHEN TRUE: when the service opens, describe each cookie or storage item it uses, such as a
session cookie that keeps you signed in, and why it is needed.]**

#### 9. Changes to this policy

**[PLACEHOLDER: how changes are announced, and how far in advance for significant changes.]** The
date at the top shows when this policy last changed.

---

## Part B: notes for the owner and the lawyer

Labels: **Requirement** (a legal rule, with its source), **Practice**, **Decision**, **Question**.

### B1. What GDPR Article 13 requires, and where it is

| Article 13 item                                                                                                     | Part A        | State                       |
| ------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------------- |
| 13(1)(a) Identity and contact details of the controller                                                             | Section 1     | Placeholder                 |
| 13(1)(b) Contact details of the data protection officer, where applicable                                           | Section 1     | Question (B6)               |
| 13(1)(c) Purposes and legal basis                                                                                   | Sections 2, 3 | Legal bases open (B2)       |
| 13(1)(d) The legitimate interests, where Article 6(1)(f) is the basis                                               | Sections 2, 3 | Depends on B2               |
| 13(1)(e) Recipients or categories of recipients                                                                     | Section 3     | Placeholder: none chosen    |
| 13(1)(f) Transfers to third countries and the safeguards                                                            | Section 3     | Placeholder                 |
| 13(2)(a) Storage period, or the criteria for it                                                                     | Sections 3, 4 | Placeholders (B3)           |
| 13(2)(b) The rights of access, rectification, erasure, restriction, objection and portability                       | Section 5     | Drafted                     |
| 13(2)(c) The right to withdraw consent, where consent is the basis                                                  | Section 5     | Drafted; no consent planned |
| 13(2)(d) The right to lodge a complaint                                                                             | Section 7     | Drafted                     |
| 13(2)(e) Whether providing data is a statutory or contractual requirement, and the consequences of not providing it | Section 3     | **Missing: to add**         |
| 13(2)(f) Automated decision-making                                                                                  | Section 3     | Decision                    |

**Requirement.** The information must be provided "in a concise, transparent, intelligible and
easily accessible form, using clear and plain language" (GDPR Art. 12(1)), at the time the data is
obtained (Art. 13(1)). The Commission's guidance says the same and refers to the transparency
guidelines. **Practice** (WP260 rev.01): use a layered notice online, and avoid qualifiers such as
"may", "might", "some", "often" and "possible" unless their use can be justified.

### B2. Legal bases: not decided

**The policy text leaves every legal basis as a placeholder.** The candidates below are for a
lawyer's assessment; none is adopted.

| Purpose                                            | Candidate basis                    | Source to weigh                                                                    |
| -------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
| Providing the account and the vault                | Contract, Art. 6(1)(b)             | EDPB Guidelines 2/2019: only what is objectively necessary for the contract        |
| Security logs, rate limiting, abuse prevention     | Legitimate interests, Art. 6(1)(f) | Recital 49 (network and information security); EDPB Guidelines 1/2024, version 2.0 |
| Server logs of the website                         | Legitimate interests, Art. 6(1)(f) | Recital 49                                                                         |
| Accounting and tax records, if the service is paid | Legal obligation, Art. 6(1)(c)     | Requires the national law that imposes the obligation; **not researched**          |
| Anything else                                      | Consent, Art. 6(1)(a)              | Not planned: no non-essential cookies or tracking                                  |

### B3. Retention

**Requirement.** Personal data is kept "for no longer than is necessary" (Art. 5(1)(e)), and the
policy must state the period or the criteria for it (Art. 13(2)(a)). **No period has been decided.**
Periods are needed for: account data after deletion, backups, security logs, server logs, support
messages, and billing records (whose minimum may be set by tax law, not researched).

### B4. Rights in a zero-knowledge design

**Question.** If the vault is encrypted so that Zavolt cannot decrypt it, how should access (Art.
15), portability (Art. 20) and erasure (Art. 17) requests be answered for the vault? The likely
answer is: account data, records and the encrypted vault from Zavolt; readable contents through an
export on the user's own device. **Guidance:** EDPB Guidelines 01/2022 on the right of access,
version 2.1. **Requirement:** the answer is due within one month, extendable by two months (Art.
12(3)), and is free of charge except for manifestly unfounded or excessive requests (Art. 12(5)).

### B5. Breaches

- **Requirement.** Notify the supervisory authority without undue delay and, where feasible, within
  72 hours of becoming aware, unless the breach is unlikely to result in a risk (Art. 33(1)).
  Document every breach (Art. 33(5)). Inform the people affected when the risk is high (Art. 34(1)),
  unless, for example, the data was made unintelligible to unauthorised persons, such as by
  encryption (Art. 34(3)(a)).
- **Guidance.** EDPB Guidelines 9/2022, version 2.0, paragraphs 76 to 78: a confidentiality breach
  of properly encrypted data, where a backup exists, may not need notifying; but losing encrypted
  data without a backup can still harm people.
- **Practice.** ANSPDCP provides an online form for notifying a breach under the GDPR
  (<https://www.dataprotection.ro/?page=pagina_formular_679>). A written breach-response procedure
  is needed before accounts open.

### B6. Data protection officer

**Requirement.** A data protection officer is mandatory only in the cases of GDPR Art. 37(1): public
bodies; core activities that require "regular and systematic monitoring of data subjects on a large
scale"; or large-scale processing of special categories. Romania's Law no. 190/2018, Art. 10, refers
to those rules, and its Art. 4(2) adds a case: processing a national identification number on the
basis of legitimate interests. **Question:** none of these appears to apply; a lawyer should
confirm, including for the encrypted vault. **Practice:** do not collect national identification
numbers.

### B7. Children

**Requirement.** For information society services offered directly to a child, consent-based
processing is lawful from 16; Member States may set a lower age, not below 13 (Art. 8(1)). Law no.
190/2018 does not list Article 8 among the provisions it implements (its Art. 1). **Question:**
confirm that 16 applies in Romania, and how the age rules of other target countries apply.
**Decision:** the minimum age for an account.

### B8. Other information duties

- **Requirement.** An information society service provider must make easily, directly and
  permanently accessible: its name, the geographic address where it is established, contact details
  including an email address, any trade register and registration number, and other items (Directive
  2000/31/EC, Art. 5(1)). **Question:** Romania's transposing law (Law no. 365/2002) has not been
  reviewed.
- **Requirement.** The ePrivacy rules on storage in the user's device (Directive 2002/58/EC, Art.
  5(3); Law no. 506/2004, Art. 4(5) and (6)): see [COOKIE_ASSESSMENT.md](./COOKIE_ASSESSMENT.md).

### B9. What the policy must not say until it is true

That vault data is encrypted; that Zavolt cannot decrypt it; that the master password is never
received; that the service has been audited, certified or found "GDPR compliant"; that any provider
has been chosen. Each would be a statement about something that does not exist (`SECURITY.md` rule
9).

### B10. Language

**Question.** Whether a Romanian-language version is required for Romanian users, and which version
prevails.

### B11. Sources

Read from the publisher on 21 and 22 November 2026.

- Regulation (EU) 2016/679 (GDPR), OJ L 119, 4.5.2016: Articles 5, 6, 8, 12 to 22, 25, 28, 30, 32 to
  35, 37, 44 to 49 and 77; Recitals 30 and 49. <https://eur-lex.europa.eu/eli/reg/2016/679/oj>
- European Commission, "Principles of the GDPR" ("What information must be given to individuals
  whose data is processed?").
  <https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en>
- Article 29 Working Party, Guidelines on transparency under Regulation 2016/679 (WP260 rev.01, last
  revised 11 April 2018). <https://ec.europa.eu/newsroom/article29/items/622227/en>
- EDPB Guidelines 2/2019 on Article 6(1)(b) in the context of online services:
  <https://www.edpb.europa.eu/documents/guideline/guidelines-22019-on-the-processing-of-personal-data-under-article-61b-gdpr-in_en>
- EDPB Guidelines 1/2024 on Article 6(1)(f), version 2.0:
  <https://www.edpb.europa.eu/public-consultations/guidelines-12024-on-processing-of-personal-data-based-on-article-61f-gdpr_en>
- EDPB Guidelines 01/2022 on the right of access, version 2.1:
  <https://www.edpb.europa.eu/documents/guideline/guidelines-012022-on-data-subject-rights-right-of-access_en>
- EDPB Guidelines 9/2022 on personal data breach notification, version 2.0:
  <https://www.edpb.europa.eu/documents/guideline/guidelines-92022-on-personal-data-breach-notification-under-gdpr_en>
- Law no. 190/2018, Articles 1, 4 and 10, as published by ANSPDCP.
  <https://www.dataprotection.ro/servlet/ViewDocument?id=1520>
- ANSPDCP: contact details, complaint form and breach-notification form.
  <https://www.dataprotection.ro/>
- Directive 2000/31/EC, Article 5.
  <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32000L0031>
