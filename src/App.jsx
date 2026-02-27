import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import Analyzing from "./pages/Analyzing";
import Results from "./pages/Results";
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
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("resumind_user"));
    } catch {
      return null;
    }
  });
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

  function login(userObj) {
    setUser(userObj);
    try {
      sessionStorage.setItem("resumind_user", JSON.stringify(userObj));
    } catch {}
  }

  function logout() {
    setUser(null);
    try {
      sessionStorage.removeItem("resumind_user");
    } catch {}
  }

  const shared = {
    user,
    login,
    logout,
    showToast,
    aiResult,
    setAiResult,
    formData,
    setFormData,
  };

  return (
    <BrowserRouter>
      <BgDecorations />
      <Toast msg={toast.msg} show={toast.show} />

      <Routes>
        <Route path="/" element={<Home {...shared} />} />
        <Route path="/login" element={<Login {...shared} />} />
        <Route path="/signup" element={<Signup {...shared} />} />
        <Route path="/upload" element={<Upload {...shared} />} />
        <Route path="/analyzing" element={<Analyzing />} />
        <Route path="/results" element={<Results {...shared} />} />
      </Routes>

      {/* Vercel Analytics Added Here */}
      <Analytics />
    </BrowserRouter>
  );
}