# Zavolt security-test plan

> **Status: draft 0.1, 22 November 2026. Not reviewed, not approved.** This is the fourth of the
> four deliverables of the evidence gate in
> [SECURITY.md](../../SECURITY.md#evidence-gate-for-cryptographic-implementation). **No test in
> section 5 has run, and none can run yet**: they need software that does not exist. Section 4 lists
> the few tests that are possible on the repository as it is today, and says exactly which have run.

## 1. How each test is described

Every test has an identifier (`ST-<area>-<number>`) and gives:

- **Needs:** what must exist before it can run.
- **Procedure:** the command or the steps.
- **Expected:** the result that counts as a pass.
- **Environment:** one of the environments in section 2.
- **Evidence:** what is kept (section 3).

The threat scenarios these tests answer are in [THREAT_MODEL.md](./THREAT_MODEL.md), the design they
test is in [PROTOCOL.md](./PROTOCOL.md), and the published vectors they use are in
[TEST_VECTOR_PLAN.md](./TEST_VECTOR_PLAN.md).

**A planned test is never reported as passed.** Only a test that has run, with its evidence kept, is
reported, and only with the result it produced.

## 2. Environments

| ID         | Environment                                                                                                       | Exists today |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | ------------ |
| E-CI       | GitHub Actions on `ubuntu-24.04`, Node.js from `.nvmrc`, as in `.github/workflows/ci.yml`                         | Yes          |
| E-LOCAL    | A developer machine with Node.js 24 and Playwright's browsers                                                     | Yes          |
| E-BROWSERS | Playwright's Chromium, Firefox and WebKit. CI installs Chromium only today.                                       | Partly       |
| E-STAGING  | A test deployment of the backend holding test data only                                                           | No           |
| E-HOSTILE  | A malicious-server test double: implements the API and lets a test change, replay, withhold or forge any response | No           |
| E-DEVICES  | Real devices and released browsers, for checks Playwright cannot make                                             | No           |
| E-HOST     | The production host                                                                                               | No           |

## 3. Evidence to keep

For every run: the test report; the commit; the versions of Node.js, browsers, the desktop shell and
the server; the vector manifest with checksums (`TEST_VECTOR_PLAN.md` section 5); and, for failures,
logs and traces. CI keeps them as artefacts. They are kept at least until the independent external
audit has finished; the exact retention period is open.

Canary values (section 5.12) are fake secrets created for a test. Real credentials are never used in
any test.

## 4. Tests possible today

These need no Zavolt cryptography. Any **new** test code still follows the code workflow: a feature
branch, a pull request, and the owner's approval (`SECURITY.md` rule 10).

### ST-NOW-01 No cookies or browser storage on the public website

- **Needs:** nothing new.
- **Procedure:** `npm run build`, then `npm run preview`. In Chromium, open every address in
  `README.md` (sixteen, including the old `.html` addresses and an unknown one), waiting out the
  three-second loader on application pages; follow the footer's links. Then read the context's
  cookies, `localStorage`, `sessionStorage`, `indexedDB.databases()`, `caches.keys()` and the
  service-worker registrations, and every `Set-Cookie` response header.
- **Expected:** all empty.
- **Environment:** E-LOCAL, or E-CI once automated; Firefox and WebKit when added.
- **Evidence:** the script's output, the commit and the browser version.
- **Status:** not automated. A one-off run of this procedure on 21 November 2026, from a script
  outside the repository, found every item empty (`../legal/COOKIE_ASSESSMENT.md`). That is an
  observation, not a passing automated test.

### ST-NOW-02 No requests to other origins

- **Needs and procedure:** as ST-NOW-01, recording the URL of every request.
- **Expected:** every request goes to the site's own origin.
- **Status:** not automated. The same one-off run recorded 118 requests, all to the site's origin.

### ST-NOW-03 The Content-Security-Policy is pinned and enforced

- **Procedure:** `npm run test:e2e`. `e2e/app.spec.ts` asserts the exact policy and that the browser
  blocks injected HTML, inline handlers and `eval`.
- **Expected:** the suite passes.
- **Environment:** E-CI.
- **Status:** exists. It passed in CI run 13 on commit `893cd42`, on 21 November 2026.

### ST-NOW-04 Lint bans on dangerous APIs

- **Procedure:** `npm run lint`. `.oxlintrc.json` bans HTML sinks, `eval`, `localStorage`,
  `sessionStorage`, `document.cookie` and `console` in application code.
- **Expected:** no errors.
- **Status:** exists. It passed in CI run 13.

### ST-NOW-05 Dependency audit and registry signatures

- **Procedure:** the CI `audit` job: `npm audit` for shipped code and for the toolchain at high
  severity, and `npm audit signatures`.
- **Expected:** no finding at the configured thresholds; every signature and attestation verifies.
- **Status:** exists. It passed in CI run 13.

### ST-NOW-06 No secrets in the repository's history

- **Procedure:** GitHub secret scanning on the repository, or a scan of `git log -p --all` for key,
  token and password patterns.
- **Expected:** no secret.
- **Status:** not run for the current history. The audit of the original site (`docs/AUDIT.md`)
  searched its nine commits on 15 November 2026.

### ST-NOW-07 Unicode normalisation in each runtime

- **Procedure:** run `NormalizationTest.txt` (`TEST_VECTOR_PLAN.md`, V-14) through
  `String.prototype.normalize('NFC')` in Node.js and in each browser; record each runtime's Unicode
  version.
- **Expected:** every NFC invariant holds for the runtime's own Unicode version.
- **Status:** not run. Needs a small harness.

### ST-NOW-08 Vector sources acquired and pinned

- **Procedure:** download every source in `TEST_VECTOR_PLAN.md` at its pinned version; record the
  checksums and licences in a manifest.
- **Expected:** every file matches its recorded pin.
- **Status:** not done.

### ST-HDR-01 Response headers from the host (needs hosting)

- **Procedure:** `curl -sI https://<host>/` and the same for a deep route such as `/app`.
- **Expected:** every header listed in `SECURITY.md` ("Response headers a host must send") is
  present with the stated value.
- **Environment:** E-HOST. **Status:** not possible; no hosting has been chosen.

## 5. Tests that need the implementation

Every test below needs software that does not exist. Implementation stages are numbered as in
`ARCHITECTURE.md` 2.14: the client core (2), the backend (3), the web application's accounts and
vault (4), synchronisation, devices and recovery (5), the extension and the desktop application (6).
**None of these tests has run.**

### 5.1 Incorrect passwords

**ST-PW-01 Wrong master password at unlock.** Needs: stages 2 and 4. Procedure: with a test account,
try to unlock with wrong passwords, the right password with one character changed, an empty string
and a very long string. Expected: each attempt fails with the one generic error; no key is kept;
attempts are counted; the right password still works. Environment: E-CI, E-BROWSERS. Evidence:
report, versions.

**ST-PW-02 Wrong password and unknown account look the same at sign-in.** Needs: stage 3. Procedure:
sign in with a wrong password for an existing account and with any password for a non-existent one;
repeat many times and compare responses and timings. Expected: identical responses; no statistically
significant timing difference; for OPAQUE, simulated responses as RFC 9807 section 6.3.2.2
specifies. Environment: E-STAGING. Evidence: response captures, timing statistics.

**ST-PW-03 Equivalent spellings of a password unlock.** Needs: stage 2. Procedure: register with a
password containing composed characters and non-ASCII spaces; unlock with canonically equivalent
spellings and with spellings that are not equivalent, using derived cases (`TEST_VECTOR_PLAN.md`,
V-14). Expected: equivalent spellings unlock, others do not. Environment: every client runtime.
Evidence: report with each runtime's Unicode version.

### 5.2 Incorrect keys

**ST-KEY-01 Decrypting with the wrong key.** Needs: stage 2. Procedure: decrypt items and wrapped
keys with another item's key, another vault's key and a random key. Expected: authentication failure
every time; no plaintext returned. Environment: E-CI, E-BROWSERS.

**ST-KEY-02 Wrong or retired key versions.** Needs: stage 2. Procedure: present ciphertext whose key
identifier or version does not match the key offered, or names a retired key. Expected: refused
before decryption is attempted.

**ST-KEY-03 Key commitment (only if adopted).** Needs: stage 2 and the construction of `PROTOCOL.md`
10.3. Procedure: present a ciphertext together with a key it was not produced under. Expected: the
commitment check fails before decryption.

### 5.3 Ciphertext tampering

**ST-TAMP-01 Published invalid vectors are rejected.** Needs: stage 2. Procedure: run every invalid
case of `TEST_VECTOR_PLAN.md` V-07 and V-08 (and V-10 if chosen). Expected: every one is rejected.

**ST-TAMP-02 Every byte of a Zavolt ciphertext is protected.** Needs: stage 2. Procedure: for
envelopes produced in the test, flip each bit of the header, IV, ciphertext and tag in turn; also
truncate and extend them. Expected: every variant is rejected with the generic error.

**ST-TAMP-03 Malformed encodings.** Needs: stage 2. Procedure: fuzz the envelope parser with random
and structured inputs, including oversized lengths and unknown fields. Expected: rejection without a
crash, hang or partial processing. Environment: E-CI, run for a fixed time per pull request.
Evidence: fuzzer statistics, any crashing inputs.

### 5.4 Authentication tag failures

**ST-TAG-01 Modified, zeroed and short tags.** Needs: stage 2. Procedure: replace the tag with
zeroes, change one bit, and shorten it. Expected: rejected; any tag that is not 128 bits is refused
by the format before the cipher is called.

**ST-TAG-02 No plaintext before verification.** Needs: stage 2. Procedure: inspect the decryption
interface and test it with failing inputs. Expected: no plaintext, partial or whole, is ever
returned or handed to a callback before the tag has been verified.

### 5.5 Record swapping and context manipulation

**ST-CTX-01 Moving ciphertext between items, fields, vaults or accounts.** Needs: stages 2 and 3.
Procedure: with E-HOSTILE, serve one item's ciphertext as another's, in another field, vault or
account. Expected: decryption fails because the associated data no longer matches (`PROTOCOL.md`
10.2).

**ST-CTX-02 Changing version, algorithm or key version.** Procedure: alter those header fields and
serve the result. Expected: refused; no fallback to another algorithm or version.

**ST-CTX-03 Swapping wrapped keys.** Procedure: serve one item's wrapped key with another item's
ciphertext. Expected: refused.

### 5.6 Replay and rollback

**ST-RB-01 An older item version is served.** Needs: stage 5 and the manifest, if adopted.
Procedure: with E-HOSTILE, return an earlier revision of an item a device has already seen.
Expected: the device detects it and warns, and does not overwrite its newer copy.

**ST-RB-02 An item is withheld.** Procedure: omit an item from sync responses. Expected: the
manifest check detects the missing item.

**ST-RB-03 A deleted item comes back.** Procedure: delete an item on one device; sync an offline
device that still has it. Expected: the deletion marker prevails; the item does not return.

**ST-RB-04 Replayed authentication messages and sessions.** Needs: stage 3. Procedure: replay
captured sign-in messages and a session token after sign-out. Expected: both refused.

### 5.7 Recovery abuse

**ST-REC-01 Recovery is limited, announced and delayed.** Needs: stage 5 and an owner decision to
offer recovery. Procedure: start recovery repeatedly; check limits, the notifications to other
devices and to the email address, and the cooling-off period. Expected: limits enforced;
notifications sent; nothing changes before the delay ends.

**ST-REC-02 Wrong recovery keys.** Procedure: try wrong and malformed recovery keys. Expected: no
key material is released; attempts are limited.

**ST-REC-03 Keys cannot be replaced without proof.** Procedure: try to replace the account's wrapped
keys during recovery without proving knowledge of the account key (`PROTOCOL.md` section 15, step
4). Expected: refused.

**ST-REC-04 After recovery.** Procedure: complete a recovery. Expected: the old recovery key and old
password no longer work, a new recovery key is issued, and sessions are handled as the design
specifies.

### 5.8 Device revocation

**ST-DEV-01 A revoked device loses access at once.** Needs: stage 5. Procedure: revoke a device and
use its session. Expected: every request refused.

**ST-DEV-02 "Remove and secure" rotates keys.** Procedure: revoke at the second level; then try to
decrypt new data with keys copied from the revoked device. Expected: new data uses new keys and
cannot be decrypted with the old ones.

**ST-DEV-03 New devices are announced.** Procedure: sign in on a new device. Expected: the existing
devices are notified.

### 5.9 Malicious server behaviour

All with E-HOSTILE, from stage 3.

**ST-MAL-01 Weaker key-derivation parameters.** Procedure: serve parameters below the client's
minimum. Expected: the client refuses to derive keys and reports a security error.

**ST-MAL-02 Unknown or weaker algorithms.** Procedure: serve data labelled with unknown or retired
algorithms. Expected: refused, with no fallback.

**ST-MAL-03 Forged authentication responses.** Procedure: send altered or forged sign-in responses.
Expected: authentication fails on the client; nothing about the password is revealed beyond what the
protocol allows.

**ST-MAL-04 Injected items or keys.** Procedure: add items or wrapped keys the user never created.
Expected: they fail to unwrap or fail the manifest check, and are not shown as genuine.

**ST-MAL-05 Oversized or malformed responses.** Procedure: serve very large, deeply nested or
truncated payloads. Expected: refused within resource limits, without a crash.

**ST-MAL-06 Different states for different devices.** Procedure: show two devices different
histories. Expected: the documented limit (threat-model AR-09) is observed, and any detection the
final design promises works.

### 5.10 Session theft

**ST-SES-01 A stolen session yields ciphertext only.** Needs: stages 3 and 4. Procedure: copy a
session cookie to another browser. Expected: at most ciphertext and metadata; the vault stays locked
without the master password.

**ST-SES-02 Cookie attributes, origin checks and authorisation.** Procedure: inspect the cookie;
send state-changing requests from another origin; request another account's objects with a valid
session. Expected: `__Host-` prefix with `Secure`, `HttpOnly` and `SameSite=Strict`; cross-origin
requests refused; other accounts' objects refused.

**ST-SES-03 Sign-out, expiry and revocation.** Procedure: sign out, let sessions expire, and revoke
them. Expected: the server refuses the old session in every case.

### 5.11 Brute-force resistance

**ST-BF-01 Online guessing is limited.** Needs: stage 3. Procedure: repeat sign-in attempts per
account and per address. Expected: growing delays and limits as designed; identical errors.

**ST-BF-02 Offline guessing cost.** Needs: stage 2 and the owner's approval of benchmarks.
Procedure: measure the time and memory of one key derivation with the chosen parameters on the
reference devices, and record the cost per guess. Expected: at or above the approved budget. **Not
to be run before approval; benchmarks are not part of this documentation stage.**

**ST-BF-03 Clients enforce minimum parameters.** Procedure: as ST-MAL-01, and by editing the stored
parameters directly. Expected: refused.

**ST-BF-04 Registration cannot be used to list accounts quickly.** Procedure: repeat registration
attempts for existing and new identifiers. Expected: rate limits as RFC 9807 section 10.9
recommends.

### 5.12 Secret leakage through logs and storage

**ST-LEAK-01 Canary secrets never appear.** Needs: stages 2 to 6. Procedure: run every flow with a
canary password, canary vault contents and a canary recovery key; then search server logs, database
fields other than ciphertext, client storage (cookies, Web Storage, IndexedDB, Cache Storage),
extension storage, desktop files, crash reports and error messages. Expected: no canary in any
readable form.

**ST-LEAK-02 Static checks.** Procedure: `npm run lint` (existing bans on storage APIs and
`console`); a code-review checklist for logging. Expected: no violation.

**ST-LEAK-03 Errors and telemetry.** Procedure: trigger every error path. Expected: messages carry
no secrets; nothing is sent to any third party (no telemetry is planned).

### 5.13 Browser extension isolation

All from stage 6, in E-BROWSERS and E-DEVICES.

**ST-EXT-01 Content scripts never receive keys or the vault.** Procedure: instrument the messages
between the extension's parts during fills. Expected: a content script receives only the one
credential being filled, after the user asks.

**ST-EXT-02 Origin matching.** Procedure: test pages on subdomains, other ports, plain HTTP,
look-alike and internationalised domains, and cross-origin frames. Expected: no fill except on the
exact stored origin; never into a cross-origin frame.

**ST-EXT-03 Hostile pages.** Procedure: pages with invisible fields, overlays, fields that move or
change during a fill, and fake prompts. Expected: no fill without a visible, user-initiated action
in an extension-owned surface.

**ST-EXT-04 Session storage stays private.** Procedure: from a content script, try to read
`storage.session`; restart the browser and reload the extension. Expected: not readable by content
scripts (the documented default access level); cleared by a restart or reload, as Chrome documents.

**ST-EXT-05 Permissions are minimal.** Procedure: review the manifest. Expected: no permission
beyond those the design justifies.

### 5.14 Key lifecycle and memory handling

**ST-MEM-01 Keys are not exportable.** Needs: stage 2. Procedure: call `exportKey` on the keys the
design marks non-extractable. Expected: refused.

**ST-MEM-02 Locking removes keys.** Procedure: unlock, lock, force garbage collection where
possible, take a heap snapshot, and search it for known test key bytes. Expected: not found. A find
is a defect; a clean result is evidence, not proof (threat-model AR-06).

**ST-MEM-03 Automatic locking.** Procedure: leave the application idle; lock the screen; put the
device to sleep. Expected: the vault locks as designed.

**ST-MEM-04 Clipboard and crash reports (desktop).** Needs: stage 6. Procedure: copy a password and
wait; force a crash. Expected: the clipboard is cleared after the set delay; the crash report
contains no secret.

### 5.15 Release integrity

**ST-SC-01 Releases are signed and updates verified.** Needs: stage 6 and a signing decision.
Procedure: install a correctly signed release; then try an unsigned or wrongly signed one through
the update channel. Expected: only the correctly signed release installs.

## 6. Coverage of the areas the evidence gate names

| Area (`SECURITY.md`)                  | Tests                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Valid and invalid inputs              | ST-TAMP-01, ST-TAMP-03, ST-MAL-05, ST-PW-03                                                            |
| Authentication failures               | ST-PW-01, ST-PW-02, ST-MAL-03, ST-RB-04                                                                |
| Ciphertext tampering                  | ST-TAMP-01 to 03, ST-TAG-01, ST-TAG-02                                                                 |
| Wrong keys and incorrect context      | ST-KEY-01 to 03, ST-CTX-01 to 03                                                                       |
| Nonce and key usage limits            | ST-TAG-01 (IV and tag lengths); a usage-cap test is added once the cap is decided (`PROTOCOL.md` 10.1) |
| Serialisation and parser edge cases   | ST-TAMP-03, ST-MAL-05                                                                                  |
| Compatibility across runtimes         | `TEST_VECTOR_PLAN.md` section 6; ST-NOW-07; ST-PW-03                                                   |
| Recovery and revocation               | ST-REC-01 to 04, ST-DEV-01 to 03                                                                       |
| Malicious-server scenarios            | ST-MAL-01 to 06, ST-CTX-01 to 03                                                                       |
| Rollback and synchronisation failures | ST-RB-01 to 03, ST-MAL-06                                                                              |

## 7. Status

| Tests                           | Status                                                                 |
| ------------------------------- | ---------------------------------------------------------------------- |
| ST-NOW-03, ST-NOW-04, ST-NOW-05 | Exist in the repository's CI; passed in CI run 13 on `893cd42`         |
| ST-NOW-01, ST-NOW-02            | Not automated; one one-off observation on 21 November 2026 (section 4) |
| ST-NOW-06, ST-NOW-07, ST-NOW-08 | Not run                                                                |
| ST-HDR-01                       | Not possible: no hosting                                               |
| Every test in section 5         | Not run: needs the implementation                                      |

## 8. Change log

| Version | Date             | Change                   |
| ------- | ---------------- | ------------------------ |
| 0.1     | 22 November 2026 | First draft, for review. |
