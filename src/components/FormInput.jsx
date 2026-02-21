import { useState } from "react";

// Reusable input with error/success state, optional icon, and password toggle
export default function FormInput({
  id, label, type = "text", placeholder, value, onChange,
  error, hint, hintColor, required, rightIcon, isTextarea,
}) {
  const [showPass, setShowPass] = useState(false);
  const inputType = type === "password" ? (showPass ? "text" : "password") : type;

  const baseStyle = {
    width: "100%",
    padding: isTextarea ? "12px 14px" : "11px 40px 11px 14px",
    background: "#1a1a28",
    border: `1px solid ${error ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.06)"}`,
    borderRadius: 14,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.89rem",
    color: "white",
    outline: "none",
    resize: isTextarea ? "vertical" : "none",
    minHeight: isTextarea ? 130 : "auto",
    boxShadow: error ? "0 0 0 3px rgba(248,113,113,0.09)" : "none",
    transition: "all 0.22s ease",
  };

  return (
    <div style={{ marginBottom: 17 }}>
      {/* Label row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
        <label htmlFor={id} style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#9aa0be" }}>
          {label} {required && <span style={{ color: "#4f8ef7" }}>*</span>}
        </label>
        {hint && (
          <span style={{ fontSize: "0.73rem", color: hintColor || "#4a5070", fontFamily: "'DM Sans', sans-serif" }}>
            {hint}
          </span>
        )}
      </div>

      {/* Input wrapper */}
      <div style={{ position: "relative" }}>
        {isTextarea ? (
          <textarea
            id={id} value={value} onChange={onChange}
            placeholder={placeholder} rows={6}
            style={baseStyle}
            onFocus={(e) => { e.target.style.borderColor = "rgba(79,142,247,0.45)"; e.target.style.boxShadow = "0 0 0 3px rgba(79,142,247,0.11)"; }}
            onBlur={(e) => { e.target.style.borderColor = error ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.06)"; e.target.style.boxShadow = error ? "0 0 0 3px rgba(248,113,113,0.09)" : "none"; }}
          />
        ) : (
          <input
            id={id} type={inputType} value={value} onChange={onChange}
            placeholder={placeholder} autoComplete={type === "email" ? "email" : type === "password" ? "current-password" : "off"}
            style={baseStyle}
            onFocus={(e) => { e.target.style.borderColor = "rgba(79,142,247,0.45)"; e.target.style.boxShadow = "0 0 0 3px rgba(79,142,247,0.11)"; }}
            onBlur={(e) => { e.target.style.borderColor = error ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.06)"; e.target.style.boxShadow = error ? "0 0 0 3px rgba(248,113,113,0.09)" : "none"; }}
          />
        )}

        {/* Email icon */}
        {rightIcon === "email" && (
          <div style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", color: "#4a5070", pointerEvents: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          </div>
        )}

        {/* Password toggle */}
        {type === "password" && (
          <button
            type="button" onClick={() => setShowPass(!showPass)}
            style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#4a5070", padding: 4, borderRadius: 5 }}
          >
            {showPass ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            )}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <span style={{ display: "block", fontSize: "0.76rem", color: "#f87171", fontFamily: "'Sora', sans-serif", fontWeight: 500, marginTop: 5 }}>
          {error}
        </span>
      )}
    </div>
  );
}
