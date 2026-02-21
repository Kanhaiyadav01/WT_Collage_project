import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import GoogleIcon from "../components/GoogleIcon";
import { isValidEmail, capitalize } from "../utils/helpers";

export default function Login({ login, showToast, user, logout }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!email) errs.email = "Email address is required.";
    else if (!isValidEmail(email)) errs.email = "Please enter a valid email address.";
    if (!pass) errs.pass = "Password is required.";
    else if (pass.length < 6) errs.pass = "Password must be at least 6 characters.";
    return errs;
  }

  function doLogin() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const name = email.split("@")[0];
    login({ name: capitalize(name), email, avatar: name.charAt(0).toUpperCase() });
    showToast("✅ Welcome back, " + capitalize(name) + "!");
    setTimeout(() => navigate("/upload"), 900);
  }

  const cardStyle = {
    width: "100%", maxWidth: 440,
    background: "#13131f", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20, padding: "42px 40px",
    boxShadow: "0 20px 64px rgba(0,0,0,0.7)", position: "relative", overflow: "hidden",
  };

  const authBtnStyle = {
    width: "100%", padding: 13,
    background: "linear-gradient(135deg,#4f8ef7 0%,#8b5cf6 50%,#e879a0 100%)",
    color: "white", border: "none", borderRadius: 14,
    fontFamily: "'Sora',sans-serif", fontSize: "0.95rem", fontWeight: 700,
    cursor: "pointer", marginTop: 6, transition: "all 0.22s ease",
    boxShadow: "0 0 22px rgba(79,142,247,0.22)",
  };

  const googleBtnStyle = {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    background: "#1a1a28", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14,
    padding: 11, fontFamily: "'Sora',sans-serif", fontSize: "0.87rem", fontWeight: 600,
    color: "white", cursor: "pointer", transition: "all 0.22s ease",
  };

  return (
    <div className="relative z-10 min-h-screen" style={{ animation: "pgFade 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
      <Navbar user={user} logout={logout} showToast={showToast} variant="auth" />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)", padding: "40px 20px 60px" }}>
        <div style={cardStyle}>
          {/* Top gradient line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(135deg,#4f8ef7,#8b5cf6,#e879a0)", opacity: 0.55 }} />

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 6, color: "white" }}>Welcome back</h1>
            <p style={{ fontSize: "0.87rem", color: "#9aa0be" }}>Sign in to your RESUMIND account</p>
          </div>

          {/* Google button */}
          <button style={googleBtnStyle}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(79,142,247,0.28)"; e.currentTarget.style.background = "#1e1e2e"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "#1a1a28"; }}
            onClick={() => showToast("🔄 Google sign-in coming soon. Use email instead.", 2800)}>
            <GoogleIcon /> Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#4a5070", fontSize: "0.77rem", fontFamily: "'Sora',sans-serif", margin: "18px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Form */}
          <FormInput id="loginEmail" label="Email Address" type="email" placeholder="you@example.com"
            value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
            error={errors.email} rightIcon="email" />

          <FormInput id="loginPass" label="Password" type="password" placeholder="••••••••"
            value={pass} onChange={(e) => { setPass(e.target.value); setErrors((p) => ({ ...p, pass: "" })); }}
            error={errors.pass} />

          {/* Remember + Forgot */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "8px 0 16px", fontSize: "0.81rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#9aa0be", cursor: "pointer" }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: "#4f8ef7", width: 15, height: 15 }} />
              <span>Remember me</span>
            </label>
            <button style={{ background: "none", border: "none", color: "#4f8ef7", fontFamily: "'Sora',sans-serif", fontSize: "0.81rem", fontWeight: 600, cursor: "pointer" }}
              onClick={() => showToast("Password reset link sent! Check your email.")}>
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button style={authBtnStyle} onClick={doLogin}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.filter = "none"; }}>
            Sign In
          </button>

          <p style={{ textAlign: "center", fontSize: "0.83rem", color: "#4a5070", marginTop: 20 }}>
            Don't have an account?{" "}
            <button style={{ background: "none", border: "none", color: "#4f8ef7", fontFamily: "'Sora',sans-serif", fontSize: "0.83rem", fontWeight: 600, cursor: "pointer" }} onClick={() => navigate("/signup")}>
              Create one free →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
