import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_KEY || "AIzaSyAKfid0hgZJx0r_0uSEuIwSIJEwC-AvxAg";

// ── PDF Text Extraction (using Mozilla pdf.js for accurate parsing) ──
export async function extractPDFText(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const textParts = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      textParts.push(pageText);
    }

    const fullText = textParts.join("\n").replace(/\s{3,}/g, " ").trim();

    if (fullText.length < 50) {
      return "Resume text extraction limited. The PDF may be image-based or scanned. Please use a text-based PDF.";
    }
    return fullText;
  } catch (err) {
    console.error("PDF extraction error:", err);
    return "Could not read file. Please ensure it is a valid PDF.";
  }
}

// ── Gemini AI Analysis 
export async function analyzeWithGemini(resumeText, jobDesc, jobTitle, company) {
  console.log("[RESUMIND] Extracted resume text length:", resumeText.length);
  console.log("[RESUMIND] Resume preview:", resumeText.slice(0, 300));

  const prompt = `
You are an expert ATS (Applicant Tracking System) analyst and career coach.

IMPORTANT INSTRUCTIONS:
- Analyze the SPECIFIC resume content below against the SPECIFIC job description.
- Every score MUST reflect the actual content — do NOT use generic/default scores.
- The missingKeywords MUST be keywords found in the JOB DESCRIPTION but NOT in the RESUME.
- The suggestedKeywords MUST be relevant to the specific job posting.
- Every feedbackCard body must reference ACTUAL lines/phrases from the resume.
- Do NOT produce generic advice. Be specific to THIS resume and THIS job.

JOB TITLE: ${jobTitle}
COMPANY: ${company}

RESUME CONTENT:
---
${resumeText.slice(0, 5000)}
---

JOB DESCRIPTION:
---
${jobDesc.slice(0, 3500)}
---

Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
{
  "overallScore": <number 0-100 based on actual match quality>,
  "toneScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "structureScore": <number 0-100>,
  "skillsScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "issueCount": <actual number of issues found>,
  "atsBadgeType": "<good|warn|bad>",
  "atsChecks": [{ "icon": "<✅|⚠️|❌>", "text": "<specific check referencing actual resume content>" }],
  "missingKeywords": ["<keyword from JD not in resume>"],
  "suggestedKeywords": ["<keyword relevant to this specific job>"],
  "sections": [
    {
      "name": "Tone & Style",
      "score": <number>,
      "badge": "<Good Start|Strong|Needs Work|Excellent>",
      "badgeType": "<green|blue|orange|red>",
      "subChecks": [{ "icon": "<✅|⚠️>", "label": "<specific check>" }],
      "feedbackCards": [
        {
          "type": "<pass|warn|fail>",
          "title": "<title with emoji>",
          "body": "<specific explanation referencing resume content>",
          "bullets": ["<specific actionable bullet>"],
          "chips": ["<relevant chip>"]
        }
      ]
    },
    { "name": "Content", "score": 0, "badge": "", "badgeType": "", "subChecks": [], "feedbackCards": [] },
    { "name": "Structure", "score": 0, "badge": "", "badgeType": "", "subChecks": [], "feedbackCards": [] },
    { "name": "Skills", "score": 0, "badge": "", "badgeType": "", "subChecks": [], "feedbackCards": [] }
  ]
}
Fill in ALL 4 sections fully. Return ONLY the JSON.
`;

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  // Retry logic for transient 429/503 errors
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      console.log(`[RESUMIND] Retry attempt ${attempt}, waiting ${attempt * 5}s...`);
      await new Promise((r) => setTimeout(r, attempt * 5000));
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
      }),
    });

    if (response.status === 429 || response.status === 503) {
      lastError = new Error(`API rate limited (${response.status}). Retrying...`);
      console.warn(`[RESUMIND] ${lastError.message}`);
      continue;
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `Gemini API failed with status ${response.status}`;
      console.error("[RESUMIND] API error:", msg);
      throw new Error(msg);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("[RESUMIND] Raw AI response length:", rawText.length);
    console.log("[RESUMIND] AI response preview:", rawText.slice(0, 200));

    const cleaned = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      console.error("[RESUMIND] Could not parse response:", cleaned.slice(0, 500));
      throw new Error("Could not parse AI response as JSON.");
    }
  }

  throw lastError || new Error("Gemini API failed after 3 attempts.");
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
