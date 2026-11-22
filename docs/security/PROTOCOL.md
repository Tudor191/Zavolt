# Zavolt protocol specification

> **Status: draft 0.1, 22 November 2026. Not reviewed, not approved.** This is the second of the
> four deliverables of the evidence gate in
> [SECURITY.md](../../SECURITY.md#evidence-gate-for-cryptographic-implementation). It describes a
> **proposed** protocol. Writing a proposal down does not approve it: the OPAQUE configuration, the
> Argon2id parameters, the AES-256-GCM construction, the key hierarchy and the recovery design below
> are all unapproved. Nothing here is implemented, and nothing here authorises an implementation.

## 1. Status and versioning

| Item                     | Value                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Document version         | 0.1 (draft)                                                                                |
| Protocol version defined | None yet. "Version 1" below is a working name; no value is final until the owner approves. |
| Review state             | Awaiting the internal review in `SECURITY.md`                                              |
| Owner decisions          | Only those listed in section 23                                                            |

Words such as "must" and "should" describe what the proposal would require if it were approved. They
are not requirements in force. Each change to this document adds a row to section 25.

Companion documents: [THREAT_MODEL.md](./THREAT_MODEL.md) (threats `T-…`, assumptions `AN-…`),
[TEST_VECTOR_PLAN.md](./TEST_VECTOR_PLAN.md) and [SECURITY_TEST_PLAN.md](./SECURITY_TEST_PLAN.md).

## 2. Scope and non-goals

**In scope:** registration and authentication, password preparation, password-based key derivation,
the key hierarchy, encryption and its format, the vault item format, server-side storage,
synchronisation, recovery, devices, key rotation, sessions and locking, rollback, versioning and
error handling.

**Not in scope of this version:** sharing between users and the public-key cryptography it needs,
offline unlocking, biometric and passkey unlocking, approving a device from another device, binding
session tokens to devices, ciphertext padding and post-quantum questions. All are deferred
(`ARCHITECTURE.md` 2.17).

## 3. Conventions

- Byte strings are written `name[n]` for `n` bytes. `||` is concatenation.
- `random(n)` is `n` bytes from the platform's cryptographic random source (section 5).
- Labels used for domain separation are ASCII strings beginning `zavolt/v1/`. They are a Zavolt
  convention, not part of any standard.
- Text is UTF-8 after the preparation in section 6.

## 4. Standing of each construction

The distinction matters: a published specification has public analysis behind it, while a Zavolt
composition has only this document and the internal review.

| Element                                         | Source                                                                                                    | Standing                                                       | Kind                    | Status                                                  |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------- | ------------------------------------------------------- |
| Argon2id                                        | RFC 9106                                                                                                  | IRTF, Informational, September 2021                            | Published specification | Direction approved; parameters open                     |
| OPAQUE-3DH                                      | RFC 9807                                                                                                  | IRTF, Informational, July 2025                                 | Published specification | Provisional                                             |
| OPRF, ristretto255-SHA512                       | RFC 9497, RFC 9496                                                                                        | IRTF, Informational, December 2023                             | Published specification | Provisional (part of OPAQUE)                            |
| HKDF                                            | RFC 5869                                                                                                  | Informational, May 2010                                        | Published specification | Direction approved; labels are Zavolt's                 |
| HMAC with SHA-2                                 | RFC 2104 (named by RFC 9807); vectors in RFC 4231                                                         | Published                                                      | Published specification | Provisional                                             |
| AES-256-GCM                                     | NIST SP 800-38D (November 2007; NIST announced a revision on 6 March 2024); FIPS 197 (updated 9 May 2023) | NIST recommendation and standard                               | Standard                | Direction approved; choice open                         |
| XChaCha20-Poly1305                              | draft-irtf-cfrg-xchacha-03                                                                                | Expired Internet-Draft; IRTF state "Dead". **No RFC.**         | Not a standard          | Named in the direction; choice open                     |
| ChaCha20-Poly1305                               | RFC 8439                                                                                                  | Informational, June 2018                                       | Published specification | Not proposed                                            |
| COSE_Encrypt0 framing                           | RFC 9052 sections 5.2 and 5.3; RFC 9053 section 4.1                                                       | Standards Track (RFC 9052 is STD 96)                           | Standard                | Provisional, "after an experiment"                      |
| Password preparation, OpaqueString profile, NFC | RFC 8265 section 4.2; Unicode UAX #15; NIST SP 800-63B-4                                                  | Standards Track (RFC 8265); Unicode standard annex; NIST guide | Standard                | Provisional                                             |
| Key hierarchy (account, vault and item keys)    | This document, section 9                                                                                  | Zavolt composition of standard parts                           | **Custom**              | Provisional                                             |
| Key commitment value                            | This document, section 10.3                                                                               | No standard defines it                                         | **Custom**              | Provisional; needs a written argument                   |
| Hash-chained vault manifest                     | This document, section 14                                                                                 | No standard defines it                                         | **Custom**              | Provisional; needs formal analysis                      |
| Recovery flow                                   | This document, section 15                                                                                 | Zavolt design                                                  | **Custom**              | Provisional; recovery itself undecided                  |
| Device enrolment and revocation levels          | This document, section 16                                                                                 | Zavolt design                                                  | **Custom**              | Provisional                                             |
| Extension keys sealed in `storage.session`      | This document, section 18.4                                                                               | Zavolt design on a browser API                                 | **Custom**              | Provisional; needs an exception to `SECURITY.md` rule 4 |

## 5. Randomness

- **Proposal.** Every key, salt, nonce and identifier comes from the platform's cryptographic random
  source: `crypto.getRandomValues` from the Web Cryptography API in browsers and extensions, and the
  operating system's source in the desktop application. No other generator is used.
- **Why.** These are the sources the platforms specify for cryptographic use.
- **Assumption.** AN-01 in the threat model.
- **Unresolved.** None in the design. Randomness cannot be proven by testing; the tests in
  `SECURITY_TEST_PLAN.md` only check that the right source is called.

## 6. Password preparation and normalisation

**Proposal (provisional, `ARCHITECTURE.md` 2.16).** Before a master password is used, the client
prepares it with the OpaqueString profile of RFC 8265, section 4.2:

1. Width mapping: none. RFC 8265 says fullwidth and halfwidth code points must not be mapped.
2. Additional mapping: every non-ASCII space is mapped to SPACE (U+0020).
3. Case mapping: none.
4. Normalisation: Unicode Normalization Form C (NFC).
5. Directionality: no rule; RFC 8265 explains that bidirectional rules are inapplicable to
   passwords.

The result is encoded as UTF-8. The preparation has a version number, stored with the account, so
that a future change cannot lock existing users out.

**Why.** The same password typed on different devices can arrive as different code-point sequences.
Without normalisation, a user could be locked out of their own vault. NIST SP 800-63B-4 says that if
Unicode characters are accepted, the verifier should apply NFC, as defined in UAX #15 section 12.1,
before hashing. RFC 8265 is the IETF profile for exactly this purpose.

**Length and content (open; owner decision).** NIST SP 800-63B-4 requires passwords used as a single
factor to be at least 15 characters long (at least 8 when used only as part of multi-factor
authentication), says verifiers should accept at least 64 characters, counts each Unicode code point
as one character, and requires a blocklist of common and compromised passwords. Zavolt's master
password is both a sign-in secret and the root of encryption, so its minimum length and the
breached-password check (`ARCHITECTURE.md` 2.5) are decisions for the owner.

**Assumptions.** Every supported runtime implements NFC correctly for the characters users type.

**Unresolved.**

- Runtimes carry different Unicode versions. A password containing a character that one runtime does
  not know could normalise differently. RFC 8265 builds on the PRECIS string classes of RFC 8264,
  which this draft has not reviewed; how they treat code points unassigned in a given Unicode
  version must be checked before the rules are fixed.
- No library provides OpaqueString in the browser, so this is Zavolt code and needs its own tests
  (`TEST_VECTOR_PLAN.md`, V-14).
- Whether leading and trailing spaces are kept (RFC 8265 keeps them).

## 7. Password-based key derivation

**Approved direction.** Argon2id (`DECISIONS.md`, 15 November 2026). Parameters are not decided.

**Proposal (provisional).**

- Algorithm: Argon2id, version 0x13, as specified in RFC 9106.
- Floor: memory 64 MiB (m = 2^16 KiB), 3 passes (t = 3), 4 lanes (p = 4). This is RFC 9106's "SECOND
  RECOMMENDED option", meant for when much less memory is available than the first option needs.
  Values are raised only after measurements on real devices (`DECISIONS.md`, Open).
- Salt: 16 random bytes per account in the derived-key alternative (section 8.3). RFC 9106 section 4
  considers 128 bits of salt sufficient.
- Output: 32 bytes in the derived-key alternative; `Nh` bytes inside OPAQUE (section 8.2).
- Parameters are stored with the account and versioned, and **every client enforces a minimum**, so
  that a server cannot talk it into weaker settings (threat T-S-04).

**Why.** Argon2id is memory-hard, which raises the cost of guessing on specialised hardware, and RFC
9106 recommends it.

**Where the proposal departs from the RFCs.** RFC 9106's first recommended option is t = 1, p = 4
and **2 GiB** of memory. RFC 9807 section 7 recommends, "absent an application-specific profile",
OPAQUE configurations whose key-stretching function is Argon2id with that same 2 GiB setting (and a
fixed all-zero salt, because the OPRF already makes the input unique per user). A browser cannot
reliably allocate 2 GiB per sign-in, so Zavolt would need an application-specific profile with less
memory. That is a deliberate weakening of the RFCs' recommended setting; it must be justified with
measurements and approved by the owner.

**Browser requirement.** Argon2id is not part of the Web Cryptography API, so it would run as
WebAssembly. CSP Level 3 gates WebAssembly compilation behind `'wasm-unsafe-eval'` (or
`'unsafe-eval'`), so the page's policy would need `'wasm-unsafe-eval'`. Changing the policy is an
owner decision (handoff section 6.2).

**Assumptions.** Argon2id's memory hardness holds as published; the WebAssembly build is the audited
reference algorithm.

**Unresolved.** Final parameters and the device budget; whether a device-held secret is mixed in
(RFC 9106's optional secret input; `ARCHITECTURE.md` 2.13); which library; how parameters are raised
for existing accounts (section 17). No benchmark has been run: benchmarks wait for approval.

## 8. Registration and authentication

### 8.1 What authentication must achieve

From `ARCHITECTURE.md` 2.2 and 2.5: the master password never leaves the device in a form the server
could use to recover it; signing in and decrypting use separate keys; a sign-in alone must not be
enough to read a vault; unknown accounts must not be revealed; attempts are rate-limited;
multi-factor authentication protects sign-in but never replaces the password for decryption.

Which mechanism to use is an **open decision** (`DECISIONS.md`: "OPAQUE or a derived authentication
key"). The internal review provisionally recommends OPAQUE if a library evaluation succeeds.

### 8.2 Option A: OPAQUE (provisional recommendation)

**Proposed configuration** (an application-specific profile in the sense of RFC 9807 section 7):

| Parameter | Proposed value                                          | Note                                                                                                        |
| --------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| OPRF      | ristretto255-SHA512 (RFC 9497)                          | Listed by RFC 9807 section 7 as an example                                                                  |
| KDF       | HKDF-SHA-512                                            | As in RFC 9807's first recommended configuration                                                            |
| MAC       | HMAC-SHA-512                                            | As above                                                                                                    |
| Hash      | SHA-512                                                 | As above                                                                                                    |
| KSF       | Argon2id with Zavolt's parameters (section 7)           | **Departs** from the recommended 2 GiB setting                                                              |
| Group     | ristretto255 (RFC 9496)                                 | RFC 9807: the group should match the OPRF                                                                   |
| Context   | A Zavolt string naming the protocol version and profile | RFC 9807: should include application-specific configuration, to prevent cross-protocol or downgrade attacks |

**Flows.** Registration sends a registration request, receives a response and uploads a record; the
server stores the record against the account's credential identifier. Sign-in is the three-message
exchange KE1, KE2, KE3. For unknown accounts the server returns a simulated response, as RFC 9807
section 6.3.2.2 specifies, so that real and fake responses are indistinguishable (section 10.9).

**Outputs.** A session key, used only to finish authentication, and an **export key**. RFC 9807
section 10.4 says the export key "can be used (separately from the OPAQUE protocol) to provide
confidentiality and integrity to other data that only the client should be able to process". The
proposal derives Zavolt's key-encryption key from it (section 9).

**Why.** The server never receives the password or anything equivalent to it, even at registration.
Guessing a password from a stolen record also needs the server's OPRF key, which defeats
pre-computation. RFC 9807 is a complete specification with test vectors.

**Assumptions.** The OPRF and the group are secure as published; the server's OPRF seed and AKE key
pair are kept secret and stored apart from the database (AN-07); the library is correct.

**Risks and unresolved questions.**

- No library has been evaluated for any of the three clients or the server.
- RFC 9807 is Informational, not Standards Track.
- Its test vectors (Appendix C) all use the Identity key-stretching function; **no published vector
  covers OPAQUE with Argon2id** (`TEST_VECTOR_PLAN.md`, section 4).
- Registration still reveals whether an account exists; RFC 9807 section 10.9 says applications
  should rate-limit or restrict it.
- If both the database and the server's OPAQUE keys are stolen, offline guessing becomes possible,
  as with Option B.
- A password change is a new registration. Rotating the OPRF seed means every user re-registers.
- How clients learn and pin the server's AKE public key.

### 8.3 Option B: derived authentication key (`ARCHITECTURE.md` 2.4 and 2.5)

**Flow.** The client fetches the account's salt and Argon2id parameters (a stable fake answer for
unknown accounts), derives a 32-byte master key with Argon2id, and derives two keys from it with
HKDF and different labels: an authentication key and the key-encryption key. It sends the
authentication key over TLS. The server stores a slow, salted hash of that key and compares in
constant time.

**Why.** It is simple and needs only Argon2id and HKDF.

**Weaknesses.** The server receives a password-equivalent value at every sign-in: a compromised or
logging server (AT-04, AT-05) can capture it and, with the salt, guess the password offline. Salts
are served before authentication, so targeted pre-computation is possible. The fake answers for
unknown accounts must be indistinguishable from real ones.

### 8.4 Not evaluated here

Other augmented PAKEs exist and have not been assessed. Passkeys and WebAuthn could protect sign-in
but cannot replace the master password for decryption; passkey unlocking is deferred.

### 8.5 Criteria for the owner's decision

A written library survey should record, for each candidate and each platform: compliance with the
final RFC 9807; whether it passes Appendix C; constant-time implementation; maintenance and any
published audit; support for ristretto255 and for a pluggable key-stretching function; licence;
size; and availability for the browser, the extension, the desktop shell and the server.

### 8.6 Multi-factor authentication

Planned (`ARCHITECTURE.md` 2.5): TOTP and WebAuthn, for sign-in only. TOTP secrets would be stored
by the server and need protection at rest. The factors offered are a product decision.

## 9. Key hierarchy and envelope encryption

**Approved direction.** Envelope encryption and versioned keys (`DECISIONS.md`, 15 November 2026).
The structure below is **not approved**.

**Proposal (provisional, `ARCHITECTURE.md` 2.16, which adds an account key to 2.4):**

```text
  root secret        OPAQUE export key (Option A), or the Argon2id master key (Option B)
       │  HKDF, label zavolt/v1/kek
       ▼
  key-encryption key (KEK)                 client memory only
       │  wraps
       ▼
  account key        random(32)            wrapped copy stored by the server
       │  wraps                            ◀── also wrapped by the recovery KEK (section 15)
       ▼
  vault keys         random(32) each       wrapped copies stored by the server
       │  wraps
       ▼
  item keys          random(32), a new one for every item version
       │  encrypts
       ▼
  item contents      ciphertext only on the server
```

- **Wrapping.** A key is wrapped by encrypting it with the authenticated encryption of section 10,
  with associated data naming the wrapping key, the wrapped key, its purpose and the account. That
  is a Zavolt use of a standard AEAD. Dedicated key-wrap modes exist (Wycheproof publishes
  `aes_kwp_test.json` for AES key wrap with padding) and have not been evaluated.
- **Identifiers.** Every key has a random identifier and a version, stored with each wrapped copy.
- **Why each level.** The account key means a password change re-wraps one key. Vault keys leave
  room for several vaults and later sharing. A new item key per version limits how much any one key
  encrypts, which matters for AES-GCM's random-IV limit (section 10.1), and allows one item to be
  shared later.

**Assumptions.** The AEAD is secure with uniformly random keys; HKDF labels separate keys; the
random source is sound.

**Unresolved.** How many vaults an account has; whether a key per item version is needed or a key
per item suffices; storage cost; whether key commitment is needed (section 10.3).

## 10. Authenticated encryption and the encryption format

### 10.1 Algorithm

**Approved direction.** AES-256-GCM or XChaCha20-Poly1305 (`DECISIONS.md`). Which one, or both, is
open.

**Proposal (provisional): AES-256-GCM** from the Web Cryptography API, with a 96-bit IV from
`random(12)` and a 128-bit tag.

- **Why.** It is built into browsers, so the main cipher needs no extra library, and it is a NIST
  standard.
- **The limit that shapes the design.** NIST SP 800-38D section 8.3: unless only deterministically
  constructed 96-bit IVs are used, "the total number of invocations of the authenticated encryption
  function shall not exceed 2^32" for a given key. Zavolt would use random IVs, so every key needs a
  usage counter and a cap far below that limit (the cap is open). A new key per item version keeps
  item keys at one encryption each; the keys that wrap many other keys need counting.
- **Assumptions.** AES is a secure block cipher; IVs never repeat for a key, within the limit above.

**Alternative: XChaCha20-Poly1305.** Its 192-bit nonce makes random nonces comfortable, but it has
**no RFC**: draft-irtf-cfrg-xchacha-03 expired and its IRTF state is "Dead". It would need a library
in every client. Wycheproof publishes vectors for it. ChaCha20-Poly1305 (RFC 8439) has a 96-bit
nonce and so has the same nonce question as AES-GCM.

### 10.2 Associated data: binding every ciphertext to its context

**Proposal (planned in `ARCHITECTURE.md` 2.4, extended in 2.16).** Every ciphertext and every
wrapped key is authenticated together with: format version, algorithm identifier, account
identifier, vault identifier, item identifier, item version, the field or purpose, and the key
identifier and version. A server that moves a ciphertext to another item, field, account or version
then makes decryption fail (threat T-S-03). The encoding of this context must be canonical, so that
two clients always produce the same bytes.

### 10.3 Key commitment

AES-GCM's and ChaCha20-Poly1305's specifications (SP 800-38D, RFC 8439) describe confidentiality and
integrity under a single key; neither claims that a ciphertext can only decrypt under one key. The
internal review proposed a **commitment value derived from each key and checked before decrypting**.
No standard defines it; it needs a written argument, or the owner decides it is not needed. Where it
would matter: any place a client might try several keys, such as recovery or future sharing.

### 10.4 Framing

**Proposal (provisional, "after an experiment").** COSE_Encrypt0 (RFC 9052 section 5.2), where the
AEAD's associated data is the `Enc_structure` of RFC 9052 section 5.3, the algorithm is identified
with the AES-GCM identifiers of RFC 9053 section 4.1, and Zavolt's context (section 10.2) is carried
as external associated data or in the protected header.

**Why.** A standard, versioned structure with test examples (RFC 9052 Appendix C.4), instead of an
invented byte layout.

**Alternative.** A fixed layout of version, algorithm, key identifier, IV, ciphertext and tag, with
the context encoded separately. Simpler to parse, but a Zavolt invention.

**Rules either way.** Clients reject unknown versions and algorithms and never fall back to a weaker
one (`ARCHITECTURE.md` 2.4). Parsing is strict, with size limits.

## 11. Vault item format

**Proposal (provisional).** Before encryption an item is a structured record holding every field the
user enters (principle 5 of `ARCHITECTURE.md` 2.2): its title, usernames, passwords, web addresses
used for matching, notes, custom fields and folder. All of it is encrypted under the item key.

The server sees only: the item and vault identifiers, the revision, the ciphertext size, its own
timestamps and whether the item is deleted.

**Unresolved.** The item types offered (a product decision); the canonical encoding before
encryption; size limits; how many old versions are kept (`DECISIONS.md`, Open); whether
one-time-code secrets are stored.

## 12. Server-side storage model

**Proposal (planned; no backend technology chosen).**

| Record         | Holds                                                                                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account        | Random account identifier, sign-in identifier, versions (protocol, key derivation, preparation), the OPAQUE record or verifier, multi-factor settings, recovery state |
| Key envelope   | The account key wrapped under the KEK, and under the recovery KEK; key identifiers, versions and any commitment values                                                |
| Vault          | Vault identifier and its wrapped vault key                                                                                                                            |
| Item           | Item identifier, vault, revision, ciphertext (with its wrapped item key), size, timestamps, deletion marker                                                           |
| Manifest       | The vault manifest head and its authentication value (provisional, section 14)                                                                                        |
| Device         | Device identifier, name, platform, first and last seen, revoked                                                                                                       |
| Session        | A hash of the session token, the device, creation and expiry                                                                                                          |
| Security event | Event type, time, device, network address (retention open)                                                                                                            |

The database is encrypted at rest as a second layer (`ARCHITECTURE.md` 2.11). What the server learns
is stated in `ARCHITECTURE.md` 2.2 and in threat-model risk AR-03.

**Unresolved.** Whether device names, which users type, are encrypted like other user-entered fields
(principle 5) while notifications still identify devices; the sign-in identifier (an email address
or something else); which addresses are stored and for how long; backup encryption and location.

## 13. Synchronisation and conflict handling

**Proposal (planned, `ARCHITECTURE.md` 2.6).** The server is the source of truth for ciphertext.
Each item has a server-assigned revision. Clients keep an encrypted local copy and fetch changes
since the last revision they saw. A write names the revision it was based on; if the item has
changed since, the server refuses and the client resolves the conflict, never silently discarding
either version. Deletions are recorded so that an offline device does not bring an item back. The
local copy holds ciphertext only.

**Unresolved.** How conflicts are shown to the user (keep both versions, or ask); how long deletion
markers are kept; how this interacts with the manifest (section 14).

## 14. Malicious server and rollback

**Threats.** A server can serve old data, withhold items, show different states to different
devices, or offer weaker parameters (threat model 8.1).

**Measures.**

- Context binding (section 10.2) stops moving ciphertext around.
- Client-enforced minimums and no fallback stop downgrades (sections 7 and 10.4).
- **Provisional:** a hash-chained vault manifest. Each change appends an entry naming the items and
  revisions it affects; the chain head is authenticated with HMAC under a key derived from the
  account key; every device checks that the chain continues from the head it last saw. A device can
  then detect rollback relative to its own last view. This is a Zavolt design with no published
  analysis; **it needs formal analysis before it is relied on** (`ARCHITECTURE.md` 2.16).

**Limits.** Detection, not prevention. A server can still show two devices different histories (a
fork) and is only caught if the devices compare what they saw (threat-model AR-09). Concurrent
writes from several devices make the chain harder to maintain.

## 15. Recovery

**Owner commitment.** No recovery design will ever give Zavolt the ability to decrypt a vault
(`DECISIONS.md`, 16 November 2026). **Whether recovery is offered at all is undecided.**

**Proposal (planned in `ARCHITECTURE.md` 2.8, extended in 2.16).**

1. At sign-up the device generates a recovery key, `random(32)` (the length is a proposal), and
   shows it once in a form the user can write down. The encoding is open.
2. A recovery KEK is derived from it with HKDF and the label `zavolt/v1/recovery-kek`. It wraps the
   account key; the server stores that copy and cannot open it.
3. To recover, the user proves control of the account (email verification and rate limits). The
   account's other devices and its email address are notified, and a cooling-off period starts.
4. After the delay, the client downloads the recovery-wrapped account key and unwraps it locally. It
   proves knowledge of the account key to the server before any key is replaced. That proof is a
   Zavolt design to be specified.
5. The user sets a new master password: a new OPAQUE registration (Option A) or a new salt and
   verifier (Option B), and a new KEK wrap. A new recovery key is generated and shown, and the old
   one stops working.

**Why.** Only the user ever holds the secret that opens the recovery copy.

**Assumptions.** The user keeps the recovery key safe; the email account is reasonably secure
(AN-09, a weak assumption).

**Unresolved.** Whether to offer recovery; the key's length and encoding; the cooling-off period;
what happens to sessions and devices; resetting multi-factor authentication; support procedures;
phishing resistance. Without the master password, the recovery key or an unlocked device, the vault
is lost, and the product must say so before sign-up (`ARCHITECTURE.md` 2.8).

## 16. Devices: registration and revocation

**Proposal.** Planned (`ARCHITECTURE.md` 2.9): each device registers with an identifier, a name the
user can recognise and its platform; sessions belong to devices; the user can see and revoke every
device; a sign-in from a new device is reported to the others.

Provisional (2.16): devices enrol by signing in (approval from another device is deferred).
Revocation has three levels:

| Level                    | What happens                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Remove                   | The device's sessions end.                                                                                                     |
| Remove and secure        | As above, and the account and vault keys are rotated and re-wrapped (section 17).                                              |
| Full compromise response | As above, every item is re-encrypted under new item keys, and the user is advised to change the passwords stored in the vault. |

**Limit.** A device keeps whatever it had already decrypted (threat-model AR-07).

**Unresolved.** Whether devices get key pairs (needed later for device approval or sharing); how
notifications are delivered; how fast revocation must take effect.

## 17. Key rotation

| Event                             | Proposed action                                                                                       | Source                       |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------- |
| Master password change            | New OPAQUE registration or new salt and verifier; the account key is re-wrapped; done atomically      | 2.7                          |
| Stronger derivation parameters    | Applied at the next sign-in, the same way as a password change                                        | 2.7                          |
| Suspected exposure of a vault key | New vault key **and new item keys**, every item re-encrypted, user advised to change stored passwords | 2.16 (2.7 said re-wrap only) |
| Item edited                       | A new item key for the new version                                                                    | 2.7, 2.16                    |
| Key usage cap reached             | The key is replaced and the keys it wraps re-wrapped                                                  | Section 10.1                 |
| Recovery used                     | A new recovery key                                                                                    | Section 15                   |
| Algorithm retired                 | Items re-encrypted in the new format on next access; old formats then refused                         | 2.7                          |
| Server OPAQUE keys rotated        | The AKE key pair can be rotated; rotating the OPRF seed forces every user to re-register              | Open                         |

**Unresolved.** Making each rotation atomic and resumable after a crash, so that no data is left
readable only under a retired key without a record of it.

## 18. Sessions, vault locking and memory handling

### 18.1 Sessions

Planned (`ARCHITECTURE.md` 2.5): short-lived, revocable sessions. In the web application a cookie
with the `__Host-` prefix, `Secure`, `HttpOnly` and `SameSite=Strict`, an API on the same origin,
and `Origin` checks on state-changing requests. A session never decrypts anything (handoff section
8). Token storage in the extension and the desktop application is open; binding tokens to devices is
deferred.

### 18.2 States

Three states (handoff section 8): signed out; signed in and locked; unlocked. Locking discards keys
from memory and leaves the session alone. Only the unlocked state holds decryption keys.

### 18.3 Memory

Keys live in memory only; reloading the page loses them, which is why the web application never
reloads during navigation. Where the platform allows, keys are kept as non-extractable Web Crypto
keys, so script can use them but cannot export them. Two limits: key material passes through
ordinary memory before it is imported (Argon2id runs in WebAssembly; HKDF output is imported), and
JavaScript cannot guarantee that memory is erased (`ARCHITECTURE.md` 2.7; threat-model AR-06).
Buffers are overwritten after use as a best effort only. Automatic locking after inactivity and on
device events is planned; the delays are product decisions.

### 18.4 Browser extension (provisional)

A Manifest V3 service worker is stopped when idle, so keys cannot simply live in its memory. The
proposal keeps them in `storage.session` sealed under a non-extractable wrapping key. Chrome's
documentation says session storage "holds data in memory while an extension is loaded", is cleared
when the extension is disabled, reloaded or updated and when the browser restarts, is not exposed to
content scripts by default, and is limited to 10 MB. This is a Zavolt design that **needs an
exception to `SECURITY.md` rule 4**, an owner decision, and analysis. Firefox's behaviour has not
been reviewed for this draft.

### 18.5 Desktop application

Device secrets in the operating system's credential store; the clipboard cleared a short time after
a copy; no secrets in logs or crash reports (`ARCHITECTURE.md` 2.10).

## 19. Versioning and migration

Every stored structure carries its version: the protocol version, the encryption format, the
algorithm, the key-derivation parameter set, the password-preparation version, the OPAQUE profile
and context, the manifest version and the item schema version.

- Clients refuse versions they do not know and versions below their built-in minimums. Minimums are
  raised by shipping new clients, never by instructions from the server (threat T-S-04).
- Upgrades re-wrap or re-encrypt lazily when data is next used, and record progress, so that an
  interrupted migration can resume.
- If the authentication decision changes later (for example from Option B to Option A), users move
  at their next sign-in.

**Unresolved.** How long old versions remain readable; what happens to a device that runs an old
client for a long time.

## 20. Error handling and state transitions

- Sign-in failures look the same whether the account is unknown or the password is wrong.
- Decryption failures produce one generic error. No plaintext is released before the tag is
  verified.
- Errors and logs never contain passwords, keys, tokens, verifiers or plaintext (`SECURITY.md` rule
  2).

| From                | Event                                    | To                | Keys in memory afterwards        |
| ------------------- | ---------------------------------------- | ----------------- | -------------------------------- |
| Signed out          | Successful sign-in                       | Signed in, locked | None                             |
| Signed in, locked   | Correct master password                  | Unlocked          | KEK, account, vault, item keys   |
| Unlocked            | Lock, inactivity, device event           | Signed in, locked | None                             |
| Any signed-in state | Sign-out, session expiry, device revoked | Signed out        | None                             |
| Signed in, locked   | Recovery completed (section 15)          | Unlocked          | New keys                         |
| Unlocked            | Password change or rotation (section 17) | Unlocked          | New keys, after an atomic switch |

Security-sensitive transitions (password change, recovery, revocation, rotation) must be atomic or
resumable, and must not leave the account readable only under keys the user no longer holds.

## 21. Security assumptions

The threat model's assumptions AN-01 to AN-10 apply. In addition:

- The primitives in section 4 are secure as published, and the chosen libraries implement them
  correctly, which the published vectors check.
- The labels of section 3 are distinct for every purpose.
- The canonical encoding of section 10.2 is identical in every client.

## 22. Unresolved design questions

| ID    | Question                                                                                        | Section |
| ----- | ----------------------------------------------------------------------------------------------- | ------- |
| PQ-01 | OPAQUE or a derived authentication key; the library survey                                      | 8       |
| PQ-02 | Argon2id parameters and the profile that departs from RFC 9106's and RFC 9807's recommendations | 7       |
| PQ-03 | Whether a device-held secret is mixed into key derivation                                       | 7       |
| PQ-04 | OpaqueString handling of Unicode versions, and the minimum master-password length               | 6       |
| PQ-05 | AES-256-GCM, XChaCha20-Poly1305 or both; the per-key usage cap                                  | 10.1    |
| PQ-06 | Whether key commitment is needed, and its construction                                          | 10.3    |
| PQ-07 | COSE_Encrypt0 or a custom framing; the canonical encoding of the context                        | 10.4    |
| PQ-08 | Item key per version or per item; number of vaults                                              | 9       |
| PQ-09 | The manifest design and its formal analysis                                                     | 14      |
| PQ-10 | Whether recovery is offered; its key format, delays and proofs                                  | 15      |
| PQ-11 | Device key pairs; revocation timing                                                             | 16      |
| PQ-12 | Extension key storage and the exception to `SECURITY.md` rule 4                                 | 18.4    |
| PQ-13 | Token storage in the extension and desktop application                                          | 18.1    |
| PQ-14 | Whether device names are encrypted                                                              | 12      |
| PQ-15 | Rotation of the server's OPAQUE keys                                                            | 17      |
| PQ-16 | Atomic, resumable rotation and migration                                                        | 17, 19  |
| PQ-17 | Conflict presentation and how long deletion markers are kept                                    | 13      |
| PQ-18 | Item types and how many old versions are kept                                                   | 11      |

## 23. Decision status

**Approved by the owner** (`DECISIONS.md`): zero-knowledge encryption as the architecture; the
cryptographic direction (Argon2id, AES-256-GCM or XChaCha20-Poly1305, HKDF, envelope encryption,
versioned keys) as a direction, not a protocol; recovery that never lets Zavolt decrypt; no
advertising or tracking code; the review process, the evidence gate and the independent audit before
public release.

**Everything else in this document is provisional or open.** Being written here approves nothing:
only the owner's approval of the design, after the internal review, does (`SECURITY.md`, approval
sequence, step 3).

## 24. References

All were read from the official publisher on 21 November 2026 unless marked otherwise.

- RFC 9807, _The OPAQUE Augmented Password-Authenticated Key Exchange (aPAKE) Protocol_, IRTF,
  Informational, July 2025: sections 6.3.2.2, 7, 10.4, 10.9 and Appendix C.
  <https://www.rfc-editor.org/rfc/rfc9807>
- RFC 9497, _Oblivious Pseudorandom Functions (OPRFs) Using Prime-Order Groups_, IRTF,
  Informational, December 2023. <https://www.rfc-editor.org/rfc/rfc9497>
- RFC 9496, _The ristretto255 and decaf448 Groups_. <https://www.rfc-editor.org/rfc/rfc9496>
- RFC 9106, _Argon2 Memory-Hard Function for Password Hashing and Proof-of-Work Applications_, IRTF,
  Informational, September 2021: sections 4 and 5. <https://www.rfc-editor.org/rfc/rfc9106>
- RFC 5869, _HMAC-based Extract-and-Expand Key Derivation Function (HKDF)_, May 2010.
  <https://www.rfc-editor.org/rfc/rfc5869>
- RFC 4231, _Identifiers and Test Vectors for HMAC-SHA-224, HMAC-SHA-256, HMAC-SHA-384, and
  HMAC-SHA-512_. <https://www.rfc-editor.org/rfc/rfc4231>
- NIST SP 800-38D, _Galois/Counter Mode (GCM) and GMAC_, November 2007: section 8.3. NIST's page
  carries a planning note of 6 March 2024 announcing a revision.
  <https://csrc.nist.gov/pubs/sp/800/38/d/final>
- FIPS 197, _Advanced Encryption Standard_, published 26 November 2001, updated 9 May 2023.
  <https://csrc.nist.gov/pubs/fips/197/final>
- RFC 8439, _ChaCha20 and Poly1305 for IETF Protocols_, Informational, June 2018.
  <https://www.rfc-editor.org/rfc/rfc8439>
- draft-irtf-cfrg-xchacha-03, _XChaCha: eXtended-nonce ChaCha and AEAD_XChaCha20_Poly1305_: expired,
  IRTF state "Dead". <https://datatracker.ietf.org/doc/draft-irtf-cfrg-xchacha/>
- RFC 9052, _CBOR Object Signing and Encryption (COSE): Structures and Process_, Standards Track,
  STD 96, August 2022: sections 5.2, 5.3 and Appendix C.4. <https://www.rfc-editor.org/rfc/rfc9052>
- RFC 9053, _COSE: Initial Algorithms_: section 4.1. <https://www.rfc-editor.org/rfc/rfc9053>
- RFC 8265, _Preparation, Enforcement, and Comparison of Internationalized Strings Representing
  Usernames and Passwords_, Standards Track, October 2017: section 4.2.
  <https://www.rfc-editor.org/rfc/rfc8265>
- Unicode Standard Annex #15, _Unicode Normalization Forms_, revision 58 (Unicode 18.0.0).
  <https://www.unicode.org/reports/tr15/>
- NIST SP 800-63B-4, _Digital Identity Guidelines: Authentication and Authenticator Management_,
  August 2025: password length, blocklists and NFC. <https://pages.nist.gov/800-63-4/sp800-63b.html>
- W3C, _Web Cryptography Level 2_ (Working Draft): `getRandomValues`, non-extractable keys, AES-GCM.
  <https://www.w3.org/TR/webcrypto-2/>
- W3C, _Content Security Policy Level 3_: `'wasm-unsafe-eval'`. <https://www.w3.org/TR/CSP3/>
- Chrome for Developers, `chrome.storage` (session storage area).
  <https://developer.chrome.com/docs/extensions/reference/api/storage>
- Not reviewed for this draft: RFC 8264 (PRECIS framework) and RFC 2104 (HMAC), which the documents
  above cite.

## 25. Change log

| Version | Date             | Change                   |
| ------- | ---------------- | ------------------------ |
| 0.1     | 22 November 2026 | First draft, for review. |
