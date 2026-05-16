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

## 3. Modern parser data-dependent bugs (`modernParseExperience` orphan items)

**Reframe note:** previous revisions of this section bundled three unrelated Modern defects under "typography defects (separate workstream)" and tagged the list as the "Modern-at-mobile triage." That framing was misleading. The "letter-spacing exploded across all text" item turned out to be a metric-divergence artifact of `pdf.html()` using Helvetica regardless of the browser-side font (closed not_planned by §6). The `**bold**` literal-asterisks item was a template-renderer escape pass with no markdown conversion (closed by PR #12, commit `6f917ba`). What remained — the user's "Newlands West" screenshot — is neither typography nor mobile-specific; it is a data-dependent parser bug in `modernParseExperience` at `index.html:1812` that surfaces whenever a resume contains a bare line (no `|` separator, no bullet marker) inside a `WORK EXPERIENCE` block. Mobile is incidental; the same input produces the same defect on desktop.

### The bug

`modernParseExperience` walks lines as a state machine. The gate at `index.html:1835` previously read `if (current && current.bullets.length === 0 && !current.subtitle)` — i.e. attach a bare line to the current item's subtitle **only if** subtitle is still empty AND no bullets have started yet. A pipe-header `Company | Role | Dates` already sets `current.subtitle = role` while parsing, so by the time any later bare line arrives the gate is already closed and the bare line falls through to the orphan-item branch (`items.push(current); current = { title: t, ... }`).

### Three trigger shapes

| # | input shape | result pre-fix |
| - | --- | --- |
| A | pipe-header → bare line → bullets | orphan title-only item created from the bare line; the two bullets attach to the orphan, **misattributing them to a fake company** (data-integrity bug, not just cosmetic) |
| B | pipe-header → bullets → bare line → next pipe-header | stray title-only item with a timeline ring **between** the two real items |
| C | pipe-header → bullets → bare line at end | stray title-only **trailing** item with a timeline ring (the original "Newlands West" screenshot) |

All three render through `experienceHTML` (`index.html:2002-2028`) as a `<div>` with `${timelineRing}` plus a lone `<h3>` and nothing else — visually identical to an empty bullet line for the user.

### Fix

Replace the gate at `index.html:1835-1840` with an unconditional subtitle-append:

```js
if (current) {
  current.subtitle = current.subtitle ? current.subtitle + ' · ' + t : t;
  return;
}
current = { title: t, date: '', subtitle: '', bullets: [] };
```

The `' · '` separator matches the existing pipe-header multi-part join at `index.html:1830` (`parts.slice(1, -1).join(' · ')`), so post-fix output for case A reads as `Senior Marketing Manager · Newlands West, Durban` — no new visual convention introduced and indistinguishable from a user-written `Acme | Senior Mgr | Newlands West, Durban | 2022-Present` pipe-header.

### Verification

Each trigger shape rendered as a Modern PDF pre- and post-fix via the `harness_dyn.js` recipe (load `index.html` over `file://`, stub CDN scripts to local `node_modules` jsPDF / html2canvas, select Modern, patch `doc.html()` to capture the produced bytes via injected callback). The six PNGs are linked in the PR description. Case A's misattribution is fully corrected (bullets re-attach to Acme); cases B and C drop their orphan items cleanly; the trailing-stray Education spacing in case C tightens up (no longer needs to render around an orphan).

This entry is the canonical reference for future work on the parser. If a fourth trigger shape surfaces, add it to the table.

## 4. Library-quirk notes worth carrying into the PR description

- **jsPDF 2.5.1 `await pdf.html(...)` Promise return is unreliable in headless Chromium** across all autoPaging values; callback-style works. Production browsers don't trip this — appears to be a microtask-scheduling / font-loading timing difference. Our test harness (`/tmp/livepipe.js`) patches `jsPDF.API.html` to inject a wrapper callback so the harness can capture the PDF without depending on the production await to resolve.
- **`pdf.html()` routes html2canvas's `ctx` through jsPDF's own `context2d` shim**, not a real Canvas 2D context. Methods on `CanvasRenderingContext2D.prototype` are NOT invoked by html2canvas in this flow. Any future instrumentation that wants to intercept rendering calls must patch the jsPDF instance's `context2d` directly (see `/tmp/svg-trace.js` for the pattern).

## 5. Phase 2 hypotheses that were wrong, recorded so the next investigator doesn't repeat them

- **Fix A: pdf.html() options (autoPaging slice→text, margin:0, allowTaint).** Tested via callback-style probe to bypass the await-hang. Proven inert (byte-identical PDF). Also introduces an await-hang in production with `autoPaging:'text'`. Reverted.
- **Fix B: flex grow → explicit pixel widths** at index.html:2429 (`flex:1.7 / flex:1` → `width:432px / width:256px`). Modeled on the working PR #5 remediation for Modern's flex-collapse bug. Tested in livepipe. Visually identical render; the flex layout was not the cause. Reverted.
- **Fix #2 onclone variant: strip `style` attribute** from all SVGs in the cloned document via `html2canvas: { onclone: ... }`. Proven inert (PDF byte-identical to baseline). Either onclone runs at the wrong stage or the style-attribute bloat itself is not the throw cause. Reverted.

The Phase 1-era "convert stroke-based multi-element paths to single-path geometry with fill='#fff'" framing of Fix #2 was based on an icon-source-markup theory that doesn't match the actual failure mode (atob format mismatch in jsPDF's context2d shim). Dropped from the gate.

## 6. Issue #9 — jsPDF's `html()` doesn't use html2canvas; `@font-face` bundling does not reach the PDF

Issue #9 ("bundle DM Sans inline to eliminate Google Fonts CDN dependency on Modern PDF render") was investigated, attempted, and reverted on `claude/continue-eleve-ai-suite-bKQeg` after diagnostics showed the premise was wrong. The PDF was always rendering in built-in Helvetica regardless of what the browser was displaying in the hidden render container, and the bundled commit caused visible spacing artifacts by introducing metric divergence between browser DOM layout and jsPDF's text-emission stage.

This finding refutes §3's "Modern typography defects" bullet about font-fallback being the cause of "letter-spacing exploded across all text" — it isn't fallback, it's that jsPDF never had access to DM Sans in the first place. Recording here so the next investigator working on Modern typography doesn't re-attempt the same approach.

### Diagnostic commands

Run against a Modern PDF rendered with the bundled `@font-face` commit applied (commit since reverted):

**(a) PDF font table** — confirms no DM Sans embedded, only the standard 14 base fonts:

```
$ pdffonts modern.pdf
name                                 type              encoding         emb sub uni
------------------------------------ ----------------- ---------------- --- --- ---
Helvetica                            Type 1            WinAnsi          no  no  no
Helvetica-Bold                       Type 1            WinAnsi          no  no  no
Helvetica-Oblique                    Type 1            WinAnsi          no  no  no
Helvetica-BoldOblique                Type 1            WinAnsi          no  no  no
Courier (×4 variants)                Type 1            WinAnsi          no  no  no
Times-Roman (×4 variants)            Type 1            WinAnsi          no  no  no
Symbol, ZapfDingbats                 Type 1            ...              no  no  no
```

**(b) PDF image table** — confirms zero images embedded; the page is vector text, NOT a rasterized canvas (despite the misleading `html2canvas: {...}` option name in `pdf.html()` config):

```
$ pdfimages -list modern.pdf
page   num  type   width height color comp bpc  enc interp  object ID
--------------------------------------------------------------------------------
(empty — no images on any page)
```

**(c) PDF text stream** — confirms the spacing defects are literal space characters in the text stream, not rendering artifacts:

```
$ pdftotext -layout modern.pdf
Hartford , CT
nthabi @example .com
+1 860 555 0142
linkedin .com / in/ nthabiseng
... multi - channel growth campaigns . Skilled in brand strategy , paid acquisition ...
20 22- Present
20 20 - 20 22
```

**(d) Reference DOM screenshot via puppeteer (bypassing jsPDF)** — confirms the source HTML/CSS is clean. The same `buildModernResumeElement` output rendered as a pure browser screenshot shows tight, correct text: `Hartford, CT`, `nthabi@example.com`, `linkedin.com/in/nthabiseng`. The defect is created entirely inside jsPDF's `pdf.html()` pipeline.

### Mechanism — metric divergence between browser layout and jsPDF text emission

1. The browser lays out the hidden render container using DM Sans (because `@font-face` loaded successfully). DM Sans's glyphs have specific advance widths that determine where each character sits.
2. jsPDF's `pdf.html()` walks the DOM via an internal `context2d` shim (`pdf.context2d`, the same one §4 of this doc warned about for instrumentation). The shim reads each text node's measured bounding box — measurements computed in DM Sans.
3. The shim emits each text node via `pdf.text()` using Helvetica (jsPDF's only available font without explicit `addFont()` registration). Helvetica is narrower than DM Sans at most weights.
4. To make Helvetica's narrower text fill the DM Sans–sized bounding box, the shim distributes the deficit as extra space characters between word/punctuation tokens. Concentrated breaks: ` ,` ` @` ` .` ` /` `( ` ` )`.
5. **Pre-#9**: Google Fonts CDN blocked or slow → browser falls back to system sans (Arial-class metrics, ≈ Helvetica) → DOM measurements match jsPDF's text widths → no padding needed → no gaps. The PDF was always Helvetica, but the layout/render fonts agreed.
6. **Post-#9**: `@font-face` loads DM Sans reliably → browser uses DM Sans → measurements diverge from Helvetica's widths → padding kicks in → visible gaps. **Issue #9 caused the regression that issue #9 was trying to fix.**

### What does NOT help, and why

- **Setting `letterRendering: false`** in the `html2canvas: {...}` config: that option only applies to actual html2canvas rasterization, which `pdf.html()` does not invoke in this code path. Verified inert by render-validation: the spacing defects rendered byte-identically with `letterRendering: true` and `letterRendering: false`.
- **Switching `autoPaging` from `'text'` to `'slice'`**: would change page-break behavior but not the text-emission path. The Context2D shim is on both paths.
- **Bundling more `@font-face` weights, or changing `font-display`, or pre-loading via `document.fonts.load()`**: none of these reach jsPDF; they only affect the hidden render container's brief layout.

### What WOULD have worked (option B, not taken)

Register DM Sans as a real jsPDF font via `doc.addFileToVFS('DMSans-Regular.ttf', base64) + doc.addFont('DMSans-Regular.ttf', 'DMSans', 'normal')`, separately for each weight Modern uses (400/500/700/800). jsPDF requires TTF, not WOFF2, so the inline payload is much larger (~150–250KB base64 per weight). Then set Modern's container `font-family` to the registered jsPDF font name. This makes `pdf.text()` actually emit DM Sans glyphs, matches browser metrics, eliminates the padding.

Not taken because the PDF was shipping fine in Helvetica before #9 and the user-perceived improvement of "true DM Sans in the PDF" did not justify the ~600KB–1MB inline payload and the registration code. Option A (full revert of #9) was selected. Recorded here so anyone later proposing "let's bundle the font for the PDF" understands which approach actually works.

### Minimal's identical `letterRendering: true` at `index.html:2497` — also moot, no action

Minimal's `pdf.html()` config has the same `letterRendering: true` flag. It is equally inert there for the same reason (option doesn't reach the active rendering path). Minimal additionally never showed the spacing defect because its font stack is Lato → Source Sans → system sans (`index.html:2270`), and those families either don't bundle (no `@font-face`) or fall back to system sans with Arial-class metrics — so Minimal's DOM measurements have always matched Helvetica's, no metric divergence, no padding. Leaving Minimal's flag at `true` intentionally; if/when Lato gets bundled during the mobile-Minimal workstream, this finding applies and the same analysis (register-the-font OR don't-bundle) needs to be repeated.

### Lesson for future "fix the fonts in template X" work

**Verify the actual PDF output pipeline before assuming what affects it.** Run `pdffonts file.pdf` to see which fonts are actually embedded, and `pdfimages -list file.pdf` to see whether text is vector or raster. For any template using `pdf.html()` in jsPDF 2.x, assume:
- `html2canvas: {...}` options in the config probably don't apply (jsPDF's own Context2D shim handles text, not html2canvas)
- `@font-face` bundling affects only the browser's hidden render container, not the PDF text stream
- The PDF uses jsPDF's font table (Helvetica by default) unless `addFont()` was explicitly called

This finding does not affect templates that render via direct `doc.text()` / `doc.rect()` calls (the older `downloadPDF`-style renderers in this codebase) — those have always been Helvetica-only and there was never a layout/render divergence to worry about. The bug only exists for `pdf.html()`-style renderers (Modern, Minimal) where a browser DOM intermediary creates the opportunity for metric mismatch.

