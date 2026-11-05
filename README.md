# VIBES Interactive · Version 2.1

A mobile-friendly, browser-based implementation of the **VIBES AI Checklist**, Version 2.1 (2026), by Rebecca L. Jones, EdD, CCC-SLP.

## Publish using GitHub Pages

1. Create a GitHub repository, such as `vibes-interactive`.
2. Upload **all four files** to the repository root: `index.html`, `styles.css`, `app.js`, `checklist.json`.
3. Open **Settings → Pages**. Select **Deploy from a branch**, branch `main`, folder `/(root)`, then **Save**.
4. Open the URL GitHub provides, typically `https://YOUR-USERNAME.github.io/vibes-interactive/`.
5. Test the 16 responses, mobile layout, Print / Save PDF, and reset function.

Opening `index.html` directly from your computer may block loading `checklist.json`. Use GitHub Pages or a local HTTP server for testing.

## Checklist fidelity

- All **16 checklist statements and their complete rationales** are extracted from the user-provided official Version 2.1 Word document.
- The **five domain definitions** are preserved.
- The **13 numbered references** are transcribed from that document. They are not independently bibliographically verified.
- The source instrument uses checkboxes, and instructs users to mark N/A separately. This website introduces the digital responses **Met / Not met / Unclear / N/A** as a practical interface choice, **not** as a validated scale.
- No numerical score, pass/fail threshold, or claim of validated clinical effectiveness is provided.
- Version 1 items have initial content-validity evidence; Version 2.1 revised items have not been re-rated.

## Privacy and limitations

No analytics, accounts, database, or submission service. Responses remain in browser memory and disappear on refresh or closing the tab. Do not enter protected health information, student records, or other identifying information. Print / Save PDF uses the browser's print dialog.

Google Fonts may be loaded for display. For a completely offline/self-hosted deployment, remove the `@import` statement from `styles.css`; the site falls back to system fonts.

## Licensing

**Checklist content**: © 2026 Rebecca L. Jones, EdD, CCC-SLP. The supplied Version 2.1 checklist specifies **Creative Commons Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)**: https://creativecommons.org/licenses/by-nd/4.0/

This is **not** CC BY-NC-ND. The site reproduces the original item statements and rationales without modifying their wording. The digital interface and response controls are separately identified as an implementation adaptation.

**Website source code**: No separate software license has been granted in this package. The copyright holder may choose and add one later. Do not assume the checklist's Creative Commons license also licenses the code.

**DOI**: The source checklist lists a placeholder, so the site says “To be added.”
