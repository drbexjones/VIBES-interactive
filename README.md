# VIBES Interactive (Version 2.1)

An interactive, static, mobile-friendly implementation of the 16-item VIBES AI Checklist, using item wording from Appendix A of the revised manuscript.

## Publish with GitHub Pages

1. Create a new **public** GitHub repository, e.g. `vibes-interactive`.
2. Upload **all four** files: `index.html`, `style.css`, `app.js`, `items.json` to the repository root.
3. Open **Settings → Pages**, select **Deploy from a branch**, branch **main**, folder **/(root)**, and save.
4. Open the URL GitHub displays, typically `https://YOUR-USERNAME.github.io/vibes-interactive/`.
5. Test the page on mobile and desktop before sharing a QR code.

## Privacy and research status

- No server, form submission, analytics, cookies, or third-party libraries. Answers are held in JavaScript memory only, not saved between reloads. Printing invokes the browser's print dialog; users control any saved PDF.
- Do not enter patient or student information. This is not a HIPAA-compliant medical record or secure data collection service.
- This is an interactive presentation of the revised Version 2.1 checklist, not a separately validated instrument. Initial content-validity findings apply to Version 1 item statements.
- The four response choices (Yes, No, Unclear, Not applicable) are website interaction options, **not claimed to be the instrument's original response scale**. Confirm they are suitable for the intended deployment and future research protocol before research use.
- No numerical score or certification is generated.

## Editing

Edit `items.json` only if authorized and version-control any changes to the instrument wording. Colors and typography are in `style.css`.
