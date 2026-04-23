export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, name, jobTitle, experience, skills, jobDescription } = req.body;

    if (!type || !name || !jobTitle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let prompt = "";

    if (type === "resume") {
      prompt = `
Create a professional resume for:

Name: ${name}
Target Job Title: ${jobTitle}
Experience Level: ${experience || "Entry-level"}
Skills: ${skills || "Not provided"}

Job Description (if provided):
${jobDescription || "N/A"}

Rules:
- Do NOT make up fake experience
- Keep it realistic for entry-level candidates
- Use bullet points
- Include sections: Summary, Skills, Experience (if any), Education
- Make it ATS-friendly
`;
    }

    if (type === "coverLetter") {
      prompt = `
Write a professional cover letter for:

Name: ${name}
Applying for: ${jobTitle}
Experience Level: ${experience || "Entry-level"}
Skills: ${skills || "Not provided"}

Job Description (if provided):
${jobDescription || "N/A"}

Rules:
- Keep it professional and concise
- Do NOT make up fake experience
- Show enthusiasm and willingness to learn
- Tailor it to the job
`;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "AI request failed",
        details: data
      });
    }

    const output = data?.content?.[0]?.text || "No response generated";

    return res.status(200).json({ result: output });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}
