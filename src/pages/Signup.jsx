import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import GoogleIcon from "../components/GoogleIcon";
import {
  isValidEmail,
  isStrongPassword,
  isValidName,
  getPasswordStrength,
  capitalize,
} from "../utils/helpers";

export default function Signup({ login, showToast, user, logout }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    pass: "",
    pass2: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const strength = getPasswordStrength(form.pass);

  function update(field, val) {
    setForm((p) => ({ ...p, [field]: val }));
    setErrors((p) => ({ ...p, [field]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.first) errs.first = "First name is required.";
    else if (!isValidName(form.first))
      errs.first = "Enter a valid name (letters only, 2+ chars).";
    if (!form.last) errs.last = "Last name is required.";
    else if (!isValidName(form.last))
      errs.last = "Enter a valid name (letters only, 2+ chars).";
    if (!form.email) errs.email = "Email address is required.";
    else if (!isValidEmail(form.email))
      errs.email = "Please enter a valid email (e.g. you@example.com).";
    if (!form.pass) errs.pass = "Password is required.";
    else if (!isStrongPassword(form.pass))
      errs.pass =
        "Password needs: 8+ chars, uppercase, lowercase, number & special char (!@#$...).";
    if (!form.pass2) errs.pass2 = "Please confirm your password.";
    else if (form.pass !== form.pass2) errs.pass2 = "Passwords do not match.";
    if (!form.terms) errs.terms = "You must agree to the terms to continue.";
    return errs;
  }

  function doSignup() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const fullName = capitalize(form.first) + " " + capitalize(form.last);
    login({
      name: fullName,
      email: form.email,
      avatar: form.first.charAt(0).toUpperCase(),
    });
    showToast(
      "🎉 Account created! Welcome to RESUMIND, " +
        capitalize(form.first) +
        "!",
    );
    setTimeout(() => navigate("/upload"), 1000);
  }

  const cardStyle = {
    width: "100%",
    maxWidth: 440,
    background: "#13131f",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: "42px 40px",
    boxShadow: "0 20px 64px rgba(0,0,0,0.7)",
    position: "relative",
    overflow: "hidden",
  };
  const authBtnStyle = {
    width: "100%",
    padding: 13,
    background: "linear-gradient(135deg,#4f8ef7 0%,#8b5cf6 50%,#e879a0 100%)",
    color: "white",
    border: "none",
    borderRadius: 14,
    fontFamily: "'Sora',sans-serif",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 6,
    transition: "all 0.22s ease",
    boxShadow: "0 0 22px rgba(79,142,247,0.22)",
  };
  const googleBtnStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    background: "#1a1a28",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 11,
    fontFamily: "'Sora',sans-serif",
    fontSize: "0.87rem",
    fontWeight: 600,
    color: "white",
    cursor: "pointer",
    transition: "all 0.22s ease",
  };

  return (
    <div
      className="relative z-10 min-h-screen"
      style={{ animation: "pgFade 0.4s cubic-bezier(0.4,0,0.2,1)" }}
    >
      <Navbar
        user={user}
        logout={logout}
        showToast={showToast}
        variant="auth"
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 60px)",
          padding: "40px 20px 60px",
        }}
      >
        <div style={cardStyle}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: "linear-gradient(135deg,#4f8ef7,#8b5cf6,#e879a0)",
              opacity: 0.55,
            }}
          />

          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: "1.75rem",
                fontWeight: 800,
                letterSpacing: "-0.8px",
                marginBottom: 6,
                color: "white",
              }}
            >
              Create your account
            </h1>
            <p style={{ fontSize: "0.87rem", color: "#9aa0be" }}>
              Free forever. No credit card required.
            </p>
          </div>

          {/* Google */}
          <button
            style={googleBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(79,142,247,0.28)";
              e.currentTarget.style.background = "#1e1e2e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              e.currentTarget.style.background = "#1a1a28";
            }}
            onClick={() =>
              showToast(
                "🔄 Google sign-in coming soon. Use email instead.",
                2800,
              )
            }
          >
            <GoogleIcon /> Sign up with Google
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#4a5070",
              fontSize: "0.77rem",
              fontFamily: "'Sora',sans-serif",
              margin: "18px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(255,255,255,0.06)",
              }}
            />
            <span>or sign up with email</span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(255,255,255,0.06)",
              }}
            />
          </div>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              id="signupFirst"
              label="First Name"
              placeholder="John"
              value={form.first}
              onChange={(e) => update("first", e.target.value)}
              error={errors.first}
            />
            <FormInput
              id="signupLast"
              label="Last Name"
              placeholder="Doe"
              value={form.last}
              onChange={(e) => update("last", e.target.value)}
              error={errors.last}
            />
          </div>

          <FormInput
            id="signupEmail"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors.email}
            rightIcon="email"
          />

          {/* Password with strength meter */}
          <FormInput
            id="signupPass"
            label="Password"
            type="password"
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            value={form.pass}
            onChange={(e) => update("pass", e.target.value)}
            error={errors.pass}
          />
          {form.pass && (
            <div style={{ marginTop: -10, marginBottom: 14 }}>
              <div
                style={{
                  height: 3,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 3,
                  overflow: "hidden",
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: 3,
                    width: `${strength.pct}%`,
                    background: strength.color,
                    transition: "width 0.35s, background 0.35s",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "0.74rem",
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: 600,
                  color: strength.color,
                }}
              >
                {strength.label}
              </div>
            </div>
          )}

          <FormInput
            id="signupPass2"
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            value={form.pass2}
            onChange={(e) => update("pass2", e.target.value)}
            error={errors.pass2}
          />

          {/* Terms */}
          <div style={{ marginBottom: 17 }}>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                fontSize: "0.82rem",
                color: "#9aa0be",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) => {
                  update("terms", e.target.checked);
                }}
                style={{
                  accentColor: "#4f8ef7",
                  width: 15,
                  height: 15,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <span>
                I agree to the{" "}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4f8ef7",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Terms of Services
                </button>{" "}
                and{" "}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4f8ef7",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Privacy Policy
                </button>
              </span>
            </label>
            {errors.terms && (
              <span
                style={{
                  display: "block",
                  fontSize: "0.76rem",
                  color: "#f87171",
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: 500,
                  marginTop: 5,
                }}
              >
                {errors.terms}
              </span>
            )}
          </div>

          <button
            style={authBtnStyle}
            onClick={doSignup}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.filter = "brightness(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.filter = "none";
            }}
          >
            Create Account
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "0.83rem",
              color: "#4a5070",
              marginTop: 20,
            }}
          >
            Already have an account?{" "}
            <button
              style={{
                background: "none",
                border: "none",
                color: "#4f8ef7",
                fontFamily: "'Sora',sans-serif",
                fontSize: "0.83rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => navigate("/login")}
            >
              Sign In →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
