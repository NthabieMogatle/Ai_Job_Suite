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

    const { messages, max_tokens, system } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required.' });
    }

    const atsSystemPrompt = `
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
