'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download, RefreshCw, ChevronDown, ChevronUp, Lock } from 'lucide-react';

/* ── Constants ─────────────────────────────────────── */
const GUMROAD_URL = 'https://elevehired.gumroad.com/l/pllrsk';
const SUPABASE_URL = 'https://roqhmdqrgovnqjiuoewe.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cC8Fx8q75VUwEXU_x4sx9g__Iw7aS79';
const FREE_LIMIT = 2;
const EMAILJS_SERVICE = 'service_4bkmqeg';
const EMAILJS_TEMPLATE = 'template_49ddkup';
const EMAILJS_KEY = '8mhCLy-idE4gomsX2';

/* ── Types ─────────────────────────────────────────── */
type Tab = 'cover' | 'resume' | 'linkedin';
type Tone = string;

interface ATSScore {
  overall: number;
  keyword_match: number;
  format_score: number;
  impact_score: number;
  label: string;
  tips: string;
}

interface InterviewQuestion {
  question: string;
  framework: string;
  example: string;
}

/* ── Helpers ───────────────────────────────────────── */
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(email)) return false;
  const fakeDomains = ['test.com','fake.com','example.com','mailinator.com','guerrillamail.com','tempmail.com','throwaway.com','yopmail.com','trashmail.com'];
  const domain = email.split('@')[1]?.toLowerCase() || '';
  if (fakeDomains.includes(domain)) return false;
  const local = email.split('@')[0]?.toLowerCase() || '';
  const domainName = domain.split('.')[0] || '';
  if (local === domainName) return false;
  if (/^(.)\1{2,}/.test(local)) return false;
  if (/^(test|fake|asdf|qwerty|admin|null|none|noemail|nope|blah|dummy|temp|user|hello|hi|yo|abc|xyz|foo|bar|random|sample|email|myemail|name|noone|nobody|someone|anyone|person|guy|girl|man|woman|john|jane|donotreply|noreply|spam|junk|trash|delete|ignore|skip)/.test(local)) return false;
  return true;
}

function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') return 'ssr';
  const saved = localStorage.getItem('aiJobSuiteDeviceId');
  if (saved) return saved;
  const signals = [navigator.userAgent, navigator.language, `${screen.width}x${screen.height}`, String(screen.colorDepth), String(new Date().getTimezoneOffset()), String(navigator.hardwareConcurrency || ''), navigator.platform || ''].join('|');
  let hash = 0;
  for (let i = 0; i < signals.length; i++) { hash = ((hash << 5) - hash) + signals.charCodeAt(i); hash |= 0; }
  const id = 'dev_' + Math.abs(hash).toString(36);
  localStorage.setItem('aiJobSuiteDeviceId', id);
  return id;
}

/* ── API Call ──────────────────────────────────────── */
async function callAPI(prompt: string, maxTokens = 2500): Promise<string> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `Error ${res.status}`); }
  const data = await res.json();
  return Array.isArray(data.content) ? data.content.map((i: { text?: string }) => i.text || '').join('') : '';
}

/* ── Prompts (verbatim from original) ─────────────── */
function coverLetterPrompt(name: string, job: string, company: string, desc: string, skills: string, tone: string): string {
  return `Write a ${tone}, ATS-optimized, recruiter-focused cover letter for ${name} applying for the ${job} role at ${company}.

IMPORTANT INSTRUCTIONS:
- Keep the cover letter between 120–180 words (concise and impactful)
- Make it sound confident and slightly senior-level (not beginner or desperate)
- Focus on VALUE and impact, not just listing responsibilities
- Use strong action verbs relevant to the ${job} industry (e.g. for tech: built, deployed, debugged; for healthcare: supported, assessed, coordinated; for finance: analysed, reconciled, forecasted)
- Avoid fluff, repetition, and generic phrases
- Do NOT include placeholders or brackets
- Start with a strong, natural opening that immediately shows value or relevance to the role
- Avoid common or overused phrases (e.g. "I am excited to apply", "I am writing to express", "I am passionate about")
- Write like a real candidate speaking confidently
- Naturally include relevant keywords from this job description: ${desc || 'not provided'}
- Do NOT include placeholder text such as [Your Name], [Date], [Email]

WRITING STYLE — CRITICAL FOR SOUNDING HUMAN:
- Mix short punchy sentences with longer descriptive ones — vary the rhythm throughout
- NEVER use these words: delve, leverage, robust, navigate, tapestry, underscore, furthermore, moreover, utilize, synergy, holistic, streamline, spearhead, orchestrate
- Replace with plain words ("use" not "utilize", "lead" not "spearhead", "also" not "furthermore")
- NO em dashes (—) — use commas or full stops instead
- Avoid "X, Y, and Z" three-item list patterns — vary how you express multiple things
- Do not start consecutive sentences the same way
- Write the way a confident real person writes, not how an AI generates text

CANDIDATE DETAILS:
- Name: ${name}
- Role: ${job}
- Company: ${company}
- Skills: ${skills}

Output only the final cover letter text.`;
}

function linkedinPrompt(name: string, job: string, skills: string, goal: string, tone: string): string {
  return `Write a ${tone} LinkedIn "About" section for ${name}, a ${job}.

RULES:
- 3-4 short paragraphs, max 300 words total
- First line must be a strong hook — not "I am a..." — make it memorable and specific
- Write in first person
- Paragraph 1: Who they are and what they do (hook + value specific to ${job} field)
- Paragraph 2: Key skills and what makes them stand out in the ${job} industry
- Paragraph 3: Career goal / what they are looking for
- Paragraph 4 (optional): A human touch — passion, values, or personality
- End with a clear call to action
- Do NOT use hashtags, emojis, or bullet points

WRITING STYLE — NON-NEGOTIABLE:
- Mix short punchy sentences with longer ones — vary the rhythm deliberately
- BANNED WORDS — never use any of these: delve, leverage, robust, navigate, tapestry, underscore, furthermore, moreover, utilize, synergy, holistic, streamline, spearhead, orchestrate, multifaceted, transformative, cutting-edge, dynamic, innovative
- NO em dashes (—) — use commas or full stops instead
- Write the way a confident real person talks — not how an AI generates text

CANDIDATE DETAILS:
- Name: ${name}
- Role: ${job}
- Skills & experience: ${skills}
- Career goal: ${goal || 'open to new opportunities'}

Output ONLY the final LinkedIn summary text. No labels, no preamble.`;
}

function resumePrompt(fields: ResumeFields, tone: string): string {
  const { name, job, email, phone, location, edu, skills, desc, exp, languages, references } = fields;
  return `Create a ${tone}, ATS-optimized, recruiter-focused resume for ${name} targeting a ${job} role.

CRITICAL RULES — MUST FOLLOW:
- NEVER output the words "ATS KEYWORDS" anywhere in the resume
- NEVER repeat sections — each section appears ONCE only
- NEVER write long paragraphs in the experience section — use bullet points ONLY
- Output in clean plain text with NO markdown symbols (no **, ##, --, etc.)
- Do NOT include placeholders or fake companies, dates, or degrees
- COPY the candidate's Name, Email, Phone, and Location EXACTLY as provided in CANDIDATE DETAILS.
- Keep the entire resume under 500 words. Count words; do not exceed.

TAILORING TO JOB DESCRIPTION:
${desc ? `A job description was provided below. Use its specific terminology throughout.

JOB DESCRIPTION:
${desc}` : 'No job description was provided — write a strong general-purpose resume for the target role.'}

STRUCTURE (use exactly these section headers, each appearing ONCE):
1. [Candidate name on first line]
2. [Job title on second line]
3. [Phone | Email | Location on third line]
4. PROFESSIONAL SUMMARY
5. TECHNICAL SKILLS
6. TECHNICAL EXPERIENCE
7. EDUCATION
8. LANGUAGES (only if content provided below)
9. REFERENCES (only if content provided below)

EXPERIENCE FORMATTING RULES:
- Each role/project has its own title on its own line
- Use bullet points (starting with -) for ALL experience descriptions
- Each bullet must be 18 words or fewer, starting with a strong action verb
- Maximum 3 bullets per role

PROFESSIONAL SUMMARY:
- 2-3 sentences AND no more than 60 words total, paragraph only.

TECHNICAL SKILLS:
- Maximum 8 skills, comma-separated

WRITING STYLE:
- NEVER use: delve, leverage, robust, navigate, tapestry, underscore, furthermore, moreover, utilize, synergy
- NO em dashes (—) anywhere
- Write the way a real professional describes their work

CANDIDATE DETAILS:
- Name: ${name}
- Target Role: ${job}
- Email: ${email || 'not provided'}
- Phone: ${phone || 'not provided'}
- Location: ${location || 'not provided'}
- Education: ${edu || 'not provided'}
- Skills: ${skills}
- Experience/Projects: ${exp || 'not provided'}
- Languages: ${languages || 'not provided'}
- References: ${references || 'not provided'}

Output ONLY the final resume text. No labels, no explanations.`;
}

function atsScorePrompt(resumeText: string, jobTitle: string, jobDesc: string): string {
  return `You are an ATS (Applicant Tracking System) expert. Analyse this resume for the role of "${jobTitle}"${jobDesc ? ' with this job description: ' + jobDesc : ''}.

RESUME:
${resumeText}

Respond ONLY with valid JSON in this exact format, no other text:
{
  "overall": 82,
  "keyword_match": 78,
  "format_score": 90,
  "impact_score": 76,
  "label": "Strong Match",
  "tips": "1. Add more specific keywords like X and Y from the job description.\\n2. Quantify your achievements with numbers where possible.\\n3. Ensure your contact info is on the first line for ATS parsing."
}`;
}

function interviewPrompt(prefix: string, jobTitle: string, jobDesc: string, docText: string): string {
  const jobLower = jobTitle.toLowerCase();
  let industryCtx = `${jobTitle} field. Use terminology and scenarios specific and relevant to this role.`;
  if (/software|developer|engineer|programmer|coding|tech|devops|fullstack|frontend|backend|data|cloud|cyber|it support/.test(jobLower)) industryCtx = 'Tech/Software. Ask about specific technologies, debugging processes, system design decisions, code reviews, and delivery under deadlines.';
  else if (/nurs|doctor|healthcare|medical|clinical|patient|health|pharmacy|therapist|care worker/.test(jobLower)) industryCtx = 'Healthcare. Ask about patient care, clinical protocols, handling emergencies, working in a team under pressure, and documentation.';
  else if (/financ|account|analyst|auditor|banker|investment|tax|budget/.test(jobLower)) industryCtx = 'Finance/Accounting. Ask about financial analysis, accuracy under pressure, regulatory compliance, reporting, and working with numbers.';
  else if (/market|social media|content|brand|seo|campaign|digital|advertis/.test(jobLower)) industryCtx = 'Marketing. Ask about campaign strategy, measuring ROI, content creation, brand consistency, and adapting to data.';
  else if (/teach|educat|tutor|instructor|lecturer|school|curriculum/.test(jobLower)) industryCtx = 'Education. Ask about lesson planning, student engagement, classroom challenges, assessment, and working with parents or staff.';

  return `You are an expert career coach specialising in ${jobTitle} roles. Based on this ${prefix === 'rv' ? 'resume' : 'cover letter'} for a "${jobTitle}" role, generate exactly 5 highly specific interview questions with answer guidance.

INDUSTRY CONTEXT: ${industryCtx}

DOCUMENT:
${docText}
${jobDesc ? 'JOB DESCRIPTION: ' + jobDesc : ''}

Respond ONLY with valid JSON in this exact format, no other text:
{
  "questions": [
    {
      "question": "Specific industry-relevant question here?",
      "framework": "1-2 sentence practical guide on how to structure the answer",
      "example": "2-3 sentence tailored sample answer using the candidate's actual background"
    }
  ]
}

RULES:
- Generate exactly 5 questions specific to ${jobTitle} industry and this candidate
- Mix behavioural, technical and situational questions
- Every question must reference actual skills or context from the document
- Sample answers must sound human: vary sentence length, no em dashes, avoid leverage/delve/robust/utilize/moreover`;
}

function linkedinTipsPrompt(jobTitle: string, summaryText: string): string {
  return `You are a LinkedIn expert. Based on this LinkedIn summary for a ${jobTitle}, give 5 specific, actionable tips to improve their LinkedIn profile beyond just the About section.

SUMMARY:
${summaryText}

Give tips on:
1. Profile headline — how to make it stand out for ${jobTitle} roles
2. Featured section — what to add (projects, posts, portfolio)
3. Skills section — top 5 skills to add for ${jobTitle} that recruiters search for
4. Connection strategy — who to connect with in the ${jobTitle} field
5. Content tip — what type of posts to share to get noticed by recruiters

WRITING STYLE:
- Keep each tip SHORT and actionable — 1-2 sentences max
- Plain direct language — no corporate jargon
- NO em dashes, NO "leverage", "robust", "synergy" or AI buzzwords

Format as plain text with numbered tips. No headers, no bullet points within tips.
Output ONLY the 5 tips.`;
}

function improveResumePrompt(currentResume: string, tips: string): string {
  return `You are an expert resume writer. Improve this resume based on the ATS improvement tips provided.

CURRENT RESUME:
${currentResume}

IMPROVEMENT TIPS TO APPLY:
${tips}

RULES:
- Apply all the improvement tips to the resume
- Keep the same structure and sections
- Keep it in clean plain text, no markdown
- Do NOT add fake companies, dates or credentials not in the original
- Each experience section must use bullet points starting with -
- Keep under 600 words
- Output ONLY the improved resume text`;
}

/* ── PDF Generation (using jsPDF CDN globals) ─────── */
interface ResumeFields { name: string; job: string; email: string; phone: string; location: string; edu: string; skills: string; desc: string; exp: string; languages: string; references: string; }

function escapeHTML(s: string | null | undefined): string {
  return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

async function downloadCoverLetterPDF(text: string, name: string, job: string, company: string): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF('p','pt','letter');
  const pageWidth = doc.internal.pageSize.getWidth();
  const L = 72, R = pageWidth - 72, W = R - L;
  doc.setFillColor(12,14,26); doc.rect(0,0,pageWidth,80,'F');
  doc.setFillColor(123,111,255); doc.rect(0,78,pageWidth,3,'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(255,255,255);
  doc.text((name || 'Cover Letter').toUpperCase(), L, 38);
  doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.setTextColor(168,146,255);
  if (job && company) doc.text(`${job} · ${company}`, L, 58);
  let y = 110;
  const lines = text.split('\n').filter(l => l.trim());
  lines.forEach(line => {
    if (y > 730) { doc.addPage(); y = 60; }
    doc.setFont('helvetica','normal'); doc.setFontSize(10.5); doc.setTextColor(40,40,40);
    const wrapped = doc.splitTextToSize(line, W);
    wrapped.forEach((wl: string) => { if (y > 730) { doc.addPage(); y = 60; } doc.text(wl, L, y); y += 16; });
    y += 6;
  });
  doc.setFillColor(123,111,255); doc.rect(0, doc.internal.pageSize.getHeight() - 20, pageWidth, 3, 'F');
  doc.save('cover-letter.pdf');
}

function buildModernResumeHTML(parsed: ParsedResume): string {
  const { name, subtitle, contact, sections } = parsed;
  const NAVY = '#1c2e4a', INK = '#334155', MUTED = '#64748b';
  const contactItems = splitContact(contact);
  const skills = splitSkills(sections[findSection(sections, /SKILL/)] || []);
  const langs = splitSkills(sections[findSection(sections, /LANGUAGE/)] || []);
  const edu = parseEntries(sections[findSection(sections, /^EDUCATION$/)] || []);
  const exp = parseEntries(sections[findSection(sections, /EXPERIENCE|PROJECT/)] || []);
  const summary = (sections[findSection(sections, /SUMMARY|PROFILE|ABOUT/)] || []).join(' ').trim();
  const refsRaw = sections[findSection(sections, /REFERENCE/)] || [];
  const nameLen = (name || '').length;
  const nameSize = nameLen > 30 ? 26 : nameLen > 24 ? 30 : nameLen > 18 ? 34 : 40;

  const sideHead = (label: string) => `<div style="margin:0 0 10px 0;padding-bottom:5px;border-bottom:1.5px solid ${NAVY};"><h3 style="font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:800;color:${NAVY};text-transform:uppercase;letter-spacing:2.5px;margin:0;">${label}</h3></div>`;
  const mainHead = (label: string) => `<div style="margin:0 0 11px 0;padding-bottom:6px;border-bottom:1.5px solid ${NAVY};"><h2 style="font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:800;color:${NAVY};text-transform:uppercase;letter-spacing:3px;margin:0;">${label}</h2></div>`;
  const renderEntry = (item: ResumeEntry) => `<div style="margin-bottom:13px;page-break-inside:avoid;"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:2px;"><h3 style="font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;color:${NAVY};margin:0;line-height:1.3;">${escapeHTML(item.title)}</h3>${item.dates ? `<span style="font-size:10px;color:${MUTED};white-space:nowrap;font-weight:500;">${escapeHTML(item.dates)}</span>` : ''}</div>${item.metaLines.map(m => `<div style="font-size:10.5px;color:${INK};font-weight:500;line-height:1.4;margin-top:2px;">${escapeHTML(m)}</div>`).join('')}${item.bullets.length ? `<ul style="margin:5px 0 0 0;padding:0;list-style:none;">${item.bullets.map(b => `<li style="position:relative;padding-left:12px;margin-bottom:3px;font-size:10.5px;line-height:1.55;color:${INK};"><span style="position:absolute;left:0;top:7px;width:4px;height:4px;background:${NAVY};border-radius:50%;"></span>${escapeHTML(b)}</li>`).join('')}</ul>` : ''}</div>`;

  return `<div style="width:816px;background:#fff;font-family:Helvetica,Arial,sans-serif;color:${INK};font-size:11px;line-height:1.5;box-sizing:border-box;"><header style="padding:38px 56px 14px 56px;"><h1 style="font-family:Helvetica,Arial,sans-serif;font-size:${nameSize}px;font-weight:800;color:${NAVY};text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px 0;line-height:1;">${escapeHTML(name)}</h1>${subtitle ? `<p style="font-size:13px;font-weight:500;color:${NAVY};text-transform:uppercase;letter-spacing:0.2em;margin:0 0 12px 0;">${escapeHTML(subtitle)}</p>` : ''}<div style="height:1.5px;background:${NAVY};width:100%;"></div></header><div style="padding:22px 56px 30px 56px;"><div style="display:flex;gap:36px;align-items:flex-start;"><div style="width:220px;flex-shrink:0;">${contactItems.length ? `<section>${sideHead('Contact')}${contactItems.map(c => `<div style="font-size:10.5px;color:${INK};line-height:1.5;margin-bottom:5px;word-break:break-word;">${escapeHTML(c)}</div>`).join('')}</section>` : ''}</div><div style="flex:1;min-width:0;">${summary ? `<section style="page-break-inside:avoid;">${mainHead('Profile')}<p style="margin:0;font-size:11px;line-height:1.6;color:${INK};">${escapeHTML(summary)}</p></section>` : ''}</div></div><div style="display:flex;gap:36px;align-items:flex-start;margin-top:22px;"><div style="width:220px;flex-shrink:0;">${skills.length ? `<section style="margin-bottom:20px;">${sideHead('Skills')}${skills.map(s => `<div style="display:flex;gap:7px;margin-bottom:4px;font-size:10.5px;color:${INK};line-height:1.45;"><span style="display:inline-block;width:4px;height:4px;background:${NAVY};border-radius:50%;margin-top:6px;flex-shrink:0;"></span><span>${escapeHTML(s)}</span></div>`).join('')}</section>` : ''}${langs.length ? `<section>${sideHead('Languages')}${langs.map(l => `<div style="display:flex;gap:7px;margin-bottom:4px;font-size:10.5px;color:${INK};line-height:1.45;"><span style="display:inline-block;width:4px;height:4px;background:${NAVY};border-radius:50%;margin-top:6px;flex-shrink:0;"></span><span>${escapeHTML(l)}</span></div>`).join('')}</section>` : ''}</div><div style="flex:1;min-width:0;">${exp.length ? `<section>${mainHead('Experience')}${exp.map(renderEntry).join('')}</section>` : ''}</div></div><div style="display:flex;gap:36px;align-items:flex-start;margin-top:22px;"><div style="width:220px;flex-shrink:0;">${refsRaw.length ? `<section>${sideHead('Reference')}<div style="font-size:10.5px;color:${INK};line-height:1.5;">${refsRaw.map((r,i) => { const isNew = i>0 && !r.includes('@') && !/^\+?\d/.test(r) && !/\d{4}/.test(r) && r.length<50; return `<div style="margin-bottom:3px;${isNew?'margin-top:10px;':''}">${escapeHTML(r)}</div>`; }).join('')}</div></section>` : ''}</div><div style="flex:1;min-width:0;">${edu.length ? `<section style="page-break-inside:avoid;">${mainHead('Education')}${edu.map(renderEntry).join('')}</section>` : ''}</div></div></div></div>`;
}

/* ── Resume parsing helpers ────────────────────────── */
interface ResumeEntry { title: string; dates: string; metaLines: string[]; bullets: string[]; }
interface ParsedResume { name: string; subtitle: string; contact: string; sections: Record<string, string[]>; }

const SECTION_HEADERS = ["PROFESSIONAL SUMMARY","SUMMARY","PROFILE","ABOUT","ABOUT ME","OBJECTIVE","TECHNICAL SKILLS","SKILLS","TECHNICAL EXPERIENCE","WORK EXPERIENCE","EXPERIENCE","PROJECTS","EDUCATION","CERTIFICATIONS","CERTIFICATIONS & TRAINING","LANGUAGES","LANGUAGE","REFERENCES","REFERENCE"];
const DATE_ONLY_RE = /^[\s,()|·]*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+)?\d{4}\s*[-–—]?\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+)?(?:\d{4}|present|now|current)?[\s,()|·]*$/i;

function isHeading(line: string): boolean { return SECTION_HEADERS.includes(String(line||'').toUpperCase().replace(/[^A-Z &]/g,'').trim()); }

function parseResumeText(rawText: string): ParsedResume {
  const rawLines = rawText.split('\n').map(l=>l.trim()).filter(Boolean);
  const name = rawLines[0] || 'Your Name';
  let subtitleIdx=-1, contactIdx=-1;
  for (let i=1;i<Math.min(5,rawLines.length);i++) {
    const l=rawLines[i];
    if (isHeading(l)) break;
    const isContact=l.includes('|')||l.includes('@')||/^\+?\d/.test(l)||/^\(\d/.test(l);
    if (!isContact && subtitleIdx===-1) subtitleIdx=i;
    else if (isContact && contactIdx===-1) contactIdx=i;
  }
  const subtitle=subtitleIdx>-1?rawLines[subtitleIdx]:'';
  const contact=contactIdx>-1?rawLines[contactIdx]:'';
  const bodyStart=Math.max(subtitleIdx,contactIdx)+1||2;
  const sections: Record<string,string[]>={};
  let current: string|null=null;
  rawLines.slice(bodyStart).forEach(line=>{
    if (isHeading(line)) { current=line.toUpperCase().replace(/[^A-Z &]/g,'').trim(); sections[current]=[]; }
    else if (current) sections[current].push(line);
  });
  return {name,subtitle,contact,sections};
}

function findSection(sections: Record<string,string[]>, regex: RegExp): string { return Object.keys(sections).find(k=>regex.test(k.toUpperCase()))||''; }
function splitContact(contact: string): string[] { return String(contact||'').split(/\s*[|·•]\s*/).map(s=>s.trim()).filter(Boolean); }
function splitSkills(lines: string[]): string[] {
  const out: string[]=[];
  (lines||[]).forEach(line=>{ String(line||'').replace(/^[-•▸◆]\s*/,'').split(/[,;|]/).forEach(s=>{ const t=s.trim(); if(t) out.push(t); }); });
  return out;
}

function parseEntries(lines: string[]): ResumeEntry[] {
  const items: ResumeEntry[]=[]; let cur: ResumeEntry|null=null;
  const flush=()=>{ if(cur){items.push(cur);cur=null;} };
  const isBullet=(l:string)=>/^\s*[-•▸◆▪]\s+/.test(l);
  for (const raw of (lines||[])) {
    const line=String(raw||'').trim(); if(!line) continue;
    if(isBullet(line)) { if(!cur) cur={title:'',dates:'',metaLines:[],bullets:[]}; cur.bullets.push(line.replace(/^\s*[-•▸◆▪]\s+/,'').trim()); continue; }
    const justDate=DATE_ONLY_RE.test(line);
    if(!cur||cur.bullets.length>0) {
      flush(); cur={title:'',dates:'',metaLines:[],bullets:[]};
      const m=line.match(/^(.+?)\s*(?:\||—|–)\s*([^|—–]*\d{4}[^|—–]*)\s*$/);
      if(m){cur.title=m[1].trim();cur.dates=m[2].trim();} else if(justDate){cur.dates=line;} else{cur.title=line;}
    } else if(justDate && !cur.dates){cur.dates=line.replace(/[()]/g,'').trim();} else{cur.metaLines.push(line);}
  }
  flush(); return items;
}

async function downloadResumePDF(resumeText: string, template: string): Promise<void> {
  const parsed = parseResumeText(resumeText);
  const html = buildModernResumeHTML(parsed);
  const { jsPDF } = await import('jspdf');
  const { default: html2canvas } = await import('html2canvas');
  const container = document.createElement('div');
  container.style.cssText = 'position:absolute;left:-9999px;top:0;width:816px;background:#fff;z-index:-1;';
  container.innerHTML = html;
  document.body.appendChild(container);
  await new Promise(r => setTimeout(r, 600));
  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ unit: 'pt', format: 'letter', orientation: 'portrait' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
    pdf.save(`${template || 'resume'}.pdf`);
  } finally {
    container.remove();
  }
}

/* ── EmailJS ───────────────────────────────────────── */
async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    const emailjs = await import('@emailjs/browser');
    emailjs.init(EMAILJS_KEY);
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, { to_email: email, code });
    return true;
  } catch { return false; }
}

/* ── Supabase usage tracking ───────────────────────── */
async function checkRemoteUsage(email: string): Promise<number> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Email%20Usage?email=eq.${encodeURIComponent(email)}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return -1;
    const data = await res.json();
    return data.length > 0 ? data[0].usage_count : 0;
  } catch { return -1; }
}

async function incrementRemoteUsage(email: string, currentCount: number): Promise<void> {
  try {
    if (currentCount === 0) {
      await fetch(`${SUPABASE_URL}/rest/v1/Email%20Usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'return=minimal' },
        body: JSON.stringify({ email, usage_count: 1 }),
      });
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/Email%20Usage?email=eq.${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        body: JSON.stringify({ usage_count: currentCount + 1 }),
      });
    }
  } catch { /* ignore */ }
}

/* ══════════════════════════════════════════════════
   Main Generator Component
══════════════════════════════════════════════════ */
export default function Generator() {
  const [activeTab, setActiveTab] = useState<Tab>('cover');

  // Cover letter form
  const [clName, setClName] = useState('');
  const [clJob, setClJob] = useState('');
  const [clCompany, setClCompany] = useState('');
  const [clDesc, setClDesc] = useState('');
  const [clSkills, setClSkills] = useState('');
  const [clEmail, setClEmail] = useState('');
  const [clTone, setClTone] = useState('professional');

  // Resume form
  const [rvName, setRvName] = useState('');
  const [rvJob, setRvJob] = useState('');
  const [rvEmail, setRvEmail] = useState('');
  const [rvPhone, setRvPhone] = useState('');
  const [rvLocation, setRvLocation] = useState('');
  const [rvEdu, setRvEdu] = useState('');
  const [rvSkills, setRvSkills] = useState('');
  const [rvDesc, setRvDesc] = useState('');
  const [rvExp, setRvExp] = useState('');
  const [rvLanguages, setRvLanguages] = useState('');
  const [rvReferences, setRvReferences] = useState('');
  const [rvAccessEmail, setRvAccessEmail] = useState('');
  const [rvTone, setRvTone] = useState('clean and professional');
  const [rvTemplate, setRvTemplate] = useState('modern');
  const [rvExecVariant, setRvExecVariant] = useState('crimson');
  const [rvElegantVariant, setRvElegantVariant] = useState('brown');

  // LinkedIn form
  const [liName, setLiName] = useState('');
  const [liJob, setLiJob] = useState('');
  const [liSkills, setLiSkills] = useState('');
  const [liGoal, setLiGoal] = useState('');
  const [liEmail, setLiEmail] = useState('');
  const [liTone, setLiTone] = useState('professional and approachable');

  // Outputs
  const [clOutput, setClOutput] = useState('');
  const [clLoading, setClLoading] = useState(false);
  const [clError, setClError] = useState('');
  const [clInterviewQs, setClInterviewQs] = useState<InterviewQuestion[]>([]);
  const [clInterviewLoading, setClInterviewLoading] = useState(false);

  const [rvOutput, setRvOutput] = useState('');
  const [rvLoading, setRvLoading] = useState(false);
  const [rvError, setRvError] = useState('');
  const [rvATS, setRvATS] = useState<ATSScore | null>(null);
  const [rvATSLoading, setRvATSLoading] = useState(false);
  const [rvInterviewQs, setRvInterviewQs] = useState<InterviewQuestion[]>([]);
  const [rvInterviewLoading, setRvInterviewLoading] = useState(false);
  const [rvImproving, setRvImproving] = useState(false);

  const [liOutput, setLiOutput] = useState('');
  const [liLoading, setLiLoading] = useState(false);
  const [liError, setLiError] = useState('');
  const [liTips, setLiTips] = useState<string[]>([]);
  const [liTipsLoading, setLiTipsLoading] = useState(false);

  // Premium & access state
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [unlockCode, setUnlockCode] = useState('');
  const [paywallMsg, setPaywallMsg] = useState('');
  const [paywallPrefix, setPaywallPrefix] = useState('');

  // Email verification modal
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [pendingCallback, setPendingCallback] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    const unlocked = localStorage.getItem('premiumUnlocked') === 'true';
    setPremiumUnlocked(unlocked);
  }, []);

  /* ── Access / usage helpers ─────────────────────── */
  const getStoredEmail = (): string => localStorage.getItem('aiJobSuiteUserEmail') || '';

  const checkDeviceLimit = (prefix: string): boolean => {
    if (premiumUnlocked) return true;
    const deviceId = getDeviceFingerprint();
    const deviceData: Record<string, number> = JSON.parse(localStorage.getItem('aiJobSuiteDeviceData') || '{}');
    const count = deviceData[deviceId] || 0;
    if (count >= FREE_LIMIT) { showPaywall(getStoredEmail() || 'this device', prefix); return false; }
    deviceData[deviceId] = count + 1;
    localStorage.setItem('aiJobSuiteDeviceData', JSON.stringify(deviceData));
    return true;
  };

  const checkUsage = async (email: string, prefix: string): Promise<boolean> => {
    if (premiumUnlocked) return true;
    const remoteCount = await checkRemoteUsage(email);
    if (remoteCount === -1) {
      const local: Record<string, number> = JSON.parse(localStorage.getItem('aiJobSuiteUsageData') || '{}');
      const count = local[email] || 0;
      if (count >= FREE_LIMIT) { showPaywall(email, prefix); return false; }
      local[email] = count + 1;
      localStorage.setItem('aiJobSuiteUsageData', JSON.stringify(local));
      return true;
    }
    if (remoteCount >= FREE_LIMIT) { showPaywall(email, prefix); return false; }
    await incrementRemoteUsage(email, remoteCount);
    return true;
  };

  const showPaywall = (email: string, prefix: string) => {
    setPaywallMsg(email);
    setPaywallPrefix(prefix);
  };

  const getEmail = (prefix: Tab, email: string): string => {
    if (!email) return '';
    if (!isValidEmail(email)) return '';
    localStorage.setItem('aiJobSuiteUserEmail', email);
    return email;
  };

  const requireVerification = useCallback(async (email: string, callback: () => Promise<void>) => {
    const verified: string[] = JSON.parse(localStorage.getItem('aiJobSuiteVerifiedEmails') || '[]');
    if (verified.includes(email)) { await callback(); return; }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerifyCode(code); setVerifyEmail(email); setEnteredCode(''); setVerifyError('');
    const sent = await sendVerificationEmail(email, code);
    if (!sent) { await callback(); return; }
    setPendingCallback(() => callback);
    setVerifyModalOpen(true);
  }, []);

  const submitVerifyCode = async () => {
    if (enteredCode !== verifyCode) { setVerifyError('Incorrect code. Please try again.'); return; }
    const verified: string[] = JSON.parse(localStorage.getItem('aiJobSuiteVerifiedEmails') || '[]');
    if (!verified.includes(verifyEmail)) { verified.push(verifyEmail); localStorage.setItem('aiJobSuiteVerifiedEmails', JSON.stringify(verified)); }
    setVerifyModalOpen(false);
    if (pendingCallback) { const cb = pendingCallback; setPendingCallback(null); await cb(); }
  };

  /* ── Generate Cover Letter ──────────────────────── */
  const generateCoverLetter = async () => {
    setClError(''); setPaywallMsg('');
    if (!clName || !clJob || !clCompany || !clSkills) { setClError('Please fill in all required fields.'); return; }
    const email = getEmail('cover', clEmail);
    if (!email) { setClError('Please enter a valid email address.'); return; }
    if (!checkDeviceLimit('cl')) return;
    const allowed = await checkUsage(email, 'cl');
    if (!allowed) return;
    const prompt = coverLetterPrompt(clName, clJob, clCompany, clDesc, clSkills, clTone);
    await requireVerification(email, async () => {
      setClLoading(true); setClOutput('');
      try {
        let text = await callAPI(prompt);
        text = text.replace(/\s*[—–]\s*/g, ' - ');
        setClOutput(text);
        runInterviewPrep('cl', clJob, clDesc, text);
      } catch (err) { setClError('Error: ' + (err instanceof Error ? err.message : 'Something went wrong.')); }
      finally { setClLoading(false); }
    });
  };

  /* ── Generate Resume ────────────────────────────── */
  const generateResume = async () => {
    setRvError(''); setPaywallMsg('');
    if (!rvName || !rvJob || !rvSkills) { setRvError('Please fill in at least your name, target job, and skills.'); return; }
    const email = getEmail('resume', rvAccessEmail);
    if (!email) { setRvError('Please enter a valid email address.'); return; }
    if (!checkDeviceLimit('rv')) return;
    const allowed = await checkUsage(email, 'rv');
    if (!allowed) return;
    const fields: ResumeFields = { name: rvName, job: rvJob, email: rvEmail, phone: rvPhone, location: rvLocation, edu: rvEdu, skills: rvSkills, desc: rvDesc, exp: rvExp, languages: rvLanguages, references: rvReferences };
    const prompt = resumePrompt(fields, rvTone);
    await requireVerification(email, async () => {
      setRvLoading(true); setRvOutput(''); setRvATS(null); setRvInterviewQs([]);
      try {
        let text = await callAPI(prompt);
        text = text.replace(/\s*[—–]\s*/g, ' - ').replace(/ATS KEYWORDS?[:\s]*[\s\S]*?(?=\n[A-Z ]{4,}\n|$)/gi,'').replace(/KEYWORDS?[:\s]*[\s\S]*?(?=\n[A-Z ]{4,}\n|$)/gi,'').replace(/\n{3,}/g,'\n\n').trim();
        setRvOutput(text);
        generateATSScore(text, rvJob, rvDesc);
        runInterviewPrep('rv', rvJob, rvDesc, text);
      } catch (err) { setRvError('Error: ' + (err instanceof Error ? err.message : 'Something went wrong.')); }
      finally { setRvLoading(false); }
    });
  };

  /* ── Generate LinkedIn ──────────────────────────── */
  const generateLinkedIn = async () => {
    setLiError(''); setPaywallMsg('');
    if (!liName || !liJob || !liSkills) { setLiError('Please fill in your name, job title, and skills.'); return; }
    const email = getEmail('linkedin', liEmail);
    if (!email) { setLiError('Please enter a valid email address.'); return; }
    if (!checkDeviceLimit('li')) return;
    const allowed = await checkUsage(email, 'li');
    if (!allowed) return;
    const prompt = linkedinPrompt(liName, liJob, liSkills, liGoal, liTone);
    await requireVerification(email, async () => {
      setLiLoading(true); setLiOutput(''); setLiTips([]);
      try {
        const text = await callAPI(prompt);
        setLiOutput(text);
        generateLinkedInTips(liJob, text);
      } catch (err) { setLiError('Error: ' + (err instanceof Error ? err.message : 'Something went wrong.')); }
      finally { setLiLoading(false); }
    });
  };

  /* ── ATS Score ──────────────────────────────────── */
  const generateATSScore = async (resumeText: string, jobTitle: string, jobDesc: string) => {
    setRvATSLoading(true);
    try {
      const raw = await callAPI(atsScorePrompt(resumeText, jobTitle, jobDesc), 800);
      const clean = raw.replace(/```json|```/g,'').trim();
      const parsed = JSON.parse(clean) as ATSScore;
      setRvATS(parsed);
    } catch { setRvATS({ overall: 0, keyword_match: 0, format_score: 0, impact_score: 0, label: 'Error', tips: 'Could not generate ATS analysis. Please try again.' }); }
    finally { setRvATSLoading(false); }
  };

  /* ── Interview Prep ─────────────────────────────── */
  const runInterviewPrep = async (prefix: string, jobTitle: string, jobDesc: string, docText: string) => {
    const setter = prefix === 'rv' ? setRvInterviewQs : setClInterviewQs;
    const loadSetter = prefix === 'rv' ? setRvInterviewLoading : setClInterviewLoading;
    loadSetter(true); setter([]);
    try {
      const raw = await callAPI(interviewPrompt(prefix, jobTitle, jobDesc, docText), 1500);
      const clean = raw.replace(/```json|```/g,'').trim();
      const parsed = JSON.parse(clean);
      setter(parsed.questions || []);
    } catch { setter([]); }
    finally { loadSetter(false); }
  };

  /* ── LinkedIn Tips ──────────────────────────────── */
  const generateLinkedInTips = async (jobTitle: string, summaryText: string) => {
    setLiTipsLoading(true); setLiTips([]);
    try {
      const text = await callAPI(linkedinTipsPrompt(jobTitle, summaryText), 800);
      const tips = text.split('\n').filter(l => l.trim() && /^\d+\./.test(l.trim()));
      setLiTips(tips.length > 0 ? tips : text.split('\n').filter(l => l.trim()));
    } catch { setLiTips([]); }
    finally { setLiTipsLoading(false); }
  };

  /* ── Improve Resume ─────────────────────────────── */
  const improveResume = async () => {
    if (!rvOutput || !rvATS) return;
    setRvImproving(true);
    try {
      let improved = await callAPI(improveResumePrompt(rvOutput, rvATS.tips));
      improved = improved.replace(/\s*[—–]\s*/g,' - ').trim();
      setRvOutput(improved);
      generateATSScore(improved, rvJob, rvDesc);
    } catch { /* ignore */ }
    finally { setRvImproving(false); }
  };

  /* ── Premium unlock ─────────────────────────────── */
  const unlockPremium = () => {
    if (unlockCode.toUpperCase() === 'AIJOBPRO') {
      setPremiumUnlocked(true);
      localStorage.setItem('premiumUnlocked', 'true');
      alert('✅ Premium templates unlocked!');
    } else { alert('❌ Invalid code. Check your Gumroad purchase.'); }
  };

  /* ── Copy helper ────────────────────────────────── */
  const copyText = async (text: string, btnRef: HTMLButtonElement | null) => {
    if (!text || !btnRef) return;
    await navigator.clipboard.writeText(text);
    const orig = btnRef.textContent;
    btnRef.textContent = 'Copied ✓';
    setTimeout(() => { if (btnRef) btnRef.textContent = orig; }, 2000);
  };

  /* ── Render tabs ────────────────────────────────── */
  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'cover', label: 'Cover Letter', emoji: '✉' },
    { id: 'resume', label: 'Resume', emoji: '📄' },
    { id: 'linkedin', label: 'LinkedIn', emoji: '💼' },
  ];

  const inputCls = 'form-input';
  const labelCls = 'block text-xs font-medium text-[#7E7D9A] uppercase tracking-widest mb-2';
  const cardCls = 'rounded-2xl p-6 mb-5';
  const cardStyle = { background: 'linear-gradient(145deg, #0C0E1A, #121528)', border: '1px solid rgba(255,255,255,0.06)' };

  /* ─────────────────────── JSX ────────────────────── */
  return (
    <section id="generator" className="relative py-28">
      <div
        className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(123,111,255,0.05) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Generate in <span className="gradient-text">seconds.</span>
          </h2>
          <p className="text-[#7E7D9A] text-lg">
            Try it free — 2 generations on us. Unlock unlimited access for $29.
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#7B6FFF]/15 text-[#A892FF] border border-[#7B6FFF]/30'
                  : 'text-[#7E7D9A] hover:text-white'
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* Paywall message */}
        {paywallMsg && (
          <div className="rounded-2xl p-6 mb-5" style={{ background: 'rgba(123,111,255,0.06)', border: '1px solid rgba(123,111,255,0.2)' }}>
            <p className="font-semibold text-white mb-2">🔒 You&apos;ve used your {FREE_LIMIT} free generations!</p>
            <p className="text-[#7E7D9A] text-sm mb-4">You&apos;ve reached the limit for <strong className="text-white">{paywallMsg}</strong>.</p>
            <p className="text-sm text-[#7E7D9A] mb-4">Unlock <strong className="text-white">unlimited access</strong> to cover letters, resumes, LinkedIn summaries, ATS scoring, interview prep, and all 4 premium templates.</p>
            <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
              🚀 Unlock Full Access — $29
            </a>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── COVER LETTER TAB ── */}
          {activeTab === 'cover' && (
            <motion.div key="cover" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              <div className={cardCls} style={cardStyle}>
                <h3 className="text-lg font-semibold text-white mb-5" style={{ fontFamily: 'Space Grotesk' }}>Cover letter details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Full name</label><input className={inputCls} placeholder="e.g. Maya Thompson" value={clName} onChange={e => setClName(e.target.value)} /></div>
                  <div><label className={labelCls}>Job title</label><input className={inputCls} placeholder="e.g. Software Dev Intern" value={clJob} onChange={e => setClJob(e.target.value)} /></div>
                </div>
                <div className="mt-4"><label className={labelCls}>Company name</label><input className={inputCls} placeholder="e.g. Google" value={clCompany} onChange={e => setClCompany(e.target.value)} /></div>
                <div className="mt-4"><label className={labelCls}>Job description or posting (optional)</label><textarea className={inputCls} rows={3} placeholder="Paste the job posting for a more tailored cover letter." value={clDesc} onChange={e => setClDesc(e.target.value)} /></div>
                <div className="mt-4"><label className={labelCls}>Key skills &amp; experience</label><textarea className={inputCls} rows={3} placeholder="e.g. Java, JavaScript, web development, personal projects..." value={clSkills} onChange={e => setClSkills(e.target.value)} /></div>
                <div className="mt-4"><label className={labelCls}>Your email (99 free uses)</label><input className={inputCls} type="email" placeholder="Enter your email" value={clEmail} onChange={e => setClEmail(e.target.value)} /></div>
                <div className="mt-4">
                  <label className={labelCls}>Tone</label>
                  <div className="flex gap-2 flex-wrap">
                    {['professional','enthusiastic','concise','creative'].map(t => (
                      <button key={t} onClick={() => setClTone(t)} className={clTone === t ? 'chip-active' : 'chip-inactive'}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
                    ))}
                  </div>
                </div>
              </div>

              {clError && <div className="rounded-xl p-4 mb-4 text-sm text-[#FF6B6B]" style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}>{clError}</div>}

              <button onClick={generateCoverLetter} disabled={clLoading} className="btn-primary w-full justify-center py-3.5 text-base mb-2" style={{ background: 'linear-gradient(135deg, #7B6FFF, #A892FF)' }}>
                {clLoading ? <><span className="spinner" />Crafting your cover letter...</> : 'Generate Cover Letter'}
              </button>

              {/* CL Output */}
              {clOutput && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl p-6" style={{ background: 'rgba(123,111,255,0.06)', border: '1px solid rgba(123,111,255,0.2)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-[#7E7D9A] uppercase tracking-widest">Your cover letter</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(78,232,181,0.1)', color: '#4EE8B5', border: '1px solid rgba(78,232,181,0.2)' }}>Ready</span>
                  </div>
                  <div className="text-sm text-[#ECEBF5] leading-relaxed whitespace-pre-wrap mb-4">{clOutput}</div>
                  <div className="flex gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button className="btn-secondary text-xs py-2 px-4" onClick={(e) => copyText(clOutput, e.currentTarget)}><Copy size={13} /> Copy</button>
                    <button className="btn-secondary text-xs py-2 px-4" onClick={() => downloadCoverLetterPDF(clOutput, clName, clJob, clCompany)}><Download size={13} /> PDF</button>
                    <button className="btn-secondary text-xs py-2 px-4" onClick={generateCoverLetter}><RefreshCw size={13} /> Regenerate</button>
                  </div>
                </motion.div>
              )}

              {/* CL Interview Prep */}
              {(clInterviewLoading || clInterviewQs.length > 0) && (
                <InterviewCard loading={clInterviewLoading} questions={clInterviewQs} prefix="cl" />
              )}
            </motion.div>
          )}

          {/* ── RESUME TAB ── */}
          {activeTab === 'resume' && (
            <motion.div key="resume" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              <div className={cardCls} style={cardStyle}>
                <h3 className="text-lg font-semibold text-white mb-5" style={{ fontFamily: 'Space Grotesk' }}>Resume details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Full name</label><input className={inputCls} placeholder="e.g. Maya Thompson" value={rvName} onChange={e => setRvName(e.target.value)} /></div>
                  <div><label className={labelCls}>Target job title</label><input className={inputCls} placeholder="e.g. Software Developer" value={rvJob} onChange={e => setRvJob(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div><label className={labelCls}>Email</label><input className={inputCls} placeholder="email@example.com" value={rvEmail} onChange={e => setRvEmail(e.target.value)} /></div>
                  <div><label className={labelCls}>Phone</label><input className={inputCls} placeholder="+1 555 0100" value={rvPhone} onChange={e => setRvPhone(e.target.value)} /></div>
                </div>
                <div className="mt-4"><label className={labelCls}>Location</label><input className={inputCls} placeholder="e.g. Rochester, NY" value={rvLocation} onChange={e => setRvLocation(e.target.value)} /></div>
                <div className="mt-4"><label className={labelCls}>Education</label><textarea className={inputCls} rows={2} placeholder="e.g. BSc Computer Science, University of Johannesburg, 2022–2025" value={rvEdu} onChange={e => setRvEdu(e.target.value)} /></div>
                <div className="mt-4"><label className={labelCls}>Skills &amp; technologies</label><textarea className={inputCls} rows={2} placeholder="e.g. Java, JavaScript, C++, data structures, SQL..." value={rvSkills} onChange={e => setRvSkills(e.target.value)} /></div>
                <div className="mt-4"><label className={labelCls}>Job description (optional)</label><textarea className={inputCls} rows={3} placeholder="Paste the target job description to tailor the resume." value={rvDesc} onChange={e => setRvDesc(e.target.value)} /></div>
                <div className="mt-4"><label className={labelCls}>Experience &amp; projects</label><textarea className={inputCls} rows={3} placeholder="e.g. Personal projects, internships, coursework..." value={rvExp} onChange={e => setRvExp(e.target.value)} /></div>
                <div className="mt-4"><label className={labelCls}>Languages (optional)</label><textarea className={inputCls} rows={2} placeholder="e.g. English (Fluent), Spanish (Conversational)" value={rvLanguages} onChange={e => setRvLanguages(e.target.value)} /></div>
                <div className="mt-4"><label className={labelCls}>References (optional)</label><textarea className={inputCls} rows={2} placeholder="e.g. Jane Doe, Manager at Acme Corp, jane@example.com" value={rvReferences} onChange={e => setRvReferences(e.target.value)} /></div>
                <div className="mt-4"><label className={labelCls}>Your email (2 free uses)</label><input className={inputCls} type="email" placeholder="Enter your email" value={rvAccessEmail} onChange={e => setRvAccessEmail(e.target.value)} /></div>

                {/* Style */}
                <div className="mt-4">
                  <label className={labelCls}>Style</label>
                  <div className="flex gap-2 flex-wrap mb-5">
                    {[['clean and professional','Clean'],['modern and bold','Modern'],['concise and minimal','Minimal'],['detailed and comprehensive','Detailed']].map(([val, label]) => (
                      <button key={val} onClick={() => setRvTone(val)} className={rvTone === val ? 'chip-active' : 'chip-inactive'}>{label}</button>
                    ))}
                  </div>

                  {/* Template chooser */}
                  <label className={labelCls}>Template</label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      { id: 'modern', label: '🖤 Modern', desc: 'Dark header · Gold section bars · Sharp & clean', locked: false },
                      { id: 'minimal', label: '🤍 Minimal', desc: 'Ultra clean · Thin accent · Elegant spacing', locked: false },
                      { id: 'executive', label: '🏆 Executive', desc: 'Navy sidebar · Gold initials · Skill pills · Premium', locked: !premiumUnlocked },
                      { id: 'detailed', label: '✨ Elegant', desc: 'Two-column · Gold header · Skill pills · Premium', locked: !premiumUnlocked },
                    ].map(tpl => (
                      <div
                        key={tpl.id}
                        className={`template-card ${rvTemplate === tpl.id ? 'active' : ''} ${tpl.locked ? 'locked' : ''}`}
                        onClick={() => tpl.locked ? window.open(GUMROAD_URL, '_blank') : setRvTemplate(tpl.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-semibold text-white mb-1">{tpl.label}</div>
                            <div className="text-xs text-[#7E7D9A]">{tpl.desc}</div>
                          </div>
                          {tpl.locked && <Lock size={12} className="text-[#4A4A60] flex-shrink-0 mt-0.5" />}
                        </div>
                        {tpl.locked && <div className="text-[10px] text-[#7B6FFF] mt-2 font-medium">Unlock with $29 →</div>}
                      </div>
                    ))}
                  </div>

                  {/* Premium code */}
                  <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <label className={labelCls}>Have a premium code?</label>
                    <div className="flex gap-2">
                      <input className={inputCls} placeholder="Enter your code" value={unlockCode} onChange={e => setUnlockCode(e.target.value)} />
                      <button onClick={unlockPremium} className="btn-secondary text-sm whitespace-nowrap">Unlock</button>
                    </div>
                  </div>
                </div>
              </div>

              {rvError && <div className="rounded-xl p-4 mb-4 text-sm text-[#FF6B6B]" style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}>{rvError}</div>}

              <div className="text-xs text-[#4A4A60] text-center mb-4 md:hidden">
                📱 For best resume formatting, download on a desktop or laptop.
              </div>

              <button onClick={generateResume} disabled={rvLoading} className="btn-primary w-full justify-center py-3.5 text-base mb-2" style={{ background: 'linear-gradient(135deg, #7B6FFF, #A892FF)' }}>
                {rvLoading ? <><span className="spinner" />Building your resume...</> : 'Generate Resume'}
              </button>

              {/* Resume output */}
              {rvOutput && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl p-6" style={{ background: 'rgba(123,111,255,0.06)', border: '1px solid rgba(123,111,255,0.2)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-[#7E7D9A] uppercase tracking-widest">Your resume</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(78,232,181,0.1)', color: '#4EE8B5', border: '1px solid rgba(78,232,181,0.2)' }}>Ready</span>
                  </div>
                  <div className="text-sm text-[#ECEBF5] leading-relaxed whitespace-pre-wrap font-mono mb-4">{rvOutput}</div>
                  <div className="flex gap-2 pt-4 flex-wrap" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button className="btn-secondary text-xs py-2 px-4" onClick={(e) => copyText(rvOutput, e.currentTarget)}><Copy size={13} /> Copy</button>
                    <button className="btn-secondary text-xs py-2 px-4" onClick={() => downloadResumePDF(rvOutput, rvTemplate)}><Download size={13} /> PDF</button>
                    <button className="btn-secondary text-xs py-2 px-4" onClick={generateResume}><RefreshCw size={13} /> Regenerate</button>
                  </div>
                </motion.div>
              )}

              {/* ATS Score */}
              {(rvATSLoading || rvATS) && (
                <ATSCard loading={rvATSLoading} ats={rvATS} onImprove={improveResume} improving={rvImproving} />
              )}

              {/* Interview Prep */}
              {(rvInterviewLoading || rvInterviewQs.length > 0) && (
                <InterviewCard loading={rvInterviewLoading} questions={rvInterviewQs} prefix="rv" />
              )}
            </motion.div>
          )}

          {/* ── LINKEDIN TAB ── */}
          {activeTab === 'linkedin' && (
            <motion.div key="linkedin" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              <div className={cardCls} style={cardStyle}>
                <h3 className="text-lg font-semibold text-white mb-5" style={{ fontFamily: 'Space Grotesk' }}>LinkedIn summary details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Full name</label><input className={inputCls} placeholder="e.g. Maya Thompson" value={liName} onChange={e => setLiName(e.target.value)} /></div>
                  <div><label className={labelCls}>Current / target job title</label><input className={inputCls} placeholder="e.g. Software Engineer" value={liJob} onChange={e => setLiJob(e.target.value)} /></div>
                </div>
                <div className="mt-4"><label className={labelCls}>Key skills &amp; experience</label><textarea className={inputCls} rows={3} placeholder="e.g. JavaScript, React, Node.js, 3 years experience..." value={liSkills} onChange={e => setLiSkills(e.target.value)} /></div>
                <div className="mt-4"><label className={labelCls}>Career goal or what you&apos;re looking for</label><textarea className={inputCls} rows={2} placeholder="e.g. Looking for a senior frontend role at a product company..." value={liGoal} onChange={e => setLiGoal(e.target.value)} /></div>
                <div className="mt-4"><label className={labelCls}>Your email (2 free uses)</label><input className={inputCls} type="email" placeholder="Enter your email" value={liEmail} onChange={e => setLiEmail(e.target.value)} /></div>
                <div className="mt-4">
                  <label className={labelCls}>Tone</label>
                  <div className="flex gap-2 flex-wrap">
                    {[['professional and approachable','Professional'],['confident and bold','Confident'],['warm and personable','Warm'],['creative and unique','Creative']].map(([val, label]) => (
                      <button key={val} onClick={() => setLiTone(val)} className={liTone === val ? 'chip-active' : 'chip-inactive'}>{label}</button>
                    ))}
                  </div>
                </div>
              </div>

              {liError && <div className="rounded-xl p-4 mb-4 text-sm text-[#FF6B6B]" style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}>{liError}</div>}

              <button onClick={generateLinkedIn} disabled={liLoading} className="btn-primary w-full justify-center py-3.5 text-base mb-2" style={{ background: 'linear-gradient(135deg, #7B6FFF, #A892FF)' }}>
                {liLoading ? <><span className="spinner" />Crafting your LinkedIn summary...</> : 'Generate LinkedIn Summary'}
              </button>

              {liOutput && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl p-6" style={{ background: 'rgba(123,111,255,0.06)', border: '1px solid rgba(123,111,255,0.2)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-[#7E7D9A] uppercase tracking-widest">Your LinkedIn summary</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(78,232,181,0.1)', color: '#4EE8B5', border: '1px solid rgba(78,232,181,0.2)' }}>Ready</span>
                  </div>
                  <div className="text-sm text-[#ECEBF5] leading-relaxed whitespace-pre-wrap mb-4">{liOutput}</div>
                  <div className="flex gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button className="btn-secondary text-xs py-2 px-4" onClick={(e) => copyText(liOutput, e.currentTarget)}><Copy size={13} /> Copy</button>
                    <button className="btn-secondary text-xs py-2 px-4" onClick={generateLinkedIn}><RefreshCw size={13} /> Regenerate</button>
                  </div>
                </motion.div>
              )}

              {/* LinkedIn Tips */}
              {(liTipsLoading || liTips.length > 0) && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-[#7E7D9A] uppercase tracking-widest">💡 LinkedIn Profile Tips</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(123,111,255,0.1)', color: '#A892FF', border: '1px solid rgba(123,111,255,0.2)' }}>AI Generated</span>
                  </div>
                  {liTipsLoading ? (
                    <div className="flex items-center gap-3 text-sm text-[#7E7D9A]"><span className="spinner" />Generating profile tips...</div>
                  ) : (
                    <div className="space-y-3">
                      {liTips.map((tip, i) => {
                        const m = tip.match(/^(\d+\.?\s*)(.*)/);
                        return (
                          <div key={i} className="flex gap-3 py-2" style={{ borderBottom: i < liTips.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                            <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5" style={{ background: 'rgba(123,111,255,0.15)', color: '#7B6FFF' }}>{i+1}</span>
                            <span className="text-sm text-[#ECEBF5] leading-relaxed">{m ? m[2] : tip}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Email Verification Modal */}
      <AnimatePresence>
        {verifyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl p-8"
              style={{ background: '#0C0E1A', border: '1px solid rgba(123,111,255,0.3)' }}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">✉</div>
                <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>Check your email</h2>
                <p className="text-sm text-[#7E7D9A]">We sent a 6-digit code to <strong className="text-[#7B6FFF]">{verifyEmail}</strong></p>
              </div>
              <input
                className={inputCls + ' text-center text-xl tracking-widest mb-4'}
                placeholder="000000"
                maxLength={6}
                value={enteredCode}
                onChange={e => setEnteredCode(e.target.value.replace(/[^0-9]/g, ''))}
                onKeyDown={e => e.key === 'Enter' && submitVerifyCode()}
              />
              {verifyError && <p className="text-sm text-[#FF6B6B] text-center mb-3">{verifyError}</p>}
              <button onClick={submitVerifyCode} className="btn-primary w-full justify-center py-3 mb-3">Verify &amp; Generate</button>
              <button onClick={() => setVerifyModalOpen(false)} className="w-full text-sm text-[#7E7D9A] hover:text-white transition-colors">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Sub-components ──────────────────────────────── */
function ATSCard({ loading, ats, onImprove, improving }: { loading: boolean; ats: ATSScore | null; onImprove: () => void; improving: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-[#7E7D9A] uppercase tracking-widest">📊 ATS Score Analysis</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(123,111,255,0.1)', color: '#A892FF', border: '1px solid rgba(123,111,255,0.2)' }}>AI Scored</span>
      </div>
      {loading ? (
        <div className="flex items-center gap-3 text-sm text-[#7E7D9A]"><span className="spinner" />Analysing ATS compatibility...</div>
      ) : ats ? (
        <>
          <div className="text-center mb-5">
            <div className="ats-score-circle" style={{ borderColor: ats.overall >= 80 ? '#4EE8B5' : ats.overall >= 60 ? '#7B6FFF' : '#FF6B6B', color: ats.overall >= 80 ? '#4EE8B5' : ats.overall >= 60 ? '#7B6FFF' : '#FF6B6B' }}>
              {ats.overall}%
            </div>
            <div className="text-sm text-[#7E7D9A]">{ats.label}</div>
          </div>
          {[
            { label: 'Keyword Match', value: ats.keyword_match },
            { label: 'Format & Structure', value: ats.format_score },
            { label: 'Impact & Action Verbs', value: ats.impact_score },
          ].map(bar => (
            <div key={bar.label} className="mb-3">
              <div className="flex justify-between text-xs text-[#7E7D9A] mb-1.5"><span>{bar.label}</span><span>{bar.value}%</span></div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <motion.div className="h-full rounded-full ats-bar-fill" initial={{ width: 0 }} animate={{ width: `${bar.value}%` }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }} />
              </div>
            </div>
          ))}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs font-medium text-[#7E7D9A] uppercase tracking-widest mb-2">Improvement Tips</div>
            <div className="text-sm text-[#ECEBF5] whitespace-pre-wrap leading-relaxed mb-4">{ats.tips}</div>
            <button onClick={onImprove} disabled={improving} className="btn-secondary text-xs py-2 px-4" style={{ borderColor: 'rgba(123,111,255,0.3)', color: '#A892FF' }}>
              {improving ? '⏳ Improving...' : '✦ Improve My Resume'}
            </button>
          </div>
        </>
      ) : null}
    </motion.div>
  );
}

function InterviewCard({ loading, questions, prefix }: { loading: boolean; questions: InterviewQuestion[]; prefix: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-[#7E7D9A] uppercase tracking-widest">🎯 Interview Prep & Answer Guide</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(123,111,255,0.1)', color: '#A892FF', border: '1px solid rgba(123,111,255,0.2)' }}>AI Generated</span>
      </div>
      {loading ? (
        <div className="flex items-center gap-3 text-sm text-[#7E7D9A]"><span className="spinner" />Generating interview questions...</div>
      ) : (
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(123,111,255,0.15)', color: '#7B6FFF' }}>{i+1}</span>
                <span className="flex-1 text-sm text-white leading-relaxed">{q.question}</span>
                {openIdx === i ? <ChevronUp size={14} className="flex-shrink-0 text-[#7E7D9A]" /> : <ChevronDown size={14} className="flex-shrink-0 text-[#7E7D9A]" />}
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="pt-3">
                        <div className="text-xs font-medium text-[#7B6FFF] uppercase tracking-widest mb-2">How to answer</div>
                        <p className="text-sm text-[#7E7D9A] leading-relaxed mb-3">{q.framework}</p>
                        <div className="text-xs font-medium text-[#7B6FFF] uppercase tracking-widest mb-2">Sample answer</div>
                        <p className="text-sm text-[#ECEBF5] leading-relaxed">{q.example}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
