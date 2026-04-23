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
      typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
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
      return res.status(response.status).json({ error: message, details: data });
    }

    const text =
      data?.content
        ?.filter((item) => item.type === 'text')
        ?.map((item) => item.text)
        ?.join('\n\n') || '';

    return res.status(200).json({
      result: text,
      raw: data,
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Server error: ' + err.message,
    });
  }
};
