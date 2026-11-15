# Audit of the original static site

This is the record of the audit carried out before the migration to TypeScript, and of what was done
about each finding.

- **Audited state:** commit `cbc08b4` on the `conversie-html-to-typescript` branch, 15 November 2026.
- **Method:** every file and all nine commits were read. The pages were rendered in Chromium at
  1280×800 and at phone size and driven by script (hover, click, keyboard). The markup was run
  through an HTML validator and the full history was searched for secrets.

## What the repository contained

Four HTML documents, four stylesheets and one image. No `package.json`, lockfile, build step,
JavaScript or TypeScript files, tests, linting, continuous integration, `.gitignore` or licence.

| File                                     | Content                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| `index.html`                             | The dashboard: a loader, then three animated rings labelled Contact us, Vault and Account. |
| `account.html`, `cart.html`, `shop.html` | The same loader followed by an empty container.                                            |
| `styles/style.css`                       | Dashboard and loader styles.                                                               |
| `styles/styleaccount.css`                | The loader styles again. All three other pages linked this file.                           |
| `styles/stylecart.css`, `styleshop.css`  | Copies of `styleaccount.css` that no page used.                                            |
| `images/logo.png`                        | A white "TDR" monogram, used as the favicon.                                               |

All behaviour was one inline script, repeated in every page: wait three seconds after load, hide the
loader, show the content. The only dependency was Ionicons 5.5.2, loaded from the unpkg CDN.

The site started from a generic shop template. Titles read "SHOP NAME", the loader is a shopping
cart, and cart and shop pages exist although the product is a password manager.

## Findings

Outcome is one of **Fixed**, **Kept** (left as it was on purpose, with the reason) or **Open**
(needs a decision or later work).

### Functionality

| #   | Finding                                                                                                                                                          | Outcome                                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| F1  | The three dashboard items did nothing. They had no link or handler, and a scripted click did not navigate. Three stray `</a>` tags show the links had been lost. | **Fixed.** They are links.                                                                                               |
| F2  | The site had no anchors at all. The account, cart and shop pages were blank dead ends.                                                                           | **Fixed.** Every page links back to the dashboard.                                                                       |
| F3  | Vault and Contact us had no page to lead to.                                                                                                                     | **Fixed.** `/vault` and `/contact` exist and state that the section is not available yet. No functionality was invented. |
| F4  | Without JavaScript the content was never revealed and nothing explained why.                                                                                     | **Fixed.** A `<noscript>` message.                                                                                       |
| F5  | Titles read "SHOP NAME".                                                                                                                                         | **Fixed.** "Zavolt", with a title per page.                                                                              |

### Layout and accessibility

| #   | Finding                                                                                                                       | Outcome                                                                                          |
| --- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| A1  | The menu was a fixed 800px wide. At 390px the first item sat entirely off-screen to the left, where it cannot be scrolled to. | **Fixed.** The items stack below 720px. No sideways scrolling from 320px to 1920px.              |
| A2  | Labels appeared only on hover, so touch users never saw them.                                                                 | **Fixed.** Devices without hover show labels permanently, and a tap on a label follows the link. |
| A3  | Nothing was focusable. Pressing Tab left focus on the body.                                                                   | **Fixed.** Items are reachable by keyboard and show a focus ring.                                |
| A4  | No `lang` attribute, no landmarks, no headings.                                                                               | **Fixed.**                                                                                       |
| A5  | The loader was labelled "Shopping cart line animation" and was not exposed as a loading state.                                | **Fixed.** The artwork is hidden from assistive technology and the text has a status role.       |
| A6  | Animations ran forever regardless of the reduced-motion preference.                                                           | **Fixed.** With reduced motion, animations stop and the loading delay is skipped.                |
| A7  | After a page change in a single-page application, focus would be left on a link that no longer exists.                        | **Fixed.** Focus moves to the new page's heading.                                                |

### Code quality

| #   | Finding                                                                                                                                                | Outcome                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Q1  | 15 HTML validation errors, including the stray end tags, an invalid favicon type (`image/icon type`), inline styles and inline event handlers.         | **Fixed.**                                                                     |
| Q2  | The loader markup and its script were repeated in all four pages.                                                                                      | **Fixed.** One component.                                                      |
| Q3  | `stylecart.css` was byte-identical to `styleaccount.css`, `styleshop.css` differed only in whitespace, and neither was linked from any page.           | **Fixed.** Removed.                                                            |
| Q4  | Dead CSS: unused `--bg` and `--fg` variables, a `.loader__msg--last` class no element had, and a message animation timed for after the loader is gone. | **Fixed.** Not carried over.                                                   |
| Q5  | `Poppins` was declared as the font but never loaded, so pages fell back to a system font.                                                              | **Fixed.** Self-hosted. Hover labels now render in the font the CSS asked for. |
| Q6  | The loader text named only `consolas`, which falls back to a serif font outside Windows.                                                               | **Fixed.** A monospace font stack.                                             |
| Q7  | The loader's track colour followed the operating system theme although the page is always dark, so in light mode it was invisible.                     | **Fixed.** Always the on-dark colour.                                          |
| Q8  | Mixed line endings: CRLF in HTML, LF in CSS.                                                                                                           | **Fixed.** `.gitattributes` and `.editorconfig`.                               |
| Q9  | No types, lint, tests, build, lockfile or continuous integration.                                                                                      | **Fixed.**                                                                     |

### Performance

| #   | Finding                                                     | Outcome                                                                                                                                                                                                |
| --- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P1  | A fixed three-second wait on every page view.               | **Kept, reduced.** The loading sequence is part of the existing design, so its duration is unchanged. It now runs once per page load instead of on every navigation. Removing it is a design decision. |
| P2  | Seven requests to a third-party origin to draw three icons. | **Fixed.** The icons are bundled. The application makes no third-party requests.                                                                                                                       |

### Security

| #   | Finding                                                                                                                                                              | Outcome                                                                                                                                        |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | A script from the unpkg CDN ran in the application's origin with no integrity check. Whoever controls that path controls the page that will one day hold vault keys. | **Fixed.** Removed.                                                                                                                            |
| S2  | Inline scripts, handlers and styles made a strict Content-Security-Policy impossible, and none was set.                                                              | **Fixed.** A strict policy with Trusted Types, tested in a browser.                                                                            |
| S3  | The dashboard is meant for signed-in users, but nothing authenticates anyone.                                                                                        | **Open.** Authentication is planned. It was deliberately not faked. The limit is stated in the README, SECURITY.md and the dashboard's source. |
| S4  | Separate documents cannot keep an unlocked key in memory across navigation, which invites storing it in the browser.                                                 | **Fixed.** Client-side routing.                                                                                                                |
| S5  | Nothing prevented the pages from being framed by another site.                                                                                                       | **Partial.** The application refuses to start in a frame. The `frame-ancestors` header still has to be sent by the host.                       |
| S6  | No dependency management, so no integrity checking or vulnerability auditing.                                                                                        | **Fixed.** Lockfile, exact versions, no install scripts, audits in CI.                                                                         |
| S7  | No security response headers, and no hosting configuration to put them in.                                                                                           | **Open.** No hosting has been chosen. The required headers are listed in SECURITY.md.                                                          |
| S8  | Secrets in the repository or its history.                                                                                                                            | **None found** in the working tree or in any of the nine commits.                                                                              |
| S9  | Cookies, browser storage, forms, network calls.                                                                                                                      | **None present**, so nothing to fix.                                                                                                           |

### Left as they were

| #   | Item                                                                             | Why                                                                                         |
| --- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| K1  | The `/cart` and `/shop` routes.                                                  | They are existing addresses. Removing routes is a product decision, not a migration detail. |
| K2  | The shopping-cart loader artwork.                                                | It is the existing visual design. Replacing it is a branding decision.                      |
| K3  | The favicon: a white "TDR" monogram, 440×333, invisible on light browser themes. | Same reason. Only its declared type was corrected.                                          |
| K4  | No licence file.                                                                 | Choosing a licence is the owner's decision.                                                 |

## What changes for visitors

- A build step is required. `dist/` is deployed, not the repository root.
- `/account.html`, `/cart.html` and `/shop.html` become `/account`, `/cart` and `/shop`. The old
  addresses redirect, provided the host answers unknown paths with `index.html`.
- `styles/*.css` no longer exist as addresses.
- Dashboard items navigate when activated.
- The loader appears once per page load, not on every navigation.
- Labels use Poppins instead of a fallback font, and the loader text is monospace on every platform.

## How the result was checked against the original

- **Dashboard, desktop.** At 1280×800 the menu, each item, each icon, every transform, colour and
  hover style were compared numerically with the original and are identical. With animations frozen
  at the same instant, 0.08% of pixels differ and none by a visible amount.
- **Loader.** The position and size of the artwork and the text are identical to the original at
  390×844, 1280×800 and 1920×1080.
- **Tests that can fail.** Fifteen defects were introduced one at a time, among them a weakened
  policy, a removed frame check, a removed redirect, low-contrast text and a third-party stylesheet.
  The test suite failed for every one.

## What was not verified

- Rendering in Firefox and Safari. All browser checks ran in Chromium.
- Real phones. Touch behaviour was checked with device emulation.
- Screen readers by hand. Accessibility was checked with axe-core and by asserting on the
  accessibility tree.
