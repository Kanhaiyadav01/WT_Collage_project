import { useEffect, useState } from "react";
import Logo from "../components/Logo";

// Each step appears with a delay and animates in
const STEPS = [
  "Parsing resume content",
  "Matching keywords with job description",
  "Generating AI feedback & ATS score",
  "Preparing your personalized report",
];
const DELAYS = [300, 900, 1800, 2600];

export default function Analyzing() {
  const [stepStates, setStepStates] = useState(STEPS.map(() => "pending")); // pending | active | done

  useEffect(() => {
    DELAYS.forEach((delay, i) => {
      setTimeout(() => {
        setStepStates((prev) => {
          const next = [...prev];
          // Mark current as active
          next[i] = "active";
          // Mark previous as done
          if (i > 0) next[i - 1] = "done";
          return next;
        });
      }, delay);
    });
  }, []);

  function stepStyle(state) {
    return {
      display: "flex", alignItems: "center", gap: 12,
      background: "#13131f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14,
      padding: "12px 18px", fontFamily: "'Sora',sans-serif", fontSize: "0.82rem", fontWeight: 500,
      color: state === "done" ? "#34d399" : "#4a5070",
      opacity: state === "pending" ? 0 : 1,
      transform: state === "pending" ? "translateX(-16px)" : "translateX(0)",
      transition: "all 0.5s ease",
    };
  }

  function dotStyle(state) {
    const base = { width: 9, height: 9, borderRadius: "50%", flexShrink: 0, transition: "all 0.4s" };
    if (state === "pending") return { ...base, background: "rgba(255,255,255,0.08)" };
    if (state === "active")  return { ...base, background: "#4f8ef7", boxShadow: "0 0 0 3px rgba(79,142,247,0.22)", animation: "blink 0.9s ease infinite" };
    return { ...base, background: "#34d399" };
  }

  return (
    <div className="relative z-10 min-h-screen" style={{ animation: "pgFade 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
      {/* Simple nav — no links needed on analyzing page */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 28px", background: "rgba(8,8,16,0.82)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
        <Logo />
      </nav>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: 500 }}>
          {/* Pulse ring */}
          <div style={{ width: 100, height: 100, background: "rgba(79,142,247,0.07)", border: "1px solid rgba(79,142,247,0.18)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", position: "relative", animation: "pulseOut 2s ease-in-out infinite" }}>
            {/* Outer ring */}
            <div style={{ position: "absolute", inset: -14, border: "1px solid rgba(79,142,247,0.1)", borderRadius: "50%", animation: "pulseOut 2s ease-in-out infinite", animationDelay: "0.5s" }} />
            {/* Inner gradient circle */}
            <div style={{ width: 66, height: 66, background: "linear-gradient(135deg,#4f8ef7,#8b5cf6,#e879a0)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
          </div>

          {/* Title with ellipsis animation */}
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,4vw,2.6rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 14, color: "white" }}>
            Analyzing your resume<span className="ellipsis" />
          </h1>
          <p style={{ fontSize: "0.94rem", color: "#9aa0be", marginBottom: 40 }}>
            Our AI is carefully reviewing your resume against the job description
          </p>

          {/* Progress steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 360, margin: "0 auto", textAlign: "left" }}>
            {STEPS.map((label, i) => (
              <div key={i} style={stepStyle(stepStates[i])}>
                <div style={dotStyle(stepStates[i])} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
