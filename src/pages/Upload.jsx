import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import { getWordCount, getWordCountStatus } from "../utils/helpers";
import { extractPDFText, analyzeWithGemini, generateDemoResult } from "../utils/geminiApi";

export default function Upload({ user, logout, showToast, setAiResult, setFormData }) {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [file, setFile] = useState(null);
  const [dragover, setDragover] = useState(false);
  const [errors, setErrors] = useState({});

  const wordCount = getWordCount(jobDesc);
  const wordStatus = getWordCountStatus(wordCount);

  function processFile(f) {
    if (f.type !== "application/pdf") {
      setErrors((p) => ({ ...p, file: "Only PDF files are accepted." }));
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setErrors((p) => ({ ...p, file: "File is too large. Maximum size is 20 MB." }));
      return;
    }
    setErrors((p) => ({ ...p, file: "" }));
    setFile(f);
    showToast("📄 File ready: " + f.name);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragover(false);
    const f = e.dataTransfer?.files[0];
    if (f) processFile(f);
  }

  function validate() {
    const errs = {};
    if (!company) errs.company = "Company name is required.";
    if (!jobTitle) errs.jobTitle = "Job title is required.";
    if (!jobDesc) errs.jobDesc = "Job description is required.";
    else if (wordCount < 50) errs.jobDesc = `Job description too short (${wordCount} words). Please add at least 50 words.`;
    if (!file) errs.file = "Please upload your resume as a PDF.";
    return errs;
  }

  async function submitForm() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast("⚠️ Please fix the errors before continuing.");
      return;
    }

    // Save form data for results page breadcrumb
    setFormData({ company, jobTitle, jobDesc, file });

    // Go to analyzing page
    navigate("/analyzing");

    // Extract PDF text
    let resumeText = "";
    try { resumeText = await extractPDFText(file); }
    catch { resumeText = "[Could not extract PDF text]"; }

    // Warn if extraction returned very little
    if (resumeText.length < 100 || resumeText.startsWith("Could not") || resumeText.startsWith("Resume text extraction")) {
      console.warn("PDF extraction returned limited text:", resumeText.slice(0, 200));
    }

    // Call Gemini AI
    let result;
    try {
      result = await analyzeWithGemini(resumeText, jobDesc, jobTitle, company);
    } catch (err) {
      console.error("Gemini error:", err);
      showToast("⚠️ AI connection issue. Showing estimated results.", 4000);
      result = generateDemoResult(resumeText, jobDesc, jobTitle, company);
    }

    setAiResult(result);
    setTimeout(() => {
      navigate("/results");
      showToast("✅ Analysis complete!");
    }, 1200);
  }

  const gradBg = "linear-gradient(135deg,#4f8ef7 0%,#8b5cf6 50%,#e879a0 100%)";

  return (
    <div className="relative z-10 min-h-screen" style={{ animation: "pgFade 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
      <Navbar user={user} logout={logout} showToast={showToast} variant="upload" />

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 20px 60px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", paddingTop: 50, paddingBottom: 30 }}>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.7rem,4.5vw,2.6rem)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 10, color: "white" }}>
            Smart feedback for <span className="gradient-text">your dream job</span>
          </h1>
          <p style={{ fontSize: "0.94rem", color: "#9aa0be" }}>Fill in the details below and upload your resume to get started</p>
        </div>

        {/* Card */}
        <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "36px 32px", boxShadow: "0 8px 36px rgba(0,0,0,0.6)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: gradBg, opacity: 0.45 }} />

          {/* AI badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, background: "rgba(79,142,247,0.07)", border: "1px solid rgba(79,142,247,0.18)", borderRadius: 14, padding: "10px 16px", marginBottom: 24, fontFamily: "'Sora',sans-serif", fontSize: "0.81rem", fontWeight: 600, color: "#4f8ef7" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", flexShrink: 0, boxShadow: "0 0 0 3px rgba(52,211,153,0.18)", animation: "blink 1.8s ease infinite" }} />
            Powered by Google Gemini AI — Real-time resume analysis
          </div>

          {/* Company + Job Title row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput id="company" label="Company Name" placeholder="e.g. Google" required
              value={company} onChange={(e) => { setCompany(e.target.value); setErrors((p) => ({ ...p, company: "" })); }}
              error={errors.company} />
            <FormInput id="jobTitle" label="Job Title" placeholder="e.g. Frontend Developer" required
              value={jobTitle} onChange={(e) => { setJobTitle(e.target.value); setErrors((p) => ({ ...p, jobTitle: "" })); }}
              error={errors.jobTitle} />
          </div>

          {/* Job description */}
          <FormInput id="jobDesc" label="Job Description" isTextarea required
            placeholder="Paste the full job description here. Include responsibilities, requirements, and preferred skills for best analysis results..."
            hint={wordStatus.text} hintColor={wordStatus.color}
            value={jobDesc} onChange={(e) => { setJobDesc(e.target.value); setErrors((p) => ({ ...p, jobDesc: "" })); }}
            error={errors.jobDesc} />

          {/* File upload zone */}
          <div style={{ marginBottom: 17 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <label style={{ fontFamily: "'Sora',sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#9aa0be" }}>
                Upload Resume <span style={{ color: "#4f8ef7" }}>*</span>
              </label>
            </div>
            <div
              onClick={() => document.getElementById("resumeFile").click()}
              onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
              onDragLeave={() => setDragover(false)}
              onDrop={handleDrop}
              style={{
                border: `1px dashed ${file ? "rgba(52,211,153,0.45)" : dragover ? "rgba(79,142,247,0.55)" : "rgba(79,142,247,0.28)"}`,
                borderRadius: 14, background: file ? "rgba(52,211,153,0.04)" : dragover ? "rgba(79,142,247,0.07)" : "rgba(79,142,247,0.03)",
                padding: "42px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.22s ease",
              }}
            >
              <input type="file" id="resumeFile" accept=".pdf" style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files[0]; if (f) processFile(f); }} />

              {file ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "'Sora',sans-serif", fontSize: "0.89rem", fontWeight: 700, color: "#34d399" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>{file.name}</span>
                  </div>
                  <p style={{ fontSize: "0.77rem", color: "#4a5070", marginTop: 8 }}>{(file.size / 1024).toFixed(0)} KB · Click to change</p>
                </div>
              ) : (
                <div>
                  <div style={{ width: 58, height: 58, background: "linear-gradient(135deg,#1a1a2a,#22223a)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#4f8ef7", margin: "0 auto 16px", transition: "transform 0.28s" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  </div>
                  <p style={{ fontFamily: "'Sora',sans-serif", fontSize: "0.89rem", color: "white", marginBottom: 4 }}>
                    <strong style={{ color: "#4f8ef7" }}>Click to upload</strong> or drag and drop
                  </p>
                  <p style={{ fontSize: "0.77rem", color: "#4a5070" }}>PDF only · Max 20 MB</p>
                </div>
              )}
            </div>
            {errors.file && <span style={{ display: "block", fontSize: "0.76rem", color: "#f87171", fontFamily: "'Sora',sans-serif", fontWeight: 500, marginTop: 5 }}>{errors.file}</span>}
          </div>

          {/* Analyze button */}
          <button onClick={submitForm}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: 15, background: gradBg, color: "white", border: "none", borderRadius: 14, fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 700, cursor: "pointer", marginTop: 26, transition: "all 0.22s ease", boxShadow: "0 0 24px rgba(79,142,247,0.28)", letterSpacing: "0.2px" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.filter = "none"; }}>
            Analyze Resume
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
