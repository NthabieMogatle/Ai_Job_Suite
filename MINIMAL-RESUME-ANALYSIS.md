# Minimal Resume Render — Read-Only Analysis

Repo: NthabieMogatle/Ai_Job_Suite
Branch: claude/debug-minimal-resume-gFlSA
Comparison commit (last known good): `1896682`
File analyzed: `index.html`
Function: `buildMinimalResumeElement` (line 2469) and helpers

---

## STEP 1 — Confirmation

- **Line 2474** reads: `const FONT  = "Helvetica, Arial, sans-serif";` ✓
- **Line 2713** summaryHTML uses `line-height:1.45` ✓

Both match what was stated.

---

## STEP 2 — Diff vs commit `1896682` inside `buildMinimalResumeElement` (lines 2469–2717)

`git diff 1896682 HEAD -- index.html` returns **only two** changes inside this function. (One unrelated change exists outside it, at lines 1548-1561 — the tailoring/JD prompt text — but it does not affect the render.)

### Change A — `head()` helper, lines 2640–2645

| field | `1896682` (good) | current `HEAD` |
|---|---|---|
| outer `gap` | `11px` | `9px` |
| outer `margin` | `14px 0 3px` | `13px 0 3px` |
| icon `width`/`height`/`flex` basis | `28px` | `22px` |
| label `font-size` | `16px` | `13px` |
| label `letter-spacing` | (none) | `0.2px` |

### Change B — summary block, line 2713

| field | `1896682` | current |
|---|---|---|
| `line-height` on the summary `<div>` | `1.5` | `1.45` |

**That is the entire diff inside `buildMinimalResumeElement` and its helpers.** No other line in 2469–2717 differs. In particular: `parseEntries`, `splitSkills`, `parseLangs`, `parsePairs`, `renderEntry`, `renderBullets`, `renderRefs`, `renderPairs`, `renderList`, `renderLangs`, `renderSec`, `wrap.style.cssText`, the flex split `7/3`, the `gap:36px`, the `padding:36px 56px 24px`, header sizing, and `renderMinimalResumePDF` are all **byte-identical** to `1896682`.

---

## STEP 3 — Where the column / width values are defined

These are the only width-related values in the Minimal render path (none changed since `1896682`):

1. **Outer wrap — index.html:2705**
   ```js
   wrap.style.cssText = `width:816px;min-height:1050px;background:#fff;padding:36px 56px 24px;box-sizing:border-box;...`;
   ```
   → usable inner width = `816 − 56 − 56 = 704px`.

2. **Two-column flex row — index.html:2715**
   ```html
   <div style="display:flex;gap:36px;margin-top:4px;align-items:flex-start;">
     <div style="flex:7;min-width:0;">…main…</div>
     <div style="flex:3;min-width:0;">…sidebar…</div>
   </div>
   ```
   → after the `36px` gap: main ≈ `467.6px`, sidebar ≈ `200.4px`.

3. **Entry rows — index.html:2658, 2660, 2663, 2665**
   - Fixed date cell: `width:70px; flex:0 0 70px;` and entry `gap:14px`
   - So content area inside an Experience row ≈ `467.6 − 14 − 70 ≈ 383.6px`.

4. **PDF rasterization — index.html:2728-2731** (`renderMinimalResumePDF`)
   ```js
   await pdf.html(el, {
     html2canvas: { scale: 612/816, ... },
     x: 0, y: 0, width: 612, windowWidth: 816,
     autoPaging: 'slice'
   });
   ```
   → window is `816px`, output `612pt`, scale `0.75`. Correct and unchanged.

5. **No `<style>` rule targets the wrap.** The only `max-width:780px` (line 68) is on the page `.wrapper`, which doesn't contain the off-screen render hider (`position:fixed; left:-9999px;` at line 2722). The render is not constrained by any external CSS.

**Conclusion:** nothing in the diff vs `1896682` reduced column width. The wrap, padding, flex ratio, gap, and the fixed-70px date cell are all unchanged.

---

## STEP 4 — `fixGluedSkills` and its bypass paths

**Definition — index.html:2008–2018**
```js
function fixGluedSkills(s) {
  if (!s) return s || '';
  let out = s.replace(GLUED_SKILL_TOKEN, (tok) => {
    if (GLUED_SKILL_PRESERVE.includes(tok)) return tok;
    return tok.replace(/([a-z])([A-Z])/g, (m, a, b) => `${a} ${b.toLowerCase()}`);
  });
  for (const [glued, fixed] of GLUED_SKILL_LOWER) {
    out = out.replace(new RegExp(`\\b${glued}\\b`, 'g'), fixed);
  }
  return out;
}
```
The lowercase-only fallback list (line 1997) explicitly contains `['Teamleadership','Team leadership']`, so the function **does** fix that token when it reaches it.

**Only two call sites exist in the whole file:**

| line | caller | template | what it touches |
|---|---|---|---|
| 2023 | `modernSplitList` | Modern template | Skills/list lines only |
| 2549 | `splitSkills`     | Minimal template | Skills/list lines only |

In Minimal, `splitSkills` is wired up in only two `else if` branches (lines 2581–2594):
- `/technical|tools|software/` → "Technical skills" sidebar
- `/skills?/`                  → "Key skills" sidebar

**Every other content stream in Minimal bypasses `fixGluedSkills`:**

| Content | Parser | Renderer | Fixes glued? |
|---|---|---|---|
| Profile/Summary (`profileLines`) | none — raw | line 2713 `profileLines.map(l => md(l))` | **No** |
| Experience bullets | `parseEntries` 2491–2528 (only `strip`) | `renderBullets` 2647–2655 → `md(it)` | **No** |
| Education entries / titles / bullets | `parseEntries` | `renderEntry` mode `edu` | **No** |
| Courses / Certifications | `parseEntries` | `renderEntry` mode `course` | **No** |
| References | raw blocks 2628–2637 | `renderRefs` 2669–2687 → `esc` only | **No** |
| Personal Info pairs | `parsePairs` 2558–2562 | `renderPairs` 2689 → `esc` | **No** |
| Languages | `parseLangs` 2530–2544 | `renderLangs` 2691 → `esc` | **No** |

So if "Teamleadership" appears in the **Summary** or anywhere inside an **Experience / Education / Course bullet**, it is never passed through `fixGluedSkills`. The helper works — it just isn't reached on those paths.

---

## STEP 5 — Numbered findings

### 1. Section heads were shrunk after `1896682`  *(high confidence this is real, medium confidence it explains your visual complaint)*
- **Lines:** 2640–2645
- **Current:** icon `22px`, label `13px`, gap `9px`, margin `13px 0 3px`, letter-spacing `0.2px`
- **`1896682`:** icon `28px`, label `16px`, gap `11px`, margin `14px 0 3px`, no letter-spacing
- **Effect:** smaller heads = LESS vertical space, not more. This is the only structural visual delta since the good commit. Reverting these five values would restore the previous header weight and rhythm. It cannot explain "references pushed to page 2" (smaller heads should make MORE fit, not less) — so if you reverted this and the issue persists, the cause is elsewhere.
- **Confidence the visible header-rhythm change comes from this:** **High**
- **Confidence this fixes the "references on page 2" issue:** **Low** (direction is wrong)

### 2. Summary line-height tightened from `1.5` → `1.45`  *(high confidence as the diff, low confidence as the cause)*
- **Line:** 2713
- **Current:** `line-height:1.45`
- **`1896682`:** `line-height:1.5`
- **Effect:** ~3% tighter summary block. Direction is fit-MORE on page 1, opposite of the "references push to page 2" symptom.
- **Confidence:** **High** that this is the only summary change; **Low** that reverting it will resolve any visible issue.

### 3. Column widths haven't changed — narrowness is not from a code regression  *(high confidence)*
- **Lines:** 2705 (`width:816px; padding:36px 56px 24px`) and 2715 (`flex:7` main / `flex:3` sidebar, `gap:36px`).
- **Current:** identical to `1896682`.
- **What it should say:** unchanged — no edit warranted from a diff perspective.
- **Possible real cause (outside the diff):** if the visual feels narrow, that is the configured layout — `flex:7/3` gives ~468px / ~200px content columns inside a 704px usable width. If you want wider main, change `flex:7` → e.g. `flex:8` or shrink `padding:... 56px ...` → e.g. `40px`, or reduce `gap:36px`. But these are design choices, not regressions.
- **Confidence reverting code fixes this:** **High that no revert helps** — the columns are at the same widths they were on `1896682`.

### 4. "Teamleadership" glue persists because `fixGluedSkills` only runs on the Skills/Technical-skills paths  *(high confidence)*
- **Definition line:** 2008
- **Call sites:** 2023 (Modern), 2549 (Minimal `splitSkills` only)
- **Bypassed Minimal paths:** Summary render (2713), `parseEntries` bullets (2491–2528 → rendered at 2647–2665), `renderRefs` (2669–2687), `parsePairs` (2558–2562), `parseLangs` (2530–2544).
- **What it likely should say:** thread `fixGluedSkills` into the bypassed paths. Minimum two edits to cover the realistic locations of the bug:
  - line 2713 — wrap each summary line: `profileLines.map(l => md(fixGluedSkills(l))).join(' ')`
  - line 2499 / 2503 — in `parseEntries`, run bullets through `fixGluedSkills` before pushing: `cur.items.push(fixGluedSkills(strip(ln)))`, and also pass `ln` through it on the header-style branch at 2502.
  - Optional but cheap: also wrap `renderRefs` line bodies (lines 2679/2682) so reference blocks don't leak glued tokens.
- **Confidence:** **High** that this is the bypass and that wrapping these paths in `fixGluedSkills` will fix the "Teamleadership" bug wherever it appears outside the skills sidebar.

### 5. "Some bullets wrap awkwardly" — no width or font change explains it in the diff  *(low confidence anything in code caused this)*
- The only typography change in this function is the summary `line-height` (item 2). Bullet rendering (`renderBullets`, line 2647–2655) is byte-identical to `1896682`: `font-size:11px; line-height:1.45;`. The entry container at 2665 is also unchanged with `line-height:1.5`. If wrapping looks different, it is not from a delta in this function — possibilities include different input text from a new prompt tailoring (the unrelated change at lines 1548–1561 strengthens JD-mirroring, so the model may now produce longer/different phrases), or browser/renderer variance in jsPDF/html2canvas.
- **Confidence a code revert here fixes wrapping:** **Low**

---

## Summary table

| # | Issue | Code change since 1896682? | Recommended action | Confidence fix resolves user-visible issue |
|---|---|---|---|---|
| 1 | Section heads smaller | **Yes**, lines 2640–2645 | Revert head() to 1896682 values | High (header look) / Low (page-break) |
| 2 | Summary `line-height` | **Yes**, line 2713 | Optional revert 1.45 → 1.5 | Low |
| 3 | Columns appear narrow | **No** | None — layout unchanged | High no-fix needed |
| 4 | "Teamleadership" glued | **No** (pre-existing) | Add `fixGluedSkills` calls at 2499/2503 (bullets) and 2713 (summary) | High |
| 5 | Awkward bullet wrap | **No** | None from this diff | Low |

The "references pushed to page 2" symptom is not explained by anything in the diff. Both code changes since `1896682` shrink vertical space and should make MORE fit on page 1, not less. If references are now overflowing, the most likely culprit is **different input content** (e.g. longer Experience bullets coming from the stronger JD-mirroring prompt at lines 1548–1561) rather than a layout regression. Confirm by re-running with the prior shorter summary/bullet content and seeing if the overflow persists.
