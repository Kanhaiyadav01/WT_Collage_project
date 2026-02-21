import { useNavigate } from "react-router-dom";

// Reusable logo component used in all navbars
export default function Logo() {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/")}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate("/"); }}
      role="button"
      tabIndex={0}
      className="flex items-center gap-2.5 cursor-pointer select-none hover:opacity-80 transition-opacity"
      style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.15rem", fontWeight: 800 }}
    >
      {/* Icon box with gradient */}
      <div
        className="w-7 h-7 rounded-[7px] flex items-center justify-center text-white text-sm font-black"
        style={{
          background: "linear-gradient(135deg, #4f8ef7 0%, #8b5cf6 50%, #e879a0 100%)",
          fontFamily: "'Courier New', monospace",
        }}
      >
        &gt;
      </div>
      <span className="text-white">RE</span>
      <span className="gradient-text -ml-2">SUMIND</span>
    </div>
  );
}
