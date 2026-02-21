// Toast notification shown at bottom-right of screen
export default function Toast({ msg, show }) {
  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 22,
        right: 22,
        background: "#13131f",
        border: "1px solid rgba(79,142,247,0.22)",
        color: "white",
        padding: "12px 20px",
        borderRadius: 14,
        fontFamily: "'Sora', sans-serif",
        fontSize: "0.82rem",
        fontWeight: 500,
        boxShadow: "0 20px 64px rgba(0,0,0,0.7), 0 0 20px rgba(79,142,247,0.12)",
        zIndex: 9999,
        maxWidth: 320,
        pointerEvents: "none",
        transform: show ? "translateY(0)" : "translateY(80px)",
        opacity: show ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s",
      }}
    >
      {msg}
    </div>
  );
}
