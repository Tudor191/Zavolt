# Zavolt test-vector plan

> **Status: draft 0.1, 22 November 2026. Not reviewed, not approved.** This is the third of the four
> deliverables of the evidence gate in
> [SECURITY.md](../../SECURITY.md#evidence-gate-for-cryptographic-implementation). **No vector has
> been run.** No test harness exists, and no vector file has been added to the repository. The
> sources below were located and inspected on 21 November 2026; that is all.

## 1. Rules

1. **Expected values come only from their published source, exactly as published.** They are never
   invented, never produced by the implementation under test, and never adjusted to match an
   implementation.
2. **Every source is pinned**: its version, revision or commit, and the SHA-256 of the exact file
   used, recorded when the file is acquired. A checksum records which file was used; it tests
   nothing.
3. **Vectors are read from the pinned files by the test harness, not retyped.** Where the source is
   a document, such as an RFC, the values are extracted by a script, and the extraction is checked
   against the document in review.
4. **Every vector that applies to a chosen primitive runs in every required runtime** (section 6). A
   vector may be skipped only with a written reason and the owner's approval.
5. A vector its source marks invalid must be rejected. A vector marked acceptable is handled by a
   written policy.
6. **Where no authoritative vectors exist, this plan says so** (section 4). Other evidence is never
   presented as expected outputs.
7. Copying a vector file into the repository must respect its licence: Wycheproof is Apache-2.0; the
   Argon2 reference implementation is CC0 1.0 or Apache-2.0 at the user's option. The terms for
   copying RFC text and NIST files must be checked before either is copied.

## 2. What needs vectors

The primitives depend on decisions that are still open (`PROTOCOL.md` section 22), so each set says
when it applies.

| Component                   | Primitive or rule                      | Vector sets      | Applies                                                  |
| --------------------------- | -------------------------------------- | ---------------- | -------------------------------------------------------- |
| Key derivation              | Argon2id                               | V-01, V-02       | Always: Argon2id is the approved direction               |
| Key separation and wrapping | HKDF with SHA-256 and SHA-512          | V-03, V-04       | Always: HKDF is the approved direction                   |
| MAC (manifest, OPAQUE)      | HMAC with SHA-256 and SHA-512          | V-05, V-06       | If the manifest or OPAQUE is adopted                     |
| Encryption                  | AES-256-GCM                            | V-07, V-08       | If AES-256-GCM is chosen (the provisional proposal)      |
| Encryption                  | ChaCha20-Poly1305, XChaCha20-Poly1305  | V-09, V-10       | If one of them is chosen                                 |
| Authentication              | OPRF ristretto255-SHA512; ristretto255 | V-11, V-12       | If OPAQUE is chosen                                      |
| Authentication              | OPAQUE-3DH                             | V-13             | If OPAQUE is chosen                                      |
| Password preparation        | NFC and the OpaqueString profile       | V-14             | If the preparation of `PROTOCOL.md` section 6 is adopted |
| Framing                     | COSE_Encrypt0                          | V-15             | If COSE framing is chosen                                |
| Deferred features           | X25519, Ed25519, HPKE                  | V-16, V-17, V-18 | Only if sharing, device keys or signatures are adopted   |

## 3. Sources

Each entry records the six things the evidence gate asks for: the source and its version, the
purpose, the inputs and outputs, the component that must pass, how results are reproduced, and the
runtimes. Section 6 defines the runtime set "all required runtimes".

### V-01 RFC 9106: Argon2id

- **Source and version:** RFC 9106, section 5.3 (Argon2id); sections 5.1 and 5.2 hold the Argon2d
  and Argon2i vectors. IRTF, Informational, September 2021.
  <https://www.rfc-editor.org/rfc/rfc9106.txt>
- **Purpose:** show that the Argon2id implementation, version 0x13 (19), produces the specified tag.
- **Inputs:** a password of 32 bytes (each 0x01), a salt of 16 bytes (each 0x02), a secret of 8
  bytes (each 0x03), associated data of 12 bytes (each 0x04); 32 KiB of memory, 3 passes, 4 lanes, a
  32-byte tag. **Outputs:** the tag; the RFC also prints the pre-hashing digest and memory blocks
  after each pass, which help locate a fault.
- **Must pass:** the client core's Argon2id in every client, and the server's, if the server hashes
  with Argon2id in the derived-key alternative (`PROTOCOL.md` 8.3).
- **Reproduction:** extract the inputs and tag from the pinned RFC text with a script; run; compare
  the tag byte for byte.
- **Runtimes:** all required runtimes.
- **Note:** the vector uses the optional secret and associated-data inputs. A library that does not
  expose them cannot run it, and that gap must be recorded; V-02 then supplies cases without them.

### V-02 The Argon2 reference implementation

- **Source and version:** the designers' reference implementation, `P-H-C/phc-winner-argon2`, commit
  `f57e61e19229e23c4445b85494dbf7c07de721cb` (25 June 2021), licensed CC0 1.0 or Apache-2.0.
  - `kats/argon2id`, with `kats/argon2id.shasum`: the same parameter set as V-01, with every
    intermediate value.
  - `src/test.c`: 26 `hashtest` cases for Argon2i and Argon2id with ASCII passwords and salts and a
    range of memory, pass and lane settings, each with the expected tag in hexadecimal and in the
    encoded string format.
- **Purpose:** cases without the secret and associated data, and larger memory settings.
- **Inputs:** version, passes, memory, lanes, password, salt. **Outputs:** the tag, and the encoded
  string.
- **Must pass:** as V-01.
- **Reproduction:** read the cases from the pinned files; compare tags, and encoded strings only if
  the library produces that format.
- **Runtimes:** all required runtimes.
- **Standing:** published by the algorithm's designers, not by a standards body; secondary to V-01.

### V-03 RFC 5869: HKDF

- **Source and version:** RFC 5869, Appendix A, May 2010. Test cases A.1 to A.3 use SHA-256; A.4 to
  A.7 use SHA-1. <https://www.rfc-editor.org/rfc/rfc5869.txt>
- **Purpose:** HKDF extract and expand.
- **Inputs:** hash, IKM, salt, info, L. **Outputs:** PRK and OKM.
- **Must pass:** the client core's HKDF wherever keys are derived; the server, if it derives keys.
- **Reproduction:** scripted extraction; compare OKM, and PRK where the API exposes it. The Web
  Cryptography API performs extract and expand in one call, so there PRK cannot be compared.
- **Runtimes:** all required runtimes.
- **Note:** RFC 5869 has no SHA-512 case. HKDF-SHA-512, used by the proposed OPAQUE configuration,
  relies on V-04. The SHA-1 cases apply only if SHA-1 is ever used; it is not proposed.

### V-04 Wycheproof: HKDF

- **Source and version:** Project Wycheproof, `C2SP/wycheproof`, commit
  `65ca494727a52944c204441c860b039e6786b99b` (11 November 2026), Apache-2.0:
  `testvectors_v1/hkdf_sha256_test.json` (86 tests) and `testvectors_v1/hkdf_sha512_test.json`.
- **Purpose:** edge cases, flagged in the file as `EmptySalt`, `MaximalOutputSize`, `Normal`,
  `OutputCollision` and `SizeTooLarge`.
- **Inputs:** `ikm`, `salt`, `info`, `size`. **Outputs:** `okm`, and a `result` of valid or invalid
  (an oversized output must fail).
- **Must pass, reproduction, runtimes:** as V-03, reading the JSON against its schema
  (`hkdf_test_schema_v1.json`).

### V-05 RFC 4231: HMAC with SHA-2

- **Source and version:** RFC 4231, sections 4.2 to 4.8: seven test cases for HMAC-SHA-224, -256,
  -384 and -512. Test case 5 truncates the output to 128 bits.
  <https://www.rfc-editor.org/rfc/rfc4231.txt>
- **Purpose:** HMAC correctness.
- **Inputs:** key and data. **Outputs:** the MAC for each hash.
- **Must pass:** the client core's HMAC (the manifest of `PROTOCOL.md` section 14) and the OPAQUE
  library's.
- **Reproduction:** scripted extraction; compare.
- **Runtimes:** all required runtimes.

### V-06 Wycheproof: HMAC

- **Source and version:** as V-04: `hmac_sha256_test.json` (174 tests) and `hmac_sha512_test.json`.
- **Purpose:** edge cases, including truncated and modified tags that must be rejected.
- **Inputs:** `key`, `msg`. **Outputs:** `tag`, `result`.
- **Must pass, reproduction, runtimes:** as V-05, reading the JSON against
  `mac_test_schema_v1.json`.

### V-07 NIST CAVP: AES-GCM

- **Source and version:** NIST Cryptographic Algorithm Validation Program, "Block Cipher Modes"
  page, `gcmtestvectors.zip` (CAVS 14.0, files generated on 31 August 2012), with its description in
  `gcmvs.pdf`. The archive holds `gcmEncryptExtIV128.rsp`, `gcmEncryptExtIV192.rsp`,
  `gcmEncryptExtIV256.rsp`, `gcmDecrypt128.rsp`, `gcmDecrypt192.rsp` and `gcmDecrypt256.rsp`.
  `gcmDecrypt256.rsp` alone has 7,875 cases, 3,919 of them marked `FAIL`. NIST's page also points to
  its newer automated testing service (ACVTS); this archive is the published static set.
  <https://csrc.nist.gov/projects/cryptographic-algorithm-validation-program/cavp-testing-block-cipher-modes>
- **Purpose:** AES-GCM encryption and decryption, including authentication failures.
- **Inputs and outputs:** encryption: key, IV, plaintext, AAD → ciphertext, tag. Decryption: key,
  IV, ciphertext, AAD, tag → plaintext or `FAIL`. Cases are grouped by key, IV, plaintext, AAD and
  tag lengths.
- **Must pass:** the client core's AES-256-GCM. Zavolt's format would use only 256-bit keys, 96-bit
  IVs and 128-bit tags, so those groups are mandatory. Other lengths are run against the primitive
  only where the platform supports them.
- **Reproduction:** parse the `.rsp` files; encrypt and decrypt; compare. Every `FAIL` case must
  throw.
- **Runtimes:** all required runtimes.

### V-08 Wycheproof: AES-GCM

- **Source and version:** as V-04: `aes_gcm_test.json`, 316 tests in 45 groups, of which 66 use a
  256-bit key, a 96-bit IV and a 128-bit tag. Flags: `CounterWrap`, `Ktv`, `LongIv`, `ModifiedTag`,
  `Pseudorandom`, `SmallIv`, `SpecialCase`, `ZeroLengthIv`.
- **Purpose:** edge cases such as modified tags, counter wrap-around and unusual IV lengths.
- **Inputs:** `key`, `iv`, `aad`, `msg`. **Outputs:** `ct`, `tag`, `result` (valid or invalid).
- **Must pass:** as V-07. Valid cases must match exactly; invalid cases must be rejected. Zavolt's
  format layer must also refuse every IV that is not 96 bits.
- **Reproduction:** read the JSON against `aead_test_schema_v1.json`.
- **Runtimes:** all required runtimes.

### V-09 RFC 8439: ChaCha20-Poly1305 (only if chosen)

- **Source and version:** RFC 8439, Informational, June 2018: section 2.8.2 (AEAD example and test
  vector) and Appendix A.5 (AEAD decryption), with the building-block vectors of sections 2.1.1 to
  2.6.2. <https://www.rfc-editor.org/rfc/rfc8439.txt>
- **Purpose:** the AEAD construction that XChaCha20-Poly1305 also builds on.
- **Inputs:** key, nonce, AAD, plaintext. **Outputs:** ciphertext and tag.
- **Must pass, reproduction, runtimes:** the chosen library; scripted extraction; all required
  runtimes.

### V-10 Wycheproof: ChaCha20-Poly1305 and XChaCha20-Poly1305 (only if chosen)

- **Source and version:** as V-04: `chacha20_poly1305_test.json` (325 tests) and
  `xchacha20_poly1305_test.json` (315 tests).
- **Purpose:** edge cases for both AEADs. XChaCha20-Poly1305 has no RFC (`PROTOCOL.md` section 4),
  so these are the main independent vectors for it.
- **Inputs, outputs, reproduction, runtimes:** as V-08.

### V-11 RFC 9497: OPRF (only if OPAQUE is chosen)

- **Source and version:** RFC 9497, Appendix A, IRTF, Informational, December 2023. It covers
  ristretto255-SHA512 (A.1), decaf448-SHAKE256 (A.2), P256-SHA256 (A.3), P384-SHA384 (A.4) and
  P521-SHA512 (A.5), each in OPRF, VOPRF and POPRF modes.
  <https://www.rfc-editor.org/rfc/rfc9497.txt>
- **Purpose:** the OPRF inside OPAQUE. RFC 9807 uses the OPRF mode, so A.1.1 (OPRF mode,
  ristretto255-SHA512) is mandatory for the proposed configuration.
- **Inputs:** `Seed`, `KeyInfo` and `skSm` for the suite; per vector, `Input` and `Blind`.
  **Outputs:** `BlindedElement`, `EvaluationElement`, `Output`.
- **Must pass:** the OPAQUE library on the clients and the server.
- **Reproduction:** scripted extraction; the library's test interface must accept a fixed blind.
- **Runtimes:** all required runtimes, and the server runtime.

### V-12 RFC 9496: ristretto255 (only if OPAQUE is chosen)

- **Source and version:** RFC 9496, Appendix A: multiples of the generator (A.1), invalid encodings
  that must be rejected (A.2), group elements from uniform byte strings (A.3), and square roots of a
  ratio of field elements (A.4). Wycheproof also has `ristretto255_scalar_invert_test.json`.
  <https://www.rfc-editor.org/rfc/rfc9496.txt>
- **Purpose:** the group arithmetic and encoding checks under the OPRF.
- **Must pass, reproduction, runtimes:** as V-11.

### V-13 RFC 9807: OPAQUE-3DH (only if OPAQUE is chosen)

- **Source and version:** RFC 9807, Appendix C, IRTF, Informational, July 2025: real vectors C.1.1
  to C.1.6 and fake (unknown-user) vectors C.2.1 to C.2.3.
  <https://www.rfc-editor.org/rfc/rfc9807.txt>

  | Vectors             | OPRF                | KDF, MAC, hash                   | Group        |
  | ------------------- | ------------------- | -------------------------------- | ------------ |
  | C.1.1, C.1.2, C.2.1 | ristretto255-SHA512 | HKDF-SHA512, HMAC-SHA512, SHA512 | ristretto255 |
  | C.1.3, C.1.4, C.2.2 | ristretto255-SHA512 | HKDF-SHA512, HMAC-SHA512, SHA512 | curve25519   |
  | C.1.5, C.1.6, C.2.3 | P256-SHA256         | HKDF-SHA256, HMAC-SHA256, SHA256 | P-256        |

  Every vector uses the **Identity** key-stretching function and the context string `OPAQUE-POC`.

- **Purpose:** registration and the authenticated key exchange, and the simulated responses for
  unknown users. C.1.1, C.1.2 and C.2.1 match the proposed configuration except for the
  key-stretching function.
- **Inputs:** the configuration and protocol inputs; the fake vectors add `masking_key`,
  `client_private_key` and `client_public_key`, as RFC 9807 section 6.3.2.2 describes. **Outputs:**
  intermediate values and protocol outputs, as listed in each vector.
- **Must pass:** the OPAQUE library on the clients and the server, run in a test mode that uses the
  Identity function.
- **Reproduction:** scripted extraction; fixed randomness through the library's test interface.
- **Runtimes:** all required runtimes, and the server runtime.
- **Gap:** no published vector covers OPAQUE with Argon2id. See section 4.

### V-14 Unicode normalisation and password preparation

- **Source and version:** `NormalizationTest-18.0.0.txt` (Unicode 18.0.0, dated 24 June 2026),
  <https://www.unicode.org/Public/18.0.0/ucd/NormalizationTest.txt>, and UAX #15 revision 58, whose
  conformance section says an implementation must be able to produce the results of that file.
  Earlier versions are under `https://www.unicode.org/Public/<version>/ucd/`.
- **Purpose:** show that each runtime's NFC (for example `String.prototype.normalize('NFC')`) agrees
  with Unicode.
- **Inputs and outputs:** each line holds five columns, `c1` to `c5`. The file's header states the
  invariants; for NFC: `c2 == toNFC(c1) == toNFC(c2) == toNFC(c3)` and
  `c4 == toNFC(c4) == toNFC(c5)`.
- **Must pass:** the password preparation of `PROTOCOL.md` section 6 in every client runtime.
- **Reproduction:** run the file through each runtime and record that runtime's Unicode version. A
  runtime with an older Unicode version is tested against the file of its own version; how Zavolt
  treats characters a runtime does not know is open (`PROTOCOL.md`, PQ-04).
- **Runtimes:** all required client runtimes.
- **The full preparation has no published vectors.** RFC 8265 contains none. Cases for the whole
  OpaqueString preparation (mapping every non-ASCII space, meaning every code point of general
  category "Zs" except U+0020, to U+0020, then NFC) can be **derived mechanically from Unicode's own
  data files** of the same version, by a reviewed script, never from Zavolt's implementation. They
  are labelled "derived", not "published".

### V-15 COSE (only if COSE framing is chosen)

- **Source and version:** RFC 9052, Appendix C.4 ("Examples of Encrypted Messages": C.4.1, a simple
  encrypted message, and C.4.2, with a partial IV), and the working group's examples repository that
  RFC 9052 references (`github.com/cose-wg/Examples`), which has not been reviewed for this draft.
  <https://www.rfc-editor.org/rfc/rfc9052.txt>
- **Purpose:** the `Enc_structure` used as associated data, and the encoding of COSE_Encrypt0.
- **Must pass:** the client core's framing.
- **Note:** which algorithms the examples use must be checked when they are acquired; examples in an
  RFC appendix illustrate the format and are not a conformance suite.

### V-16 to V-18 Deferred features

| ID   | Primitive | Sources                                                                                                                                                         |
| ---- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| V-16 | X25519    | RFC 7748, sections 5.2 and 6.1; Wycheproof `x25519_test.json` (518 tests, results valid or acceptable)                                                          |
| V-17 | Ed25519   | RFC 8032, section 7.1; Wycheproof `ed25519_test.json` (210 tests)                                                                                               |
| V-18 | HPKE      | RFC 9180, Appendix A, and the JSON file it cites at commit `5f503c564da00b0687b3de75f1dfbdfc4079ad31` of `cfrg/draft-irtf-cfrg-hpke`; Wycheproof `hpke_*` files |

These apply only if sharing, device key pairs or signatures are adopted. Each would get a full entry
like those above at that time.

## 4. Where no authoritative vectors exist

No published source gives expected outputs for these parts of the proposed protocol:

- OPAQUE with Argon2id as its key-stretching function (Zavolt's profile).
- Zavolt's HKDF labels and the key hierarchy as a whole.
- The encoding of the context bound to each ciphertext (`PROTOCOL.md` 10.2), beyond what RFC 9052's
  examples show.
- The key commitment value, the vault manifest, the recovery proof and the extension's sealed
  storage, if adopted.
- The complete password preparation, except as derived from Unicode data (V-14).

For these, the evidence is of other kinds, and none of it is presented as expected outputs:

1. Vectors for every primitive the composition uses (section 3).
2. Round-trip, negative and malicious-input tests from `SECURITY_TEST_PLAN.md`.
3. Differential tests against an independent implementation, labelled non-authoritative: agreement
   shows consistency; disagreement is investigated; neither defines what is correct.
4. If the composition becomes stable, Zavolt may publish its own vectors, produced by an independent
   implementation and reviewed, and labelled as Zavolt's own.
5. Analysis, and the independent external audit before release.

## 5. Running the vectors

**Planned. None of this exists.** Writing it is an implementation stage that needs the owner's
approval.

- **Acquisition.** A script downloads each source at its pinned version and records the URL, the
  version or commit, the date, the SHA-256 and the licence in a manifest. The files are either kept
  with the client core's tests or fetched at test time and checked against the manifest.
- **Harness.** Data-driven tests read the pinned files, one test per vector, named after its source
  and case.
- **Commands.** Names to be decided with the client core, for example a `test:vectors` script for
  Node.js and a Playwright project for browsers. **These do not exist.**
- **Continuous integration.** Every pull request that touches the client core runs the full set.
- **Evidence kept.** The test report; the commit; the runtime versions, including each runtime's
  Unicode version; and the manifest with its checksums. These are kept for the independent audit.

## 6. Runtimes that must pass

The supported browsers and platforms are an open decision (`DECISIONS.md`), so this list is a
proposal.

| Runtime                                                 | Why                                         | Today                               |
| ------------------------------------------------------- | ------------------------------------------- | ----------------------------------- |
| Node.js 24 (`.nvmrc`)                                   | Unit tests of the client core; tooling      | Used by CI                          |
| Chromium, through Playwright                            | Web application; Chrome extension engine    | Used by CI for the end-to-end tests |
| Firefox, through Playwright, and the released browser   | Web application and extension, if supported | Not tested                          |
| WebKit, through Playwright, and Safari on macOS and iOS | Web application, if supported               | Not tested                          |
| Chrome extension service worker (Manifest V3)           | Extension                                   | Does not exist                      |
| Desktop shell (provisionally Electron)                  | Desktop application                         | Not chosen                          |
| Server runtime                                          | Server-side OPAQUE or verifier hashing      | Not chosen                          |

Playwright's browser builds approximate the released browsers. Before any release, the vectors also
run on real devices.

## 7. Acceptance and evidence

- Every applicable valid vector matches exactly. Every invalid vector is rejected. Acceptable
  vectors follow a written policy. No vector is skipped without a recorded, approved reason.
- Any failure blocks the merge of the client core.
- A passing result is reported only for a run that happened, with its evidence (section 5). A
  planned run is never reported as passed.

## 8. Current status

- No vector has been run. No harness exists. No vector file is in the repository.
- Pins observed on 21 November 2026, to be confirmed at acquisition: Wycheproof commit `65ca4947…`;
  Argon2 reference commit `f57e61e1…`; the HPKE JSON commit cited by RFC 9180; Unicode 18.0.0's
  `NormalizationTest.txt`; NIST's `gcmtestvectors.zip` with the six files listed in V-07.
- No checksum has been recorded yet.

## 9. References

All were read from the publisher on 21 November 2026.

- RFC 9106, 5869, 4231, 8439, 9497, 9496, 9807, 9052, 7748, 8032, 9180 and 8265, from
  <https://www.rfc-editor.org/>.
- NIST CAVP, Block Cipher Modes test vectors:
  <https://csrc.nist.gov/projects/cryptographic-algorithm-validation-program/cavp-testing-block-cipher-modes>
- Project Wycheproof: <https://github.com/C2SP/wycheproof>, commit
  `65ca494727a52944c204441c860b039e6786b99b`.
- Argon2 reference implementation: <https://github.com/P-H-C/phc-winner-argon2>, commit
  `f57e61e19229e23c4445b85494dbf7c07de721cb`.
- Unicode 18.0.0 `NormalizationTest.txt` and UAX #15 revision 58:
  <https://www.unicode.org/reports/tr15/>.

## 10. Change log

| Version | Date             | Change                   |
| ------- | ---------------- | ------------------------ |
| 0.1     | 22 November 2026 | First draft, for review. |
