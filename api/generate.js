module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured. Add ANTHROPIC_API_KEY in Vercel environment variables.'
      });
    }

    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : (req.body || {});

    const { messages, max_tokens, system, generator } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required.' });
    }

    const baseSystemPrompt = `
You are an expert resume and cover letter writer focused on helping job seekers get hired.

Your job is to create ATS-friendly, realistic, and highly tailored resumes and cover letters for ANY industry.

Instructions:
1. Identify the job type from the job title and job description, such as IT, healthcare, business, retail, customer service, education, finance, logistics, hospitality, or administration.
2. Adapt the tone, keywords, and structure to match that industry.
3. Use strong action verbs such as Diagnosed, Resolved, Configured, Assisted, Implemented, Supported, Managed, Improved, Coordinated, Maintained, Organized, Communicated, Trained, Documented, Delivered, and Collaborated.
4. Naturally include relevant keywords from the job description.
5. Prioritize ATS readability, clear formatting, and role relevance.
6. Do NOT invent fake experience, companies, degrees, certifications, awards, or achievements.
7. If the candidate is entry-level or has limited experience, emphasize transferable skills, projects, training, education, certifications, customer service, communication, reliability, and willingness to learn.
8. Resume outputs should include clean sections such as Professional Summary, Core Skills, Experience, Education, Certifications, and Projects when appropriate.
9. Cover letters should sound human, confident, professional, and tailored to the company and role.
10. Keep everything concise, polished, truthful, and easy to scan.

Goal:
Help the user create job application documents that are relevant, honest, ATS-friendly, and strong enough to improve their chances of getting interviews.
`;

    const neverFabricateBlock = `
NEVER FABRICATE FACTS
- Use only information the user provided. Do not invent metrics, percentages,
  achievements, employers, job titles, dates, or project details.
- If the input is thin, write a strong piece from only what's given. Do not pad
  it with made-up accomplishments.
- If a quantified result would strengthen the writing but none was provided,
  insert a bracketed prompt the user must fill in, e.g.
  "[add a specific result — e.g. cut load time by X%]". Never invent the number.
- Describe only what the user actually wrote. Do not add scope, qualifiers,
  or flavor they did not state. If the user writes "reporting dashboard," do
  not expand it to "a reporting dashboard that processes live data." Adding
  plausible-sounding detail is fabrication even when it sounds harmless.
`;

    const contactDetailsBlock = `
CONTACT DETAILS — STRICT RULE
Never invent contact information. Do not generate an email, phone number,
LinkedIn URL, or address.
- Use the applicant's name exactly as provided.
- For any contact detail the user did NOT explicitly provide, output a visible
  bracketed placeholder they must replace: [Your email] · [Your phone] · [Your LinkedIn]
- A bracketed placeholder is correct. A realistic-looking fake value
  (e.g. name@email.com or a 555 number) is a failure, because the user may send
  it without noticing.
`;

    const naturalWritingBlock = `
NATURAL WRITING RULES
Write like a sharp human wrote it, not like AI.
- Vary sentence length — mix short punchy lines with longer ones. No uniform rhythm.
- Never use the "not X, but Y" / "it's not just X, it's Y" construction.
- Don't stack three adjectives or phrases for effect ("clean, scalable, and
  maintainable"). Pick the one specific thing that matters.
- Lead with concrete specifics (named tools, real outcomes) over abstract praise.
- Start with substance. No filler openers like "I am writing to express my interest."
- Banned phrases — never use: "thrive in", "passionate about", "care deeply",
  "treats feedback as a gift", "take their craft seriously", "from concept to
  production", "fast-paced environment", "results-driven", "team player",
  "wear many hats", "leverage", "spearheaded", "synergy", "in today's landscape".
- Banned sentence shapes (not just phrases): never use "not X, but Y",
  "X, not just Y", "not only X", "more than just X", or "it's not about X,
  it's about Y." These contrast-framings are AI tells. State the point directly.
`;

    const coverLetterSystemPrompt = baseSystemPrompt + neverFabricateBlock + contactDetailsBlock + naturalWritingBlock;
    const resumeSystemPrompt = baseSystemPrompt + neverFabricateBlock + contactDetailsBlock + naturalWritingBlock;
    const linkedinSystemPrompt = baseSystemPrompt + neverFabricateBlock + naturalWritingBlock;

    const systemPromptByGenerator = {
      cl: coverLetterSystemPrompt,
      rv: resumeSystemPrompt,
      li: linkedinSystemPrompt
    };

    const atsSystemPrompt = systemPromptByGenerator[generator] || baseSystemPrompt;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: Number(max_tokens) || 1200,
        system: system || atsSystemPrompt,
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.error?.message ||
          data?.error?.type ||
          'Anthropic API request failed.',
        details: data
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: 'Server error: ' + err.message
    });
  }
};
