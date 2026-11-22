# Data processing agreements: assessment

> **Draft 0.1, 22 November 2026. Not legal advice. Not reviewed by a lawyer.** No service provider
> has been chosen, so **no data processing agreement is drafted here**, on purpose. This document
> explains when Zavolt will need one, and in which role Zavolt would act.

Labels: **Requirement** (a legal rule, with its source), **Practice**, **Decision** (for the owner),
**Question** (for a lawyer).

## 1. Summary

- Whoever operates Zavolt (a person or a company: undecided) will be the **controller** of the
  personal data processed to provide the service: accounts, sign-in, devices, security logs, support
  and any billing.
- Every provider that processes that data **on Zavolt's behalf**, such as hosting, the database,
  backups, email delivery, a support desk or error monitoring, is a **processor**. **Requirement:**
  each needs a contract meeting GDPR Article 28.
- A provider that decides its own purposes, as some payment providers may, can be a separate
  controller instead. **Question:** decided provider by provider.
- If Zavolt one day serves organisations for their staff, Zavolt would act as a **processor** for
  them and would have to offer them an Article 28 contract. **Decision:** consumers, businesses or
  both.
- No analytics or tracking provider is planned (owner commitment, 16 November 2026).

## 2. Roles

- **Requirement.** A controller "alone or jointly with others, determines the purposes and means of
  the processing of personal data" (GDPR Art. 4(7)). A processor "processes personal data on behalf
  of the controller" (Art. 4(8)). A processor that determines the purposes and means of processing
  "shall be considered to be a controller in respect of that processing" (Art. 28(10)).
- **Guidance.** EDPB Guidelines 07/2020 on the concepts of controller and processor in the GDPR
  (version 2.1; adopted on 7 July 2021, with minor corrections on 20 September 2022).

## 3. Zavolt as controller (the planned service)

| Processing                                              | Likely role of Zavolt | Note                                                              |
| ------------------------------------------------------- | --------------------- | ----------------------------------------------------------------- |
| Accounts and contact data                               | Controller            |                                                                   |
| Sign-in, multi-factor authentication, sessions, devices | Controller            | Authentication records are designed not to reveal passwords       |
| Storing and syncing the encrypted vault                 | Controller            | See the question below                                            |
| Recovery                                                | Controller            | If recovery is offered at all                                     |
| Security logs, rate limiting, abuse prevention          | Controller            | Logs never hold secrets (`SECURITY.md` rule 2)                    |
| Support communications                                  | Controller            | No contact channel exists yet                                     |
| Billing                                                 | Controller            | If the service is paid; the payment provider's role is a question |
| Hosting logs for the website                            | Controller            | Once hosting exists                                               |

**Question: the encrypted vault.** In the planned design, Zavolt stores vault contents only as
ciphertext it cannot decrypt (`ARCHITECTURE.md` 2.2; not implemented). Whether that ciphertext is
personal data in Zavolt's hands, and what follows for access, erasure, portability and breach
notification, needs a lawyer's view. Users decide what they store, which may include data about
other people and sensitive data; Zavolt cannot see it. The privacy policy must not describe this
design as existing until it is built (`PRIVACY_POLICY_DRAFT.md`).

## 4. Zavolt as processor (only if it serves organisations)

If an organisation used Zavolt for its staff's credentials, the organisation would probably be the
controller and Zavolt its processor. Zavolt would then have to sign Article 28 contracts with its
customers, and could use the standard contractual clauses the Commission adopted under Article 28(7)
(Implementing Decision (EU) 2021/915 of 4 June 2021). This depends on a product decision that has
not been made.

## 5. Providers Zavolt will probably need

None is chosen. The roles are the usual ones and must be checked against each provider's terms.

| Category                                          | Probable role                  | Article 28 contract | Transfer check | Note                                                                           |
| ------------------------------------------------- | ------------------------------ | ------------------- | -------------- | ------------------------------------------------------------------------------ |
| Hosting, compute, database                        | Processor                      | Yes                 | Yes            | Also decides how the response headers in `SECURITY.md` are sent                |
| Backups and object storage                        | Processor                      | Yes                 | Yes            |                                                                                |
| Content delivery and denial-of-service protection | Processor                      | Yes                 | Yes            | May set cookies: repeat `COOKIE_ASSESSMENT.md`                                 |
| Transactional email                               | Processor                      | Yes                 | Yes            | Carries verification and recovery emails, so security-sensitive                |
| Support desk                                      | Processor                      | Yes                 | Yes            |                                                                                |
| Error monitoring or log storage                   | Processor                      | Yes                 | Yes            | Must never receive secrets                                                     |
| Payments                                          | Often a separate controller    | **Question**        | Yes            | Depends on the provider's terms                                                |
| Analytics, telemetry                              | —                              | —                   | —              | Not planned                                                                    |
| Code hosting (GitHub)                             | Not a processor of users' data | No, for users' data | —              | Handles developers' and vulnerability reporters' data under GitHub's own terms |

## 6. What an Article 28 contract must contain

**Requirement** (GDPR Art. 28):

- The controller uses only processors "providing sufficient guarantees" of appropriate technical and
  organisational measures (Art. 28(1)).
- No sub-processor without the controller's prior specific or general written authorisation; under a
  general authorisation, notice of changes and a chance to object (Art. 28(2)).
- A contract setting out the subject-matter and duration, the nature and purpose, the type of data,
  the categories of data subjects, and the controller's obligations and rights (Art. 28(3)), and
  requiring the processor to:
  - (a) act only on documented instructions, including on transfers;
  - (b) bind its staff to confidentiality;
  - (c) take the security measures of Article 32;
  - (d) respect the conditions for engaging sub-processors;
  - (e) help the controller answer data subjects' requests;
  - (f) help with Articles 32 to 36 (security, breaches, impact assessments);
  - (g) delete or return the data at the end, at the controller's choice;
  - (h) provide the information needed to show compliance, and allow audits.
- The same obligations flow down to sub-processors (Art. 28(4)).
- The contract must be in writing, which includes electronic form (Art. 28(9)).
- A processor must tell the controller about a personal data breach "without undue delay" (Art.
  33(2)).

**Practice.** Large providers usually offer a standard agreement. Check it against the list above
rather than drafting a new one.

## 7. Transfers outside the European Economic Area

- **Requirement.** GDPR Chapter V (Articles 44 to 49) applies when a provider processes data outside
  the EEA. Transfers need an adequacy decision (Art. 45), appropriate safeguards such as the
  Commission's standard contractual clauses (Art. 46(2)(c); Implementing Decision (EU) 2021/914 of 4
  June 2021), or one of the derogations (Art. 49).
- For organisations in the United States certified under the EU-US Data Privacy Framework, the
  Commission's adequacy decision is Implementing Decision (EU) 2023/1795 of 10 July 2023.
- **Guidance.** EDPB Recommendations 01/2020 on measures that supplement transfer tools (version
  2.0) and Guidelines 05/2021 on the interplay between Article 3 and Chapter V (version 2.0).
- **Decision.** Where data is hosted. **Practice:** hosting in the EEA simplifies this.

## 8. Records, impact assessment and data protection officer

- **Requirement.** Records of processing (Art. 30). The exemption for organisations under 250
  employees does not apply if the processing "is not occasional" (Art. 30(5)). An online service
  runs continuously. **Question:** confirm that records are therefore needed; **Practice:** keep
  them anyway.
- **Requirement.** A data protection impact assessment is required where processing "is likely to
  result in a high risk", in particular for the cases in Art. 35(3). **Question:** whether a
  password manager's processing reaches that threshold, including under the national list the
  supervisory authority publishes, which has not been reviewed. **Practice:** carry one out before
  launch.
- **Requirement.** A data protection officer is mandatory for public bodies, for core activities
  that need "regular and systematic monitoring of data subjects on a large scale", or for
  large-scale processing of special categories (Art. 37(1)). Romania's Law no. 190/2018, Art. 10,
  refers back to these GDPR rules. **Question:** none of these appears to apply to the planned
  service; a lawyer should confirm, including for the encrypted vault.
- **Requirement (Romania).** Processing a national identification number on the basis of legitimate
  interests requires safeguards, including appointing a data protection officer (Law no. 190/2018,
  Art. 4(2)). **Practice:** do not collect national identification numbers.

## 9. Checklist for choosing a provider (practice)

Security documentation and certifications; where data is stored and who can access it from where;
the sub-processor list and how changes are announced; breach-notification terms; deletion or return
at the end of the contract; audit rights; help with requests and assessments; staff confidentiality;
encryption at rest and access controls; configurable log retention; and no use of Zavolt's data for
the provider's own purposes (Art. 28(10)).

## 10. What this document does not do

It names no provider, drafts no agreement, and decides no legal basis or retention period. Those
wait for the decisions in [LEGAL_OPEN_QUESTIONS.md](./LEGAL_OPEN_QUESTIONS.md).

## 11. Sources

Read from the publisher on 21 November 2026.

- Regulation (EU) 2016/679 (GDPR), Articles 4, 28, 30, 33, 35, 37 and 44 to 49.
  <https://eur-lex.europa.eu/eli/reg/2016/679/oj>
- Commission Implementing Decision (EU) 2021/914 (standard contractual clauses for transfers).
  <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32021D0914>
- Commission Implementing Decision (EU) 2021/915 (standard contractual clauses between controllers
  and processors). <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32021D0915>
- Commission Implementing Decision (EU) 2023/1795 (EU-US Data Privacy Framework).
  <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023D1795>
- EDPB Guidelines 07/2020 on the concepts of controller and processor, version 2.1:
  <https://www.edpb.europa.eu/documents/guideline/guidelines-072020-on-the-concepts-of-controller-and-processor-in-the-gdpr_en>
- EDPB Recommendations 01/2020 on supplementary measures, version 2.0:
  <https://www.edpb.europa.eu/documents/recommendation/recommendations-012020-on-measures-that-supplement-transfer-tools-to_en>
- EDPB Guidelines 05/2021 on the interplay between Article 3 and Chapter V, version 2.0:
  <https://www.edpb.europa.eu/documents/guideline/guidelines-052021-on-the-interplay-between-the-application-of-article-3-and-the_en>
- Law no. 190/2018, Articles 4 and 10, as published by ANSPDCP.
  <https://www.dataprotection.ro/servlet/ViewDocument?id=1520>
