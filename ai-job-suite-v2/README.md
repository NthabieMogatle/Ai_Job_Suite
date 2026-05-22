# Élève AI Job Suite — v2 Redesign

Premium Next.js redesign of [ai-job-suite.vercel.app](https://ai-job-suite.vercel.app).

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local
# Then add your ANTHROPIC_API_KEY to .env.local

# 3. Run dev server
npm run dev
# → http://localhost:3000
```

## What needs to be swapped before deploying

| Item | Location | What to do |
|------|----------|------------|
| `ANTHROPIC_API_KEY` | `.env.local` | Add your Anthropic API key |
| Gumroad URL | `components/Navigation.tsx`, `Hero.tsx`, `Pricing.tsx`, `Footer.tsx`, `Generator.tsx` — search `GUMROAD_URL` | Already correct: `https://elevehired.gumroad.com/l/pllrsk` |
| Supabase keys | `Generator.tsx` → `SUPABASE_URL` / `SUPABASE_KEY` | Already matches original — or move to env vars |
| EmailJS keys | `Generator.tsx` → `EMAILJS_SERVICE`, `EMAILJS_TEMPLATE`, `EMAILJS_KEY` | Already matches original — or move to env vars |
| Testimonials | `components/Testimonials.tsx` | **PLACEHOLDER** — replace with verified real reviews |
| Social proof stats | Not shown in hero by default — add when real numbers are known | |

## What's real vs placeholder

| Feature | Status |
|---------|--------|
| Cover letter generation | ✅ Real (same API + prompts as original) |
| Resume generation | ✅ Real (same API + prompts as original) |
| LinkedIn summary generation | ✅ Real (same API + prompts as original) |
| ATS Score Analysis | ✅ Real (same prompts as original) |
| Interview Prep | ✅ Real (same prompts as original) |
| LinkedIn Profile Tips | ✅ Real |
| Email verification | ✅ Real (EmailJS — same service as original) |
| Usage tracking | ✅ Real (Supabase — same DB as original) |
| Paywall (2 free uses) | ✅ Real |
| Premium unlock code `AIJOBPRO` | ✅ Real |
| PDF download (cover letter) | ✅ Real (jsPDF) |
| PDF download (resume) | ✅ Real (jsPDF + html2canvas, Modern template) |
| Executive & Elegant templates | ⚠️ Partially — locked UI works, HTML builder uses Modern fallback |
| Testimonials | ❌ **PLACEHOLDER** — fabricated for demo |

## Design

**Theme:** Obsidian & Electric — deep dark (#06070F) with electric violet (#7B6FFF) accent.
Inspired by Linear, Superhuman, Vercel.

**Fonts:** Space Grotesk (display) + Inter (body) via Google Fonts.

**Animations:** Framer Motion — scroll-triggered fade-ups, hero float animation, ATS bar animations, tab transitions, FAQ accordion.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **PDF:** jsPDF + html2canvas
- **Email verification:** @emailjs/browser
- **Usage tracking:** @supabase/supabase-js
- **AI:** Anthropic API (Claude Haiku) via `/api/generate`

## Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy

The `/api/generate` route is a Next.js API route — no separate serverless config needed.
