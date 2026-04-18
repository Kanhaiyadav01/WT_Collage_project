import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../utils/AuthContext";
import { getUserAnalyses, deleteAnalysis } from "../utils/firestoreHelpers";
import { getScoreColor, getBadge } from "../utils/helpers";

export default function Dashboard({ showToast }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAnalyses = async () => {
      try {
        setLoading(true);
        const response = await getUserAnalyses(user.uid);
        if (response.success) {
          // Sort by createdAt descending (newest first)
          const sorted = (response.data || []).sort((a, b) => {
            const timeA = a.createdAt?.toDate?.() || new Date(0);
            const timeB = b.createdAt?.toDate?.() || new Date(0);
            return timeB - timeA;
          });
          setAnalyses(sorted);
        } else {
          console.error("Error fetching analyses:", response.error);
        }
      } catch (err) {
        console.error("Error fetching analyses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [user]);

  async function handleDelete(analysisId) {
    if (!window.confirm("Delete this analysis? This action cannot be undone.")) return;

    try {
      const response = await deleteAnalysis(analysisId);
      if (response.success) {
        setAnalyses((prev) => prev.filter((a) => a.id !== analysisId));
        showToast("✅ Analysis deleted.");
      } else {
        showToast("❌ Failed to delete analysis.", 3500);
      }
    } catch (err) {
      console.error("Error deleting analysis:", err);
      showToast("❌ Error deleting analysis.", 3500);
    }
  }

  function formatDate(timestamp) {
    if (!timestamp) return "Recently";
    const date = timestamp.toDate?.() || new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days === 0 && hours === 0) return "Just now";
    if (days === 0) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }

  if (loading) {
    return (
      <div className="relative z-10 min-h-screen" style={{ background: "linear-gradient(135deg, #080810 0%, #0a0a14 100%)" }}>
        <Navbar showToast={showToast} variant="upload" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", animation: "spin 1s linear infinite" }}>⚙️</div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", color: "#9aa0be" }}>Loading analyses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen" style={{ animation: "pgFade 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
      <Navbar showToast={showToast} variant="upload" />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 60px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", paddingTop: 50, paddingBottom: 30 }}>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.7rem,4.5vw,2.6rem)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 10, color: "white" }}>
            Your Resume <span style={{ background: "linear-gradient(135deg, #4f8ef7, #8b5cf6, #e879a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Analysis History</span>
          </h1>
          <p style={{ fontSize: "0.94rem", color: "#9aa0be" }}>
            {analyses.length === 0 ? "No analyses yet. Start by uploading your resume!" : `${analyses.length} analysis${analyses.length !== 1 ? "es" : ""} saved`}
          </p>
        </div>

        {/* Empty State */}
        {analyses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 40px",
              background: "#13131f",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(135deg,#4f8ef7,#8b5cf6,#e879a0)", opacity: 0.45 }} />
            <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>📋</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "white", marginBottom: 8 }}>No analyses yet</h2>
            <p style={{ fontSize: "0.9rem", color: "#9aa0be", marginBottom: 24 }}>Upload your resume and a job description to get detailed feedback.</p>
            <button
              onClick={() => navigate("/upload")}
              style={{
                background: "linear-gradient(135deg,#4f8ef7 0%,#8b5cf6 50%,#e879a0 100%)",
                color: "white",
                border: "none",
                padding: "12px 28px",
                borderRadius: 8,
                fontFamily: "'Sora',sans-serif",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(79,142,247,0.25)",
                transition: "all 0.22s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.filter = "brightness(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "none";
                e.target.style.filter = "none";
              }}
            >
              Start New Analysis →
            </button>
          </div>
        ) : (
          /* Analyses Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((analysis) => {
              const badge = getBadge(analysis.overallScore);
              const color = getScoreColor(analysis.overallScore);

              return (
                <div
                  key={analysis.id}
                  style={{
                    background: "#13131f",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16,
                    padding: 20,
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.22s ease",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(79,142,247,0.28)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(79,142,247,0.1)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(135deg,#4f8ef7,#8b5cf6,#e879a0)", opacity: 0.45 }} />

                  {/* Header */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "white", marginBottom: 4, wordBreak: "break-word" }}>
                          {analysis.resumeName || "Untitled"}
                        </h3>
                        <p style={{ fontSize: "0.75rem", color: "#4a5070" }}>
                          {analysis.jobTitle ? `${analysis.jobTitle} at ${analysis.company}` : "No job info"}
                        </p>
                      </div>
                      <div
                        style={{
                          background: color + "22",
                          color: color,
                          padding: "4px 8px",
                          borderRadius: 4,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {analysis.overallScore}
                      </div>
                    </div>
                  </div>

                  {/* Score Grid */}
                  <div className="grid grid-cols-2 gap-2" style={{ marginBottom: 16 }}>
                    {[
                      { label: "Tone", value: analysis.toneScore },
                      { label: "Content", value: analysis.contentScore },
                      { label: "Structure", value: analysis.structureScore },
                      { label: "Skills", value: analysis.skillsScore },
                    ].map((score) => (
                      <div
                        key={score.label}
                        style={{
                          background: "rgba(79,142,247,0.05)",
                          border: "1px solid rgba(79,142,247,0.12)",
                          borderRadius: 8,
                          padding: "8px 10px",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: "0.72rem", color: "#9aa0be", marginBottom: 3 }}>{score.label}</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: getScoreColor(score.value) }}>
                          {score.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Badge + Date */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 4,
                        background:
                          badge.type === "green"
                            ? "rgba(52,211,153,0.1)"
                            : badge.type === "blue"
                              ? "rgba(79,142,247,0.1)"
                              : badge.type === "orange"
                                ? "rgba(251,191,36,0.1)"
                                : "rgba(248,113,113,0.1)",
                        color:
                          badge.type === "green"
                            ? "#34d399"
                            : badge.type === "blue"
                              ? "#4f8ef7"
                              : badge.type === "orange"
                                ? "#fbbf24"
                                : "#f87171",
                      }}
                    >
                      {badge.label}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#4a5070" }}>{formatDate(analysis.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => navigate("/results")}
                      style={{
                        flex: 1,
                        background: "rgba(79,142,247,0.1)",
                        border: "1px solid rgba(79,142,247,0.2)",
                        color: "#4f8ef7",
                        padding: "8px 12px",
                        borderRadius: 6,
                        fontFamily: "'Sora',sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.22s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(79,142,247,0.15)";
                        e.target.style.borderColor = "rgba(79,142,247,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(79,142,247,0.1)";
                        e.target.style.borderColor = "rgba(79,142,247,0.2)";
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(analysis.id)}
                      style={{
                        flex: 1,
                        background: "rgba(248,113,113,0.08)",
                        border: "1px solid rgba(248,113,113,0.18)",
                        color: "#f87171",
                        padding: "8px 12px",
                        borderRadius: 6,
                        fontFamily: "'Sora',sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.22s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(248,113,113,0.12)";
                        e.target.style.borderColor = "rgba(248,113,113,0.25)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(248,113,113,0.08)";
                        e.target.style.borderColor = "rgba(248,113,113,0.18)";
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* New Analysis Button */}
        {analyses.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button
              onClick={() => navigate("/upload")}
              style={{
                background: "linear-gradient(135deg,#4f8ef7 0%,#8b5cf6 50%,#e879a0 100%)",
                color: "white",
                border: "none",
                padding: "12px 32px",
                borderRadius: 8,
                fontFamily: "'Sora',sans-serif",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(79,142,247,0.25)",
                transition: "all 0.22s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.filter = "brightness(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "none";
                e.target.style.filter = "none";
              }}
            >
              + New Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
