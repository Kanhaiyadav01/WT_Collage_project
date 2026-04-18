import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import Analyzing from "./pages/Analyzing";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import Toast from "./components/Toast";

function BgDecorations() {
  return (
    <>
      <div className="bg-lines" aria-hidden="true" />
      <div className="orb1" aria-hidden="true" />
      <div className="orb2" aria-hidden="true" />
    </>
  );
}

export default function App() {
  const [toast, setToast] = useState({ msg: "", show: false });
  const [aiResult, setAiResult] = useState(null);
  const [formData, setFormData] = useState({});

  let toastTimer;

  function showToast(msg, duration = 3200) {
    setToast({ msg, show: true });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(
      () => setToast({ msg: "", show: false }),
      duration
    );
  }

  const shared = {
    showToast,
    aiResult,
    setAiResult,
    formData,
    setFormData,
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <BgDecorations />
        <Toast msg={toast.msg} show={toast.show} />

        <Routes>
          <Route path="/" element={<Home {...shared} />} />
          <Route path="/login" element={<Login {...shared} />} />
          <Route path="/signup" element={<Signup {...shared} />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload {...shared} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyzing"
            element={
              <ProtectedRoute>
                <Analyzing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results {...shared} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard {...shared} />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Vercel Analytics Added Here */}
        <Analytics />
      </BrowserRouter>
    </AuthProvider>
  );
}