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
        error: 'API key not configured. Add ANTHROPIC_API_KEY in Vercel environment variables.',
      });
    }

    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : (req.body || {});

    const {
      type,
      name,
      jobTitle,
      company,
      description,
      skills,
      experience,
      tone
    } = body;

    if (!type) {
      return res.status(400).json({ error: 'Type is required.' });
    }

    if (!name || !jobTitle) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    let prompt = '';

    if (type === 'coverLetter') {
      if (!company || !skills) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }

      prompt = `
Write a professional cover letter for the following applicant.

Full Name: ${name}
Job Title: ${jobTitle}
Company Name: ${company}
Skills and Experience: ${skills}
Job Description / Posting: ${description || 'Not provided'}
Preferred Tone: ${tone || 'Professional'}

Requirements:
- Write a strong, realistic, professional cover letter
- Do not invent fake employers or achievements
- Keep it polished and ATS-friendly
- Make it tailored to the role and company
- Keep it concise but convincing
- Use proper business letter formatting
- Return only the cover letter text
`;
    } else if (type === 'resume') {
      if (!skills) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }

      prompt = `
Create a professional ATS-friendly resume for the following applicant.

Full Name: ${name}
Target Job Title: ${jobTitle}
Experience Level / Background: ${experience || 'Not provided'}
Skills and Experience: ${skills}
Job Description / Posting: ${description || 'Not provided'}
Preferred Tone: ${tone || 'Professional'}

Requirements:
- Create a realistic resume
- Do not invent fake companies, degrees, or certifications
- Use the provided information only
- Make it polished, clear, and ATS-friendly
- Include sections where appropriate, such as:
  Summary
  Skills
  Experience
  Education
- If experience is limited, make the summary and skills strong without making up facts
- Return only the resume text
`;
    } else {
      return res.status(400).json({ error: 'Invalid type.' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1200,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.error?.message ||
        data?.error?.type ||
        JSON.stringify(data?.error) ||
        'Anthropic API request failed.';
      return res.status(response.status).json({
        error: message,
        details: data,
      });
    }

    const result =
      data?.content
        ?.filter((item) => item.type === 'text')
        ?.map((item) => item.text)
        ?.join('\n\n') || '';

    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({
      error: 'Server error: ' + err.message,
    });
  }
};
