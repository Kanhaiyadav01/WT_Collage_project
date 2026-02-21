import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// ── Stat counter hook ────────────────────────────────────────
function useCounter(target, duration = 1400) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const steps = 50;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + increment, target);
      setVal(Math.round(current));
      if (current >= target) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target, duration]);
  return val;
}

// ── StatItem ─────────────────────────────────────────────────
function StatItem({ target, suffix, label }) {
  const val = useCounter(target);
  return (
    <div className="flex-1 text-center px-4">
      <div>
        <span
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: "2.4rem",
            fontWeight: 900,
            letterSpacing: "-1.5px",
            background: "linear-gradient(135deg,#4f8ef7,#8b5cf6,#e879a0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {val}
        </span>
        <span
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#4f8ef7",
            opacity: 0.65,
          }}
        >
          {suffix}
        </span>
      </div>
      <div
        style={{
          fontSize: "0.79rem",
          color: "#4a5070",
          marginTop: 4,
          fontFamily: "'Sora',sans-serif",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ── FeatureCard ──────────────────────────────────────────────
function FeatureCard({ icon, title, desc, gradClass }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#13131f",
        border: `1px solid ${hovered ? "rgba(79,142,247,0.28)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20,
        padding: "28px 24px",
        boxShadow: hovered
          ? "0 8px 36px rgba(0,0,0,0.6), 0 0 30px rgba(79,142,247,0.1)"
          : "0 2px 16px rgba(0,0,0,0.5)",
        transition: "all 0.22s ease",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        transform: hovered ? "translateY(-5px)" : "none",
      }}
    >
      {/* Soft gradient overlay on hover */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg,rgba(79,142,247,0.12),rgba(139,92,246,0.08))",
            borderRadius: "inherit",
            pointerEvents: "none",
          }}
        />
      )}
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative z-10`}
        style={{
          background: gradClass,
          transform: hovered ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.28s",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: "'Sora',sans-serif",
          fontSize: "0.98rem",
          fontWeight: 700,
          marginBottom: 10,
          color: "white",
          position: "relative",
          zIndex: 1,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "0.85rem",
          color: "#9aa0be",
          lineHeight: 1.65,
          position: "relative",
          zIndex: 1,
        }}
      >
        {desc}
      </p>
      <div
        style={{
          fontFamily: "'Sora',sans-serif",
          fontSize: "0.81rem",
          fontWeight: 600,
          color: "#4f8ef7",
          marginTop: 14,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-6px)",
          transition: "all 0.22s ease",
          position: "relative",
          zIndex: 1,
        }}
      >
        Learn more →
      </div>
    </div>
  );
}

// ── Home Page ────────────────────────────────────────────────
export default function Home({ user, logout, showToast }) {
  const navigate = useNavigate();

  const grad = "linear-gradient(135deg, #4f8ef7 0%, #8b5cf6 50%, #e879a0 100%)";
  const ghostBtn = {
    background: "none",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "14px 32px",
    borderRadius: 8,
    fontFamily: "'Sora',sans-serif",
    fontSize: "0.96rem",
    fontWeight: 600,
    color: "white",
    cursor: "pointer",
    transition: "all 0.22s ease",
  };
  const primaryBtn = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: grad,
    color: "white",
    border: "none",
    padding: "14px 32px",
    borderRadius: 8,
    fontFamily: "'Sora',sans-serif",
    fontSize: "0.96rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 0 22px rgba(79,142,247,0.25)",
    transition: "all 0.22s ease",
  };

  return (
    <div
      className="relative z-10 min-h-screen animate-[pgFade_0.4s_ease]"
      style={{ animation: "pgFade 0.4s cubic-bezier(0.4,0,0.2,1)" }}
    >
      <Navbar
        user={user}
        logout={logout}
        showToast={showToast}
        variant="home"
      />

      {/* ── Hero ── */}
      <section
        className="text-center mx-auto max-w-4xl px-5"
        style={{ paddingTop: 100, paddingBottom: 60 }}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 animate-fadeUp delay-100"
          style={{
            background: "rgba(79,142,247,0.09)",
            border: "1px solid rgba(79,142,247,0.22)",
            fontFamily: "'Sora',sans-serif",
            fontSize: "0.77rem",
            fontWeight: 700,
            color: "#4f8ef7",
            letterSpacing: "0.4px",
          }}
        >
          <span
            className="w-2 h-2 rounded-full bg-green-400 animate-blink"
            style={{ animation: "blink 1.8s ease infinite" }}
          />
          AI-Powered Resume Analysis
        </div>

        {/* Title */}
        <h1
          className="animate-fadeUp delay-200"
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: "clamp(2.6rem,7.5vw,5.2rem)",
            fontWeight: 900,
            lineHeight: 1.07,
            letterSpacing: "-3px",
            color: "white",
            marginBottom: 24,
            animation: "fadeUp 0.6s ease 0.2s both",
          }}
        >
          Smart feedback for
          <br />
          <span className="gradient-text">your dream job</span>
        </h1>

        {/* Sub */}
        <p
          className="animate-fadeUp delay-300"
          style={{
            fontSize: "1.1rem",
            color: "#9aa0be",
            maxWidth: 520,
            margin: "0 auto 40px",
            lineHeight: 1.8,
            animation: "fadeUp 0.6s ease 0.3s both",
          }}
        >
          Drop your resume — get an ATS score, missing keywords, and AI-powered
          suggestions in under 30 seconds.
        </p>

        {/* Action buttons */}
        <div
          className="flex gap-3.5 justify-center flex-wrap animate-fadeUp delay-400"
          style={{ animation: "fadeUp 0.6s ease 0.4s both" }}
        >
          <button
            style={primaryBtn}
            onClick={() => navigate("/upload")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.filter = "brightness(1.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.filter = "none";
            }}
          >
            <span>Analyze My Resume</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button
            style={ghostBtn}
            onClick={() => navigate("/login")}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(79,142,247,0.35)";
              e.currentTarget.style.color = "#4f8ef7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "white";
            }}
          >
            Sign In Free
          </button>
        </div>

        {/* Trust row */}
        <div
          className="flex items-center justify-center gap-3 mt-8"
          style={{ animation: "fadeUp 0.6s ease 0.5s both" }}
        >
          <div className="flex">
            {["J", "M", "A", "R"].map((letter, i) => (
              <div
                key={i}
                style={{
                  width: 32,
                  height: 32,
                  background: "linear-gradient(135deg,#4f8ef7,#8b5cf6,#e879a0)",
                  borderRadius: "50%",
                  border: "2px solid #080810",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontFamily: "'Sora',sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  marginLeft: i === 0 ? 0 : -8,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
          <span
            style={{
              fontSize: "0.83rem",
              color: "#9aa0be",
              fontFamily: "'Sora',sans-serif",
            }}
          >
            Trusted by <strong style={{ color: "white" }}>50,000+</strong> job
            seekers
          </span>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#13131f",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20,
          padding: "28px 20px",
          margin: "14px 24px",
          boxShadow: "0 8px 36px rgba(0,0,0,0.6)",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <StatItem target={94} suffix="%" label="ATS Pass Rate" />
        <div
          style={{
            width: 1,
            height: 44,
            background: "rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
          className="hidden sm:block"
        />
        <StatItem target={50} suffix="K+" label="Resumes Analyzed" />
        <div
          style={{
            width: 1,
            height: 44,
            background: "rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
          className="hidden sm:block"
        />
        <StatItem target={3} suffix="×" label="More Interviews" />
        <div
          style={{
            width: 1,
            height: 44,
            background: "rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
          className="hidden sm:block"
        />
        <StatItem target={30} suffix="s" label="Analysis Time" />
      </div>

      {/* ── Features ── */}
      <section className="max-w-[900px] mx-auto px-6 py-12" id="features">
        <div
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: "0.71rem",
            fontWeight: 700,
            letterSpacing: 2,
            color: "#4f8ef7",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          WHAT YOU GET
        </div>
        <h2
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: "clamp(1.6rem,4vw,2.4rem)",
            fontWeight: 800,
            letterSpacing: "-1px",
            lineHeight: 1.2,
            marginBottom: 34,
            color: "white",
          }}
        >
          Everything you need to
          <br />
          land that interview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <FeatureCard
            gradClass="linear-gradient(135deg,#4f8ef7,#8b5cf6)"
            title="ATS Score"
            desc="See exactly how your resume scores against Applicant Tracking Systems used by top companies like Google, Meta, and Amazon."
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            }
          />
          <FeatureCard
            gradClass="linear-gradient(135deg,#3b82f6,#06b6d4)"
            title="Keyword Gap Analysis"
            desc="Find every missing keyword from the job description and get smart, context-aware suggestions to add them naturally."
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M15 7h3a5 5 0 0 1 0 10h-3m-6 0H6a5 5 0 0 1 0-10h3" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            }
          />
          <FeatureCard
            gradClass="linear-gradient(135deg,#8b5cf6,#e879a0)"
            title="AI Feedback"
            desc="Receive deep, actionable feedback on tone, content structure, and skills — powered by Google Gemini AI."
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            }
          />
          <FeatureCard
            gradClass="linear-gradient(135deg,#34d399,#059669)"
            title="Real-time Analysis"
            desc="Get your complete resume review in under 30 seconds. No waiting, no queues — instant results every time."
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <div
        style={{
          maxWidth: 900,
          margin: "28px 24px",
          padding: "38px 42px",
          background: "#13131f",
          border: "1px solid rgba(79,142,247,0.18)",
          borderRadius: 20,
          boxShadow:
            "0 8px 36px rgba(0,0,0,0.6), 0 0 50px rgba(79,142,247,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg,rgba(79,142,247,0.05),rgba(139,92,246,0.05))",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "linear-gradient(135deg,#4f8ef7,#8b5cf6,#e879a0)",
            opacity: 0.45,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.5px",
              marginBottom: 6,
            }}
          >
            Ready to land your dream job?
          </h2>
          <p style={{ fontSize: "0.89rem", color: "#9aa0be" }}>
            Join 50,000+ professionals who improved their resume with RESUMIND
          </p>
        </div>
        <button
          style={{
            ...primaryBtn,
            position: "relative",
            zIndex: 1,
            flexShrink: 0,
          }}
          onClick={() => navigate("/upload")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.filter = "brightness(1.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.filter = "none";
          }}
        >
          Get Started Free
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Footer ── */}
      <footer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
          padding: "22px 28px",
          marginTop: 40,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: "1rem",
            fontWeight: 800,
          }}
        >
          <span style={{ color: "white" }}>RE</span>
          <span className="gradient-text">SUMIND</span>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {["Privacy Policy", "Terms of Service", "Contact"].map((link) => (
            <button
              key={link}
              style={{
                fontSize: "0.81rem",
                color: "#4a5070",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Sora',sans-serif",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.target.style.color = "#4f8ef7")}
              onMouseLeave={(e) => (e.target.style.color = "#4a5070")}
            >
              {link}
            </button>
          ))}
        </div>
        <div style={{ fontSize: "0.77rem", color: "#4a5070" }}>
          © 2025 RESUMIND. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
