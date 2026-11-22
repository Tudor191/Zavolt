# Security design documents

These are the four deliverables of the evidence gate for cryptographic implementation in
[SECURITY.md](../../SECURITY.md#evidence-gate-for-cryptographic-implementation).

> **The evidence gate is not met.** All four documents are first drafts. None has been through the
> internal review, and the owner has approved none of them. They describe a product that does not
> exist, and they authorise no implementation.

| Document                                         | Deliverable                         | Version | Status                              |
| ------------------------------------------------ | ----------------------------------- | ------- | ----------------------------------- |
| [THREAT_MODEL.md](./THREAT_MODEL.md)             | 1. Threat model                     | 0.1     | Draft; awaiting the internal review |
| [PROTOCOL.md](./PROTOCOL.md)                     | 2. Versioned protocol specification | 0.1     | Draft; awaiting the internal review |
| [TEST_VECTOR_PLAN.md](./TEST_VECTOR_PLAN.md)     | 3. Test-vector plan                 | 0.1     | Draft; no vector has been run       |
| [SECURITY_TEST_PLAN.md](./SECURITY_TEST_PLAN.md) | 4. Reproducible security-test plan  | 0.1     | Draft; no new test has been run     |

What happens next, in the order `SECURITY.md` sets:

1. ChatGPT and Claude carry out the internal architecture and security review of these documents.
2. Unresolved findings are recorded with them, and those needing the owner's decision are added to
   `docs/DECISIONS.md`.
3. The owner reviews the design and explicitly approves it, or asks for changes.
4. The owner explicitly authorises an implementation stage.

Until step 3, every recommendation in these documents stays provisional, however it is worded. The
independent external security audit before public release remains mandatory and is not replaced by
any of this.

Each document carries its own change log. Raise the version and add a row whenever it changes.
