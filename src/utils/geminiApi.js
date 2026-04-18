import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

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

// ── Helper: Extract Keywords from Text ──
function extractKeywords(text) {
  if (!text) return [];
  const words = text.toLowerCase().match(/\b[a-z]+(?:\s[a-z]+)?\b/g) || [];
  const keywords = [...new Set(words)].filter(w => w.length > 3);
  return keywords.slice(0, 30);
}

// ── Helper: Calculate Keyword Match Percentage ──
function calculateKeywordMatch(resumeText, jobDesc) {
  const resumeKeywords = new Set(extractKeywords(resumeText).map(k => k.toLowerCase()));
  const jobKeywords = extractKeywords(jobDesc).map(k => k.toLowerCase());
  
  if (jobKeywords.length === 0) return 0;
  
  const matches = jobKeywords.filter(k => resumeKeywords.has(k)).length;
  return Math.round((matches / jobKeywords.length) * 100);
}

// ── Gemini AI Analysis (IMPROVED - FIXES SAME OUTPUT BUG) ──
export async function analyzeWithGemini(resumeText, jobDesc, jobTitle, company) {
  console.log("[RESUMIND] Extracted resume text length:", resumeText.length);
  console.log("[RESUMIND] Job description length:", jobDesc.length);
  console.log("[RESUMIND] Resume preview:", resumeText.slice(0, 200));
  console.log("[RESUMIND] JD preview:", jobDesc.slice(0, 200));

  // Calculate keyword match percentage (for scoring reference)
  const keywordMatchPct = calculateKeywordMatch(resumeText, jobDesc);
  console.log("[RESUMIND] Keyword match %:", keywordMatchPct);

  const prompt = `You are an expert ATS (Applicant Tracking System) analyst, career coach, and technical interviewer.

YOUR TASK: Analyze the provided RESUME against the provided JOB DESCRIPTION and return a detailed JSON report.

CRITICAL INSTRUCTIONS:
1. EVERY score MUST be dynamically calculated based on the actual resume and job description provided.
2. DO NOT generate generic or template responses.
3. DO NOT return identical outputs for different resumes.
4. Base every statement on SPECIFIC content from the resume and job description.
5. Reference actual skills, projects, and experiences from the resume.
6. Compare resume content directly against job requirements.

---

JOB CONTEXT:
Title: ${jobTitle}
Company: ${company}

RESUME:
${resumeText.slice(0, 4000)}

JOB DESCRIPTION:
${jobDesc.slice(0, 3000)}

---

ANALYSIS REQUIREMENTS:

A. TONE & STYLE SECTION:
- Evaluate resume's professional tone, clarity, and writing quality
- Check for action verbs, active vs passive voice
- Rate clarity and conciseness (0-100)
- Identify 2-3 specific tone issues from the actual resume

B. CONTENT SECTION:
- Evaluate achievement quantification (numbers, metrics, percentages)
- Check if accomplishments are specific vs generic
- Rate relevance of projects to the ${jobTitle} role (0-100)
- Identify missing quantifiable achievements

C. STRUCTURE SECTION:
- Evaluate section organization and clarity
- Check for reverse chronological order in experience
- Rate formatting consistency (0-100)
- Check if contact info and key sections are present

D. SKILLS SECTION:
- Extract technical skills from the resume
- Compare against required skills in the job description
- Calculate skill match percentage
- Identify critical missing skills from the JD
- Rate skills alignment (0-100)

E. INTERVIEW QUESTIONS:
Generate 7 interview questions (2 easy, 3 medium, 2 hard):
- Base questions on actual projects and experiences in the resume
- Base some questions on specific requirements in the job description
- Mix of technical and behavioral questions
- Format: { "question": "...", "difficulty": "easy|medium|hard", "type": "technical|behavioral", "basedOn": "Resume Project Name|JD Requirement" }

---

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:

{
  "overallScore": <CALCULATE: average of (toneScore + contentScore + structureScore + skillsScore) / 4, adjusted for relevance to JD>,
  "toneScore": <0-100: based on actual tone analysis>,
  "contentScore": <0-100: based on achievement specificity and quantification>,
  "structureScore": <0-100: based on organization and completeness>,
  "skillsScore": <0-100: based on skill match with JD>,
  "atsScore": <0-100: overall ATS friendliness>,
  "issueCount": <actual number of issues identified>,
  "atsBadgeType": "<good|warn|bad>",
  "atsChecks": [
    { "icon": "✅|⚠️|❌", "text": "<specific finding from THIS resume>" },
    { "icon": "✅|⚠️|❌", "text": "<specific finding from THIS resume>" },
    { "icon": "✅|⚠️|❌", "text": "<specific finding from THIS resume>" },
    { "icon": "✅|⚠️|❌", "text": "<specific finding from THIS resume>" },
    { "icon": "✅|⚠️|❌", "text": "<specific finding from THIS resume>" }
  ],
  "missingKeywords": ["<keywords in JD but NOT in resume>", "<keyword>", "<keyword>"],
  "suggestedKeywords": ["<skills relevant to ${jobTitle}>", "<skill>", "<skill>"],
  "sections": [
    {
      "name": "Tone & Style",
      "score": <0-100>,
      "badge": "<Excellent|Strong|Good Start|Needs Work>",
      "badgeType": "<green|blue|orange|red>",
      "subChecks": [
        { "icon": "✅|⚠️", "label": "<specific check from actual resume>" },
        { "icon": "✅|⚠️", "label": "<specific check from actual resume>" }
      ],
      "feedbackCards": [
        {
          "type": "<pass|warn|fail>",
          "title": "<emoji> <title>",
          "body": "<SPECIFIC feedback referencing actual resume content>",
          "bullets": ["<actionable advice>", "<actionable advice>"],
          "chips": ["<relevant tag>"]
        }
      ]
    },
    {
      "name": "Content",
      "score": <0-100: rate achievement specificity>,
      "badge": "<Excellent|Strong|Good Start|Needs Work>",
      "badgeType": "<green|blue|orange|red>",
      "subChecks": [
        { "icon": "✅|⚠️", "label": "<specific check>" },
        { "icon": "✅|⚠️", "label": "<specific check>" }
      ],
      "feedbackCards": [
        {
          "type": "<pass|warn|fail>",
          "title": "<emoji> <title>",
          "body": "<SPECIFIC feedback with examples from actual resume>",
          "bullets": ["<actionable advice>"],
          "chips": []
        }
      ]
    },
    {
      "name": "Structure",
      "score": <0-100: rate organization>,
      "badge": "<Excellent|Strong|Good Start|Needs Work>",
      "badgeType": "<green|blue|orange|red>",
      "subChecks": [
        { "icon": "✅|⚠️", "label": "<specific check>" },
        { "icon": "✅|⚠️", "label": "<specific check>" }
      ],
      "feedbackCards": [
        {
          "type": "<pass|warn|fail>",
          "title": "<emoji> <title>",
          "body": "<SPECIFIC feedback about this resume's structure>",
          "bullets": ["<actionable advice>"],
          "chips": []
        }
      ]
    },
    {
      "name": "Skills",
      "score": <0-100: rate skill match with JD>,
      "badge": "<Excellent|Strong|Good Start|Needs Work>",
      "badgeType": "<green|blue|orange|red>",
      "subChecks": [
        { "icon": "✅|⚠️", "label": "<specific skill check>" },
        { "icon": "✅|⚠️", "label": "<specific skill check>" }
      ],
      "feedbackCards": [
        {
          "type": "<pass|warn|fail>",
          "title": "<emoji> <title>",
          "body": "<SPECIFIC feedback about skill gaps vs JD requirements>",
          "bullets": ["<missing skill from JD>", "<missing skill from JD>"],
          "chips": ["<skill tag>", "<skill tag>"]
        }
      ]
    }
  ],
  "interviewQuestions": [
    {
      "question": "<Question based on actual resume content or JD requirement>",
      "difficulty": "easy|medium|hard",
      "type": "technical|behavioral",
      "basedOn": "<Resume: Project Name OR JD: Requirement Name>"
    }
  ]
}

IMPORTANT: Return ONLY the JSON object, no markdown, no explanation.`;

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

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
        generationConfig: { 
          temperature: 0.8,  // INCREASED from 0.4 to 0.8 for variation
          maxOutputTokens: 6000  // Increased for full response
        },
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
    console.log("[RESUMIND] AI response preview:", rawText.slice(0, 300));

    const cleaned = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    try {
      const result = JSON.parse(cleaned);
      console.log("[RESUMIND] Analysis parsed successfully");
      return result;
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          const result = JSON.parse(match[0]);
          console.log("[RESUMIND] Analysis parsed from matched JSON");
          return result;
        } catch (innerErr) {
          console.error("[RESUMIND] Could not parse matched JSON:", innerErr);
        }
      }
      console.error("[RESUMIND] Could not parse response:", cleaned.slice(0, 500));
      throw new Error("Could not parse AI response as JSON.");
    }
  }

  throw lastError || new Error("Gemini API failed after 3 attempts.");
}


