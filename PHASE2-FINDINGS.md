# Phase 2 Findings — Minimal PDF Body-Missing Investigation

State at commit: branch `claude/switch-to-minimal-DYF7W`, ahead of `origin/main` (post-PR #6) by `231fdd5` (Minimal jsPDF destructure fix) plus this file and the upcoming (C) fix.

This file captures findings made during the Phase 2 diagnostic that should be preserved in branch state rather than only chat history, both for reviewer context on the PR and for the follow-up work it points at.

---

## 1. Diagnosed root cause of Minimal body-missing

Direct mechanical observation via instrumented trace (preserved in `/tmp/svg-trace.js`):

```
InvalidCharacterError: Failed to execute 'atob' on 'Window':
The string to be decoded is not correctly encoded.
  at p                      jspdf.umd.min.js:86:88690
  at t.getImageProperties   jspdf.umd.min.js:86:94264
  at p.drawImage            jspdf.umd.min.js:117:28281
  at Ds.renderReplacedElement html2canvas.min.js:20:174366
```

Mechanism:

1. `buildMinimalResumeElement`'s `head()` emits inline `<svg>` icon markup inside each section heading's navy 24×24 box.
2. html2canvas's `SVGElementContainer` (html2canvas.js:4556-4566) handles inline `<svg>` by:
   - Mutating the live element (`setAttribute('width', ...)`)
   - Serializing the entire DOM tree via `XMLSerializer().serializeToString(img)` — at this point the browser bakes the element's full computed CSS into a `style=""` attribute (29-48K chars: every CSS custom property inherited from the document root, every `-webkit-*` property, etc.)
   - Wrapping in `"data:image/svg+xml," + encodeURIComponent(...)` — producing a URL-encoded data URI
3. jsPDF's `pdf.html()` routes html2canvas's `ctx` through jsPDF's own `context2d` shim, not a real Canvas 2D context. When html2canvas calls `ctx.drawImage(image, ...)` in `renderReplacedElement`, jsPDF's shim calls `getImageProperties(image)` which internally `atob(...)` decodes the image's data URI as base64. URL-encoded content is not valid base64 → `InvalidCharacterError`.
4. `renderReplacedElement` does `ctx.save() → ctx.clip() → ctx.drawImage()` — if drawImage throws, `ctx.restore()` is skipped. The clip stack grows by one per failed icon.
5. Minimal has 6 section icons (Profile/Experience/Education/Skills/Languages/References + auto-Personal Info), all of which throw. Aggregate save/restore imbalance equals throw count (33/27 = delta 6). The leaked clips compound — subsequent drawing operations are clipped to the tiny 13×13 SVG content box, leaving the rest of the resume invisible.

## 2. Modern has the same bug — latent

Same root cause, same call stack, 3 throws per render (one per `mainHead()` icon: Profile / Work Experience / Education; sidebar uses `sideHead()` without icons).

Why visually invisible on Modern today:

- **Logging suppression**: Modern's `pdf.html()` options at `index.html:2111` set `logging: false`. The `console.error("Error loading svg ...")` in html2canvas's catch is gated by that. Modern's throws fire but the error log is suppressed. Minimal's options at `index.html:2443` don't override (default `logging: true`), so its 6 errors are logged.
- **Render-order quirk**: Modern's throws fire at t≈1740ms in a ~1800ms render — after most text and sections are drawn. Minimal's throws start at t≈288ms in a ~440ms render, early enough that they clip out everything subsequent. Same save/restore imbalance mechanism (Modern: 176/173 delta 3; Minimal: 33/27 delta 6), different visible consequence.

The fix shape that lands here for Minimal applies equally to Modern. Reasons not to bundle Modern's fix in this PR:
- Scope discipline: this PR is the Minimal-fix branch
- Risk: Modern is currently visually-correct in production for typical data; an in-place fix would be hard to A/B verify without surfacing different latent bugs
- Modern has separate typography defects (see §3) that need their own workstream; addressing the silent SVG corruption is better done alongside that work, not as a tag-along here

Follow-up work item: apply the same `<img src="data:image/svg+xml;base64,...">` transform to `MODERN_ICONS` and the `mainHead()` icon emission. Should be straightforward; trace harness will verify with the same 0-throws / delta-0 criteria.

## 3. Modern typography defects (separate workstream)

User-reported via mobile screenshot during this Phase 2 session, then reproduced via the Modern-at-mobile triage (renders byte-identical between origin/main and current branch — pre-existing on main, not a regression from this branch):

- **Letter-spacing exploded across all text** (name, section titles, dates, body, references) — lead hypothesis is font-fallback. Modern's `renderModernResumePDF` already does `await document.fonts.ready` (index.html:2095-2097); either it resolves before custom fonts actually finish loading in some environments, or the fonts simply never load (Google Fonts CDN may be unreachable / slow / blocked for some users). Possible structural fix: bundle DM Sans / Lato as base64 `@font-face` data URIs, sidestep the CDN entirely.
- **`**bold**` literal asterisks** in Profile / Work Experience text — confirmed at source level: `index.html:1994` uses `modernEscapeHTML(profile)` which escapes but does not convert markdown. The AI prompt at index.html:1394 already instructs "no markdown symbols" but the model is violating it. Belt-and-suspenders fix: define a Modern-side `md` analog of Minimal's at index.html:2211 and use it where boldable text appears, AND tighten upstream content sanitization.
- **Stray empty bullet** ("Newlands West" on user's screenshot) — data-dependent edge case in `modernParseExperience`, didn't reproduce with our test fixture. Likely an empty-line-in-bullets loop case. Investigate when working on the typography pass.

None addressed in this PR.

## 4. Library-quirk notes worth carrying into the PR description

- **jsPDF 2.5.1 `await pdf.html(...)` Promise return is unreliable in headless Chromium** across all autoPaging values; callback-style works. Production browsers don't trip this — appears to be a microtask-scheduling / font-loading timing difference. Our test harness (`/tmp/livepipe.js`) patches `jsPDF.API.html` to inject a wrapper callback so the harness can capture the PDF without depending on the production await to resolve.
- **`pdf.html()` routes html2canvas's `ctx` through jsPDF's own `context2d` shim**, not a real Canvas 2D context. Methods on `CanvasRenderingContext2D.prototype` are NOT invoked by html2canvas in this flow. Any future instrumentation that wants to intercept rendering calls must patch the jsPDF instance's `context2d` directly (see `/tmp/svg-trace.js` for the pattern).

## 5. Phase 2 hypotheses that were wrong, recorded so the next investigator doesn't repeat them

- **Fix A: pdf.html() options (autoPaging slice→text, margin:0, allowTaint).** Tested via callback-style probe to bypass the await-hang. Proven inert (byte-identical PDF). Also introduces an await-hang in production with `autoPaging:'text'`. Reverted.
- **Fix B: flex grow → explicit pixel widths** at index.html:2429 (`flex:1.7 / flex:1` → `width:432px / width:256px`). Modeled on the working PR #5 remediation for Modern's flex-collapse bug. Tested in livepipe. Visually identical render; the flex layout was not the cause. Reverted.
- **Fix #2 onclone variant: strip `style` attribute** from all SVGs in the cloned document via `html2canvas: { onclone: ... }`. Proven inert (PDF byte-identical to baseline). Either onclone runs at the wrong stage or the style-attribute bloat itself is not the throw cause. Reverted.

The Phase 1-era "convert stroke-based multi-element paths to single-path geometry with fill='#fff'" framing of Fix #2 was based on an icon-source-markup theory that doesn't match the actual failure mode (atob format mismatch in jsPDF's context2d shim). Dropped from the gate.
