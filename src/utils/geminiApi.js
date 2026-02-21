const GEMINI_API_KEY = "AIzaSyCSYfoZzocUQowE7H3NWleKndKR6uY_HfU";

// ── PDF Text Extraction 
export async function extractPDFText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const bytes = new Uint8Array(e.target.result);
      let text = "";
      for (let i = 0; i < bytes.length; i++) {
        const c = bytes[i];
        if (c >= 32 && c <= 126) text += String.fromCharCode(c);
        else if (c === 10 || c === 13) text += " ";
      }
      text = text.replace(/[^\x20-\x7E\s]/g, " ").replace(/\s{3,}/g, " ").trim();
      resolve(text.length > 100 ? text : "Resume text extraction limited. Please check file.");
    };
    reader.onerror = () => resolve("Could not read file.");
    reader.readAsArrayBuffer(file);
  });
}

// ── Gemini AI Analysis 
export async function analyzeWithGemini(resumeText, jobDesc, jobTitle, company) {
  const prompt = `
You are an expert ATS (Applicant Tracking System) analyst and career coach.
Analyze the following resume against the job description for a "${jobTitle}" role at "${company}".

RESUME CONTENT:
${resumeText.slice(0, 4000)}

JOB DESCRIPTION:
${jobDesc.slice(0, 3000)}

Provide a detailed, genuine analysis. Return ONLY valid JSON with this exact structure:
{
  "overallScore": <number 0-100>,
  "toneScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "structureScore": <number 0-100>,
  "skillsScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "issueCount": <number>,
  "atsBadgeType": "<good|warn|bad>",
  "atsChecks": [{ "icon": "<✅|⚠️|❌>", "text": "<specific ATS check result>" }],
  "missingKeywords": ["<keyword1>"],
  "suggestedKeywords": ["<keyword1>"],
  "sections": [
    {
      "name": "Tone & Style",
      "score": <number>,
      "badge": "<Good Start|Strong|Needs Work|Excellent>",
      "badgeType": "<green|blue|orange|red>",
      "subChecks": [{ "icon": "<✅|⚠️>", "label": "<check label>" }],
      "feedbackCards": [
        {
          "type": "<pass|warn|fail>",
          "title": "<title with emoji>",
          "body": "<explanation>",
          "bullets": ["<bullet>"],
          "chips": ["<chip>"]
        }
      ]
    },
    { "name": "Content" },
    { "name": "Structure" },
    { "name": "Skills" }
  ]
}
Be specific and genuine. Return ONLY the JSON object. No markdown, no backticks.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 3000 },
      }),
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || "Gemini API request failed.");
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const cleaned = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse AI response as JSON.");
  }
}

// ── Demo / Fallback Result
export function generateDemoResult(resumeText, jobDesc, jobTitle, company) {
  const techKeywords = [
    "JavaScript","Python","React","Node.js","SQL","AWS","Docker",
    "TypeScript","API","Git","Agile","Communication","Leadership",
    "Problem-solving","Teamwork","Project management","Analytics",
  ];
  const jdLower = jobDesc.toLowerCase();
  const resumeLower = resumeText.toLowerCase();
  const missing = techKeywords.filter(
    (k) => jdLower.includes(k.toLowerCase()) && !resumeLower.includes(k.toLowerCase())
  );
  const suggested = techKeywords.filter((k) => jdLower.includes(k.toLowerCase())).slice(0, 8);

  return {
    overallScore: 72,
    toneScore: 65,
    contentScore: 58,
    structureScore: 78,
    skillsScore: 60,
    atsScore: 72,
    issueCount: 14,
    atsBadgeType: "warn",
    atsChecks: [
      { icon: "✅", text: "Readable formatting detected — no tables or complex layouts blocking ATS" },
      { icon: "⚠️", text: "Some keywords from the job description are missing from your resume" },
      { icon: "⚠️", text: "Skills section needs to be more prominent and specific" },
      { icon: "✅", text: "Contact information appears to be present" },
      { icon: "❌", text: "No quantifiable achievements detected — add metrics and numbers" },
    ],
    missingKeywords: missing.slice(0, 6).concat(["Stakeholder management", "Cross-functional"]),
    suggestedKeywords: suggested,
    sections: [
      {
        name: "Tone & Style", score: 65, badge: "Good Start", badgeType: "blue",
        subChecks: [
          { icon: "✅", label: "Professional Tone" },
          { icon: "⚠️", label: "Consistent Voice" },
          { icon: "⚠️", label: "Active Language" },
          { icon: "✅", label: "Concise Writing" },
        ],
        feedbackCards: [
          { type: "pass", title: "✅ Professional Tone — Good overall", body: "Your resume maintains a professional tone. Recruiters will find it readable and appropriate for the role.", bullets: [], chips: [] },
          { type: "warn", title: "⚠️ Use Active Language — Replace passive phrases", body: "Switch from passive to active voice to sound more impactful:", bullets: ['Instead of: "Was responsible for managing..."', 'Try: "Led and managed a team of..."'], chips: ["Led", "Built", "Delivered", "Achieved", "Drove"] },
        ],
      },
      {
        name: "Content", score: 58, badge: "Needs Work", badgeType: "orange",
        subChecks: [
          { icon: "⚠️", label: "Quantify Impact" },
          { icon: "⚠️", label: "Tailor to Role" },
          { icon: "✅", label: "Avoid Fluff" },
          { icon: "⚠️", label: "Action Verbs" },
        ],
        feedbackCards: [
          { type: "warn", title: "⚠️ Quantify Your Impact — Add numbers & metrics", body: "Vague statements are the #1 weakness ATS and recruiters flag:", bullets: ['Instead of: "Managed a team of developers"', 'Try: "Led a team of 5 developers to ship 3 features, reducing load time by 40%"'], chips: [] },
          { type: "warn", title: "⚠️ Tailor to Role — Add job-specific content", body: `Your resume needs to speak more directly to the ${jobTitle} role at ${company}.`, bullets: ["Add responsibilities that match the JD", "Include specific tools/technologies mentioned"], chips: [] },
        ],
      },
      {
        name: "Structure", score: 78, badge: "Strong", badgeType: "green",
        subChecks: [
          { icon: "✅", label: "Clear Sections" },
          { icon: "✅", label: "Reverse Chronological" },
          { icon: "⚠️", label: "Complete Contact Info" },
          { icon: "✅", label: "Consistent Formatting" },
        ],
        feedbackCards: [
          { type: "pass", title: "✅ Well Structured — Clear section hierarchy", body: "Your resume has clear, logical sections. This is exactly what ATS systems and human recruiters look for.", bullets: [], chips: [] },
          { type: "warn", title: "⚠️ Complete Contact Info — Add LinkedIn & GitHub", body: "For tech roles, recruiters almost always check LinkedIn and GitHub. Add these to your header.", bullets: [], chips: [] },
        ],
      },
      {
        name: "Skills", score: 60, badge: "Needs Work", badgeType: "orange",
        subChecks: [
          { icon: "⚠️", label: "Job-Matching Keywords" },
          { icon: "⚠️", label: "Specific Technologies" },
          { icon: "✅", label: "Relevant Skills Listed" },
          { icon: "⚠️", label: "No Outdated Technologies" },
        ],
        feedbackCards: [
          { type: "warn", title: "⚠️ Missing Job Keywords — Add role-specific skills", body: "The following skills appear in the job description but are absent from your resume:", bullets: missing.slice(0, 4).map((k) => "Add: " + k), chips: missing.slice(0, 5) },
          { type: "warn", title: "⚠️ Be Specific — Replace vague skill descriptions", body: "Vague skills hurt your ATS score:", bullets: ['Instead of: "Good communication"', 'Try: "Client communication via Slack, Zoom, and Jira in Agile teams"'], chips: [] },
        ],
      },
    ],
  };
}
