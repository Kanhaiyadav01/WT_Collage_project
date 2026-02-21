import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBadge, getScoreColor } from "../utils/helpers";

// ── Animated number counter 
function useAnimatedNumber(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [target, duration]);
  return val;
}

// ── Chip 
function Chip({ label, color }) {
  const colorMap = {
    red:    { bg: "rgba(248,113,113,0.07)",  text: "#f87171",  border: "rgba(248,113,113,0.18)" },
    green:  { bg: "rgba(52,211,153,0.07)",   text: "#34d399",  border: "rgba(52,211,153,0.18)" },
    purple: { bg: "rgba(79,142,247,0.08)",   text: "#4f8ef7",  border: "rgba(79,142,247,0.18)" },
    orange: { bg: "rgba(251,191,36,0.07)",   text: "#fbbf24",  border: "rgba(251,191,36,0.18)" },
  };

  const styles = colorMap[color] || colorMap.purple;

  return (
    <span
      style={{
        fontFamily: "'Sora',sans-serif",
        fontSize: "0.73rem",
        fontWeight: 600,
        padding: "4px 11px",
        borderRadius: 50,
        border: `1px solid ${styles.border}`,
        background: styles.bg,
        color: styles.text
      }}
    >
      {label}
    </span>
  );
}

// ── Badge 
function Badge({ label, type }) {
  const styles = {
    green:  { bg: "rgba(52,211,153,0.10)",  text: "#34d399" },
    blue:   { bg: "rgba(79,142,247,0.10)",  text: "#4f8ef7" },
    orange: { bg: "rgba(251,191,36,0.10)",  text: "#fbbf24" },
    red:    { bg: "rgba(248,113,113,0.10)", text: "#f87171" },
  }[type] || {};
  return (
    <span style={{ fontFamily: "'Sora',sans-serif", fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: 50, background: styles.bg, color: styles.text }}>
      {label}
    </span>
  );
}

// ── ScoreBar ─────────────────────────────────────────────────
function ScoreBar({ score }) {
  const barRef = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = score + "%";
    }, 400);
    return () => clearTimeout(t);
  }, [score]);
  return (
    <div style={{ flex: 1, margin: "0 12px", height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden", minWidth: 80 }}>
      <div ref={barRef} style={{ height: "100%", borderRadius: 3, width: "0%", background: getScoreColor(score), transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  );
}

// ── AccordionSection ─────────────────────────────────────────
function AccordionSection({ section }) {
  const [open, setOpen] = useState(false);
  const feedbackBg = { pass: "rgba(52,211,153,0.04)", warn: "rgba(251,191,36,0.04)", fail: "rgba(248,113,113,0.04)" };
  const feedbackBorder = { pass: "rgba(52,211,153,0.14)", warn: "rgba(251,191,36,0.14)", fail: "rgba(248,113,113,0.14)" };
  const feedbackLeft = { pass: "#34d399", warn: "#fbbf24", fail: "#f87171" };

  return (
    <div style={{ marginBottom: 10 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#13131f", border: `1px solid ${open ? "rgba(79,142,247,0.22)" : "rgba(255,255,255,0.06)"}`, borderRadius: open ? "14px 14px 0 0" : 14, padding: "14px 20px", cursor: "pointer", boxShadow: "0 2px 16px rgba(0,0,0,0.5)", transition: "all 0.22s ease" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'Sora',sans-serif", fontSize: "0.92rem", fontWeight: 700, color: "white" }}>{section.name}</span>
          <Badge label={`${section.badge} · ${section.score}/100`} type={section.badgeType} />
        </div>
        <span style={{ fontSize: "0.78rem", color: "#4a5070", transition: "transform 0.26s", transform: open ? "rotate(180deg)" : "none", display: "inline-block" }}>▼</span>
      </div>

      {open && (
        <div style={{ background: "#0f0f1a", border: "1px solid rgba(79,142,247,0.14)", borderTop: "none", borderRadius: "0 0 14px 14px", padding: 20, animation: "bodyOpen 0.24s ease" }}>
          {/* Sub checks grid */}
          {section.subChecks?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" style={{ marginBottom: 16 }}>
              {section.subChecks.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'Sora',sans-serif", fontSize: "0.8rem", fontWeight: 500, color: "#9aa0be" }}>
                  <span>{c.icon}</span><span>{c.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Feedback cards */}
          {section.feedbackCards?.map((card, i) => (
            <div key={i} style={{ borderRadius: 8, padding: "14px 16px", marginBottom: 10, border: `1px solid ${feedbackBorder[card.type]}`, borderLeftWidth: 2, borderLeftColor: feedbackLeft[card.type], background: feedbackBg[card.type] }}>
              <h4 style={{ fontFamily: "'Sora',sans-serif", fontSize: "0.84rem", fontWeight: 700, marginBottom: 7, color: "white", display: "flex", alignItems: "center", gap: 7 }}>{card.title}</h4>
              {card.body && <p style={{ fontSize: "0.8rem", color: "#9aa0be", lineHeight: 1.65 }}>{card.body}</p>}
              {card.bullets?.length > 0 && (
                <ul style={{ paddingLeft: 17, marginTop: 6 }}>
                  {card.bullets.map((b, j) => <li key={j} style={{ fontSize: "0.8rem", color: "#9aa0be", lineHeight: 1.65 }}>{b}</li>)}
                </ul>
              )}
              {card.chips?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {card.chips.map((c, j) => <Chip key={j} label={c} color="purple" />)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Results Page 
export default function Results({ user, logout, showToast, aiResult, formData }) {
  const navigate = useNavigate();
  const result = aiResult;
  const displayScore = useAnimatedNumber(result?.overallScore || 0);
  const gaugeRef = useRef(null);

  useEffect(() => {
    if (!result) return;
    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (result.overallScore / 100) * circumference;
    setTimeout(() => {
      if (gaugeRef.current) gaugeRef.current.style.strokeDashoffset = offset;
    }, 300);
  }, [result]);

  if (!result) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div style={{ textAlign: "center", color: "#9aa0be" }}>
          <p style={{ marginBottom: 16 }}>No results yet. Please upload and analyze your resume first.</p>
          <button onClick={() => navigate("/upload")} style={{ background: "linear-gradient(135deg,#4f8ef7,#8b5cf6,#e879a0)", color: "white", border: "none", padding: "12px 24px", borderRadius: 8, fontFamily: "'Sora',sans-serif", fontWeight: 700, cursor: "pointer" }}>
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  const categories = [
    { name: "Tone & Style", score: result.toneScore },
    { name: "Content",      score: result.contentScore },
    { name: "Structure",    score: result.structureScore },
    { name: "Skills",       score: result.skillsScore },
  ];

  const atsBadgeStyles = {
    good: { bg: "rgba(52,211,153,0.10)", border: "rgba(52,211,153,0.18)", emoji: "✅" },
    warn: { bg: "rgba(251,191,36,0.09)", border: "rgba(251,191,36,0.18)",  emoji: "⚠️" },
    bad:  { bg: "rgba(248,113,113,0.09)", border: "rgba(248,113,113,0.18)", emoji: "❌" },
  }[result.atsBadgeType || "warn"];

  const level = result.overallScore >= 80 ? "strong" : result.overallScore >= 60 ? "decent" : "needs significant improvement";
  const breadcrumbText = formData?.jobTitle ? `${formData.jobTitle} at ${formData.company}` : "Resume Review";

  return (
    <div className="relative z-10 min-h-screen" style={{ animation: "pgFade 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
      <Navbar user={user} logout={logout} showToast={showToast} variant="results" />

      <div style={{ maxWidth: 840, margin: "0 auto", padding: "0 24px 60px" }}>
        {/* Topbar — back + breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "26px 0 18px", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "#13131f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 16px", fontFamily: "'Sora',sans-serif", fontSize: "0.81rem", fontWeight: 600, color: "#9aa0be", cursor: "pointer", transition: "all 0.22s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#4f8ef7"; e.currentTarget.style.borderColor = "rgba(79,142,247,0.28)"; e.currentTarget.style.transform = "translateX(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#9aa0be"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "none"; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to homepage
          </button>
          <div style={{ fontFamily: "'Sora',sans-serif", fontSize: "0.81rem", color: "#4a5070" }}>
            <span>{breadcrumbText}</span>
            <span style={{ margin: "0 6px" }}>›</span>
            <span style={{ color: "#4f8ef7", fontWeight: 600 }}>Resume Review</span>
          </div>
        </div>

        <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 18, color: "white" }}>Resume Review</h1>

        {/* ── Score card ── */}
        <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 26, boxShadow: "0 2px 16px rgba(0,0,0,0.5)", marginBottom: 12, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(135deg,#4f8ef7,#8b5cf6,#e879a0)", opacity: 0.45 }} />

          <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 22, flexWrap: "wrap" }}>
            {/* Gauge */}
            <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
              <svg style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }} viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f2b8c6" />
                    <stop offset="50%" stopColor="#8b7cf8" />
                    <stop offset="100%" stopColor="#a5b4fc" />
                  </linearGradient>
                </defs>
                <circle className="gauge-track" cx="60" cy="60" r="50" />
                <circle ref={gaugeRef} className="gauge-fill" cx="60" cy="60" r="50" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-1px", color: "white", lineHeight: 1 }}>{displayScore}</div>
                <div style={{ fontSize: "0.68rem", color: "#4a5070", marginTop: 1 }}>/100</div>
              </div>
            </div>

            {/* Score details */}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.1rem", fontWeight: 800, marginBottom: 8, color: "white" }}>Your Resume Score</h2>
              <p style={{ fontSize: "0.82rem", color: "#9aa0be", lineHeight: 1.6, marginBottom: 10 }}>
                Your resume shows <strong style={{ color: "white" }}>{level}</strong> alignment with the {formData?.jobTitle || "target"} role. See below for detailed feedback.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(248,113,113,0.07)", color: "#f87171", border: "1px solid rgba(248,113,113,0.14)", borderRadius: 8, padding: "4px 12px", fontFamily: "'Sora',sans-serif", fontSize: "0.76rem", fontWeight: 700 }}>
                <span>⚠</span><span>{result.issueCount || 0} issues found</span>
              </div>
            </div>
          </div>

          {/* Category score bars */}
          <div>
            {categories.map((cat, i) => {
              const badge = getBadge(cat.score);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontSize: "0.87rem", fontWeight: 600, color: "white" }}>{cat.name}</span>
                    <Badge label={badge.label} type={badge.type} />
                  </div>
                  <ScoreBar score={cat.score} />
                  <span style={{ fontFamily: "'Sora',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "white" }}>{cat.score}/100</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ATS Card ── */}
        <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 26, boxShadow: "0 2px 16px rgba(0,0,0,0.5)", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.15rem", flexShrink: 0, background: atsBadgeStyles.bg, border: `1px solid ${atsBadgeStyles.border}` }}>
              {atsBadgeStyles.emoji}
            </div>
            <div>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "0.97rem", fontWeight: 700, marginBottom: 3, color: "white" }}>ATS Score – {result.atsScore}/100</h3>
              <p style={{ fontSize: "0.8rem", color: "#4a5070" }}>How well does your resume pass Applicant Tracking Systems?</p>
            </div>
          </div>

          <p style={{ fontSize: "0.82rem", color: "#9aa0be", marginBottom: 14 }}>Your resume was scanned like an employer would. Here's how it performed:</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {result.atsChecks?.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: "0.82rem", color: "#9aa0be" }}>
                <span style={{ flexShrink: 0, fontSize: "0.93rem", marginTop: 1 }}>{c.icon}</span>
                <span>{c.text}</span>
              </div>
            ))}
          </div>

          {/* Missing keywords */}
          {result.missingKeywords?.length > 0 && (
            <div style={{ marginTop: 13, paddingTop: 13, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <h4 style={{ fontFamily: "'Sora',sans-serif", fontSize: "0.82rem", fontWeight: 700, marginBottom: 8, color: "white" }}>Missing Keywords</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {result.missingKeywords.map((k, i) => <Chip key={i} label={k} color="red" />)}
              </div>
            </div>
          )}

          {/* Suggested keywords */}
          {result.suggestedKeywords?.length > 0 && (
            <div style={{ marginTop: 13, paddingTop: 13, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <h4 style={{ fontFamily: "'Sora',sans-serif", fontSize: "0.82rem", fontWeight: 700, marginBottom: 8, color: "white" }}>Suggested Keywords to Add</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {result.suggestedKeywords.map((k, i) => <Chip key={i} label={k} color="green" />)}
              </div>
            </div>
          )}
        </div>

        {/* ── Accordion sections ── */}
        <div>
          {result.sections?.map((section, i) => (
            <AccordionSection key={i} section={section} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, padding: "22px 28px", marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 800 }}>
          <span style={{ color: "white" }}>RE</span><span className="gradient-text">SUMIND</span>
        </div>
        <div style={{ fontSize: "0.77rem", color: "#4a5070" }}>© 2025 RESUMIND. All rights reserved.</div>
      </footer>
    </div>
  );
}
