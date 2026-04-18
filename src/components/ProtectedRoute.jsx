import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#080810",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              animation: "spin 1s linear infinite",
            }}
          >
            ⚙️
          </div>
          <p
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "1rem",
              color: "#9aa0be",
            }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
