import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useAuth } from "../utils/AuthContext";
import Logo from "./Logo";

export default function Navbar({ showToast, variant = "home" }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToFeatures() {
    navigate("/");
    setTimeout(() => {
      document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      showToast("👋 Signed out successfully.");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      showToast("❌ Logout failed.", 3500);
    }
  }

  const navbarStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 28px",
    background: scrolled ? "rgba(8,8,16,0.97)" : "rgba(8,8,16,0.82)",
    backdropFilter: "blur(24px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: variant === "auth" ? "relative" : "sticky",
    top: 0,
    zIndex: 100,
    transition: "background 0.22s ease",
    boxShadow: scrolled ? "0 1px 0 rgba(79,142,247,0.1)" : "none",
  };

  const ghostBtn = {
    background: "none",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "7px 16px",
    borderRadius: 8,
    fontFamily: "'Sora', sans-serif",
    fontSize: "0.83rem",
    fontWeight: 600,
    color: "#9aa0be",
    cursor: "pointer",
    transition: "all 0.22s ease",
  };

  const ctaBtn = {
    background: "linear-gradient(135deg, #4f8ef7 0%, #8b5cf6 50%, #e879a0 100%)",
    color: "white",
    border: "none",
    padding: "8px 18px",
    borderRadius: 8,
    fontFamily: "'Sora', sans-serif",
    fontSize: "0.83rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(79,142,247,0.25)",
    transition: "all 0.22s ease",
  };

  return (
    <>
      <nav style={navbarStyle}>
        <Logo />

        {/* Center nav links — only on home variant */}
        {variant === "home" && (
          <div className="hidden md:flex gap-0.5">
            <button
              onClick={scrollToFeatures}
              style={{ background: "none", border: "none", padding: "7px 13px", borderRadius: 8, fontFamily: "'Sora', sans-serif", fontSize: "0.83rem", fontWeight: 500, color: "#9aa0be", cursor: "pointer" }}
            >
              Features
            </button>
            <button
              onClick={scrollToFeatures}
              style={{ background: "none", border: "none", padding: "7px 13px", borderRadius: 8, fontFamily: "'Sora', sans-serif", fontSize: "0.83rem", fontWeight: 500, color: "#9aa0be", cursor: "pointer" }}
            >
              How it works
            </button>
          </div>
        )}

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          {/* Auth variant — show back button */}
          {variant === "auth" && (
            <button style={ghostBtn} onClick={() => navigate(-1)}>← Back</button>
          )}

          {/* Upload page — show user pill or sign in */}
          {variant === "upload" && (
            <>
              {user ? (
                <>
                  <button style={ghostBtn} onClick={() => navigate("/dashboard")}>My Analyses</button>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(79,142,247,0.07)", border: "1px solid rgba(79,142,247,0.16)" }}>
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)" }}>
                      {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.83rem", color: "white" }}>{user.displayName?.split(" ")[0] || user.email?.split("@")[0]}</span>
                    <button style={{ ...ghostBtn, padding: "4px 11px", fontSize: "0.77rem" }} onClick={handleLogout}>Sign Out</button>
                  </div>
                </>
              ) : (
                <button style={ghostBtn} onClick={() => navigate("/login")}>Sign In</button>
              )}
              <button style={ghostBtn} onClick={() => navigate("/")}>← Back</button>
            </>
          )}

          {/* Home variant */}
          {variant === "home" && (
            <>
              {user ? (
                <>
                  <button style={ghostBtn} onClick={() => navigate("/dashboard")}>My Analyses</button>
                  <button style={ghostBtn} onClick={handleLogout}>Sign Out</button>
                </>
              ) : (
                <>
                  <button style={ghostBtn} onClick={() => navigate("/login")}>Sign In</button>
                  <button style={ctaBtn} onClick={() => navigate("/upload")}>Upload Resume</button>
                </>
              )}
            </>
          )}

          {/* Results variant */}
          {variant === "results" && (
            <button style={ctaBtn} onClick={() => navigate("/upload")}>New Analysis</button>
          )}
        </div>

        {/* Hamburger — mobile only */}
        {(variant === "home" || variant === "upload") && (
          <button
            className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span style={{ display: "block", width: 22, height: 2, background: "#9aa0be", borderRadius: 2, transition: "all 0.22s ease", transform: mobileOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#9aa0be", borderRadius: 2, transition: "all 0.22s ease", opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#9aa0be", borderRadius: 2, transition: "all 0.22s ease", transform: mobileOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        )}
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-2 p-4" style={{ background: "rgba(8,8,16,0.98)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)", animation: "slideDown 0.22s ease" }}>
          <button onClick={() => { setMobileOpen(false); scrollToFeatures(); }} style={{ ...ghostBtn, width: "100%", textAlign: "center" }}>Features</button>
          <button onClick={() => { setMobileOpen(false); navigate("/login"); }} style={{ ...ghostBtn, width: "100%", textAlign: "center" }}>Sign In</button>
          <button onClick={() => { setMobileOpen(false); navigate("/upload"); }} style={{ ...ctaBtn, width: "100%", padding: 12, textAlign: "center" }}>Upload Resume</button>
        </div>
      )}
    </>
  );
}
