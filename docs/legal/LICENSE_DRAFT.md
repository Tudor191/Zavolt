# Draft licence notice: not in effect

> **Draft 0.1, 22 November 2026, for the owner's decision. Not legal advice. Not reviewed by a
> lawyer. This file is not the repository's licence** and grants or withholds nothing. The
> repository's licensing status is described in
> [LICENSING_ASSESSMENT.md](./LICENSING_ASSESSMENT.md), section 2.

**Why it is here and not at the repository root.** GitHub, and anyone reading the repository, treat
a root `LICENSE` file as the licence. Putting even a draft there would make the decision that is
still open. The text below becomes the root `LICENSE` file only if the owner chooses the proprietary
option, a lawyer has reviewed it, and the placeholders are filled.

## Proposed text (option A: proprietary, all rights reserved)

```text
Copyright (c) [YEAR OF FIRST PUBLICATION]-[CURRENT YEAR] [LEGAL NAME OF THE RIGHTS HOLDER]

All rights reserved.

This repository and everything in it, except the third-party material described below, is
proprietary. No licence or other right is granted, expressly or by implication, to use, copy,
modify, merge, publish, distribute, sublicense or sell it, or any part of it, except:

  (a) the rights that GitHub's Terms of Service give other GitHub users to view and fork public
      repositories through GitHub's service, for as long as this repository is public; and
  (b) any right that applicable law grants and that cannot be excluded by contract.

Third-party material is licensed under its own terms. See public/THIRD-PARTY-NOTICES.txt, and
THIRD-PARTY-LICENSES.md, which the production build generates.

Licensing enquiries: [CONTACT ADDRESS FOR LICENSING ENQUIRIES]
```

## Placeholders

| Placeholder                                 | What is needed                                                                                                                                                              |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[YEAR OF FIRST PUBLICATION]`               | The year the code was first made public. The repository's history begins on 15 November 2026; the owner confirms.                                                           |
| `[CURRENT YEAR]`                            | The year of the latest change, or omitted, as the lawyer advises.                                                                                                           |
| `[LEGAL NAME OF THE RIGHTS HOLDER]`         | The full legal name of the person, or the registered name of the company, that holds the rights. Not the product name, unless a company of that name exists and holds them. |
| `[CONTACT ADDRESS FOR LICENSING ENQUIRIES]` | An address the owner chooses. None exists yet.                                                                                                                              |

## Before it takes effect

1. The owner chooses the licence model (`LEGAL_OPEN_QUESTIONS.md`).
2. The rights holder is settled, and the questions about the template and the AI-assisted code are
   answered (`LICENSING_ASSESSMENT.md`, section 7).
3. A lawyer reviews the wording, including whether to mention GitHub's terms and whether a Romanian
   version is needed.
4. The root `LICENSE` file is added and `README.md`'s licence section updated, as a documentation
   change. The footer's copyright line names the rights holder; that is website text, so it is a
   code change with its own approval.

## If another option is chosen

Use the licence's official text unchanged, with the rights holder's name: MIT from
<https://opensource.org/license/mit>; Apache-2.0 from <https://www.apache.org/licenses/LICENSE-2.0>,
with a `NOTICE` file; the Business Source License 1.1 from <https://mariadb.com/bsl11/> with its
parameters filled in; the Functional Source License from <https://fsl.software/>. None of these
texts should be written from memory or edited.
