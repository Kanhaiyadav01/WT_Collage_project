import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { saveUserProfile } from "../utils/firestoreHelpers";
import { useAuth } from "../utils/AuthContext";
import Navbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import GoogleIcon from "../components/GoogleIcon";
import { isValidEmail } from "../utils/helpers";

export default function Login({ showToast }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate("/upload");
    return null;
  }

  function validate() {
    const errs = {};
    if (!email) errs.email = "Email address is required.";
    else if (!isValidEmail(email)) errs.email = "Please enter a valid email address.";
    if (!pass) errs.pass = "Password is required.";
    else if (pass.length < 6) errs.pass = "Password must be at least 6 characters.";
    return errs;
  }

  async function doEmailLogin() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      showToast("✅ Welcome back!");
      setTimeout(() => navigate("/upload"), 600);
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/invalid-credential") {
        setErrors({ submit: "Email or password is incorrect." });
      } else if (error.code === "auth/user-not-found") {
        setErrors({ submit: "No account found with this email." });
      } else {
        setErrors({ submit: error.message });
      }
      showToast("❌ Login failed. Check your credentials.", 3500);
    } finally {
      setLoading(false);
    }
  }

  async function doGoogleLogin() {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user profile to Firestore if first login
      await saveUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      });

      showToast("✅ Welcome back!");
      setTimeout(() => navigate("/upload"), 600);
    } catch (error) {
      console.error("Google login error:", error);
      if (error.code !== "auth/popup-closed-by-user") {
        setErrors({ submit: "Google sign-in failed. Please try again." });
        showToast("❌ Google sign-in failed.", 3500);
      }
    } finally {
      setLoading(false);
    }
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
    opacity: loading ? 0.6 : 1,
    pointerEvents: loading ? "none" : "auto",
  };

  const googleBtnStyle = {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    background: "#1a1a28", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14,
    padding: 11, fontFamily: "'Sora',sans-serif", fontSize: "0.87rem", fontWeight: 600,
    color: "white", cursor: "pointer", transition: "all 0.22s ease",
    opacity: loading ? 0.6 : 1,
    pointerEvents: loading ? "none" : "auto",
  };

  return (
    <div className="relative z-10 min-h-screen" style={{ animation: "pgFade 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
      <Navbar variant="auth" showToast={showToast} />

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
            onClick={doGoogleLogin}>
            <GoogleIcon /> {loading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#4a5070", fontSize: "0.77rem", fontFamily: "'Sora',sans-serif", margin: "18px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Error message */}
          {errors.submit && (
            <div style={{ padding: "10px 12px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, marginBottom: 14, fontSize: "0.82rem", color: "#f87171", fontFamily: "'Sora',sans-serif" }}>
              {errors.submit}
            </div>
          )}

          {/* Form */}
          <FormInput id="loginEmail" label="Email Address" type="email" placeholder="you@example.com"
            value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "", submit: "" })); }}
            error={errors.email} rightIcon="email" />

          <FormInput id="loginPass" label="Password" type="password" placeholder="••••••••"
            value={pass} onChange={(e) => { setPass(e.target.value); setErrors((p) => ({ ...p, pass: "", submit: "" })); }}
            error={errors.pass} />

          {/* Remember + Forgot */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "8px 0 16px", fontSize: "0.81rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#9aa0be", cursor: "pointer" }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: "#4f8ef7", width: 15, height: 15 }} />
              <span>Remember me</span>
            </label>
            <button style={{ background: "none", border: "none", color: "#4f8ef7", fontFamily: "'Sora',sans-serif", fontSize: "0.81rem", fontWeight: 600, cursor: "pointer" }}
              onClick={() => showToast("Password reset feature coming soon.")}>
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button style={authBtnStyle} onClick={doEmailLogin}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.1)"; } }}
            onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.transform = "none"; e.currentTarget.style.filter = "none"; } }}>
            {loading ? "Signing In..." : "Sign In"}
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
